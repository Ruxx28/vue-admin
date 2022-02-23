const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    dateCreate: { type: Date, default: Date.now },
    status: { type: String, default: 'Đang xử lý' },
    type: { type: String },
    totalPrice: { type: Number },
    cost: { type: Number },
    ship: { type: Number },
    note: { type: String },
    feesShoppe: { type: Number },
    customer: {
        _id: { type: mongoose.Types.ObjectId },
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String }
    },
    product: [{
        _id: { type: mongoose.Types.ObjectId },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number }
    },],
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("oder", userSchema);