import nodemailer from "nodemailer";

export const sendEmail = async ({ to = "", message = "", subject = "" }) => {
    // connection configuration
    let transporter = nodemailer.createTransport({
        host: "localhost",  // stmp.gmail.com
        port: 587, // 465,
        secure: false, // true  TLS,
        service: "gmail",
        auth: {
            user: "mahmoudkhaled225@gmail.com",
            pass: "nxjnleszixopjuxs",
        },
    });
    let info = await transporter.sendMail({
        from: "mahmoudkhaled225@gmail.com",
        to,
        subject,
        html: message,
    });
    if (info.accepted.length) {
        return true;
    }
    return false;
};
