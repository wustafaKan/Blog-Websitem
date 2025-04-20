const mongoose = require('./db');

const BlogsSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    author: { type: String, required: true }, 
    date: { type: Date, default: Date.now }, 
    content: { type: String, required: true }, 
    tags: { type: [String], required: true }, 
    image: { type: String, default: null } 
});

const Blog = mongoose.model('Blog', BlogsSchema);

module.exports = Blog;
