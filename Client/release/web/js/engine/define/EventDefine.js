var H52D_Framework;
(function (H52D_Framework) {
    /** 自定义事件消息 */
    var EventDefine = /** @class */ (function () {
        function EventDefine() {
        }
        /** 更新加载 */
        EventDefine.UPDATE_LOADING_SLIDER_VALUE = "UPDATE_LOADING_SLIDER_VALUE";
        /** 查看广告 */
        EventDefine.WATCH_ADVERTISMENT = "WATCH_ADVERTISMENT";
        /** 游戏开始 */
        EventDefine.GAME_START = "GAME_START";
        /** 显示场景 */
        EventDefine.SHOW_SCENE = "SHOW_SCENE";
        /** 关闭场景 */
        EventDefine.CLOSE_SCENE = "CLOSE_SCENE";
        /** 开始战斗 */
        EventDefine.BEGIN_FIRE = "BEGIN_FIRE";
        /** 玩家名字更新 */
        EventDefine.PLAYER_NAME_UPDATE = "PLAYER_NAME_UPDATE";
        /** 玩家头像更新 */
        EventDefine.PLAYER_HEAD_UPDATE = "PLAYER_HEAD_UPDATE";
        /** 主界面点击事件 */
        EventDefine.MAIN_VIEW_CLICK = "MAIN_VIEW_CLICK";
        /** 血量更新事件 */
        EventDefine.BLOOD_SILDER_UPDATE = "BLOOD_SILDER_UPDATE";
        /** 关卡_当前关卡 */
        EventDefine.CUSTOMS_CURRENT = "CUSTOMS_CURRENT";
        /** 关卡_怪物信息 */
        EventDefine.CUSTOMS_BASEINFOR = "CUSTOMS_BASEINFOR";
        /** 关卡_掉血量 */
        EventDefine.CUSTOMS_DROP_BLOOD = "CUSTOMS_DROP_BLOOD";
        /** 修改英雄伤害*/
        EventDefine.MODIFY_HERO_DAMAGE = "MODIFY_HERO_DAMAGE";
        /** 释放技能 */
        EventDefine.SPELL_SKILL = "SPELL_SKILL";
        /** 技能解锁 */
        EventDefine.SKILL_UNLOKE = "SKILL_UNLOKE";
        /** UI面板，全开或半开 */
        EventDefine.BOTTOM_SET_PANEL = "BOTTOM_SET_PANEL";
        /** UI面板，全开或半开 */
        EventDefine.BOTTOM_GET_PANEL = "BOTTOM_GET_PANEL";
        /** 增加金币 */
        EventDefine.ADD_GOLD = "ADD_GOLD";
        /** 增加钻石 */
        EventDefine.ADD_DIAMONDS = "ADD_DIAMONDS";
        /**英雄伤害DPS显示 */
        EventDefine.HERO_DPS = "HERO_DPS";
        /**神宠伤害DPS显示 */
        EventDefine.PET_DPS = "PET_DPS";
        /**阵营伤害DPS显示 */
        EventDefine.CAMP_DPS = "CAMP_DPS";
        /**所有伤害DPS显示 */
        EventDefine.ALL_DPS = "ALL_DPS";
        /**将金币加入到主界面ClickBg下面 */
        EventDefine.DROP_ADD_CHILD = "COIN_Add_CHILD";
        /**怪物死亡 */
        EventDefine.MONSTER_DIE = "MONSTER_DIE";
        EventDefine.MONSTER_DIE_N = "MONSTER_DIE_N";
        /**点击次数 */
        EventDefine.TAP_NUMBER = "TAP_NUMBER";
        /**队长技能 */
        EventDefine.CAPATIAN_SKILL = "CAPATIAN_SKILL";
        EventDefine.PVP_CAPATIAN_SKILL = "PVP_CAPATIAN_SKILL";
        /**升级或者进阶 修改战斗属性 */
        EventDefine.MODIFYATTR = "MODIFYATTR";
        /**特权系统 */
        EventDefine.PRIVILEGE = "PRIVILEGE";
        /**特权删除 */
        EventDefine.PRIVILEGE_DELETE = "PRIVILEGE_DELETE";
        /**刷新固定属性*/
        EventDefine.REFFIXEDATTR = "REFFIXEDATTR";
        /**切换闯关模式*/
        EventDefine.BOSSHANDER = "BOSSHANDER";
        EventDefine.CAPATIAN_SKILL_AUTO = "CAPATIAN_SKILL_AUTO";
        return EventDefine;
    }());
    H52D_Framework.EventDefine = EventDefine;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=EventDefine.js.map