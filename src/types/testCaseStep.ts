export interface TestCaseStep {
  id: number;
  action: string;
  input: string;
  expected: string;
  order: number;
}

export interface TestCaseStepDB {
  id: number;
  action: string;
  input_data: string;
  expected_result: string;
  order: number;
  test_case_id: number;
}
