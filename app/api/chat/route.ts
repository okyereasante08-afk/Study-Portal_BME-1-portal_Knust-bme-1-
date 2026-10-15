import { NextRequest, NextResponse } from "next/server";
import { YEARS, parseLevel } from "../../lib/years";
import type { YearConfig } from "../../lib/types";
import { fmtClock, sessionLabel } from "../../lib/schedule";

export const runtime = "nodejs";

const MAX_MESSAGES = 10;
const MAX_CHARS = 600;

function buildSystemPrompt(year: YearConfig, name?: string) {
  const sem = year.semester;
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const timetable = year.timetable.length
    ? days.map((d) => {
        const list = year.timetable.filter((s) => s.day === d).sort((a, b) => a.start.localeCompare(b.start));
        return `${d}: ${list.length ? list.map((s) => `${sessionLabel(s)} (${fmtClock(s.start)}-${fmtClock(s.end)}, ${s.venue}${s.lecturer ? `, ${s.lecturer}` : ""})`).join("; ") : "no classes"}`;
      }).join("\n")
    : "The timetable for this year has not been published yet.";
  const courses = year.courses.length
    ? year.courses.map((c) => `${c.code} ${c.name} (${c.credits} credits)`).join("\n")
    : "Course list not published yet.";
  const total = year.courses.reduce((s, c) => s + c.credits, 0);

  return `You are the BME Study Portal assistant for KNUST Biomedical Engineering, ${year.title} (Level ${year.levelCode}).
${name ? `You are talking to ${name}.` : ""}

SEMESTER: ${sem.label}. Lectures ${sem.start} to ${sem.end}.${sem.midsem ? ` Mid-semester exams ${sem.midsem[0]} to ${sem.midsem[1]}.` : ""}${sem.exams ? ` End-of-semester exams ${sem.exams[0]} to ${sem.exams[1]}.` : ""}

COURSES${total ? ` (${total} credit hours)` : ""}:
${courses}

TIMETABLE:
${timetable}

CWA = sum(score x credit hours) / sum(credit hours).

Rules: be friendly and concise. Only state timetable or course facts that appear above; if something isn't listed, say you don't have it yet instead of guessing. Do not invent dates, venues or lecturers.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const level = parseLevel(body?.level);
    if (!level) return NextResponse.json({ reply: "Please pick a year first." }, { status: 400 });

    const messages = (Array.isArray(body?.messages) ? body.messages : [])
      .filter((m: { role?: string; content?: unknown }) => (m?.role === "user" || m?.role === "assistant") && typeof m?.content === "string")
      .slice(-MAX_MESSAGES)
      .map((m: { role: string; content: string }) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (messages.length === 0) return NextResponse.json({ reply: "Ask me something!" }, { status: 400 });

    const key = process.env.GROQ_API_KEY;
    if (!key) return NextResponse.json({ reply: "The assistant isn't configured yet (missing GROQ_API_KEY on the server)." });

    const name = typeof body?.name === "string" ? body.name.slice(0, 40) : undefined;
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 600,
        messages: [{ role: "system", content: buildSystemPrompt(YEARS[level], name) }, ...messages],
      }),
    });

    if (!res.ok) {
      console.error("Groq error", res.status);
      return NextResponse.json({ reply: `The AI service returned an error (${res.status}). Please try again shortly.` });
    }
    const data = await res.json();
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content ?? "No response from the AI." });
  } catch (err) {
    console.error("chat route error", err);
    return NextResponse.json({ reply: "Something went wrong on the server." }, { status: 500 });
  }
}
