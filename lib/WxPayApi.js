/**
 *
 *----------Dragon be here!----------/
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　　┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　┃
 * 　　┃　　　　　　　┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　　┃
 * 　　┗━┓　　　┏━┛
 * 　　　　┃　　　┃神兽保佑
 * 　　　　┃　　　┃代码无BUG！
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　　　┣┓
 * 　　　　┃　　　　　　　┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 * ━━━━━━神兽出没━━━━━━coder-ccy
 */
/**
 * Created by Administrator on 2016/9/9 0009.
 * @author chenchangyu
 */
var CFG = require('./WxPayConfig');
var PayData = require('./WxPayDatabak');
var request = require('request');
/**
 *
 * 微信扫码支付API列表的封装，
 * 接口有默认超时时间（除提交被扫支付为10s，上报超时时间为1s外，其他均为6s）
 * @author chenchangyu
 *
 */
function WxPayApi() {
    this.resultStr = {};
}
WxPayApi.prototype = {
    unifiedOrder: function (inputObj, timeOut, Callback) {
        var timeOut = (typeof timeOut == "undefined") ? 6 : timeOut;
        var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
        //检测必填参数
        if (!inputObj.IsOut_trade_noSet()) {
            throw ("缺少统一支付接口必填参数out_trade_no！");
        } else if (!inputObj.IsBodySet()) {
            throw ("缺少统一支付接口必填参数body！");
        } else if (!inputObj.IsTotal_feeSet()) {
            throw ("缺少统一支付接口必填参数total_fee！");
        } else if (!inputObj.IsTrade_typeSet()) {
            throw ("缺少统一支付接口必填参数trade_type！");
        }
        //关联参数
        if (inputObj.GetTrade_type() == "NATIVE" && !inputObj.IsProduct_idSet()) {
            throw ("统一支付接口中，缺少必填参数product_id！trade_type为NATIVE时，product_id为必填参数！");
        }
        //异步通知url未设置，则使用配置文件中的url
        if (!inputObj.IsNotify_urlSet()) {
            inputObj.SetNotify_url(CFG.NOTIFY_URL);//异步通知url
        }
        inputObj.SetAppid(CFG.APPID);//公众账号ID
        inputObj.SetMch_id(CFG.MCHID);//商户号
        inputObj.SetNonce_str(this.getNonceStr());//随机字符串,默认是32位
        // 签名
        inputObj.SetSpbill_create_ip('192.168.199.165');//设置终端ip
        inputObj.SetSign();
        // inputObj.SetTime_start(this.startTimeStamp());
        inputObj.SetKeys();

        var xml = inputObj.ToXml();
        /**
         * TODO 订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
         */
        var startTime = this.startTimeStamp();//请求开始时间
        /**
         * 以post方式提交xml到对应的接口url
         */
        this.postXmlCurl(xml, url, false, timeOut, Callback);
    },

    /**
     *
     * 产生随机字符串，不长于32位
     * @param int length
     * @return 产生的随机字符串
     */
    getNonceStr: function (length) {
        var len = (typeof length == "undefined") ? 32 : length;
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var str = "";
        for (i = 0; i < len; i++) {
            str += chars.substr(Math.random() * (chars.length - 1), 1);
        }
        return str;
    },
    /**
     * TODO 请求超时，证书，代理
     * @param xml
     * @param url
     * @param useCert
     * @param second
     */
    postXmlCurl: function (xml, url, useCert, second, callback) {
        request({
            url: url,
            method: 'POST',
            body: xml
        }, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                console.log("链接微信服务器成功");
                callback(body);
            }
            else {
                throw err;
            }
        })
    },
    startTimeStamp: function () {
        var time = new Date();
        time = time.getFullYear() + (time.getMonth() + 1) + time.getDate() + (time.getHours() > 9 ? '' : '0') + time.getHours() + (time.getMinutes() > 9 ? '' : '0') + time.getMinutes() + (time.getSeconds() > 9 ? '' : '0') + time.getSeconds()
        return time;
    }

};
exports.WxPayApi = WxPayApi;
