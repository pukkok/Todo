const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
const usersRouter = require('./src/routes/users')
const todosRouter = require('./src/routes/todos')
const config = require('./config')

const {wrap, asyncFunction} = require('./async')


const corsOptions = {
    // origin: 'http://127.0.0.1:3000', // 해당 URL 주소만 요청을 허락함
    // origin: 'http://localhost:3000', // 해당 URL 주소만 요청을 허락함
    origin: '*',
    // IPV6, IPV4에 따라 다름 localhost 가 안될경우 127.0.0.1로 확인
    credentials: true // 사용자 인증이 필요한 리소스를 요청할 수 있도록 허용함
}

mongoose.connect(config.MONGODB_URL) // 프로미스
.then(() => console.log('데이터베이스 연결 성공'))
.catch(err => console.log(`데이터베이스 연결 실패 : ${err}`))

/** 공통 미들웨어 */
app.use(cors(corsOptions)) // cors 설정 미들웨어
app.use(express.json()) 
// 요청본문 (request body) 파싱(해석)을 위한 미들웨어
// 이게 있어야 요청을 받을수 있다.
app.use(logger('tiny')) // 로거 설정 tiny 간단한 설정만
/** ********************************************************************* */

/** REST API 미들웨어 */
app.use('/api/users', usersRouter)
app.use('/api/todos', todosRouter)


app.get('/hello', (req, res) => {
    res.json('서버에서 보낸 응답')
})
app.post('/hello', (req, res) => {
    console.log(req.body)
    res.json({ userId: req.body.userId, email: req.body.email })
})

app.get('/err', (req, res) => {
    throw new Error('에러야')
})

app.get('/fetch' , async (req, res) => {
    // OPEN API 데이터 요청
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    console.log(response)
    // res.send(JSON.stringify(response.data))
    res.send({todos : response.data})
})

app.get('/async-function', wrap(asyncFunction))

// 폴백 핸들러 (fallback handler)
app.use((req, res, next) => {
    res.status(404).send('페이지를 찾을 수 없습니다.')
})

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('서버 에러 발생!')
})

app.listen(5000, ()=>{
    console.log('server is running on port 5000')
})