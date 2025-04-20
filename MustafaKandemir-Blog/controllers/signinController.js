const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const hashPassword = require('../middleware/hashPassword');

require('dotenv').config({ path: './middleware/.env' });
const secretKey = process.env.SECRET_KEY;


exports.signinForm = async (req, res) => {
    const { userName, userLastname, userEmail, UserPassword } = req.body;
    const user = await User.findOne({ dbemail: userEmail });
    if(user){
        console.log("Bu maile kayıtlı kullanıcı var!");
        res.redirect('/login?message=existingUser');
    }else {
        try {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'mustafakndmr270@gmail.com',
                    pass: 'zvhh eayv fvcr zzqg' 
                }
            });
    
            
            const onayKodu = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedUserPass = await hashPassword(UserPassword);
            console.log("hashed: ", hashedUserPass);
    
            const newUser = new User({
                dbisim: userName,
                dbsoyisim: userLastname,
                dbemail: userEmail,
                dbsifre: hashedUserPass,
                onayKodu: onayKodu,
                onayDurumu: false,
                isOnline: false
            });
    
            let mailOptions = {
                from: 'mustafakndmr270@gmail.com',
                to: userEmail,
                subject: "HOŞGELDİNİZ",
                html: `<h3>Merhaba ${userName},</h3><p>Onay kodunuz: <strong>${onayKodu}</strong></p>`
            };
    
            
            await newUser.save();
    
            
            res.cookie('_id', newUser._id.toString(), {
                httpOnly: true,
                maxAge: 3600000 
            });
    
            const token = jwt.sign(
                { id: newUser._id, email: newUser.dbemail },
                secretKey,
                { expiresIn: '1h' }
            );
    
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000, 
                path: '/'
            });
    
            await transporter.sendMail(mailOptions);
    
            console.log(`${newUser.dbisim} kullanıcısı onay kodu ile kaydedildi.`);
            res.redirect('/mailCheck?message=checkMailAlert');
    
        } catch (error) {
            console.error('Kayıt işlemi hatası:', error);
            res.redirect('/404');
        }
    }
    

    
};
