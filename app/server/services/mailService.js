const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const REFRESH_TOKEN = process.env.GOOGLE_NODE_MAILER_REFRESH_TOKEN;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_NODE_MAILER_REDIRECT_URI;

const baseUrl = process.env.BASE_URL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * Sends reset link containing token via email
 * @param {string} receiver email address of user
 * @param {string} token
 */
const sendEmail = async (receiver, token, name) => {
  
  try {
      const accessToken = await oAuth2Client.getAccessToken();

      const smtpConfig = {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use SSL
        auth: {
          type: "OAuth2",
          user: process.env.MY_GMAIL_ADDRESS,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken,
        },
        ignoreTLS: true,
      };

      const transport = nodemailer.createTransport(smtpConfig);


    const mail = {
      from: "Project Explorer <michael.isesele@gmail.com>",
      to: receiver,
      subject: "Reset Your Password",
      text: `Hello ${name} from Project Explorer`,
      html: `
      <h3> Hi ${name}!</h3>
      <p> Due to your recent request to change your password, you have been provided with a secured link to complete the process.</p>
      <a href="${baseUrl}/resetpassword/${token}"> Click Here</a> 
      `,
    };

    

    const result = await transport.sendMail(mail, function(err, info) {
    if (err) {
        console.log(err);
    } else {
        // see https://nodemailer.com/usage
        console.log("info.messageId: " + info.messageId);
        console.log("info.envelope: " + info.envelope);
        console.log("info.accepted: " + info.accepted);
        console.log("info.rejected: " + info.rejected);
        console.log("info.pending: " + info.pending);
        console.log("info.response: " + info.response);
    }
    transport.close();
    return result
  });
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail

