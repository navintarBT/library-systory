const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create product
const AddLibrarySchema = new Schema({
    LIB_NAME: {
        type: String
    },
    DESCRIPTION: {
        type: String
    },
    REFERENCE: {
        type: String
    },
    DESCRIPTIONS_OVER: {
        type: String
    },
    DESCRIPTIONS_INS: {
        type: String
    },
    DESCRIPTIONS_HTU: {
        type: String
    },
    DESCRIPTIONS_EXP: {
        type: String
    },
    DESCRIPTIONS_SGT: {
        type: String
    },
    IMAGE: {
        type: String
    },
    CREATE_BY: {
        type: String
    },
    ATTRACHMENT: {
        type: String
    },
    INSTALLATION: {
        type: String
    },
    HOWTOUSE: {
        type: String
    },
    EXAMPLE: {
        type: String
    },
}, {
    collection: "library"
});

//create product
const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String
    },
    password: {
        type: Number, default: null
    }
}, {
    collection: "user"
});

// Exporting Models
module.exports = {
    AddLibrarySchema: mongoose.model('Library', AddLibrarySchema),
    User: mongoose.model('User', userSchema),
};
