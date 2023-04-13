const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(path.join(__dirname, '..', 'uploads', req.path))) {
            fs.mkdirSync(path.join(__dirname, '..', 'uploads', req.path))
        }

        cb(null, `uploads${req.path}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    },
})

const upload = multer({ storage: storage })

module.exports = upload
