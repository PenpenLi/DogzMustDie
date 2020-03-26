<?php
error_reporting(0);

// http origin
header('Access-Control-Allow-Origin:*');
header("Content-type:text/html;charset=utf-8");

// http require
// require("Autoloader.php");

// $params = $_POST;

/**
 * 第一部分：从公私钥文件路径中读取出公私钥文件内容
 */
// $rsaPrivateKeyFilePath = 'rsa/rsa_private_key.pem';
// $rsaPublicKeyFilePath = 'rsa/rsa_public_key.pem';

// if(!file_exists($rsaPrivateKeyFilePath) || !is_readable($rsaPrivateKeyFilePath) ||
   // !file_exists($rsaPublicKeyFilePath) || !is_readable($rsaPublicKeyFilePath) ){
    // return false;
// }

// $rsaPrivateKeyStr = file_get_contents($rsaPrivateKeyFilePath);
// $rsaPublicKeyStr = file_get_contents($rsaPublicKeyFilePath);

/**
 * 第二部分：生成签名
 */
// $requestParamsArr = array(
	// 'orderId' => $params['orderId'],
	// 'userId' => $params['userId'],
    // 'refundBatchId' => $params['refundBatchId']
// );
// $rsaSign = NuomiRsaSign::genSignWithRsa($requestParamsArr, $rsaPrivateKeyStr);
// $requestParamsArr['sign'] = $rsaSign;
// print_r($requestParamsArr);

/**
 * 第三部分：校验签名
 */
// $checkSignRes = NuomiRsaSign::checkSignWithRsa($requestParamsArr, $rsaPublicKeyStr);
// print_r($checkSignRes); # true :签名校验成功，false：签名校验失败

// 目前不支持退款、直接审核不通过、退款金额为0
$data = array(
	"auditStatus" => 2,
	"calculateRes" => array(
		"refundPayMoney" => 0
	)
);
$ret = array(
	"errno" => 0,
	"msg" => "fail",
	"data" => $data
);
echo json_encode($ret), PHP_EOL;
?> 