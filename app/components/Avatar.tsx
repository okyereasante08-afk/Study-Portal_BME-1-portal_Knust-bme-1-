// app/components/Avatar.tsx
"use client";

interface AvatarProps {
  name: string;
  size?: number;
  onClick?: () => void;
  photoUrl?: string | null;
}

export default function Avatar({ name, size = 36, onClick, photoUrl }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    ["#f59e0b", "#92400e"], ["#10b981", "#064e3b"], ["#3b82f6", "#1e3a8a"],
    ["#8b5cf6", "#4c1d95"], ["#ef4444", "#7f1d1d"], ["#ec4899", "#831843"],
    ["#14b8a6", "#134e4a"], ["#f97316", "#7c2d12"],
  ];

  const colorIndex = name.charCodeAt(0) % colors.length;
  const [bg, text] = colors[colorIndex];

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        onClick={onClick}
        style={{
          width: size, height: size, borderRadius: "50%",
          objectFit: "cover", cursor: onClick ? "pointer" : "default",
          border: "2px solid rgba(255,255,255,0.3)",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%",
        background: bg, color: text,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 700,
        cursor: onClick ? "pointer" : "default",
        flexShrink: 0, userSelect: "none",
        border: "2px solid rgba(255,255,255,0.2)",
      }}
    >
      {initials}
    </div>
  );
}