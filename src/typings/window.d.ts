import { NavigateFunction } from 'react-router-dom';
import { NetworkState } from '@/hooks/_/useNetworkStatus';

// https://wangdoc.com/typescript/declare
// d.ts 仅供 声明类型
declare global {
	interface Navigator {
		msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
		browserLanguage: string;
		connection: NetworkState;
		mozConnection: NetworkState;
		webkitConnection: NetworkState;
		deviceMemory: number;
	}
	// 扩展 window 对象
	interface Window {
		$navigate: NavigateFunction;
		EyeDropper: new () => {
			open(options?: { signal: AbortSignal }): Promise<{ sRGBHex: string }>;
		};
	}
	// * 在项目中直接引用、不用import导入
	// const AButton: (typeof import('antd'))['Button'];
	// const Error500: typeof import('../components/Error/500');
}

export {};

// const languageType = Navigator.browserLanguage;
// const navigate = Window.$navigate;
