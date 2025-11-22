import { Context } from 'koa';
import Basic from '../basic';
import _ from 'lodash';

// ! 保温库手动创建单据
// ** 前端传递参数时、需要告知服务端哪个字段可查询、并且知道字段的类型是字符串还是选择框
// 表名： kd_keepwarm_doc__c   与对象名保持一致
// 编辑查询条件：处理文本、数值、日期、选择框
// 新增或编辑时、有没有新增是唯一值的、比如不可重复的 管理员名称等

// 名称	name	text
// 时间	time__c	text
// 入库单号	order_no__c	text
// 托盘号	pallet__c	text
// 数量	enter_num__c	number、整数
// 产品名称	product_name__c	text
// 手动建单主子表	main__c	text
// 产品编号	product_no__c	text
// 生产日期	product_date__c	text
// 批号	batch__c	text
// 状态	status__c	select、值为正在执行、已完成

//   |||||  这是此文件的字段、请替换FieldSchema的属性、用上面的字段重新生成一下FieldSchema的属性
class CreateOrder extends Basic {
	constructor() {
		super();
	}

	private readonly tableName = '手动创建任务绑定托盘';
	private readonly Collection = 'kd_keepwarm_doc_bind__c';

	private FieldSchema: Record<
		string,
		{
			sync?: string;
			label: string;
			type: 'string' | 'number' | 'date' | 'select';
			query?: boolean;
			editable?: boolean;
			width?: number;
			options?: Record<string, string>[];
			fixed?: string;
			order?: number;
			sorter?: boolean;

			int?: boolean;
			decimal?: boolean;
			precision?: number;
		}
	> = {
		name: { label: '名称', type: 'string', sync: 'product_name__c' },

		time__c: { label: '时间', type: 'string', width: 150, query: true, editable: true, order: 1 },
		order_no__c: { label: '入库单号', type: 'string', query: true, editable: true },
		pallet__c: { label: '托盘号', type: 'string', query: true, editable: true },
		enter_num__c: { label: '数量', type: 'number', query: false, editable: true, int: true },
		product_name__c: { label: '产品名称', type: 'string', query: true, editable: true },
		main__c: { label: '主子表', type: 'string', query: true, editable: true },
		product_no__c: { label: '产品编号', type: 'string', query: true, editable: true },
		product_date__c: { label: '生产日期', type: 'string', query: true, editable: true },
		batch__c: { label: '批号', type: 'string', query: true, editable: true },

		status__c: {
			label: '状态',
			type: 'select',
			query: true,
			editable: true,
			options: [
				{ label: '正在执行', value: '正在执行', color: 'processing' },
				{ label: '已完成', value: '已完成', color: 'success' },
			],
		},

		createTime: { label: '创建时间', type: 'date', width: 150, query: true, editable: false },
		updateTime: { label: '修改时间', type: 'date', width: 150, query: true, editable: false },
	};

	private TableOps = {
		allowCreate: true, // 新建
		allowEdit: true, // 编辑
		allowDelete: true, // 删除
		allowRowEdit: true, // 行编辑
		allowBatchDelete: true, // 批量删除
		allowBatchEdit: true, // 批量编辑
		allowImport: true, // 允许导入
	};

	Query = async (ctx: Context) => {
		try {
			const data: any = ctx.request.body;

			const query = this.QueryFilter(data, this.FieldSchema);
			console.log('query', query);

			const page = _.clamp(_.toInteger(_.get(data, 'pagination.page', 1)), 1, Number.MAX_SAFE_INTEGER);
			const pageSize = _.clamp(_.toInteger(_.get(data, 'pagination.pageSize', 10)), 1, 100);

			const sort = _.get(data, 'sort', { updateTime: -1, createTime: -1 });

			const [count, list] = await Promise.all([ctx.mongo.count(this.Collection, query), ctx.mongo.find(this.Collection, { query, page, pageSize, sort })]);

			const schema: any = { ...this.FieldSchema, __ops__: this.TableOps };
			const tableInfo = { tableName: this.tableName, collection: this.Collection };
			return ctx.send({ list, page, pageSize, total: count, schema, tableInfo });
		} catch (err: any) {
			return ctx.sendError(500, err.message || '服务器错误');
		}
	};

	Add = async (ctx: Context) => {
		try {
			const data: any = ctx.request.body;

			const doc = this.addAndModField(data, this.FieldSchema);
			const document: any = {
				...doc,
				createBy: null,
				createTime: new Date(),
			};
			const ins = await ctx.mongo.insertOne(this.Collection, document);
			return ctx.send('添加成功');
		} catch (err) {
			return ctx.sendError(500, err.message);
		}
	};

	Mod = async (ctx: Context) => {
		try {
			const id = ctx.params.id;
			const data: any = ctx.request.body;

			if (!id) return ctx.sendError(400, `修改操作：无iD`);

			const doc = this.addAndModField(data, this.FieldSchema);
			const document: any = {
				...doc,
				updateBy: null,
				updateTime: new Date(),
			};
			console.log('document', document);
			await ctx.mongo.updateOne(this.Collection, id, document);
			return ctx.send('修改成功');
		} catch (err) {
			return ctx.sendError(500, err.message);
		}
	};

	ImportEx = async (ctx: Context) => {
		try {
			const data: any = ctx.request.body;
			if (data && data.length) {
				for (const element of data) {
					const doc = this.addAndModField(element, this.FieldSchema);
					const document: any = {
						...doc,
						createBy: 'admin',
						createTime: new Date(),
					};
					await ctx.mongo.insertOne(this.Collection, document);
				}
				return ctx.send('数据导入成功');
			} else return ctx.sendError(400, `服务端未获取到数据`);
		} catch (err) {
			return ctx.sendError(500, err.message);
		}
	};

	Del = async (ctx: Context) => {
		try {
			const id = ctx.params.id;
			if (id) {
				const docs = await ctx.mongo.find(this.Collection, { query: { _id: id } });
				if (docs.length) {
					await ctx.mongo.deleteOne(this.Collection, docs[0]._id);
					return ctx.send('删除成功');
				} else {
					return ctx.sendError(400, `删除操作：删除任务失败！根据id未找到数据`);
				}
			} else return ctx.sendError(400, `删除操作：前端未传递id！`);
		} catch (err) {
			return ctx.sendError(500, err.message);
		}
	};

	DelMore = async (ctx: Context) => {
		try {
			const data: any = ctx.request.body;
			if (data && data.length) {
				for (const _id of data) {
					const docs = await ctx.mongo.find(this.Collection, { query: { _id: _id } });
					if (docs.length) {
						await ctx.mongo.deleteOne(this.Collection, docs[0]._id);
					}
				}
				return ctx.send('全部删除完成');
			} else return ctx.sendError(400, `删除更多操作：前端传递的参数不正确！`);
		} catch (err) {
			return ctx.sendError(500, err.message);
		}
	};
}

export default new CreateOrder();
