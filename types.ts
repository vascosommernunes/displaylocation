export interface Supporter {
  name: string;
  email?: string; // Email is now optional as it won't be present in public data
  company: string;
  role: string;
}