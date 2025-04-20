const Blog = require('../models/BlogsSchema');

const fs = require('fs');
const path = require('path');

exports.deleteBlog = async (req, res) => {
    const { blogId } = req.body;

    try {

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog bulunamadı.' });
        }


        if (blog.image) {
            const imagePath = path.join(__dirname, '../public', blog.image); 
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }


        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: "Blog başarıyla silindi." });
    } catch (error) {
        console.error("Blog silinirken hata oluştu:", error);
        res.status(500).json({ error: "Bir hata oluştu, blog silinemedi." });
    }
};
