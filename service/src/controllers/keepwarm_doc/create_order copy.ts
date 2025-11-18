// import { Context } from 'koa';
// import Basic from '../basic';
// import _ from 'lodash';

// // ! 保温库手动创建单据
// // ** 前端传递参数时、需要告知服务端哪个字段可查询、并且知道字段的类型是字符串还是选择框
// // 表名： kd_keepwarm_doc__c   与对象名保持一致
// // 编辑查询条件：处理文本、数值、日期、选择框
// // 新增或编辑时、有没有新增是唯一值的、比如不可重复的 管理员名称等
// // 名称	name	text
// // 时间	time__c	text
// // 入库单号	order_no__c	text
// // 入库日期	enter_date__c	text
// // 入库仓库	enter_ware__c	text
// // 产品编号	product_no__c	text
// // 产品名称	product_name__c	text
// // 规格	specification__c	text
// // 单位	unit__c	text
// // 生产日期	product_date__c	text
// // 批号	batch__c	text
// // 入库总数量	enter_num__c	number
// // 当前已绑定数量	curr_num__c	number
// // 执行状态	status__c	select
// class CreateOrderCopy extends Basic {
// 	constructor() {
// 		super();
// 	}

// 	// 我想在服务端直接将前端表格的列配置直接写出来、比如说列查询字段已经写出来了是queryField对象、这个queryField对象是接收前端的参数直接去查询、对应前端可查询功能、新增和修改的字段是addOrModField对象、可以把time__c字段名、字段类型string、字段名称是时间这个格式在服务端写好、在前端就不用在列里面去一个一个写了 前端表格是用ProTable的表格实现的、 我列举一个前端的列配置	{
// 	// 	title: '岗位名称',
// 	// 	dataIndex: 'postName',
// 	// 	valueType: 'text',
// 	// 	ellipsis: true,
// 	// 	editable: () => true,
// 	// 	// copyable: true,
// 	// 	width: 150,
// 	// 	fixed: 'left',
// 	// 	align: 'center',
// 	// 	tooltip: '岗位名称：postName',
// 	// 	onFilter: false, // 筛选
// 	// 	fieldProps: { placeholder: '请输入岗位名称' },
// 	// 	// hideInSearch: true, // 在 Search 筛选栏中不展示
// 	// 	// hideInTable: true, // 在 Table 中不展示此列
// 	// 	// hideInForm: true, // 在 Form 中不展示此列
// 	// 	// hideInSetting: true, // 在 Setting 中不展示
// 	// 	// hideInDescriptions: true, // 在 Drawer 查看详情中不展示
// 	// 	// tooltip: 'The title', // 省略提示
// 	// 	sorter: true, // 排序
// 	// 	// readonly: true,
// 	// 	// render: (dom, entity: any) => {
// 	// 	// 	return <Link onClick={e => modalOperate('detail', entity)}>{entity?.postName}</Link>;
// 	// 	// },
// 	// 	responsive: ['sm'],
// 	// },
// 	// 	如果是选择框字段类型的话、select_option中定义了选择框字段的选择数据

// 	// * 返回给前端的 列配置 Column 的 Schema
// 	private FieldSchema: Record<
// 		string,
// 		{
// 			label: string; // 字段名称（前端 title）
// 			type: 'string' | 'number' | 'date' | 'select';
// 			query?: boolean; // 是否参与查询
// 			editable?: boolean; // 是否可编辑
// 			width?: number; // 表格列宽
// 			options?: string[]; // select 的下拉数据
// 		}
// 	> = {
// 		time__c: { label: '时间', type: 'string', query: true, editable: true },
// 		order_no__c: { label: '入库单号', type: 'string', query: true, editable: true },
// 		enter_date__c: { label: '入库日期', type: 'string', query: true, editable: true },
// 		enter_ware__c: { label: '入库仓库', type: 'string', query: true, editable: true },

// 		product_name__c: { label: '产品名称', type: 'string', query: true, editable: true },
// 		product_date__c: { label: '生产日期', type: 'string', query: true, editable: true },
// 		batch__c: { label: '批号', type: 'string', query: true, editable: true },

// 		enter_num__c: { label: '入库数量', type: 'number', query: false, editable: true },
// 		curr_num__c: { label: '当前数量', type: 'number', query: false, editable: true },

// 		status__c: {
// 			label: '状态',
// 			type: 'select',
// 			query: true,
// 			editable: true,
// 			options: ['未执行', '正在执行', '执行异常', '已完成'],
// 		},

// 		createTime: {
// 			label: '创建时间',
// 			type: 'date',
// 			query: true,
// 			editable: false,
// 		},
// 	};

// 	// 查询字段
// 	private queryField: any = {
// 		string_Field: ['time__c', 'order_no__c', 'enter_date__c', 'enter_ware__c', 'product_name__c', 'product_date__c', 'batch__c'],
// 		number_Field: [],
// 		// 日期查询： 1709222400000  |  "2024-05-03"  |   "2024-05-03T00:00:00.000Z"
// 		date_Field: ['createTime'],
// 	};
// 	private select_option = {
// 		status__c: ['未执行', '正在执行', '执行异常', '已完成'],
// 	};

// 	// 新增/修改字段
// 	private addOrModField = {
// 		name: "",
// 		time__c: 'string',
// 		order_no__c: 'string',
// 		enter_date__c: 'string',
// 		enter_ware__c: 'string',
// 		product_no__c: 'string',
// 		product_name__c: 'string',
// 		specification__c: 'string',
// 		unit__c: 'string',
// 		product_date__c: 'string',
// 		batch__c: 'string',

// 		enter_num__c: 'number', // 前端输入时：输入框只能输入整数 (物料是整数)
// 		curr_num__c: 'number',

// 		status__c: 'select', // 未执行 | 正在执行 | 执行异常 | 已完成

// 		createTime: 'date',
// 	};

// 	private QueryFilter = (data: any) => {
// 		const query: Record<string, any> = {};
// 		const search = _.get(data, 'search', {});

// 		this.queryField.string_Field.forEach((field: any) => {
// 			const val = _.trim(search[field]);
// 			if (val) {
// 				query[field] = { $regex: val, $options: 'i' };
// 			}
// 		});
// 		this.queryField.number_Field.forEach((field: any) => {
// 			const parsed = this.queryParseRange(search[field]);
// 			if (parsed !== null) {
// 				query[field] = parsed;
// 			}
// 		});
// 		this.queryField.date_Field.forEach((field: any) => {
// 			const parsed = this.queryParseDateRange(search[field]);
// 			if (parsed !== null) {
// 				query[field] = parsed;
// 			}
// 		});

// 		return query;
// 	};

// 	Query = async (ctx: Context) => {
// 		try {
// 			const data: any = ctx.request.body;

// 			const query = this.QueryFilter(data);
// 			console.log('query', query);

// 			const page = _.clamp(_.toInteger(_.get(data, 'pagination.page', 1)), 1, Number.MAX_SAFE_INTEGER);
// 			const pageSize = _.clamp(_.toInteger(_.get(data, 'pagination.pageSize', 10)), 1, 100);

// 			const sort = _.get(data, 'sort', { postSort: 1, createTime: -1 });

// 			const [count, list] = await Promise.all([ctx.mongo.count('kd_keepwarm_doc__c', query), ctx.mongo.find('kd_keepwarm_doc__c', { query, page, pageSize, sort })]);

// 			return ctx.send({ list, page, pageSize, total: count, select: this?.select_option || [], schema: this.FieldSchema });
// 		} catch (err: any) {
// 			return ctx.sendError(500, err.message || '服务器错误');
// 		}
// 	};

// 	Add = async (ctx: Context) => {
// 		try {
// 			const data: any = ctx.request.body;
// 			// const exist = await ctx.mongo.find('kd_keepwarm_doc__c', { query: { postName: _.trim(data?.postName) } });
// 			// if (exist.length) return ctx.sendError(400, `修改错误：已存在${data?.postName}`);

// 			const doc = this.addAndModField(data, this.addOrModField, this.select_option);
// 			const document: any = {
// 				...doc,
// 				createBy: null,
// 				createTime: new Date(),
// 			};
// 			const ins = await ctx.mongo.insertOne('kd_keepwarm_doc__c', document);
// 			return ctx.send(`测试新增部门!`);
// 		} catch (err) {
// 			return ctx.sendError(500, err.message);
// 		}
// 	};

// 	Mod = async (ctx: Context) => {
// 		try {
// 			const id = ctx.params.id;
// 			const data: any = ctx.request.body;

// 			if (!id) return ctx.sendError(400, `修改岗位操作：无iD`);

// 			// 修改时、需排序修改内容的postName
// 			// const exist = await ctx.mongo.find('kd_keepwarm_doc__c', {
// 			// 	query: { postName: _.trim(data?.postName), _id: { $ne: id } },
// 			// });
// 			// if (exist.length) return ctx.sendError(400, `修改错误：已存在${data?.postName}`);

// 			const doc = this.addAndModField(data, this.addOrModField, this.select_option);
// 			const document: any = {
// 				...doc,
// 				updateBy: null,
// 				updateTime: new Date(),
// 			};
// 			await ctx.mongo.updateOne('kd_keepwarm_doc__c', id, document);
// 			return ctx.send('修改成功');
// 		} catch (err) {
// 			return ctx.sendError(500, err.message);
// 		}
// 	};

// 	ImportEx = async (ctx: Context) => {
// 		try {
// 			const data: any = ctx.request.body;
// 			if (data && data.length) {
// 				for (const element of data) {
// 					const doc = this.addAndModField(element, this.addOrModField, this.select_option);
// 					const document: any = {
// 						...doc,
// 						createBy: 'admin',
// 						createTime: new Date(),
// 					};
// 					await ctx.mongo.insertOne('kd_keepwarm_doc__c', document);
// 				}
// 				return ctx.send('数据导入成功');
// 			} else return ctx.sendError(400, `服务端未获取到数据`);
// 		} catch (err) {
// 			return ctx.sendError(500, err.message);
// 		}
// 	};

// 	Del = async (ctx: Context) => {
// 		try {
// 			const id = ctx.params.id;
// 			if (id) {
// 				const docs = await ctx.mongo.find('kd_keepwarm_doc__c', { query: { _id: id } });
// 				if (docs.length) {
// 					await ctx.mongo.deleteOne('kd_keepwarm_doc__c', docs[0]._id);
// 					return ctx.send('删除成功');
// 				} else {
// 					return ctx.sendError(400, `删除操作：删除任务失败！根据id未找到数据`);
// 				}
// 			} else return ctx.sendError(400, `删除操作：前端未传递id！`);
// 		} catch (err) {
// 			return ctx.sendError(500, err.message);
// 		}
// 	};

// 	DelMore = async (ctx: Context) => {
// 		try {
// 			const data: any = ctx.request.body;
// 			if (data && data.length) {
// 				for (const _id of data) {
// 					const docs = await ctx.mongo.find('kd_keepwarm_doc__c', { query: { _id: _id } });
// 					if (docs.length) {
// 						await ctx.mongo.deleteOne('kd_keepwarm_doc__c', docs[0]._id);
// 					}
// 				}
// 				return ctx.send('全部删除完成');
// 			} else return ctx.sendError(400, `删除更多操作：前端传递的参数不正确！`);
// 		} catch (err) {
// 			return ctx.sendError(500, err.message);
// 		}
// 	};
// }

// export default new CreateOrderCopy();
