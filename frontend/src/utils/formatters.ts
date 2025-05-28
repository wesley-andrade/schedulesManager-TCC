export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return "-";

  const numbers = phone.replace(/\D/g, "");

  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
      6
    )}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
      7,
      11
    )}`;
  }
};
