/**
* 属性被动管理
*/
var H52D_Framework;
(function (H52D_Framework) {
    /***属性被动技能管理*/
    var AttributePassiveManager = /** @class */ (function () {
        function AttributePassiveManager() {
            /**被动属性技能列表 */
            this._attributePassive = [];
        }
        Object.defineProperty(AttributePassiveManager, "Instance", {
            get: function () {
                if (!AttributePassiveManager._instance) {
                    AttributePassiveManager._instance = new AttributePassiveManager();
                }
                return AttributePassiveManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        /**初始化被动 */
        AttributePassiveManager.prototype.Init = function () {
            this._attributePassive = [];
            var idList = [];
            var Ahero = H52D_Framework.HeroManager.Instance.Herolist;
            /**获取所有英雄的被动ID */
            for (var k in Ahero) {
                var info = Ahero[k];
                for (var j = 0; j < info.attributeID.length; j++) {
                    var ele = { id: info.attributeID[j], heroid: info.nHeroID };
                    idList.push(ele);
                }
            }
            /**初始化属性被动技能 */
            for (var i = 0; i < idList.length; i++) {
                var id = idList[i].id;
                var heroid = idList[i].heroid;
                var data = new H52D_Framework.PassiveSkillData(id);
                var pas = new H52D_Framework.ModfiyAttribute(Ahero[heroid], data.scriptParam);
                this._attributePassive.push(pas);
            }
            /**产生被动加属性效果 */
            for (var i = 0; i < this._attributePassive.length; i++) {
                if (this._attributePassive[i]) {
                    this._attributePassive[i].OnEffect();
                }
            }
            /**刷新小面板UI*/
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.REFFIXEDATTR);
        };
        /**解锁属性被动 */
        AttributePassiveManager.prototype.OnLock = function (id, heroid) {
            var Ahero = H52D_Framework.HeroManager.Instance.Herolist;
            var type_id = H52D_Framework.PassiveSkillConfig[id]["scriptID"];
            if (type_id == 1) {
                var data = new H52D_Framework.PassiveSkillData(id);
                var pas = new H52D_Framework.ModfiyAttribute(Ahero[heroid], data.scriptParam);
                pas.OnEffect();
                this._attributePassive.push(pas);
            }
            /**刷新小面板UI*/
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.REFFIXEDATTR);
        };
        AttributePassiveManager.prototype.Update = function () {
            for (var k in H52D_Framework.HeroManager.Instance.Herolist) {
                H52D_Framework.HeroManager.Instance.Herolist[k].UpdateAttrbute();
            }
            H52D_Framework.MasterPlayer.Instance.player.vo.UpdatePassive();
            if (H52D_Framework.MasterPlayer.Instance.player.CampID > 0) {
                H52D_Framework.BCampManager.Instance.vo.UpdatePassiveAttribute();
            }
            if (H52D_Framework.PetManager.Instance.CurrentpetID > 0) {
                var petvo = H52D_Framework.PetManager.Instance.GetPet_Instance(H52D_Framework.PetManager.Instance.CurrentpetID);
                petvo.UpdatePassiveAttribute();
            }
            for (var i = 0; i < this._attributePassive.length; i++) {
                if (this._attributePassive[i]) {
                    this._attributePassive[i].OnEffect();
                }
            }
            /**更新小面板属性 */
            H52D_Framework.Event.DispatchEvent(H52D_Framework.EventDefine.REFFIXEDATTR);
        };
        AttributePassiveManager._instance = null;
        return AttributePassiveManager;
    }());
    H52D_Framework.AttributePassiveManager = AttributePassiveManager;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=AttributePassiveManager.js.map