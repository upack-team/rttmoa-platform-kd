import { Button } from 'antd';
import { IconFont } from '@/components/Icon';
import { setGlobalState } from '@/redux/modules/global';
import { RootState, useDispatch, useSelector } from '@/redux';

// 登陆界面 切换亮暗按钮
const SwitchDark: React.FC = () => {
	const dispatch = useDispatch();
	const isDark = useSelector((state: RootState) => state.global.isDark);

	return (
		<Button
			type='text'
			size='large'
			className='switch-dark'
			icon={<IconFont style={{ fontSize: 22 }} type={isDark ? 'icon-sun' : 'icon-moon'} />}
			onClick={() => dispatch(setGlobalState({ key: 'isDark', value: !isDark }))}
		></Button>
	);
};

// export default SwitchDark;
