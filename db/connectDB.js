const mongoose = require('mongoose')
const liveUrl = 'mongodb+srv://ankurshrivastava121095:IgjfB6kQVZew6eLI@cluster0.xjnd8j7.mongodb.net/ankurShrivastava?retryWrites=true&w=majority'
const localUrl = 'mongodb://0.0.0.0:27017/myProblemsDB'

const connectDB = () => {
    return mongoose.connect(localUrl)
    // return mongoose.connect(url)
    .then(()=>{
        console.log("Connection Successfully !")
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = connectDB