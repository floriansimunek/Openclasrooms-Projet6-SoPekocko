const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const bouncer = require("express-bouncer")(1000, 900000, 2); // contre-attaque bruteforce
bouncer.blocked = (req, res, next, remaining) => {
    res.send(429, "Too many requests have been made," + "please wait" + remaining / 1000 + "seconds");
}

router.post('/signup', userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);

module.exports = router;