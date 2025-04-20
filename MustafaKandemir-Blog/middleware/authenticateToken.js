const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './middleware/.env' });
const secretKey = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.cookies.admin_token; 

    console.log("Token:", token);

    if (!token) {
        console.log("Token bulunamadı, giriş sayfasına yönlendiriliyor.");
        return res.redirect('/login');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("Token doğrulama hatası:", err.message);
            return res.redirect('/login');
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
