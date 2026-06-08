const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
const path = require('path');
const fs = require('fs');

const config = {
    host: "app-430b8e63-7127-47ce-8e4e-2e5fcda6a330-fsbucket.services.clever-cloud.com",
    user: "user430b8e63",
    password: "b4bWhQ28zZTjzdtP", 
    port: 21,
    localRoot: __dirname,
    remoteRoot: "/",
    include: [
        "public/js/warna.js"
    ],
    exclude: [
        "node_modules/**", 
        "node_modules/**/*", 
        "vendor/**", 
        "vendor/**/*", 
        ".git/**", 
        ".git/**/*",
        "storage/framework/cache/**",
        "storage/framework/sessions/**"
    ],
    deleteRemote: false,
    forcePasv: true
};

ftpDeploy.on("uploading", function (data) {
    console.log("🚀 Memulai proses sinkronisasi komponen PickFit ke Clever Cloud...");
});

ftpDeploy.deploy(config)
    .then(res => console.log("\nSUKSES BESAR! Semua file Laravel versi terbaru berhasil mendarat di server!"))
    .catch(err => console.log("\nEror saat upload:", err));