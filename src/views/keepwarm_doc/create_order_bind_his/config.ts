import { keepwarmDocAPI } from '@/api/modules/keepwarm_doc';

export const dataConfig = () => {
	const key = ``;
	const tableCache = `keepwarm_doc_${key}`;
	const tableName = '历史-手动建单绑定托盘';

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
