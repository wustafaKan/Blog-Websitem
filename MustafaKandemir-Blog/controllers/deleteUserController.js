const User = require('../models/UserSchema');

exports.deleteUser = async(req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
    } catch (error) {
        console.error("Kullanıcı silinirken hata oluştu:", error);
        res.status(500).json({ error: "Bir hata oluştu, kullanıcı silinemedi." });
    }
}