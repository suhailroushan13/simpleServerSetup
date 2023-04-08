import mongoose from "mongoose";
import config from "config";
const connect = async () => {
  try {
    console.clear();
    await mongoose.connect(config.get("DB_URI"));
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

connect();
