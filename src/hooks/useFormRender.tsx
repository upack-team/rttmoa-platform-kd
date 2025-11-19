import { ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';

const renderFormItem = (item: any) => {
	const fieldProps = item.fieldProps || {};

	switch (item.type) {
		case 'string':
			return <ProFormText name={item.name} label={item.label} colProps={{ span: 12 }} fieldProps={fieldProps} />;

		case 'number':
			return <ProFormDigit name={item.name} label={item.label} colProps={{ span: 12 }} fieldProps={fieldProps} />;

		case 'date':
			return <ProFormDatePicker name={item.name} label={item.label} colProps={{ span: 12 }} />;

		case 'select':
			return (
				<ProFormSelect
					name={item.name}
					label={item.label}
					colProps={{ span: 12 }}
					fieldProps={{
						options: item.options?.map((o: any) => ({
							label: o.label,
							value: o.value,
							color: o.color,
						})),
					}}
				/>
			);
	}
};
export default renderFormItem;
