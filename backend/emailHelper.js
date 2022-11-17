import nodemailer from 'nodemailer';
import config from './config';

let that={}

that.mailhelper=async(options)=>{
    return new Promise(async(resolve,reject)=>{
        let transporter = nodemailer.createTransport({
            host: config.EMAIL_HOST,
            port: parseInt(config.EMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
              user: config.EMAIL_HOST_USERNAME, // generated ethereal user
              pass: config.EMAIL_HOST_PASSWORD, // generated ethereal password
            },
          });
    
          transporter.sendMail({
            from: config.EMAIL_HOST_USERNAME, // sender address
            to: options.reciever, // list of receivers
            subject: options.subject, // Subject line
            text: options.text, // plain text body
            // html body
          })
          .then((info)=>{
            resolve(info)
          })
          .catch((error)=>{
            reject(error)
          })
      

    })

}

module.exports=that