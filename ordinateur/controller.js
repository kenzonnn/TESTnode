var express = require('express');
var router = express.Router();
const { list, create, update, deleteU, OrdinateurView, searchByPriceRange } = require('./ordinateurService');

router.get('/list', list);
router.get('/ordinateur', OrdinateurView);
router.post('/create', create);
router.put('/update/:id', update);
router.delete('/delete/:id', deleteU);
router.get('/search', searchByPriceRange);

router.get('/search-category', (req, res) => {
    res.render('ordinateur'); 
});

module.exports = router;
