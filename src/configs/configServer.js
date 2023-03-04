// Import các thư viện
const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const multer = require('multer');

const configServer = (app, localDir) => {
    // Config cho file env
    require('dotenv').config();

    // Sử dụng body-parser middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Config cho session
    app.use(
        session({
            secret: "secret-key",
            resave: false,
            saveUninitialized: true,
        })
    );
    
    // Config cho view engine
    app.engine(
        "handlebars",
        exphbs.create({
            defaultLayout: "main",
            extname: ".handlebars",
            layoutsDir: path.join(localDir, "views/layouts"),
            helpers: {
                toJSON: function (object) {
                    return encodeURIComponent(JSON.stringify(object));
                },
                enCode: function (object) {
                    return encodeURIComponent(object);
                }
            }
        }).engine
    );

    // Set view engine
    app.set("view engine", "handlebars");

    // Set path views
    app.set('views', path.join(localDir, '/views'));

    // Set public file
    app.use(express.static(path.join(localDir, 'public')));

    // Cấu hình lưu trữ file
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Thư mục để lưu file upload
            cb(null, './src/public/img');
        },
        filename: function (req, file, cb) {
            // Đặt tên file là tên file gốc
            cb(null,Date.now() + path.extname(file.originalname));
        }
    });

    // Cấu hình kiểm tra file upload
    const upload = multer({
        storage: storage,
        // Giới hạn kích thước tối đa cho một file upload
        limits: { fileSize: 1000000000 }, 
        fileFilter: function (req, file, cb) {
            // Chỉ cho phép upload file định dạng .jpeg hoặc .png
            const filetypes = /jpeg|jpg|png/;
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);

            if (mimetype && extname) {
                return cb(null, true);
            } else {
                cb('Error: Chỉ cho phép upload file định dạng .jpeg hoặc .png');
            }
        }
    });

    return upload;
}

// Exports file
module.exports = configServer;