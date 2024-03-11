const ComplaintModel = require("../../../models/Complaint");
const UserModel = require("../../../models/User");

class AdminAuthorityController {

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