import React from 'react';
import { useSelector } from '@/redux';
import { getMenuByPath } from '@/utils';

type authStr = 'add' | 'edit' | 'delete' | 'import' | 'export';
type authArr = ['add', 'edit', 'delete', 'import', 'export'];
type AuthButtonProps = {
	authority: string | string[];
	children: React.ReactNode;
};

// 按钮权限： 新增、编辑、删除、导入数据、导出数据
const AuthButton: React.FC<AuthButtonProps> = ({ authority, children }) => {
	const authButtonList = useSelector(state => state.auth.authButtonList) ?? [];

	const meta = getMenuByPath()?.meta ?? {};

	let isAuth = false;

	// <AuthButton authority='add'>
	// 	<Button type='primary' icon={<PlusCircleOutlined />}>
	// 		新增
	// 	</Button>
	// </AuthButton>
	if (typeof authority === 'string') {
		authButtonList[meta.key!]?.includes(authority) && (isAuth = true);
	}

	// <AuthButton authority={['add', 'edit', 'delete', 'import', 'export']}>
	// 	<Button type='primary' icon={<PlusCircleOutlined />}>
	// 		新增
	// 	</Button>
	// </AuthButton>
	if (authority instanceof Array && authority.length) {
		const hasPermission = authority.every(item => authButtonList[meta.key!]?.includes(item));
		hasPermission && (isAuth = true);
	}

	return <React.Fragment>{isAuth && children}</React.Fragment>;
};

export default React.memo(AuthButton);
