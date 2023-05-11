const { index, updateStatus, destroy,show, multipleDelete} = require('../controllers/userController');

const router = require('express').Router();

router.get('/users',index);
router.get('/users/:id',show);
router.post('/users/multiple-delete',multipleDelete)
router.patch('/users/change-status/:id',updateStatus);
router.delete('/users/:id',destroy);

module.exports = router;