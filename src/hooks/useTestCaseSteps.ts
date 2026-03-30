import { useState } from "react";

export function useTestCaseSteps() {
  const [testCaseSteps, setTestCaseSteps] = useState([
    { id: 1, action: "", expected: "" },
  ]);

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

  return { testCaseSteps, newStep, updateSteps };
}
