import { ProTable } from '@ant-design/pro-components';
import DrawerComponent from '@/components/TableDrawer';
import FooterComponent from '@/components/TableFooter';
import ModalComponent from '@/components/TableModal';
import useProTableDynamic from '@/hooks/useTable/useProTableDynamic';
import { keepwarmDocAPI } from '@/api/modules/keepwarm_doc';

const useProTable = () => {
	const api = {
		find: keepwarmDocAPI.bindFind,
		add: keepwarmDocAPI.bindAdd,
		modify: keepwarmDocAPI.bindMod,
		del: keepwarmDocAPI.bindDel,
		delMore: keepwarmDocAPI.bindDelMore,
		importEx: keepwarmDocAPI.bindImportEx,
	};

	const { proTableProps, showFooter, footerProps, modalProps, drawerProps } = useProTableDynamic({ api });

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
