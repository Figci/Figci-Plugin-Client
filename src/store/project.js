import { create } from "zustand";

const projectStore = set => ({
  project: {
    beforeVersion: null,
    afterVersion: null,
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
        beforeVersion: null,
        afterVersion: null,
      },
    })),
});

const useProjectStore = create(projectStore);

export default useProjectStore;
