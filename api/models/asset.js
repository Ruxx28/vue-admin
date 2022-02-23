const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    dateCreate: { type: Date, default: Date.now },
    type: { type: String},
    user: {
        _id: { type: mongoose.Types.ObjectId, required: true },
        name: { type: String}
    },
    name: { type: String, required: true },
    price:{ type: Number, require: true },
    note:{ type: String, require: true },
});

userSchema.pre("save", async function (next) {
    next();
});

module.exports = mongoose.model("asset", userSchema);