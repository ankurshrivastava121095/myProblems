const ComplaintModel = require("../../../models/Complaint");
const UserModel = require("../../../models/User");
const bcrypt = require('bcrypt');

class AdminAuthorityController {

    static add = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const data = {firstName, lastName, email, _id, phone, role}
                res.render('admin/pages/addNewAuthority', {data})
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    static edit = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const data = {firstName, lastName, email, _id, phone, role}
                const authority = await UserModel.findById(req.params.id)
                res.render('admin/pages/editAuthority', {data, authority})
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    static store = async(req,res) => {
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
                    const isUserExistWithEmail = await UserModel.findOne({ email: email, role: 'authority' })

                    if (isUserExistWithEmail) {
                        res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Email' })
                    } else {
                        const isUserExistWithPhone = await UserModel.findOne({ phone: phone, role: 'authority' })

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
                                role: 'authority',
                            })
                            const dataSaved = data.save()
                            
                            if (dataSaved) {
                                res.status(201).json({ 'status': 'success', 'message': 'New Authority Registered successfully' })
                            } else {
                                res.status(400).json({ 'status': 'failed', 'message': 'Internal Server Error' })
                            }
                        }
                    }
                }
            }
        } catch (err) {
            res.status(400).json({ 'status': 'failed', 'message': `Error: ${err}` })
        }
    }
    
    static update = async(req,res) => {
        try {
            const { firstName, lastName, email, phone } = req.body

            if (firstName == '' || lastName == '' || email == '' || phone == '') {
                res.status(400).json({ 'status': 'failed', 'message': 'All fields are required' })
            } else {
                const nameRegex = /^[a-zA-Z]+$/;
                const phoneRegex = /^[6-9]\d{9}$/;

                if (!nameRegex.test(firstName) || !nameRegex.test(lastName) || !phoneRegex.test(phone)) {
                    res.status(400).json({ 'status': 'failed', 'message': 'First and Last Name must be alphabets and Phone must be Number starts from 6-9 with 10 Digit length' })
                } else {
                    const isUserExistWithEmail = await UserModel.findOne({ 
                        email: email, 
                        role: 'authority', 
                        _id: { $ne: req.params.id } 
                    });

                    if (isUserExistWithEmail) {
                        res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Email' })
                    } else {
                        const isUserExistWithPhone = await UserModel.findOne({ 
                            phone: phone, 
                            role: 'authority', 
                            _id: { $ne: req.params.id } 
                        });

                        if (isUserExistWithPhone) {
                            res.status(400).json({ 'status': 'failed', 'message': 'User Already Exist with this Phone' })
                        } else {
        
                            const data = await UserModel.findByIdAndUpdate(req.params.id, {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                phone: phone,
                            })
                            
                            if (data) {
                                res.status(201).json({ 'status': 'success', 'message': 'Authority Details Updated successfully' })
                            } else {
                                res.status(400).json({ 'status': 'failed', 'message': 'Internal Server Error' })
                            }
                        }
                    }
                }
            }
        } catch (err) {
            res.status(400).json({ 'status': 'failed', 'message': `Error: ${err}` })
        }
    }

    static allAuthorities = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const authorities = await UserModel.find({ role: 'authority' }).sort({ _id: -1 })
                const data = {firstName, lastName, email, _id, phone, role}

                res.render('admin/pages/allAuthorities', { data, authorities, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);   
        }
    }

    static singleAuthorityWork = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const complaints = await ComplaintModel.find({ acceptedByAuthorityId: req.params.id }).sort({ _id: -1 })
                const data = {firstName, lastName, email, _id, phone, role}

                res.render('admin/pages/singleAuthorityWork', { data, complaints, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);   
        }
    }

}
module.exports = AdminAuthorityController