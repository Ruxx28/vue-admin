const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    sku: { type: String,require: true },
    type: { type: String, default: 'product'},
    name: { type: String, unique: true, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
    suppliers: { type: Array},
    description: { type: String, require: false },
    mass: {type: Number}
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("product", userSchema);