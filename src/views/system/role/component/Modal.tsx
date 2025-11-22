import { FindAllMenu } from '@/api/modules/system';
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Radio, Row, Space, Switch, Tree } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';

const ModalComponent = (Params: any) => {
	const { form, modalIsVisible, setModalIsVisible, modalTitle, modalType, modalUserInfo: userInfo, handleModalSubmit } = Params;

	const [menuList, setMenuList] = useState<any>([]);
	const [keyToIdMap, setKeyToIdMap] = useState<Record<string, string>>({});
	const [idToKeyMap, setIdToKeyMap] = useState<Record<string, string>>({});
	const [expandedKeys, setExpandedKeys] = useState([]); // 展开
	const [checkedKeys, setCheckedKeys] = useState<any>([]); // 全选

	function transformRoutes(routes: any[]) {
		const k2i: Record<string, string> = {};
		const i2k: Record<string, string> = {};
		const walk = (nodes: any[]): any[] =>
			nodes.map((route: any) => {
				const key = route.meta?.key || '';
				const id = route.unique || '';
				if (key && id) {
					k2i[key] = id;
					i2k[id] = key;
				}
				const item: any = { title: route.meta?.title || '', key };
				if (Array.isArray(route.children) && route.children.length > 0) {
					item.children = walk(route.children);
				}
				return item;
			});
		const tree = walk(routes);
		setKeyToIdMap(k2i);
		setIdToKeyMap(i2k);
		return tree;
	}

	useEffect(() => {
		FindAllMenu({ name: 'all' }).then((res: any) => {
			setMenuList(transformRoutes(res.data || []) as any);
			setExpandedKeys([]);
			const initKeys =
				modalType == 'create'
					? ''
					: Array.isArray(userInfo.permission_ids)
						? userInfo.permission_ids.map((id: string) => idToKeyMap[id]).filter(Boolean)
						: Array.isArray(userInfo.menuList)
							? userInfo.menuList.map((id: string) => idToKeyMap[id]).filter(Boolean)
							: '';
			setCheckedKeys(initKeys);
			form.setFieldsValue({
				role_name: modalType == 'create' ? '' : userInfo.role_name,
				permission_str: modalType == 'create' ? '' : userInfo.permission_str,
				level: modalType == 'create' ? 1 : userInfo.level,
				sort: modalType == 'create' ? 1 : userInfo.sort,
				status: modalType == 'create' ? false : userInfo.status,
				desc: modalType == 'create' ? '' : userInfo.desc,
			});
		});
	}, [modalType, userInfo]);

	// 取消按钮
	const OnCancel = () => {
		setExpandedKeys([]);
		setCheckedKeys([]);
		setModalIsVisible(false);
	};

	// * 提交最终数据 （将菜单处理为menu格式、为每个角色可以直接使用的菜单结构）
	const FormOnFinish = () => {
		// 🔧 Step 1：递归查找某个 key 的路径
		function findPathByKey(tree: any, targetKey: any, path = []) {
			for (const node of tree) {
				const currentKey = node.key;
				const newPath: any = [...path, currentKey];
				if (currentKey === targetKey) {
					return newPath;
				}
				if (node.children && node.children.length > 0) {
					const found: any = findPathByKey(node.children, targetKey, newPath);
					if (found) return found;
				}
			}
			return null;
		}
		function findPathsForKeys(tree: any, keys: any[]) {
			const result = new Set(); // 使用 Set 避免重复
			keys.forEach((key: any) => {
				const path = findPathByKey(tree, key);
				if (path) {
					path.forEach((k: unknown) => result.add(k)); // 父节点也加入
				}
			});
			return Array.from(result); // 最终返回扁平 key 数组
		}
		const flatKeys = findPathsForKeys(menuList, checkedKeys);
		const menuIds = flatKeys.map((k: any) => keyToIdMap[k]).filter(Boolean);
		const checkedIds = checkedKeys.map((k: any) => keyToIdMap[k]).filter(Boolean);
		// console.log('所有菜单：', menuList);
		// console.log('checkedKeys', checkedKeys);
		// console.log('flatKeys', flatKeys); // 获取到所有的父子菜单： ['menu', 'menu2', 'menu22', 'menu221', 'menu222']
		const formList = form.getFieldsValue();
		if (modalType == 'edit') {
			formList._id = userInfo._id;
		}
		formList.permission_menu = checkedKeys;
		formList.permission_ids = checkedIds;
		formList.menuList = menuIds;
		handleModalSubmit && handleModalSubmit(modalType, formList);
	};

	const getAllKeys = (nodes: any) => {
		const keys: any[] = [];
		const traverse = (arr: any[]) => {
			arr.forEach((item: { key: any; children: any }) => {
				keys.push(item.key);
				if (item.children) traverse(item.children);
			});
		};
		traverse(nodes);
		return keys;
	};
	// 展开/折叠
	const ExpandedFunc = (e: any) => {
		const isTrue = e.target.checked;
		if (isTrue) {
			const allKeys: any = getAllKeys(menuList);
			setExpandedKeys(allKeys);
		} else {
			setExpandedKeys([]);
		}
	};
	// 全选/全不选
	const SelectAllFunc = (e: any) => {
		const isTrue = e.target.checked;
		if (isTrue) {
			const allKeys: any = getAllKeys(menuList);
			setCheckedKeys(allKeys);
		} else {
			setCheckedKeys([]);
		}
	};
	const OnSubmit = () => {
		form.submit();
	};
	return (
		<Modal
			title={modalTitle}
			width={600}
			open={modalIsVisible}
			onCancel={OnCancel}
			footer={[
				<Button danger loading={false} onClick={OnCancel}>
					取消
				</Button>,
				<Button key='link' type='primary' loading={false} onClick={OnSubmit}>
					提交
				</Button>,
			]}
		>
			<Form className='mt-[40px] mb-[100px] px-[20px] max-h-[500px] overflow-auto' layout='horizontal' form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} onFinish={FormOnFinish}>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label='角色名称' name='role_name' rules={[{ required: true, message: '必填：角色名称' }]}>
							<Input placeholder='请输入角色名称' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='权限字符' name='permission_str' rules={[{ required: true, message: '必填：权限字符' }]}>
							<Input placeholder='请输入权限字符' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='角色级别' name='level' rules={[{ required: true, message: '必填：角色级别' }]}>
							<InputNumber defaultValue={1} className='always-show-handler' keyboard={false} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='角色顺序' name='sort' rules={[{ required: true, message: '必填：角色顺序' }]}>
							<InputNumber defaultValue={1} className='always-show-handler' keyboard={false} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='角色状态' name='status' rules={[{ required: false }]}>
							<Switch />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='菜单分配' name='permission_menu' rules={[{ required: false, message: '必填：菜单权限' }]}>
							<div className='mt-[6px] px-3 w-full flex justify-between'>
								<div>
									<Checkbox onChange={ExpandedFunc}>展开/折叠</Checkbox>
								</div>
								<div>
									<Checkbox onChange={SelectAllFunc}>全选/全不选</Checkbox>
								</div>
								<div>
									<Checkbox defaultChecked onChange={() => {}}>
										父子联动
									</Checkbox>
								</div>
							</div>
							<div className='mt-3 w-full p-3  border-[1px] rounded-lg'>
								<Tree
									// checkStrictly={!linkage} // 父子联动
									checkStrictly={false}
									showLine
									checkable
									treeData={menuList}
									checkedKeys={checkedKeys}
									expandedKeys={expandedKeys}
									// 自动寻找父级吗？
									onExpand={(keys: any) => {
										setExpandedKeys(keys);
									}}
									onCheck={(keys: any) => {
										setCheckedKeys(keys);
									}}
								/>
							</div>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='角色描述' name='desc' rules={[{ required: false }]}>
							<TextArea rows={3} placeholder='请输入内容' maxLength={60} />
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
export default ModalComponent;
