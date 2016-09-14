var express = require('express');
var router = express.Router();
var PayData = require('../lib/WxPayDatabak');
var payNotify = new PayData.WxPayDataBase();
var notify = '';
var response = {
    return_code:"",
    return_msg:""
};
/* GET notify listing. */
router.post('/', function(req, res, next) {
    var parseString = require('xml2js').parseString;
    parseString(req, {explicitArray : false},function (err, result) {
        notify = result.xml;
    });
    if(notify.return_code == "SUCCESS" && notify.result_code =="SUCCESS"){
        response={
            return_code:"SUCCESS",
            return_msg:"OK"
        }
    }
    else{
        response={
            return_code:"FAIL",
            return_msg:notify.return_msg
        }
    }
    var resXML = '<xml><return_code><![CDATA['+response.return_code+']]></return_code> <return_msg><![CDATA['+response.return_msg+']]></return_msg> </xml>';
    res.send('resXML');

    res.end();
});
module.exports = router;
module.exports.response = response;
