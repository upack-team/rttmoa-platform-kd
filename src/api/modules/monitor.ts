import { Params } from '@/api/interface';
import { httpUpack } from '..';

// 操作日志
export const findOperate = (params: Params) => httpUpack.post(`/operate/operate`, params);

// 异常日志
export const findError = (params: Params) => httpUpack.post(`/error/errorLog`, params);
