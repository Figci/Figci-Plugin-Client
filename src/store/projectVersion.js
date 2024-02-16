import { create } from "zustand";

const store = set => {
  return {
    byDates: {},
    allDates: [],
    setVersion: versionList => {
      versionList.forEach(version => {
        const { id, created_at: createdAt, label } = version;
        const [createdDate, createdTime] = createdAt.split("T");

        return set(state => {
          if (!state.byDates[createdDate]) {
            state.byDates[createdDate] = [];
          }

          state.byDates = {
            ...state.byDates,
            [createdDate]: {
              ...state.byDates[createdDate],
              [id]: { label: label || createdTime.slice(0, -4), createdAt },
            },
          };

          state.allDates = Array.from(
            new Set([...state.allDates, createdDate]),
          );

          return state;
        });
      });
    },
    clearVersion: () => {
      return set(state => {
        state.byDates = {};
        state.allDates = [];

        return state;
      });
    },
  };
};

const useProjectVersionStore = create(store);

export default useProjectVersionStore;
