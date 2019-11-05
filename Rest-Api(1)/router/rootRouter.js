const router = require('express').Router()
const {getData,postData,putData,delateData} = require ('../controller/userController')
const User = require('../model/User')

router.get('/courserGet',getData)
router.post('/courserGet',postData)
router.put('/courserGet/:id',putData)
router.delete('/courserGet/:id',delateData)

module.exports = router