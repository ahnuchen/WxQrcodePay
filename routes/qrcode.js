/**
 * Created by ccy on 2016/9/9 0009.
 * @author chenchangyu
 */
var CFG = require('../lib/WxPayConfig');
var API = require('../lib/WxPayApi');
var PayData = require('../lib/WxPayDatabak');
var payApi = new API.WxPayApi();
var express = require('express');
var router = express.Router();

//扫码支付方案二
/**
 * 流程：
 * 1、调用统一下单，取得code_url，生成二维码
 * 2、用户扫描二维码，进行支付
 * 3、支付完成之后，微信服务器会通知支付成功
 * 4、在支付成功通知中需要查单确认是否真正支付成功（见：notify.php）
 */
var input = new PayData.WxPayDataBase();
var url = '';
var i = 0;
input.SetBody("test");
input.SetAttach("test");
input.SetOut_trade_no(CFG.MCHID+new Date().getTime());
input.SetTotal_fee("1");
// input.SetTime_start(date());
// input.SetTime_expire(date("YmdHis", time() + 600));
input.SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
input.SetTrade_type("NATIVE");
input.SetProduct_id("123456789");
input.SetKeys();
GetPayUrl(input);
GetPayInfo();
function url_cb(result) {
    if(result){
        result = input.Init(result);
        url = result["code_url"];
    }
}
function GetPayUrl(input)
{
    if(input.GetTrade_type() == "NATIVE")
    {
        result = payApi.unifiedOrder(input,6,url_cb);
        return result;
    }
}
var notification = require("./notify").response;
function GetPayInfo() {
    console.log(i);
    setTimeout(function () {
        notification = require("./notify").response;
        i++;
        if(!notification.return_code && i<5){
            GetPayInfo();
        }else if(i==5){
            console.log("生成二维码超时!");
            /**
             * TODO 主动查询订单
             */
        }else{
            console.log(notification.return_code);
        }
    },1000)
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('qrcode', { qrcodeurl: url,notify_ok:notification.return_code});
});

module.exports = router;