import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});
        
        if (decision.isDenied()) {
            if(decision.reason.isRateLimit()) {
                return res.status(429).json({ success: false, message: "Rate limit exceeded" });
            }
            // if(decision.reason.isBot()) {
            //     return res.status(403).json({ message: "Access denied for bots" });
            // }

            // return res.status(403).json({ success: false, error: "Access denied" });
        }
        next();
        
    } catch (error) {
        console.error(`Arcjet middleware error:, ${error}`);
        next(error)
        
    }
}

export default arcjetMiddleware;