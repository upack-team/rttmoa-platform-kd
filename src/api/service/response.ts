import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { tryHideFullScreenLoading } from '@/components/Loading/fullScreen';
import { LOGIN_URL } from '@/config';
import { ResultEnum } from '@/enums/httpEnum';
import { message } from '@/hooks/useMessage';
import { store } from '@/redux';
import { setToken } from '@/redux/modules/user';
import { AxiosCanceler } from '@/api/helper/axiosCancel';
import { checkStatus } from '@/api/helper/checkStatus';
// 若仍报错，请检查以下事项：
// 1. 确认文件路径 '@/api/utils/checkStatus' 是否正确
// 2. 确认 checkStatus 文件是否存在
// 3. 确认 checkStatus 文件是否导出了 checkStatus 函数
// 4. 确认 tsconfig.json 中路径别名配置是否正确
// 假设 ResultData 类型定义在同级目录下的 result.ts 文件中，可根据实际项目结构调整路径

 
/**
 * 设置响应拦截器
 * @param instance Axios 实例
 */
export function setupResponseInterceptors(instance: AxiosInstance) {
		/**
		 * @description response interceptor
		 *  The server returns the information -> [intercept unified processing] -> the client JS gets the information
		 */
		// 响应：如何处理refresh_token、自动发起请求，getRefreshToken，setAccessToken，setRefreshToken
		instance.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config, headers, status, statusText } = response;
				tryHideFullScreenLoading();
				// console.log('response', response)
				// ! 修改apifox中mock中code的值

				// login failure （401）
				if (+data.code === ResultEnum.OVERDUE) {
					console.log('code=401');
					store.dispatch(setToken(''));
					message.error(data.msg);
					window.$navigate(LOGIN_URL);
					return Promise.reject(data);
				}

				// 全局错误信息拦截（防止下载文件时数据流返回，直接报错，无需代码）
				if (data.code && data.code !== ResultEnum.SUCCESS) {
					message.error(data.msg || '状态码错误');
					return Promise.reject(data);
				}

				// 下载类型特殊处理文件名
				const type = response.request.responseType || '';
				if (type.includes('blob')) {
					let disposition = response.headers['content-disposition'];
					let filename = '默认文件名';
					if (disposition && disposition.indexOf('filename=') !== -1) {
						filename = decodeURI(disposition.substring(disposition.indexOf('filename=') + 9, disposition.length));
					}
					response.data.filename = filename;
				}

				// console.log('响应拦截：', response);
				// console.log("请求地址和结果：", response.config.url, response.data); // ! 响应结果
				return data; // 结果：{code: 200, data: Array(14), msg: '成功'}
			},
			async (error: AxiosError) => {
				console.log('响应错误拦截: ', error);
				console.log('响应错误拦截信息: ', error.response?.data);

				const { response }: any = error;
				tryHideFullScreenLoading();
				// 分别判断请求超时 & 网络错误，无响应   ——    "timeout of 2000ms exceeded"
				if (error.message.indexOf('timeout') !== -1) {
					message.error('请求超时！请您稍后重试');
				}
				if (error.message.indexOf('Network Error') !== -1) {
					message.error('网络错误！请您稍后重试');
				}

				// ! login failure （401）
				if (+response.data.code === ResultEnum.OVERDUE) {
					console.log('code=401');
					store.dispatch(setToken(''));
					message.error(response.data.msg);
					window.$navigate(LOGIN_URL);
					return Promise.reject(response.data);
				}

				// 根据服务器响应的错误状态代码进行不同处理
				if (response) checkStatus(response.status, error.response?.data);

				// 服务器不返回任何结果（可能是服务器出错或客户端断开了网络连接），断开连接处理：您可以跳转到断开连接页面
				if (!window.navigator.onLine) window.$navigate('/500');
				return Promise.reject(error);
			}
		);
}
