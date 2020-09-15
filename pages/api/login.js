const dbConnect = require("../../utils/dbConnect");
const User = require("../../models/User");
const axios = require('axios');

/* dbConnect();

axios.defaults.baseURL = 'https://relive.pt/wp-json'

axios.post('/jwt-auth/v1/token', { username: 'sergioferras97', password: process.env.PASS })
    .then(res => {
        axios.defaults.headers.common = { 'Authorization': `Bearer ${res.data.token}` }
    })
    .catch(e => console.log("WTF", e)) */


module.exports = async (req, res) => {

    /*     res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'John Doe' }))
     */
    console.log('/api/login')
    if (req.method === 'POST') {
        console.log('POST /api/login')
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
    } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'Nothing here' }))
    }
}