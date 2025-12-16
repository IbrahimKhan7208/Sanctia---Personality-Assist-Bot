import express from "express"
const router = express.Router()
import { aiController } from "../controllers/ai.controller.js"
import { isLoggedIn } from "../middleware/isLoggedInMiddleware.js"

router.post('/analyze', isLoggedIn, aiController)

export default router