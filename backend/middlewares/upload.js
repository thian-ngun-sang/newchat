const multer = require('multer');
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(req.originalUrl === "/api/v1/user/update/profile-image"){
            cb(null, 'media/user/profileImages');
        }else if(req.originalUrl === "/api/v1/user/update/cover-image"){
            cb(null, 'media/user/coverImages');
        }else{
            cb(null, 'media/');
        }
        // console.log(req.originalUrl);
    },
    filename: function (req, file, cb) {
      crypto.randomBytes(16, (err, buf) => {
        if(err){
          return cb(err);
        }else{
          const uniqueFilename = buf.toString('hex') + "_" + file.originalname;
          cb(null, uniqueFilename);
        }
      })
    },
});

const upload = multer({ storage: storage });

module.exports = { upload };