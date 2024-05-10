const mongoose = require('mongoose')
const moment = require('moment')
const { Schema } = mongoose
const { Types : {ObjectId} } = Schema
// ObjectId : MONGODB ID 값의 자료형 (data type)

const todoSchema = new Schema({ // 스키마 정의
    author: {
        type: ObjectId,
        required: true, // 무조건 author 필드는 있어야 하기때문에 true로 준다
        ref: 'User' // User 라는 데이터 모델 (사용자 ID값 저장)
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    imgUrl: {
        type: String,
        required: true,
        trim: true
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

todoSchema.path('category').validate((value)=>{
    return /오락|공부|음식|자기계발|업무|패션|여행/.test(value)
}, 'category `{VALUE}` 는 유효하지 않은 카테고리입니다.')

todoSchema.virtual('status').get(function(){
    return this.isDone ? '종료' : '진행중'
})

todoSchema.virtual('createdAgo').get(function(){
    return moment(this.createdAt).locale('ko').fromNow()
})

todoSchema.virtual('lastModifiedAgo').get(function(){
    return moment(this.lastModifiedAt).locale('ko').fromNow()
})

todoSchema.virtual('finishedAgo').get(function(){
    return moment(this.finishedAt).locale('ko').fromNow()
})

// 스키마 -> 컴파일(몽고db가 인식할수 있는 데이터 구조로 변환) -> 모델
const Todo = mongoose.model('Todo', todoSchema) 
// 컬렉션 이름 : Todo에서 첫번째 글자를 소문자로 변경하고 맨 끝에 s 붙임
// => 결과 : todos
module.exports = Todo