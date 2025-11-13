import { Context } from 'koa';
import { config } from '../../config/config';
import Basic from '../basic';
import catArr from '../../config/init_fakeUser';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

const Mock = require('mockjs');
const bcrypt = require('bcrypt');

class User extends Basic {
	constructor() {
		super();
	}

	login = async (ctx: Context) => {
		try {
			// console.log(123);
			const { username, password } = ctx.request.body as any;
			if (!username) return ctx.sendError(400, '登陆操作：无用户名');
			if (!password) return ctx.sendError(400, '登陆操作：无密码');
			console.log('username', username);
			const findUser = await ctx.mongo.find('__user', { query: { username: username } });
			if (!findUser.length) {
				return ctx.sendError(400, '登陆操作：用户名错误');
			}
			const oldPassword = findUser[0].password;

			const isMatch = await bcrypt.compare(password, oldPassword);
			if (!isMatch) {
				// jsonwebtoken过期时间：
				// 秒: 10, 10s
				// 分钟: 2m, '10m'
				// 小时: '5h', 10h
				// 天: '7d'
				// 周: '2w'
				// 年: '1y'
				const token = jwt.sign(
					{
						id: findUser[0]._id,
						name: username,
					},
					config.jwtkey,
					{ expiresIn: '365d' } // 有效期365天 | 1h
				);
				console.log('token', token);
				const up = await ctx.mongo.updateOne('__user', findUser[0]._id, { token });

				return ctx.send({ list: findUser, token });
			} else {
				return ctx.sendError(400, '登陆操作失败：密码错误！');
			}
		} catch (err) {
			return ctx.sendError(config.resCodes.serverError, err.message);
		}
	};

	logout = async (ctx: Context) => {
		// 查询用户、将用户token为空
		const user = ctx.state.user;
		// const up = await ctx.mongo.updateOne('__user', findUser[0]._id, { token });
		return ctx.send({ message: '退出成功' });
	};

	register = async (ctx: Context) => {
		try {
			const { username, password, phone } = ctx.request.body as any;
			if (!username) return ctx.sendError(400, '登陆操作：无用户名');
			if (!password) return ctx.sendError(400, '登陆操作：无密码');
			if (!phone) return ctx.sendError(400, '登陆操作：无手机号');

			const findUser = await ctx.mongo.find('__user', { query: { username: username } });
			if (findUser.length) {
				return ctx.sendError(400, '注册操作失败：已存在用户');
			}

			const saltRounds = 10; // 建议值在 10-12 之间
			const hash = await bcrypt.hash(password, saltRounds);

			let newUser = {
				username: username, // 用户名
				password: hash, // 密码
				phone: phone, // 手机号

				job: '', // 岗位
				dept: '', // 部门
				role: '普通用户', // 角色
				token: '', // 新token存储起来
				is_use: 1, // 是否冻结：1 正常，0 冻结

				created_at: new Date(), // 创建时间
				updated_at: new Date(), // 更新时间
			};

			const insId: any = await ctx.mongo.insertOne('__user', newUser);
			// console.log('ins', insId);

			const token = jwt.sign(
				{
					id: insId,
					name: username,
				},
				config.jwtkey,
				{ expiresIn: 60 * 60 * 24 * 365 } // 有效期365天
			);

			return ctx.send({ token });
		} catch (err) {
			return ctx.sendError(config.resCodes.serverError, err.message);
		}
	};
 
}

export default new User();
