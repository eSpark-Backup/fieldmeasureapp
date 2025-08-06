import { create } from 'zustand';
import { Project } from '../types';

interface ProjectStoreTypes {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
}

export const useProjectStore = create<ProjectStoreTypes>(set => ({
  projects: [],
  // increaseProjects: () => set(state => ({ projects: state.projects + 1 })),
  // decreaseProjects: () => set(state => ({ projects: state.projects - 1 })),
  addProject: (project: Project) =>
    set(state => ({ projects: [...state.projects, project] })),
  removeProject: (id: number) =>
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
    })),
}));
