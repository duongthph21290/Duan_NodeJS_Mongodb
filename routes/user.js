const router = require('express').Router();
const ctrls = require('../controllers/user');
const { verifyAccessToken } = require('../middlewares/verifityToken');

router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)


module.exports = router

// CRUD | CREATE - READ - UPDATE - DELETE | POST - GET - PUT - DELETE