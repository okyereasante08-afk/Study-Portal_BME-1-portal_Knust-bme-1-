# BME Study Portal · KNUST

A study portal for **all four years** of KNUST Biomedical Engineering: timetable, attendance tracking,
slides/resources, CWA calculator, focus timer + lofi, and an AI assistant.

## Run it
```bash
npm install
npm run dev          # http://localhost:3000
```
Optional: set `GROQ_API_KEY` (in `.env.local` / Vercel env vars) to enable the assistant.

## Where things live
| You want to change…            | Edit                              |
|--------------------------------|-----------------------------------|
| A year's courses / timetable / resources / announcements | `app/lib/years.ts` |
| Semester dates (mid-sems, exams, breaks)                 | `SEMESTER` in `app/lib/years.ts` |
| Colours, radii, borders, shadows of a style              | token blocks in `app/globals.css` |
| Which styles are selectable                              | `app/lib/styles.ts` (`ready: true`) |

### Adding a timetable (Years 2–4)
Fill `courses` and `timetable` for that year in `app/lib/years.ts`, following Year 1's entries
(`day`, `start`/`end` in 24h, `course`, `venue`, `lecturer`, `type`). Every tab picks it up automatically.

### Styles
All three styles are built: `classic`, `brutalist` (blue/red/white) and `clay`. Each is a token block in
`app/globals.css` plus a few overrides, registered in `app/lib/styles.ts`. To add another, copy a block, register it,
and set `ready: true`. The footer shows a build stamp (`BUILD_ID` in `styles.ts`) listing the styles in the running build.

Troubleshooting: if a style shows "Next up" or is missing, you're running an older copy. Delete `.next`, re-extract
the latest zip, and check the build stamp in the footer.

## Where to change things (v5)
| Want to change…                                   | Edit                       |
|---------------------------------------------------|----------------------------|
| Semester dates (mid-sems, exams, end) → countdowns | `app/lib/calendar.ts`      |
| Degree class bands (First 70, Upper 60, …)         | `app/lib/grading.ts`       |
| UI sound character, volume, default on/off         | `app/lib/sound.ts`         |
| Colours / contrast (all modes and styles)          | token blocks in `app/globals.css` |

- **Contrast:** every text colour is a design token, audited at WCAG AA (4.5:1) in light + dark across all three styles.
  Never hard-code a colour in a component; use `var(--ink)`, `var(--muted)`, `var(--card)` etc.
- **CWA calculator:** maths lives in `app/lib/cwa.ts` (pure functions, unit-tested); UI in `app/components/CwaModal.tsx`.
- **Sound:** `SoundProvider` listens globally, so every new button or input gets feedback automatically.
  Add `data-no-sound` to any element that should stay silent.

## Features worth knowing about
- **Editable timetable.** Tap any class in the Timetable grid to change its time, venue, lecturer, day or type, or tap an
  empty cell to add a class. Edits are stored as small diffs on top of `years.ts` (`app/components/useTimetable.ts`),
  **on the student's own device only**. "Reset changes" restores the official timetable.
  To change it for everyone, edit `app/lib/years.ts`.
- **Guided tour.** `app/components/OnboardingTour.tsx`. Auto-shows on a first visit; replay it, or make it show on every
  visit, from Profile.
- **Motion.** Shared, deliberately slow Framer Motion helpers live in `app/lib/motion.tsx` (Stagger, Item, Reveal,
  CountUp, Bar, RiseWords). Reduced-motion preferences are respected automatically.

## Notes
- Everything personal (name, photo, attendance, theme) is stored in the browser's localStorage only.
- `_archive/` holds the old class-chat (Orion) and Brain Map, which were BME-1-specific. Not part of the build.
