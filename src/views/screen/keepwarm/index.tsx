import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Card, Descriptions, Empty, Form, Typography } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import type { ActionType, FormInstance } from '@ant-design/pro-components';
import Stock from './outStock.png';

// 新增表时：
// 	1、前端修改路由、表格api查询等方法的修改
// 	2、列字段修改 — Column.tsx
// 	3、弹窗字段修改 — Modal.tsx
// 常用字段：文本、数值、选择框、日期

const useProTable = () => {
	const isHasPallet: any = true;
	const list = [
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
		{
			pallet: '043222314',
			materialName: '学生饮用纯牛奶学生 奶学生饮用纯牛奶',
			batch: '240202',
			productDate: '240202',
			productDate2: '240202',
			productDate3: '240202',
			productDate4: '240202',
		},
	];
	return (
		<>
			<Card className='w-full h-full'>
				<Alert message={<div className='font-mono w-full flex justify-center text-[30px] font-bold'> 保温库出库大屏显示</div>} type='info' />
				{list.length == 0 && (
					<div className='w-full h-[850px] flex justify-center items-center'>
						<Empty
							className='flex flex-col justify-center items-center'
							image={Stock}
							styles={{ image: { height: 150 } }}
							description={<div className='font-mono w-full flex justify-center text-[30px] font-bold'> 暂无出库任务</div>}
						/>
					</div>
				)}
				{list.length > 0 && isHasPallet && (
					<div className='w-full h-[850px] flex flex-col justify-center items-center'>
						{list.map(value => {
							console.log(value);
							const items = Object.entries(value).map(([key, val]) => ({
								label: key,
								children: val,
							}));
							return <Descriptions title='托盘号：0432023023' className='mt-[32px]' bordered column={{ xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }} items={items} />;
						})}
					</div>
				)}
				{list.length > 0 && !isHasPallet && (
					<div className='w-full h-[850px] flex justify-center items-center'>
						<Empty
							className='flex flex-col justify-center items-center'
							image={Stock}
							styles={{ image: { height: 150 } }}
							description={<div className='font-mono w-full flex justify-center text-[30px] font-bold'> 暂无出库任务</div>}
						/>
					</div>
				)}
			</Card>
		</>
	);
};

export default useProTable;
