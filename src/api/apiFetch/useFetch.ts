/**
 * Fetch Hooks
 */
import { useCallback, useEffect, useState } from 'react';
// import { reqFetch } from './fetch';

const reqFetch: any = () => {};
const useReqFetch = (url: string, opts: any) => {
	const [res, setRes] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<boolean>(false);

	const asyncFetch = async (canceled: boolean, controller: any) => {
		try {
			if (loading) return;
			setLoading(true);
			const resDate = await reqFetch(url, { ...opts, controller });
			if (!canceled) {
				setRes(resDate);
			}
		} catch (error) {
			setError(true);
		} finally {
			setLoading(false);
		}
	};

	const reFetch = useCallback(() => {
		let canceled = false;
		let controller = new AbortController();
		asyncFetch(canceled, controller);

		return () => {
			setRes(() => {});
			canceled = true;
			controller.abort();
		};
	}, [url, opts]);

	useEffect(reFetch, []);

	return [res, loading, error];
};

// GET 请求时，将payload对象解析成地址栏请求参数
const useGetFetch = (url: string, opts: any) => useReqFetch(url, { ...opts, method: 'GET' });

// POST 请求时，将payload对象解析成请求体body
const usePostFetch = (url: string, opts: any) => useReqFetch(url, { ...opts, method: 'POST' });

const usePutFetch = (url: string, opts: any) => useReqFetch(url, { ...opts, method: 'PUT' });

const useDeleteFetch = (url: string, opts: any) => useReqFetch(url, { ...opts, method: 'DELETE' });

const usePatchFetch = (url: string, opts: any) => useReqFetch(url, { ...opts, method: 'PATCH' });
