import { debounce } from 'lodash';
import { useMemo } from 'react';

// 📌 useTableSearch.ts（自动搜索 防抖）
export default function useTableSearch(actionRef: any) {
	// 自动搜索：1秒防抖
	const autoSearch = useMemo(() => {
		return debounce(() => {
			actionRef.current?.reload();
		}, 1000);
	}, []);

	return { autoSearch };
}
