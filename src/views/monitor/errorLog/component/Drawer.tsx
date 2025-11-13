import { UserList } from '@/api/interface';
import { ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import TableColumnsConfig from './Column';

type DrawerComponentProps = {
	drawerIsVisible: boolean;
	drawerCurrentRow: any;
	setDrawerCurrentRow: React.Dispatch<React.SetStateAction<any | null>>;
	setDrawerIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	modalOperate: any;
	modalResult: any;
};
const DrawerComponent: React.FC<DrawerComponentProps> = Params => {
	const { drawerIsVisible, drawerCurrentRow, setDrawerCurrentRow, setDrawerIsVisible, modalOperate, modalResult } = Params;
	// console.log('drawerCurrentRow', drawerCurrentRow);

	return (
		<Drawer
			width={550}
			open={drawerIsVisible}
			onClose={() => {
				setDrawerCurrentRow(undefined);
				setDrawerIsVisible(false);
			}}
			closable={true}
		>
			{drawerCurrentRow?.postName && (
				<ProDescriptions<UserList>
					// extra='extra'
					bordered
					size='small'
					layout='horizontal'
					column={1}
					title={drawerCurrentRow?.postName}
					request={async () => ({
						data: drawerCurrentRow || {},
					})}
					params={{
						id: drawerCurrentRow?.postName,
					}}
					columns={TableColumnsConfig(modalOperate, modalResult) as ProDescriptionsItemProps<UserList>[]}
				/>
			)}
		</Drawer>
	);
};
export default DrawerComponent;
