import { expect, test } from "@playwright/test";

test("all public pages can be opened directly", async ({ page }) => {
  const pages = [
    { path: "/", link: "Home" },
    { path: "/about", link: "About" },
    { path: "/products", link: "Products" },
    { path: "/process", link: "Process" },
    { path: "/why-us", link: "Why us" },
    { path: "/contact", link: "Contact" },
  ];
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  for (const { path } of pages) {
    const response = await page.goto(path);
    expect(response?.status(), `direct route ${path}`).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
  }

  await page.goto("/contact");
  for (const { path, link } of pages) {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: link })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path.replace("/", "\\/")}$`));
    await expect(page.locator("main h1")).toBeVisible();
  }

  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("/products");
  const robots = await page.request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain("sitemap.xml");

  const unsupportedApiMethod = await page.request.get("/api/enquiry");
  expect(unsupportedApiMethod.status()).toBe(405);
  const unconfiguredEmail = await page.request.post("/api/enquiry", {
    headers: {
      "Idempotency-Key": `e2e-configuration-check-${Date.now()}`,
    },
    data: { name: "Test Visitor", email: "test@example.com", website: "" },
  });
  expect(unconfiguredEmail.status()).toBe(503);
  expect(await unconfiguredEmail.json()).toMatchObject({
    error: expect.stringContaining("Email delivery is not configured"),
  });

  expect(pageErrors).toEqual([]);
});

test("key layouts fit narrow and wide viewport widths without horizontal scrolling", async ({
  page,
}) => {
  for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/products");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(
      dimensions.content,
      `horizontal overflow at ${width}px`,
    ).toBeLessThanOrEqual(dimensions.viewport);
  }
});

test("theme persists and the mobile menu navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Beige theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "beige");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-palette", "beige");
  await page.getByRole("button", { name: "Menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Products" })
    .click();
  await expect(page).toHaveURL(/\/products$/);
});

test("size configurator updates values and carries selected dimensions to contact", async ({
  page,
}) => {
  await page.goto("/products");
  await page.getByRole("button", { name: "2.5 / 3.5" }).click();
  await expect(page.getByText("0.50 mm").first()).toBeVisible();
  await page.getByRole("link", { name: "Request this size" }).click();
  await expect(page).toHaveURL(/copperOD=2.50/);
  await expect(page.getByLabel("Copper OD (mm)")).toHaveValue("2.5");
  await expect(page.getByLabel("Overall OD (mm)")).toHaveValue("3.5");
});

test("wire bend controls pause, shape, and resume the animation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Pause" }).click();
  const wire = page.locator(".bend-box [data-wire-layer]").nth(1);
  const initialShape = await wire.getAttribute("d");

  await page.locator("#bend-control").press("End");
  await expect(page.locator("#bend-control")).toHaveValue("100");
  await expect.poll(() => wire.getAttribute("d")).not.toBe(initialShape);

  await page.getByRole("button", { name: "Let it flow" }).click();
  await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator("#bend-control")).toHaveValue("0");
});

test("wire bend slider remains usable with reduced motion enabled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator("#bend-control").press("End");
  await expect(
    page.locator(".bend-box [data-wire-layer]").nth(1),
  ).toHaveAttribute("d", "M 110 150 C 280 260, 520 40, 690 150");
});

test("contact form reports validation and displays provider acceptance", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByText("Please enter your full name.")).toBeVisible();
  await page.getByLabel("Full Name").fill("Test Customer");
  await page.getByLabel("Email Address").fill("test@example.com");
  await page.route("**/api/enquiry", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        accepted: true,
        message: "Your enquiry was accepted by our email provider.",
      }),
    });
  });
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "accepted by our email provider",
  );
});

test("contact form displays a retryable failure", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Full Name").fill("Test Customer");
  await page.getByLabel("Phone Number").fill("+1 555 555 5555");
  await page.route("**/api/enquiry", async (route) => {
    await route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "We could not send your enquiry right now. Please try again later.",
      }),
    });
  });
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Please try again later",
  );
  await expect(
    page.getByRole("button", { name: "Send enquiry" }),
  ).toBeEnabled();
});
