import { BUILD_ID, STYLES } from "../lib/styles";

export function Footer() {
  return (
    <footer className="text-center" style={{ padding: "28px 16px 120px" }}>
      <p className="text-muted-x" style={{ fontSize: 12, margin: 0 }}>
        Unofficial student portal · KNUST Biomedical Engineering
      </p>
      <p className="text-muted-x" style={{ fontSize: 12, margin: "6px 0 0" }}>
        Built by{" "}
        <a href="https://github.com/okyereasante08-afk" target="_blank" rel="noopener noreferrer"
          className="font-script text-ink" style={{ fontSize: 20, fontWeight: 700 }}>Asante Inc.</a>
        {" "}· © {new Date().getFullYear()}
      </p>
      <p className="text-muted-x" style={{ fontSize: 10, margin: "6px 0 0" }}>
        Build {BUILD_ID} · styles: {STYLES.filter((s) => s.ready).map((s) => s.name).join(", ")}
      </p>
    </footer>
  );
}
