import express from "express"
const router = express.Router()
import { userSignUp, userLogin, userLogout } from "../controllers/auth.controller.js"
import { isLoggedIn } from "../middleware/isLoggedInMiddleware.js"
import { authLimiter } from "../middleware/rateLimiter.js"

router.post('/signup', authLimiter, userSignUp)
router.post('/login', authLimiter, userLogin)
router.post('/logout', userLogout)
router.get('/home', isLoggedIn, (req, res)=>{
    res.json({ok: true})
})

export default router