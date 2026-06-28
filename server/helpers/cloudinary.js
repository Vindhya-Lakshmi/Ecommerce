
const cloudinary = require('cloudinary').v2;
const multer  = require('multer')

cloudinary.config({
    cloud_name : 'djrhr3mvx',
    api_key : '123878873242332',
    api_secret : '**********',

});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto'
    })

    return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil }