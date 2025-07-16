import { create } from 'zustand';

interface ProjectStoreTypes {
  projects: number;
  increaseProjects: () => void;
  decreaseProjects: () => void;
}

export const useProjectStore = create<ProjectStoreTypes>(set => ({
  projects: 0,
  increaseProjects: () => set(state => ({ projects: state.projects + 1 })),
  decreaseProjects: () => set(state => ({ projects: state.projects - 1 })),
}));
