import express from "express"
const router = express.Router()
import { userSignUp, userLogin, userLogout } from "../controllers/auth.controller.js"
import { isLoggedIn } from "../middleware/isLoggedInMiddleware.js"

router.post('/signup', userSignUp)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.get('/home', isLoggedIn, (req, res)=>{
    res.json({ok: true})
})

export default router