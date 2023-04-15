const router = require('express').Router();
const ctrls = require('../controllers/productCategories');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');



router.post("/", [verifyAccessToken, isAdmin], ctrls.createCategory);
router.get("/", ctrls.getAllCategory);
router.delete("/:id", [verifyAccessToken, isAdmin], ctrls.deleteCategory);
router.put("/:id", [verifyAccessToken, isAdmin], ctrls.updateCategory);

module.exports = router
