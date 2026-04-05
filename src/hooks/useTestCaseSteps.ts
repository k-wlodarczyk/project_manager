import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useTestCaseSteps(fetchedSteps?: any[]) {
  const [testCaseSteps, setTestCaseSteps] = useState(() => {
    if (fetchedSteps && fetchedSteps.length > 0) {
      return fetchedSteps.map((step) => ({
        id: step.id,
        action: step.action,
        expected: step.expected_result,
      }));
    } else {
      return [{ id: 1, action: "", expected: "" }];
    }
  });

  useEffect(() => {
    if (fetchedSteps && fetchedSteps.length > 0) {
      const formattedSteps = fetchedSteps.map((step) => ({
        id: step.id,
        action: step.action,
        expected: step.expected_result,
      }));
      setTestCaseSteps(formattedSteps);
    } else {
      setTestCaseSteps([{ id: 1, action: "", expected: "" }]);
    }
  }, [fetchedSteps]);

  function newStep() {
    const newStep = {
      id: testCaseSteps.length + 1,
      action: "",
      expected: "",
    };

    setTestCaseSteps([...testCaseSteps, newStep]);
  }

  function updateSteps(id: number, field: string, value: string) {
    setTestCaseSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  }

  const fetchSteps = useCallback(async (testCaseId: number) => {
    const { data, error } = await supabase
      .from("test_case_steps")
      .select("id, action, expected_result")
      .eq("test_case_id", testCaseId);

    return data || [];
  }, []);

  return { testCaseSteps, newStep, updateSteps, fetchSteps };
}
