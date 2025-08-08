import { create } from 'zustand';
import { Measure, Project } from '../types';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // plain text for now, but should be hashed in production
}

interface ProjectStoreTypes {
  projects: Project[];
  tempMeasure: any | null;
  technicians: Technician[];

  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
  setTempMeasure: (data: any) => void;
  clearTempMeasure: () => void;
  addMeasureToProject: (projectId: number, measure: Measure) => void;
  removeMeasureFromProject: (projectId: number, measureId: string) => void;

  addTechnician: (tech: Technician) => void;
  removeTechnician: (id: string) => void;
}

export const useProjectStore = create<ProjectStoreTypes>()(
  persist(
    (set, get) => ({
      projects: [],
      tempMeasure: null,
      technicians: [],

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
            const existingMeasures = proj.measures || [];
            const existingIdx = existingMeasures.findIndex(
              m => m.id === newMeasure.id,
            );

            const newMeasures = [...existingMeasures];
            if (existingIdx >= 0) {
              newMeasures[existingIdx] = newMeasure;
            } else {
              newMeasures.push(newMeasure);
            }

            return { ...proj, measures: newMeasures };
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
            return { ...proj, measures: filteredMeasures };
          });

          return { projects: updatedProjects };
        });
      },

      addTechnician: tech =>
        set(state => ({
          technicians: [...state.technicians, tech],
        })),

      removeTechnician: id =>
        set(state => ({
          technicians: state.technicians.filter(t => t.id !== id),
        })),
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
