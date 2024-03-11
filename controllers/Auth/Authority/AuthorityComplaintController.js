const ComplaintModel = require("../../../models/Complaint")
const UserModel = require("../../../models/User")

class AuthorityComplaintController{

    static showComplaints = async(req,res) => {
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'authority') {
                const data = {firstName, lastName, email, _id, phone, role}
                const newComplaints = await ComplaintModel.find({ acceptedByAuthorityId: null }).sort({ _id: -1 })
                const acceptedComplaints = await ComplaintModel.find({ acceptedByAuthorityId: _id }).sort({ _id: -1 })
                res.render('authority/pages/showComplaints', { data, newComplaints, acceptedComplaints })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);
        }
    }

    static requestDetail = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'authority') {
                const complaint = await ComplaintModel.findById(req.params.id)
                const userData = await UserModel.findOne({ _id: complaint.userId })

                const data = {firstName, lastName, email, _id, phone, role}
                res.render('authority/pages/requestDetail', { data, complaint, userData, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    static changeStatus = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'authority') {
                const { status } = req.body
                const complaint = await ComplaintModel.findByIdAndUpdate(req.params.id, {
                    status: status,
                    acceptedByAuthorityId: _id
                })

                req.flash('succMsg','Status Changed Successfully !')
                res.redirect(previousUrl)
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

}
module.exports = AuthorityComplaintController