import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

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

  const submitProject = async (formData: any) => {
    const { data: teamData, error: teamError } = await supabase
      .from("teams")
      .select("id")
      .eq("slug", teamSlug)
      .single();

    if (teamError || !teamData) {
      return console.error("Could not find team with this slug", teamError);
    }

    if (!formData.projectName) return alert("Project name is required");

    const { data, error } = await supabase.from("projects").insert([
      {
        name: formData.projectName,
        description: formData.description,
        url: formData.link,
        team_id: teamData.id,
      },
    ]);

    if (!error) {
      onSuccess(data);
      onCancel();
    }
  };

  const updateProject = async (_formData: any) => {};

  const submitModules = async (formData: any) => {
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

    if (!error) {
      onSuccess(data);
      onCancel();
    }
  };

  const updateModule = async (formData: any, moduleId: number) => {
    const { data, error } = await supabase
      .from("modules")
      .update({ name: formData.moduleName })
      .eq("id", moduleId)
      .select();

    if (!error) {
      onSuccess(data);
      onCancel();
    }
  };

  const deleteModule = async (moduleId: number) => {
    const { data, error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId)
      .select();

    if (!error) {
      console.log("success");
      onSuccess(data);
      onCancel();
    }
  };

  const submitTestCases = async (formData: any, steps: any[]) => {
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

    const { data, error: stepsError } = await supabase
      .from("test_case_steps")
      .insert(stepsToInsert);

    if (stepsError) {
      console.error(stepsError.message);
    } else {
      onSuccess(data);
      onCancel();
    }
  };

  const updateTestCase = async (formData: any, steps: any[], id: number) => {
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
