const router = require('express').Router();
const ctrls = require('../controllers/blogCategories');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');



router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get("/", ctrls.getAllBlog);
router.delete("/:id", [verifyAccessToken, isAdmin], ctrls.deleteBlog);
router.put("/:id", [verifyAccessToken, isAdmin], ctrls.updateBlog);

module.exports = router
