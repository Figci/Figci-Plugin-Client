import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Reset } from "styled-reset";

import Layout from "./components/Layout";
import Onboarding from "./components/Onboarding";
import NewProject from "./components/NewProject";
import ProjectVersion from "./components/ProjectVersion";
import ProjectPage from "./components/ProjectPage";
import Difference from "./components/Difference";

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Reset />
      <Routes>
        <Route path="/" exact element={<Onboarding />} />
        <Route element={<Layout />}>
          <Route path="/new" element={<NewProject />} />
          <Route path="/version" element={<ProjectVersion />} />
          <Route path="/page" element={<ProjectPage />} />
        </Route>
        <Route path="/result" element={<Difference />} />
      </Routes>
    </MemoryRouter>
  );
}

export default App;
