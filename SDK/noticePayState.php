<?php
error_reporting(0);

// http origin
header('Access-Control-Allow-Origin:*');
header("Content-type:text/html;charset=utf-8");

// http require
require("Autoloader.php");

// check usr and get usrId
function curl_post_https($url,$data){ // 模拟提交数据函数
    $curl = curl_init(); // 启动一个CURL会话
    curl_setopt($curl, CURLOPT_URL, $url); // 要访问的地址
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0); // 对认证证书来源的检查
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 1); // 从证书中检查SSL加密算法是否存在
    curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']); // 模拟用户使用的浏览器
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1); // 使用自动跳转
    curl_setopt($curl, CURLOPT_AUTOREFERER, 1); // 自动设置Referer
    curl_setopt($curl, CURLOPT_POST, 1); // 发送一个常规的Post请求
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data); // Post提交的数据包
    curl_setopt($curl, CURLOPT_TIMEOUT, 30); // 设置超时限制防止死循环
    curl_setopt($curl, CURLOPT_HEADER, 0); // 显示返回的Header区域内容
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1); // 获取的信息以文件流的形式返回
    $tmpInfo = curl_exec($curl); // 执行操作
    if (curl_errno($curl)) {
        echo 'Errno'.curl_error($curl);//捕抓异常
    }
    curl_close($curl); // 关闭CURL会话
    return $tmpInfo; // 返回数据，json格式
}

$params = $_POST;

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
	'userId' => $params['userId'],
	'orderId' => $params['orderId'],
	'unitPrice' => $params['unitPrice'],
	'count' => $params['count'],
	'totalMoney' => $params['totalMoney'],
	'payMoney' => $params['payMoney'],
	'promoMoney' => $params['promoMoney'],
	'hbMoney' => $params['hbMoney'],
	'hbBalanceMoney' => $params['hbBalanceMoney'],
	'giftCardMoney' => $params['giftCardMoney'],
	'dealId' => $params['dealId'],
	'payTime' => $params['payTime'],
	'promoDetail' => $params['promoDetail'],
	'payType' => $params['payType'],
	'partnerId' => $params['partnerId'],
	'status' => $params['status'],
	'tpOrderId' => $params['tpOrderId'],
	'returnData' => $params['returnData'],
	'rsaSign' => $params['rsaSign']
);

$rsaSign = NuomiRsaSign::genSignWithRsa($requestParamsArr, $rsaPrivateKeyStr);
$requestParamsArr['sign'] = $rsaSign;
// print_r($requestParamsArr);

/**
 * 第三部分：校验签名
 */
$checkSignRes = NuomiRsaSign::checkSignWithRsa($requestParamsArr, $rsaPublicKeyStr);
// print_r($checkSignRes); # true :签名校验成功，false：签名校验失败

$successRet = array(
	"errno" => 0,
	"msg" => "success",
	"data" => array(
		"isConsumed" => 2
	)
);

$failRet = array(
	"errno" => 0,
	"msg" => "fail",
	"data" => array(
		"isConsumed" => 1
	)
);

if($checkSignRes == true){
	//验签成功
	$url = 'http://tbyxz.gyyx.cn:10002/recharge';
	$ret = curl_post_https($url, json_encode($requestParamsArr));
	$retArray = (array)json_decode($ret, true);
	//$state为服务器返回结果
	if($retArray['status'] == "success"){
		echo json_encode($successRet), PHP_EOL;
	}
	else{
		echo json_encode($failRet), PHP_EOL;
	}
}
else{
	//验签失败
	echo json_encode($failRet), PHP_EOL;
}
?> 