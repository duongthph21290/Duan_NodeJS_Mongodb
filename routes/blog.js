const router = require('express').Router();
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');
const ctrls = require('../controllers/blog')



router.get('/', ctrls.getAllBlog);
router.get('/:bid', ctrls.getBlog);
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog);
router.put('/dislike/:bid', [verifyAccessToken], ctrls.disLikeBlog);
router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog);
router.put('/update/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete('/delete/:bid', [verifyAccessToken, isAdmin], ctrls.removeBlog);



module.exports = router; 