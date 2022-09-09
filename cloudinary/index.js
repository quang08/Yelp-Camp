//import (docs)
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//config Cloudinary SDK: Set up Cloudinary with our Credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

//create a new instance of CloudinaryStorage (docs): configure Cloudinary's storage
const storage = new CloudinaryStorage({
    cloudinary, //pass in the credentials we just configured
    params:{
        folder: 'YelpCamp', //specify the folder 
        allowedFormats: ['jpeg', 'png', 'jpg'] //specify allowed formats
    }
})

  

module.exports = {
    cloudinary,
    storage,
}