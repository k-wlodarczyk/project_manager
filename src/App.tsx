import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import Header from "./components/Header/Header";

export default function App() {
  return (
    <>
      <Header>Project Manager</Header>

      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/project/:projectId" element={<Dashboard />} />
        <Route
          path="/project/:projectId/module/:moduleId"
          element={<Dashboard />}
        />
      </Routes>
    </>
  );
}
