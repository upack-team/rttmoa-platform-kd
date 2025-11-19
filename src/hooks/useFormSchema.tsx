import { ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components';

const usedFormSchema = (schema: any) => {
	return Object.keys(schema)
		.filter(field => schema[field].editable !== false) // 只能编辑 editable=true
		.map(field => {
			const item = schema[field];

			let comp: any = ProFormText; // 默认输入组件
			let fieldProps = {};

			switch (item.type) {
				case 'string':
					comp = ProFormText;
					break;

				case 'number': {
					comp = ProFormDigit;
					// 整数模式
					if (item.int) {
						fieldProps = {
							precision: 0, // 无小数点
						};
					}

					// 小数模式
					if (item.decimal) {
						fieldProps = {
							precision: item.precision ?? 2, // 默认 2 位小数
						};
					}
					break;
				}

				case 'date':
					comp = ProFormDatePicker;
					break;

				case 'select':
					comp = ProFormSelect;
					break;
			}

			return {
				name: field,
				label: item.label,
				type: item.type,
				component: comp,
				options: item.options || [],
				fieldProps,
			};
		});
};
export default usedFormSchema;
