const { body, validationResult } = require('express-validator');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const { isGuest } = require('../middlewares/guard');

const authController = require('express').Router();


authController.get('/register', isGuest(), (req, res) => {
    // TODO replace with actual view by assignment
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(),
    body('username')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters')
        .isAlphanumeric().withMessage('Username must be at least 5 characters'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
        .isAlphanumeric().withMessage('Password must be at least 5 characters'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            if (req.body.password != req.body.repass) {
                throw new Error('Password don\'t match');
            }

            const token = await register(req.body.username, req.body.password);

            // TODO check assignment to see if register creates sessions
            res.cookie('token', token);
            res.redirect('/'); // TODO replace with redirect by assignment
        } catch (error) {
            const errors = parseError(error);

            // TODO add error display to actual template from assignment
            res.render('register', {
                title: 'Register Page',
                errors,
                body: {
                    username: req.body.username
                }

            });
        }
    });

authController.get('/login', isGuest(), (req, res) => {
    //TODO replace with actual view by assignment
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);

        res.cookie('token', token);
        res.redirect('/');  // TODO replace with redirect by assignment
    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;