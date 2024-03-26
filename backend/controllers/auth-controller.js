const otpService = require('../services/otp-service')
const hashService = require('../services/hash-service');
const { verifyOtp } = require('../services/otp-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');


class AuthController{
    async sendOtp(req,res){
        //
        const { phone } = req.body;
        if( !phone ){
            console.log('happy')
            res.status(400).json({ message: 'Phone field is required!' })
        }


        // generate otp
        const otp = await otpService.generateOtp();

        // hash otp
        const ttl = 1000 * 60 * 2; //2 minutes time to leave
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        //send otp
        try{
            // await otpService.sendBySms(phone, otp);
            // uncomment this if you want to receive sms
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp
            })
        } catch(err){
            console.log(err);
            res.status(500).json({message: 'message sending failed'});
        }
        
        
    }

    async verifyOtp(req,res){
        //

        const {otp, hash, phone} = req.body;
        if(!otp || !hash || !phone){
            res.status(400).json({message: 'All fields are required'});
        }

        const [hashedOtp,expires] = hash.split('.');
        if(Date.now() > +expires){
            res.status(400).json({message: 'OTP expired!'});
        }

        const data = `${phone}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if(!isValid){
            res.status(400).json({message: "Invalid otp"});

        }

        let user;
        // let accessToken;
        // let refreshToken;



        try{
            user = await userService.findUser({phone});
            if(!user){
                user = await userService.createUser({phone});
            }
        }catch(err){
            console.log(err);
            res.status(500).json({message: 'Db error'});
        }


        // JWT Token
        const {accessToken, refreshToken} = tokenService.generateTokens({_id: user._id, activated: false})

        await tokenService.storeRefreshToken(refreshToken, user._id);
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // withCredentials: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // withCredentials: true
        });

        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });
    }

    async refresh(req,res){
        // get refresh token from cookie

        const { refreshToken: refreshTokenFromCookie } = req.cookies;

        // check if token is valid
        let userData;
        try{
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        }catch(err){
            return res.status(401).json({message: 'Invalid Token'});
        }

        // check if token is in db
        try{
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);

            if(!token){
                return res.status(401).json({message: 'Invalid Token'});
            }
        }catch(err){
            return res.status(500).json({message: 'Internal Error(auth-controller)'});
        }
       
        // check if valid user
        const user = await userService.findUser({_id: userData._id});
        if(!user){
            return res.status(404).json({message: 'No user'});
        }

        // generate new tokens
        const {refreshToken, accessToken} = tokenService.generateTokens({_id: userData._id});

        // update refresh token
        try{
            tokenService.updateRefreshToken(userData._id, refreshToken);
        }catch(err){
            return res.status(500).json({message: 'Internal Error(auth-controller)'});
        }

        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // withCredentials: true
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            // withCredentials: true
        });

         // response
        const userDto = new UserDto(user);
        res.json({ user: userDto, auth: true });

       

    }

    async logout(req,res){

        const {refreshToken} = req.cookies;

        // delete refresh token from db

        await tokenService.removeToken(refreshToken);

        //delete cookies

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        res.json({user: null, auth: false});
    }
}

module.exports = new AuthController();