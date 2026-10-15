import { notFound } from "next/navigation";
import { YearPortal } from "../../components/YearPortal";
import { YEAR_LEVELS, parseLevel } from "../../lib/years";

export const dynamicParams = false;
export function generateStaticParams() {
  return YEAR_LEVELS.map((l) => ({ level: String(l) }));
}

export default async function YearPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const lvl = parseLevel(level);
  if (!lvl) notFound();
  return <YearPortal key={lvl} level={lvl} />;
}
