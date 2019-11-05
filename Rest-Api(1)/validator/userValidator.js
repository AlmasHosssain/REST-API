const validator = require ('validator')

const validate = (user) =>{
    let error = {}
    if (!user.id) {
        error.id = "Please Enter Your Id First"
    }

    if (!user.name) {
        error.name = "Please Enter Your Name Please"
    }
    if (!user.code) {
        error.code = "Please Enter Your Code Please"
    }
    return{
        error,
        isValid : Object.keys(error).length === 0
    }
}

module.exports = validate