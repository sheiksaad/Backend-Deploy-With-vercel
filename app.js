import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./Models/userModel.js";
import cors from "cors";
import "dotenv/config";
import { foodData } from "./foodData.js";

const app = express();

const Port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DBURI = process.env.MONGODB_URI;

mongoose.connect(DBURI);

mongoose.connection.on("connected", () => console.log("MongoDB Connected"));

mongoose.connection.on("error", (err) => console.log("MongoDB Error", err));

app.listen(Port, (req, res) => {
  console.log(`server is running on port ${Port}`);
});
app.get("/", (req, res) => {
  res.json("server start");
});

app.post("/signup/api", async (req, res) => {
  const { name, userName, email, password } = req.body;
  if (!name || !userName || !email || !password) {
    res.json({ message: "required fields are missing", status: false });
    return;
  }
  const existingUser = await userModel.findOne({ email });
  if (existingUser !== null) {
    res.json({ message: "user already exist", status: false });
    return;
  }
  const hashPassword = await bcrypt.hash(password, 10);
  let userObj = {
    name,
    userName,
    email,
    password: hashPassword,
  };
  await userModel.create(userObj);
  res.json({
    message: "user create  successfully",
    status: true,
  });
});
app.post("/login/api", async (req, res) => {
  const { email, password } = req.body;
  const userEmail = await userModel.findOne({ email });

  console.log(userEmail);

  if (!userEmail) {
    res.json({
      message: "invalid email & password",
      status: false,
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, userEmail.password);
  if (!isMatch) {
    res.json({
      message: "invalid email & password",
      status: false,
    });
    return;
  }
  res.json({
    message: "user  login successfully",
    status: true,
  });
});


app.get("/food",(req,res)=>{
  res.status(200).json({
    message:"food api",
    status:true,
    data:foodData
  })
})
