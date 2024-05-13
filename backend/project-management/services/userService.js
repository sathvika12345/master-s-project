require("dotenv").config();

const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ResetPassword = require("../models/ResetPassword");
const nodemailer = require('nodemailer');
const moment = require('moment');
const transporter = nodemailer.createTransport({
  service: process.env.MAIL_MAILER,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_ENCRYPTION === 'tls',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
  tls: {
    // Allow invalid certificates (e.g., self-signed)
    rejectUnauthorized: false
  }
});

async function createUser(userDetails) {
  try {
    const hashedPassword = await bcrypt.hash(userDetails?.password, 10);
    let newUser;
    console.log("getting usedetail",userDetails?.role);
    if(userDetails?.role=='reviewer') {
      newUser={...userDetails,active:false,password: hashedPassword}
    }else{
      newUser = { ...userDetails, password: hashedPassword };
    }
    const user = await User.create(newUser);
    return user;
  } catch (error) {
    throw error;
  }
}

async function login({ userEmail, password }) {
  const user = await User.findOne({ where: { email: userEmail } });
  if (!user) {
    throw new Error('Username or password is incorrect');
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error('Username or password is incorrect');
  }

  if(user.active===false){
    throw new Error('Require Permission from admin for login');
  }
  const token = jwt.sign({ userId: user.rollNo }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
  const metaData = { role: user.role, username: user.name,userId:user.userId,displayPictureUrl:user.displayPictureUrl};
  return [metaData, token];
}

async function getUserByEmail(userEmail) {
  try {
    const user = await User.findOne({ where: { userEmail } });
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUsers() {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
}

async function getReviewers() {
  try {
    const users = await User.findAll({
      where: {
        role: 'reviewer'
      }
    });
    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserByRollNo(userId) {
  try {
    const user = await User.findOne({ where: { userId } });
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(rollNo, userDetails) {
  try {
    const user = await User.findOne({ where: { rollNo } });
    if (!user) {
      throw new Error('User not found');
    }
    user.email = userDetails?.email;
    const hashedPassword = await bcrypt.hash(userDetails?.password, 10);
    user.password = hashedPassword;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUserProfile(userId, userDetails) {
  try {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.email = userDetails?.email;
    user.name=userDetails?.name;
    user.displayPictureUrl=userDetails?.displayPictureUrl;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateReviwerLoginById(userId, userDetails) {
  try {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.active=userDetails?.active;
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
}


async function deleteUser(rollNo) {
  try {
    const user = await User.findOne({ where: { rollNo } });
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
    return user;
  } catch (error) {
    throw error;
  }
}

async function resetPassword(email) {
  try {
    const resetPassword = await ResetPassword.findOne({ where: { email } });
    if (resetPassword) {
      await resetPassword.destroy();
    }
    const otp = generateOTP();
    const expiredAt = moment().add(10, 'minutes').toDate();
    const params = {email : email,otp:otp,expiredAt:expiredAt};
    let mailres = await sendOTPByEmail(email,otp);
    if(mailres){
      const record = await ResetPassword.create(params);
      return record;
    }
  } catch (error) {
    throw error;
  }
}

async function changePassword({ email,otp,password }) {
  try {
    const user = await User.findOne({ where: { email } });
    const resetPassword = await ResetPassword.findOne({ where: { email } });
    if (!user) {
      throw error;
    }
    if (resetPassword && (resetPassword.otp == otp)) {
      user.password= await bcrypt.hash(password, 10);
      await user.save();
      return user;
    } else if(resetPassword && (resetPassword.otp != otp)){
      throw new Error('OTP mismatch');
    }
  } catch (error) {
    throw error;
  }
}

async function sendOTPByEmail(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP is: ${otp}`
    });

    return {'Mail Id': info.messageId};
  } catch (error) {
    return {'Mail Error': error};
  }
}

function generateOTP() {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000);
}


module.exports = {
  createUser,
  getUserByEmail,
  updateReviwerLoginById,
  updateUserProfile,
  updateUser,
  getReviewers,
  deleteUser,
  getUserByRollNo,
  getUsers,
  login,
  resetPassword,
  changePassword
};
