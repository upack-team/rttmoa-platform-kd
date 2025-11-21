import { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, FormInstance } from '@ant-design/pro-components';
import { message } from '@/hooks/useMessage';
import DrawerComponent from '@/components/TableDrawer';
import FooterComponent from '@/components/TableFooter';
import useTabColumnSchema from '@/hooks/useTableSchema/useTabColumnSchema';
import useTabFormSchema from '@/hooks/useTableSchema/useTabFormSchema';
import ColumnsConfig from '@/components/TableColumns';
import ModalComponent from '@/components/TableModal';
import ToolBarRender from '@/components/TableToolBar';
import { usePagination } from '@/hooks/useTable/usePagination';
import { useSearchSpan } from '@/hooks/useTable/useSearchSpan';
import useTableRequest from '@/hooks/useTable/useTableRequest';
import { dataConfig } from './config';

const useProTable = () => {
	const { tableCache, tableName, api } = dataConfig(); // * 配置项

	const { setPagination, paginationProps } = usePagination();

	const [loading, setLoading] = useState<boolean>(false);
	const [columnSchema, setcolumnSchema] = useState<any>({});

	const { handleRequest } = useTableRequest(api, setLoading, setcolumnSchema, setPagination);

	const searchSpan = useSearchSpan(); // 根据屏幕宽度自动计算 FormItem span

	const actionRef = useRef<ActionType>(); // 表格 ref
	const formRef = useRef<FormInstance>(); // 表单 ref
	const [form] = Form.useForm();

	const [editableKeys, setEditableKeys] = useState<React.Key[]>([]); // 可编辑行

	const [openSearch, setOpenSearch] = useState<boolean>(false); // 工具栏：开启关闭表单搜索
	const [tableData, setTableData] = useState<any[]>([]); // 表格数据
	const [selectedRows, setSelectedRows] = useState<any[]>([]); // 表格：选择行数据

	// Drawer
	const [drawerCurrentRow, setDrawerCurrentRow] = useState<any>({});
	const [drawerIsVisible, setDrawerIsVisible] = useState<boolean>(false);

	// Modal
	const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
	const [modalTitle, setModalTitle] = useState<string>('');
	const [modalType, setModalType] = useState<'create' | 'edit' | 'detail'>('create');
	const [modalUserInfo, setModalUserInfo] = useState<any>({});

	// Modal 操作：创建、编辑、详情
	const modalOperate = (type: 'create' | 'edit' | 'detail', item?: any) => {
		setModalType(type);
		if (type === 'detail') {
			setDrawerIsVisible(true);
			setDrawerCurrentRow(item || {});
		} else {
			setModalIsVisible(true);
			setModalUserInfo(item || {});
			setModalTitle(type === 'create' ? '新建' : '编辑');
		}
	};

	// * 操作 — 员工： 新建、编辑、详情  弹窗内容提交
	const modalResult = useCallback(
		async (type: string, item: any) => {
			try {
				if (['create', 'edit'].includes(type)) {
					const hide = message.loading(type === 'create' ? '正在添加' : '正在编辑');
					const res = type === 'create' ? await api.add(item) : await api.modify(item._id, item);
					hide();
					if (res) {
						form.resetFields();
						setModalIsVisible(false);
						actionRef.current?.reload();
						message.success(type === 'create' ? '添加成功' : '编辑成功');
					}
				} else if (['delete', 'moreDelete'].includes(type)) {
					const hide = message.loading('正在删除');
					const ids = type === 'delete' ? [item._id] : selectedRows.map(row => row._id);
					const res = type === 'delete' ? await api.del(item._id) : await api.delMore(ids);
					hide();
					if (res) {
						if (type === 'moreDelete') setSelectedRows([]);
						actionRef.current?.reloadAndRest?.();
						message.success(`${type === 'delete' ? `删除成功` : `删除 ${selectedRows.length} 条记录成功`}`);
					}
				}
			} catch (error: any) {
				message.error(error.message || '操作失败，请重试！');
			}
		},
		[selectedRows, form]
	);

	const quickSearch = () => {};

	const ImportData = useCallback(
		async (data: any) => {
			const hide = message.loading('数据正在导入中');
			try {
				await api.importEx(data);
				hide();
				actionRef?.current?.reload();
				message.success('导入完成');
			} catch (error: any) {
				hide();
				message.error(error.message || error.msg || '导入失败');
			}
		},
		[api.importEx]
	);

	const columnsSchemaField = useTabColumnSchema(columnSchema);
	const formSchemaField = useTabFormSchema(columnSchema); // buildFormSchema
	const columnsCfg = ColumnsConfig(modalOperate, modalResult, columnsSchemaField);

	let toolBarParams: any = {
		quickSearch,
		openSearch,
		setOpenSearch,
		modalOperate,
		tableName,
		tableData,
		ImportData,
		columnsCfg,
	};

	return (
		<>
			<ProTable<any>
				rowKey='_id'
				className='ant-pro-table-scroll'
				scroll={{ y: '100vh' }} // 100vh
				headerTitle={tableName}
				loading={loading}
				formRef={formRef} // 可以获取到查询表单的 form 实例
				actionRef={actionRef} // 操作 Table
				bordered
				cardBordered
				dateFormatter='number'
				defaultSize='small'
				columns={columnsCfg}
				toolBarRender={() => ToolBarRender(toolBarParams)} // 渲染工具栏
				search={openSearch ? false : { labelWidth: 'auto', filterType: 'query', span: searchSpan, showHiddenNum: true }} // 搜索表单配置
				request={handleRequest}
				pagination={paginationProps}
				rowSelection={{
					onChange: (selectedRowKeys, selectedRows) => setSelectedRows(selectedRows),
				}}
				editable={{
					type: 'multiple',
					editableKeys,
					onChange: setEditableKeys,
					onSave: async (key, row) => {
						if (row._id) {
							const res = await api.modify(row._id, row);
							if (res) {
								form.resetFields();
								actionRef.current?.reload();
								message.success(`编辑成功！`);
							} else {
								message.success(`编辑失败：服务器错误！`);
							}
						} else {
							message.success(`编辑失败：行iD不存在！`);
						}
					},
					onDelete: async (key: any) => {
						const res = await api.del(key);
						if (res) {
							actionRef.current?.reloadAndRest?.();
							message.success(`删除成功`);
						} else {
							message.success(`删除失败：服务器错误！`);
						}
					},
				}}
				ghost={false}
				onSizeChange={() => {}} // Table 尺寸发生改变、将尺寸存储到数据库中
				onRequestError={(error: any) => {}} // 数据加载失败时触发
				columnsState={{
					// 持久化列的 key，用于判断是否是同一个 table
					persistenceKey: `key_${tableCache}`,
					// 持久化列的类型: localStorage | sessionStorage
					persistenceType: 'localStorage',
				}}
			/>

			{selectedRows?.length > 0 && <FooterComponent selectedRows={selectedRows} modalResult={modalResult} />}

			<ModalComponent
				form={form}
				modalIsVisible={modalIsVisible}
				setModalIsVisible={setModalIsVisible}
				modalTitle={modalTitle}
				modalType={modalType}
				modalUserInfo={modalUserInfo}
				modalResult={modalResult}
				formSchemaField={formSchemaField}
			/>

			<DrawerComponent
				drawerIsVisible={drawerIsVisible}
				drawerCurrentRow={{ ...drawerCurrentRow }}
				drawerClose={() => {
					setDrawerCurrentRow({});
					setDrawerIsVisible(false);
				}}
				columnsConfig={ColumnsConfig}
				modalOperate={modalOperate}
				modalResult={modalResult}
				columnsSchemaField={columnsSchemaField}
			/>
		</>
	);
};

export default useProTable;
