import React from 'react';
import { inputT } from '../types/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const CustomeInput = ({
  name,
  label,
  type = 'text',
  placeholder,
  hidden = false,
  defaultValue,
  value,
  onChange,
  ...props
}: inputT) => {
  if (hidden) {
    return <input type="hidden" name={name} value={defaultValue} />;
  }

  const handlePhoneFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');

    if (!input.startsWith('998')) input = '998' + input;

    let formatted = '+';
    if (input.length > 0) formatted += input.substring(0, 3);
    if (input.length > 3) formatted += '-' + input.substring(3, 5);
    if (input.length > 5) formatted += '-' + input.substring(5, 8);
    if (input.length > 8) formatted += '-' + input.substring(8, 10);
    if (input.length > 10) formatted += '-' + input.substring(10, 12);

    e.target.value = formatted;
    onChange && onChange(e);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </Label>

      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={name === 'phoneNumber' ? handlePhoneFormat : onChange}
        {...props}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default CustomeInput;
