const User = require('../model/User')
const jwt = require('jsonwebtoken')
const validator = require('../validator/userValidator')

module.exports = {
        getData(req,res){
            let {id,name,code} = req.body
            const user = new User({
                id,
                name,
                code
            })
            user.save()
                .then((user)=>{
                    res.json({
                        message : 'Operation Successful',
                        user
                    })
                })
                .catch((error)=>{
                    message : 'Error Occure',
                    error
                })
        },
        postData(req,res){
            let {id,name,code} = req.body
            const validate = validator({id,name,code})
            if (!validate.isValid) {
                res.status(404).json(validate.error)
            }else{
                const user = new User({
                    id,
                    name,
                    code
                })
                user.save()
                    .then((user)=>{
                        res.json({
                            message : 'Operation Successful',
                            user
                        })
                    })
                    .catch((error)=>{
                        message : 'Error Occure',
                        error
                    })
            }
        },
        putData(req,res){
            User.findByIdAndUpdate({_id:req.params.id},req.body)
                .then((user)=>{
                    res.json({
                        message : "I can Do this",
                        user
                    })
                })
                .catch((error)=>{
                    res.json({
                        message : "Error two",
                        error
                    })
                })
        },
        delateData(req,res){
            User.findByIdAndRemove({_id:req.params.id})
                .then((user)=>{
                    res.json({
                        message : "Work Done",
                        user
                    })
                })
        }
}