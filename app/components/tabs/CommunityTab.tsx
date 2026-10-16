// app/components/tabs/CommunityTab.tsx
import FeedShell from "../community/FeedShell";
import type { YearConfig } from "../../lib/types"; // Adjust this path if your types are elsewhere

interface Props {
  year: YearConfig;
  studentId: string;
  studentName: string;
}

export function CommunityTab({ year, studentId, studentName }: Props) {
  // Defensive check in case the student ID hasn't loaded yet
  if (!studentId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-x">Please log in to access the community feed.</p>
      </div>
    );
  }

  return (
    <div className="community-page">
      <div className="community-header">
        <h1 className="community-title">Community</h1>
        <p className="community-subtitle">
          KNUST Biomedical Engineering · Year {year.level}
        </p>
      </div>
      <FeedShell
        authorId={studentId}
        authorName={studentName}
        yearLevel={year.level}
      />
    </div>
  );
}