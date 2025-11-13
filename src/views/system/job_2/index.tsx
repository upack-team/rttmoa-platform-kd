import { ProTable } from '@ant-design/pro-components';
import { useProTableLogic } from './config/useProTableLogic';
import { proTableConfig } from './config/tableConfig';
import ModalComponent from './component/Modal';
import TableColumnsConfig from './component/Column';
import DrawerComponent from '@/components/TableDrawer';
import FooterComponent from '@/components/TableFooter';

const JobManage = () => {
	const tableName = '岗位管理';

	const {
		// Refs
		actionRef,
		formRef,
		form,
		// States
		loading,
		openSearch,
		setOpenSearch,
		pagination,
		setPagination,
		selectedRows,
		setSelectedRows,
		// Modal
		modalIsVisible,
		setModalIsVisible,
		modalTitle,
		modalType,
		modalUserInfo,
		// Drawer
		drawerCurrentRow,
		drawerIsVisible,
		drawerClose,

		// Handlers
		handleModalOperate,
		handleModalResult,
		handleImportData,
		handleProTableRequest,
	} = useProTableLogic();

	// 传递给工具栏的 props
	const toolBarParams = {
		quickSearch: () => {},
		openSearch,
		setOpenSearch,
		modalOperate: handleModalOperate,
		tableName,
		tableData: [], // 你的原始代码中没有用到这个，所以设为空数组
		ImportData: handleImportData,
	};

	// 获取 ProTable 的配置
	const tableConfig: any = proTableConfig({
		...toolBarParams, // 将工具栏参数也传递给配置生成器
		loading,
		pagination,
		setPagination,
		selectedRows,
		setSelectedRows,
		actionRef,
		formRef,
		tableName,
		handleModalOperate,
		handleModalResult,
	});

	return (
		<>
			<ProTable<any> {...tableConfig} request={handleProTableRequest} />

			{selectedRows?.length > 0 && <FooterComponent selectedRows={selectedRows} modalResult={handleModalResult} />}

			<ModalComponent form={form} modalIsVisible={modalIsVisible} setModalIsVisible={setModalIsVisible} modalTitle={modalTitle} modalType={modalType} modalUserInfo={modalUserInfo} modalResult={handleModalResult} />

			<DrawerComponent
				drawerIsVisible={drawerIsVisible}
				drawerCurrentRow={{ ...drawerCurrentRow, name: drawerCurrentRow?.postName }}
				drawerClose={drawerClose}
				columnsConfig={TableColumnsConfig}
				modalOperate={handleModalOperate}
				modalResult={handleModalResult}
			/>
		</>
	);
};

export default JobManage;
