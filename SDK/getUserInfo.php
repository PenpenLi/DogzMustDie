<?php
error_reporting(0);

// http origin
header('Access-Control-Allow-Origin:*');
header("Content-type:text/html;charset=utf-8");

/**
 * 数据解密：低版本使用mcrypt库（PHP < 5.3.0），高版本使用openssl库（PHP >= 5.3.0）。
 *
 * @param string $ciphertext    待解密数据，返回的内容中的data字段
 * @param string $iv            加密向量，返回的内容中的iv字段
 * @param string $app_key       创建小程序时生成的app_key
 * @param string $session_key   登录的code换得的
 * @return string | false
 */
function decrypt($ciphertext, $iv, $app_key, $session_key) {
    $session_key = base64_decode($session_key);
    $iv = base64_decode($iv);
    $ciphertext = base64_decode($ciphertext);

    $plaintext = false;
    if (function_exists("openssl_decrypt")) {
        $plaintext = openssl_decrypt($ciphertext, "AES-192-CBC", $session_key, OPENSSL_RAW_DATA | OPENSSL_ZERO_PADDING, $iv);
    } else {
        $td = mcrypt_module_open(MCRYPT_RIJNDAEL_128, null, MCRYPT_MODE_CBC, null);
        mcrypt_generic_init($td, $session_key, $iv);
        $plaintext = mdecrypt_generic($td, $ciphertext);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
    }
    if ($plaintext == false) {
        return false;
    }

    // trim pkcs#7 padding
    $pad = ord(substr($plaintext, -1));
    $pad = ($pad < 1 || $pad > 32) ? 0 : $pad;
    $plaintext = substr($plaintext, 0, strlen($plaintext) - $pad);

    // trim header
    $plaintext = substr($plaintext, 16);
    // get content length
    $unpack = unpack("Nlen/", substr($plaintext, 0, 4));
    // get content
    $content = substr($plaintext, 4, $unpack['len']);
    // get app_key
    $app_key_decode = substr($plaintext, $unpack['len'] + 4);
    return $app_key == $app_key_decode ? $content : false;
}

$params = $_GET;
$app_key = 'M7zdalp8xon7s1LUm2HcQEH92EvKayHA';
$session_key = $params['session_key'];
$iv = $params['iv'];
$ciphertext = $params['data'];
$plaintext = decrypt($ciphertext, $iv, $app_key, $session_key);
// 解密结果应该是 '{"openid":"open_id","nickname":"baidu_user","headimgurl":"url of image","sex":1}'
echo $plaintext, PHP_EOL;
?> 