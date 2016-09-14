/**
 * Created by chenchangyu on 2016/9/9 0009.
 * @author chenchangyu
 */
var CFG = require('./WxPayConfig');

function WxPayDataBase() {
    this.keys = [];
    this.values = {};
}
WxPayDataBase.prototype = {

    /**
     * 设置签名，详见签名生成算法
     * @param string value
     **/
    SetSign: function () {
        sign = this.MakeSign();
        this.values['sign'] = sign;
        return sign;
    },

    /**
     * 获取签名，详见签名生成算法的值
     * @return 值
     **/
    GetSign: function () {
        return this.values['sign'];
    },

    /**
     * 判断签名是否存在
     * @return true 或 false
     **/
    IsSignSet: function () {
        this.SetKeys();
        return this.keys.indexOf('sign') > -1
    },

    /**
     * 输出xml字符
     * @throws WxPayException
     **/
    ToXml: function () {
        if (typeof this.keys != "object" || this.keys.length <= 0) {
            throw "数组数据异常";
        }
        var xml = "<xml>";
        for (var i =0;i<this.keys.length;i++) {
            var val = this.values[this.keys[i]];
            if (typeof val == "number") {
                xml += "<" + this.keys[i] + ">" + val + "</" + this.keys[i] + ">";
            }
            else {
                xml += "<" + this.keys[i] + "><![CDATA[" + val + "]]></" + this.keys[i] + ">";
            }
        }
        xml += "</xml>";
        return xml;

    },

    /**
     * 将xml转为json
     * npm install xml2js
     * @param string xml
     */
    FromXml: function (xml) {
        var str = {};
        if (!xml) {
            throw "xml数据异常";
        }
        var parseString = require('xml2js').parseString;
        parseString(xml, {explicitArray : false},function (err, res) {
            str = res;
        });
        this.values = str.xml;
        return this.values;
    },

    /**
     * 按照参数名ASCII码从小到大排序（字典序）
     * 使用URL键值对的格式（即key1=value1&key2=value2…）
     * 拼接成字符串stringA
     */
    ToUrlParams: function () {
        var buff = "";
        this.SetKeys();
        for (var i = 0;i<this.keys.length;i++) {
            var val = this.values[this.keys[i]];
            if (this.keys[i] != "sign" && val != "" && typeof val != "object") {
                buff += this.keys[i] + "=" + val + "&";
            }
        }
        buff = buff.trim();
        buff = buff.slice(0, buff.length - 1);
        return buff;
    },

    /**
     * 生成签名
     * @return 签名，本函数不覆盖sign成员变量，如要设置签名需要调用SetSign方法赋值
     */
    MakeSign: function () {
        //签名步骤一： 将数组转换成url键值对
        var string = "";
        string = this.ToUrlParams();
        //签名步骤二：在string后加入KEY
        string = string + "&key=" + CFG.KEY;
        //签名步骤三：MD5加密
        var crypto = require('crypto');
        string = crypto.createHash("md5").update(string).digest("hex").toUpperCase();
        //签名步骤四：所有字符转为大写
        return string;
    },

    /**
     * 获取设置的值
     */
    GetValues: function () {
        return this.values;
    },
    /**
     *
     * 检测签名
     */
    CheckSign: function () {
        //fix异常
        if (!this.IsSignSet()) {
            throw ("签名错误！");
        }
    },
    /**
     * 将xml转为array
     * @param string xml
     */
    Init: function (xml) {
        this.FromXml(xml);
        if (this.values['return_code'] != 'SUCCESS') {
            return this.GetValues();
        }
        this.CheckSign();
        return this.GetValues();
    },
    /**
     * 设置错误码 FAIL 或者 SUCCESS
     * @param string
     */
    SetReturn_code: function (return_code) {
        this.values['return_code'] = return_code;
    },

    /**
     * 获取错误码 FAIL 或者 SUCCESS
     * @return string return_code
     */
    GetReturn_code: function () {
        return this.values['return_code'];
    },
    SetReturn_msg: function (return_msg) {
        this.values['return_msg'] = return_msg;
    },

    /**
     * 设置返回参数
     * @param string key
     * @param string value
     */
    SetData: function (key, value) {
        this.values[key] = value;
    },
    /**
     * 设置键值数组
     */
    SetKeys:function () {
        for (key in this.values) {
            if(this.keys.indexOf(key)<0)
            this.keys.push(key);
        }
        this.keys = this.keys.sort();
    },
    /**
     * 设置微信分配的公众账号ID
     * @param string value
     **/
    SetAppid: function (value) {
        this.values['appid'] = value;
    },
    /**
     * 获取微信分配的公众账号ID的值
     * @return 值
     **/
    GetAppid: function (value) {
        return this.values['appid'];
    },
    /**
     * 判断微信分配的公众账号ID是否存在
     * @return true 或 false
     **/
    IsAppidSet: function () {
        return this.keys.indexOf('appid') > -1;
    },

    /**
     * 设置微信支付分配的商户号
     * @param string value
     **/
    SetMch_id: function (value) {
        this.values['mch_id'] = value;
    },

    /**
     * 获取微信支付分配的商户号的值
     * @return 值
     **/
    GetMch_id: function () {
        return this.values['mch_id'];
    },

    /**
     * 判断微信支付分配的商户号是否存在
     * @return true 或 false
     **/
    IsMch_idSet: function () {
        return this.keys.indexOf('mch_id') > -1;
    },

    /**
     * 设置微信支付分配的终端设备号，商户自定义
     * @param string value
     **/
    SetDevice_info: function (value) {
        this.values['device_info'] = value;
    },

    /**
     * 获取微信支付分配的终端设备号，商户自定义的值
     * @return 值
     **/

    GetDevice_info: function () {
        return this.values['device_info'];
    },

    /**
     * 判断微信支付分配的终端设备号，商户自定义是否存在
     * @return true 或 false
     **/
    IsDevice_infoSet: function () {
        return this.keys.indexOf('device_info') > 1;
    },

    /**
     * 设置随机字符串，不长于32位。推荐随机数生成算法
     * @param string value
     **/

    SetNonce_str: function (value) {
        this.values['nonce_str'] = value;
    },

    /**
     * 获取随机字符串，不长于32位。推荐随机数生成算法的值
     * @return 值
     **/

    GetNonce_str: function () {
        return this.values['nonce_str'];
    },
    /**
     * 判断随机字符串，不长于32位。推荐随机数生成算法是否存在
     * @return true 或 false
     **/

    IsNonce_strSet: function () {
        return this.keys.indexOf('nonce_str') > -1;
    },
    /**
     * 设置商品或支付单简要描述
     * @param string value
     **/
    SetBody: function (value) {
        this.values['body'] = value;
    },
    /**
     * 获取商品或支付单简要描述的值
     * @return 值
     **/
    GetBody: function () {
        return this.values['body'];
    },
    /**
     * 判断商品或支付单简要描述是否存在
     * @return true 或 false
     **/
    IsBodySet: function () {
        return this.keys.indexOf('body') > -1;
    },
    /**
     * 设置商品名称明细列表
     * @param string value
     **/
    SetDetail: function (value) {
        this.values['detail'] = value;
    },
    /**
     * 获取商品名称明细列表的值
     * @return 值
     **/
    GetDetail: function () {
        return this.values['detail'];
    },
    /**
     * 判断商品名称明细列表是否存在
     * @return true 或 false
     **/
    IsDetailSet: function () {
        return this.keys.indexOf('detail') > -1;
    },
    /**
     * 设置附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
     * @param string value
     **/
    SetAttach: function (value) {
        this.values['attach'] = value;
    },
    /**
     * 获取附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据的值
     * @return 值
     **/
    GetAttach: function () {
        return this.values['attach'];
    },
    /**
     * 判断附加数据，在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据是否存在
     * @return true 或 false
     **/
    IsAttachSet: function () {
        return this.keys.indexOf('attach') > -1;

    },
    /**
     * 设置商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号
     * @param string value
     **/
    SetOut_trade_no: function (value) {
        this.values['out_trade_no'] = value;
    },
    /**
     * 获取商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号的值
     * @return 值
     **/
    GetOut_trade_no: function () {
        return this.values['out_trade_no'];
    },
    /**
     * 判断商户系统内部的订单号,32个字符内、可包含字母, 其他说明见商户订单号是否存在
     * @return true 或 false
     **/
    IsOut_trade_noSet: function () {
        return this.keys.indexOf('out_trade_no') > -1;
    },
    /**
     * 设置符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型
     * @param string value
     **/
    SetFee_type: function (value) {
        this.values['fee_type'] = value;
    },
    /**
     * 获取符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型的值
     * @return 值
     **/
    GetFee_type: function () {
        return this.values['fee_type'];
    },
    /**
     * 判断符合ISO 4217标准的三位字母代码，默认人民币：CNY，其他值列表详见货币类型是否存在
     * @return true 或 false
     **/
    IsFee_typeSet: function () {
        return this.keys.indexOf('fee_type') > -1;
    },

    /**
     * 设置订单总金额，只能为整数，单位为分，详见支付金额
     * @param string value
     **/
    SetTotal_fee: function (value) {
        this.values['total_fee'] = value;
    },
    /**
     * 获取订单总金额，只能为整数，详见支付金额的值
     * @return 值
     **/
    GetTotal_fee: function () {
        return this.values['total_fee'];
    },
    /**
     * 判断订单总金额，只能为整数，详见支付金额是否存在
     * @return true 或 false
     **/
    IsTotal_feeSet: function () {
        return this.keys.indexOf('total_fee') > -1;
    },

    /**
     * 设置APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
     * @param string value
     **/
    SetSpbill_create_ip: function (value) {
        this.values['spbill_create_ip'] = value;
    },
    /**
     * 获取APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。的值
     * @return 值
     **/
    GetSpbill_create_ip: function () {
        return this.values['spbill_create_ip'];
    },
    /**
     * 判断APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。是否存在
     * @return true 或 false
     **/
    IsSpbill_create_ipSet: function () {
        return this.keys.indexOf('spbill_create_ip') > -1;
    },
    /**
     * 设置订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则
     * @param string value
     **/
    SetTime_start: function (value) {
        this.values['time_start'] = value;
    },
    /**
     * 获取订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则的值
     * @return 值
     **/
    GetTime_start: function () {
        return this.values['time_start'];
    },
    /**
     * 判断订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。其他详见时间规则是否存在
     * @return true 或 false
     **/
    IsTime_startSet: function () {
        return this.keys.indexOf('time_start') > -1;
    },


    /**
     * 设置订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。其他详见时间规则
     * @param string value
     **/
    SetTime_expire: function (value) {
        this.values['time_expire'] = value;
    },
    /**
     * 获取订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。其他详见时间规则的值
     * @return 值
     **/
    GetTime_expire: function () {
        return this.values['time_expire'];
    },
    /**
     * 判断订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。其他详见时间规则是否存在
     * @return true 或 false
     **/
    IsTime_expireSet: function () {
        return this.keys.indexOf('time_expire') > -1;
    },

    /**
     * 设置接收微信支付异步通知回调地址
     * @param string value
     **/
    SetNotify_url: function (value) {
        this.values['notify_url'] = value;
    },
    /**
     * 获取接收微信支付异步通知回调地址的值
     * @return 值
     **/
    GetNotify_url: function () {
        return this.values['notify_url'];
    },
    /**
     * 判断接收微信支付异步通知回调地址是否存在
     * @return true 或 false
     **/
    IsNotify_urlSet: function () {
        return this.keys.indexOf('notify_url') > -1;

    },

    /**
     * 设置取值如下：JSAPI，NATIVE，APP，详细说明见参数规定
     * @param string value
     **/
    SetTrade_type: function (value) {
        this.values['trade_type'] = value;
    },
    /**
     * 获取取值如下：JSAPI，NATIVE，APP，详细说明见参数规定的值
     * @return 值
     **/
    GetTrade_type: function () {
        return this.values['trade_type'];
    },
    /**
     * 判断取值如下：JSAPI，NATIVE，APP，详细说明见参数规定是否存在
     * @return true 或 false
     **/
    IsTrade_typeSet: function () {
        return this.keys.indexOf('trade_type') > -1;
    },


    /**
     * 设置trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。
     * @param string value
     **/
    SetProduct_id: function (value) {
        this.values['product_id'] = value;
    },
    /**
     * 获取trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。的值
     * @return 值
     **/
    GetProduct_id: function () {
        return this.values['product_id'];
    },
    /**
     * 判断trade_type=NATIVE，此参数必传。此id为二维码中包含的商品ID，商户自行定义。是否存在
     * @return true 或 false
     **/
    IsProduct_idSet: function () {
        return this.keys.indexOf('product_id') > -1;
    },

    /**
     * 设置trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid。
     * @param string value
     **/
    SetOpenid: function (value) {
        this.values['openid'] = value;
    },
    /**
     * 获取trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid。 的值
     * @return 值
     **/
    GetOpenid: function () {
        return this.values['openid'];
    },
    /**
     * 判断trade_type=JSAPI，此参数必传，用户在商户appid下的唯一标识。下单前需要调用【网页授权获取用户信息】接口获取到用户的Openid。 是否存在
     * @return true 或 false
     **/
    IsOpenidSet: function () {
        return this.keys.indexOf('openid') > -1;
    }
};

exports.WxPayDataBase = WxPayDataBase;





