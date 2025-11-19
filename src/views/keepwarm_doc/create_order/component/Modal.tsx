import renderFormItem from '@/hooks/useFormRender';
import { ModalForm } from '@ant-design/pro-components';
import { Button, Col, Form, Input, Modal, Radio, Row, Select, Space, Switch } from 'antd';
import { useEffect } from 'react';

const ModalComponent = (Params: any) => {
	const { form, modalIsVisible, setModalIsVisible, modalTitle, modalType, modalUserInfo, modalResult, formSchemaField } = Params;

	// 回车键提交数据
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				form.submit();
			}
		};
		if (modalIsVisible) {
			window.addEventListener('keydown', handleKeyDown);
		} else {
			window.removeEventListener('keydown', handleKeyDown);
		}
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [modalIsVisible]);

	useEffect(() => {
		if (modalType == 'create') {
			form.resetFields();
		}
		if (modalType == 'edit' || modalIsVisible) {
			form.setFieldsValue(modalUserInfo || {});
		}
	}, [modalIsVisible, modalType, modalUserInfo]);

	const onFinish: any = (values: any) => {
		const formList = form.getFieldsValue();
		if (modalType == 'edit') {
			formList._id = modalUserInfo._id;
		}
		modalResult && modalResult(modalType, formList);
		// return true;
	};
	const onOpenChange = (v: boolean) => {
		setModalIsVisible(v);
		if (!v) {
			form.resetFields();
		}
	};
	return (
		<ModalForm
			width={900}
			className='px-[20px] py-[30px]'
			key={modalUserInfo?._id}
			form={form}
			title={modalTitle}
			open={modalIsVisible}
			layout='horizontal'
			labelCol={{ span: 5 }} // label 宽度
			wrapperCol={{ span: 18 }} // 输入框宽度
			grid // ★ 启用表单网格
			rowProps={{ gutter: [16, 0] }}
			// initialValues={modalUserInfo || {}} // initialValues只会初始化一次
			modalProps={{ destroyOnClose: true }}
			onOpenChange={onOpenChange}
			onFinish={onFinish}
		>
			{formSchemaField.map((item: any) => renderFormItem(item))}
		</ModalForm>
	);
};
export default ModalComponent;
