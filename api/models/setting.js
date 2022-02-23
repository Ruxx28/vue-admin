const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
    name: { type: String, default: ""},
    user: { type: String, require: true},
    pass: { type: String, require: true},
    startCost: {type: Number, default: 0},
    feesShoppe: { type: Number, default: 0},
});

userSchema.pre("save", async function (next) {
    const n = this;
    if (n.isModified("password")) {
        n.pass = await bcrypt.hash(n.pass, 8);
    }
    next();
});

module.exports = mongoose.model("setting", userSchema);