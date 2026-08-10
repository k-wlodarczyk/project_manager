import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { SidebarPage } from "./pages/SidebarPage";
import { HeaderPage } from "./pages/HeaderPage";

test.describe("PROJECTS", () => {
  let sidebar: SidebarPage;
  let header: HeaderPage;
  test.beforeEach(async ({ page }) => {
    await page.goto("localhost:5173");

    sidebar = new SidebarPage(page);
    header = new HeaderPage(page);
  });

  test("Clicking NEW PROJECT button causes new project popup is visible", async ({
    page,
  }) => {
    await sidebar.clickNewProjectBtn();
    await expect(page.getByTestId("project-modal")).toBeVisible();
  });

  test("Created project is automatically set as an active project", async ({
    page,
  }) => {
    const projectName = faker.company.catchPhrase();
    await header.setTeam("test");
    await sidebar.clickNewProjectBtn();
    await page.getByLabel("Project Name").fill(projectName);
    await page.getByRole("button", { name: "Create" }).click();
    await header.isActiveProject(projectName);
    // await header.shouldHaveNoOfElements(10);
  });
});

test("has project manager title", async ({ page }) => {
  await page.goto("localhost:5173");

  await expect(page).toHaveTitle("project-manager");
});
