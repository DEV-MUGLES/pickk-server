/**
 * User variable type declaration.
 *
 * @interface
 */
export interface IUserPassword {
  readonly encrypted: string;
  readonly salt: string;
  readonly createdAt: Date;
}
