const ComplaintModel = require('../../../models/Complaint');
const UserModel = require('../../../models/User');

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class AdminComplaintController {

    static submittedRequest = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'admin') {
                const complaints = await ComplaintModel.aggregate([
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'userData',
                        },
                    },
                    {
                        $unwind: '$userData',
                    },
                    {
                        $addFields: {
                            userId: '$_id',
                        },
                    },
                    {
                        $replaceRoot: { newRoot: { $mergeObjects: ['$userData', '$$ROOT'] }}
                    },
                    {
                        $project: {
                            'userData._id': 0,
                        },
                    },
                ]);

                const data = {firstName, lastName, email, _id, phone, role}
                res.render('admin/pages/submittedRequest', { data, complaints })
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

            if (role == 'admin') {
                const complaint = await ComplaintModel.findById(req.params.id)
                const userData = await UserModel.findOne({ _id: complaint.userId })

                const data = {firstName, lastName, email, _id, phone, role}
                res.render('admin/pages/requestDetail', { data, complaint, userData, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
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

            if (role == 'admin') {
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
module.exports = AdminComplaintController