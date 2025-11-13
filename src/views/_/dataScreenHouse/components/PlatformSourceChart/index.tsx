import React, { useEffect, useState } from 'react';
import ECharts from '@/components/Echarts';
import { ECOption } from '@/components/Echarts/config';
import { ranking1, ranking2, ranking3, ranking4 } from './icons/ranking';
import './index.less';
import { Col, Empty, Row, Space, Table, TableProps, Tag } from 'antd';
import FakeData from './FakeData';

interface ChartProp {
	name: string;
	value: number;
	percentage: string;
	maxValue: number;
}

const HotPlateChart: React.FC = () => {
	function formatTimeToUTC8(isoString: string) {
		const date = new Date(isoString);

		// 转换为东八区时间 (UTC+8)
		date.setHours(date.getHours() + 8);

		// 提取时间组件并补零
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, '0');
		const day = String(date.getUTCDate()).padStart(2, '0');
		const hours = String(date.getUTCHours()).padStart(2, '0');
		const minutes = String(date.getUTCMinutes()).padStart(2, '0');
		const seconds = String(date.getUTCSeconds()).padStart(2, '0');

		return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
	}

	const [datasource, setdataSource] = useState([]);
	useEffect(() => {
		fetch('http://127.0.0.1:1880/shelf')
			.then(res => res.json())
			.then(value => {
				// console.log('data', value.data)
				const data = value.data.filter((v: any) => {
					return v.status__c == 'fin-in' && v.onloc_time__c;
				});

				const data1 = data
					.sort((a: any, b: any) => {
						const dateA = new Date(a.onloc_time__c).getTime();
						const dateB = new Date(b.onloc_time__c).getTime();
						return dateA - dateB;
					})
					.slice(0, 6)
					.map((v: any, index: any) => ({ ...v, key: index + 1 }));
				// console.log('data1', data1)

				setdataSource(data1);
			});
	}, []);

	const option1: any = {
		legend: {
			bottom: 10,
			left: 'center',
			data: ['空闲', '预占用', '占用', '禁用'],
			selectorLabel: { color: '#fff', backgroundColor: '#259645', padding: 20 },
			textStyle: { color: '#fff' }, // 图表下方文字
		},
		series: [
			{
				type: 'pie',
				radius: '45%',
				center: ['50%', '40%'],
				selectedMode: 'single',
				data: [
					{ value: 211, name: '空闲' },
					{ value: 3, name: '预占用' },
					{ value: 197, name: '占用' },
					{ value: 379, name: '禁用' },
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						// shadowColor: 'rgba(0, 0, 0, 0.5)',
						shadowColor: 'rgba(234, 212, 228)',
					},
				},
			},
		],
	};
	const option2: any = {
		legend: {
			bottom: 10,
			left: 'center',
			data: ['静止<1天', '静止>2天', '静止时间>1天<2天轴数'],
			selectorLabel: { color: '#fff', backgroundColor: '#259645', padding: 20 },
			textStyle: { color: '#fff' }, // 图表下方文字
		},
		series: [
			{
				type: 'pie',
				radius: '45%',
				center: ['50%', '40%'],
				selectedMode: 'single',
				data: [
					{ value: 90, name: '静止<1天' },
					{ value: 60, name: '静止>2天' },
					{ value: 39, name: '静止时间>1天<2天轴数' },
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						// shadowColor: 'rgba(0, 0, 0, 0.5)',
						shadowColor: 'rgba(234, 212, 228)',
					},
				},
			},
		],
	};
	return (
		<React.Fragment>
			<div className='hot-echarts'>
				<div className='w-full ml-[40px] '>
					<ECharts option={option1} isResize={false} height={140} />
				</div>
				<div className='w-full ml-[120px]'>
					<ECharts option={option2} isResize={false} height={140} />
				</div>
			</div>
			<div className='flex justify-center  text-[18px] text-green-400 font-bold'>库龄最久物料 Top 6</div>
			<div className='mt-[15px] w-full text-white font-mono'>
				<table className='w-full border-collapse'>
					<thead>
						<tr className='text-[14px] text-orange-400'>
							<th className='w-[40px]'>索引</th>
							<th className='w-[40px]'>排</th>
							<th className='w-[40px]'>列</th>
							<th className='w-[40px]'>层</th>
							<th className='w-[90px]'>产品代码</th>
							<th className='w-[190px]'>产品名称</th>
							<th className='w-[90px]'>托盘码</th>
							<th className='w-[90px]'>产品班次</th>
							<th className='w-[90px]'>产品班组</th>
							<th className='w-[190px]'>入库日期</th>
						</tr>
					</thead>
				</table>

				{/* 滚动区域 */}
				<div className='max-h-[300px] overflow-y-auto'>
					<table className='w-full border-collapse'>
						<tbody>
							{FakeData.length != 0 ? (
								FakeData.map((value: any, index: number) => (
									<tr key={index} className='w-[100px] text-[14px]'>
										<td className='w-[40px] ellipsis text-center'>{value.key}</td>
										<td className='w-[40px] ellipsis text-center'>{value.row__c}</td>
										<td className='w-[40px] ellipsis text-center'>{value.col__c}</td>
										<td className='w-[40px] ellipsis text-center'>{value.lay__c}</td>
										<td className='w-[90px] ellipsis text-center'>{value.item_code__c}</td>
										<td className='w-[190px] ellipsis text-center'>{value.item_name__c}</td>
										<td className='w-[90px] ellipsis text-center'>{value.pallet_code__c && value.pallet_code__c.substring(4)}</td>
										<td className='w-[90px] ellipsis text-center'>{value.item_batch__c}</td>
										<td className='w-[90px] ellipsis text-center'>{value.remark3__c}</td>
										<td className='w-[190px] ellipsis text-center'>{formatTimeToUTC8(value.onloc_time__c)}</td>
									</tr>
								))
							) : (
								<div className='flex justify-center mt-[30px]'>
									<Empty description={<div className='text-[#fba926] text-[16px]'>暂无数据</div>} />
								</div>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</React.Fragment>
	);
};

export default HotPlateChart;
