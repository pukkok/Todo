const mongoose = require('mongoose')
const { Schema } = mongoose

const moment = require('moment')


const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // unique: 색인(primary key) email 중복 불가능
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
})

// ()? 옵션 있어도 되고, 없어도 된다.
userSchema.path('email').validate((value)=>{
    return /^[a-zA-Z0-9]+@{1}[a-z]+(\.[a-z]{2})?(\.[a-z]{2,3})$/.test(value)
}, '`{VALUE}`은/(는) 잘못된 이메일 형식입니다.')

userSchema.path('password').validate((value)=>{
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}/.test(value)
}, 'password `{VALUE}`는 잘못된 비밀번호 형식 입니다.')

userSchema.virtual('status').get(function (){ // function으로 써야 this값을 가져온다.
    return this.isAdmin ? '관리자' : '사용자'
})

userSchema.virtual('createdAgo').get(function (){
    return moment(this.createdAt).locale('ko').fromNow()
})

userSchema.virtual('lastModifiedAgo').get(function (){
    return moment(this.lastModifiedAt).locale('ko').fromNow()
})

const User = mongoose.model('User', userSchema)

module.exports = User