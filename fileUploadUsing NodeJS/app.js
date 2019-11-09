const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

const app = express()
app.use(morgan('dev'))
app.use(cors())

// Set Storage Engine
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename : function(req,file,cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//Upload inIt
const upload = multer({
    storage : storage,
    fileFilter : function (req,file,callBack) {
        checkFileType(file,callBack)
    }
}).single('myImage')

//Check Type Of Input File
 checkFileType=(file,callBack)=>{
    const fileType = /jpeg|jpg|png|gif|ico/;

    const extName = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype)

    if (extName && mimetype) {
        return callBack(null,true)
    } else {
        callBack('Error : Only Image File Can Be Submitted!')
    }
}
app.set('view engine','ejs')
app.use(express.static('./public'))

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if (err) {
            res.render('index',{
                msg : err
            })
        }else{ 
            if (req.file == undefined) {
                res.render('index',{
                    msg : 'Error : No File Selected.So Please Select A image First.'
                })
            } else {
                res.render('index',{
                    msg : 'File Uploaded Successfully',
                    file : `uploads/${req.file.filename}`
                })
            }
        }
    })
})
app.get('/',(req,res)=>{
    res.render('index')
})

const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on the port ${PORT}`);
})