import { LoginFormData } from "./types";
import { validateEmail } from "@/utils/validators";

export type LoginFormErrors = {
  email?: string;
};

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  return errors;
};
