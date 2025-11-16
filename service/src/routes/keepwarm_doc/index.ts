import Router from '@koa/router';
const router = new Router();

import create_order from './create_order';
import create_order_bind from './create_order_bind'; 

 

export default (app: any) => {
	router.use('/keepwarm/createOrder', create_order.routes());
	router.use('/keepwarm/createOrderBind', create_order_bind.routes()); 

	app.use(router.routes()).use(router.allowedMethods());
};
