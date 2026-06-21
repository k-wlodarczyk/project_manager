import { useCallback, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const SELECT_FIELDS = {
  teams: "id, name, slug",
  projects: "id, name, slug, teams!inner(slug)",
  modules: "id, name, order, slug, projects!inner(slug)",
  test_cases:
    "id, name, module_id, project_id, description, status, execution, order_in_module, projects!inner(slug), modules!inner(slug)",
  test_case_steps: "id, action, input_data, expected_result",
};

export function useFetchItems(
  type: "teams" | "projects" | "modules" | "test_cases" | "test_case_steps",
  viewMode?: "create" | "view" | "edit" | "copy",
  objectId?: number,
  range?: "all",
) {
  const { projectSlug, moduleSlug, teamSlug } = useParams();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function getQueryProjects(query: any) {
    return query.eq("teams.slug", teamSlug).order("id", { ascending: true });
  }

  function getQueryModules(query: any) {
    // const searchProject = projectId || -1;
    return query
      .eq("projects.slug", projectSlug)
      .order("order", { ascending: true });
  }

  function getQueryTestCases(query: any) {
    // const searchProject = projectId || -1;
    // const searchModule = moduleId || -1;
    query =
      moduleSlug && !range
        ? query.eq("modules.slug", moduleSlug)
        : query.eq("projects.slug", projectSlug);
    return query
      .order("module_id", { ascending: true })
      .order("order_in_module", { ascending: true });
  }

  const fetchData = useCallback(async () => {
    if (viewMode !== "view") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fields = SELECT_FIELDS[type];
    let query: any = supabase.from(type).select(fields);

    if (objectId && type !== "test_case_steps") {
      query = query.eq("id", objectId).single();
    } else {
      if (type === "projects") {
        query = getQueryProjects(query);
      }

      if (type === "modules") {
        query = getQueryModules(query);
      }

      if (type === "test_cases") {
        query = getQueryTestCases(query);
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

    setIsLoading(false);
  }, [type, projectSlug, moduleSlug, objectId, viewMode, teamSlug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, refresh: fetchData };
}
