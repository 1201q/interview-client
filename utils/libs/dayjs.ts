import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

type DayjsArgType = Parameters<typeof dayjs>;
export const dayjsFn = (...args: DayjsArgType): Dayjs =>
  dayjs(...args).tz('Asia/Seoul');
