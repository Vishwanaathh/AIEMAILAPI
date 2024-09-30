const nodemailer=require('nodemailer');
const express=require('express');
const {GoogleGenerativeAI} =require("@google/generative-ai");
const cors=require('cors');
const genAI= new GoogleGenerativeAI(process.env.API);
require('dotenv').config();


const app=express();
app.use(express.json());
app.use(cors());

app.post('/',async(req,res)=>{
    let transformer=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:req.body.from,
            pass:req.body.apppass
    
        }});
        const genAI= new GoogleGenerativeAI(process.env.API);
        const model=genAI.getGenerativeModel({model:"gemini-pro"});
       const prompt="Write an email about this"+req.body.promptt;
        const result=await model.generateContent(prompt);
        const response=await result.response;
      const mailtext=response.text();
    
        let mail={
            from:req.body.from,
            to:req.body.to,
            subject:req.body.mail,
            text:mailtext,
        
        }
        transformer.sendMail(mail,(err,info)=>{
            res.send("SENT");
           console.log("Sent");
        })

})
app.listen(5000,()=>{
    console.log("HELLLOOO");
})
