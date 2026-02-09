import { Measure } from '.';

export type Role = 'admin' | 'technician';

export type RootNavParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Projects: { role: Role; techId?: string; techName?: string }; // techId is optional for admin role
  AddTechnician: undefined;

  TechniciansList: undefined;

  ProjectDetails: {
    role: Role;
    id: string;
    qouteNumber: string;
    name: string;
    address: string;
    techName: string;
    date: string;
  };

  Measurement: {
    qouteNumber: string;
    name: string;
    address: string;
    techName: string;
    date: string;
    existingMeasure?: Measure; // Optional for editing existing measures
  };

  AllDetails: {
    qouteNumber: string;
    name: string;
    address: string;
    techName: string;
    date: string;
  };
};
