const UserModel = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class FrontController {

    static login = async(req,res) => {
        try {
            res.render('guest/login',{succMessage : req.flash('succMsg'), errMsg : req.flash('error')})
        } catch (err) {
            console.log(err);
        }
    }
    
    static register = async(req,res) => {
        try {
            res.render('guest/register')
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
                    const isUserExistWithEmail = await UserModel.findOne({ email: email })

                    if (isUserExistWithEmail) {
                        res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Email' })
                    } else {
                        const isUserExistWithPhone = await UserModel.findOne({ phone: phone })

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

    static loginVerify = async(req,res) => {
        const previousUrl = req.get('Referer');
        try{
            const {email, password} = req.body
            if (email && password) {
                var user = await UserModel.findOne({email : email})
                if (user != null) {
                    const isMatched = await bcrypt.compare(password,user.password)
                    if ((user.email === email) && isMatched) {
                        const token = jwt.sign({ userId: user._id }, 'myProblemsJWTToken');

                        if (user.isDeleted == 0) {
                            res.cookie('jwt',token)

                            if (user.role == 'user') {
                                // res.redirect('/user/dashboard')
                                console.log('Logged In Successfully');
                            }
                            if (user.role == 'admin') {
                                res.redirect('/admin/dashboard')
                            }
                            if (user.role == 'authority') {
                                res.redirect('/authority/dashboard')
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

}
module.exports = FrontController