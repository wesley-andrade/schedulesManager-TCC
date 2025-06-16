import { Input } from "@/components/ui/input";
import { forwardRef, useEffect, useState } from "react";
import { formatPhoneNumber } from "@/utils/formatters";

interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onValueChange?: (value: string) => void;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onValueChange, value, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState("");

    useEffect(() => {
      if (value) {
        setDisplayValue(formatPhoneNumber(value as string));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const numbers = inputValue.replace(/\D/g, "");

      // Limita a 11 dígitos (DDD + número)
      if (numbers.length <= 11) {
        const formattedValue = formatPhoneNumber(numbers);
        setDisplayValue(formattedValue);

        // Chama o onValueChange com apenas os números
        onValueChange?.(numbers);
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="(00) 00000-0000"
        maxLength={15} // (00) 00000-0000
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
