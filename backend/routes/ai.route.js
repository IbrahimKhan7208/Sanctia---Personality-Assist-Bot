import express from "express"
const router = express.Router()
import { aiController } from "../controllers/ai.controller.js"
import { isLoggedIn } from "../middleware/isLoggedInMiddleware.js"
import { analyzeLimiter } from "../middleware/rateLimiter.js"

router.post('/analyze', isLoggedIn, analyzeLimiter, aiController)

export default router