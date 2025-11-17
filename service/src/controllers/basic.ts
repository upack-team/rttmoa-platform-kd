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

	// Query 查询解析数字类型：搜索数字类型
	queryParseRange(value: any) {
		if (!value) return null;

		// "2-20"
		if (_.isString(value) && value.includes('-')) {
			const [min, max] = value.split('-').map(n => _.toNumber(n));
			return { $gte: min, $lte: max };
		}

		// [2,20]
		if (_.isArray(value) && value.length === 2) {
			return { $gte: _.toNumber(value[0]), $lte: _.toNumber(value[1]) };
		}

		// 单个数字 20
		const num = _.toNumber(value);
		if (!_.isNaN(num)) return num;

		return null;
	}
	// Query 查询解析日期类型：传递的是时间戳
	queryParseDateRange(value: any) {
		if (!Array.isArray(value) || value.length !== 2) return null;
		const [start, end] = value;

		if (_.isNumber(start) && _.isNumber(end)) {
			return { $gte: new Date(start), $lte: new Date(end) };
		}

		return null;
	}

	// Add 新增或修改时（优化）
	addAndModCommon(data: any, fieldAttribute: Record<string, any>, SELECT_OPTIONS: any) {
		const doc: Record<string, any> = {};

		Object.entries(fieldAttribute).forEach(([field, type]) => {
			let val = data[field];

			if (val === undefined || val === null || val === '') return null;

			switch (type) {
				case 'string': {
					doc[field] = String(val).trim();
					break;
				}
				case 'number': {
					val = Number(val);
					if (!isNaN(val)) doc[field] = val;
					break;
				}
				case 'date': {
					const d: any = new Date(val);
					if (!isNaN(d.getTime())) doc[field] = d;
					break;
				}
				case 'select': {
					const options = SELECT_OPTIONS[field];
					if (options && options.includes(val)) {
						doc[field] = val;
					} else {
						throw new Error(`字段 ${field} 的值不合法，必须是 ${options?.join(' / ')}`);
					}
					break;
				} 
				default:
					break;
			}
		});

		return doc;
	}

	// 新增或编辑时
	// private addAndModifyField = (data: any) => {
	// 	return {
	// 		postCode: this.normalize(data?.postName, ['string'], null),
	// 		postName: this.normalize(data?.postName, ['string'], null), // 产品经理 | 前端开发 | 会计
	// 		postSort: this.normalize(data?.postSort, ['number'], 1), // 排序
	// 		status: this.normalize(data?.status, ['string'], null), // 开关：开启/关闭
	// 		desc: this.normalize(data?.desc, ['string'], null),
	// 		flag: false,
	// 	};
	// };
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

	// 失效：封装通用处理函数
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
