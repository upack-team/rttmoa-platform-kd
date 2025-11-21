import { ProTable } from '@ant-design/pro-components';
import DrawerComponent from '@/components/TableDrawer';
import FooterComponent from '@/components/TableFooter';
import ModalComponent from '@/components/TableModal';
import useProTableDynamic from '@/hooks/useTable/useProTableDynamic';
import { keepwarmDocAPI } from '@/api/modules/keepwarm_doc';

const useProTable = () => {
	const key = `keepwarmDocAPI`;
	const tableCache = `keepwarm_doc_${key}`;
	const tableName = '保温库手动创建单据';
	const api = {
		find: keepwarmDocAPI.find,
		add: keepwarmDocAPI.add,
		modify: keepwarmDocAPI.mod,
		del: keepwarmDocAPI.del,
		delMore: keepwarmDocAPI.delMore,
		importEx: keepwarmDocAPI.importEx,
	};

	const { proTableProps, showFooter, footerProps, modalProps, drawerProps } = useProTableDynamic({ tableCache, tableName, api });

	return (
		<>
			<ProTable<any> {...proTableProps} />

			{showFooter && <FooterComponent {...footerProps} />}

			<ModalComponent {...modalProps} />

			<DrawerComponent {...drawerProps} />
		</>
	);
};

export default useProTable;
