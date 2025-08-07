import { Measure } from '.';

export type RootNavParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Projects: undefined;

  ProjectDetails: {
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
