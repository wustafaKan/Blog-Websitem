const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const hashPassword = require('../middleware/hashPassword');

const User = require('../models/UserSchema'); 
const { patch } = require('../routes/routers');
const path = require('path');
require('dotenv').config({ path: './middleware/.env' });
const secretKey = process.env.SECRET_KEY;




exports.forgetPassMailCheck = async(req, res) => {
    const { userEmail} = req.body;

    
    const user = await User.findOne({ dbemail: userEmail });
    try {
        if(user){
            const userName = user.userName;
            let onayKodu = user.onayKodu;
            user.onayKodu = null;
            console.log('Kullanıcının onay kodu sıfırlandı: ' + user.onayKodu);

            user.onayDurumu = false;
            onayKodu = Math.floor(100000 + Math.random() * 900000).toString();
            user.onayKodu = onayKodu;

            res.cookie('_id', user._id.toString(), {
                httpOnly: true,
                maxAge: 3600000,
                path: '/'
            });
    
            const token = jwt.sign(
                { id: user._id, email: user.dbemail },
                secretKey,
                { expiresIn: '1h' }
            );
            
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000, 
                path: '/',
            });


            await user.save();

            console.log('Kullanıcının onay durumu sıfırlandı: ' + user.onayDurumu);
            console.log('Yeni onay kodu verildi: ' + user.onayKodu);
            console.log('Şifre sıfırlama için kullanılan cookie: ' + user._id.toString());

            let transporter = nodemailer.createTransport({
                service : 'gmail',
                auth: {
                    user : 'mustafakndmr270@gmail.com',
                    pass : 'zvhh eayv fvcr zzqg' 
                }
            });
        
            let mailOptions = {
                from: 'mustafakndmr270@gmail.com',
                to: userEmail,
                subject: "HOŞGELDİNİZ",
                html: `<h3>Merhaba ${userName},</h3><p>Onay kodunuz: <strong>${onayKodu}</strong></p>`
            };

            await transporter.sendMail(mailOptions);
    
            console.log('Şifre sıfırlama için mail gönderildi.');
            res.redirect('/forgatMailCheck')

        } else{
            return res.redirect('/forgatpassword?message=existingUser2');
        };
    } catch (error) {
        console.error("Error occurred during login: ", error);
        res.redirect('/404');
    };

};