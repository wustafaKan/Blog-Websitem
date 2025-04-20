const mongoose = require('./db'); 

const adminSchema = new mongoose.Schema({
    adminMail: String,
    adminPassword: String,
    onayDurumu: Boolean
}, { strict: false });


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
