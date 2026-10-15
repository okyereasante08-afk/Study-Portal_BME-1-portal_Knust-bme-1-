"use client";

import React, { useMemo, useState } from "react";
import { ChevronRight, ExternalLink, FileText, Folder, Inbox, Play } from "lucide-react";
import type { FileKind, YearConfig } from "../../lib/types";
import { EmptyState, PageHeader } from "../ui";
import { unique } from "../../lib/schedule";
import { Stagger } from "../../lib/motion";

const KIND_LABEL: Record<FileKind, string> = {
  slides: "Slides", notes: "Notes", manual: "Lab manual", "past-questions": "Past questions", recording: "Recording", other: "File",
};

export function ResourcesTab({ year }: { year: YearConfig }) {
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const courses = useMemo(() => unique(year.files.map((f) => f.course)), [year.files]);
  const files = filter === "All" ? year.files : year.files.filter((f) => f.course === filter);
  const nothing = !year.slidesFolderUrl && year.files.length === 0 && year.kit.length === 0;

  return (
    <Stagger className="stack gap-6">
      <PageHeader title="Resources" sub={`${year.title} · slides, files and curated study links`} />

      {nothing && (
        <EmptyState icon={<Inbox size={22} />} title={`${year.title} resources are on the way`}
          body="Lecture slides, notes, lab manuals and curated study videos will be added here for each course." />
      )}

      {year.slidesFolderUrl && (
        <a href={year.slidesFolderUrl} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center gap-4" style={{ padding: 18 }}>
          <span className="avatar" style={{ width: 46, height: 46, background: "var(--soft-2)", color: "var(--ink)" }}><Folder size={20} /></span>
          <div style={{ flex: 1 }}>
            <p className="h-title" style={{ fontSize: 15, margin: 0 }}>{year.title} class slides</p>
            <p className="text-muted-x" style={{ fontSize: 12, margin: "2px 0 0" }}>Shared Google Drive folder · opens in a new tab</p>
          </div>
          <ExternalLink size={16} style={{ color: "var(--ink-2)" }} />
        </a>
      )}

      {year.files.length > 0 && (
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap" style={{ marginBottom: 12 }}>
            <h3 className="eyebrow" style={{ margin: 0 }}>Slides & files</h3>
            <div className="segmented no-scrollbar" style={{ overflowX: "auto", maxWidth: "100%" }}>
              {["All", ...courses].map((c) => (
                <button key={c} aria-pressed={filter === c} onClick={() => setFilter(c)} style={{ whiteSpace: "nowrap" }}>{c}</button>
              ))}
            </div>
          </div>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {files.map((f) => (
              <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center gap-3" style={{ padding: 14 }}>
                <span className="avatar" style={{ width: 38, height: 38, background: "var(--soft-2)", color: "var(--ink)" }}><FileText size={16} /></span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p className="h-title" style={{ fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.title}</p>
                  <p className="text-muted-x" style={{ fontSize: 11, margin: "2px 0 0" }}>{f.course} · {KIND_LABEL[f.kind]}</p>
                </div>
                <ExternalLink size={12} style={{ color: "var(--muted)" }} />
              </a>
            ))}
          </div>
        </section>
      )}

      {year.kit.length > 0 && (
        <section>
          <h3 className="eyebrow" style={{ marginBottom: 12 }}>Survival kit · curated videos</h3>
          <div className="stack gap-2">
            {year.kit.map((k) => {
              const isOpen = open === k.course;
              return (
                <div key={k.course} className="card" style={{ overflow: "hidden" }}>
                  <button className="flex items-center justify-between" aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : k.course)}
                    style={{ width: "100%", padding: "14px 16px", background: "var(--soft)", border: "none", textAlign: "left", color: "var(--ink)" }}>
                    <span className="flex items-center gap-3">
                      <span style={{ width: 9, height: 9, borderRadius: 9, background: `var(--kit-dot, ${k.color})` }} />
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{k.emoji} {k.course}</span>
                    </span>
                    <span className="flex items-center gap-2 text-muted-x" style={{ fontSize: 11, fontWeight: 600 }}>
                      {k.resources.length} links
                      <ChevronRight size={14} style={{ transform: isOpen ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="stack gap-1" style={{ padding: "8px 10px 12px" }}>
                      {k.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3" style={{ padding: "10px 12px", borderRadius: "var(--radius-ctl)", fontSize: 13 }}>
                          <span className="flex items-center gap-2"><Play size={11} fill="var(--play)" color="var(--play)" />{r.label}</span>
                          <ExternalLink size={11} style={{ color: "var(--muted)", flexShrink: 0 }} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </Stagger>
  );
}