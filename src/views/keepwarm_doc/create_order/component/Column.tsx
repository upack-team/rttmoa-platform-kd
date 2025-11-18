import { ProColumns } from '@ant-design/pro-components';
import { Avatar, Progress, Tag } from 'antd';
import dayjs from 'dayjs';
import { TableEditIcon, TableRenderAction } from '@/components/TableAction';
import Link from 'antd/lib/typography/Link';
import { UserOutlined } from '@ant-design/icons';

export const ColumnsConfig = (modalOperate?: any, modalResult?: any, columnsData?: any): ProColumns<any>[] => {
	console.log('columnsData', columnsData);
	return columnsData || [];
	return [
		{
			dataIndex: 'index',
			valueType: 'index',
			width: 40,
			fixed: 'left',
			align: 'center',
			render: (text, entity, index) => <Link onClick={() => modalOperate('detail', entity)}>{index + 1}</Link>,
			responsive: ['sm'],
		},
		...columnsData,
		{
			title: '行内编辑',
			valueType: 'option',
			align: 'center',
			width: 150,
			render: (text, record, _, action) => TableEditIcon(record, action),
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
			render: (_, record) => TableRenderAction(record, modalOperate, modalResult),
		},
	];
};
export default ColumnsConfig;
