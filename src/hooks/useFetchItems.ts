import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const SELECT_FIELDS = {
  projects: "id, name",
  modules: "id, name",
  test_cases: "id, name, module_id, description",
  test_case_steps: "id, action, expected_result",
};

export function useFetchItems(
  type: "projects" | "modules" | "test_cases" | "test_case_steps",
  viewMode?: "create" | "view" | "edit",
  objectId?: number,
) {
  const { projectId, moduleId } = useParams();

  const [data, setData] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (viewMode !== "view") return;

    const fields = SELECT_FIELDS[type];
    let query: any = supabase.from(type).select(fields);

    if (objectId && type !== "test_case_steps") {
      query = query.eq("id", objectId).single();
    } else {
      if (type === "modules") {
        query = query.eq("project_id", projectId);
      }

      if (type === "test_cases") {
        if (moduleId) {
          query = query.eq("module_id", moduleId);
        } else {
          query = query.eq("project_id", projectId);
        }
      }

      if (type === "test_case_steps") {
        query = query.eq("test_case_id", objectId);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${type}: `, error.message);
    } else {
      setData(data || []);
    }
  }, [type, projectId, moduleId, objectId, viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, refresh: fetchData };
}
