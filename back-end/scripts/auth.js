'use strict'
const bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    db = require('./db'),
    secret = require('./util').secret;

/*
 * Callback takes 2 parameters: err and account
 */
function createAccount(account, callback) {
    db.createUser(account, function(err, newId) {
        if (err) {
            callback(err, null);
            return;
        }
        delete account.hash;
        callback(null, account);
    })
}

function login (email, password, callback) {
    console.log(email, password);

    if (!email)
        return callback(new Error('email cannot be null'));
    if (!password)
        return callback(new Error('password cannot be null'));

    db.findUserByEmail(email, function (err, userDetails) {
        if (err || !userDetails) {
            callback(err, null);
            return;
        }

        var hash = userDetails.hash;

        checkPassword(password, hash, function (err, pwdOk) {
            if (err) {
                callback(err, false);
            } else if (!pwdOk) {
                callback(new Error('Wrong username/password'), null)
            } else {
                var response = {
                        username: userDetails.username,
                        email: userDetails.email,
                        fullName: userDetails.fullName,
                        group_list: userDetails.group_list
                    },
                    token = getJwt(response);

                callback(null, token);
            }
        })
    })
}

function getJwt (payload) {
    return jwt.sign(payload, secret, {
        expiresInMinutes: 1440 //Expires after a day
    });
}

function checkPassword (pwd, hash, callback) {
    bcrypt.compare(pwd, hash, callback);
}

module.exports = {
    createAccount: createAccount,
    login: login
}