import { useNavigate } from 'react-router-dom';
import notFound from '@/assets/images/notFound.png';
import './index.less';

const NotFound = () => {
	const navigate = useNavigate();

	return (
		<main className='flex flex-col md:flex-row justify-center min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
			<div className='w-[600px]'>
				<img src={notFound} alt='' />
				{/* <Result
					className='error-page'
					status='404'
					title='404'
					subTitle='Sorry, the page you visited does not exist.'
					extra={
						<Button type='primary' onClick={() => navigate(-1)}>
							Go Back
						</Button>
					}
				/> */}
			</div>
			<div className='text-center'>
				{/* <p className="text-base font-semibold text-indigo-600">404</p> */}
				<h1 className='mt-4 text-3xl font-mono font-bold tracking-tight text-gray-900 sm:text-5xl'>找不到页面</h1>
				<p className='mt-6 text-base font-serif leading-7 text-gray-600'>抱歉，我们找不到您要寻找的页面.</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<a
						href='/'
						className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
					>
						回到主页
					</a>
					<a href='/' className='text-sm font-semibold text-gray-900'>
						联系支持<span aria-hidden='true'>&rarr;</span>
					</a>
				</div>
			</div>
		</main>
	);
};

export default NotFound;
