const User = require('../models/UserSchema');

exports.addUser = async(req, res) =>{
    const { dbisim, dbsoyisim, dbemail, dbsifre, onayKodu, onayDurumu, isOnline } = req.body;

    try {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(dbsifre, 10); 

        const newUser = new User({
            dbisim,
            dbsoyisim,
            dbemail,
            dbsifre: hashedPassword,
            onayKodu,
            onayDurumu,
            isOnline,
        });

        await newUser.save();

        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu." });
    } catch (error) {
        console.error("Kullanıcı eklenirken hata oluştu:", error);
        res.status(500).json({ error: "Kullanıcı eklenirken bir hata oluştu." });
    }
};