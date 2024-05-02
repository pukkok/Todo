const asyncFunction = () => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({message : 'success'})
        },3000)
    })
}

const wrap = (asyncFn, response) => {
    return (async (req, res, next) => {
        try{
            let result = await asyncFn()
            return res.json(result)
        }catch(err){
            return next(err)
        }
    })
}
module.exports = {
    asyncFunction,
    wrap
}