const express = require('express')
const app = express()

app.get('/hello', (req, res) => {
    res.send('hello world')
})

app.get('/err', (req, res) => {
    throw new Error('에러야')
})

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