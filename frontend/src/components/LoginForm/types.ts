export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}
