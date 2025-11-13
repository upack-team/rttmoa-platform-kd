import * as Koa from "koa";
const cors = require("@koa/cors");
 
// * 跨域
const _CrossDomain = (): any => { 
	return async (ctx: any, next: () => Promise<any>): Promise<void> => {
		cors({
				origin: "*", // 可设置为指定域名，例如：http://localhost:9527
				// origin: (ctx: any) => {
				// 	const allowedOrigins = ['http://localhost:9527', 'http://127.0.0.1:9527']
				// 	if (allowedOrigins.includes(ctx.request.header.origin)) { return ctx.request.header.origin }
				// 	return 'http://localhost:9527'
				// },
				credentials: true, // 如果需要支持 cookie
				allowMethods: ["GET", "POST", "PUT", "DELETE"],
				allowHeaders: ["Content-Type", "Authorization"],
			})
			await next();
	};
};

export default _CrossDomain