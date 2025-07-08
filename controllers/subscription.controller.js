import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id // Assuming req.user is set by the auth middleware
        })
        
        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription
        });
        
    }catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.id) {
            const error = new Error("You are not authorized to view this user's subscriptions");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        
    }
}