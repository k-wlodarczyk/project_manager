export type TestCaseStatus = "To Do" | "Passed" | "Failed" | "Skipped";
export type TestCaseExecution = "Manual" | "Automated";

export interface TestCaseFormData {
  name: string;
  description: string;
  module_id: number | string;
  status: TestCaseStatus;
  execution: TestCaseExecution;
}

export interface TestCase extends TestCaseFormData {
  id: number;
  project_id: number;
  order_in_module: number;
}

export interface TestCaseWithRelations extends TestCase {
  modules: {
    slug: string;
  };
}

export interface TestCaseDB {
  id: number;
  name: string;
  status: "To Do" | "Passed" | "Failed" | "Skipped";
  project_id: number;
  module_id: number;
  order_in_module: number;
}
