const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const cors = require('cors');

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { from, apppass, to, mail, promptt } = req.body;

      // Check if required fields are present
      if (!from || !apppass || !to || !mail || !promptt) {
        return res.status(400).send("Missing required fields");
      }

      let transformer = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: from,
          pass: apppass
        }
      });

      const genAI = new GoogleGenerativeAI(process.env.API);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = "Write an email about this: " + promptt;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const mailtext = response.text();

      let mailData = {
        from,
        to,
        subject: mail,
        text: mailtext
      };

      transformer.sendMail(mailData, (err, info) => {
        if (err) {
          return res.status(500).send("Error sending email");
        }
        res.send("SENT");
      });
    } else {
      res.send("HELLO FROM API!");
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    res.status(500).send("Internal Server Error");
  }
};

const corsMiddleware = cors();

module.exports = (req, res) => {
  corsMiddleware(req, res, () => handler(req, res));
};
