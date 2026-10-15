# Archived (not part of the build)

`orion/` (class chat) and `map/` (brain map) were built for one class (BME 1): they use
BME1-specific course channels and the old class-list student IDs, backed by a Supabase project.
They are excluded from the build via `tsconfig.json`. To bring them back as year-aware features,
the channels/courses need to come from `app/lib/years.ts` and the Supabase tables need a `year` column.
