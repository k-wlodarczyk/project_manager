import { useCallback } from "react";
import { supabase } from "../supabaseClient";
import * as XLSX from "xlsx";
import type { TestCaseStatus } from "../types/testCase";

export function useTestCases(checkedTestCases: number | number[] | undefined) {
  const idsAsArray =
    checkedTestCases === undefined
      ? []
      : Array.isArray(checkedTestCases)
        ? checkedTestCases
        : [checkedTestCases];

  const deleteTestCases = useCallback(async () => {
    if (idsAsArray.length === 0) {
      console.error("Empty array");
      return;
    }

    const { data, error } = await supabase
      .from("test_cases")
      .delete()
      .in("id", idsAsArray)
      .select();

    if (error) console.error(error);
    return data;
  }, [checkedTestCases]);

  const updateTestCasesStatus = useCallback(
    async (newStatus: TestCaseStatus, shouldResetExecutionDate: boolean) => {
      if (idsAsArray.length === 0) {
        console.error("Empty array");
        return;
      }

      const { data, error } = await supabase
        .from("test_cases")
        .update({ status: newStatus })
        .in("id", idsAsArray)
        .select();

      if (error) console.error(error);

      if (shouldResetExecutionDate) {
        await resetExecutionDate();
      }
      return data;
    },
    [checkedTestCases],
  );

  const resetExecutionDate = async () => {
    if (idsAsArray.length === 0) {
      console.error("Empty array");
      return;
    }

    const { data, error } = await supabase
      .from("test_cases")
      .update({ status_change_date: null })
      .in("id", idsAsArray)
      .select();

    if (error) console.error(error);
    
    return data;
  };

  const exportTestCasesToXlsx = useCallback(async () => {
    if (idsAsArray.length === 0) {
      console.error("Empty array");
      return;
    }

    const { data: testCases, error } = await supabase
      .from("test_cases")
      .select(
        `
      id, 
      name,
      module_id,
      test_case_steps (
        id,
        action,
        input_data,
        expected_result,
        order
      )
    `,
      )
      .in("id", idsAsArray);

    if (error) {
      console.error("Error fetching data:", error);
      return;
    }

    if (!testCases || testCases.length === 0) return;

    const sortedTestCases = [...testCases].sort((a, b) => {
      const modA = a.module_id ?? 0;
      const modB = b.module_id ?? 0;
      return modA - modB;
    });

    const rows: any[] = [];
    let testCaseNumber = 0;

    sortedTestCases.forEach((tc) => {
      testCaseNumber++;

      const stepsArray = tc.test_case_steps || [];

      if (stepsArray.length === 0) {
        rows.push({
          "TC ID": testCaseNumber,
          "Test case name": tc.name || "",
          "Step id": "",
          Action: "",
          "Input data": "",
          "Expected result": "",
        });
      } else {
        const sortedSteps = [...stepsArray].sort(
          (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
        );

        sortedSteps.forEach((step: any, index: number) => {
          rows.push({
            "TC ID": testCaseNumber,
            "Test case name": tc.name || "",
            "Step id": index + 1,
            Action: step.action || "",
            "Input data": step.input_data || "",
            "Expected result": step.expected_result || "",
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kroki Testowe");

    XLSX.writeFile(workbook, `tc_export_steps_${Date.now()}.xlsx`);
  }, [idsAsArray]);

  return {
    deleteTestCases,
    updateTestCasesStatus,
    resetExecutionDate,
    exportTestCasesToXlsx,
  };
}
