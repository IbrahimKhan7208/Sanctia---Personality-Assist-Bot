import rateLimit from "express-rate-limit"

export const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            authLimitError: "RATE_LIMIT_AUTH",
            message: "Muitas tentativas. Tente novamente em alguns instantes.",
        });
    }
})

export const analyzeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res) => {
        return res.status(429).json({
            analyzeLimitError: "RATE_LIMIT_ANALYZE",
            message: "Muitas análises em pouco tempo. Faça uma pausa de alguns instantes e tente novamente.",
        });
    }
})