import React, { useEffect, useState } from 'react';

// * 监听 【鼠标移动】
export default function useWinMouse() {
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	useEffect(() => {
		const updateMove = () => {
			window.addEventListener('mousemove', e => {
				setX(e.clientX);
				setY(e.clientY);
			});
		};
		window.addEventListener('mousemove', updateMove);
		return () => {
			window.removeEventListener('mousemove', updateMove);
		};
	}, []);

	return { x, y }; // * 返回鼠标的位置
}
