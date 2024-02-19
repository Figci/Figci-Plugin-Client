import { create } from "zustand";

const projectStore = set => ({
  project: {
    beforeVersionId: null,
    afterVersionId: null,
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
        beforeVersionId: null,
        afterVersionId: null,
      },
    })),
});

const useProjectStore = create(projectStore);

export default useProjectStore;
