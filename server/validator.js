const { body } = require('express-validator')

const isFieldEmpty = (field) => { //Form 필드가 비어있는지 검사
    return body(field)
            .notEmpty()
            .withMessage(`user ${field} is required`)
            .bail() // bail() 메서드 앞쪽 부분이 false이면 더이상 뒤쪽의 데이터검증은 안함
            .trim() // 공백 제거
}

const validateUserName = () => {
    return isFieldEmpty('name')
            .isLength({ min: 2, max: 20 }) // 회원명 (2자~20자)
            .withMessage('user anme length must be between 2 to 20 characters')
}

const validateUserEmail = () => {
    return isFieldEmpty('email')
            .isEmail() // 이메일 형식에 맞는지 검사
            .withMessage('user email is not valid')
}

const validateUserPassword = () => {
    return isFieldEmpty('password')
            .isLength({ min: 7})
            .withMessage('password must be more than 7 characters')
            .isLength({ max: 15})
            .withMessage('password must be less then 15 characters')
            .bail()
            .matches(/[a-zA-Z]/)
            .withMessage('password must be at least 1 alphabet')
            .matches(/[0-9]/)
            .withMessage('password must be at least 1 number')
            .matches(/[!@#$%^&*]/)
            .withMessage('password must be at least 1 special character')
            .bail() // value: 요청본문에서 전달된 비밀번호
            .custom( (value, { req }) => { req.body.confirmPassword === value }) // filter 메서드처럼 동작
            .withMessage(`password don't match`)
}

const validateTodoTitle = () => {
    return isFieldEmpty("title")
    .isLength({ min: 2, max: 20 }) // 2~20자
    .withMessage("todo title length must be between 2 ~ 20 characters")
} 
const validateTodoDescription = () => {
    return isFieldEmpty("description")
    .isLength({ min: 5, max: 100 }) // 5 ~100자
    .withMessage("todo description length must be between 5 ~ 100 characters")
}
const validateTodoCategory = () => {
    return isFieldEmpty("category")
    .isIn(['오락', '공부', '음식', '자기계발', '업무', '패션', '여행'])
    .withMessage('todo category must be one of 오락 | 공부 | 음식 | 자기계발 | 업무 | 패션 | 여행')
}

module.exports = ({
    validateUserName,
    validateUserEmail,
    validateUserPassword,
    validateTodoTitle,
    validateTodoDescription,
    validateTodoCategory
})