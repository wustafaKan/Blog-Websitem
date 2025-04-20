const mongoose = require('./db'); 

const userSchema = new mongoose.Schema({
    dbisim: String,
    dbsoyisim: String,
    dbemail: String,
    dbsifre: String,
    onayKodu: String,
    onayDurumu: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false }
}, { strict: false });


const User = mongoose.model('User', userSchema);

module.exports = User;
