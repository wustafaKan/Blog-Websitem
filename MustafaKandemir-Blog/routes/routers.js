const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const authenticateToken = require('../middleware/authenticateToken'); 
const upload = require('../middleware/uploadMiddleware');
const User = require('../models/UserSchema'); 
const Blog = require('../models/BlogsSchema');

const { sendEmail } = require('../controllers/emailController');
router.post('/sendEmail', sendEmail);

const { signinForm } = require('../controllers/signinController');
router.post('/signinForm', signinForm);

const { checker } = require('../controllers/codeController');
router.post('/checker', checker);

const { loginForm } = require('../controllers/loginController');
router.post('/loginForm', loginForm);

const { forgetPassMailCheck } = require('../controllers/fpEmailController');
router.post('/forgetPassMailCheck', forgetPassMailCheck); 

const { fpchecker } = require('../controllers/fpcodeController');
router.post('/fpchecker', fpchecker);

const { resetPasswordForm } = require('../controllers/resetPasswordController');
router.post('/resetPasswordForm', resetPasswordForm);

const { deleteUser } = require('../controllers/deleteUserController');
router.post('/deleteUser', deleteUser);

const { addUser } = require('../controllers/addUserController');
router.post('/addUser', addUser);

const { addBlog } = require('../controllers/addBlogController');
router.post('/addBlog', upload.single('image'), addBlog);

const { deleteBlog } = require('../controllers/deleteBlogController.js');
router.post('/deleteBlog', deleteBlog);

router.get('/index', (req, res) => {
    res.render('index'); 
});

router.get('/iletisim', (req, res) => {
    res.render('iletisim'); 
});

router.get('/projelerim', authenticateToken ,(req, res) => {

    res.render('projelerim');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signin', (req, res) => {
    res.render('signin');
});

router.get('/mailCheck', authenticateToken ,(req, res) =>{
    res.render('mailCheck');
});

router.get('/forgatpassword', (req, res) => {
    res.render('forgatpassword');
});

router.get('/forgatMailCheck', authenticateToken ,(req, res) => {
    res.render('forgatMailCheck');
});

router.get('/resetPassword' , authenticateToken ,(req, res) => {
    res.render('resetPassword');
});

router.get('/blogs', async (req, res) => {
    try {
        
        const blogs = await Blog.find().sort({ date: -1 });
        res.render('blogs', { blogs });
    } catch (error) {
        console.error('Blogları yüklerken bir hata oluştu:', error);
        res.status(500).send('Bloglar yüklenirken bir hata oluştu.');
    }
});

router.get('/adminPage', authenticateToken ,async(req, res) =>{
    try {
        const allUsers = await User.find({});
        const allBlogs = await Blog.find({});
        const onlineUsers = allUsers.filter(user => user.isOnline);
        
        res.render('adminPage', {
            allUsers,
            onlineUsers,
            allBlogs
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Sunucu hatası");
    }
});

router.get('/projects/:projectName', authenticateToken, (req, res) => {
    const projectName = req.params.projectName;

    const projectPath = path.join(__dirname, '../projects', projectName, 'index.ejs');
    
    fs.access(projectPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).render('404'); 
        }
        res.render('project', { projectName });
    });
});

router.get('/blogs/:blogName', async(req, res) => {
    const blogName = req.params.blogName;

    const blog = await Blog.findOne({ title: blogName })
    const blogPath = path.join(__dirname, '../views/blogs', blogName, 'index.ejs');
    const cssPath = `/blogs/${blogName}/style.css`; 

    fs.access(blogPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`Dosya bulunamadı: ${blogPath}`);
            return res.status(404).render('404'); 
        }

        res.render(`blogs/${blogName}/index`, { blog, blogName, cssPath });
    });
});
router.use('/blogs/:blogName/style.css', (req, res) => {
    const blogName = req.params.blogName;

 
    const cssPath = path.join(__dirname, '../views/blogs', blogName, 'style.css');


    fs.access(cssPath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`CSS dosyası bulunamadı: ${cssPath}`);
            return res.status(404).send('CSS dosyası bulunamadı'); 
        }

        res.sendFile(cssPath);
    });
});

router.use('/blogs/:blogName/images', (req, res, next) => {
    const blogName = req.params.blogName;


    const imagesPath = path.join(__dirname, '../views/blogs', blogName, 'images');

    express.static(imagesPath)(req, res, next);
});

router.get('/logout', async (req, res) => {
    try {
        const userId = req.cookies._id; 

        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.isOnline = false;
                await user.save(); 
                console.log('Kullanıcı ofline yapıldı ve kaydedildi.');
            }
        }
 
        res.clearCookie('token');
        res.clearCookie('admin_token');
        res.clearCookie('_id');

        res.redirect('/index');
    } catch (error) {
        console.error('Çıkış işlemi sırasında hata:', error);
        res.redirect('/404');
    }
});


router.get('/404',(req, res) =>{
    res.render('404');
});

router.get('*', function(req, res){
    res.render('404');
});


module.exports = router;