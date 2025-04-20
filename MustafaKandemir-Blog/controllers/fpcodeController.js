const User = require('../models/UserSchema');

exports.fpchecker = async (req, res) => {
    try {
        const { onayKodu } = req.body;
        const userId = req.cookies._id;
        console.log('Gelen cookie: ', req.cookies);

        const user = await User.findById(userId);
        
        if (!user) {
            return res.redirect('/signin?message=oturumHatasiAlert');
        }

        if (user.onayKodu === onayKodu) {
            user.onayDurumu = true;
            await user.save();
            res.clearCookie('_id');
            return res.redirect('/resetPassword');
        } 

        return res.redirect('/forgatMailCheck?message=falseCodeAlert');

    } catch (error) {
        console.error('Onay kodu kontrolü hatası:', error);
        res.redirect('/404');
    }
};
