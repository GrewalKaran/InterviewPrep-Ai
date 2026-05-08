const userModel = require('../models/user.module')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const blacklistTokenModel = require('../models/blacklistToken.model')

/**
 * @name  registerUserController
 * @description  registers a new user with email, username and password
 * @access Public
 */

async function registerUserController(req,res){

    const  {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message:"User details are not present"
        })
    }

    const userExist = await userModel.findOne({
        $or:[
            {username},
            {password}
        ]
    })
    if(userExist){
        return res.status(400).json({
            message:"User or password already taken"
        })
    }

    try{

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({id:user._id,user:user.username},process.env.JWT_SECRETKEY,
        {expiresIn: '1d'}
    )
    res.cookie('token',token)

    res.status(201).json({
        message:"user registerd successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

    }catch(err){
        return res.status(400).json(
            console.log(err)
        )
    }
    

}

/**
 * @name loginUserController
 * @description logging in user with valid email and password
 * @access public
 */

async function loginUserController(req,res){
    const {email,password} = req.body

    const userExist = await userModel.findOne({email})
    if(!userExist){
        return res.status(400).json({
            message:"email not registered"
        })
    }
    const verifyPass = await bcrypt.compare(password,userExist.password)
    if(!verifyPass){      
            return res.status(400).json({
            message:"password is incorrect"
        })
    }
    const token = jwt.sign({id:userExist._id,username:userExist.username}
        ,process.env.JWT_SECRETKEY,{expiresIn: '1d'}
    )
    res.cookie('token',token)

    res.status(200).json({
        message:'successfully logged in',
        user:{
            id:userExist._id,
            username:userExist.username,
            email:userExist.email
        }
    })
}



/**
 * @name logoutUserController
 * @description logging out user with valid token adding the token to blacklist
 * @access public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token
    if(!token){
        return res.status(400).json({
            message:"Unautharized"
        })
    }
    const tokenValid = jwt.verify(token,process.env.JWT_SECRETKEY)
    if(!tokenValid){
        return res.status(400).json({
            message:"Unautharized"
        })
    }
    const blacklistToken = await blacklistTokenModel.create({token})

    res.clearCookie('token')

    res.status(200).json({
        message:'You are successfully logged out'
    })
}

/**
 * @name getUserController
 * @description get the user details
 * @access public
 */

async function getMeController(req,res){
    const userDetails = await userModel.findOne({_id:req.user.id})
    res.status(200).json({
        message:"user details fetched",
        user:{
            id:userDetails._id,
            username:userDetails.username,
            email:userDetails.email
        }
    })
}


module.exports = {registerUserController,loginUserController,logoutUserController,getMeController}