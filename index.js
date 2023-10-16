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

app.get("/aes", function (req, res) {
    res.render("partials/aes.ejs");
});

app.get("/rsa", function (req, res) {
    res.render("partials/rsa.ejs");
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

//thuật toán des
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


//thuật toán aes
const thuattoan = "aes-256-cbc";
const iv = crypto.randomBytes(16); //tao chuoi ngau nhien
const encryptionKey = crypto.randomBytes(32); //tao key

app.post("/post-thuat-toan-aes", (req, res) => {
    const inputData = req.body.dulieu;
    //ham ma hoa dung thuat toan AES
    let cipher = crypto.createCipheriv(thuattoan, encryptionKey, iv);
    let encryptedData = cipher.update(inputData, "utf8", "hex");
    encryptedData += cipher.final("hex");
    res.send(encryptedData);
});

app.post("/post-thuat-toan-aes-decrypt", (req, res) => {
    const inputData = req.body.dulieugiaima;
    //ham giải mã dung thuat toan AES
    let decipher = crypto.createDecipheriv(thuattoan, encryptionKey, iv);
    let decryptedData = decipher.update(inputData, "hex", "utf8");
    decryptedData += decipher.final("utf8");
    res.send(decryptedData);
});

// Một số biến để lưu trữ khóa, bạn có thể lưu vào tệp hoặc hệ thống quản lý khóa an toàn
let publicKey = null;
let privateKey = null;

app.post("/post-generate-pair-key", (req, res) => {
    // Tạo khóa RSA và lưu trữ chúng một cách an toàn
    const { publicKey: pubKey, privateKey: privKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });

    publicKey = pubKey;
    privateKey = privKey;

    // Chuyển đổi khóa sang chuỗi PEM format
    const publicKeyPEM = publicKey.export({ type: 'spki', format: 'pem' });
    const privateKeyPEM = privateKey.export({ type: 'pkcs8', format: 'pem' });

    res.json({ publicKey: publicKeyPEM, privateKey: privateKeyPEM });
});

app.post("/post-thuat-toan-rsa", (req, res) => {
    const inputData = req.body.dulieu;

    if (!publicKey) {
        return res.status(400).json({ error: "Không tìm thấy khóa công khai." });
    }

    const encryptedData = crypto.publicEncrypt(
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(inputData)
    );

    res.send(encryptedData.toString("base64"));
});

app.post("/post-thuat-toan-rsa-decrypt", (req, res) => {
    const inputData2 = req.body.dulieugiaima;
    const inputData = req.body.dulieu;

    if (!privateKey) {
        return res.status(400).json({ error: "Không tìm thấy khóa riêng tư." });
    }

    const encryptedData = Buffer.from(inputData2, "base64");

    const decryptedData = crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        encryptedData
    );

    res.send(decryptedData.toString());
});
