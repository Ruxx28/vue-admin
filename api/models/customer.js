const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    dateCreate: { type: Date, default: Date.now },
    name: { type: String, required: true },
    phone:{ type: String, require: true },
    address:{ type: String, require: true },
    email:{ type: String, lowercase: true },
    note:{ type: String, require: true },
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("customer", userSchema);