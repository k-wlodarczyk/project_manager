import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const SELECT_FIELDS = {
  projects: "id, title",
  modules: "id, title",
  test_cases: "id, action",
};

export function useFetchItems(type: "projects" | "modules" | "test_cases") {
  const { projectId, moduleId } = useParams();

  const [data, setData] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const fields = SELECT_FIELDS[type];
    let query = supabase.from(type).select(fields);

    if (type === "modules") {
      query = query.eq("project_id", projectId);
    }

    if (type === "test_cases") {
      if (moduleId) {
        query.eq("module_id", moduleId);
      } else {
        query = query.eq("project_id", projectId);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${type}: `, error.message);
    } else {
      setData(data || []);
    }
  }, [type, projectId, moduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, refresh: fetchData };
}
