const mongoose = require('mongoose')

const ComplaintSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    address : {
        type : String,
    },
    problemImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    status : {
        type : String,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    acceptedByAuthorityId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    resolvedDate : {
        type : String,
    },
},{ timestamps : true })

const ComplaintModel = mongoose.model('complaints',ComplaintSchema)

module.exports = ComplaintModel