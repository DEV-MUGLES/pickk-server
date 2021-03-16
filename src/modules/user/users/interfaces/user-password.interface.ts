/**
 * Embedded Entity 기법을 사용한 ValueObject입니다.
 *
 * @interface
 */
export interface IUserPassword {
  readonly encrypted: string;
  readonly salt: string;
  readonly createdAt: Date;
}
