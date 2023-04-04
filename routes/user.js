const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifityToken');

router.post('/register', ctrls.register);
router.post('/login', ctrls.login);
router.get('/current', verifyAccessToken, ctrls.getCurrent);
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete('/', [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put('/currentupdate', verifyAccessToken, ctrls.updateUser);
router.put('/:id', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin);
router.post('/refreshtoken', ctrls.refreshAccessToken);
router.get('/logout', ctrls.logout);
router.get('/forgotpassword', ctrls.forgotpassword);
router.put('/resetPassword', ctrls.getUsers);


module.exports = router

// CRUD | CREATE - READ - UPDATE - DELETE | POST - GET - PUT - DELETE

// CREATE (POST) + PUT --> body

// GET + DELETE - query //?uiuaids