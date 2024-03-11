class AuthorityDashboardController {

    static dashboard = async(req,res) => {
        const previousUrl = req.get('Referer');
        try {
            const {firstName, lastName, email, _id, phone, role} = req.data

            if (role == 'authority') {
                const data = {firstName, lastName, email, _id, phone, role}
                res.render('authority/pages/dashboard', { data })
            } else {
                res.redirect(previousUrl);
            }
        } catch (err) {
            console.log(err); 
        }
    }

}
module.exports = AuthorityDashboardController