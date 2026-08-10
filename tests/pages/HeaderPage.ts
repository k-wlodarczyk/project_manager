import { expect, Locator, Page } from "@playwright/test";

export class HeaderPage {
  readonly page: Page;
  readonly teamsListBtn: Locator;
  readonly projectsListBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectsListBtn = page.getByTestId("projects-trigger");
    this.teamsListBtn = page.getByTestId("teams-trigger");
  }

  async openTeamsList() {
    await this.teamsListBtn.click();
  }

  async openProjectsList() {
    await this.projectsListBtn.click();
  }

  async setTeam(teamName: string) {
    await this.openTeamsList();
    await this.page
      .getByTestId("teams-list")
      .getByRole("option", { name: teamName })
      .click();
  }

  async hasProject(projectName: string) {
    const projectOption = this.page
      .getByTestId("projects-list")
      .getByRole("option", { name: projectName });

    await expect(projectOption).toBeVisible();
  }

  async isActiveProject(projectName: string) {
    await expect(this.page.getByTestId("projects-trigger")).toHaveText(
      projectName.toUpperCase(),
    );
  }

  async getProjectsList() {}

  async shouldHaveNoOfElements(counter: number) {
    await expect(
      this.page.getByTestId("projects-list").getByRole("option"),
    ).toHaveCount(counter);
  }
}
