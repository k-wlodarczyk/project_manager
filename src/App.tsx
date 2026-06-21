import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="team/:teamSlug" element={<Dashboard />} />

        <Route
          path="team/:teamSlug/project/:projectSlug"
          element={<Dashboard />}
        />
        <Route
          path="team/:teamSlug/project/:projectSlug/module/:moduleSlug"
          element={<Dashboard />}
        />
        <Route
          path="team/:teamSlug/project/:projectSlug/testcase/:testcaseId"
          element={<Dashboard />}
        />
        <Route
          path="team/:teamSlug/project/:projectSlug/module/:moduleSlug/testcase/:testcaseId"
          element={<Dashboard />}
        />
      </Routes>
    </>
  );
}
