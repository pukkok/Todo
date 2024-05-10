const moment = require('moment')

const now = moment() // default 현재 날짜
// 값을 부를땐 .format()을 붙혀 불러온다.

// console.log(now.format('DD/MM/YYYY')) //포맷을 바꿀수도 있다.

// "-" 가 default format
const date = moment('2021.10.09', "YYYY.MM.DD").locale('ko')
console.log(date.fromNow())

// const eng = date.fromNow()
// eng.replace('years ago')
// const test1 = now.startOf('day').format() //그 날의 시작나는 시각
// const test2 = now.endOf('day').format() //그 날의 끝나는 시각
// console.log(test1)
// console.log(test2)
// const test3 = now.startOf('year').format() //그 해의 시작하는 시각
// console.log(test3)

// const addDate = now.add(14, "days").format()
// console.log(addDate)

// const date1 = moment()
// const date2 = moment('2024-04-27') 

// const diff = date1.diff(date2, 'days') // 두 날짜 비교
// console.log(diff)

// let a = moment('2024-05-08').fromNow()
// let b = moment('2021-07-09').fromNow()
// let c = moment('2023-12-13').fromNow()
// console.log(a, b, c)