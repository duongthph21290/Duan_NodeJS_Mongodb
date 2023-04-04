const router = require('express').Router();
const ctrls = require('../controllers/product');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get('/', ctrls.getAllProduct);
router.get('/:id', ctrls.getProduct);
router.put('/:id', [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete('/:id', [verifyAccessToken, isAdmin], ctrls.deleteProduct);




module.exports = router
 