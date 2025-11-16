import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Card, Descriptions, Empty } from 'antd';
import Stock from './outStock.png';

// 新增表时：
// 	1、前端修改路由、表格api查询等方法的修改
// 	2、列字段修改 — Column.tsx
// 	3、弹窗字段修改 — Modal.tsx
// 常用字段：文本、数值、选择框、日期
const useProTable = () => {
	const list = [
		{
			title: '04240111111',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '04240222222',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '04240333333',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '04240444444',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '042405555555',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '042406666666',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
		{
			title: '04240777777',
			description: '物料名称：学生饮用纯牛奶、批号：241142、生产日期：12312312 ',
		},
	];
	const info: any = [
		{
			label: '出库时间',
			children: '2025-11-16 16:39',
			span: 'filled',
			labelStyle: { width: 250, fontSize: 26, fontWeight: 700 },
			contentStyle: { fontSize: 26, fontWeight: 700 },
		},
		{
			label: '物料名称',
			children: '学生饮用纯牛奶',
			span: 'filled',
			labelStyle: { width: 250, fontSize: 26, fontWeight: 700 },
			contentStyle: { fontSize: 26, fontWeight: 700 },
		},
		{
			label: '批号',
			children: '20251104',
			span: 'filled',
			labelStyle: { width: 250, fontSize: 26, fontWeight: 700 },
			contentStyle: { fontSize: 26, fontWeight: 700 },
		},
		{
			label: '生产日期',
			children: '20251104',
			span: 'filled',
			labelStyle: { width: 250, fontSize: 26, fontWeight: 700 },
			contentStyle: { fontSize: 26, fontWeight: 700 },
		},
	];
	const scrollRef = useRef(null);

	useEffect(() => {
		const scrollEl: any = scrollRef.current;
		if (!scrollEl) return;

		let scrollSpeed = 1.5; // 每次滚动 px
		const interval = 200; // 滚动间隔时间 ms

		const autoScroll = setInterval(() => {
			if (!scrollEl) return;

			// 当前已滚动位置 + 可视高度 >= 内容总高度 → 到底
			if (scrollEl.scrollTop + scrollEl.clientHeight + 20 >= scrollEl.scrollHeight) {
				scrollEl.scrollTop = 0; // 🔥 回顶部
			} else {
				scrollEl.scrollTop += scrollSpeed; // 向下滚
			}
		}, interval);

		return () => clearInterval(autoScroll);
	}, []);

	const [isArrive, setisArrive] = useState(true); // 当前站点是否有托盘
	const [newList, setnewList] = useState<any>([]);

	const renderHeader = () => (
		<>
			<Alert message={<div className='font-mono w-full flex justify-center text-[30px] font-bold'>保温库出库大屏显示</div>} type='info' />

			<Button className='mt-4' onClick={() => setisArrive(!isArrive)}>
				托盘到位
			</Button>
			<Button
				className='mt-4'
				onClick={() => {
					newList.length == 0 ? setnewList(list) : setnewList([]);
				}}
			>
				出库任务
			</Button>
		</>
	);

	const renderNoTask = () => (
		<div className='w-full h-[850px] flex justify-center items-center'>
			<Empty
				className='flex flex-col justify-center items-center'
				image={Stock}
				styles={{ image: { height: 150 } }}
				description={<div className='font-mono w-full flex justify-center text-[30px] font-bold'>暂无出库任务</div>}
			/>
		</div>
	);

	const renderTaskHeader = () => <Alert className='w-[600px] mt-[20px]' message={<div className='w-full text-center font-sans font-bold text-[24px]'>所有出库任务：30个 —— 当前站点：7个</div>} type='success' />;

	const renderTaskList = () => (
		<div className='w-full h-[850px] flex flex-col mt-[20px] mx-[60px]'>
			{renderTaskHeader()}
			<div ref={scrollRef} className='mt-[30px] max-h-[1200px] overflow-y-auto overflow-x-hidden'>
				<StepList current={3} steps={list} />
			</div>
		</div>
	);

	const renderPalletInfo = () => (
		<div className='w-full h-[850px] flex flex-col mt-[20px] mx-[60px]'>
			{renderTaskHeader()}
			<Descriptions
				className='mt-[60px] text-[22px]'
				bordered
				title={<span className='text-[28px] font-bold font-mono'>当前托盘号：0421353131</span>}
				items={info.map((i: any) => ({
					...i,
					label: <span className='text-[22px] font-bold'>{i.label}</span>,
					children: <span className='text-[22px]'>{i.children}</span>,
				}))}
			/>
		</div>
	);

	return (
		<Card className='w-full h-full'>
			{renderHeader()}

			{/* 1. 无任务 */}
			{newList.length > 0 && renderNoTask()}

			{/* 2. 有任务但托盘未到达 */}
			{list.length > 0 && newList.length == 0 && isArrive && renderTaskList()}

			{/* 3. 有任务且托盘到达终点 */}
			{list.length > 0 && newList.length == 0 && !isArrive && renderPalletInfo()}
		</Card>
	);
};
const StepList = ({ steps, current }: any) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			{steps.map((step: any, index: any) => {
				// const isActive = index === current;
				// const isFinished = index < current;

				const isActive = false;
				const isFinished = true;
				return (
					<div key={index} className='flex justify-start gap-4'>
						{/* 左侧图标 */}
						<div
							className={`w-[55px] h-[55px] mt-3  rounded-full text-white text-[18px] flex items-center justify-center  font-bold  ${isActive ? 'bg-[#1677ff]' : isFinished ? 'bg-[#52c41a]' : 'bg-[#d9d9d9]'}`}
						>
							{index + 1}
						</div>

						{/* 右侧内容 */}
						<div>
							<div className={`text-[38px]   font-bold mb-1 ${isActive ? 'text-[#1677ff]' : 'text-[#333]'}`}>{step.title}</div>

							<div className='max-w-[1400px] font-mono text-[32px] text-[#666]  font-bold leading-[1.3]'>{step.description}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default useProTable;
