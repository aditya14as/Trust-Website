const express = require('express');
const router = express.Router();
const {contactUs} = require('../controllers/contactUsController');

router.post('/',contactUs);

module.exports = router;