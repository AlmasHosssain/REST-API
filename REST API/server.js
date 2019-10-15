const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');
//const router = require('router');P

const app = express();
const bcrypt = require('bcrypt');
const valid = require('validator');
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/content-db')
const db = mongoose.connection;
db.on('error',(error)=>{
    console.log(error);
    
})
db.once('open',()=>{
    console.log("Database has been stablished");
    
})

const authinticate = (res,req,next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token,'SECRATE');
        req.user = decode;
        next();
    } catch (error) {
        res.json({
            message : "Error Occured"
        })
    }

}


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type : String,
        trim : true,
        required : true,
        validate : {
            validator : (v)=>{
                return valid.isEmail(v)
            },
            message : '{VALUE} is not an email'
        }
    },
    password :{
        type : String
    }
})
const User = mongoose.model('User',userSchema);

app.post('/login',(req,res,next)=>{
    
    let email = req.body.email;
    let password = req.body.password;
    
    User.findOne({email})
        .then((user)=>{
            if (user) {
                bcrypt.compare(password,hash,(err,result)=>{
                    if (err) {
                        res.json({
                            message : "Error Occurd"
                        })
                    }
                    if (result) {

                        let token = jwt.sign({
                            email : user.email,
                            id : user.id
                        },SECRATE,{expiresIn :'3h'})

                        res.json({
                            message: "Login Succeccfully",
                            token
                        })
                    }else{
                        res.json({
                            message : "Email is not matched"
                        })
                    }
                })
            }
        })
        .catch((error)=>{
            res.json({
                error
            })
        })
})

app.post('/',(req,res,next)=>{
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        
        if(err){
            res.json({
                message: "Error Has Been Occure",
                error : err
            })
        }
        
        let user = new User({
            email : req.body.email,
            password : hash
        })

        user.save()
            .then((result)=>{
                res.status(200).json({
                    message: "Successfully Done",
                    user : result
                })
            })
            .catch((err)=>{
                res.json({
                    message : " Error Has Been Occured",
                    error : err
                })
            })
    })
})

app.get('/user',authinticate,(req,res,next)=>{
    User.find()
        .then((user)=>{
            res.json({
                message : "Successfully Occured",
                user
            })
        })
        .catch((err)=>{
            res.json({
                message : "Error Occured",
                error : err
            })
        })
})



const PORT = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.send("<div><h1>Hello Boss</h1><p>Almas Hosain Antar</p></div>")
})


// Get And Post Section

app.listen(PORT,() => {
    console.log(`Server is running on  ${PORT}`);
})


