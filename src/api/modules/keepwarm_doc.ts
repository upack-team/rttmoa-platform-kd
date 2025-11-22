import { httpUpack as http } from '..';

type Params = { [key: string]: any };

// 保温库单据管理
export class keepwarmDocAPI {
	private static create = '/keepwarm/createOrder';
	private static bind = '/keepwarm/createOrderBind';

	// ======= createOrder =======
	static find = (params: Params) => http.post(`${this.create}/query`, params);
	static add = (params: Params) => http.post(`${this.create}/add`, params);
	static mod = (id: string, params: Params) => http.put(`${this.create}/mod/${id}`, params);
	static del = (id: string) => http.delete(`${this.create}/del/${id}`);
	static delMore = (data: string[]) => http.post(`${this.create}/delMore`, data);
	static importEx = (params: Params) => http.post(`${this.create}/importEx`, params);

	// 兼容历史配置命名
	static createFind = (params: Params) => this.find(params);
	static createAdd = (params: Params) => this.add(params);
	static createMod = (id: string, params: Params) => this.mod(id, params);
	static createDel = (id: string) => this.del(id);
	static createDelMore = (data: string[]) => this.delMore(data);
	static createImportEx = (params: Params) => this.importEx(params);

	// ======= createOrderBind =======
	static bindFind = (params: Params) => http.post(`${this.bind}/query`, params);
	static bindAdd = (params: Params) => http.post(`${this.bind}/add`, params);
	static bindMod = (id: string, params: Params) => http.put(`${this.bind}/mod/${id}`, params);
	static bindDel = (id: string) => http.delete(`${this.bind}/del/${id}`);
	static bindDelMore = (data: string[]) => http.post(`${this.bind}/delMore`, data);
	static bindImportEx = (params: Params) => http.post(`${this.bind}/importEx`, params);
}
