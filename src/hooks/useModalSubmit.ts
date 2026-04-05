import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

interface useModalSubmitProps {
  onSuccess: (data: any) => void;
  onCancel: () => void;
}

export function useModalSubmit({ onSuccess, onCancel }: useModalSubmitProps) {
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

  const submitTestCases = async (formData: any, steps: any[]) => {
    const { data: testCase, error } = await supabase
      .from("test_cases")
      .insert([
        {
          name: formData.name,
          description: formData.description,
          project_id: projectId,
          module_id: formData.moduleId,
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

  return { submitProject, submitModules, submitTestCases };
}
