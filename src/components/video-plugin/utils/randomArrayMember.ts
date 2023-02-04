export const randomArrayMember = <T>(arr: T[]): T | null => {
  if (arr.length === 0) {
    return null;
  }

  return arr[Math.round(Math.random() * arr.length - 1)];
};
