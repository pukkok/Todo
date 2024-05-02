const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => { // 토큰 생성하는 유틸리티 함수
    return jwt.sign({
        _id: user._id,
        name: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createAt: user.createAt
    },
    config.JWT_SECRET, // 비밀키
    {
        expiresIn: '1d',
        issuer: '푹곡좌' // 발급자, 발급한 곳
    })
}

const isAuth = (req, res, next) => { // 사용자 권한 검증하는 미들웨어
    const bearerToken = req.headers.authorization // request header 요청헤더의 Authorization 속성
    if(!bearerToken){
        res.status(401).json({ message : 'Token is not supplied '}) //401 권한 없음
    }else{
        const token = bearerToken.slice(7, bearerToken.length) // "bearer " 글자 제거
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if(err && err.name === 'TokenExpiredError'){
                return res.status(419).json({ code: 419, message: 'Token expired'}) // 토큰 만료
            }else if(err){
                return res.status(401).json({ code: 401, message: 'Invalid Token'}) // 토큰이 위변조가 되어서 복호화를 할 수 없는 경우
            }
            req.user = userInfo
            next() // 권한이 있는 사용자의 서비스 허용
        })
    }
}

const isAdmin = (req, res, next) => { // 관리자 여부 검증하는 미들웨어
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({ code: 401, message: 'You are not valid admin user!'})
    }
}

module.exports = {
    generateToken,
    isAuth,
    isAdmin
}