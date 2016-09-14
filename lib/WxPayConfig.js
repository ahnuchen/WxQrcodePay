/**
 * Created by Administrator on 2016/9/9 0009.
 * @author chenchangyu
 */
function WxPayConfig() {
    //=======【基本信息设置】=====================================
    //
    /**
     * TODO: 修改这里配置为您自己申请的商户信息
     * 微信公众号信息配置
     *
     * APPID：绑定支付的APPID（必须配置，开户邮件中可查看）
     *
     * MCHID：商户号（必须配置，开户邮件中可查看）
     *
     * KEY：商户支付密钥，参考开户邮件设置（必须配置，登录商户平台自行设置）
     * 设置地址：https://pay.weixin.qq.com/index.php/account/api_cert
     * NOTIFY_URL：接受异步通知url的默认值
     */
    this.APPID = 'wx426b3015555a46be';
    this.MCHID = '1900009851';
    this.KEY  = '8934e7d15453e97507ef794cf7b0519d';
    this.NOTIFY_URL = 'http://localhost:3000/notify'
}
module.exports = new WxPayConfig();
