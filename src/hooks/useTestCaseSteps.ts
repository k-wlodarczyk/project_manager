import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import type { TestCaseStep } from "../types/testCaseStep";

export function useTestCaseSteps(
  fetchedSteps?: any[],
  viewMode?: string,
  objectId?: number,
) {
  const [testCaseSteps, setTestCaseSteps] = useState(() => {
    if (fetchedSteps && fetchedSteps.length > 0) {
      return fetchedSteps.map(
        (step) =>
          ({
            id: step.id,
            action: step.action,
            input: step.input_data,
            expected: step.expected_result,
            order: step.order,
          }) satisfies TestCaseStep,
      );
    } else {
      return [
        {
          id: 1,
          action: "",
          input: "",
          expected: "",
          order: 0,
        } satisfies TestCaseStep,
      ];
    }
  });

  useEffect(() => {
    if (fetchedSteps && fetchedSteps.length > 0) {
      const formattedSteps = fetchedSteps.map(
        (step) =>
          ({
            id: step.id,
            action: step.action,
            input: step.input_data,
            expected: step.expected_result,
            order: step.order,
          }) satisfies TestCaseStep,
      );
      setTestCaseSteps(formattedSteps);
    } else {
      setTestCaseSteps([
        {
          id: 1,
          action: "",
          input: "",
          expected: "",
          order: 0,
        } satisfies TestCaseStep,
      ]);
    }
  }, [fetchedSteps, viewMode, objectId]);

  function getTempId() {
    return -(Date.now() + Math.floor(Math.random() * 1000));
  }

  function getOrderIndex() {
    return testCaseSteps ? testCaseSteps.length : 0;
  }

  function newStep() {
    const newStep = {
      id: getTempId(),
      action: "",
      input: "",
      expected: "",
      order: getOrderIndex(),
    } satisfies TestCaseStep;

    setTestCaseSteps((prevSteps) => [...prevSteps, newStep]);
  }

  function newStepAfterIndex(index: number) {
    const newStep = {
      id: getTempId(),
      action: "",
      input: "",
      expected: "",
      order: getOrderIndex(),
    } satisfies TestCaseStep;

    setTestCaseSteps((prevSteps) => {
      const arr = [...prevSteps];
      arr.splice(index + 1, 0, newStep);
      return arr;
    });
  }

  function updateSteps(id: number, field: string, value: string) {
    setTestCaseSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  }

  const fetchSteps = useCallback(async (testCaseId: number) => {
    const { data } = await supabase
      .from("test_case_steps")
      .select("id, action, input_data, expected_result, order")
      .eq("test_case_id", testCaseId)
      .order("order", { ascending: true });

    return data || [];
  }, []);

  function deleteStep(id: number) {
    setTestCaseSteps((prevSteps) => {
      const filteredSteps = prevSteps.filter((step) => step.id !== id);

      return filteredSteps;
    });
  }

  function reorderSteps(stepsWithNewOrder: TestCaseStep[]) {
    setTestCaseSteps(stepsWithNewOrder);
  }

  return {
    testCaseSteps,
    newStep,
    newStepAfterIndex,
    updateSteps,
    fetchSteps,
    deleteStep,
    reorderSteps,
  };
}
