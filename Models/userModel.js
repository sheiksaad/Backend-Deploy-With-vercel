import mongoose from "mongoose";

const schema = mongoose.Schema({
  name: String,
  userName: String,
  email: String,
  password: String,
});
const userModel = mongoose.model("user", schema);
export default userModel;
