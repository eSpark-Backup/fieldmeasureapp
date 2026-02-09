import * as Yup from 'yup';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const ProjectSchema = Yup.object().shape({
  qouteNumber: Yup.string().required('Qoute Number is required'),
  name: Yup.string().required('Client Name is required'),
  address: Yup.string().required('Address is required'),
  techName: Yup.string().required('Technician is required'),
  date: Yup.string().required('Date is required'),
});

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

const EditTechnicianSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const DECIMAL_REGEX = /^\d*\.?\d*$/;
const validateDecimal = (val: string) => DECIMAL_REGEX.test(val);

export {
  SignInSchema,
  SignUpSchema,
  ForgotPasswordSchema,
  validateDecimal,
  ProjectSchema,
  EditTechnicianSchema,
};
