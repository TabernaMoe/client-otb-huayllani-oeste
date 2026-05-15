export const getChangedFields = (original, current) => {
  const changes = {};

  Object.keys(current).forEach((key) => {
    const originalValue = original?.[key] ?? '';
    const currentValue = current?.[key] ?? '';

    if (String(originalValue).trim() !== String(currentValue).trim()) {
      changes[key] = current[key];
    }
  });

  return changes;
};
