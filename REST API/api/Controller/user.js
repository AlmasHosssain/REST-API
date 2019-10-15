const express = require('express')
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const valid = require('validator')
const app = express()

const mongoose =  require('mongoose');
mongoose.connect('mongodb://localhost/contact-info')
const db = mongoose.connection;

db.on('error',(error)=>{
    console.log(error);
})
db.once('open',()=>{
    console.log('Database Connection Has Been Stablished');
})

const Schema = mongoose.Schema;
const userContent = new Schema({
    name : {
        type : String,
        required : true,
        trim : true,
        minlength :3
    },
    phone : {
        type : String,
        required : true,
        trim : true,
        minlength : 11
    },
    email : {
        type : String,
        required : true,
        validate : {
            validator :  (v)=>{
                return valid.isEmail(v)
            },
            message : '{VALUE} is not right'
        }
    },
    password : {
        type : String
    }
})

const Content = mongoose.model('Content',userContent);

app.post('/',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if (err) {
            res.json({
                message : "Error occured",
                error : er
                
            })
        }
        let user = new Content({
            name = req.body.name,
            phone = req.body.phone,
            email = req.body.email,
            password = hash
        })
        user.save()
            .then((data)=>{
                res.json({
                    message : "Succssfully Occured",
                    user : data
                })
            })
            .catch((error)=>{
                res.json({
                    message : "Error has Been Occured",
                    error
                })
            })
    })
})

app.get('/',(req,res,next)=>{
    Content.find()
           .then((data)=>{
               res.json({
                   message : "Error Occured",
                   data
               })
           })
           .catch((error)=>{
               res.json({
                   message : "Suessfully Done",
                   error
               })
           })
})

app.post('/',(req,res,next)=>{
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;

    Content.findOne({name})
           .then((result)=>{
               if (result) {
                 bcrypt.compare(password,req.body.password,(err,hash)=>{
                    if (err) {
                        res.json({
                            message : "Error Occured",
                            error : err
                        })
                    }
                    if (hash) {
                        res.json({
                            message : "Successfully Occured"

                        })
                    }else{
                        res.json({
                            message: "Error Occuerd"
                        })
                    }
                   })
               }
           })
           .catch((error)=>{
               res.json({
                   message : "Error",
                   error
               })
           })
})


app.get('/:id',(req,res,next)=>{
    const id = req.params.id;
    Content.findById(id)
           .then((content)=>{
               res.json({
                   message : "Find the data",
                   content
               })
           })
           .catch((error)=>{
            res.json({
                message : "Doesn't find the data",
                error
            })
        })
})

app.delete('/',(req,res,next)=>{
    const id = req.params.id;
    Content.findByIdAndRemove(id)
           .then((content)=>{
               res.json({
                   message : "Content Delete",
                   content
               })
           })
           .catch((error)=>{
            res.json({
                message : "Doesn't find the data",
                error
            })
        })
})


app.put('/',(req,res,next)=>{
    const id = req.params.id;
    let updateData = {
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
        password : req.body.password
    }
    Content.findByIdAndUpdate(id,{$set : updateData})
            .then((content)=>{
                Content.findById(content._id)
                        .then((newContent)=>{
                            res.json({
                                message : "Updated Successfully",
                                content
                            })
                        })
                        .catch((error)=>{
                            res.json({
                                message : "Error Occured",
                                error
                            })
                        })
            })
             .catch((error)=>{
                res.json({
                    message : "Error Occured",
                    error
                })
            })
})