const mongoose = require('mongoose')
const { Schema } = mongoose
const { Types : {ObjectId} } = Schema
// ObjectId : MONGODB ID 값의 자료형 (data type)

const todoSchema = new Schema({ // 스키마 정의
    author: {
        type: ObjectId,
        required: true, // 무조건 author 필드는 있어야 하기때문에 true로 준다
        ref: 'User' // User 라는 데이터 모델 (사용자 ID값 저장)
    },
    title: {
        type: String,
        required: true,
        trim: true // 문자열 양쪽 끝 공백 제거
    },
    description: {
        type: String,
        trim: true
    },
    isDone: {
        type: Boolean,
        default: false // 브라우저에서 전송된 값이 없으면 자동 설정
    },
    createdAt: {
        type: Date,
        default: Date.now // 현재 시간
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    },
    finishedAt: {
        type: Date,
        default: Date.now
    }
    // 복잡한 몽고 db 필드가 더 추가 되어야 함
})

// 스키마 -> 컴파일(몽고db가 인식할수 있는 데이터 구조로 변환) -> 모델
const Todo = mongoose.model('Todo', todoSchema) 
// 컬렉션 이름 : Todo에서 첫번째 글자를 소문자로 변경하고 맨 끝에 s 붙임
// => 결과 : todos
module.exports = Todo

// todo 데이터 생성 테스트
// const todo = new Todo({
//     author: '111111222222333333444444', // 몽고 db의 고유 id값
//     title: '주말에 거북섬 놀러가기',
//     description: '가서 먹을만한 것 있는지 맛집 찾기'
// })
// todo.save().then(()=> console.log('할일 생성 성공')) // 실제 데이터베이스에 저장