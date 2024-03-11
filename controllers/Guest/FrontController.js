const UserModel = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const TokenModel = require("../../models/Token");

class FrontController {

    static login = async(req,res) => {
        try {
            res.render('guest/pages/login',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        } catch (err) {
            console.log(err);
        }
    }
    
    static register = async(req,res) => {
        try {
            res.render('guest/pages/register')
        } catch (err) {
            console.log(err);
        }
    }
    
    static registerAsAdmin = async(req,res) => {
        try {
            res.render('guest/pages/registerAsAdmin')
        } catch (err) {
            console.log(err);
        }
    }
    
    static registerUser = async(req,res) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body

            if (firstName == '' || lastName == '' || email == '' || phone == '' || password == '') {
                res.status(400).json({ 'status': 'failed', 'message': 'All fields are required' })
            } else {
                const nameRegex = /^[a-zA-Z]+$/;
                const phoneRegex = /^[6-9]\d{9}$/;

                if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !phoneRegex.test(phone)) {
                    res.status(400).json({ 'status': 'failed', 'message': 'First and Last Name must be alphabets and Phone must be Number starts from 6-9 with 10 Digit length' })
                } else {
                    const isUserExistWithEmail = await UserModel.findOne({ email: email, role: 'user' })

                    if (isUserExistWithEmail) {
                        res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Email' })
                    } else {
                        const isUserExistWithPhone = await UserModel.findOne({ phone: phone, role: 'user' })

                        if (isUserExistWithPhone) {
                            res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Phone' })
                        } else {
                            const hashPassword = await bcrypt.hash(password,10)
        
                            const data = new UserModel({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                                password: hashPassword,
                                role: 'user',
                            })
                            const dataSaved = data.save()
                            
                            if (dataSaved) {
                                res.status(201).json({ 'status': 'success', 'message': 'You have registered successfully' })
                            } else {
                                res.status(400).json({ 'status': 'failed', 'message': 'Internal Server Error' })
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }
    
    static registerAdmin = async(req,res) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body

            if (firstName == '' || lastName == '' || email == '' || phone == '' || password == '') {
                res.status(400).json({ 'status': 'failed', 'message': 'All fields are required' })
            } else {
                const nameRegex = /^[a-zA-Z]+$/;
                const phoneRegex = /^[6-9]\d{9}$/;

                if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !phoneRegex.test(phone)) {
                    res.status(400).json({ 'status': 'failed', 'message': 'First and Last Name must be alphabets and Phone must be Number starts from 6-9 with 10 Digit length' })
                } else {
                    const isUserExistWithEmail = await UserModel.findOne({ email: email, role: 'admin' })

                    if (isUserExistWithEmail) {
                        res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Email' })
                    } else {
                        const isUserExistWithPhone = await UserModel.findOne({ phone: phone, role: 'admin' })

                        if (isUserExistWithPhone) {
                            res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Phone' })
                        } else {
                            const hashPassword = await bcrypt.hash(password,10)
        
                            const data = new UserModel({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                                password: hashPassword,
                                role: 'admin',
                            })
                            const dataSaved = data.save()
                            
                            if (dataSaved) {
                                res.status(201).json({ 'status': 'success', 'message': 'You have registered successfully' })
                            } else {
                                res.status(400).json({ 'status': 'failed', 'message': 'Internal Server Error' })
                            }
                        }
                    }
                }
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    static loginVerify = async(req,res) => {
        const previousUrl = req.get('Referer');
        try{
            const {email, password} = req.body
            if (email && password) {
                var user = await UserModel.findOne({email : email})
                if (user != null) {
                    const isMatched = await bcrypt.compare(password,user.password)
                    const hashedPass = await bcrypt.hash(password,10)
                    console.log(hashedPass);
                    console.log(user.password);
                    console.log(isMatched);
                    if ((user.email === email) && isMatched) {
                        const token = jwt.sign({ userId: user._id }, 'myProblemsJWTToken');

                        if (user.isDeleted == 0) {
                            res.cookie('jwt',token)

                            if (user.role == 'admin') {
                                res.redirect('/admin/dashboard')
                            }
                            if (user.role == 'authority') {
                                res.redirect('/authority/dashboard')
                            }
                            if (user.role == 'user') {
                                res.redirect('/user/dashboard')
                            }
                        } else {
                            res.clearCookie('jwt')
                            req.flash('error','User no longer Active !')
                            res.redirect(previousUrl);
                        }
                    } else {
                        req.flash('error','Email and Password is not valid !')
                        res.redirect(previousUrl);
                    }
                } else {
                    req.flash('error','You are not registered user !')
                    res.redirect(previousUrl);
                }
            } else {
                req.flash('error','All Fields are required !')
                res.redirect(previousUrl);
            }
        }catch(err){
            console.log(err)
        }
    }

    static forgetPassword = async(req,res) => {
        try {
            res.render('guest/pages/forgetPassword',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        } catch (err) {
            console.log(err);
        }
    }

    static findUser = async(req,res) => {
        const previousUrl = req.get('Referer');
        try{
            const { email } = req.body

            const userFound = await UserModel.findOne({ email: email })

            if(userFound){ 

                const isTokenExist = await TokenModel.find()

                if(isTokenExist){
                    await TokenModel.deleteMany({})

                    var token = await new TokenModel({
                        email: email,
                        token: Math.floor(100000 + Math.random() * 900000),
                    }).save();
                }else{
                    var token = await new TokenModel({
                        email: email,
                        token: Math.floor(100000 + Math.random() * 900000),
                    }).save();
                }

                if(token){
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        host: "smtp.gmail.com",
                        // port: 587,
                        port: 465,
                        auth: {
                            user: 'arclightdevelopmentsolutions@gmail.com',
                            pass: 'ovvjhpaukdbokznd'
                        },
                    });
    
                    let info = await transporter.sendMail({
                        from: '"ArcLight Development Solutions Pvt Ltd" <arclightdevelopmentsolutions@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: "Email Verification for Forget Password", // Subject line
                        text: `Hello ${email}`, // plain text body
                        html: `<b>Hello ${email}, Your Forget Password Verification Code is ${token.token}</b>`, // html body
                    });

                    if(info){
                        console.log("Message sent: %s", info.messageId);
                        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                        req.flash('succMsg','OTP Sent, Please check Email !')
                        res.redirect('/otp-verification')
                    }else{
                        req.flash('error','Error, Unable to send OTP !')
                        res.redirect(previousUrl)
                    }
                }else{
                    req.flash('error','Error !')
                    res.redirect(previousUrl)
                }
            }else{
                req.flash('error','Email not update !')
                res.redirect(previousUrl)
            }
        }catch(err){
            console.log(err)
        }
    }
   
    static otpVerification = async(req,res) => {
        try {
            res.render('guest/pages/otpVerification',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        } catch (err) {
            console.log(err);
        }
    }

    static verifyOTP =  async(req,res) => {
        const previousUrl = req.get('Referer');
        try{
            const { token } = req.body

            const isOTPExist = await TokenModel.findOne({ token: token })

            if(isOTPExist){
                req.flash('succMsg','User Verified !')
                res.redirect('/reset-password')
            }else{
                req.flash('error','Invalid OTP, Please Enter Correct OTP !')
                res.redirect(previousUrl)
            }
        }catch(err){
            console.log(err)
        }
    }
   
    static resetPassword = async(req,res) => {
        try {
            res.render('guest/pages/resetPassword',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        } catch (err) {
            console.log(err);
        }
    }

    static changePassword = async(req,res) => {
        const previousUrl = req.get('Referer');
        try{
            const { password, conPassword } = req.body

            if(password !== conPassword){
                req.flash('error','Password does not match !')
                res.redirect(previousUrl)
            }else{
                const hashPassword = await bcrypt.hash(password,10)
                const user = await UserModel.updateOne({}, { $set: {password: hashPassword}})

                if(user){
                    const checkTokenData = await TokenModel.findOne()
                    await TokenModel.deleteOne({ token: checkTokenData.token })
                    req.flash('succMsg','Password Changed Successfully, Please Login !')
                    res.redirect('/')
                }else{
                    req.flash('error','Error, Password did not update !')
                    res.redirect(previousUrl)
                }
            }
        }catch(err){
            console.log(err)
        }
    }

    static logout = async(req,res) => {
        try{
            res.clearCookie('jwt')
            res.redirect('/')
        }catch(err){
            console.log(err)
        }
    }

}
module.exports = FrontController