module H52D_Framework {

    /** 英雄战位 */
    export const HeroLocal: Array<[number, number]> = [
        [250, 670], [290, 730], [250, 790], //前排
        [150, 670], [190, 730], [150, 790], //中排
        [50, 670], [90, 730], [50, 790]     //后排
    ];

    /** 怪物战位 */
    export const MonsterLocal: Array<[number, number]> = [
        [480, 670], [440, 730], [480, 790], //前排
        [580, 670], [540, 730], [580, 790], //中排
        [680, 670], [640, 730], [680, 790]  //后排
    ];


    export const OSkillPoint: Array<[number, number]> = [
        [0, -80], //头
        [0, -40],  //腰
        [20, -50], //手
        [10, -10], //脚
        [110, -40]
    ];

    export const POSkillPoint: Array<[number, number]> = [
        [0, -80], //头
        [0, -40],  //腰
        [-20, -50], //手
        [-10, -10], //脚
        [-110, -40]
    ];

    export const Pvp_Point_O: Array<[number, number]> = [
        [50, -30], //武器
        [45, -60],  //手
        [50, -40], //脚
        [0, -200], //目标      
    ];
    export const Pvp_Point_E: Array<[number, number]> = [
        [-50, -30], //武器
        [-45, -60],  //手
        [-50, -40], //脚
        [0, -200], //目标      
    ];

    export const HeroSkillPoint: Array<[number, number]> = [
        [0, -120],
        [0, -50],
        [0, -35],
        [-35, -80],
        [0, -140],
        [-30, 0]
    ];

    export const MonsterSkillPoint: Array<[number, number]> = [
        [0, -300], //头
        [30, -200],//腰
        [20, -50],//手
        [0, 0], //脚
        [0, -140],//腿
        [-270, -120]
    ];

    export const HeroBuffPoint: Array<[number, number]> = [
        [0, -120],//头
        [0, -50],//腰
        [0, -35],//脚
        [-35, -80]//头后
    ];

    export const PHeroBuffPoint: Array<[number, number]> = [
        [0, -140],//头
        [0, -50],//腰
        [0, -35],//脚
        [35, -80]//头后
    ];

    export const OHeroBuffPoint: Array<[number, number]> = [
        [0, -140],//头
        [0, -50],//腰
        [0, -35],//脚
        [-35, -80]//头后
    ];

    export const MonsterBuffPoint: Array<[number, number]> = [
        [0, -300],
        [0, -170],
        [0, 0],
        [-50, -50]
    ];

    export const BossBuffPoint: Array<[number, number]> = [
        [0, -400],
        [0, -170],
        [0, 0],
        [-50, -50]
    ];

    /**不同场景 神兽的挂点 */
    export const PetPoint: Array<[number, number]> =
        [
            [0, 0],//站位
            [80, 564],//Scenen01
            [80, 538],//Scenen02
            [80, 562],//Scenen03
            [60, 476],//Scenen04
            [80, 555],//Scenen05
            [80, 430],//Scenen06
            [80, 538],//Scenen07
        ];

    /**不同场景 神兽的挂点 */
    export const EPetPoint: Array<[number, number]> =
        [
            [0, 0],//站位
            [680, 568],//Scenen01
            [680, 480],//Scenen02
            [680, 562],//Scenen03
            [680, 476],//Scenen04
            [680, 548],//Scenen05
            [680, 430],//Scenen06
            [680, 540],//Scenen07
        ];

    //Temp
    export const EnemySkillPoint: Array<[number, number]> =
        [

        ];

    export const SkillName: { [Key: number]: string } =
        {
            [1001]: "lyzd.png",
            [1002]: "pmz.png",
            [1003]: "cdzd.png",
            [1004]: "cgll.png",
            [1005]: "dhy.png",
            [1006]: "zz.png",
            [1007]: "lx.png",
            [1008]: "yb.png",
            [1009]: "lylj.png",
            [1010]: "lb.png",
            [1011]: "sp.png",
            [1012]: "bszd.png",
            [1013]: "zjss.png",
            [1014]: "hy.png",
            [1015]: "xl.png",
            [1016]: "bdz.png",
            [1017]: "bp.png",
            [1018]: "llsd.png",
            [1019]: "lc.png",
            [1020]: "dh.png",
            [1021]: "jgp.png",
            [1022]: "zdlj.png",
            [1023]: "cf.png",
            [1024]: "nld.png",
            [1025]: "yz.png",
            [1026]: "sw.png",
            [1027]: "fy.png",
        };

    //场景音乐
    export const soundScene: Array<string> = [
        "res/sound/background_sound2.mp3",
        "res/sound/background_sound3.mp3",
        "res/sound/background_sound4.mp3"
        //"res/sound/background_sound.mp3",
    ];
    /** 得地面高度 */
    export function FloorHeight(): number {
        let floor: number = (HeroLocal[7][1] + 60 + 20 * Math.random());
        return floor;
    }

    /** 金币飞回的位置 */
    export const CoinFlyBackPos = [];

    /**
     *  基础信息配置类
     * @author zhangyusong
     */
    export class BaseDefine {
        /** 道具资源_金币 */
        public static readonly ItemIdGold: number = 1;
        /** 道具资源_钻石 */
        public static readonly ItemIdDiamonds: number = 2;
        /** 道具资源_经验 */
        public static readonly ItemIdExperience: number = 3;
        /** 道具资源_蓝钻 */
        public static readonly ItemIdBlueDrills: number = 4;
        /** 道具资源_装备晶石 */
        public static readonly ItemIdEquipDrills: number = 2201;


        /** 道具类型_资源 */
        public static readonly ItemTypeResource = 1;
        /** 道具类型_材料 */
        public static readonly ItemTypeMaterials = 2;
        /** 道具类型_可使用 */
        public static readonly ItemTypeCanUes = 3;


        /** 道具子类型_英雄卡牌 */
        public static readonly ItemSonTypeUesHero = 21;
        /** 道具子类型_使用后获得奖励 */
        public static readonly ItemSonTypeUesAward = 31;
        /** 道具子类型_使用后获得Buff */
        public static readonly ItemSonTypeUesBuff = 32;

        /** 商城出售内容_出售类型 */
        public static readonly ItemSellContentType = 1;
        /** 商城出售内容_id */
        public static readonly ItemSellContentId = 2;
        /** 商城出售内容_数量 */
        public static readonly ItemNumSellContent = 3;

        /** 商城售卖_货币Id */
        public static readonly ItemIdCurrency = 1;
        /** 商城售卖_价格 */
        public static readonly ItemIdPrice = 2;

        /** 商品类型_道具 */
        public static readonly ItemTypePro = 1;
        /** 商品类型_装备 */
        public static readonly ItemTypeEquip = 2;
        /** 商品类型_英雄 */
        public static readonly ItemTypeHero = 3;
        /** 商品类型_神兽 */
        public static readonly ItemTypePet = 4;

        /** 商城类型_道具 */
        public static readonly ItemShopTypePro = 1;
        /** 商城类型_宝箱 */
        public static readonly ItemShopTypeEquipment = 2;

        /** 奖励判断类型_直接发放奖励 */
        public static readonly RewardTypeDirect = 0;
        /** 奖励判断类型_按权重随机出其中一个 */
        public static readonly RewardTypeRandom = 1;
        /** 奖励判断类型_按概率全部判断是否掉落 */
        public static readonly RewardTypeProbability = 2;

        /** 奖励类型 */
        public static readonly ItemRewardType = 1;
        /** 奖励对应id */
        public static readonly ItemRewardId = 2;
        /** 奖励数量 */
        public static readonly ItemRewardNum = 3;

        /** 品质颜色列表  字体亮色*/
        public static readonly LabelColor = {
            1: "#ffffff",//白色
            2: "#c5ffa5",//绿色
            3: "#a5d8ff",//蓝色
            4: "#efa5ff",//紫色
            5: "#ffcfa5",//橙色
            6: "#ffa5a7",//红色
        }
        /** 颜色列表 邮件  字体暗色*/
        public static readonly LabelColor1 = {
            1: "#ffffff",//白色
            2: "#2b5b5c",//绿色
            3: "#38429f",//蓝色
            4: "#62376c",//紫色
            5: "#5a4528",//橙色
            6: "#892e36",//红色
        }

        /** 品质背景列表  头像框*/
        public static readonly QualityList = {
            3: "ui_hero/img-lanpingzhilkuang.png",//蓝色 框
            4: "ui_hero/img-zhipinzhikuang.png",//紫色
            5: "ui_hero/img-huangpingzhikuang.png",//橙色
            6: "ui_hero/img-hongpingzhikuang.png",//红色
        }

        /**英雄详情 背景颜色 */
        public static readonly HeroAllinfo_bg = {
            3: "ui_hero/img-yingxiong-zhanshi-lan.png",
            4: "ui_hero/img-yingxiong-zhanshi-zi.png",
            5: "ui_hero/img-yingxiong-zhanshi-huang.png",
            6: "ui_hero/img-yingxiong-zhanshi-hong.png",

        }

        public static readonly BackGround_k = {//img-lanka.png
            3: "ui_hero/img-lanka.png",
            4: "ui_hero/img-zika.png",
            5: "ui_hero/img-chengka.png",
            6: "ui_hero/img-hongka.png",
        }

        /**神兽名字的颜色 */
        public static readonly PetColor_label = {
            1: "#ffffff",//白色
            2: "#c5ffa5",//绿色
            3: "#a9c3fe",//蓝色
            4: "#e69bff",//紫色
            5: "#ffba7b",//橙色
            6: "#ff9595",//红色
        }

        /**神兽背景颜色 */
        public static readonly PetColor_img = {
            2: "",
            3: "ui_hero/img-yingxiong-zhanshi-lan.png",
            4: "ui_hero/img-yingxiong-zhanshi-zi.png",
            5: "ui_hero/img-yingxiong-zhanshi-huang.png",
            6: "ui_hero/img-yingxiong-zhanshi-hong.png",
        }

        /** 品质背景列表*/
        public static readonly HeroQualityList = {
            3: "ui_hero/img-lanka.png",//蓝色
            4: "ui_hero/img-zika.png",//紫色
            5: "ui_hero/img-chengka.png",//橙色
            6: "ui_hero/img-hongka.png",//红色
        }

        public static readonly HeroQualityStr = {
            3: "蓝色",
            4: "紫色",
            5: "橙色",
            6: "红色",
        }

        /** 英雄类型图标列表*/
        public static readonly HeroTypeIcon = {
            1: "ui_hero/icon-renwu-leixing-gongji.png",//攻击
            2: "ui_hero/icon-renwu-leixing-fangyu.png",//防御
        }

        /** 英雄类型*/
        public static readonly HeroTypeStr = {
            1: "攻击型",
            2: "防御型",
        }

        /**英雄头像上的字 */
        public static readonly HeroWar_pos = {
            1: "ui_hero/img-yingxiong-zhiwei-duizhang.png",//队长
            2: "ui_hero/img-yingxiong-zhiwei-zhen.png",
        }

        /**英雄卡牌品质信息 */
        public static readonly Hero_Rare = {
            3: "普通",
            4: "稀有",
            5: "传奇",
            6: "神话",
        }
        public static readonly ButtonStr = {
            1: "角色",
            2: "英雄",
            3: "神兽",
            4: "装备",
            5: "排行",
            6: "商城",
            7: "邮件",
            8: "聊天",
            9: "阵营",
        }

        /**阵营信息字体颜色 */
        public static readonly CampInfo_Color = {
            1: "#bfc6ff",
            2: "#ffa5a7",
            3: "#e1aaf3",
            4: "#ffcdb1",
            5: "#fefeff",
        }

        /**阵营信息内容 */
        public static readonly CampInfo_text = {
            1: 6020,//加入
            2: 6022,//离开
            3: 6021,//捐献
        }

        /**时空法器品质 */
        public static readonly EquipQualityStr = {
            1: "普通",
            3: "五福",
            4: "稀有",
            5: "传奇",
        }
        /**时空法器品质颜色 */
        public static readonly EquipQualityColor = {
            2: "#c5ffa5",//绿色
            3: "#a5d8ff",//五福
            4: "#efa5ff",//稀有
            5: "#ffcfa5",//橙色
        }

        public static readonly EquipBgColor = {
            2: "ui_hero/img-lvpingzhikuang.png",//绿色
            3: "ui_hero/img-lanpingzhilkuang.png",//蓝色
            4: "ui_hero/img-zhipinzhikuang.png",//紫色
            5: "ui_hero/img-huangpingzhikuang.png",//橙色
            6: "ui_hero/img-hongpingzhikuang.png",//红色
        }

        /**天梯道具底图  */
        public static readonly LadderItemBgColor = {
            7: "#2b5b5c",//金币     
            3: "#38429f",//钻石
            4: "#62376c",//礼盒
            5: "#5a4528",//袋子
            6: "#892e36",//矿泉水
        }

        /**道具底图颜色  暗色*/
        public static readonly ItemBgColor = {
            7: "#364431",//金币     
            3: "#373f59",//钻石
            4: "#4f3061",//礼盒
            5: "#453d2f",//袋子
            6: "#632f2f",//矿泉水            
        }

        /**背景框图片公用 */
        public static readonly PubBgUrl = {
            2: "ui_hero/img-lvpingzhikuang.png",//绿色
            3: "ui_hero/img-lanpingzhilkuang.png",//蓝色
            4: "ui_hero/img-zhipinzhikuang.png",//紫色
            5: "ui_hero/img-huangpingzhikuang.png",//橙色
            6: "ui_hero/img-hongpingzhikuang.png",//红色
        }

        public static readonly Start_Icon = {
            0: "ui_icon/icon-yixing-tianti.png",//一星
            1: "ui_icon/icon-erxing-tianti.png",//2*
            2: "ui_icon/icon-sanxing-tianti.png",//3*
            3: "ui_icon/icon-canyujiang-tianti.png"//安慰
        }

        public static readonly Start_Name = {
            0: "一星奖励",//一星
            1: "二星奖励",//2*
            2: "三星奖励",//3*
            3: "参与奖"//安慰
        }
        /**战斗更新的频率 */
        public static LoopTime: number = 100;

        public static readonly ShareText = {
            1: "好玩有趣上手So Easy",
            2: "卖萌耍阴为所欲为",
            3: "全球恶意社交开启",
            4: "收藏解锁停不下来",
            5: "一招制敌究极搞怪"
        }
    }
}