const {Router} = require('express')
const authController = require('../controllers/auth.controller')
const authUser = require('../middlewares/auth.middleware')

const router = Router()

/**
 * @route api/auth/register
 * @description resisters the user
 * @access public
 */
router.post('/register',authController.registerUserController)

/**
 * @route api/auth/login
 * @description login user with their valid email and password
 * @access public
 */

router.post('/login',authController.loginUserController)

/**
 * @route /api/auth/logout
 * @description clear the cookie
 * @access public
 */
router.get('/logout',authController.logoutUserController)

/**
 * @route /api/auth.getme
 * @description get the user and check if the token is blacklisted
 * @access public
 */
router.get('/getMe',authUser,authController.getMeController)
module.exports = router
