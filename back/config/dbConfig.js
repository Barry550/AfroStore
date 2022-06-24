const mongoose = require('mongoose')

mongoose.connect(
  'mongodb+srv://doumans:doums6059@cluster0.o1z0f.mongodb.net/shopping'
 ,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
  },
).then(res => console.log("mongodb connected "))
 .catch(err => console.log(err))