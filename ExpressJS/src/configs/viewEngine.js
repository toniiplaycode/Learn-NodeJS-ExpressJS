import express  from "express";

const configViewEngine = (app) => { // tham số app chình là express
    app.use(express.static('./src/public')); // sử dụng static file ở folder public
    app.set("view engine", "ejs"); // cấu hình template engine là EJS
    app.set("views", "./src/views"); // tất cả các file EJS phải được viết trong folder views
}

export default configViewEngine;