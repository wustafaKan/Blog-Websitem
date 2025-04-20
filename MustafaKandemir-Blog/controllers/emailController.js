const nodemailer = require('nodemailer');


exports.sendEmail = (req, res) => {
    const { userName, userEmail, userMessage} = req.body;

    let transporter = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            user : 'mustafakndmr270@gmail.com',
            pass : 'zvhh eayv fvcr zzqg' 
        }
    });

    const mailOptions = {
        from : userEmail,
        to : 'mustafakndmr270@gmail.com',
        subject: `Yeni mesaj: ${userName}`,
        text: userMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('E-posta gönderilemedi:', error);
            return res.status(500).send('E-posta gönderilemedi');
        }
        console.log('E-posta başarıyla gönderildi:', info.response);
        res.status(200).json({ message: 'E-posta başarıyla gönderildi', redirect: '/iletisim' });
    });

};