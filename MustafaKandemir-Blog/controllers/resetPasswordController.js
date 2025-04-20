const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/UserSchema'); 
const bcrypt = require('bcrypt');

exports.resetPasswordForm = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;

    const token = req.cookies.token;

    if (!token) {
        console.error("Token bulunamadı.");
        return res.redirect('/resetPassword?message=missingToken');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            console.error('Geçersiz kullanıcı ID:', userId);
            return res.redirect('/resetPassword?message=invalidUserId');
        }

        const user = await User.findById(userId);
        if (!user) {
            console.error('Kullanıcı bulunamadı.');
            return res.redirect('/resetPassword?message=userNotFound');
        }

        if (newPassword !== confirmPassword) {
            return res.redirect('/resetPassword?message=passwordMismatch');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.dbsifre = hashedPassword;
        user.onayKodu = null;
        user.onayDurumu = true;
        await user.save();

        console.log('Şifre başarıyla sıfırlandı.');
        res.clearCookie('token');
        res.redirect('/login?message=passwordReset');
    } catch (error) {
        console.error('Şifre sıfırlama hatası:', error);
        res.redirect('/404');
    }
};
