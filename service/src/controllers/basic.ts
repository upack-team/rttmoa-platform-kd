/* eslint-disable no-inner-declarations */
import { Context } from 'koa';
import { config } from '../config/config';
import _ from 'lodash';

class Basic {
	constructor() {}

	async getUserById(id: string, ctx: Context) {
		try {
			const userInfo = await ctx.mongo.find('__user', { query: { _id: id } });
			if (userInfo.length) return userInfo[0];
			else return null;
		} catch (err: any) {
			return ctx.sendError(config.resCodes.serverError, err.message);
		}
	}

	normalize(value: any, types: Array<'string' | 'number' | 'array' | 'boolean'>, defaultValue: any = null) {
		if (_.isNil(value)) return defaultValue;

		// 如果支持 number 类型
		if (types.includes('number')) {
			if (value === 0 || value === '0') return 0;
			const num = _.toNumber(value);
			if (!_.isNaN(num)) return num;
		}

		// 如果支持 boolean 类型
		if (types.includes('boolean')) {
			if (_.isBoolean(value)) return value;
			if (_.isString(value)) {
				const lower = value.toLowerCase();
				if (['true', '1', 'yes'].includes(lower)) return true;
				if (['false', '0', 'no'].includes(lower)) return false;
			}
			if (_.isNumber(value)) {
				if (value === 1) return true;
				if (value === 0) return false;
			}
		}

		// 如果支持 string 类型
		if (types.includes('string')) {
			const str = _.trim(_.toString(value));
			if (!_.isEmpty(str)) return str;
		}
		if (types.includes('array')) {
			if (_.isArray(value)) {
				return value.length === 0 ? defaultValue : value;
			}
			// 如果传的是字符串（用逗号分隔），也转成数组
			if (_.isString(value)) {
				const arr = _.compact(value.split(',').map(v => _.trim(v)));
				return arr.length === 0 ? defaultValue : arr;
			}
			return defaultValue;
		}
		return defaultValue;
	}
	// 封装通用处理函数
	async handle(ctx: Context, handler: (ctx: Context) => Promise<any>) {
		try {
			function mapStatusCode(message: string = ''): number {
				if (message.includes('成功')) return 200;
				if (message.includes('失败')) return 500;
				return 0;
			}
			// throw new Error("数据拦截、返回失败信息")
			const response = await handler(ctx);
			response.statusCode = mapStatusCode(response.message); // 根据message、返回状态码
			return ctx.send(response);

			// 返回值格式：ProTable—request的格式
			// 新：return { message: "获取数据成功", list: result, current: param.current, pageSize: param.pageSize, total: result.length};
			// 原：return ctx.send([], undefined, { counts: 1, pagesize: 5, pages: 2, page: 1 });
			// return { message: deleteRes ? "删除成功" : "删除失败" };
		} catch (err: any) {
			// console.log('user error info: ', err.message);
			return ctx.sendError(config.resCodes.serverError, err.message);
		}
	}
}
export default Basic;
