const mongoose = require('mongoose')
const User = require('./src/models/User')
const Todo = require('./src/models/Todo')
const config = require('./config')

const category = ['오락', '공부', '음식', '자기계발', '업무', '패션', '여행']
const done = [true, false]
const users = [] // 생성된 사용자 목록을 저장

mongoose.connect(config.MONGODB_URL) // 프로미스
.then(() => console.log('데이터베이스 연결 성공'))
.catch(err => console.log(`데이터베이스 연결 실패 : ${err}`))

// 랜덤날짜 생성
const generateRandomDate = (from, to) => { // from 시작하는 날짜, to 끝나는 날짜
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()))
}

// getTime() : 1714662000000 => 계산용
// console.log(generateRandomDate(new Date(2024, 0, 2), new Date()))

// 배열에서 랜덤값 선택
const selectRandomValue = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)]
}

// 랜덤 문자열 생성
const generateRandomeString = n => {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    const str = new Array(n).fill('a')
    return str.map(s => alphabet[Math.floor(Math.random()*alphabet.length)]).join('')
}

//사용자 데이터 생성 테스트
const createUsers = async (n, users) => {
    console.log('creating users now...')
    for(let i=0; i<n; i++){
        const user = new User({
            name: generateRandomeString(5),
            email: `${generateRandomeString(7)}@gmail.com`,
            userId: generateRandomeString(10),
            password: generateRandomeString(13)
        })
        users.push(await user.save())
    }
    return users
}
// TODO 데이터 생성 테스트
const createTodos = async (n, user) => {
    console.log(`creating todos by ${user.name} now...`)
    for(let i=0; i<n; i++){
        const createAt = generateRandomDate(new Date(2024, 0, 2), new Date())

        const todo = new Todo({
            author: user._id,
            title: generateRandomeString(10),
            description: generateRandomeString(19),
            imgUrl: `https://www.${generateRandomeString(10)}.com/${generateRandomeString(10)}.png`,
            category: selectRandomValue(category),
            isDone: selectRandomValue(done),
            createdAt: createAt,
            lastModifiedAt: generateRandomDate(createAt, new Date()),
            finishedAt: generateRandomDate(createAt, new Date())
        })
        await todo.save()
    }
}

// 사용자와 해당 사용자의 할일 목록을 순서대로 생성
const buildData = async (users) => {
    users = await createUsers(7, users)
    users.forEach(user => createTodos(30, user));
}

buildData(users)