const express = require('express');
const {getLikes, addLikes, deleteLikes} = require('../controllers/like.js');

const router = express.Router();

router.get('/', getLikes)
router.post('/', addLikes)
router.delete('/', deleteLikes)

module.exports= router;