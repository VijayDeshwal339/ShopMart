const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    addresses: {
      type: [Schema.Types.Mixed],
    },
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

exports.User = mongoose.model("User", UserSchema);

