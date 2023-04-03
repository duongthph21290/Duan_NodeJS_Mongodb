const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifityToken');

router.post('/register', ctrls.register);
router.post('/login', ctrls.login);
router.get('/current', verifyAccessToken, ctrls.getCurrent);
router.post('/refreshtoken', ctrls.refreshAccessToken);
router.get('/logout', ctrls.logout);
router.get('/forgotpassword', ctrls.forgotpassword);
router.put('/resetPassword', ctrls.resetPassword);


module.exports = router

// CRUD | CREATE - READ - UPDATE - DELETE | POST - GET - PUT - DELETE

// CREATE (POST) + PUT --> body

// GET + DELETE - query //?uiuaids