import { describe, expect, it } from "vitest";
import { searchCommands, type CommandItem } from "./command-search";

const items: CommandItem[] = [
  { id: "mailcamp", group: "Projects", label: "Mailcamp", keywords: ["Email marketing", "Express", "Postgres"] },
  { id: "salathub", group: "Projects", label: "SalatHub", keywords: ["Mosque", "React Native", "Android TV"] },
  { id: "curevision", group: "Projects", label: "CureVision", keywords: ["React Native", "Medical"] },
  { id: "theme-dark", group: "Actions", label: "Switch to dark theme", keywords: ["appearance"] },
];

const ids = (query: string) => searchCommands(items, query).map((item) => item.id);

describe("searchCommands", () => {
  it("returns everything in the original order for an empty query", () => {
    expect(ids("")).toEqual(["mailcamp", "salathub", "curevision", "theme-dark"]);
    expect(ids("   ")).toEqual(["mailcamp", "salathub", "curevision", "theme-dark"]);
  });

  it("is case-insensitive", () => {
    expect(ids("SALAT")).toEqual(["salathub"]);
  });

  it("matches keywords as well as labels", () => {
    expect(ids("mosque")).toEqual(["salathub"]);
  });

  it("requires every token to match", () => {
    expect(ids("react tv")).toEqual(["salathub"]);
    expect(ids("react banana")).toEqual([]);
  });

  it("ranks label matches above keyword-only matches", () => {
    const pool: CommandItem[] = [
      { id: "kw", group: "x", label: "Something", keywords: ["dark mode"] },
      { id: "label", group: "x", label: "Dark theme" },
    ];
    expect(searchCommands(pool, "dark").map((i) => i.id)).toEqual(["label", "kw"]);
  });

  it("ranks word-start matches above mid-word matches", () => {
    const pool: CommandItem[] = [
      { id: "mid", group: "x", label: "Hardware" },
      { id: "word", group: "x", label: "Switch to dark" },
    ];
    expect(searchCommands(pool, "ar").map((i) => i.id)).toEqual(["mid", "word"]);
    expect(searchCommands(pool, "dar").map((i) => i.id)).toEqual(["word"]);
  });

  it("keeps the original order for equal scores", () => {
    expect(ids("react native")).toEqual(["salathub", "curevision"]);
  });
});
