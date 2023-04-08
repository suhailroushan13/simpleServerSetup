import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastname: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  userVerified: {
    email: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  userVerifiedString: {
    email: {
      type: String,
      required: true,
      default: null,
    },
    phone: {
      type: String,
      required: true,
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const userModel = new mongoose.model("Users", userSchema, "users");
export default userModel;
