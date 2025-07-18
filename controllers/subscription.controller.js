import { workflowClient } from '../config/upstash.js';
import Subscription from '../models/subscription.model.js';
import { SERVER_URL } from '../config/env.js'

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id // Assuming req.user is set by the auth middleware
        })

        const triggerResponse = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            retries: 0, // Number of retries in case of failure
        })
        
        // Log the response for debugging
        console.log('QStash trigger response:', triggerResponse);

        const { workflowRunId, messageId } = triggerResponse;

        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: {subscription, workflowRunId}
            // messageId
        });

        // res.status(201).json({
        //     success: true,
        //     message: "Subscription created successfully",
        //     data: subscription
        // });
        
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