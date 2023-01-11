const multer = require("multer");

//Storage Setting
const storage = multer.diskStorage({
    destination:'./public/images/categoryimage', //directory (folder) setting
    filename:(req, file, cb)=>{
        cb(null, Date.now()+file.originalname) // file name setting
    }
  })
  
  //Upload Setting
  const upload = multer({
    storage: storage,
    fileFilter:(req, file, cb)=>{
     if(
         file.mimetype == 'image/jpeg' ||
         file.mimetype == 'image/jpg' ||
         file.mimetype == 'image/png' ||
         file.mimetype == 'image/gif' ||
         file.mimetype == 'image/webp'
  
     ){
         cb(null, true)
     }
     else{
         cb(null, false);
         cb(new Error('Only jpeg,  jpg , png, and gif Image allow'))
     }
    }
  })

module.exports = upload;