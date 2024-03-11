const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const TokenModel = mongoose.model("tokens", tokenSchema);

module.exports = TokenModel;