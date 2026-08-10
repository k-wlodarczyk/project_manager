import { Locator, Page } from "@playwright/test";

export class SidebarPage {
  readonly page: Page;
  readonly newProjectBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newProjectBtn = page.getByRole("button", { name: "new project" });
  }

  async clickNewProjectBtn() {
    await this.newProjectBtn.click();
  }
}
