import { create } from 'zustand';
import { Measure, Project } from '../types';
import { db } from '../utils/firebase';

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  permissions: {
    delete: boolean;
    modify: boolean;
    create: boolean;
  };
}

interface ProjectStoreTypes {
  projects: Project[];
  tempMeasure: any | null;
  isLoading: boolean;

  // Store actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  setTempMeasure: (data: any) => void;
  clearTempMeasure: () => void;
  addMeasureToProject: (projectId: string, measure: Measure) => Promise<void>;
  removeMeasureFromProject: (projectId: string, measureId: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStoreTypes>()((set, get) => ({
  projects: [],
  tempMeasure: null,
  isLoading: false,

  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  setProjects: (projects: Project[]) => set({ projects }),

  addProject: async (project: Project) => {
    try {
      await db.collection('projects').doc(project.id).set({
        ...project,
        measures: project.measures || [],
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding project to Firestore:', error);
      throw error;
    }
  },

  removeProject: async (id: string) => {
    try {
      await db.collection('projects').doc(id).delete();
    } catch (error) {
      console.error('Error removing project from Firestore:', error);
      throw error;
    }
  },

  editProject: async (updatedProj: Project) => {
    try {
      await db.collection('projects').doc(updatedProj.id).update(updatedProj);
    } catch (error) {
      console.error('Error updating project in Firestore:', error);
      throw error;
    }
  },

  setTempMeasure: data => set(() => ({ tempMeasure: data })),
  clearTempMeasure: () => set(() => ({ tempMeasure: null })),

  addMeasureToProject: async (projectId, newMeasure) => {
    try {
      const projectRef = db.collection('projects').doc(projectId);
      const doc = await projectRef.get();
      if (doc.exists()) {
        const projectData = doc.data() as Project;
        const existingMeasures = projectData.measures || [];
        const existingIdx = existingMeasures.findIndex(m => m.id === newMeasure.id);

        let newMeasures = [...existingMeasures];
        if (existingIdx >= 0) {
          newMeasures[existingIdx] = newMeasure;
        } else {
          newMeasures.push(newMeasure);
        }

        await projectRef.update({ measures: newMeasures });
      }
    } catch (error) {
      console.error('Error adding measure to Firestore:', error);
      throw error;
    }
  },

  removeMeasureFromProject: async (projectId: string, measureId: string) => {
    try {
      const projectRef = db.collection('projects').doc(projectId);
      const doc = await projectRef.get();
      if (doc.exists()) {
        const projectData = doc.data() as Project;
        const filteredMeasures = (projectData.measures || []).filter(
          m => m.id !== measureId
        );
        await projectRef.update({ measures: filteredMeasures });
      }
    } catch (error) {
      console.error('Error removing measure from Firestore:', error);
      throw error;
    }
  },
}));
