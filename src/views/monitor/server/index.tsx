import { Alert, Card, Col, Progress, Row } from 'antd';
import Png from './server.png';
import { Image } from 'antd';
import ECharts from '@/components/Echarts';
import { option1Fn, option2Fn } from '@/views/assembly/echarts/config';
import { RootState, useSelector } from '@/redux';
import { serveroption, serveroption2 } from './config';
import { useEffect } from 'react';

const Online: React.FC = () => {
	const isDark = useSelector((state: RootState) => state.global.isDark);

	useEffect(() => {}, []);
	return (
		<div>
			<Card>
				<span className=''>系统：</span>
				<span className='ml-[30px]'>IP：</span>
				<span className='ml-[30px]'>项目不间断运行：</span>
			</Card>
			<Card className='mt-[15px]'>
				<div className='flex flex-row justify-evenly'>
					<div className='flex flex-col items-center text-[18px] text-gray-400'>
						<div>CPU使用率</div>
						<Progress className='my-4' type='dashboard' percent={50} size={140} />
						<div>1 核心</div>
					</div>
					<div className='flex flex-col items-center text-[18px] text-gray-400'>
						<div>内存使用率</div>
						<Progress className='my-4' type='dashboard' percent={50} size={140} />
						<div>1.6 GiB / 3.7 GiB</div>
					</div>
					<div className='flex flex-col items-center text-[18px] text-gray-400'>
						<div>交换区使用率</div>
						<Progress className='my-4' type='dashboard' percent={50} size={140} />
						<div>0 bytes / 8.0 GiB</div>
					</div>
					<div className='flex flex-col items-center text-[18px] text-gray-400'>
						<div>磁盘使用率</div>
						<Progress className='my-4' type='dashboard' percent={50} size={140} />
						<div>18.14GB / 78.19GB</div>
					</div>
				</div>
			</Card>
			<Row gutter={[12, 10]} className='mt-[15px]'>
				<Col xl={12} lg={12} md={24} sm={24} xs={24}>
					<Card hoverable title='CPU使用率监控'>
						<ECharts width={'100%'} height={284} option={serveroption(isDark)} />
					</Card>
				</Col>
				<Col xl={12} lg={12} md={24} sm={24} xs={24}>
					<Card hoverable title='内存使用率监控'>
						<ECharts width={'100%'} height={284} option={serveroption2(isDark)} />
					</Card>
				</Col>
			</Row>
			<Card className='mt-[80px]'>
				<Alert message='示例：' type='info' showIcon />
				<br />
				<Image width={1600} src={Png} />
			</Card>
		</div>
	);
};

export default Online;
