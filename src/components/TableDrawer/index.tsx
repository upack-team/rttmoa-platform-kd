import { UserList } from '@/api/interface';
import { ProColumns, ProDescriptions, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { Drawer, Empty, Typography } from 'antd';

type DrawerComponentProps = {
	drawerIsVisible: boolean;
	drawerCurrentRow: {
		name: string | undefined;
		[key: string]: any;
	};
	drawerClose: any;
	columnsConfig: (modalOperate: any, modalResult: any, columnsData: any) => ProColumns<any>[];

	modalOperate?: any;
	modalResult?: any;
	columnsSchemaField?: any;
};
const DrawerComponent: React.FC<DrawerComponentProps> = Params => {
	const { drawerIsVisible, drawerCurrentRow, drawerClose, columnsConfig, modalOperate, modalResult, columnsSchemaField } = Params;
	const col = columnsConfig(modalOperate, modalResult, columnsSchemaField) as ProDescriptionsItemProps<UserList>[];
	const colConfig = col.map((value: any) => {
		if (value.valueType == 'digit') value.valueType = 'text';
		return { ...value };
	});

	return (
		<Drawer width={550} open={drawerIsVisible} onClose={drawerClose} closable={true}>
			{drawerCurrentRow?.name ? (
				<ProDescriptions<UserList>
					// extra='extra'
					bordered
					size='small'
					layout='horizontal'
					column={1}
					title={drawerCurrentRow?.name}
					request={async () => ({ data: drawerCurrentRow || {} })}
					params={{ id: drawerCurrentRow?.name }}
					columns={colConfig}
				/>
			) : (
				<Empty className='mt-[20px]' description={<Typography.Text>详情信息中未配置 name 字段</Typography.Text>} />
			)}
		</Drawer>
	);
};
export default DrawerComponent;
