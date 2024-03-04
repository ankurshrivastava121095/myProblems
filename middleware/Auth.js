const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')

const Auth = async(req,res,next) => {
    try{
        const token = req.cookies.jwt
        // console.log(token)
        const verifyUser = jwt.verify(token,'myProblemsJWTToken')
        // console.log(verifyUser)
        var user = await UserModel.findOne({ _id: verifyUser.userId })
        if (user) {      
            // console.log(user)
            req.data = user
            next()
        } else {
            var user = await UserModel.findOne({ _id: verifyUser.userId })
            // console.log(user)
               req.data = user
            next()
        }
    }catch(err){
        res.redirect('/')
    }
}

module.exports = Auth