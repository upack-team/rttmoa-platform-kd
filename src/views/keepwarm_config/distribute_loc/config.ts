import { keepwarmDocAPI } from '@/api/modules/keepwarm_doc';

export const dataConfig = () => {
	const key = ``;
	const tableCache = `keepwarm_doc_${key}`;
	const tableName = '保温库货位分配规则（滞后）';

	const api = {
		find: keepwarmDocAPI.createFind,
		add: keepwarmDocAPI.createAdd,
		modify: keepwarmDocAPI.createMod,
		del: keepwarmDocAPI.createDel,
		delMore: keepwarmDocAPI.createDelMore,
		importEx: keepwarmDocAPI.createImportEx,
	};

	return {
		tableCache,
		tableName,
		api,
	};
};
