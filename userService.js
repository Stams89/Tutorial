const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { model } = require('mongoose');
const User = require('../models/User');


const JWT_SECRET = 'qaagggdhae';

async function register(username, password) {
    const existing = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    if (existing) {
        throw new Error('Username is taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        hashedPassword
    });

    // TODO see assignment if registration creates user session
    return createSession(user);

}

async function login(username, password) {
    const user = await User.findOne({ username }).collation({ locale: 'en', strength: 2 });
    if (!user) {
        throw new Error('Incorrect username ot password');
    }
    const hasMatch = await bcrypt.compare(password, user.hashedPassword); //it is predicate

    if (hasMatch == false) {
        throw new Error('Incorrect username ot password');
    }

    return token = createSession(user);
    
}

function createSession({ _id, username }) {
    const payload = {
        _id,
        username
    };

    return token = jwt.sign(payload, JWT_SECRET);
    
}

function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

module.exports = {
    register,
    login,
    verifyToken
}