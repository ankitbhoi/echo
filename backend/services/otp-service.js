const crypto = require('crypto');
const hashedService = require('./hash-service')

const smsSid = process.env.SMS_SID;
const smsAuthToken = process.env.SMS_AUTH_TOKEN;
const twilio = require('twilio')(smsSid,smsAuthToken, {
    lazyLoading: true
});

class OtpService{
    async generateOtp(){
        const otp = crypto.randomInt(1000,9999);
        return otp;
    }

    async sendBySms(phone, otp){
        return await twilio.messages.create({
            body: `Your Echoverse OTP is ${otp}`,
            from: process.env.SMS_FROM_NUMBER,
            to: phone,
        })
    }

    verifyOtp(hashedOtp, data){
        let computedHash = hashedService.hashOtp(data);
        return computedHash === hashedOtp;

    }

}

module.exports = new OtpService();
