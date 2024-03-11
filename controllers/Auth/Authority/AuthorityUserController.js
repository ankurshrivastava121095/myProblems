const UserModel = require("../../../models/User");

class AuthorityUserController {

    static allUsers = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'authority') {
                const users = await UserModel.find({ role: 'user' }).sort({ _id: -1 })
                const data = {firstName, lastName, email, _id, phone, role}

                res.render('authority/pages/allUsers', { data, users, succMessage : req.flash('succMsg'), errMsg : req.flash('error') })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err);   
        }
    }

}
module.exports = AuthorityUserController