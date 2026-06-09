import { useCallback } from "react";
import { supabase } from "../supabaseClient";

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
    async (newStatus: "To Do" | "Passed" | "Failed" | "Skipped") => {
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
      return data;
    },
    [checkedTestCases],
  );

  return { deleteTestCases, updateTestCasesStatus };
}
