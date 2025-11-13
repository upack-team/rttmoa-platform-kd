import React, { useEffect } from 'react';

// * 【判断是否是初始化渲染】
export default function useInitialRender() {
	const ref = React.useRef<any>(null); // ref.current 初始为 null（整个组件生命周期内不会变引用）
	useEffect(() => {
		ref.current = true; // 在首次渲染结束后，把 current 改成 true
	}, []);
	return ref.current; // 返回当前的 current 值
}

// 使用：
// const isInitialRender = useInitialRender();
// if (isInitialRender === null) {
//   console.log("第一次渲染");
// } else {
//   console.log("已经不是第一次渲染了");
// }
