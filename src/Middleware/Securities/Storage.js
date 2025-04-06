import multer from "multer";


const saveImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./public/uploads')
    },
    filename: (req, file, cb) => {
        if (file !== null) {
            const ext = file.originalname.split('.').pop()
            cb(null, Date.now() + '.' + ext)
        }
    }
})

const filterImage = (req, file, cb) => {
    if(file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

export const upImage = multer({ storage: saveImage, fileFilter: filterImage})