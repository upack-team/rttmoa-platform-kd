import TableColumnsConfig from '../component/Column';
import ToolBarRender from '../component/ToolBar';

export const proTableConfig = (params: any) => {
	const { openSearch, loading, pagination, setPagination, selectedRows, setSelectedRows, actionRef, formRef, tableName, handleModalOperate, handleModalResult } = params;

	const columns = TableColumnsConfig(handleModalOperate, handleModalResult);
	const calculate = (columns: any[]) => columns.reduce((sum: any, col: { width: any }) => sum + (col.width || 0), 0);
	const allWidth = calculate(columns);

	return {
		rowKey: '_id',
		className: 'ant-pro-table-scroll',
		scroll: { x: allWidth, y: '100vh' },
		headerTitle: tableName,
		loading,
		formRef,
		actionRef,
		bordered: true,
		cardBordered: true,
		dateFormatter: 'number',
		defaultSize: 'small',
		columns,
		toolBarRender: () => ToolBarRender(params),
		search: openSearch ? false : { labelWidth: 'auto', filterType: 'query', span: 6, resetText: '重置', searchText: '查询', showHiddenNum: true },
		pagination: {
			size: 'default',
			showQuickJumper: true,
			showSizeChanger: true,
			...pagination,
			pageSizeOptions: [10, 20, 30, 50],
			onChange: (page: any, pageSize: any) => setPagination({ ...pagination, page, pageSize }),
			showTotal: () => `第 ${pagination.page} 页，共 ${pagination.total} 条`,
		},
		rowSelection: {
			onChange: (_: any, selectedRows: any) => setSelectedRows(selectedRows),
		},
		ghost: false,
		editable: { type: 'multiple' },
		columnsState: {
			persistenceKey: 'use-pro-table-key',
			persistenceType: 'localStorage',
		},
	};
};
