import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ResultData } from '@/api/interface';
import { ResultEnum } from '@/enums/httpEnum';
import { setupRequestInterceptors } from './service/request';
import { setupResponseInterceptors } from './service/response';

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	loading?: boolean;
}
const defaultConfig: AxiosRequestConfig = {
	timeout: ResultEnum.TIMEOUT as number,
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
	},
};

// 注意点：
// 1..env文件，是开发还是生产环境
// 2.Axios二次封装，接口统一存放,满足RESTful风格： https://wocwin.github.io/t-ui/projectProblem/axios.html
// 3.参考 Axios Typescript 属性
class RequestHttp {
	// 服务实例
	service: AxiosInstance;

	public constructor(config: AxiosRequestConfig) {
		const mergedConfig = { ...defaultConfig, ...config };

		// 实例化
		this.service = axios.create(mergedConfig);

		setupRequestInterceptors(this.service);

		setupResponseInterceptors(this.service);
	}

	/**
	 * @description Common request method encapsulation
	 */
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object | string, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
	download(url: string, params?: object, _object = {}): Promise<BlobPart> {
		return this.service.post(url, params, { ..._object, responseType: 'blob' });
	}
}

export const httpApi = new RequestHttp({
	baseURL: import.meta.env.VITE_API_URL as string,
});

export const httpUpack = new RequestHttp({
	baseURL: import.meta.env.VITE_UPACK_URL as string,
});

// export default new RequestHttp(config);
// export default RequestHttp;

// // 导出核心功能
// export * from './core';

// // 导出工具函数
// export * from './utils/axiosCancel';
// export * from './utils/checkStatus';

// // 导出业务模块 API
// export * as authApi from './modules/auth';
// export * as systemApi from './modules/system';

// // 导出类型定义
// export * from './types';
