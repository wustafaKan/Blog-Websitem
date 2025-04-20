const express = require('express');
const fs = require('fs');
const path = require('path');
const Blog = require('../models/BlogsSchema');

exports.addBlog = async (req, res) => {
    try {
        const { title, author, content, tags } = req.body;


        if (!req.file) {
            console.error('Blog görseli yüklenmedi.');
            return res.status(400).json({ message: 'Blog görseli gerekli!' });
        }

    
        const image = `/uploads/${req.file.filename}`;

  
        const newBlog = new Blog({ title, author, content, tags, image });
        await newBlog.save();

 
        const blogPath = path.join(__dirname, '../views/blogs', title);
        const imagePath = path.join(blogPath, 'images');

 
        const defaultStylePath = path.join(__dirname, '../public/style.css');
        const defaultImagesPath = path.join(__dirname, '../public/images'); 


        if (!fs.existsSync(blogPath)) {
            fs.mkdirSync(blogPath, { recursive: true });
            console.log(`Blog klasörü oluşturuldu: ${blogPath}`);
        }
        if (!fs.existsSync(imagePath)) {
            fs.mkdirSync(imagePath);
            console.log(`Blog görsel klasörü oluşturuldu: ${imagePath}`);
        }


        const blogContent = `
            <%- include('../../partials/header') %>
            <main class="blog-section">
                <article class="blog-post">
                    <h1><%= blog.title %></h1>
                    <div class="blog-meta">
                        <span><%= blog.date ? blog.date.toDateString() : 'Tarih belirtilmedi' %></span>
                        <span><%= blog.author %></span>
                    </div>
                    <% if (blog.image) { %>
                        <img src="<%= blog.image %>" alt="Blog Görseli">
                    <% } else { %>
                        <img src="./images/default-image.png" alt="Varsayılan Blog Görseli">
                    <% } %>
                    <div class="blog-content">
                        <p><%= blog.content %></p>
                    </div>
                    <div class="blog-tags">
                        <% blog.tags.forEach(tag => { %>
                            <span><%= tag %></span>
                        <% }) %>
                    </div>
                </article>
                <script src="script.js"></script>
            </main>
            <%- include('../../partials/footer') %>
        `;
        fs.writeFileSync(path.join(blogPath, 'index.ejs'), blogContent, 'utf8');
        console.log(`index.ejs dosyası oluşturuldu: ${path.join(blogPath, 'index.ejs')}`);


        if (fs.existsSync(defaultStylePath)) {
            fs.copyFileSync(defaultStylePath, path.join(blogPath, 'style.css'));
            console.log('style.css dosyası kopyalandı.');
        } else {
            console.warn(`Varsayılan style.css bulunamadı: ${defaultStylePath}`);
        }


        if (fs.existsSync(defaultImagesPath)) {
            const defaultImages = fs.readdirSync(defaultImagesPath);
            defaultImages.forEach(imageFile => {
                const srcPath = path.join(defaultImagesPath, imageFile);
                const destPath = path.join(imagePath, imageFile);

                fs.copyFileSync(srcPath, destPath);
                console.log(`Görsel kopyalandı: ${imageFile}`);
            });
        } else {
            console.warn(`Varsayılan görseller klasörü bulunamadı: ${defaultImagesPath}`);
        }

        res.status(200).json({ message: 'Blog başarıyla oluşturuldu.' });
    } catch (error) {
        console.error('Blog oluşturma hatası:', error.message);
        res.status(500).json({ message: 'Blog oluşturulurken bir hata oluştu.', error: error.message });
    }
};
