const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    dateCreate: { type: Date, default: Date.now },
    name: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    webPage: { type: String },
    note: { type: String }
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("producer", userSchema);