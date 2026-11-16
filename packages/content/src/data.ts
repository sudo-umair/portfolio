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
      "Beyond Presence turns AI agents into hyper-realistic video avatars you can talk to in real time. I was the main frontend engineer for two years: I rebuilt Studio, the dashboard where customers create avatars and agents, built most of the browser call app, and built the Bey design system both of them use.",
    platforms: ["web"],
    client: "Beyond Presence, Munich",
    via: "Codejunkie",
    role: "Lead frontend engineer",
    period: { start: "2024-08" },
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "TanStack Query",
      "Zustand",
      "React Router 7",
      "Tailwind CSS",
      "LiveKit / WebRTC",
      "MediaPipe",
      "WebGL2",
      "Firebase Auth",
      "Storybook",
      "Style Dictionary",
      "Playwright",
      "Sentry",
    ],
    highlights: [
      "Rewrote Studio from React 18 and Redux into a feature-sliced React 19 app: 26 routes, 17 feature modules, about 87% of today's code by line.",
      "Studio covers avatar creation from a training video or a photo, agents with custom LLMs or ElevenLabs agents, a knowledge base, conversation insights, text-to-video, analytics, Stripe billing, API keys, webhooks and TOTP MFA.",
      "Call app on LiveKit with session, credit and idle limits, live device switching, per-customer white-label themes and an iframe embed that reports call events to the host page.",
      "Branded backgrounds behind the avatar, replaced in the browser in real time with MediaPipe segmentation and a WebGL2 compositor.",
      "Bey design system: 67 components and about 300 Storybook stories, light and dark modes from Figma tokens, published to npm over 170 times.",
      "About 45 Playwright tests for Studio, plus a real end-to-end call test that runs against production about 14 times a day.",
    ],
    links: [{ label: "Beyond Presence website", href: "https://www.beyondpresence.ai" }],
    architecture: {
      summary:
        "I owned the three frontend pieces. Studio and the call app share one API and one design system. The call app never streams video from our servers directly: the API gives it a LiveKit token whose room config dispatches both the conversation agent and a GPU avatar worker into the same room.",
      tiers: [
        {
          label: "Frontends",
          nodes: [
            { name: "Studio", detail: "React 19 SPA on Firebase Hosting. Avatars, agents, conversations, billing and settings." },
            { name: "Call app", detail: "React and LiveKit. Shared links, iframe embeds and white-label calls for each customer." },
            { name: "Bey design system", detail: "@beydesign/storybook and @beydesign/tokens on npm. Storybook deployed to GitHub Pages." },
          ],
        },
        {
          label: "Platform API",
          nodes: [
            { name: "FastAPI on Cloud Run", detail: "Versioned API for both frontends, plus the public developer API." },
            { name: "Firebase Auth", detail: "Email, Google and TOTP MFA in Studio. Anonymous sign-in or a shared session cookie on calls." },
            { name: "Firestore", detail: "Agents, avatars, conversations and usage." },
          ],
        },
        {
          label: "Real-time",
          nodes: [
            { name: "LiveKit rooms", detail: "Created by the caller's token, which dispatches an agent and an avatar into the room." },
            { name: "Conversation agent", detail: "Speech-to-text, LLM and text-to-speech, running on LiveKit Cloud." },
            { name: "Avatar workers", detail: "GPU workers on GKE that render the avatar's video from the agent's speech." },
          ],
        },
        {
          label: "Services",
          nodes: [
            { name: "Cloud Storage + Cloudflare", detail: "Training videos, previews and generated videos, behind signed URLs." },
            { name: "Stripe", detail: "Plans, regional pricing, promo codes and pay-as-you-go credits." },
            { name: "ElevenLabs, Recall, Mixpanel, Sentry", detail: "Bring-your-own voice agents, meeting bots, analytics and error tracking." },
          ],
        },
      ],
    },
    decisions: [
      {
        title: "Avatar creation that survives a closed tab",
        problem:
          "Creating a custom avatar takes several steps: an upload of up to 1 GB, automated video checks, a consent recording, then training. Users close the tab halfway, and the backend can start training on its own.",
        solution:
          "The wizard is driven by the server's avatar state, a typed union from awaiting media to training, failed or rejected. One function maps any state back to a step, so opening an avatar's link resumes the draft where it stopped. Polling stops on its own once nothing is left to wait for. A new submission cancels any status request already in flight, so a stale response can't overwrite it.",
      },
      {
        title: "Replacing the avatar's background in the browser",
        problem:
          "Customers wanted a branded background behind the avatar, but the avatar arrives as a finished WebRTC video stream, and changing the GPU render pipeline for one cosmetic feature was off the table.",
        solution:
          "The incoming video track runs through WebCodecs streams frame by frame. MediaPipe segments each frame on the GPU, and a WebGL2 shader on an OffscreenCanvas blends in the background, refining the low-resolution mask against the image so hair and collars stay clean. Every frame is closed even when one fails, the model loads on the pre-call screen, and browsers without support get the plain video.",
      },
      {
        title: "One exit for every way a call ends",
        problem:
          "A call can end because the user hangs up, the session hits its time limit, credits run out, the user goes idle, the agent leaves or the room is wrong. Each path needs the same analytics, a host-page event and the right message.",
        solution:
          "The clocks for time, credits and idleness live in one call screen, and every exit goes through a single disconnect handler guarded by a ref, so it can only fire once. It records the call, posts a call-ended event to an embedding page and passes a typed reason to the post-call screen. Rejoining an ended call is blocked by checking the call ID against the room.",
      },
      {
        title: "White-label calls from a few brand colours",
        problem:
          "Enterprise customers embed calls in their own sites with their own colours and fonts, but they supply only a palette, and the result has to stay readable.",
        solution:
          "The call app turns a brand palette into about 40 semantic CSS tokens at runtime. It uses luminance to pick hover shades and text colour, lifts dark accents until they're legible, and accepts only http(s) asset URLs. Because the design system styles everything through tokens, its components follow the brand automatically. Where a label must stay white on a fixed tile, it's pinned to a primitive token.",
      },
      {
        title: "Dark mode without breaking light mode",
        problem:
          "The Figma tokens had separate light and dark colour sets, and components referenced light values directly. Two token sets also reused the same keys, so some headings quietly got the wrong line height.",
        solution:
          "The token build now writes one set of --color-* variables, with dark values under [data-theme=\"dark\"], and keeps the old names for existing consumers. A codemod moved 46 components onto semantic tokens whose light value is identical, so light mode stayed pixel-for-pixel the same. References now resolve within their own set first. Every token change publishes a new npm version from CI.",
      },
      {
        title: "Signed URLs without re-downloading",
        problem:
          "Avatar previews are served from signed URLs that expire, and every API response signs them again, so the browser saw a new URL each time and re-downloaded the same videos.",
        solution:
          "A persisted cache keeps each URL until its own Expires time, minus a 60-second margin. A freshly signed URL for the same file, matched by origin and path, doesn't replace one that is still valid, so thumbnails and videos load once across pages and visits.",
      },
    ],
    featured: true,
    preview: { src: "/work/beyond-presence/og.png" },
    media: [
      {
        src: "/work/beyond-presence/dashboard.webp",
        alt: "The Studio dashboard: quick actions to create an agent, a personal avatar, a video or an API key, and the stock avatar library.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Studio, where customers build avatars and agents.",
      },
      {
        src: "/work/beyond-presence/phone-agents.webp",
        alt: "Studio's agent list on a phone, with each agent shown on its avatar.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "Studio on a phone.",
      },
      {
        src: "/work/beyond-presence/avatar-wizard.mp4",
        poster: "/work/beyond-presence/avatar-wizard-poster.webp",
        alt: "Creating a video avatar: choosing the video-based type, naming it and uploading a recording, confirming the recording requirements, automated video checks passing, the identity step, then generating the avatar, which appears in the library as processing.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Avatar creation, driven by the server's avatar state so a draft can be resumed.",
      },
      {
        src: "/work/beyond-presence/phone-conversation.webp",
        alt: "A conversation's summary and AI overview in Studio on a phone.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "Conversation insights on a phone.",
      },
      {
        src: "/work/beyond-presence/call.mp4",
        poster: "/work/beyond-presence/call-poster.webp",
        alt: "A call in the browser: starting a conversation with the avatar Laura, the avatar joining, then typed messages in the chat panel that Laura answers on video and in text, and the post-call feedback screen.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "The call app: a real-time avatar over LiveKit, with chat alongside the video.",
      },
      {
        src: "/work/beyond-presence/phone-call.mp4",
        poster: "/work/beyond-presence/phone-call-poster.webp",
        alt: "The same call on a phone: the pre-call screen, the avatar full screen, and the chat sheet with Laura's replies.",
        device: "phone",
        width: 360,
        height: 800,
        caption: "Calls work the same on a phone.",
      },
      {
        src: "/work/beyond-presence/conversation-insights.webp",
        alt: "A conversation's page in Studio: the summary, an AI overview of the call, key insights with quotes, and suggested next steps.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Each conversation gets a summary, insights and next steps.",
      },
      {
        src: "/work/beyond-presence/phone-home.webp",
        alt: "The Studio dashboard on a phone, with quick actions stacked under the header.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "The dashboard on a phone.",
      },
      {
        src: "/work/beyond-presence/agent-detail.webp",
        alt: "An agent's settings in Studio: its avatar, language, session length, role and greeting, and attached knowledge files.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Agent settings: avatar, prompt, greeting and knowledge base.",
      },
      {
        src: "/work/beyond-presence/analytics.webp",
        alt: "Studio analytics: total, average and peak daily credits, and a bar chart of credits used per day across the billing cycle.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Usage analytics across the billing cycle.",
      },
      {
        src: "/work/beyond-presence/design-tokens.mp4",
        poster: "/work/beyond-presence/design-tokens-poster.webp",
        alt: "Bey design system components (navigation drawer, plan card, credits card, agent card, inputs, buttons, tabs and badges) switching between light and dark themes.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Bey design system components switching between light and dark through the token layer.",
      },
    ],
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
    via: "Codejunkie",
    role: "Lead React Native developer",
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
    preview: { src: "/work/curevision/og.png" },
    order: 2,
  },
  {
    slug: "salathub",
    name: "SalatHub",
    tagline: "Mosque platform: web, Android and Android TV",
    summary:
      "Mosque management platform (formerly PrayerBox): a web console for masjid admins, full-screen prayer-time displays that run 24/7 on masjid screens, the SalatHub TV app, and the Alkhairia mobile app for worshippers. Both apps are on Google Play.",
    platforms: ["web", "android", "android-tv"],
    client: "Alkhairia",
    via: "Codejunkie",
    role: "Lead developer",
    period: { start: "2024-04" },
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
      "Displays also run on older TV boxes (back to Chrome 83) and keep showing the last good data when offline.",
    ],
    links: [
      { label: "SalatHub website", href: "https://salathub.alkhairia.org" },
      { label: "Alkhairia on Google Play", href: "https://play.google.com/store/apps/details?id=com.alkhairia.dhikr" },
      { label: "SalatHub TV on Google Play", href: "https://play.google.com/store/apps/details?id=com.alkhairi.salathub" },
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
        title: "Screens that run unattended",
        problem:
          "Displays run 24/7 with nobody there to restart them, and some masjids use older Android boxes with outdated WebViews and flaky Wi-Fi.",
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
    media: [
      {
        src: "/work/salathub/tv-prayer-times.webp",
        alt: "SalatHub TV showing Masjid Ayesha Khairia's prayer times in a gold and navy Islamic theme, with the live clock and the next prayer.",
        device: "tv",
        width: 1920,
        height: 1080,
        caption: "SalatHub TV on Android TV, in the masjid's own theme.",
      },
      {
        src: "/work/salathub/alkhairia-timetable.mp4",
        poster: "/work/salathub/alkhairia-timetable-poster.webp",
        alt: "The Alkhairia app moving through a masjid's timetable for today and the next three days.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "A masjid's jamaat times, days ahead.",
      },
      {
        src: "/work/salathub/tv-display.mp4",
        poster: "/work/salathub/tv-display-poster.webp",
        alt: "The TV display rotating from a welcome slide to prayer times, the weather forecast and a hadith slide.",
        device: "tv",
        width: 960,
        height: 540,
        caption: "Slides rotate between prayer times, weather and the masjid's posts.",
      },
      {
        src: "/work/salathub/alkhairia-follow.mp4",
        poster: "/work/salathub/alkhairia-follow-poster.webp",
        alt: "Searching for a masjid in the Alkhairia app and following it.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "Follow a masjid; its times are saved for offline use.",
      },
      {
        src: "/work/salathub/admin-theme-editor.mp4",
        poster: "/work/salathub/admin-theme-editor-poster.webp",
        alt: "The admin console's theme editor switching a display between table, cards and spotlight layouts, into Urdu and Arabic, and to a new background.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Each screen gets its own theme, previewed live: layout, language, background and fonts.",
      },
      {
        src: "/work/salathub/alkhairia-map.mp4",
        poster: "/work/salathub/alkhairia-map-poster.webp",
        alt: "Panning a map of masjids around Islamabad and Rawalpindi and opening one.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "Nearby masjids on a map.",
      },
      {
        src: "/work/salathub/admin-prayer-timings.webp",
        alt: "The admin console's prayer times table for November.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Admin console: the month's prayer times, calculated or adjusted per masjid.",
      },
      {
        src: "/work/salathub/alkhairia-feed.mp4",
        poster: "/work/salathub/alkhairia-feed-poster.webp",
        alt: "Scrolling a masjid's feed of hadith posts.",
        device: "phone",
        width: 540,
        height: 1200,
        caption: "Posts from followed masjids.",
      },
      {
        src: "/work/salathub/admin-designer.webp",
        alt: "The slide designer showing Surah Al-Fatihah 1:1 in Arabic with Urdu and English translations.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Ayat and hadith slides designed in the browser, with translations.",
      },
      {
        src: "/work/salathub/alkhairia-settings.webp",
        alt: "Alkhairia's prayer reminder settings, with a warning to allow exact alarm timing.",
        device: "phone",
        width: 1080,
        height: 2400,
        caption: "Local prayer reminders, with the exact-alarm check.",
      },
    ],
    featured: true,
    preview: { src: "/work/salathub/og.png" },
    order: 3,
  },
  {
    slug: "mailcamp",
    name: "Mailcamp",
    tagline: "Email marketing platform",
    summary:
      "Full-stack email marketing platform for contacts, campaigns and engagement tracking, sending through a self-hosted Postal mail server, with Stripe billing.",
    platforms: ["web", "api"],
    client: "Hackta",
    role: "Sole developer (freelance)",
    period: { start: "2026-02", end: "2026-05" },
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
    links: [{ label: "Mailcamp website", href: "https://mailcamp.ai" }],
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
    media: [
      {
        src: "/work/mailcamp/dashboard.webp",
        alt: "The Mailcamp dashboard for a coffee roaster's account: plan usage for contacts, emails, domains and templates, and open, click, bounce and unsubscribe rates.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Dashboard: plan usage and engagement at a glance.",
      },
      {
        src: "/work/mailcamp/campaign-wizard.mp4",
        poster: "/work/mailcamp/campaign-wizard-poster.webp",
        alt: "Creating a campaign: typing the name, subject and preview text while an inbox preview updates, picking a sender, a template and two groups, then reviewing it before sending.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "The campaign wizard, with a live inbox preview and a review before sending.",
      },
      {
        src: "/work/mailcamp/template-editor.webp",
        alt: "The drag-and-drop template editor showing a coffee roaster's monthly newsletter.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Drag-and-drop email templates, built on Unlayer.",
      },
      {
        src: "/work/mailcamp/campaign-detail.webp",
        alt: "A sent campaign's report: delivery, open, click, bounce and unsubscribe rates, a delivery funnel and a recipient status chart.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Each campaign's delivery and engagement, from Postal events and tracking.",
      },
      {
        src: "/work/mailcamp/calendar.webp",
        alt: "A month calendar of sent campaigns and upcoming scheduled ones.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Sent and scheduled campaigns on a calendar.",
      },
      {
        src: "/work/mailcamp/analytics.mp4",
        poster: "/work/mailcamp/analytics-poster.webp",
        alt: "The analytics page moving from the month's overview and engagement chart to per-campaign rates, the most engaged contacts, and sending domain performance.",
        device: "browser",
        width: 1280,
        height: 800,
        caption: "Analytics across campaigns, audience and sending domains.",
      },
      {
        src: "/work/mailcamp/domain.webp",
        alt: "A verified sending domain with its SPF, DKIM, Return-Path and DMARC records, each marked verified.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Custom sending domains, with the DNS records to add and live checks.",
      },
      {
        src: "/work/mailcamp/templates.webp",
        alt: "A grid of saved email templates with rendered thumbnails.",
        device: "browser",
        width: 1440,
        height: 900,
        caption: "Saved templates, rendered as thumbnails.",
      },
    ],
    featured: true,
    preview: { src: "/work/mailcamp/og.png" },
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
      "Integrated Pakistan's FBR digital invoicing API into BetterBooks, an AI bookkeeping app: sandbox scenario testing, invoice validation and submission, and tax-rate and SRO lookups.",
      "Cut load times by 30% and improved Lighthouse scores across apps.",
      "Mentored 3+ junior developers and ran 100+ code reviews.",
    ],
    projects: ["beyond-presence", "salathub"],
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
      "Built Equal Access, an accessibility-first React Native app for people with disabilities in Pakistan, in four languages with right-to-left layouts and adjustable text size.",
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
    projects: ["mailcamp"],
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
