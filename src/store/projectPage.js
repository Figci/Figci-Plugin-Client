import { create } from "zustand";

const pageStore = set => {
  return {
    byPageIds: {},
    allPageIds: [],
    setPages: pageList => {
      const pageIds = [];

      pageList.forEach(page => {
        const { pageId, pageName } = page;

        pageIds.push(pageId);

        set(state => {
          state.byPageIds = {
            ...state.byPageIds,
            [pageId]: pageName,
          };

          return state;
        });
      });

      set(state => {
        state.allPageIds = pageIds;

        return state;
      });
    },
    clearPages: () => {
      set(state => {
        state.byPageIds = {};
        state.allPageIds = [];

        return state;
      });
    },
  };
};

const usePageListStore = create(pageStore);

export default usePageListStore;
