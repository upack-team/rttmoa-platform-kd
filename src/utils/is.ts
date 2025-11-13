/* eslint-disable no-useless-escape */
import { parse, stringify } from 'qs';

type argParams = string | number | [] | Object | Function | undefined | null;

export class Is {
	//* 优点：能够快速区分基本数据类型 缺点：不能将Object、Array和Null区分，都返回object
	static a_typeof() {
		console.log(typeof 2); // number
		console.log(typeof true); // boolean
		console.log(typeof 'str'); // string
		console.log(typeof undefined); // undefined
		console.log(typeof []); // object
		console.log(typeof {}); // object
		console.log(typeof function () {}); // function
		console.log(typeof null); // object
	}

	//* 优点：能够区分Array、Object和Function，适合用于判断自定义的类实例对象 缺点：Number，Boolean，String基本数据类型不能判断
	static ainstanceof() {
		// console.log(2 instanceof Number); // false
		// console.log(true instanceof Boolean); // false
		// console.log("str" instanceof String); // false
		console.log([] instanceof Array); // true
		console.log(function () {} instanceof Function); // true
		console.log({} instanceof Object); // true
	}

	//* 优点：精准判断数据类型 缺点：写法繁琐不容易记，推荐进行封装后使用
	static acall() {
		const toString = Object.prototype.toString;
		console.log(toString.call(2)); //[object Number]
		console.log(toString.call(true)); //[object Boolean]
		console.log(toString.call('str')); //[object String]
		console.log(toString.call([])); //[object Array]
		console.log(toString.call(function () {})); //[object Function]
		console.log(toString.call({})); //[object Object]
		console.log(toString.call(undefined)); //[object Undefined]
		console.log(toString.call(null)); //[object Null]
	}

	static getType(arg: argParams) {
		return Object.prototype.toString.call(arg).slice(8, -1);
	}

	static abc = 123;

	/**
	 * @description utils-检查值是否属于某种类型
	 * @param {unknown} unknown 任意参数
	 * @param {string} string 任意参数对应的类型
	 * @returns {boolean} 返回给调用位置，校验是否为真
	 */
	static is(val: unknown, type: string) {
		return Object.prototype.toString.call(val) === `[object ${type}]`;
	}

	/**
	 * @description 👇 是字符串
	 */
	static isString(val: unknown): val is string {
		// isString("")
		// console.log('tis', Is.abc);
		return Is.is(val, 'String');
	}
	/**
	 * @description 👇 是数值
	 */
	static isNumber(val: unknown): val is number {
		// isNumber(+'1')
		return Is.is(val, 'Number');
	}

	/**
	 * @description 👇 是布尔
	 */
	static isBoolean(val: unknown): val is boolean {
		// isBoolean(new Boolean)
		return Is.is(val, 'Boolean');
	}

	/**
	 * @description 👇 是对象
	 */
	static isObject(val: any): val is Record<any, any> {
		// isObject({} || new Object || undefined || null || () => {})
		return val !== null && Is.is(val, 'Object');
	}

	/**
	 * @description 👇 是数组
	 */
	static isArray(val: any): val is Array<any> {
		// isArray([])
		return val && Array.isArray(val);
	}

	/**
	 * @description 👇 是日期
	 */
	static isDate(val: unknown): val is Date {
		// isDate(new Date())
		return Is.is(val, 'Date');
	}

	/**
	 * @description 👇 是函数
	 */
	static isFunction<T = Function>(val: unknown): val is T {
		// isFunction(() => {})
		return Is.is(val, 'Function');
	}

	/**
	 * @description 👇 是false
	 */
	static isFalse(o: any) {
		if (o == '' || o == undefined || o == null || o == 'null' || o == 'undefined' || o == 0 || o == false || Number.isNaN(o)) return true;
		return false;
	}

	/**
	 * @description 👇 是undefined
	 */
	static isDef = <T = unknown>(val?: T): val is T => {
		return typeof val !== 'undefined';
	};

	/**
	 * @description 👇 不是undefined
	 */
	static isUnDef = <T = unknown>(val?: T): val is T => {
		return !Is.isDef(val);
	};

	/**
	 * @description: 👇 是null.
	 */
	static isNull(val: unknown): val is null {
		// isNull(null)
		return val === null;
	}

	/**
	 * @description: 👇 检查值是否为 null 或 undefined.
	 */
	static isNullOrUnDef(val: unknown): val is null | undefined {
		// isNullOrUnDef(undefined || null)
		return Is.isUnDef(val) || Is.isNull(val);
	}

	/**
	 * @description 👇 检查一个值是否是一个普通对象
	 * Copied from https://github.com/sindresorhus/is-plain-obj/blob/97480673cf12145b32ec2ee924980d66572e8a86/index.js
	 */
	static isPlainObject(value: unknown): boolean {
		if (Object.prototype.toString.call(value) !== '[object Object]') {
			return false;
		}
		const prototype = Object.getPrototypeOf(value);
		return prototype === null || prototype === Object.getPrototypeOf({});
	}

	/**
	 * @description 👇 判断数据类型
	 * @param {Any} val 需要判断类型的数据
	 * @return string
	 */
	static isType = (val: any) => {
		if (val === null) return 'null';
		if (typeof val !== 'object') return typeof val;
		else return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
	};

	/**
	 * @description 👇 是AsyncFunction
	 */
	static isAsyncFunction<T = any>(val: unknown): val is Promise<T> {
		// isAsyncFunction(async () => {})
		return Is.is(val, 'AsyncFunction');
	}

	/**
	 * @description 👇 是Promise
	 */
	static isPromise<T = any>(val: unknown): val is Promise<T> {
		return Is.is(val, 'Promise') && Is.isObject(val) && Is.isFunction(val.then) && Is.isFunction(val.catch);
	}

	/**
	 * @description: 👇 检查是否是客户端。
	 */
	static isClient = () => {
		return typeof window !== 'undefined';
	};

	/**
	 * @description: 👇 检查是否是浏览器.
	 */
	static isWindow = (val: any): val is Window => {
		return typeof window !== 'undefined' && Is.is(val, 'Window');
	};

	/**
	 * @description: 👇 检查它是否是一个元素.
	 */
	static isElement = (val: unknown): val is Element => {
		return Is.isObject(val) && !!val.tagName;
	};

	/**
	 * @description: 👇 检查它是否是十六进制颜色.
	 */
	static isHexColor = (str: string) => {
		// isHexColor("#fff")
		return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str);
	};

	/**
	 * @description: 👇 是否是搜索参数.
	 */
	static isURLSearchParams = (val: any) => {
		return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
	};

	/**
	 * @description 👇 获取参数对象
	 */
	static getParamObject = (val: { toString: () => any }) => {
		if (Is.isURLSearchParams(val)) {
			return parse(val.toString(), { strictNullHandling: true });
		}
		if (typeof val === 'string') {
			return [val];
		}
		return val;
	};

	/**
	 * @description 👇 格式化请求参数
	 */
	static reqStringify = (val: any) => {
		return stringify(val, { arrayFormat: 'repeat', strictNullHandling: true });
	};

	/** #### 👇 检查要校验的内容(手机号、身份证、QQ、邮箱.....)， 类型  */
	static checkStr(str: any, type: string): string | boolean {
		switch (type) {
			case 'phone': // 手机号码
				return /^1[3|4|5|6|7|8][0-9]{9}$/.test(str);
			case 'tel': // 座机
				return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
			case 'card': // 身份证
				return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
			case 'pwd': // 密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
				return /^[a-zA-Z]\w{5,17}$/.test(str);
			case 'postal': // 邮政编码
				return /[1-9]\d{5}(?!\d)/.test(str);
			case 'QQ': // QQ号
				return /^[1-9][0-9]{4,9}$/.test(str);
			case 'email': // 邮箱
				return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
			case 'money': // 金额(小数点2位)
				return /^\d*(?:\.\d{0,2})?$/.test(str);
			case 'URL': //网址
				return /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str);
			case 'IP': //IP
				return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
			case 'date': // 日期时间
				return /^(\d{4})\-(\d{2})\-(\d{2}) (\d{2})(?:\:\d{2}|:(\d{2}):(\d{2}))$/.test(str) || /^(\d{4})\-(\d{2})\-(\d{2})$/.test(str);
			case 'number': // 数字
				return /^[0-9]$/.test(str);
			case 'english': // 英文
				return /^[a-zA-Z]+$/.test(str);
			case 'chinese': // 中文
				return /^[\u4E00-\u9FA5]+$/.test(str);
			case 'lower': // 小写
				return /^[a-z]+$/.test(str);
			case 'upper': // 大写
				return /^[A-Z]+$/.test(str);
			case 'HTML': // HTML标记
				return /<("[^"]*"|'[^']*'|[^'">])*>/.test(str);
			default:
				return true;
		}
	}

	/** ##### 👇 严格的身份证校验: 231085196611011415  */

	/** ##### 👇 是否是IOS  */
	static isIOS(): boolean {
		var u = navigator.userAgent;
		if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
			// return "Android";
			return false;
		} else if (u.indexOf('iPhone') > -1) {
			// return "iPhone";
			return true;
		} else if (u.indexOf('iPad') > -1) {
			// return "iPad";
			return false;
		} else if (u.indexOf('Windows Phone') > -1) {
			// return "Windows Phone";
			return false;
		} else {
			return false;
		}
	}

	/** ##### 👇 是否是PC  */
	static isPC(): boolean {
		var userAgentInfo = navigator.userAgent;
		var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
		var flag = true;
		for (let v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	/**
	 * @description 👇 is-browser
	 * @returns {boolean}
	 */
	static isBrowser = () => {
		return typeof window !== 'undefined' && typeof window.document !== 'undefined';
	};

	/** ##### 👇 获取浏览器、返回浏览器版本  */
	static isBrowserType(): string | undefined {
		let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		console.log('utils is isBrowserType', userAgent);
		let isOpera = userAgent.indexOf('Opera') > -1; //判断是否Opera浏览器
		let isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; //判断是否IE浏览器
		let isEdge = userAgent.indexOf('Edge') > -1; //判断是否IE的Edge浏览器
		let isFF = userAgent.indexOf('Firefox') > -1; //判断是否Firefox浏览器
		let isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1; //判断是否Safari浏览器
		let isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1; //判断Chrome浏览器
		if (isIE) {
			let reIE = new RegExp('MSIE (\\d+\\.\\d+);');
			reIE.test(userAgent);
			let fIEVersion = parseFloat(RegExp['$1']);
			if (fIEVersion == 7) return 'IE7';
			else if (fIEVersion == 8) return 'IE8';
			else if (fIEVersion == 9) return 'IE9';
			else if (fIEVersion == 10) return 'IE10';
			else if (fIEVersion == 11) return 'IE11';
			else return 'IE7以下'; //IE版本过低
		}
		if (isFF) return 'FF';
		if (isOpera) return 'Opera';
		if (isEdge) return 'Edge';
		if (isSafari) return 'Safari';
		if (isChrome) return 'Chrome';
		return undefined;
	}
}

/** #### 是否是微信浏览器  */
/** #### 是否是移动端  */
/** #### 是否是QQ浏览器  */
/** #### 是否是爬虫  */
/** #### 是否ios  */
