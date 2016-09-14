window.onload = function () {
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        width: 200,//设置宽高
        height: 200
    });
    document.getElementById("send").onclick = function () {
        qrcode.makeCode(document.getElementById("getval").value);
    };
}