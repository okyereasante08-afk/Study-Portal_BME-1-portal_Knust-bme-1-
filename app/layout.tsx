import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PortalProvider } from "./components/PortalProvider";
import { SoundProvider } from "./components/SoundProvider";
import { STYLES } from "./lib/styles";

export const metadata: Metadata = {
  title: "BME Study Portal · KNUST",
  description: "Timetables, resources and study tools for every year of KNUST Biomedical Engineering.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BME Portal" },
  icons: { icon: "/favicon-96x96.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#2d2416",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint so the saved style / light-dark mode never flashes.
const readyStyles = STYLES.filter((s) => s.ready).map((s) => s.id);
const themeScript = `(function(){try{var d=document.documentElement,L=localStorage,ok=${JSON.stringify(readyStyles)};
var s=L.getItem('portal:style'),m=L.getItem('portal:mode'),a=L.getItem('portal:accent');
d.dataset.style=ok.indexOf(s)>-1?s:ok[0];d.dataset.mode=m==='dark'?'dark':'light';
if(a&&/^#[0-9a-fA-F]{6}$/.test(a)){var r=parseInt(a.slice(1,3),16),g=parseInt(a.slice(3,5),16),b=parseInt(a.slice(5,7),16);
d.style.setProperty('--accent-user',a);d.style.setProperty('--accent-user-fg',(r*299+g*587+b*114)/1000>140?'#111111':'#ffffff');}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-style="classic" data-mode="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout: applies to every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@500;700&family=Tangerine:wght@400;700&family=Archivo+Black&family=Fredoka:wght@500;600;700&family=Nunito:wght@500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <PortalProvider><SoundProvider>{children}</SoundProvider></PortalProvider>
      </body>
    </html>
  );
}
