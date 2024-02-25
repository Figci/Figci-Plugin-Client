import { create } from "zustand";

const projectStore = set => ({
  project: {
    projectKey: "",
    beforeVersionId: "",
    afterVersionId: "",
  },
  setProject: newProject =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        ...newProject,
      },
    })),
  clearProject: () =>
    set(state => ({
      ...state,
      project: {
        projectKey: "",
        beforeVersionId: "",
        afterVersionId: "",
      },
    })),
});

const useProjectStore = create(projectStore);

export default useProjectStore;
