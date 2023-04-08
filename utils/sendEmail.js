import nodelmailer from "nodemailer";
import config from "config";
let sendMail = async (emailData) => {
  const HOST = config.get("EMAIL_SMTP.HOST");
  const AUTH = config.get("EMAIL_SMTP.AUTH");
  const PORT = config.get("EMAIL_SMTP.PORT");

  console.clear();

  try {
    let transporter = nodelmailer.createTransport({
      host: HOST,
      port: PORT,
      secure: true,
      auth: {
        user: AUTH.USER,
        pass: AUTH.PASS,
      },
    });

    await transporter.sendMail({
      from: `"Suhail Check 1" <${AUTH["USER"]}>`,
      subject: emailData.subject,
      to: emailData.to,
      html: emailData.body,
    });
    console.log("Hau Bhai Bhej diya msg mai");
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;

// sendMail({
//   subject: "Suhail Subject ",
//   body: "Testing 1",
//   to: "suhailroushan13@gmail.com",
// });
