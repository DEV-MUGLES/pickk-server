import { Controller } from '@nestjs/common';

/** batch job controller이다. 모든 배치 작업의 endpoint path는 jobs/ 로 시작하도록 한다 */
export const JobsController = (prefix: string) => Controller(`jobs/${prefix}`);
