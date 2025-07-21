export type RootNavParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Projects: undefined;

  ProjectDetails: {
    projectId: string;
    title: string;
    address: string;
    date: string;
    extraInfo?: string;
  };

  Measurement: {
    projectId: string;
    title: string;
    address: string;
    date: string;
    extraInfo?: string;
  };

  AllDetails: {
    projectId: string;
    title: string;
    address: string;
    date: string;
    extraInfo?: string;
  };
};
