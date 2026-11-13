import type { z } from "zod";
import type { experienceSchema, profileSchema, projectSchema } from "./schema";

// Raw input data. Parsed and validated in index.ts.
// Source: cv-umair repo (resume/*.tex).

export const profileData: z.input<typeof profileSchema> = {
  name: "Muhammad Umair",
  title: "Full Stack Engineer",
  headline: "I build web, mobile and TV apps with React, React Native and Node.",
  bio: "Full stack engineer with 5+ years building production web and mobile apps, from real-time AI avatar platforms to an MDR-approved medical imaging app. I work across React, Next.js, React Native and Node, and I'm comfortable wiring in hardware sensors, ML models and real-time video.",
  location: "Rawalpindi, Pakistan",
  timezone: "Asia/Karachi",
  yearsExperience: 5,
  openToWork: true,
  links: [
    { label: "GitHub", href: "https://github.com/sudo-umair" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sudo-umair/" },
  ],
  skills: {
    languages: ["TypeScript", "JavaScript", "SQL", "HTML", "CSS"],
    frontend: ["React", "Next.js", "React Router", "TanStack Query", "Zustand", "Redux", "React Hook Form", "Zod"],
    mobile: ["React Native", "Expo", "Expo Router", "EAS Build & Update", "Reanimated", "Native Modules"],
    backend: ["Node.js", "Bun", "Express", "REST", "GraphQL", "WebSockets", "LiveKit / WebRTC", "Prisma", "JWT / OAuth"],
    databases: ["PostgreSQL", "MongoDB", "MySQL", "Supabase", "Firebase"],
    cloud: ["AWS (EC2, RDS, S3, CloudFront)", "Vercel", "Cloudflare", "Stripe"],
    ui: ["Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "Storybook"],
    testing: ["Jest", "React Testing Library", "Playwright", "Cypress"],
    devops: ["GitHub Actions", "CI/CD", "Vite", "PM2", "Sentry"],
  },
};

export const projectsData: z.input<typeof projectSchema>[] = [
  {
    slug: "beyond-presence",
    name: "Beyond Presence",
    tagline: "Real-time AI avatar platform",
    summary:
      "Web platform for hyper-realistic conversational AI video agents with sub-second latency. I built the dashboard, the agent creation flows and the live call experience.",
    variant: "web",
    platforms: ["web"],
    client: "Beyond Presence",
    role: "Full stack engineer (Codejunkie)",
    stack: ["React", "TypeScript", "TanStack Query", "Zustand", "LiveKit / WebRTC", "Storybook", "Playwright"],
    highlights: [
      "Dashboard and agent creation flows covering avatars, voices, behavior and deployment settings.",
      "Live avatar calls over LiveKit / WebRTC with low-latency sessions and in-call controls.",
      "Reusable component library in Storybook and a Playwright suite with 90%+ coverage.",
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "curevision",
    name: "CureVision",
    tagline: "MDR-approved wound imaging app",
    summary:
      "Mobile app for an AI-powered 3D wound analysis and documentation system, approved under the EU Medical Device Regulation. Native camera and sensor integrations with on-device ML.",
    variant: "mobile",
    platforms: ["ios", "android"],
    client: "CureVision",
    role: "React Native engineer (Codejunkie)",
    stack: ["React Native", "TypeScript", "Native Modules", "Reanimated", "ML models"],
    highlights: [
      "Native integrations for a 3D camera and a temperature sensor with depth-accurate measurement.",
      "Pre-trained ML models for automatic wound detection and analysis.",
      "Offline capture and documentation, synced to the CureVision web platform.",
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "salathub",
    name: "SalatHub",
    tagline: "Android TV app on Google Play",
    summary:
      "TV companion app for PrayerBox that runs on 24/7 mosque displays. Remote-friendly navigation, keep-awake and network recovery, with over-the-air updates through EAS.",
    variant: "mobile",
    platforms: ["android-tv"],
    role: "Sole developer",
    stack: ["React Native (tvOS)", "Expo", "TypeScript", "EAS Build & Update"],
    highlights: [
      "Published on the Google Play Store for Android TV.",
      "TV-first UX: D-pad navigation, keep-awake, and network handling for always-on displays.",
      "Instant OTA updates via EAS Update with separate development and production channels.",
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "mailcamp",
    name: "Mailcamp",
    tagline: "Email marketing platform",
    summary:
      "Full-stack email marketing platform for contacts, campaigns and real-time engagement tracking, with self-hosted mail infrastructure and Stripe billing.",
    variant: "web",
    platforms: ["web", "api"],
    role: "Sole developer, frontend and backend",
    stack: ["React 19", "TanStack Query", "Zustand", "Tailwind CSS 4", "Express 5", "Prisma", "PostgreSQL", "Postal", "Stripe", "AWS"],
    highlights: [
      "Express 5 + Prisma + PostgreSQL backend with custom sending domains on self-hosted Postal.",
      "Campaign wizard, contacts, Unlayer template editor and analytics in a React 19 frontend.",
      "Stripe subscriptions and webhooks, deployed to AWS with GitHub Actions CI/CD.",
    ],
    featured: true,
    order: 4,
  },
  {
    slug: "prayerbox",
    name: "PrayerBox",
    tagline: "Mosque management platform",
    summary:
      "Mosque management system with prayer times, content management and a full-screen TV display mode that runs on older TV boxes.",
    variant: "web",
    platforms: ["web"],
    role: "Sole developer",
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS 4", "Supabase"],
    highlights: [
      "Prayer times from the Al-Adhan API with 24+ calculation methods.",
      "Auto-rotating TV display mode that supports legacy browsers on older TV boxes.",
      "Dual auth: Supabase Auth for admins and masjid-code login for displays.",
    ],
    featured: false,
    order: 5,
  },
];

export const experienceData: z.input<typeof experienceSchema>[] = [
  {
    title: "Mid-Senior Full Stack Engineer",
    org: "Codejunkie",
    location: "Islamabad, Pakistan",
    start: "2024-03",
    highlights: [
      "Building production web platforms for clients such as Beyond Presence (AI avatars) and Frontline Global (travel safety).",
      "Full-stack features on Supabase and Firebase: auth, PostgreSQL, storage and real-time sync.",
      "Cut load times by 30% and improved Lighthouse scores across apps.",
      "Mentored 3+ junior developers and ran 100+ code reviews.",
    ],
    projects: ["beyond-presence"],
  },
  {
    title: "React Native Engineer",
    org: "Codejunkie",
    location: "Islamabad, Pakistan",
    start: "2023-02",
    end: "2024-03",
    highlights: [
      "Shipped 3+ React Native apps with thousands of users, including CureVision.",
      "Native modules for a 3D camera, temperature sensor hardware and on-device ML.",
      "Offline-first data flows with Redux and Zustand; 20+ features shipped and 200+ bugs fixed.",
    ],
    projects: ["curevision"],
  },
  {
    title: "Full Stack Engineer",
    org: "Freelance",
    location: "Remote",
    start: "2021-08",
    highlights: [
      "Delivered 15+ full-stack web and mobile apps for clients across industries.",
      "APIs and backends, plus React, React Native and Next.js frontends.",
    ],
    projects: [],
  },
];
