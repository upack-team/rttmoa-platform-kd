import { useCallback } from 'react';
import { message } from '@/hooks/useMessage';

// 📌 useTableRequest.ts（统一请求）
export default function useTableRequest(api: any, setLoading: any, setSchema: any, setPagination: any) {
	const handleRequest = useCallback(
		async (params: any, sort: any, filter: any) => {
			setLoading(true);
			try {
				const searchParams = { ...params };
				delete searchParams.current;
				delete searchParams.pageSize;

				const mappedSort = Object.fromEntries(Object.entries(sort).map(([k, v]) => [k, v === 'ascend' ? 'asc' : 'desc']));

				const payload = {
					search: searchParams,
					filter,
					pagination: { page: params.current, pageSize: params.pageSize },
					sort: mappedSort,
				};

				const { data }: any = await api.find(payload);

				setSchema(data?.schema || {});
				setPagination((prev: any) => ({ ...prev, total: data.total }));

				return { data: data.list, success: true, total: data.total };
			} catch (err) {
				message.error('数据加载失败');
				return { success: false };
			} finally {
				setLoading(false);
			}
		},
		[api.find]
	);

	return { handleRequest };
}
