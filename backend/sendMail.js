import nodemailer from 'nodemailer';

import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD
    }
});

const mailOptions = {
    from: {
        name : "ChronUs", 
        address: process.env.USER
    },
    to: "daun.lee@mail.mcgill.ca", 
    subject: "Your Meeting Schedule", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
};
  
const sendMail = async () => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent")
    } catch(error){
        console.error(error);
    }
}

sendMail(transporter,mailOptions);