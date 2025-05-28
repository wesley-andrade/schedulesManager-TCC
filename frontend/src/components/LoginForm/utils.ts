import { LoginFormData } from "./types";
import {
  validateEmail,
  validatePassword,
  PasswordValidationError,
} from "@/utils/validators";

export type LoginFormErrors = {
  email?: string;
  password?: PasswordValidationError[];
};

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordErrors = validatePassword(data.password);
  if (passwordErrors.length > 0) {
    errors.password = passwordErrors;
  }

  return errors;
};
