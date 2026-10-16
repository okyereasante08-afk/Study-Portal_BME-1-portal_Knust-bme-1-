#!/usr/bin/env python3
"""
Rebuild app/lib/timetables.ts from the department's timetable spreadsheet (.ods).

    python3 scripts/build_timetables.py data/timetable-2026-27-sem1.ods

The spreadsheet has one sheet per year ("First Year" … "Fourth Year"): rows are hourly
slots, columns are Mon-Fri, and each cell holds  course / venue / lecturer  as separate
paragraphs. A class that runs two hours appears in two consecutive rows; this script merges
those into one session. Standard library only (no pip installs).
"""
import re, sys, json, zipfile, xml.etree.ElementTree as ET
from collections import OrderedDict

NS_T = "{urn:oasis:names:tc:opendocument:xmlns:table:1.0}"
NS_X = "{urn:oasis:names:tc:opendocument:xmlns:text:1.0}"
SHEETS = {1: "First Year", 2: "Second Year", 3: "Third Year", 4: "Fourth Year"}
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
CODE = re.compile(r"^([A-Z]{2,5})\s?(\d{3})\b\s*(.*)$")
TIME = re.compile(r"^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$")


def read_sheets(path):
    root = ET.fromstring(zipfile.ZipFile(path).read("content.xml"))
    out = {}
    for tb in root.iter(NS_T + "table"):
        rows = []
        for tr in tb.iter(NS_T + "table-row"):
            cells = []
            for c in tr:
                if c.tag not in (NS_T + "table-cell", NS_T + "covered-table-cell"):
                    continue
                paras = [("".join(p.itertext())).strip() for p in c.findall(NS_X + "p")]
                for _ in range(min(int(c.get(NS_T + "number-columns-repeated", "1")), 8)):
                    cells.append([p for p in paras if p])
            for _ in range(min(int(tr.get(NS_T + "number-rows-repeated", "1")), 3)):
                rows.append(cells)
        out[tb.get(NS_T + "name")] = rows
    return out


def is_name(p):
    return bool(re.match(r"^[A-Z]\.", p)) or p.startswith("Prince") or p.startswith("All Staff")


def clean_venue(parts):
    toks = " ".join(parts).split()
    dedup = [t for i, t in enumerate(toks) if i == 0 or t != toks[i - 1]]
    if len(dedup) > 1:
        dedup = [t for t in dedup if t != "PROJECT"]
    v = " ".join(dedup)
    if v == "PROJECT":
        return "Project work"
    return {"ENG AUDIT": "Eng. Audit"}.get(v, v)


def clean_lecturer(parts):
    s = ""
    for p in parts:
        lone_surname = bool(re.fullmatch(r"[A-Z]{3,}", p))      # e.g. "ASAMOAH" on its own line
        if s.endswith("-"): s = s + p
        elif s and lone_surname: s = s + "/" + p
        else: s = s + " " + p if s else p
    s = s.replace("*", "")
    s = re.sub(r"\bAll Staff All\b", "All Staff", s)
    s = re.sub(r"(?<=\.)(?=[A-Z])", " ", s)                       # G.S. -> G. S.
    s = re.sub(r"\s*/\s*", " / ", s)
    s = re.sub(r"(?<=\. )([A-Z])(?= [A-Z][a-z])", r"\1.", s)       # "D. A Addo" -> "D. A. Addo"
    s = re.sub(r"\b([A-Z])([A-Z]{2,})\b", lambda m: m.group(1) + m.group(2).lower(), s)  # EGHAN -> Eghan
    return re.sub(r"\s+", " ", s).strip()


def parse_cell(paras):
    if not paras:
        return None
    m = CODE.match(paras[0])
    if not m:
        return {"fragment": True}
    rest = paras[1:]
    i = 0
    while i < len(rest) and not is_name(rest[i]):
        i += 1
    group = m.group(3).strip()
    venue_parts = rest[:i]
    if group.startswith("/"):                      # "ECON 151/ACF" + "ENG"  ->  venue "ACF ENG"
        venue_parts = [group.lstrip("/ ")] + venue_parts
        group = ""
    return {"code": f"{m.group(1)} {m.group(2)}", "group": group,
            "venue": clean_venue(venue_parts), "lecturer": clean_lecturer(rest[i:])}


def mins(h, m): return int(h) * 60 + int(m)
def hhmm(t): return f"{int(t[0]):02d}:{t[1]}"


def build_year(rows):
    slots = []
    for r in rows[2:]:
        m = TIME.match(r[0][0]) if r and r[0] else None
        if m:
            slots.append((m.groups(), r))
    sessions = []
    for d, day in enumerate(DAYS):
        cur = None
        for (a, b, c, e), r in slots:
            cell = parse_cell(r[d + 1]) if len(r) > d + 1 else None
            start, end = (a, b), (c, e)
            if cell is None:
                if cur: sessions.append(cur); cur = None
                continue
            contiguous = cur is not None and mins(*start) - mins(*cur["_end"]) <= 5
            if cell.get("fragment"):                       # continuation line of the previous class
                if contiguous: cur["_end"] = end; cur["end"] = hhmm(end)
                continue
            if contiguous and cell["code"] == cur["course"] and cell["group"] == cur["group"] and cell["venue"] == cur["venue"]:
                cur["_end"] = end; cur["end"] = hhmm(end)
                if cell["lecturer"] and (not cur["lecturer"] or len(cell["lecturer"]) < len(cur["lecturer"])):
                    cur["lecturer"] = cell["lecturer"]      # prefer the cleanest printed variant
                continue
            if cur: sessions.append(cur)
            cur = {"day": day, "start": hhmm(start), "end": hhmm(end), "_end": end, "course": cell["code"],
                   "group": cell["group"], "venue": cell["venue"], "lecturer": cell["lecturer"]}
        if cur: sessions.append(cur); cur = None
    for s in sessions:
        s["type"] = "Lab" if "LAB" in s["venue"].upper() or "LAB" in s["group"].upper() else "Lecture"
        s["id"] = f'{s["day"][:3].lower()}-{s["start"].replace(":", "")}-{s["course"].replace(" ", "")}'
        del s["_end"]
    return sessions


def ts_string(v): return json.dumps(v, ensure_ascii=False)


def main(path, out="app/lib/timetables.ts"):
    sheets = read_sheets(path)
    lines = ["// app/lib/timetables.ts",
             "// ⚠ GENERATED by scripts/build_timetables.py from the department's timetable spreadsheet.",
             "// Re-run the script when the timetable changes, or edit by hand. Students can also edit their own copy in the app.",
             "", 'import type { Session, YearLevel } from "./types";', "",
             "export const TIMETABLES: Record<YearLevel, Session[]> = {"]
    report = []
    for lvl, name in SHEETS.items():
        ss = build_year(sheets[name])
        report.append((lvl, ss))
        lines.append(f"  {lvl}: [")
        for s in ss:
            f = [f'id: {ts_string(s["id"])}', f'day: {ts_string(s["day"])}', f'start: {ts_string(s["start"])}', f'end: {ts_string(s["end"])}', f'course: {ts_string(s["course"])}']
            if s["group"]: f.append(f'group: {ts_string(s["group"])}')
            f.append(f'venue: {ts_string(s["venue"])}')
            if s["lecturer"]: f.append(f'lecturer: {ts_string(s["lecturer"])}')
            f.append(f'type: {ts_string(s["type"])}')
            lines.append("    { " + ", ".join(f) + " },")
        lines.append("  ],")
    lines += ["};", ""]
    open(out, "w", encoding="utf-8").write("\n".join(lines))
    for lvl, ss in report:
        codes = list(OrderedDict.fromkeys(s["course"] for s in ss))
        print(f"Year {lvl}: {len(ss):2d} sessions, {len(codes)} courses -> {', '.join(codes)}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "data/timetable-2026-27-sem1.ods")
