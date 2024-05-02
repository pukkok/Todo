const jwt = require('jsonwebtoken')

// HS256 암호화 알고리즘 => 대칭키 알고리즘
// RS256 암호와 알고리즘 => 비대칭키 알고리즘
// const token = jwt.sign({ email : 'test@gmail.com' }, '비밀키') // 3번째 인자는 선택
const token = jwt.sign({ email : 'test1@gmail.com' }, '비밀키' , { 
    // algorithm: "RS256", // 암호화 알고리즘 설정
    expiresIn: '1s' // 만료 기간 설정
})
console.log(token) // jwt 토큰 혹은 시그니쳐(signiture) => base64 형식 문자열
new Promise((resolve) => {
    setTimeout(resolve, 1000)
}).then(()=>{
    const decodedResult = jwt.decode(token, { complete: true }) // 만료되더라도 알수 코드를 알수 있다.
    console.log(decodedResult)

    // 사용자 식별(권한 검사) + 사용자정보 위변조 여부 검사
    // const verified = jwt.verify(token, '비밀키') // 복호화 작업 , 다른키가 들어간다면
    // console.log(verified) // 검증이 제대로 되었는지 확인
})
