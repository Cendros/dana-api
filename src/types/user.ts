export const userTypes = ['employee', 'structure', 'society', 'machine', 'admin'] as const;
export type UserTypes = typeof userTypes[number];