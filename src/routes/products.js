// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const {index,store,detail,update,recycle,remove,restore, search} = require('../controllers/productsController');



router
    .get('/', index)
    .post('/', store)
    .get('/search', search)
    .get('/:id/', detail)
    .put('/:id', update)
    .delete('/:id', remove)
    .post('/:id', restore)
    .et('/recycles', recycle)



module.exports = router;
