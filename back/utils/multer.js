const multer = require('multer')

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: (req, file, cb)=> {
    cb(null, './uploads')
  }, 
    filename: (req, file, cb) => {
      console.log(file);
        cb(null, Date.now() + '-' + file.originalname)
          // file.fieldname is name of the field (image)
          // path.extname get the uploaded file extension
  }
});

const upload = multer({
  storage: imageStorage,
  limits: { fileSize: 1024*1024 },
  fileFilter(req, file, cb){
    if(file.mimetype === 'image/jpeg' || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
     cb(null, true)
    }else{

      cb({message: "format invalid"}, false)
    }
  }
})
module.exports =  upload

// const multer = require('multer')
// const path = require('path')
// //Multer config
// module.exports = multer({
//   storage: multer.diskStorage({}),
//   fileFilter: (req, file, cb) =>{
//     let ext = path.extname(file.originalname);
//     if(ext !== '.jpg' && ext !== '.png' && ext !== ".jpeg"){
//       cb(new Error("file type is not  supportd"), false);
//       return
//     }
//     cb(null, true)
//   }
// })
