import { useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useTestCases(checkedTestCases: number[]) {
  const deleteTestCases = useCallback(async () => {
    const { data, error } = await supabase
      .from("test_cases")
      .delete()
      .in("id", checkedTestCases)
      .select();

    if (error) console.error(error);
    return data;
  }, [checkedTestCases]);

  return { deleteTestCases };
}
