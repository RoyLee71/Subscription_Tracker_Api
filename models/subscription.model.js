import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minlength: [3, "Subscription name must be at least 3 characters long"],
        maxlength: [50, "Subscription name must be at most 50 characters long"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be a positive number"],
    },
    currency: {
        type: String,
        // required: [true, "Currency is required"],
        enum: ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"],
        default: "USD",
        // trim: true,
    },
    frequency: {
        type: String,
        // required: [true, "Frequency is required"],
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly",
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["basic", "premium", "enterprise", "pro", "business", "sports", "entertainment", "education", "health", "lifestyle"],
        default: "basic",
    },
    paymentMethod: {
        type: String,
        // required: [true, "Payment method is required"],
        enum: ["credit_card", "paypal", "bank_transfer", "crypto"],
        default: "credit_card",
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["active", "inactive", "cancelled", "expired"],
        default: "active",
    },

    startDate: {
        type: Date,
        required: [true, "Start date is required"],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: "Status date cannot be in the future"   
        }
    },
    renewalDate: {
        type: Date,
        // required: [true, "Renewal date is required"],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: "Renewal date must be after the start date"   
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true
    },

}, {timestamps: true});

//automatically set renewalDate based on frequency if not provided
subscriptionSchema.pre("save", function(next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        };
        
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]); // Default to one month later

        // this.renewalDate = new Date(this.startDate);
        // this.renewalDate.setMonth(this.renewalDate.getMonth() + 1); // Default to one month later

    }

    //automatically set status based on renewalDate
    if (this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();

});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;