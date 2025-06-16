export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email é obrigatório";
  }

  if (!email.includes("@")) {
    return "Email inválido";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Email inválido (exemplo: usuario@gmail.com)";
  }

  return null;
};

export type PasswordValidationError = {
  type:
    | "length"
    | "uppercase"
    | "lowercase"
    | "number"
    | "special"
    | "required";
  message: string;
};

export const validatePassword = (
  password: string
): PasswordValidationError[] => {
  const errors: PasswordValidationError[] = [];

  if (!password) {
    return [{ type: "required", message: "Senha é obrigatória" }];
  }

  if (password.length < 8) {
    errors.push({
      type: "length",
      message: "A senha deve ter pelo menos 8 caracteres",
    });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({
      type: "uppercase",
      message: "A senha deve conter pelo menos uma letra maiúscula",
    });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({
      type: "lowercase",
      message: "A senha deve conter pelo menos uma letra minúscula",
    });
  }

  if (!/[0-9]/.test(password)) {
    errors.push({
      type: "number",
      message: "A senha deve conter pelo menos um número",
    });
  }

  if (!/[\W_]/.test(password)) {
    errors.push({
      type: "special",
      message: "A senha deve conter pelo menos um caractere especial (!@#$%&*)",
    });
  }

  return errors;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone) {
    return null;
  }

  const numbers = phone.replace(/\D/g, "");

  if (numbers.length < 10) {
    return "Telefone deve ter pelo menos 10 dígitos";
  }

  if (numbers.length > 11) {
    return "Telefone deve ter no máximo 11 dígitos";
  }

  const ddd = numbers.slice(0, 2);
  if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
    return "DDD inválido";
  }

  return null;
};
