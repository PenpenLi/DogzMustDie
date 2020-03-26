var H52D_Framework;
(function (H52D_Framework) {
    var _a;
    /** 英雄战位 */
    H52D_Framework.HeroLocal = [
        [250, 670], [290, 730], [250, 790],
        [150, 670], [190, 730], [150, 790],
        [50, 670], [90, 730], [50, 790] //后排
    ];
    /** 怪物战位 */
    H52D_Framework.MonsterLocal = [
        [480, 670], [440, 730], [480, 790],
        [580, 670], [540, 730], [580, 790],
        [680, 670], [640, 730], [680, 790] //后排
    ];
    H52D_Framework.OSkillPoint = [
        [0, -80],
        [0, -40],
        [20, -50],
        [10, -10],
        [110, -40]
    ];
    H52D_Framework.POSkillPoint = [
        [0, -80],
        [0, -40],
        [-20, -50],
        [-10, -10],
        [-110, -40]
    ];
    H52D_Framework.Pvp_Point_O = [
        [50, -30],
        [45, -60],
        [50, -40],
        [0, -200],
    ];
    H52D_Framework.Pvp_Point_E = [
        [-50, -30],
        [-45, -60],
        [-50, -40],
        [0, -200],
    ];
    H52D_Framework.HeroSkillPoint = [
        [0, -120],
        [0, -50],
        [0, -35],
        [-35, -80],
        [0, -140],
        [-30, 0]
    ];
    H52D_Framework.MonsterSkillPoint = [
        [0, -300],
        [30, -200],
        [20, -50],
        [0, 0],
        [0, -140],
        [-270, -120]
    ];
    H52D_Framework.HeroBuffPoint = [
        [0, -120],
        [0, -50],
        [0, -35],
        [-35, -80] //头后
    ];
    H52D_Framework.PHeroBuffPoint = [
        [0, -140],
        [0, -50],
        [0, -35],
        [35, -80] //头后
    ];
    H52D_Framework.OHeroBuffPoint = [
        [0, -140],
        [0, -50],
        [0, -35],
        [-35, -80] //头后
    ];
    H52D_Framework.MonsterBuffPoint = [
        [0, -300],
        [0, -170],
        [0, 0],
        [-50, -50]
    ];
    H52D_Framework.BossBuffPoint = [
        [0, -400],
        [0, -170],
        [0, 0],
        [-50, -50]
    ];
    /**不同场景 神兽的挂点 */
    H52D_Framework.PetPoint = [
        [0, 0],
        [80, 564],
        [80, 538],
        [80, 562],
        [60, 476],
        [80, 555],
        [80, 430],
        [80, 538],
    ];
    /**不同场景 神兽的挂点 */
    H52D_Framework.EPetPoint = [
        [0, 0],
        [680, 568],
        [680, 480],
        [680, 562],
        [680, 476],
        [680, 548],
        [680, 430],
        [680, 540],
    ];
    //Temp
    H52D_Framework.EnemySkillPoint = [];
    H52D_Framework.SkillName = (_a = {},
        _a[1001] = "lyzd.png",
        _a[1002] = "pmz.png",
        _a[1003] = "cdzd.png",
        _a[1004] = "cgll.png",
        _a[1005] = "dhy.png",
        _a[1006] = "zz.png",
        _a[1007] = "lx.png",
        _a[1008] = "yb.png",
        _a[1009] = "lylj.png",
        _a[1010] = "lb.png",
        _a[1011] = "sp.png",
        _a[1012] = "bszd.png",
        _a[1013] = "zjss.png",
        _a[1014] = "hy.png",
        _a[1015] = "xl.png",
        _a[1016] = "bdz.png",
        _a[1017] = "bp.png",
        _a[1018] = "llsd.png",
        _a[1019] = "lc.png",
        _a[1020] = "dh.png",
        _a[1021] = "jgp.png",
        _a[1022] = "zdlj.png",
        _a[1023] = "cf.png",
        _a[1024] = "nld.png",
        _a[1025] = "yz.png",
        _a[1026] = "sw.png",
        _a[1027] = "fy.png",
        _a);
    //场景音乐
    H52D_Framework.soundScene = [
        "res/sound/background_sound2.mp3",
        "res/sound/background_sound3.mp3",
        "res/sound/background_sound4.mp3"
        //"res/sound/background_sound.mp3",
    ];
    /** 得地面高度 */
    function FloorHeight() {
        var floor = (H52D_Framework.HeroLocal[7][1] + 60 + 20 * Math.random());
        return floor;
    }
    H52D_Framework.FloorHeight = FloorHeight;
    /** 金币飞回的位置 */
    H52D_Framework.CoinFlyBackPos = [];
    /**
     *  基础信息配置类
     * @author zhangyusong
     */
    var BaseDefine = /** @class */ (function () {
        function BaseDefine() {
        }
        /** 道具资源_金币 */
        BaseDefine.ItemIdGold = 1;
        /** 道具资源_钻石 */
        BaseDefine.ItemIdDiamonds = 2;
        /** 道具资源_经验 */
        BaseDefine.ItemIdExperience = 3;
        /** 道具资源_蓝钻 */
        BaseDefine.ItemIdBlueDrills = 4;
        /** 道具资源_装备晶石 */
        BaseDefine.ItemIdEquipDrills = 2201;
        /** 道具类型_资源 */
        BaseDefine.ItemTypeResource = 1;
        /** 道具类型_材料 */
        BaseDefine.ItemTypeMaterials = 2;
        /** 道具类型_可使用 */
        BaseDefine.ItemTypeCanUes = 3;
        /** 道具子类型_英雄卡牌 */
        BaseDefine.ItemSonTypeUesHero = 21;
        /** 道具子类型_使用后获得奖励 */
        BaseDefine.ItemSonTypeUesAward = 31;
        /** 道具子类型_使用后获得Buff */
        BaseDefine.ItemSonTypeUesBuff = 32;
        /** 商城出售内容_出售类型 */
        BaseDefine.ItemSellContentType = 1;
        /** 商城出售内容_id */
        BaseDefine.ItemSellContentId = 2;
        /** 商城出售内容_数量 */
        BaseDefine.ItemNumSellContent = 3;
        /** 商城售卖_货币Id */
        BaseDefine.ItemIdCurrency = 1;
        /** 商城售卖_价格 */
        BaseDefine.ItemIdPrice = 2;
        /** 商品类型_道具 */
        BaseDefine.ItemTypePro = 1;
        /** 商品类型_装备 */
        BaseDefine.ItemTypeEquip = 2;
        /** 商品类型_英雄 */
        BaseDefine.ItemTypeHero = 3;
        /** 商品类型_神兽 */
        BaseDefine.ItemTypePet = 4;
        /** 商城类型_道具 */
        BaseDefine.ItemShopTypePro = 1;
        /** 商城类型_宝箱 */
        BaseDefine.ItemShopTypeEquipment = 2;
        /** 奖励判断类型_直接发放奖励 */
        BaseDefine.RewardTypeDirect = 0;
        /** 奖励判断类型_按权重随机出其中一个 */
        BaseDefine.RewardTypeRandom = 1;
        /** 奖励判断类型_按概率全部判断是否掉落 */
        BaseDefine.RewardTypeProbability = 2;
        /** 奖励类型 */
        BaseDefine.ItemRewardType = 1;
        /** 奖励对应id */
        BaseDefine.ItemRewardId = 2;
        /** 奖励数量 */
        BaseDefine.ItemRewardNum = 3;
        /** 品质颜色列表  字体亮色*/
        BaseDefine.LabelColor = {
            1: "#ffffff",
            2: "#c5ffa5",
            3: "#a5d8ff",
            4: "#efa5ff",
            5: "#ffcfa5",
            6: "#ffa5a7",
        };
        /** 颜色列表 邮件  字体暗色*/
        BaseDefine.LabelColor1 = {
            1: "#ffffff",
            2: "#2b5b5c",
            3: "#38429f",
            4: "#62376c",
            5: "#5a4528",
            6: "#892e36",
        };
        /** 品质背景列表  头像框*/
        BaseDefine.QualityList = {
            3: "ui_hero/img-lanpingzhilkuang.png",
            4: "ui_hero/img-zhipinzhikuang.png",
            5: "ui_hero/img-huangpingzhikuang.png",
            6: "ui_hero/img-hongpingzhikuang.png",
        };
        /**英雄详情 背景颜色 */
        BaseDefine.HeroAllinfo_bg = {
            3: "ui_hero/img-yingxiong-zhanshi-lan.png",
            4: "ui_hero/img-yingxiong-zhanshi-zi.png",
            5: "ui_hero/img-yingxiong-zhanshi-huang.png",
            6: "ui_hero/img-yingxiong-zhanshi-hong.png",
        };
        BaseDefine.BackGround_k = {
            3: "ui_hero/img-lanka.png",
            4: "ui_hero/img-zika.png",
            5: "ui_hero/img-chengka.png",
            6: "ui_hero/img-hongka.png",
        };
        /**神兽名字的颜色 */
        BaseDefine.PetColor_label = {
            1: "#ffffff",
            2: "#c5ffa5",
            3: "#a9c3fe",
            4: "#e69bff",
            5: "#ffba7b",
            6: "#ff9595",
        };
        /**神兽背景颜色 */
        BaseDefine.PetColor_img = {
            2: "",
            3: "ui_hero/img-yingxiong-zhanshi-lan.png",
            4: "ui_hero/img-yingxiong-zhanshi-zi.png",
            5: "ui_hero/img-yingxiong-zhanshi-huang.png",
            6: "ui_hero/img-yingxiong-zhanshi-hong.png",
        };
        /** 品质背景列表*/
        BaseDefine.HeroQualityList = {
            3: "ui_hero/img-lanka.png",
            4: "ui_hero/img-zika.png",
            5: "ui_hero/img-chengka.png",
            6: "ui_hero/img-hongka.png",
        };
        BaseDefine.HeroQualityStr = {
            3: "蓝色",
            4: "紫色",
            5: "橙色",
            6: "红色",
        };
        /** 英雄类型图标列表*/
        BaseDefine.HeroTypeIcon = {
            1: "ui_hero/icon-renwu-leixing-gongji.png",
            2: "ui_hero/icon-renwu-leixing-fangyu.png",
        };
        /** 英雄类型*/
        BaseDefine.HeroTypeStr = {
            1: "攻击型",
            2: "防御型",
        };
        /**英雄头像上的字 */
        BaseDefine.HeroWar_pos = {
            1: "ui_hero/img-yingxiong-zhiwei-duizhang.png",
            2: "ui_hero/img-yingxiong-zhiwei-zhen.png",
        };
        /**英雄卡牌品质信息 */
        BaseDefine.Hero_Rare = {
            3: "普通",
            4: "稀有",
            5: "传奇",
            6: "神话",
        };
        BaseDefine.ButtonStr = {
            1: "角色",
            2: "英雄",
            3: "神兽",
            4: "装备",
            5: "排行",
            6: "商城",
            7: "邮件",
            8: "聊天",
            9: "阵营",
        };
        /**阵营信息字体颜色 */
        BaseDefine.CampInfo_Color = {
            1: "#bfc6ff",
            2: "#ffa5a7",
            3: "#e1aaf3",
            4: "#ffcdb1",
            5: "#fefeff",
        };
        /**阵营信息内容 */
        BaseDefine.CampInfo_text = {
            1: 6020,
            2: 6022,
            3: 6021,
        };
        /**时空法器品质 */
        BaseDefine.EquipQualityStr = {
            1: "普通",
            3: "五福",
            4: "稀有",
            5: "传奇",
        };
        /**时空法器品质颜色 */
        BaseDefine.EquipQualityColor = {
            2: "#c5ffa5",
            3: "#a5d8ff",
            4: "#efa5ff",
            5: "#ffcfa5",
        };
        BaseDefine.EquipBgColor = {
            2: "ui_hero/img-lvpingzhikuang.png",
            3: "ui_hero/img-lanpingzhilkuang.png",
            4: "ui_hero/img-zhipinzhikuang.png",
            5: "ui_hero/img-huangpingzhikuang.png",
            6: "ui_hero/img-hongpingzhikuang.png",
        };
        /**天梯道具底图  */
        BaseDefine.LadderItemBgColor = {
            7: "#2b5b5c",
            3: "#38429f",
            4: "#62376c",
            5: "#5a4528",
            6: "#892e36",
        };
        /**道具底图颜色  暗色*/
        BaseDefine.ItemBgColor = {
            7: "#364431",
            3: "#373f59",
            4: "#4f3061",
            5: "#453d2f",
            6: "#632f2f",
        };
        /**背景框图片公用 */
        BaseDefine.PubBgUrl = {
            2: "ui_hero/img-lvpingzhikuang.png",
            3: "ui_hero/img-lanpingzhilkuang.png",
            4: "ui_hero/img-zhipinzhikuang.png",
            5: "ui_hero/img-huangpingzhikuang.png",
            6: "ui_hero/img-hongpingzhikuang.png",
        };
        BaseDefine.Start_Icon = {
            0: "ui_icon/icon-yixing-tianti.png",
            1: "ui_icon/icon-erxing-tianti.png",
            2: "ui_icon/icon-sanxing-tianti.png",
            3: "ui_icon/icon-canyujiang-tianti.png" //安慰
        };
        BaseDefine.Start_Name = {
            0: "一星奖励",
            1: "二星奖励",
            2: "三星奖励",
            3: "参与奖" //安慰
        };
        /**战斗更新的频率 */
        BaseDefine.LoopTime = 100;
        BaseDefine.ShareText = {
            1: "好玩有趣上手So Easy",
            2: "卖萌耍阴为所欲为",
            3: "全球恶意社交开启",
            4: "收藏解锁停不下来",
            5: "一招制敌究极搞怪"
        };
        return BaseDefine;
    }());
    H52D_Framework.BaseDefine = BaseDefine;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=BaseDefine.js.map