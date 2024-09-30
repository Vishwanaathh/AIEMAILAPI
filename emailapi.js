const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const cors = require('cors');

const handler = async (req, res) => {
  if (req.method === 'POST') {
    let transformer = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: req.body.from,
        pass: req.body.apppass
      }
    });

    const genAI = new GoogleGenerativeAI(process.env.API);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Write an email about this: " + req.body.promptt;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const mailtext = response.text();

    let mail = {
      from: req.body.from,
      to: req.body.to,
      subject: req.body.mail,
      text: mailtext
    };

    transformer.sendMail(mail, (err, info) => {
      res.send("SENT");
    });
  } else {
    res.send("HELLO FROM API!");
  }
};

const corsMiddleware = cors();

module.exports = (req, res) => {
  corsMiddleware(req, res, () => handler(req, res));
};
