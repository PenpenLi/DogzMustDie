/*
* javascript 转化操作
* @author WH
* @desc 字节，编码转换相关操作
*/
module H52D_Framework {
    export class BitService {
        /**
         * 将unicode值转为字符串
         * @param n unicode值
         * @return 字符串
         */
        public static GetFromCharCode(n) {
            return String.fromCharCode(n);
        }

        /**
         * 获取字符串的字节长度
         * @param str 字符串
         * @return 返回字符串的字节长度
         */
        public static GetBytesLengthForString(str) {
            if (str === void 0) { return -1; };
            let len = 0;
            for (var i=0,sz=str.length;i < sz;i++){
                var c=str.charCodeAt(i);
                if (c <=0x7F){
                        len = len + 1;
                    }else if (c <=0x7FF){
                        len = len + 2;
                    }else if (c <=0xFFFF){
                        len = len + 3;
                    }else {
                        len = len + 4;
                }
            }
            return len;
        }

        /**
         * ascii转unicdoe
         * @param content 字符串
         * @return unicode值
         */
        public static Ascii2unicode(content) {
            let result = '';
            for (let i = 0; i < content.length; i++)
                result += '&#' + content.charCodeAt(i) + ';';
            return result;
        }

        /**
         * unicode转ascii
         * @param content 字符串
         * @return ascii值
         */
        public static Unicode2ascii(content) {
            let code = content.match(/&#(\d+);/g);
            let result = '';
            for (let i = 0; i < code.length; i++)
                result += this.GetFromCharCode(code[i].replace(/[&#;]/g, ''));
            return result;
        }

        /**
         * string转二进制字节数组
         * @param str 字符串
         * @return 字节数组
         */
        public static StringToBytes(str) {
            let ch, st, re = [];
            for (let i = 0; i < str.length; i++) {
                ch = str.charCodeAt(i);
                st = [];
                do {
                    st.push(ch & 0xFF);
                    ch = ch >> 8;
                }
                while (ch);
                re = re.concat(st.reverse());
            }
            return re;
        }

        /**
         * short转二进制字节数组
         * @param n short值
         * @return 字节数组
         */
        public static ShortToBytes(n) {
            let b = [0, 0];
            b[0] = n >> 0;
            b[1] = n >> 8;
            return b;
        }

        /**
         * 二进制字节数组转short
         * @param b 字节数组
         * @return short值
         */
        public static BytesToShort(b) {
            return (b[1] << 8) | b[0] & 0xff;
        }


        /**
         * long转二进制字节数组
         * @param long long值
         * @return 字节数组
         */
        public static LongToBytes(long) {
            let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index++) {
                let byte = long & 0xff;
                byteArray[index] = byte;
                long = (long - byte) / 256;
            }
            return byteArray;
        }


        /**
         * 二进制字节数组转long
         * @param b 字节数组
         * @return long值
         */
        public static BytesToLong(b) {
            let value = 0;
            for (let i = b.length - 1; i >= 0; i--) {
                value = (value * 256) + b[i];
            }

            return value;
        };


        /**
         * int转二进制字节数组
         * @param num int值
         * @return 字节数组
         */
        public static IntToBytes(num) {
            let byte = [];
            byte[0] = (num >> 24) & 0xFF;
            byte[1] = (num >> 16) & 0xFF;
            byte[2] = (num >> 8) & 0xFF;
            byte[3] = num & 0xFF;
            return byte;
        }


        /**
         * 二进制字节数组转int
         * @param b 字节数组
         * @return int值
         */
        public static BytesToInt(b) {
            let inter = b[0] & 0xFF;
            inter |= ((b[1] << 8) & 0xFF00);
            inter |= ((b[2] << 16) & 0xFF0000);
            inter |= ((b[3] << 24) & 0xFF000000);
            return inter;
        }
    }
}