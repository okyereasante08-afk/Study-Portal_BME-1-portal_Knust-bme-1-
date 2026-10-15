# v5 update: what changed and where it goes

All paths are relative to the project root (the folder containing `package.json`).
Drop each file in at the same path, overwriting the old one where it exists.

## NEW files (6)
| File | Purpose |
|---|---|
| `app/lib/calendar.ts`            | **Semester dates** (mid-sems, exams, end). The one place to edit them. |
| `app/lib/grading.ts`             | KNUST class bands (First / Second Upper / Second Lower / Pass) + approx GPA steps. |
| `app/lib/cwa.ts`                 | Pure CWA maths: needed-average, combined CWA, per-band plans. |
| `app/lib/sound.ts`               | Web Audio synth engine: per-style click/typing sounds. |
| `app/components/SoundProvider.tsx` | Global click/typing listeners + the mute toggle button + `useSound()`. |
| `app/components/CountdownWidget.tsx` | Live countdown cards (days + h/m/s). |

## CHANGED files (13)
| File | What changed |
|---|---|
| `app/globals.css`                    | Contrast: every `--muted` token raised to ≥4.5:1 in all 6 style/mode combos; clay hero + button gradients darkened; ok/bad status colours fixed (classic light); brutalist chip no longer hard-coded white; `color-scheme` set for light/dark so native controls follow the theme. |
| `app/components/CwaModal.tsx`        | Rewritten: "This semester" + "Continuing student" modes, needed average, class ranges, stay/move-up guidance, whole-degree view, saved inputs. |
| `app/components/PhotoUpload.tsx`     | Hard-coded light-theme colours → design tokens (fixes the unreadable uploader in dark mode). |
| `app/components/Footer.tsx`          | Build stamp: removed double-fading opacity. |
| `app/components/YearPortal.tsx`      | Sound toggle added to sidebar + mobile top bar. |
| `app/components/tabs/HomeTab.tsx`    | Old mini date cards → `<CountdownWidget compact />`. |
| `app/components/tabs/ProgressTab.tsx`| Same widget (also shown for years with no timetable yet). |
| `app/components/tabs/ProfileTab.tsx` | "Interface sounds" switch; year-button text no longer faded. |
| `app/layout.tsx`                     | Wraps the app in `<SoundProvider>`. |
| `app/page.tsx`                       | Sound toggle on the landing header. |
| `app/lib/schedule.ts`                | `countdownsFor()` + `timeLeft()` helpers. |
| `app/lib/years.ts`                   | Semester dates moved out to `calendar.ts` (re-exported, so nothing else breaks). |
| `app/lib/styles.ts`                  | Build stamp bumped to v5. |

No new npm packages. Run `npm run dev` (or `npm run build`) as usual.
