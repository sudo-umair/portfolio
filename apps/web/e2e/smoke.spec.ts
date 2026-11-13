import { expect, test, type Page } from "@playwright/test";

/** No page should ever scroll sideways. */
async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(innerWidth);
}

test.describe("homepage", () => {
  test("shows the name, the project index and no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Muhammad\s*Umair/i);

    const work = page.getByRole("region", { name: "Selected work" });
    await expect(work.getByRole("link")).toHaveCount(4);
    await expectNoHorizontalScroll(page);
  });

  test("opens a case study from the project index", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /SalatHub/ }).first().click();

    await expect(page).toHaveURL(/\/work\/salathub$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("SalatHub");
    await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Next project" })).toBeVisible();
    await expectNoHorizontalScroll(page);
  });
});

test.describe("not found", () => {
  for (const path of ["/work/not-a-project", "/definitely-not-a-page"]) {
    test(`${path} returns a real 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    });
  }
});

test.describe("command palette", () => {
  test("opens from the header, filters, and navigates with the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Search and commands" }).click();

    const input = page.getByRole("combobox", { name: /Search projects/ });
    await expect(input).toBeFocused();
    await input.fill("mail");
    await expect(page.getByRole("option").first()).toContainText("Mailcamp");

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/mailcamp$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("opens with the keyboard shortcut and closes with Escape", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard shortcuts are a desktop feature");
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+K");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("theme", () => {
  test("remembers an explicit choice across reloads", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /theme\. Switch to/ });

    await toggle.click(); // system -> light
    await toggle.click(); // light -> dark
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("contact form", () => {
  // Validation only: never submits a valid message, so no database writes or emails.
  test("shows a linked error for each invalid field and focuses the first", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Send message" }).click();

    const name = page.getByLabel("Name");
    await expect(name).toBeFocused();
    await expect(name).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Write at least 10 characters.")).toBeVisible();

    // The typed value survives React's form reset.
    await expect(page.getByLabel("Email")).toHaveValue("not-an-email");
  });
});

test.describe("public API", () => {
  test("lists projects with open CORS", async ({ request }) => {
    const response = await request.get("/api/projects");
    expect(response.ok()).toBe(true);
    expect(response.headers()["access-control-allow-origin"]).toBe("*");
    const body = await response.json();
    expect(body.count).toBe(4);
  });

  test("returns a JSON 404 for unknown projects", async ({ request }) => {
    const response = await request.get("/api/projects/not-a-project");
    expect(response.status()).toBe(404);
    expect(await response.json()).toMatchObject({ error: { code: "not_found" } });
  });
});
