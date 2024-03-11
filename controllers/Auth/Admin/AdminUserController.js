const ComplaintModel = require("../../../models/Complaint");
const UserModel = require("../../../models/User");

class AdminUserController {

    static allUsers = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const users = await UserModel.find({ role: 'user' }).sort({ _id: -1 })
                const data = {firstName, lastName, email, _id, phone, role}

                res.render('admin/pages/allUsers', { data, users, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);   
        }
    }

    static singleUserComplaints = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const complaints = await ComplaintModel.find({ userId: req.params.id }).sort({ _id: -1 })
                const data = {firstName, lastName, email, _id, phone, role}

                res.render('admin/pages/singleUserComplaints', { data, complaints, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);   
        }
    }

}
module.exports = AdminUserController