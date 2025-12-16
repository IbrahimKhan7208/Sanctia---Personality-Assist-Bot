import jwt from "jsonwebtoken"

export const isLoggedIn = (req, res, next)=>{
    let token = req.cookies.token

    if(!token) return res.json({error: "You are not LoggedIn!"})

    var decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    next()
} 