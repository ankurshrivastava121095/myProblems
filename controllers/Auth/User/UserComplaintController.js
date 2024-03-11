const ComplaintModel = require('../../../models/Complaint');

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: 'depjzfj9a', 
    api_key: '489915939841262', 
    api_secret: '5tBdTUHJ33XMIN3iP-49Rfeps9I',
    // secure: true
});

class UserComplaintController {

    static registerNewComplaint = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'user') {
                const data = {firstName, lastName, email, _id, phone, role}
                res.render('user/pages/registerNewComplaint', { data })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    static trackComplaint = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'user') {
                const complaints = await ComplaintModel.find({ userId: _id }).sort({ _id: -1 })

                const data = {firstName, lastName, email, _id, phone, role}
                res.render('user/pages/trackComplaint', { data, complaints })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    static store = async(req,res) => {
        try {
            const { title, description, address } = req.body
            const { _id } = req.data
            const file = req.files.problemImage

            if (title == '' || description == '' || address == '' || file == null) {
                res.status(400).json({ 'status': 'failed', 'message': `All Fields are Required` })
            } else {
                const problemImage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'myProblems',
                });

                const data = new ComplaintModel({
                    title: title,
                    description: description,
                    address: address,
                    problemImage: {
                        public_id: problemImage.public_id,
                        url: problemImage.secure_url,
                    },
                    status: 'Pending',
                    userId: _id,
                    acceptedByAuthorityId: null,
                    resolvedDate: null
                })
                const dataSaved = data.save()

                if (dataSaved) {
                    res.status(201).json({ 'status': 'success', 'message': 'Your Complaint has been Registered Successfully We will get in touch you soon.' })
                } else {
                    res.status(400).json({ 'status': 'failed', 'message': 'Internal Server Error' })
                }
            }
        } catch (err) {
            res.status(400).json({ 'status': 'failed', 'message': `Error: ${err}` })
        }
    }

    static fetchAll = async(req,res) => {
        try {
            const { _id } = req.data

            const data = await ComplaintModel.find({ userId: _id }).sort({ _id: -1 })

            res.status(201).json({
                success: true,
                data
            })
        } catch (err) {
            res.status(400).json({ 'status': 'failed', 'message': `Error: ${err}` })
        }
    }

    static complaintDetail = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'user') {
                const complaint = await ComplaintModel.findById(req.params.id)

                const data = {firstName, lastName, email, _id, phone, role}
                res.render('user/pages/complaintDetail', { data, complaint })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

}
module.exports = UserComplaintController