import { create } from "zustand";

const projectStore = set => ({
  project: {
    projectKey: null,
    beforeDate: null,
    beforeVersion: null,
    afterDate: null,
    afterVersion: null,
    pageId: null,
  },
  setProject: newProject =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        ...newProject,
      },
    })),
  clearPageId: () =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        pageId: null,
      },
    })),
  clearProjectVersion: () =>
    set(state => ({
      ...state,
      project: {
        ...state.project,
        beforeDate: null,
        beforeVersion: null,
        afterDate: null,
        afterVersion: null,
        pageId: null,
      },
    })),
  clearProject: () =>
    set(state => ({
      ...state,
      project: {
        projectKey: null,
        beforeDate: null,
        beforeVersion: null,
        afterDate: null,
        afterVersion: null,
        pageId: null,
      },
    })),
});

const useProjectStore = create(projectStore);

export default useProjectStore;
