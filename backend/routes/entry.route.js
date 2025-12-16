import express from "express"
import { entryController, guardianMessage } from "../controllers/entry.controller.js"
import { isLoggedIn } from "../middleware/isLoggedInMiddleware.js"

const router = express.Router()

router.get('/recent', isLoggedIn, entryController)
router.get('/latest', isLoggedIn, guardianMessage)

export default router