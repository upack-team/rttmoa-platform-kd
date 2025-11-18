import Router = require("@koa/router");
import Controllers from "../../controllers/keepwarm_doc/create_order";
const router = new Router();


router.post("/query", Controllers.Query);  // 查询

router.post("/add", Controllers.Add); // 增加

router.put("/mod/:id", Controllers.Mod); // 修改

router.delete("/del/:id", Controllers.Del);  // 删除

router.post("/delMore", Controllers.DelMore);  // 删除更多

router.post("/importEx", Controllers.ImportEx);  // 导入Excel表格

 
export default router;
