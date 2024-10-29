const mongoose = require("mongoose");
const express = require("express");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    hasSubscription: {
        type: Boolean,
        default: false, 
    },
});

const model = mongoose.model("User", userSchema);

module.exports = model;