var express = require("express");
var app = express();
var port = 5000;
var expressLayouts = require("express-ejs-layouts"); //gọi thư viện layout
var nodemailer = require("nodemailer"); //gọi thư viện nodemailer

app.use(express.static("public"));
app.set("view engine", "ejs"); //khai bao file co duoi mở rộng ejs
app.set("views", "./views"); //set thư mục view
app.use(expressLayouts); //sẽ chạy trang có tên layout

app.use(express.json()); //đuôi mở rộng ejs
app.use(express.urlencoded({ extended: true })) //thư mục views
app.listen(port);

app.get("/", function (req, res) {
    res.render("trangchu");
});

//đường dẫn trang giới thiệu
app.get("/gioi-thieu", function (req, res) {
    res.render("gioithieu");
});

// app.get("/thuat-toan-des", function (req, res) {
//     res.render("thuattoandes")
// });

app.get("/email", function (req, res) {
    res.render("partials/email")
});

app.post("/post-email",function(req,res){
    //cai dat email
    var option={
        service: 'gmail', //dung gmail
        auth:{
            user:'pipclupnomad@gmail.com',
            pass:'zuad vtqu kyap ovte'
        }
    };
    var transporter=nodemailer.createTransport(option);
    transporter.verify(function(error,success){
        if(error){
            console.log(error);
        }else{
            console.log("kết nối thành công");
        }
    });
    var mail={
        from: req.body.emailgui,
        to: req.body.emailnhan,
        subject: req.body.chude,
        html:req.body.noidung,
    };

    transporter.sendMail(mail,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent: "+info.response);
        }
    });

    res.redirect("/email");
});

// app.get("/thuat-toan-aes", function (req, res) {
//     res.render("thuattoanaes")
// });

// app.get("/thuat-toan-rsa", function (req, res) {
//     res.render("thuattoanrsa")
// });

// app.post("/post-thuat-toan-des", function (req, res) {
//     //code ma hoa
//     // ma hoa doi xung dung chung 1 key, trong vd nay dung key cp ten bien la key
//     var crypto = require("crypto"); // goi thu vien ma hoa
//     var key = Buffer.from("jhsgatt12sgsssqswhwqfsaxasxuasxs", "base64");
//     var kieumahoa = crypto.createCipheriv("des-ede3", key, null);
//     var mahoa = kieumahoa.update(req.body.dulieu, "utf8", "base64");
//     mahoa += kieumahoa.final("base64");
//     res.send(mahoa);
// });