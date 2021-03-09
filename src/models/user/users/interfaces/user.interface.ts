/**
 * User variable type declaration.
 *
 * @interface
 */
export interface IUser {
  code?: string;
  email: string;
  name: string | null;
  password: string;
  weight?: number;
  height?: number;
}
