const jwt = require('jsonwebtoken')

//authenticates json web token
function authenticateToken(req, res, next) {
    //get token from header in format "Bearer: token"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //no token, unauthorized
    if (!token) return res.sendStatus(401);

    //verifies token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        //invalid token
        if (err) return res.sendStatus(401);

        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
};