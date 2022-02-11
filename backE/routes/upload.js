const router = require('express').Router()
const cloudinary = require('cloudinary')
const fs = require('fs')
const authAdmin = require('../middleware/authAdmin')
const auth = require('../middleware/auth')


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

//upload image only admin can use
router.post('/upload', (req, res)=>{
  try {
    // console.log("file: ",req.files);
    console.log("Object: ",Object.keys(req.files).length);
    console.log("req.file: ",req.files)


    if(!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded')

      const file = req.files.file;

      if(file.size > 1024*1024*1024*1024*1024){
        removeTmp(file.tempFilePath)
        return res.json({msg: "La taille est trop grande"})
      } // if file.size > 1mb
      
      if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png'){
        removeTmp(file.tempFilePath)
        return res.json({msg: "Le format de fichier est incorrect"})  
      } 
      
      cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'maman'}, async(err, result)=>{
        try {
          if(err) throw err
          removeTmp(file.tempFilePath)
          res.json({
            public_id: result.public_id,
            url: result.secure_url
          })
        } catch (err) {
           return res.json({msg: 'ii'})
        }
      })

  } catch (err) {
      res.status(500).json({msg: "Aucun fichier n'a été téléchargé"})
  }
})

//delete image only admin can use
router.post('/destroy', (req, res)=>{
  try {
    const {public_id} = req.body
    if(!public_id)
      return res.status(400).json({msg: 'No images selected'})

    cloudinary.v2.uploader.destroy(public_id, async(err, result)=>{
      if(err) throw err

      res.json({msg: "Deleted Images"})
    })  
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
 
})

const removeTmp = (path) =>{
  fs.unlink(path, err =>{
    if(err) throw err
  })
}

module.exports = router
