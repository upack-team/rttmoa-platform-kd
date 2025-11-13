import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { showFullScreenLoading } from '@/components/Loading/fullScreen';
import { store } from '@/redux';
import { setToken } from '@/redux/modules/user';
import { AxiosCanceler } from '@/api/helper/axiosCancel';
import { getBrowserLang } from '@/utils';
import { CustomAxiosRequestConfig } from '..';
// 尝试修改导入路径，确保路径正确指向 AxiosCanceler 模块

// 扩展 AxiosRequestConfig 类型
declare module 'axios' {
	interface InternalAxiosRequestConfig {
		loading?: boolean;
		ignoreCancel?: boolean;
	}
}

const axiosCanceler = new AxiosCanceler();

/**
 * 设置请求拦截器
 * @param instance Axios 实例
 */
export function setupRequestInterceptors(instance: AxiosInstance) {
	/**
			 * @description request interceptor
			 * Client sends request -> [request interceptor] -> server
			 * token verification (JWT): Accept the token returned by the server and store it in redux/local storage
			 */
			instance.interceptors.request.use(
				(config: CustomAxiosRequestConfig) => {
					// 当前请求需要显示加载，这由 API 服务中指定的第三个参数控制： {loading: true}
					config.loading && showFullScreenLoading();
	
					// ! 请求时加载进度条： NProgress.start() - NProgress.done();
					// 每个接口新增时间戳
					// let timeStamp = new Date().getTime()
					// if(config.url && config.url.includes("?")) config.url = `${config.url}&t=${timeStamp}`
					// else config.url = `${config.url}?t=${timeStamp}`
	
					// PUT,POST,DELETE 方式提交的数据格式化
					// if(['POST', "PUT", "DELETE"].includes(config.method) && config.headers["Content-Type"] !== "application/json") {
					//   config.data = qs.stringify(config.data);
					// }
	
					if (config.headers && typeof config.headers.set === 'function') {
						const token: string = store.getState().user.token;
						if (token) {
							config.headers.set('x-access-token', token);
							config.headers['Authorization'] = `Bearer ${token}`;
						}
					}
					config.headers['Accept-Language'] = getBrowserLang();
					// console.log('请求拦截', config);
					return config;
				},
				(error: AxiosError) => {
					console.log('请求错误拦截', error);
					return Promise.reject(error);
				}
			);
	
}
