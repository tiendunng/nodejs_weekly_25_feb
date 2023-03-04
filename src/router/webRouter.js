// Import file và các thư viện
const getAllModule = require('../controller/moduleController');
const express = require('express');
let router = express.Router();

const getAllRouter = (app, upload) => {
    // Trang home
    router.get('/', getAllModule.getHome);

    // Trang login
    router.get('/login', getAllModule.getLogin);

    // Check thông tin đăng nhập
    router.post('/action', getAllModule.getActionOnLogin);

    // Đăng xuất hệ thống
    router.get('/logout', getAllModule.getLogOut);

    // Chỉ nhận endpoint là giá trị nguyên
    router.get('/:id(\\d+)', getAllModule.getDetailById);

    // Render ra trang form khi nhận được endpoint là add
    router.get('/add', (req, res) => {
        res.render('form');
    })

    // Endpoint add với method POST
    router.post('/add', upload.single('image'), getAllModule.getAddPost);

    // Endpoint edit với method POST
    router.post('/edit', upload.single('image'), getAllModule.getEditPost);

    // Endpoint delete với method POST
    router.post('/delete', getAllModule.getDelPost);

    // Sử dụng tiền tố cho Router
    return app.use('/', router);
}

// Export all Router
module.exports = getAllRouter;