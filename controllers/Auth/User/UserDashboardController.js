class UserDashboardController {

    static dashboard = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'user') {
                const data = {firstName, lastName, email, _id, phone, role}
                res.render('user/pages/dashboard', { data })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

}
module.exports = UserDashboardController