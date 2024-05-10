const expressRateLimit = require('express-rate-limit')

const limitUsage = expressRateLimit({
    windowMs : 60 * 1000, // 1분
    max: 1, // 분당 최대 사용횟수
    handler(req, res){
        res.status(429).json({
            code: 429,
            message: 'You can use this service 1 times per minute'
        }) // 트래픽 허용량이 넘었을때
    }
})

module.exports = {
    limitUsage
}