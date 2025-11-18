// ! 处理服务端 FieldSchema 对象定义的字段名称、字段类型、是否可查询、是否可行内编辑
const useColumnSchema = (schema: any) => {
	const columnsField = [];

	for (const field in schema) {
		const item = schema[field];

		let col: any = {
			title: item.label, // 时间
			dataIndex: field, // time__c
			fixed: item?.fixed || false, // 默认不固定：left、right
			align: item?.align || 'center', // 默认居中：left、center、right
			width: item?.width || 150, // 默认150
			sorter: item?.sorter || true, // 默认可排序
			editable: () => item?.editable || false, // 默认不可行内编辑表格
			ellipsis: true,
			tooltip: `${item.label}：${field}`,
			hideInSearch: !item?.query,
		};

		// hideInSearch: false, // 在 Query 搜索栏中不展示
		// hideInTable: true, // 在 Table 中不展示此列
		// hideInForm: true, // 在 Form 中不展示此列
		// hideInSetting: true, // 在 Setting 中不展示
		// hideInDescriptions: true, // 在 Drawer 查看详情中不展示

		// 表格 & form 类型
		switch (item.type) {
			case 'string':
				col.valueType = 'text';
				col.fieldProps = { placeholder: `请输入${item.label}` };
				break;

			case 'number':
				col.valueType = 'digit';
				col.fieldProps = { placeholder: `请输入${item.label}` };
				break;

			case 'date':
				col.valueType = 'date'; // dateTimeRange
				col.fieldProps = { placeholder: `请选择${item.label}` };
				break;

			case 'select':
				col.valueType = 'select';
				col.fieldProps = {
					options: item.options?.map((o: any) => ({ label: o, value: o })) || [],
				};
				break;
		}
		columnsField.push(col);
	}
	return columnsField;
};

export default useColumnSchema;
