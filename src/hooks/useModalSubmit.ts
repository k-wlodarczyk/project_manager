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
  const { projectId, moduleId } = useParams();

  const submitProject = async (formData: any) => {
    if (!formData.name) return alert("Project name is required");

    const { data, error } = await supabase.from("projects").insert([
      {
        name: formData.name,
        description: formData.description,
        url: formData.link,
      },
    ]);

    if (!error) {
      onSuccess(data);
      onCancel();
    }
  };

  const updateProject = async (formData: any) => {};

  const submitModules = async (formData: any) => {
    const { data, error } = await supabase
      .from("modules")
      .insert([
        {
          name: formData.name,
          description: formData.description,
          project_id: projectId,
        },
      ])
      .select();

    if (!error) {
      onSuccess(data);
      onCancel();
    }
  };

  const updateModule = async (formData: any, id: number) => {};

  const submitTestCases = async (formData: any, steps: any[]) => {
    const { data: testCase, error } = await supabase
      .from("test_cases")
      .insert([
        {
          name: formData.name,
          description: formData.description,
          project_id: projectId,
          module_id: formData.module_id,
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
      expected: step.expected,
      order: index,
    }));

    const { error } = await supabase.rpc("update_test_case", {
      p_id: id,
      p_name: formData.name,
      p_description: formData.description,
      p_module_id: formData.module_id,
      p_steps: stepsToUpdate,
    });

    if (error) {
      return console.error(error);
    } else {
      onCancelEdit();
    }
  };

  return {
    submitProject,
    updateProject,
    submitModules,
    updateModule,
    submitTestCases,
    updateTestCase,
  };
}
