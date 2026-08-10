import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import type { TestCaseDB } from "../types/testCase";

export function useReorderItems() {
  const queryClient = useQueryClient();

  const { mutateAsync: reorderModules } = useMutation({
    mutationFn: async ({
      reorderedModules,
      projectId,
    }: {
      reorderedModules: any[];
      projectId: number;
    }) => {
      const payload = reorderedModules.map((module: any) => ({
        id: module.id,
        name: module.name,
        project_id: Number(projectId),
        order: module.order,
      }));

      const { data, error } = await supabase
        .from("modules")
        .upsert(payload, { onConflict: "id" });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["modules"] });
    },
    onError: (error: any) => {
      throw new Error(
        `something went wrong during reordering modules: ${error.message}`,
      );
    },
  });

  const { mutateAsync: reorderTestCases } = useMutation({
    mutationFn: async ({
      reorderedTestCases,
      projectId,
    }: {
      reorderedTestCases: any[];
      projectId: number;
    }) => {
      const payload = reorderedTestCases.map(
        (tc: any) =>
          ({
            id: tc.id,
            name: tc.name,
            status: tc.status,
            project_id: Number(projectId),
            module_id: Number(tc.module_id),
            order_in_module: tc.order_in_module,
          }) satisfies TestCaseDB,
      );

      const { data, error } = await supabase
        .from("test_cases")
        .upsert(payload, { onConflict: "id" });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({ queryKey: ["test_cases"] });
    },
    onError: (error) => {
      throw new Error(
        `something went wrong during reordering test cases: ${error.message}`,
      );
    },
  });

  return { reorderModules, reorderTestCases };
}
