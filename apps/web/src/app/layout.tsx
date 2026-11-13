import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { platformLabels, profile, projects } from "@portfolio/content";
import { CommandPaletteProvider } from "@/components/command-palette/provider";
import type { PaletteData } from "@/components/command-palette/command-palette";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { baseOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  // Width axis powers the wide display type (font-wide / font-semiwide).
  axes: ["wdth"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: site.url,
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    ...baseOpenGraph,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0d10" },
  ],
};

// Runs before first paint so a saved theme never flashes the wrong colors.
// No saved value means "system" and the CSS media query handles it.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

// Plain data for the client palette: names, taglines and search keywords only.
const paletteData: PaletteData = {
  projects: projects.map((project) => ({
    slug: project.slug,
    name: project.name,
    tagline: project.tagline,
    keywords: [project.tagline, ...project.stack, ...project.platforms.map((p) => platformLabels[p])],
  })),
  links: profile.links,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${jetbrains.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <CommandPaletteProvider data={paletteData}>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
