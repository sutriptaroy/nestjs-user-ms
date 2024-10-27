// export const JWT_SECRET = process.env.JWT_SECRET;
export default () => ({
    jwt: {
        secret: process.env.JWT_SECRET
    },
    db: {
        mongo: {
            connectionString: process.env.MONGO_URL
        }
    },
    smtpUrl: process.env.SMTP_URL,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    appUrl: process.env.APP_URL,
    resetPasswordPath: process.env.RESET_PASSWORD_PATH
})
