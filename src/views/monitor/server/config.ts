import { ECOption } from '@/components/Echarts/config';

// 折线图
export const serveroption = (isDark: boolean): ECOption => {
	return {
		// 标题组件，包含主标题和副标题。
		// title: {
		// 	text: 'Stacked Line',
		// },
		// 提示框组件。
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['cpu', 'cpu', 'Video Ads', 'Direct', 'Search Engine'],
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top: '16%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun22'], // 动态
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: isDark ? '#5e5e5e' : '#e0e6f1',
				},
			},
		},
		series: [
			{
				name: '',
				type: 'line',
				stack: 'Total',
				data: [], // 动态
			},
			{
				name: 'cpu',
				type: 'line',
				stack: 'Total',
				data: [220, 182, 191, 234, 290, 330, 310],
			},
			// {
			//   name: 'Video Ads',
			//   type: 'line',
			//   stack: 'Total',
			//   data: [150, 232, 201, 154, 190, 330, 410],
			// },
			// {
			//   name: 'Direct',
			//   type: 'line',
			//   stack: 'Total',
			//   data: [320, 332, 301, 145, 390, 330, 320],
			// },
		],
	};
};

// 折线图
export const serveroption2 = (isDark: boolean): ECOption => {
	return {
		// 标题组件，包含主标题和副标题。
		// title: {
		// 	text: 'Stacked Line',
		// },
		// 提示框组件。
		tooltip: {
			trigger: 'axis',
		},
		legend: {
			data: ['Union Ads', '内存', 'Video Ads', 'Search Engine'],
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			top: '16%',
			containLabel: true,
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun22'], // 动态
		},
		yAxis: {
			type: 'value',
			splitLine: {
				show: true,
				lineStyle: {
					color: isDark ? '#5e5e5e' : '#e0e6f1',
				},
			},
		},
		series: [
			{
				name: '内存',
				type: 'line',
				stack: 'Total',
				data: [120, 132, 101, 69, 90, 230, 210], // 动态
			},
		],
	};
};
