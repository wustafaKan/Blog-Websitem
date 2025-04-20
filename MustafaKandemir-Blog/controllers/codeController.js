const User = require('../models/UserSchema');

exports.checker = async (req, res) => {
    try {
        const { onayKodu } = req.body;
        const userId = req.cookies._id;

        if (!userId) {
            return res.redirect('/signin?message=oturumHatasiAlert');
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        }

        if (user.onayKodu === onayKodu) {
            user.onayDurumu = true;
            res.clearCookie('_id');
            res.clearCookie('token');
            res.clearCookie('admin_token');
            await user.save();
            return res.redirect('/login?message=checkedMailAlert');
        } 

        return res.redirect('/mailCheck?message=falseCodeAlert');

    } catch (error) {
        console.error('Onay kodu kontrolü hatası:', error);
        res.redirect('/404');
    }
};
