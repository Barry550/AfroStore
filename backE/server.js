require('./config/dbConfig')
require('dotenv').config({path:"./config/.env"})
const express = require('express')
const app = express()
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
  useTempFiles: true
}))

//user
app.use('/user', require('./routes/userRoute'))

//category
app.use('/api', require('./routes/categoryRoute'))

//upload
app.use('/api', require('./routes/upload'))

//product
app.use('/api', require('./routes/productRoute'))

//cart
app.use('/api', require('./routes/cartRoute'))


//command
app.use('/api', require('./routes/commandRoute'))

//paypal
app.use('/api', require('./routes/paymentRouter'))



const PORT = process.env.PORT
app.listen(PORT, ()=> console.log(`server on http://localhost:${PORT}`))