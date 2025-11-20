import { useState } from 'react';

// 📌 useTableState.ts（表格所有状态）
export default function useTableState() {
	return {
		loadingState: useState(false),
		paginationState: useState({ page: 1, pageSize: 20, total: 0 }),
		schemaState: useState({}),
	};
}
