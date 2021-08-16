const express = require('express');
const router = express.Router({mergeParams:true});

const user = require('./User')
router.use('/user',user)

const blog = require('./Blog')
router.use('/blog',blog)



module.exports = router;