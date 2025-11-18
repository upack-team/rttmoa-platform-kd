import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Progress, Tag } from 'antd';
import dayjs from 'dayjs';
import { TableEditIcon, TableRenderAction } from '@/components/TableAction';
import Link from 'antd/lib/typography/Link';
import { UserOutlined } from '@ant-design/icons';

export const ColumnsConfig = (modalOperate?: any, modalResult?: any, columnsSchemaField?: any): ProColumns<any>[] => {
	// 处理后的列配置
	const columnsField = columnsSchemaField || [];
	const t1 = [
		{
			dataIndex: 'index',
			valueType: 'index',
			width: 40,
			fixed: 'left',
			align: 'center',
			render: (text: any, entity: any, index: any) => <Link onClick={() => modalOperate('detail', entity)}>{index + 1}</Link>,
			responsive: ['sm'],
		},
	];
	const t2 = [
		{
			title: '行内编辑',
			valueType: 'option',
			align: 'center',
			fixed: 'right',
			width: 150,
			render: (text: any, record: any, action: any) => TableEditIcon(record, action),
		},
		{
			key: 'option',
			title: '操作',
			align: 'center',
			fixed: 'right',
			width: 135,
			editable: () => false,
			tooltip: '操作按钮分别是：详情、编辑、删除',
			hideInSearch: true,
			// render: renderAction,
			render: (_: any, record: any) => TableRenderAction(record, modalOperate, modalResult),
		},
	];
	return [...t1, ...columnsField, ...t2];
};
export default ColumnsConfig;
