const express = require('express');
const {getRelationships, addRelationships, deleteRelationships} = require('../controllers/relationship.js');

const router = express.Router();

router.get('/', getRelationships)
router.post('/', addRelationships)
router.delete('/', deleteRelationships)

module.exports= router;