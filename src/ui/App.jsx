import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Reset } from "styled-reset";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Onboarding from "./components/Onboarding";
import ProjectVersion from "./components/ProjectVersion";
import Difference from "./components/Difference";

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Reset />
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/onboarding" exact element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/version" element={<ProjectVersion />} />
          <Route path="/result" element={<Difference />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
