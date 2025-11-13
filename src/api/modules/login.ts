import { AuthState } from '@/redux/interface';
import { PORT1 } from '@/api/config/servicePort';
import { Params, ReqLogin, ReqPage, ResLogin, ResPage, UserList } from '@/api/interface/index';
import loginJSON from '@/assets/api/login.json';
import authMenuList from '@/assets/api/authMenuList.json';
import authButtonList from '@/assets/api/authButtonList.json';
import { httpApi, httpUpack } from '..';

export class loginAPI {
	// * 系统管理 — 用户管理 — 登陆、注册、退出
	static userLogin = (params: Params) => httpUpack.post(`/login/login`, params);
	static userLogout = (params: Params) => httpUpack.post(`/login/logout`, params);
	static userRegister = (params: Params) => httpUpack.post(`/login/register`, params);

	// 用户登陆
	static loginApi = (params: ReqLogin) => {
		return httpApi.post<ResLogin>(PORT1 + `/login`, params);
		// return httpApi.post<ResLogin>(PORT1 + `/login`, params, { loading: false });
		// return httpApi.post<ResLogin>(PORT1 + `/login`, {}, { params });
		// return httpApi.post<ResLogin>(PORT1 + `/login`, qs.stringify(params));
		// return httpApi.get<ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`);
		// return loginJSON;
	};
	// 用户退出
	static logoutApi = () => httpApi.post(PORT1 + `/logout`, {}, { loading: true });

	// ! 获取菜单列表 (初始化获取菜单)
	static getAuthMenuListApi = () => {
		return httpApi.get<AuthState['authMenuList']>(PORT1 + `/menu/list`);
		// return authMenuList
	};

	// 获取按钮权限 (初始化获取按钮权限)
	static getAuthButtonListApi = async () => {
		// return httpApi.get<AuthState['authButtonList']>(PORT1 + `/auth/buttons`)
		return authButtonList;
	};

	// 获取用户列表
	static getUserList = (params: ReqPage) => httpApi.post<ResPage<UserList>>(PORT1 + `/user/list`, params);
}
