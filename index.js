var express = require("express");
var app = express();
var port = 5000;
var expressLayouts = require("express-ejs-layouts"); // Gọi thư viện layout
var nodemailer = require("nodemailer"); // Gọi thư viện nodemailer
var crypto = require("crypto"); // Gọi thư viện crypto

app.use(express.static("public"));
app.set("view engine", "ejs"); // Khai bao file co duoi mở rộng ejs
app.set("views", "./views"); // Set thư mục view
app.use(expressLayouts); // Sẽ chạy trang có tên layout
app.use(express.json()); // Đuôi mở rộng ejs
app.use(express.urlencoded({ extended: true }) // Thư mục views
);
app.listen(port);

app.get("/", function (req, res) {
    res.render("trangchu");
});

// Đường dẫn trang giới thiệu
app.get("/gioi-thieu", function (req, res) {
    res.render("gioithieu");
});

app.get("/des", function (req, res) {
    res.render("partials/des.ejs");
});

app.get("/email", function (req, res) {
    res.render("partials/email");
});

app.post("/post-email", function (req, res) {
    // Cài đặt email
    var option = {
        service: 'gmail', // Dùng Gmail
        auth: {
            user: 'pipclupnomad@gmail.com',
            pass: 'zuad vtqu kyap ovte'
        }
    };
    var transporter = nodemailer.createTransport(option);
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Kết nối thành công");
        }
    });
    var mail = {
        from: req.body.emailgui,
        to: req.body.emailnhan,
        subject: req.body.chude,
        html: req.body.noidung,
    };

    transporter.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });

    res.redirect("/email");
});

app.post("/post-thuat-toan-des", (req, res) => {
    const inputData = req.body.dulieu;
    const key = Buffer.from("jhsgatt12sgsssqswhwqfsaxasxuasxs", "base64");

    // Mã hóa dữ liệu
    const encrypt = crypto.createCipheriv("des-ede3", key, null);
    let encryptedData = encrypt.update(inputData, "utf8", "base64");
    encryptedData += encrypt.final("base64");

    res.send(encryptedData);
});

app.post("/post-thuat-toan-des-decrypt", (req, res) => {
    const inputData = req.body.dulieugiaima;
    const key = Buffer.from("jhsgatt12sgsssqswhwqfsaxasxuasxs", "base64");

    // Giải mã dữ liệu
    const decrypt = crypto.createDecipheriv("des-ede3", key, null);
    let decryptedData = decrypt.update(inputData, "base64", "utf8");
    decryptedData += decrypt.final("utf8");

    res.send(decryptedData);
});
