export const zodErrors = (error) =>
  Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([field, messages]) => [field, messages[0]]),
  );
