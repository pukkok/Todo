const express = require('express')
const User = require('../models/User') // 데이터 CRUD 용도
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')
const { validationResult, oneOf } = require('express-validator')
const { validateUserName, validateUserEmail, validateUserPassword } = require('../../validator')
const { limitUsage } = require('../../limiter') // 사용량 제한 미들웨어

const router = express.Router() // 라우터 모듈

router.post('/register', [ // 폼 검증을 위한 미들웨어
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
],
expressAsyncHandler( async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){ // 폼 검증에 실패한 경우
        console.log(errors.array())
        res.status(400).json({
            code: 400, 
            message: 'Invalid Form data for user', 
            error: errors.array()
        })
    }else{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            userId: req.body.userId,
            password: req.body.password
        })

        try{
            const newUser = await user.save() // 사용자 정보 DB저장
            const { name, email, userId, isAdmin, createdAt } = newUser
            res.json({
                code: 200,
                token: generateToken(newUser), // 사용자 식별 + 권한검사를 위한 용도
                name, email, userId, isAdmin, createdAt, // 사용자에게 보여주기 위한 용도
                status: newUser.status,
                createdAgo: newUser.createdAgo,
                lastModifiedAgo: newUser.lastModifiedAgo,
            })
        }catch(err){
            res.status(401).json({ code : 401, message: 'Invalid User Data'})
        }
    }

}))

router.post('/login', [
    validateUserEmail()
] ,expressAsyncHandler( async(req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({ 
            code: 400, 
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        // console.log(req.body)
        const loginUser = await User.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if(!loginUser){
            res.status(401).json({ code: 401, message: 'Invalid Email or Invalid Password'})
        }else{
            const { name, email, userId, isAdmin, createdAt, createdAgo, lastModifiedAgo, status } = loginUser
            res.json({
                code: 200,
                token: generateToken(loginUser),
                name, email, userId, isAdmin, createdAt,
                createdAgo, lastModifiedAgo, status
            })
        }
    }

}))

router.post('/logout', (req, res, next) => {
    res.json('로그아웃')
})

router.put('/', limitUsage, oneOf([
    validateUserName(),
    validateUserEmail(),
    validateUserPassword()
], {message : 'At least one field of user must be provided'}),
isAuth,
expressAsyncHandler( async(req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log(errors.array())
        res.status(400).json({ 
            code: 400, 
            message: 'Invalid Form data for user',
            error: errors.array()
        })
    }else{
        const user = await User.findById(req.user._id) // 사용자가 회원인지 검사
        if(!user){
            return res.status(404).json({ code: 404, message: 'User Not Founded'})
        }else{
            user.name = req.body.name || user.name
            user.email = req.body.email || user.email
            user.password = req.body.password || user.password
            
            user.lastModifiedAt = new Date() // 사용자정보 수정 시각
    
            const updatedUser = await user.save() // 실제 사용자정보 수정을 DB에 반영
            const { name, email, userId, isAdmin, createdAt, createdAgo, lastModifiedAgo, status } = updatedUser
            res.json({
                code: 200,
                token: generateToken(updatedUser),
                name, email, userId, isAdmin, createdAt,
                createdAgo, lastModifiedAgo, status
            })
        }
    }

}))

router.delete('/', limitUsage, isAuth, 
expressAsyncHandler( async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.user._id)
    if(!user){
        res.status(404).json({ code: 404, message: 'User Not Found'})
    }else{
        res.status(204).json({ code: 204, message: 'User Deleted successfully'})
        // 204 딱히 브라우저로 보낼 데이터가 없는경우 no content
    }

}))

module.exports = router
