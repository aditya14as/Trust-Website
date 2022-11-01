const express = require('express');
const router = express.Router();
const {userRegistration,userLogin,changePassword,getLoggedUser,sendPasswordResetEmail,resetPassword,updateUser} = require('../controllers/authController');
const checkUserAuth = require('../middlewares/authMiddleware');

router.use('/changePassword',checkUserAuth);
router.use('/loggeduser', checkUserAuth);
router.use('/updateuser',checkUserAuth);

//Public Router
router.post('/register',userRegistration);
router.post('/login',userLogin);
router.post('/passwordreset',sendPasswordResetEmail);
router.post('/resetpassword/:id/:token',resetPassword);

//Protected Router
router.post('/changepassword',changePassword);
router.get('/loggeduser',getLoggedUser);
router.patch('/updateuser',updateUser);

module.exports = router;
