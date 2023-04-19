const router = require('express').Router();
const ctrls = require('../controllers/brand');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');



router.post("/", [verifyAccessToken, isAdmin], ctrls.createBrand);
router.get("/", ctrls.getAllBrand);
router.delete("/:id", [verifyAccessToken, isAdmin], ctrls.deleteBrand);
router.put("/:id", [verifyAccessToken, isAdmin], ctrls.updateBrand);

module.exports = router
