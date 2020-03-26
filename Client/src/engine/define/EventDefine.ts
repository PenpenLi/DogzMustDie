module H52D_Framework {
    /** 自定义事件消息 */
    export class EventDefine {
        /** 更新加载 */
        public static readonly UPDATE_LOADING_SLIDER_VALUE: string = "UPDATE_LOADING_SLIDER_VALUE";
        /** 查看广告 */
        public static readonly WATCH_ADVERTISMENT = "WATCH_ADVERTISMENT";
        /** 游戏开始 */
        public static readonly GAME_START: string = "GAME_START";
        /** 显示场景 */
        public static readonly SHOW_SCENE: string = "SHOW_SCENE";
        /** 关闭场景 */
        public static readonly CLOSE_SCENE: string = "CLOSE_SCENE";
        /** 开始战斗 */
        public static readonly BEGIN_FIRE: string = "BEGIN_FIRE";
        /** 玩家名字更新 */
        public static readonly PLAYER_NAME_UPDATE: string = "PLAYER_NAME_UPDATE";
        /** 玩家头像更新 */
        public static readonly PLAYER_HEAD_UPDATE: string = "PLAYER_HEAD_UPDATE";
        /** 主界面点击事件 */
        public static readonly MAIN_VIEW_CLICK: string = "MAIN_VIEW_CLICK";
        /** 血量更新事件 */
        public static readonly BLOOD_SILDER_UPDATE: string = "BLOOD_SILDER_UPDATE";
        /** 关卡_当前关卡 */
        public static readonly CUSTOMS_CURRENT: string = "CUSTOMS_CURRENT";
        /** 关卡_怪物信息 */
        public static readonly CUSTOMS_BASEINFOR: string = "CUSTOMS_BASEINFOR";
        /** 关卡_掉血量 */
        public static readonly CUSTOMS_DROP_BLOOD: string = "CUSTOMS_DROP_BLOOD";
        /** 修改英雄伤害*/
        public static readonly MODIFY_HERO_DAMAGE: string = "MODIFY_HERO_DAMAGE";
        /** 释放技能 */
        public static readonly SPELL_SKILL: string = "SPELL_SKILL";
        /** 技能解锁 */
        public static readonly SKILL_UNLOKE: string = "SKILL_UNLOKE";
        /** UI面板，全开或半开 */
        public static readonly BOTTOM_SET_PANEL: string = "BOTTOM_SET_PANEL";
        /** UI面板，全开或半开 */
        public static readonly BOTTOM_GET_PANEL: string = "BOTTOM_GET_PANEL";
        /** 增加金币 */
        public static readonly ADD_GOLD: string = "ADD_GOLD";
        /** 增加钻石 */
        public static readonly ADD_DIAMONDS: string = "ADD_DIAMONDS";

        /**英雄伤害DPS显示 */
        public static readonly HERO_DPS: string = "HERO_DPS";
        /**神宠伤害DPS显示 */
        public static readonly PET_DPS: string = "PET_DPS";
        /**阵营伤害DPS显示 */
        public static readonly CAMP_DPS: string = "CAMP_DPS";
        /**所有伤害DPS显示 */
        public static readonly ALL_DPS: string = "ALL_DPS";

        /**将金币加入到主界面ClickBg下面 */
        public static readonly DROP_ADD_CHILD = "COIN_Add_CHILD";

        /**怪物死亡 */
        public static readonly MONSTER_DIE = "MONSTER_DIE";

        public static readonly MONSTER_DIE_N = "MONSTER_DIE_N";
        /**点击次数 */
        public static readonly TAP_NUMBER = "TAP_NUMBER";

        /**队长技能 */
        public static readonly CAPATIAN_SKILL = "CAPATIAN_SKILL";
        public static readonly PVP_CAPATIAN_SKILL = "PVP_CAPATIAN_SKILL";
        /**升级或者进阶 修改战斗属性 */
        public static readonly MODIFYATTR = "MODIFYATTR";
        /**特权系统 */
        public static readonly PRIVILEGE = "PRIVILEGE";
        /**特权删除 */
        public static readonly PRIVILEGE_DELETE = "PRIVILEGE_DELETE";
        /**刷新固定属性*/
        public static readonly REFFIXEDATTR = "REFFIXEDATTR";
        /**切换闯关模式*/
        public static readonly BOSSHANDER = "BOSSHANDER";

        public static readonly CAPATIAN_SKILL_AUTO = "CAPATIAN_SKILL_AUTO";

    }
}