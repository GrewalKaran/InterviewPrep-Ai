
const blacklistTokenModel = require("../models/blacklistToken.model")
const jwt = require('jsonwebtoken')

/**
 * @name authUser
 * @description check if the token is blacklistd and return decode of the token
 * @access public
 */


async function authUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(400).json({
            message:"Unautharized"
        })
    }
    const blacklistedToken = await blacklistTokenModel.findOne({token})

    if(blacklistedToken){
        res.status(400).json({
            message:'Invalid token'
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRETKEY)
        req.user = decoded
        next()
    }
    catch(err){
        return res.statu(400).json({
            message:'Invalid token'
        }
        )
    }
}

module.exports = authUser