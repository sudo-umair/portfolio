import type { z } from "zod";
import type { educationSchema, experienceSchema, profileSchema, projectSchema } from "./schema";

// Raw input data. Parsed and validated in index.ts.
// Source: cv-umair repo (resume/*.tex).

export const profileData: z.input<typeof profileSchema> = {
  name: "Muhammad Umair",
  title: "Full Stack Engineer",
  headline: "I build web, mobile and TV apps with React, React Native and Node.",
  bio: "Full stack engineer with 5+ years building production web and mobile apps, from real-time AI avatar platforms to cureVision, an MDR-certified medical wound scanner. I work across React, Next.js, React Native and Node, and I'm comfortable wiring in hardware sensors, ML models and real-time video.",
  location: "Rawalpindi, Pakistan",
  countryCode: "PK",
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
    name: "cureVision",
    tagline: "React Native on a custom medical scanner",
    summary:
      "cureVision is an MDR-certified handheld wound scanner: a custom Android device with a depth camera, a custom flash and a temperature sensor, running a React Native app I led. Clinicians scan a chronic wound and get 3D measurements and on-device AI tissue analysis, synced to the cureVision web platform. The product won the Health-i-Award 2023 and a Bavarian Innovation Award 2024.",
    platforms: ["android"],
    client: "cureVision GmbH, Munich",
    role: "Lead React Native developer (Codejunkie)",
    stack: [
      "React Native",
      "TypeScript",
      "Java native modules",
      "Vendor camera SDK",
      "TensorFlow Lite",
      "Redux",
      "OTA updates",
    ],
    highlights: [
      "Led the React Native app for cureVision, a handheld wound scanner built on a custom Android device.",
      "Java native modules wrapping the vendor SDK for the depth camera and custom flash, with temperature readings streamed to JavaScript as events.",
      "A 3D view of each scan, with wound measurements computed from the depth data.",
      "A depth pipeline kept fast across the bridge by downsampling and moving heavy processing into native code.",
      "Offline-first sync: scans queued in a local database and uploaded in chunks, with automatic retries when the connection returns.",
      "Shipped under MDR: documented requirements, traceable testing and signed-off releases.",
    ],
    links: [{ label: "cureVision website", href: "https://curevision.de" }],
    architecture: {
      summary:
        "A custom Android device with three pieces of hardware the app had to drive. Java native modules own the vendor SDK and do the heavy depth processing; the React Native app runs the scan flow, 3D view and measurements, and an offline queue syncs every scan to the cureVision web platform.",
      tiers: [
        {
          label: "Device hardware",
          nodes: [
            { name: "Depth 3D camera", detail: "Driven through the camera vendor's Android SDK." },
            { name: "Custom flash", detail: "Fired through the vendor SDK for consistent lighting on every scan." },
            { name: "Temperature sensor", detail: "Readings streamed continuously to the app." },
          ],
        },
        {
          label: "Native (Android)",
          nodes: [
            { name: "Java native modules", detail: "One owner for the SDK, lifecycle handling, errors surfaced to JS instead of crashes." },
            { name: "Depth processing", detail: "Heavy work stays native; data is downsampled before it crosses the bridge." },
            { name: "TensorFlow Lite", detail: "On-device model for tissue analysis." },
          ],
        },
        {
          label: "React Native app",
          nodes: [
            { name: "Scan flow", detail: "Capture guidance for distance and angle, then the scan." },
            { name: "3D view & measurements", detail: "Renders the scan and computes wound measurements from depth data." },
            { name: "Redux store", detail: "App and scan state." },
          ],
        },
        {
          label: "Storage & sync",
          nodes: [
            { name: "Local database queue", detail: "Every scan saved on the device first." },
            { name: "Chunked uploads", detail: "Large scans uploaded in parts, retried when back online." },
            { name: "cureVision web platform", detail: "Wound records and reports." },
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Depth data across the bridge",
        problem:
          "The classic React Native bridge serializes everything, and full-resolution depth frames sent as base64 were too heavy for a responsive app.",
        solution:
          "Depth data is downsampled before it crosses the bridge and the heavy processing moved into Java. JavaScript only receives what the 3D view, the measurements and the model actually need.",
      },
      {
        title: "A vendor SDK that can't crash a scan",
        problem:
          "The vendor SDK was the only way to reach the camera and flash, and its crashes or lifecycle bugs could take down the app in the middle of a scan.",
        solution:
          "A single native module owns the SDK instance, so no two screens ever open it. It opens and releases the hardware with the app and screen lifecycle, turns native exceptions into JavaScript errors, and detects a stuck camera so it can reinitialize it and let the clinician retry.",
      },
      {
        title: "Measurements a clinician can trust",
        problem: "A wound record needs measurements that are accurate and consistent between scans, weeks apart.",
        solution:
          "Device calibration is applied when converting depth to real-world sizes, the custom flash gives every scan the same lighting, on-screen guidance gets distance and angle right before capture, and several depth frames are averaged to reduce noise.",
      },
      {
        title: "Reliable sync on bad Wi-Fi",
        problem: "Large scans have to reach the web platform from clinics and care homes with patchy connections, without losing any.",
        solution:
          "Every scan is written to a local database queue first, then uploaded in chunks with automatic retries when the connection comes back.",
      },
      {
        title: "Shipping a certified medical device",
        problem: "Under the EU Medical Device Regulation, releases can't be ad hoc.",
        solution:
          "Requirements were documented, tests traceable to them and every release signed off. JavaScript-only fixes shipped over the air; anything touching native code shipped as a new APK.",
      },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "salathub",
    name: "SalatHub",
    tagline: "Mosque platform: web, Android and Android TV",
    summary:
      "Mosque management platform (formerly PrayerBox): a web console for masjid admins, full-screen prayer-time displays that run 24/7 on old TV boxes, the SalatHub TV app, and the Alkhairia mobile app for worshippers. Both apps are on Google Play.",
    platforms: ["web", "android", "android-tv"],
    role: "Lead developer",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS 4",
      "Supabase",
      "PostgreSQL",
      "Edge Functions",
      "pg_cron",
      "Stripe",
      "Expo SDK 57",
      "React Native",
      "react-native-tvos",
      "Expo Notifications",
      "EAS Update",
    ],
    highlights: [
      "One Supabase backend serving four clients: the admin console, browser displays, the SalatHub TV app and the Alkhairia mobile app.",
      "Screen codes act as bearer credentials: displays read only through SECURITY DEFINER functions, with anonymous table access fully revoked in a two-phase rollout.",
      "Prayer-time change alerts that compare old and new settings against the same data, after false alerts showed up in production.",
      "Alkhairia mobile app (part of SalatHub, Android): follow masjids by location, search or QR code, a combined feed, push alerts and local prayer reminders that keep working offline.",
      "SalatHub TV (Android TV): a WebView shell with D-pad focus management, network recovery and hourly OTA updates for unattended screens.",
      "Display build targets Chrome 83 for old TV boxes and keeps showing the last good data when offline.",
    ],
    architecture: {
      summary:
        "Four clients share one Supabase project. Each gets a different, narrow door: admins use Supabase Auth with row-level security, displays use screen-code functions, and the mobile app goes through a single edge function. No client can read the content tables directly without a session.",
      tiers: [
        {
          label: "Clients",
          nodes: [
            { name: "Admin console", detail: "React 19 SPA on Vercel. Masjid admins and moderators manage content, screens and prayer settings." },
            { name: "Display screens", detail: "The same SPA at /display, built for Chrome 83. Offline-first PWA for TVs and browsers." },
            { name: "SalatHub TV", detail: "Android TV app: Expo, react-native-tvos and a WebView around the display. Hourly OTA updates." },
            { name: "Alkhairia mobile app", detail: "Part of SalatHub. Android app on Expo SDK 57. Follow masjids, feed, push alerts and local prayer reminders." },
          ],
        },
        {
          label: "Access",
          nodes: [
            { name: "Supabase Auth + RLS", detail: "Admins and moderators. Role checks in SECURITY DEFINER helpers, plan limits enforced by triggers." },
            { name: "Screen-code functions", detail: "Displays have no session. They read one payload through functions keyed by the screen code." },
            { name: "masjid-directory", detail: "The mobile app's whole API. Anonymous device IDs, rate limiting, capped IDs, cached responses." },
          ],
        },
        {
          label: "Data",
          nodes: [
            { name: "PostgreSQL", detail: "80 migrations. Triggers queue notifications and invalidate cached prayer days." },
            { name: "Realtime", detail: "Only a per-masjid revision counter is published. Screens refetch when it changes." },
            { name: "Storage", detail: "Logos, posts and slides, cached on displays by the service worker." },
          ],
        },
        {
          label: "Jobs & services",
          nodes: [
            { name: "pg_cron + Edge Functions", detail: "16 Deno functions: prayer-change and content alerts every minute, billing, verification." },
            { name: "Expo Push, Stripe, Resend", detail: "Push notifications, Pro plan billing and email." },
            { name: "Al-Adhan, OpenWeather, Geoapify", detail: "Prayer times, forecasts, geocoding and map tiles." },
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Screen codes as credentials",
        problem:
          "TV displays can't sign in, but the original row-level security let anyone holding the public key list every screen code and read every masjid's content.",
        solution:
          "Displays now read only through SECURITY DEFINER functions keyed by their code, and anonymous SELECT grants were revoked outright, not just the policies. It shipped in two phases, using screen heartbeats to confirm displays in the field had the new code before old access was removed. A script verifies the lockdown against a live project.",
      },
      {
        title: "Realtime for locked-down screens",
        problem:
          "Supabase Realtime checks row-level security before delivering a change, so displays with no table access would never hear about edits.",
        solution:
          "A trigger on 10 content tables bumps a per-masjid revision counter, the only table displays can read. Screens subscribe to it, ignore the value and refetch their single payload, debounced. A 5-minute poll covers dropped sockets.",
      },
      {
        title: "No false prayer-time alerts",
        problem:
          "Comparing cached prayer times before and after an edit sent false \"Asr changed\" alerts in production, because the upstream data itself can shift.",
        solution:
          "A trigger snapshots the masjid's settings from before the first save, and the job waits 2 minutes for edits to settle. It then resolves the next 14 days with the old and new settings against one shared Al-Adhan fetch and only reports real differences. Failed sends are requeued.",
      },
      {
        title: "One prayer engine everywhere",
        problem: "Times on the console, the displays and in push alerts must never disagree.",
        solution:
          "A dependency-free prayer engine runs in the browser and is copied into the Deno edge functions. CI fails if the copy is stale. The server also sends the masjid's own clock with every response, so the app shows correct times whatever time zone the phone is set to.",
      },
      {
        title: "Old TV boxes, unattended",
        problem:
          "Displays run 24/7 on cheap Android boxes with old WebViews and flaky Wi-Fi, and nobody is there to restart them.",
        solution:
          "One browser floor (Chrome 83) drives both the JS and CSS fallbacks. Displays render the last good data first and keep it when a fetch fails. The TV app reloads on reconnect, can wipe the service worker from native code, and installs OTA updates within an hour without a relaunch.",
      },
      {
        title: "Reminders that respect the OS",
        problem: "Local prayer reminders run into Android's exact-alarm permission and a cap on pending notifications.",
        solution:
          "Reminders are rebuilt as a whole from the cached week, in a queue, after persisted state loads, so a background refresh can't double-schedule. They stay under the 64-notification cap with a final \"reminders paused\" notice. A small Kotlin module checks the exact-alarm permission and links to the setting.",
      },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "mailcamp",
    name: "Mailcamp",
    tagline: "Email marketing platform",
    summary:
      "Full-stack email marketing platform for contacts, campaigns and engagement tracking, sending through a self-hosted Postal mail server, with Stripe billing.",
    platforms: ["web", "api"],
    role: "Sole developer",
    stack: [
      "React 19",
      "TanStack Query",
      "Zustand",
      "Tailwind CSS 4",
      "Bun",
      "Express 5",
      "Prisma",
      "PostgreSQL",
      "Postal",
      "Stripe",
      "AWS",
    ],
    highlights: [
      "Campaign sending coordinated in Postgres alone: atomic claims and lease renewal, with no Redis or job queue.",
      "Race-free plan quotas using per-user advisory locks and atomic usage reservation.",
      "Signed open and click tracking links that cannot be abused as an open redirect.",
      "Custom sending domains with DKIM provisioned on self-hosted Postal, and DNS checks that do not flap.",
      "Stripe Checkout, Customer Portal and idempotent webhooks, deployed to AWS with GitHub Actions.",
    ],
    architecture: {
      summary:
        "One Express API on Bun serves the app, the tracking endpoints and the webhooks, and runs scheduled jobs in-process. Postgres is the only coordination layer: there is no Redis, queue or separate worker.",
      tiers: [
        {
          label: "Clients",
          nodes: [
            { name: "React 19 SPA", detail: "TanStack Query for server state, Zustand for UI state. Served from S3 behind CloudFront." },
            { name: "Email recipients", detail: "Open pixel, signed click links and one-click unsubscribe." },
          ],
        },
        {
          label: "API",
          nodes: [
            { name: "Express 5 on Bun", detail: "EC2 behind CloudFront and WAF, run by PM2. Zod validation, httpOnly JWT cookies with rotating refresh tokens." },
            { name: "Tracking endpoints", detail: "Outside /api with their own rate limit. Respond first, record after." },
            { name: "Scheduled jobs", detail: "In-process cron: campaign scheduler every minute, DNS re-checks, trial expiry, cleanup." },
          ],
        },
        {
          label: "Data",
          nodes: [
            { name: "PostgreSQL + Prisma 7", detail: "Campaigns, recipients, quotas and analytics. Raw SQL for aggregations." },
            { name: "Postal's MariaDB", detail: "Sending domains and DKIM keys, written directly over an SSH tunnel." },
          ],
        },
        {
          label: "Services",
          nodes: [
            { name: "Postal", detail: "Self-hosted mail server. Delivery, bounce and failure webhooks." },
            { name: "Stripe", detail: "Checkout, Customer Portal and subscription webhooks." },
            { name: "S3, Unlayer, OAuth", detail: "Uploads, the email editor and stock templates, Google and Facebook sign-in." },
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Sending without a job queue",
        problem:
          "Campaigns with thousands of recipients have to survive restarts and never send twice, without adding Redis and a worker to operate.",
        solution:
          "The scheduler claims a campaign with a conditional update from SCHEDULED to SENDING. Each finished batch renews a lease by touching updatedAt, so a campaign stuck for 5 minutes is picked up again. Suspending stops the loop at the next batch, and a campaign is marked failed if 90% of sends fail.",
      },
      {
        title: "Plan quotas under concurrency",
        problem: "Two sends started at the same moment could both pass the plan's email limit check.",
        solution:
          "Limit checks take a per-user Postgres advisory lock, and usage is reserved with a conditional increment in the same transaction that creates the campaign. Going over returns a structured 402, which the app turns into an upgrade prompt.",
      },
      {
        title: "Tracking links that can't be abused",
        problem: "Click-tracking redirects are a classic open-redirect hole, and slow tracking delays the recipient.",
        solution:
          "Tokens are HMAC-signed and checked in constant time. Click targets are looked up from the campaign's own stored links, never taken from the URL. The pixel and redirect respond immediately and the event is written afterwards.",
      },
      {
        title: "Webhooks that survive retries",
        problem: "Stripe and Postal both retry and can deliver events more than once or out of order.",
        solution:
          "Stripe events are verified against the raw body, claimed by event id, and released if processing fails so the retry still works. Postal webhooks use a constant-time secret check, acknowledge first, and only ever move a recipient's status forward. Contacts are suppressed after 3 hard failures.",
      },
      {
        title: "Running our own mail server",
        problem: "Custom sending domains need DKIM keys provisioned in Postal and DNS checks that don't flap between pass and fail.",
        solution:
          "The API generates 2048-bit DKIM keys and writes them into Postal's database. DNS is checked against two public resolvers: one confirmation passes, only two misses fail, and mixed results keep the previous state.",
      },
    ],
    featured: true,
    order: 4,
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
      "Shipped 3+ React Native apps with thousands of users, including cureVision, an MDR-certified wound scanner.",
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

export const educationData: z.input<typeof educationSchema>[] = [
  {
    institution: "National University of Modern Languages (NUML)",
    studyType: "Bachelor's",
    area: "Software Engineering",
    location: "Islamabad, Pakistan",
    start: "2019-02",
    end: "2023-01",
    highlights: [
      "Final-year project: Share and Care, a MERN and React Native platform for hospitals to share resources and connect with donors.",
    ],
  },
];
