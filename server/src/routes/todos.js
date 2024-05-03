const express = require('express')
const Todo = require('../models/Todo')
const { isAuth } = require('../../auth')
const expressAsyncHandler = require('express-async-handler')
const router = express.Router()

router.get('/', isAuth, expressAsyncHandler( async(req, res, next) => {
    const todos = await Todo.find({ author: req.user._id })
    .populate('author', ['name', 'userId', '-_id']) // 객체안의 불러올 요소들 배열로 불러온다.
    if(todos.length === 0){
        return res.status(404).json({ code: 404, message: 'Failed to find todos !'})
    }else{
        return res.json({ code: 200, todos })
    }
}))

router.get('/:id', isAuth, expressAsyncHandler( async(req, res, next) => { // api/todos/{id}
    const todo = await Todo.findOne({
        author: req.user._id,
        _id: req.params.id // Todo ID
    })
    if(!todo){
        return res.status(404).json({ code: 404, message: 'Todo Not Found'})
    }else{
        return res.json({ code: 200, todo })
    }
}))

router.post('/', isAuth, expressAsyncHandler( async(req, res, next) => {
    // 중복체크 - 로그인한 사용자 기준으로 할일 목록 확인 후 할일 제목이 중복이 되면 저장 안함
    const searchedTodo = await Todo.findOne({
        author: req.user._id, // isAuth에서 전달된 값
        title: req.body.title
    })
    if(searchedTodo){ // 중복된게 있다.
        return res.json({ code: 204, message: 'Todo you want to create already exists in DB!'})
    }else{
        const todo = new Todo({
            author: req.user._id, // 로그인한 사용자의 아이디값
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            imgUrl: req.body.imgUrl
        })
        const newTodo = await todo.save() // 새로운 할일 생성 save는 비동기
        if(!newTodo){
            return res.status(401).json({ code: 401, message: 'Failed to save todo !'})
        }else{
            res.status(201).json({ 
                code : 201, 
                message: 'New Todo Created', 
                newTodo // 새로운 할일을 팝업창을 띄워서 사용자에게 안내하는 용도
            }) // 201: created (생성)
        }
    }
}))

router.put('/:id', isAuth, expressAsyncHandler( async(req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id,
        _id: req.params.id
    })
    if(!todo){
        return res.status(404).json({ code: 404, message: 'Todo Not Found' })
    }else{
        todo.title = req.body.title || todo.title
        todo.description = req.body.description || todo.description
        todo.isDone = req.body.isDone || todo.isDone
        todo.category = req.body.category || todo.category
        todo.imgUrl = req.body.imgUrl || todo.imgUrl
        todo.lastModifiedAt = new Date() // 수정시각 업데이트
        todo.finishedAt = todo.isDone ? todo.lastModifiedAt : todo.finishedAt

        const updatedTodo = await todo.save() // 실제 TODO를 DB에 업데이트
        res.json({ 
            code: 200, 
            message: 'Todo Updated !',
            updatedTodo
        })
    }
}))

router.delete('/:id', isAuth, expressAsyncHandler( async(req, res, next) => {
    const todo = await Todo.findOne({
        author: req.user._id,
        _id: req.params.id
    })
    if(!todo){
        return res.status(404).json({ code: 404, message: 'Todo Not Found'})
    }else{
        await Todo.deleteOne({
            author: req.user._id,
            _id: req.params.id
        })
        return res.json({ code: 204, message: 'Todo deleted successfully !'})
    }
}))

module.exports = router