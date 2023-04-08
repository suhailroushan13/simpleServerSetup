import express from "express";
import userModel from "../../models/users/Users.js";
import {
  userLoginValidation,
  userRegisterValidation,
  errorValidator,
} from "../../validators/users/index.js";
import bcrypt from "bcrypt";
import { jwtSign, jwtVerify } from "../../utils/jwt.js";
import { hashing, compare } from "../../utils/bcrypt.js";
import randomString from "../../utils/randomString.js";
import sendMail from "../../utils/sendEmail.js";
import sendSMS from "../../utils/sendSMS.js";
import config from "config";
import { get } from "mongoose";
const router = express.Router();

router.post(
  "/register",
  userRegisterValidation(),
  errorValidator,
  async (req, res) => {
    try {
      let { firstname, lastname, phone, email, password } = req.body;

      // Double Registeration
      const doubleCheck = await userModel.findOne({ email });

      if (doubleCheck) {
        return res.status(201).json({ success: "User Already Registered" });
      }

      let userData = await userModel(req.body);

      // Password Hashing

      userData.password = await hashing(password, 12);

      // Random String
      userData.userVerifiedString.phone = randomString(10);
      userData.userVerifiedString.email = randomString(10);

      // Jwt Sign
      let phoneToken = jwtSign({ token: userData.userVerifiedString.phone });
      let emailToken = jwtSign({ token: userData.userVerifiedString.email });

      sendMail({
        subject: "User Account Verification - Suhail Solutions",
        to: email,
        body: `Hi ${firstname} ${lastname} <br/>
            Thank you for Signing Up. Please <a href='${config.get(
              "URL"
            )}/email/verify/${emailToken}'>Click Here </a>
            to verify your Email Address. <br/><br/>
            Thank you <br/>
            <b>Team Suhail Solutions.</b>`,
      });

      sendSMS({
        body: `Hi ${firstname}, Please click the given link to verify your phone ${config.get(
          "URL"
        )}/phone/verify/${phoneToken}`,
        phone,
      });
      // console.log(
      //   `Hi ${firstname}, Please click the given link to verify your phone ${config.get(
      //     "URL"
      //   )}/api/users/phone/verify/${phoneToken}`
      // );
      // console.log(`Hi ${firstname} ${lastname} <br/>
      //       Thank you for Signing Up. Please <a href='${config.get(
      //         "URL"
      //       )}/api/users/email/verify/${emailToken}'>Click Here </a>
      //       to verify your Email Address. <br/><br/>
      //       Thank you <br/>
      //       <b>Team Suhail Solutions.</b>`);
      await userData.save();
      res.status(200).json({ success: "User Successfully Registered" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/phone/verify/:token", async (req, res) => {
  try {
    let { token } = req.params;
    let verify = jwtVerify(token);
    if (!verify) {
      return res.status(401).json({ msg: "Token Expired " });
    }
    let userData = await userModel.findOne({
      "userVerifiedString.phone": verify.token,
    });
    if (!userData) {
      return res.status(401).json({ msg: "Invalid URL" });
    }
    userData.userVerified.phone = true;
    await userData.save();
    res.status(200).send(`<h3> User Phone Has Been Verified Now ✅ </h3>`);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Interval Server Error" });
  }
});

router.get("/email/verify/:token", async (req, res) => {
  try {
    let { token } = req.params;
    let verify = jwtVerify(token);
    if (!verify) {
      return res.status(401).json({ msg: "Token Expired " });
    }
    let userData = await userModel.findOne({
      "userVerifiedString.email": verify.token,
    });
    if (!userData) {
      return res.status(401).json({ msg: "Invalid URL" });
    }
    userData.userVerified.email = true;
    await userData.save();
    res.status(200).send(`<h3> User Email Has Been Verified Now ✅ </h3>`);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: "Interval Server Error" });
  }
});

router.post(
  "/login",
  userLoginValidation(),
  errorValidator,
  async (req, res) => {
    try {
      let { email, password } = req.body;

      let userData = await userModel.findOne({ email });
      if (!userData) {
        return res
          .status(201)
          .json({ error: "No User Found With This Email Please Reister" });
      }

      if (!userData.userVerified.phone) {
        return res
          .status(401)
          .json({ error: "Please Verify Mobile Verification" });
      }

      if (!userData.userVerified.email) {
        return res
          .status(200)
          .json({ error: "Please Verify Email Verification" });
      }

      let getPassword = await compare(userData.password, password);

      if (!getPassword) {
        return res.status(401).json({ error: "Invalid Password" });
      }
      res.status(200).json({ success: "Login Verification Success" });
    } catch (error) {
      console.log(error);
      res.status(501).json({ error: "Interval Server Error" });
    }
  }
);

export default router;
