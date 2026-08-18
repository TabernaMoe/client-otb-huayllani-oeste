export const getChangedFields = (original, current) => {
  const changes = {};

  Object.keys(current).forEach((key) => {
    const originalValue = original?.[key] ?? original?.[`${key}_socio`] ?? '';

    const currentValue = current?.[key] ?? '';

    if (String(originalValue).trim() !== String(currentValue).trim()) {
      changes[key] = current[key];
    }
  });

  return changes;
};
