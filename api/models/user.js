const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    dateCreate: { type: Date, default: Date.now},
    name: { type: String, require: true},
    tag: { type: String},
    phone: { type: String},
    spending: { type: Number, default: 0},
    avatar: { type: String},
    email: { type: String},
    address: { type: String},
    note: { type: String}
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("user", userSchema);