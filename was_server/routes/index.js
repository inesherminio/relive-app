const express = require("express");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const router = express.Router();

const dbConnect = require("../../utils/dbConnect");
const User = require("../../models/User");

dbConnect();

function verifyJWT(req, res, next) {
    /* var token = req.headers['x-access-token']; */
    const { token } = req.cookies
    console.log(req.cookies)
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
    });
}

function routes(app) {
    router.put("/imoveis/:id", async (req, res) => {
        try {
            await axios.put(`/wp/v2/imoveis/${req.params.id}`, {
                ...req.body
            })
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ success: false })
        }
    });

    router.get("/test", verifyJWT, async (req, res) => {
        try {

            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ success: false });
        }
    });

    router.post("/login", async (req, res) => { // create a new user
        try {
            const { username, password } = req.body
            // fetch user and test password verification
            await User.getAuthenticated(username, password, function (err, user, reason) {
                if (err) throw err;
                
                // login was successful if we have a user
                if (user) {
                    // handle login success
                    console.log('login success');
                    res.status(201).json({ success: true, user })
                    return;
                }
                // otherwise we can determine why we failed
                var reasons = User.failedLogin;
                switch (reason) {
                    case reasons.NOT_FOUND:
                    case reasons.PASSWORD_INCORRECT:
                        // note: these cases are usually treated the same - don't tell
                        // the user *why* the login failed, only that it did
                        break;
                    case reasons.MAX_ATTEMPTS:
                        // send email or otherwise notify user that account is
                        // temporarily locked
                        break;
                }
            });
        } catch (error) {
            res.status(400).json({ success: false });
        }
    });


    router.post("/users", async (req, res) => { // create a new user
        try {
            const user = await User.create(req.body);
            /* console.log(note, req.body) */
            res.status(201).json({ success: true, user })
        } catch (error) {
            res.status(400).json({ success: false });
        }
    });

    return router;
};

module.exports = routes;