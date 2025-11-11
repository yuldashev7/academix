export const FormatNumber = (num: number): string => {
  if (!num) return '0';
  return num.toLocaleString('uz-UZ');
};
