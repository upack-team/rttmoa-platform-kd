import { useState, useCallback } from 'react';
import { message } from '@/hooks/useMessage';

// 📌 useTableModal.ts（统一管理弹窗逻辑）
export default function useTableModal(api: any, form: any, actionRef: any) {
	const [modalVisible, setModalVisible] = useState(false);
	const [modalInfo, setModalInfo] = useState({});
	const [modalType, setModalType] = useState('create');

	// 打开弹窗
	const openModal = (type: string, row = {}) => {
		setModalType(type);
		setModalInfo(row);
		setModalVisible(true);
	};

	// 处理提交
	const modalResult = useCallback(
		async (type: string, item: any) => {
			try {
				const hide = message.loading('正在提交...');
				let res;

				if (type === 'create') res = await api.add(item);
				if (type === 'edit') res = await api.modify(item._id, item);

				hide();
				if (res) {
					message.success('操作成功');
					form.resetFields();
					setModalVisible(false);
					actionRef.current?.reload();
				}
			} catch (e: any) {
				message.error(e?.message || '操作失败');
			}
		},
		[form, actionRef]
	);

	return {
		modalVisible,
		modalInfo,
		modalType,
		openModal,
		modalResult,
		setModalVisible,
	};
}
