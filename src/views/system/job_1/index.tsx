import { ProTable } from '@ant-design/pro-components';
import ColumnsConfig from './component/Column';
import ToolBarRender from './component/ToolBar';
import { addJob, delJob, delMoreJob, ExJob, findJob, modifyJob } from '@/api/modules/system';
import ModalComponent from './component/Modal';
import DrawerComponent from '@/components/TableDrawer';
import FooterComponent from '@/components/TableFooter';
import { useTableTemplate, TableDataItem } from '@/hooks/useTableTemplate';

// 定义岗位数据类型
interface JobData extends TableDataItem {
	postName: string;
	postSort: number;
	flag: boolean;
	status: string;
	createTime?: string;
	desc?: string;
	[key: string]: any;
}

const JobTable = () => {
	// 使用通用表格模板
	const {
		// 状态
		loading,
		pagination,
		setPagination,
		selectedRows,
		setSelectedRows,
		drawerIsVisible,
		setDrawerIsVisible,
		drawerCurrentRow,
		setDrawerCurrentRow,
		modalIsVisible,
		setModalIsVisible,
		modalTitle,
		modalType,
		modalData,

		// 引用
		actionRef,
		formRef,
		form,

		// 方法
		modalOperate,
		modalResult,
		handleRequest,
		calculateTableWidth,
		getToolBarParams,

		// 配置
		columnsConfig,
		nameField,
	} = useTableTemplate<JobData>({
		tableName: '岗位管理',
		nameField: 'postName',
		columnsConfig: ColumnsConfig,
		apiMethods: {
			find: findJob,
			add: addJob,
			modify: modifyJob,
			del: delJob,
			delMore: delMoreJob,
			import: ExJob,
		},
	});

	const ToolBarParams: any = getToolBarParams();
	const allWidth = calculateTableWidth();

	return (
		<>
			<ProTable<any>
				rowKey='_id'
				className='ant-pro-table-scroll'
				scroll={{ x: allWidth, y: '100vh' }}
				headerTitle='岗位管理'
				loading={loading}
				formRef={formRef}
				actionRef={actionRef}
				bordered
				cardBordered
				dateFormatter='number'
				defaultSize='small'
				columns={columnsConfig(modalOperate, modalResult)}
				toolBarRender={() => ToolBarRender(ToolBarParams)}
				search={{
					labelWidth: 'auto',
					filterType: 'query',
					span: 4,
					resetText: '重置',
					searchText: '查询',
					showHiddenNum: true,
				}}
				request={handleRequest}
				pagination={{
					size: 'default',
					showQuickJumper: true,
					showSizeChanger: true,
					...pagination,
					pageSizeOptions: [10, 15, 20, 30, 50],
					onChange: (page, pageSize) => {
						setPagination({ ...pagination, page, pageSize });
					},
					showTotal: () => `第 ${pagination.page} 页，共 ${pagination.total} 条`,
				}}
				rowSelection={{
					onChange: (selectedRowKeys, selectedRows) => {
						setSelectedRows(selectedRows);
					},
				}}
				ghost={false}
				onSizeChange={() => {}}
				onRequestError={(error: any) => {}}
				editable={{ type: 'multiple' }}
				columnsState={{
					persistenceKey: 'key-job',
					persistenceType: 'localStorage',
				}}
			/>

			{selectedRows?.length > 0 && <FooterComponent selectedRows={selectedRows} modalResult={modalResult} />}

			<ModalComponent form={form} modalIsVisible={modalIsVisible} setModalIsVisible={setModalIsVisible} modalTitle={modalTitle} modalType={modalType} modalUserInfo={modalData} modalResult={modalResult} />

			<DrawerComponent
				drawerIsVisible={drawerIsVisible}
				drawerCurrentRow={{ ...drawerCurrentRow, name: drawerCurrentRow?.[nameField] }}
				drawerClose={() => {
					setDrawerCurrentRow({});
					setDrawerIsVisible(false);
				}}
				columnsConfig={columnsConfig}
				modalOperate={modalOperate}
				modalResult={modalResult}
			/>
		</>
	);
};

// export default JobTable;
