import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

const SELECT_FIELDS = {
  teams: "id, name, slug",
  projects: "id, name, slug, teams!inner(slug)",
  modules: "id, name, order, slug, projects!inner(slug)",
  test_cases:
    "id, name, module_id, project_id, description, status, execution, order_in_module, projects!inner(slug), modules!inner(slug)",
  test_case_steps: "id, action, input_data, expected_result, order",
};

export function useFetchItems(
  type: "teams" | "projects" | "modules" | "test_cases" | "test_case_steps",
  viewMode?: "create" | "view" | "edit" | "copy",
  objectId?: number,
  range?: "all",
) {
  const { projectSlug, moduleSlug, teamSlug } = useParams();

  const queryKey = [
    type,
    { teamSlug, projectSlug, moduleSlug, objectId, viewMode, range },
  ];

  function getQueryProjects(query: any) {
    return query.eq("teams.slug", teamSlug).order("id", { ascending: true });
  }

  function getQueryModules(query: any) {
    return query
      .eq("projects.slug", projectSlug)
      .order("order", { ascending: true });
  }

  function getQueryTestCases(query: any) {
    query =
      moduleSlug && !range
        ? query.eq("modules.slug", moduleSlug)
        : query.eq("projects.slug", projectSlug);
    return query
      .order("module_id", { ascending: true })
      .order("order_in_module", { ascending: true });
  }

  function getQueryTestCaseSteps(query: any) {
    return query
      .eq("test_case_id", objectId)
      .order("order", { ascending: true });
  }

  const fetchData = async () => {
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
        // query = query.eq("test_case_id", objectId);
        query = getQueryTestCaseSteps(query);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled: viewMode === "view",
    placeholderData: keepPreviousData,
  });

  return { data, isLoading, refresh: refetch };
}
