// Import thư viện cần thiết
const fs = require('fs');

// Data
let products = [
    { id: 1, name: 'iPhone XS', price: '1,199', img: 'img/xs.png', info: 'Màn hình iPhone XS có kích thước 5.8 inches độ phân giải 1125 x 2436 pixels tấm nền Super AMOLED mang đến khả năng hiển thị sắc nét, màu sắc sống động. Con chip Apple A12 Bionic đươc sản xuất trên tiến trình 7 nm mang đến nhiều giá trị về trải nghiệm giải trí của người dùng.' },
    { id: 2, name: 'iPhone 12 Pro', price: '1,399', img: 'img/12.png', info: 'Theo những thông tin từ Apple, iPhone 12 series sẽ được cho ra mắt với 4 phiên bản chính là iPhone 12 Mini, iPhone 12, 12 Pro và 12 Pro Max. iPhone 12 sẽ được Apple cải tiến về thiết kế lẫn tính năng để mang đến một series smartphone tuyệt vời hơn cho người dùng như màn hình OLED, kết nối 5G được hỗ trợ,….' },
    { id: 3, name: 'Macbook Pro 14', price: '1,299', img: 'img/mac.jpg', info: 'Apple đã mang đến một lựa chọn màn hình 14 inch hoàn toàn mới trên chiếc MacBook Pro 14 inch 2021, một sản phẩm chuyên nghiệp với thiết kế di động hoàn hảo. Màn hình 14 inch đủ lớn để hiển thị tốt các nội dung trong công việc, đồng thời thiết kế viền siêu mỏng giúp MacBook Pro 14 thậm chí còn nhỏ gọn hơn các mẫu MacBook Pro 13 inch trước đây.' },
]

// Các Biến dùng cho mục đích ẩn hiện toast
let failLogin = false;
let addSuccess = false;
let editSuccess = false;
let delSuccess = false;

let getHome = (req, res) => {
    // Kiểm tra nếu chưa đăng nhập thì chuyển qua page /login
    if (req.session.isLogined) {
        res.render('home', {
            products: products,
            addSuccess: addSuccess,
            editSuccess: editSuccess,
            delSuccess: delSuccess
        });

        // Reset toast của các Biến Toast về false
        addSuccess = false;
        editSuccess = false;
        delSuccess = false;
    } else res.redirect('/login');
}

let getLogin = (req, res) => {
    // Trường hợp cố tình vào viết /login
    if (req.session.isLogined) {
        res.redirect('/');
    } else {
        // Render giao diện login và tham số cho Toast nếu đăng nhập không đúng
        res.render('login', {
            failLogin: failLogin
        });

        // Reset value
        failLogin = false;
    }
}

let getActionOnLogin = (req, res) => {
    // Nếu sai hiện Toast và quay về Login
    if (req.body.user === process.env.USER && req.body.pass === process.env.PASSWORD) {
        // Tạo tham số để kiểm tra đăng nhập khi về trang home
        req.session.isLogined = true;
        res.redirect('/');
    } else {
        failLogin = true;
        res.redirect(`/login`);
    }
    res.end();
}

let getLogOut = (req, res) => {
    // Xoá key session
    delete req.session.isLogined;
    res.redirect('/');
}

let getDetailById = (req, res) => {
    // Convert thành số nguyên
    const id = parseInt(req.params.id);

    // Tìm kiếm theo id
    let product = products.find((item) => {
        return item.id === id;
    })

    // Render ra trang detail và đưa vào sản phảm như id đã tìm kiếm
    res.render('detail', {
        product: product
    });
}

let getAddPost = (req, res) => {
    // Xử lý việc toạ một object product mới
    let newProduct = {
        id: products.length < 1 ? 1 : products[products.length - 1].id + 1,
        name: req.body.name,
        price: parseInt(req.body.price).toLocaleString(),
        info: req.body.des,
        img: req.file.path.split("public\\")[1]
    }

    // Thêm vào products
    products.push(newProduct);

    // Toast show của ADD được hiển thị
    addSuccess = true;

    res.redirect('/');
}

let getEditPost = (req, res) => {
    // Chuyển id về int
    const id = parseInt(req.body.id);

    // Tìm kiếm id phù hợp (không xét case ko tìm thấy vì trang home đã loại trừ bởi giao diện)
    let product = products.find((item) => {
        return item.id === id;
    })

    // Thay thế thông số
    product.name = req.body.name;
    product.price = parseInt(req.body.price).toLocaleString();
    product.info = req.body.des;

    // Nếu tồn tại ảnh thay thế
    if(req.file) {
        // Xoá ảnh cũ
        fs.unlink('./src/public/' + product.img, (err) => {
            if (err) throw err;
        });

        // Gán ảnh mới
        product.img = req.file.path.split("public\\")[1];
    }

    // Toast show của Edit được hiển thị
    editSuccess = true;
    
    res.redirect('/');
}

let getDelPost = (req, res) => {
    // Xoá object
    products = products.filter((obj) => obj.id != req.body.id);

    // Xoá ảnh cũ
    fs.unlink('./src/public/' + req.body.img, (err) => {
        if (err) throw err;
    });

    // Toast show của Del được hiển thị
    delSuccess = true;

    res.end();
}

// Exports các module
module.exports = {
    getHome, getLogin, getActionOnLogin, getDetailById, getAddPost, getEditPost, getDelPost, getLogOut
}