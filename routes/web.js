const express = require('express')
const FrontController = require('../controllers/Guest/FrontController')
const AdminDashboardController = require('../controllers/Auth/Admin/AdminDashboardController')
const Auth = require('../middleware/Auth')
const GuestAuth = require('../middleware/GuestAuth')
const UserDashboardController = require('../controllers/Auth/User/UserDashboardController')
const UserComplaintController = require('../controllers/Auth/User/UserComplaintController')
const AdminComplaintController = require('../controllers/Auth/Admin/AdminComplaintController')
const AdminAuthorityController = require('../controllers/Auth/Admin/AdminAuthorityController')
const AdminUserController = require('../controllers/Auth/Admin/AdminUserController')
const AuthorityDashboardController = require('../controllers/Auth/Authority/AuthorityDashboardController')
const AuthorityComplaintController = require('../controllers/Auth/Authority/AuthorityComplaintController')
const AuthorityUserController = require('../controllers/Auth/Authority/AuthorityUserController')
const router = express.Router()





// FrontController
router.get('/',GuestAuth,FrontController.login)
router.post('/login-verify',GuestAuth,FrontController.loginVerify)
router.get('/register',GuestAuth,FrontController.register)
router.get('/admin/register-as-admin',GuestAuth,FrontController.registerAsAdmin)
router.post('/register-user',GuestAuth,FrontController.registerUser)
router.post('/register-admin',GuestAuth,FrontController.registerAdmin)
router.get('/logout',FrontController.logout)
router.get('/forget-password',FrontController.forgetPassword)
router.post('/find-user',FrontController.findUser)
router.get('/otp-verification',FrontController.otpVerification)
router.post('/verify-otp',FrontController.verifyOTP)
router.get('/reset-password',FrontController.resetPassword)
router.post('/change-password',FrontController.changePassword)





// Admin/AdminDashboardController
router.get('/admin/dashboard',Auth,AdminDashboardController.dashboard)
// Admin/AdminComplaintController
router.get('/admin/submitted-request',Auth,AdminComplaintController.submittedRequest)
router.get('/admin/request-detail/:id',Auth,AdminComplaintController.requestDetail)
router.post('/admin/change-complaint-status/:id',Auth,AdminComplaintController.changeStatus)
// Admin/AdminAuthorityController
router.get('/admin/add-authority',Auth,AdminAuthorityController.add)
router.get('/admin/edit-authority/:id',Auth,AdminAuthorityController.edit)
router.post('/admin/store-authority',Auth,AdminAuthorityController.store)
router.post('/admin/update-authority/:id',Auth,AdminAuthorityController.update)
router.get('/admin/authority',Auth,AdminAuthorityController.allAuthorities)
router.get('/admin/single-authority-work/:id',Auth,AdminAuthorityController.singleAuthorityWork)
// Admin/AdminUserController
router.get('/admin/users',Auth,AdminUserController.allUsers)
router.get('/admin/single-user-complaints/:id',Auth,AdminUserController.singleUserComplaints)






// Authority/AuthorityDashboardController
router.get('/authority/dashboard',Auth,AuthorityDashboardController.dashboard)
// Authority/AuthorityComplaintController
router.get('/authority/show-complaints',Auth,AuthorityComplaintController.showComplaints)
router.get('/authority/request-detail/:id',Auth,AuthorityComplaintController.requestDetail)
router.post('/authority/change-complaint-status/:id',Auth,AuthorityComplaintController.changeStatus)
// Authority/AuthorityUserController
router.get('/authority/users',Auth,AuthorityUserController.allUsers)






// User/UserDashboardController
router.get('/user/dashboard',Auth,UserDashboardController.dashboard)
// User/UserComplaintController
router.get('/user/register-new-complaint',Auth,UserComplaintController.registerNewComplaint)
router.post('/user/store-complaint',Auth,UserComplaintController.store)
router.get('/user/track-complaint',Auth,UserComplaintController.trackComplaint)
router.get('/user/fetch-complaints',Auth,UserComplaintController.fetchAll)
router.get('/user/complaint-detail/:id',Auth,UserComplaintController.complaintDetail)

module.exports = router