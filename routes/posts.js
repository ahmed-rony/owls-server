const express = require('express');
// const getPosts = require('../controllers/post.js');
const {getPosts, addPost} = require('../controllers/post.js');

const router = express.Router();

router.get('/', getPosts);
router.post('/', addPost);

module.exports= router;