// Import các file khác
const configServer = require('./configs/configServer');
const getAllRouter = require('./router/webRouter');
// Import thư viện
const express = require('express');
const app = express();

// PORT
const PORT = process.env.PORT || 3000;

// Moudle cấu hình
const upload = configServer(app, __dirname);

// Lấy All Router
getAllRouter(app, upload);

// Listen PORT
app.listen(PORT, () => {
    console.log('Listen on PORT: ' + PORT);
})

