import { create } from 'zustand';
import { Measure, Project } from '../types';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProjectStoreTypes {
  projects: Project[];
  tempMeasure: any | null;
  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
  setTempMeasure: (data: any) => void;
  clearTempMeasure: () => void;
  addMeasureToProject: (projectId: number, measure: Measure) => void;
  removeMeasureFromProject: (projectId: number, measureId: string) => void;
}

export const useProjectStore = create<ProjectStoreTypes>()(
  persist(
    (set, get) => ({
      projects: [],
      tempMeasure: null,

      addProject: (project: Project) =>
        set(state => ({ projects: [...state.projects, project] })),

      removeProject: (id: number) =>
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
        })),

      setTempMeasure: data => set(() => ({ tempMeasure: data })),
      clearTempMeasure: () => set(() => ({ tempMeasure: null })),

      addMeasureToProject: (projectId, newMeasure) => {
        set(state => {
          const updatedProjects = state.projects.map(proj => {
            if (proj.id !== projectId) return proj;

            const existingMeasures = proj.measures || []; // ✅ safe fallback
            const existingIdx = existingMeasures.findIndex(
              m => m.id === newMeasure.id,
            );

            const newMeasures = [...existingMeasures];

            if (existingIdx >= 0) {
              newMeasures[existingIdx] = newMeasure; // ✅ Replace
            } else {
              newMeasures.push(newMeasure); // ✅ Add new
            }

            return {
              ...proj,
              measures: newMeasures,
            };
          });

          return { projects: updatedProjects };
        });
      },

      removeMeasureFromProject: (projectId: number, measureId: string) => {
        set(state => {
          const updatedProjects = state.projects.map(proj => {
            if (proj.id !== projectId) return proj;

            const filteredMeasures = (proj.measures || []).filter(
              measure => measure.id !== measureId,
            );

            return {
              ...proj,
              measures: filteredMeasures,
            };
          });

          return { projects: updatedProjects };
        });
      },
    }),
    {
      name: 'project-storage',
      storage: {
        getItem: async name => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async name => {
          await AsyncStorage.removeItem(name);
        },
      },
    },
  ),
);
