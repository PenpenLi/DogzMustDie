<?php
error_reporting(0);

// http origin
header('Access-Control-Allow-Origin:*');
header("Content-type:text/html;charset=utf-8");

// http require
require("Autoloader.php");

$getParams = $_GET;

$appKey = 'MMMz8g';
$dealId = '67556191';
$openid = $getParams['openid'];
$payTime = $getParams['payTime'];
$dealTitle = $getParams['dealTitle'];
$serverid = $getParams['serverid'];
$roleid = $getParams['roleid'];
$rolename = $getParams['rolename'];
$goodsType = $getParams['goodsType'];
$goodsId = $getParams['goodsId'];
$totalAmount = (string)($getParams['price'] * 100);
$tpOrderId = $openid . $payTime;

/**
 * 第一部分：从公私钥文件路径中读取出公私钥文件内容
 */
$rsaPrivateKeyFilePath = 'rsa/rsa_private_key.pem';
$rsaPublicKeyFilePath = 'rsa/rsa_public_key.pem';

if(!file_exists($rsaPrivateKeyFilePath) || !is_readable($rsaPrivateKeyFilePath) ||
   !file_exists($rsaPublicKeyFilePath) || !is_readable($rsaPublicKeyFilePath) ){
    return false;
}

$rsaPrivateKeyStr = file_get_contents($rsaPrivateKeyFilePath);
$rsaPublicKeyStr = file_get_contents($rsaPublicKeyFilePath);

/**
 * 第二部分：生成签名
 */
$requestParamsArr = array(
	'appKey' => $appKey,
	'dealId' => $dealId,
    'tpOrderId' => $tpOrderId
);
$rsaSign = NuomiRsaSign::genSignWithRsa($requestParamsArr, $rsaPrivateKeyStr);
$requestParamsArr['sign'] = $rsaSign;
// print_r($requestParamsArr);

/**
 * 第三部分：校验签名
 */
$checkSignRes = NuomiRsaSign::checkSignWithRsa($requestParamsArr, $rsaPublicKeyStr);
// print_r($checkSignRes); # true :签名校验成功，false：签名校验失败

$bizInfo = array(
	"tpData" => array(
		"appKey" => $appKey,
		"dealId" => $dealId,
		"tpOrderId" => $tpOrderId,
		"rsaSign" => $rsaSign,
		"totalAmount" => $totalAmount,
		"returnData" => array(
			"serverid" => $serverid,
			"roleid" => $roleid,
			"rolename" => $rolename,
			"goodsType" => $goodsType,
			"goodsId" => $goodsId,
			"openid" => $openid
		)
	)
);

$retParams = array(
	"status" => $checkSignRes == true ? 0 : 1,
	"data" => array(
		"dealId" => $dealId,
		"appKey" => $appKey,
		"totalAmount" => $totalAmount,
		"tpOrderId" => $tpOrderId,
		"dealTitle" => $dealTitle,
		"rsaSign" => $rsaSign,
		"bizInfo" => json_encode($bizInfo)
	)
);

echo json_encode($retParams), PHP_EOL;
?> 