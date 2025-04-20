const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');
require('dotenv').config({ path: './middleware/.env' });
const secretKey = process.env.SECRET_KEY;

exports.loginForm = async (req, res) => {
    const { userEmail, UserPassword } = req.body;

    try {

        console.log("Giriş yapılan e-posta: ", userEmail);
        console.log(`Giriş yapılan e-posta: ${userEmail}`);


        const admin = await Admin.findOne({ adminMail: userEmail });
        if (admin) {
            console.log(`Bulunan admin: ${admin.adminMail}`);


            const isPasswordValid = admin.adminPassword === UserPassword;

            if (isPasswordValid) {
                if (admin.onayDurumu) {
                    console.log("Admin girişi başarılı.");

                    res.cookie('_id', admin._id.toString(), {
                        httpOnly: true,
                        maxAge: 3600000 
                    });

                    const adminToken = jwt.sign(
                        { id: admin._id, role: 'admin' },
                        secretKey,
                        { expiresIn: '1h' }
                    );

                    res.cookie('admin_token', adminToken, {
                        httpOnly: true,
                        maxAge: 3600000, 
                        path: '/'
                    });

                    return res.redirect('/adminPage');
                } else {
                    console.log("Admin onaylanmamış.");
                    return res.redirect('/login?message=adminNotApproved');
                }
            } else {
                console.log("Hatalı admin şifresi.");
                return res.redirect('/login?message=wrongAdminPassword');
            }
        }

        const user = await User.findOne({ dbemail: userEmail });
        console.log("Bulunan kullanıcı: ", user);

        if (user) {
            const isPasswordValid = await bcrypt.compare(UserPassword, user.dbsifre);

            if (isPasswordValid) {
                if (user.onayDurumu) {
                    console.log("Kullanıcı onaylanmış, giriş yapılıyor...");

                    res.cookie('_id', user._id.toString(), {
                        httpOnly: true,
                        maxAge: 3600000 
                    });

                    const token = jwt.sign(
                        { id: user._id, email: user.dbemail },
                        secretKey,
                        { expiresIn: '1h' }
                    );

                    res.cookie('token', token, {
                        httpOnly: true,
                        maxAge: 3600000, 
                        path: '/'
                    });

                    user.isOnline = true;
                    await user.save();

                    return res.redirect('/blogs');
                } else {
                    console.log('Onaylanmamış Kullanıcı');
                    return res.redirect('/signin?message=unapprovedUser');
                }
            } else {
                return res.redirect('/login?message=wrongPassword');
            }
        }

        console.log("Kullanıcı bulunamadı.");
        return res.redirect('/login?message=nonexistentUser');

    } catch (error) {
        console.error("Login sırasında bir hata oluştu: ", error);
        return res.redirect('/404');
    }
};
