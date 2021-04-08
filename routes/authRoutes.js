const {Router}=require('express');
const authController=require('../controllers/authControllers');
const router =Router();  //creating new instance of the router
router.get('/signup',authController.signup_get);  //now whenever i will get a request Get req for /signup it will fire the function from the controller with signup_get
router.post('/signup',authController.signup_post);
router.get('/login',authController.login_get);
router.post('/login',authController.login_post);
router.get('/logout',authController.logout_get);
module.exports=router;
