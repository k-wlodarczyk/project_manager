import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TestCaseFormData } from "../types/testCase";

interface useModalSubmitProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
  onCancelEdit: () => void;
}

export function useModalSubmit({
  onSuccess,
  onCancel,
  onCancelEdit,
}: useModalSubmitProps) {
  const { projectSlug, teamSlug } = useParams();
  const queryClient = useQueryClient();

  const { mutate: submitProject } = useMutation({
    mutationFn: async (formData: any) => {
      const { data: teamData, error: teamError } = await supabase
        .from("teams")
        .select("id")
        .eq("slug", teamSlug)
        .single();

      if (teamError || !teamData) {
        return console.error("Could not find team with this slug", teamError);
      }

      if (!formData.projectName) return alert("Project name is required");

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            name: formData.projectName,
            description: formData.description,
            url: formData.link,
            team_id: teamData.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateProject = async (_formData: any) => {};

  const { mutate: submitModules } = useMutation({
    mutationFn: async (formData: any) => {
      const { data: projectData } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

      const { data: highestOrderModule, error: fetchError } = await supabase
        .from("modules")
        .select("order")
        .eq("project_id", projectData?.id)
        .order("order", { ascending: false })
        .limit(1);

      if (fetchError) {
        return console.error("Error fetching order:", fetchError);
      }

      const nextOrder =
        highestOrderModule && highestOrderModule.length > 0
          ? (highestOrderModule[0].order ?? -1) + 1
          : 0;

      const { data, error } = await supabase
        .from("modules")
        .insert([
          {
            name: formData.moduleName,
            description: formData.description,
            project_id: projectData?.id,
            order: nextOrder,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      onSuccess(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: updateModule } = useMutation({
    mutationFn: async ({
      formData,
      moduleId,
    }: {
      formData: any;
      moduleId: number;
    }) => {
      const { data, error } = await supabase
        .from("modules")
        .update({ name: formData.moduleName })
        .eq("id", moduleId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });
      onSuccess(data);
    },
  });

  const { mutate: deleteModule } = useMutation({
    mutationFn: async (moduleId: number) => {
      const { data, error } = await supabase
        .from("modules")
        .delete()
        .eq("id", moduleId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["modules"] });

      onSuccess(data);
      onCancel();
    },
    onError: (error) => {
      console.error(error.message);
    },
  });

  const { mutate: submitTestCases } = useMutation({
    mutationFn: async ({
      formData,
      steps,
    }: {
      formData: TestCaseFormData;
      steps: any[];
    }) => {
      const { data: projectData } = await supabase
        .from("projects")
        .select("id")
        .eq("slug", projectSlug)
        .single();

      const { data: highestOrderTestCase, error: fetchError } = await supabase
        .from("test_cases")
        .select("order_in_module")
        .eq("project_id", projectData?.id)
        .eq("module_id", formData.module_id)
        .order("order_in_module", { ascending: false })
        .limit(1);

      if (fetchError) {
        return console.error(
          "Error fetching highest test case order:",
          fetchError,
        );
      }

      const nextOrder =
        highestOrderTestCase && highestOrderTestCase.length > 0
          ? (highestOrderTestCase[0].order_in_module ?? -1) + 1
          : 0;

      const { data: testCase, error } = await supabase
        .from("test_cases")
        .insert([
          {
            name: formData.name,
            description: formData.description,
            project_id: projectData?.id,
            module_id: formData.module_id,
            status: formData.status,
            execution: formData.execution,
            order_in_module: nextOrder,
          },
        ])
        .select()
        .single();

      if (error) {
        return console.error(error);
      }

      const stepsToInsert = steps.map((step: any, index: number) => ({
        test_case_id: testCase.id,
        action: step.action,
        input_data: step.input,
        expected_result: step.expected,
        order: index,
      }));

      const { data: insertedSteps, error: stepsError } = await supabase
        .from("test_case_steps")
        .insert(stepsToInsert)
        .select();

      if (stepsError) throw new Error(stepsError.message);

      return { testCase, insertedSteps };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["test_cases"] });
      onSuccess(data);
      onCancel();
    },
    onError: (error) => {
      console.error("something went wrong during inserting test case: ", error);
    },
  });

  const updateTestCase = async (
    formData: TestCaseFormData,
    steps: any[],
    id: number,
  ) => {
    const stepsToUpdate = steps.map((step, index) => ({
      action: step.action,
      input: step.input,
      expected: step.expected,
      order: index,
    }));

    const { data, error } = await supabase.rpc("update_test_case_old", {
      p_id: id,
      p_name: formData.name,
      p_description: formData.description,
      p_module_id: formData.module_id,
      p_status: formData.status,
      p_execution: formData.execution,
      p_steps: stepsToUpdate,
    });

    if (error) {
      return console.error(error);
    } else {
      onSuccess(data);
      onCancelEdit();
    }
  };

  return {
    submitProject,
    updateProject,
    submitModules,
    updateModule,
    deleteModule,
    submitTestCases,
    updateTestCase,
  };
}
