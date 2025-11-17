import { httpUpack as http } from '..';

type Params = { [key: string]: any };

// 保温库单据管理
export class keepwarmDocAPI {
	private static create = '/keepwarm/createOrder';

	// 保温库手动建单表
	static createFind = (params: Params) => http.post(`${this.create}/query`, params);
	static createAdd = (params: Params) => http.post(`${this.create}/add`, params);
	static createMod = (id: string, params: Params) => http.put(`${this.create}/mod/${id}`, params);
	static createDel = (id: string) => http.delete(`${this.create}/del/${id}`);
	static createDelMore = (data: string[]) => http.post(`${this.create}/delMore`, data);
	static createImportEx = (params: Params) => http.post(`${this.create}/importEx`, params);
}
