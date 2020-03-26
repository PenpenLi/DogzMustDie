/**
* name
*/
var H52D_Framework;
(function (H52D_Framework) {
    var SelectTarget = /** @class */ (function () {
        function SelectTarget() {
        }
        /**设置作用目标 -- 被动  属性 选择目标 */
        SelectTarget.ImpactTarget = function (id, owner) {
            var target = [];
            var key = [];
            var attr = new H52D_Framework.Attribute();
            var target_id = attr.GetAttributeTargetID(id);
            var Ahero = H52D_Framework.HeroManager.Instance.Herolist;
            var pet = H52D_Framework.PetManager.Instance.OwnPetList;
            for (var k in Ahero) {
                key.push(k);
            }
            switch (target_id) {
                case 0:
                    target.push(owner);
                    break;
                case 1:
                    target.push(H52D_Framework.MasterPlayer.Instance.player.vo);
                    break;
                case 2:
                    for (var i = 0; i < H52D_Framework.GetTabLength(Ahero); i++) {
                        var heroinfo = Ahero[key[i]];
                        if (heroinfo.HeroType == 1) {
                            target.push(heroinfo);
                        }
                    }
                    break;
                case 3:
                    for (var i = 0; i < H52D_Framework.GetTabLength(Ahero); i++) {
                        var heroinfo = Ahero[key[i]];
                        if (heroinfo.HeroType == 2) {
                            target.push(heroinfo);
                        }
                    }
                    break;
                case 4:
                    for (var i = 0; i < H52D_Framework.GetTabLength(Ahero); i++) {
                        var heroinfo = Ahero[key[i]];
                        target.push(heroinfo);
                    }
                    break;
                case 5:
                    target.push(H52D_Framework.PetManager.Instance.GetPet_Instance(H52D_Framework.PetManager.Instance.CurrentpetID));
                    break;
                case 6:
                    target.push(H52D_Framework.BCampManager.Instance.vo);
                    break;
                case 7:
                    for (var i = 0; i < H52D_Framework.GetTabLength(Ahero); i++) {
                        var heroinfo = Ahero[key[i]];
                        target.push(heroinfo);
                    }
                    target.push(H52D_Framework.MasterPlayer.Instance.player.vo);
                    for (var k in pet) {
                        if (pet[k]) {
                            target.push(pet[k]);
                        }
                    }
                    target.push(H52D_Framework.BCampManager.Instance.vo);
                    break;
            }
            return target;
        };
        SelectTarget.PImpactTarget = function (id, data) {
            var player = data["player"];
            var heroList = data["heroList"];
            var pet = data["pet"][0];
            var camp = data["camp"];
            var attr = new H52D_Framework.Attribute();
            var target_id = attr.GetAttributeTargetID(id);
            var target = [];
            switch (target_id) {
                case 1:
                    target.push(player);
                    break;
                case 2:
                    for (var k in heroList) {
                        if (heroList[k] && heroList[k].hero_Type == 1) {
                            target.push(heroList[k]);
                        }
                    }
                    break;
                case 3:
                    for (var k in heroList) {
                        if (heroList[k] && heroList[k].hero_Type == 2) {
                            target.push(heroList[k]);
                        }
                    }
                    break;
                case 4:
                    for (var k in heroList) {
                        if (heroList[k]) {
                            target.push(heroList[k]);
                        }
                    }
                    break;
                case 5:
                    target.push(pet);
                    break;
                case 6:
                    target.push(camp);
                    break;
                case 7:
                    for (var k in heroList) {
                        if (heroList[k]) {
                            target.push(heroList[k]);
                        }
                    }
                    target.push(camp);
                    target.push(pet);
                    break;
            }
            return target;
        };
        SelectTarget.BuffTarget = function (buffdata, statusTarget, owner, btype) {
            if (btype === void 0) { btype = 1; }
            var target = [];
            var monster;
            var Harr;
            if (btype == 1) {
                if (H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList) {
                    Harr = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList;
                }
                if (H52D_Framework.BattleManager.Instance.MonsterFormation) {
                    monster = H52D_Framework.BattleManager.Instance.MonsterFormation.Getobject;
                }
            }
            else {
                if (H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList) {
                    monster = H52D_Framework.BattleManager.Instance.HeroCardMgr.CHeroList;
                }
                if (H52D_Framework.BattleManager.Instance.MonsterFormation) {
                    Harr = H52D_Framework.BattleManager.Instance.MonsterFormation.Getobject;
                }
            }
            switch (statusTarget) {
                /**自己 */
                case 1:
                    target.push(owner);
                    break;
                /**敌人 */
                case 2:
                    if (owner && owner.Target && owner.type != eCharacter_TYPE.MONSTER) {
                        target = owner.Target.concat();
                    }
                    else if (owner.type == eCharacter_TYPE.MONSTER) {
                        target = owner.CCTarget.concat();
                    }
                    break;
                /**我方队长 */
                case 3:
                    for (var i = 0; i < Harr.length; i++) {
                        if (Harr[i]) {
                            if (Harr[i].vo.location == 4) {
                                target.push(Harr[i]);
                            }
                        }
                    }
                    break;
                /**敌方队长 */
                case 4:
                    for (var k in monster) {
                        var m = monster[k];
                        if (m && m.vo.location == 4) {
                            target.push(m);
                        }
                    }
                    break;
                /**同排英雄 */
                case 5:
                    for (var i = 0; i < Harr.length; i++) {
                        if (Harr[i]) {
                            var rowNum = owner.vo.rowNum;
                            if (Harr[i].vo.rowNum == rowNum && owner.ID != Harr[i].ID) {
                                target.push(Harr[i]);
                            }
                        }
                    }
                    break;
                /**同列英雄 */
                case 6:
                    for (var i = 0; i < Harr.length; i++) {
                        if (Harr[i]) {
                            var colNum = owner.vo.colNum;
                            if (Harr[i].vo.colNum == colNum && owner.ID != Harr[i].ID) {
                                target.push(Harr[i]);
                            }
                        }
                    }
                    break;
                /**与队长范围内一格的英雄 */
                case 7:
                    for (var i = 0; i < Harr.length; i++) {
                        if (Harr[i]) {
                            var location_1 = Harr[i].vo.location;
                            if (location_1 == 1
                                || location_1 == 3
                                || location_1 == 5
                                || location_1 == 7) {
                                target.push(Harr[i]);
                            }
                        }
                    }
                    break;
                /**所有出战但未激活的英雄 */
                case 8:
                    var hclist = H52D_Framework.HeroManager.Instance.NHero();
                    for (var i = 0; i < hclist.length; i++) {
                        var hcdata = H52D_Framework.HeroManager.Instance.GetHero(hclist[i]);
                        var hc = new H52D_Framework.HeroCard(hcdata);
                        target.push(hc);
                    }
                    break;
                /**所有出战的英雄 */
                case 9:
                    target = Harr.concat();
                    break;
            }
            var id = buffdata.attributeId;
            if (!statusTarget || statusTarget == 0) {
                target = Harr.concat();
                if (id == 17 || id == 27 || id == 37 || id == 47) {
                    target.push(H52D_Framework.MasterPlayer.Instance.player);
                    target.push(H52D_Framework.BPetManager.Instance.PetIns);
                    target.push(H52D_Framework.BCampManager.Instance.Camp);
                }
            }
            return target;
        };
        SelectTarget.PBuffTarget = function (buffdata, statusTarget, owner, btype, belongs) {
            var target = [];
            var Owner = [];
            var Enemy = [];
            var player = null;
            var pet = null;
            var camp = null;
            if (btype == 1) {
                Owner = H52D_Framework.BattlefieldManager.Instance.Characterlist[0].HeroList;
                Enemy = H52D_Framework.BattlefieldManager.Instance.Characterlist[1].HeroList;
                player = H52D_Framework.BattlefieldManager.Instance.Characterlist[0].player;
                if (H52D_Framework.BattlefieldManager.Instance.Characterlist[0].petMgr)
                    pet = H52D_Framework.BattlefieldManager.Instance.Characterlist[0].petMgr.PetIns;
                if (H52D_Framework.BattlefieldManager.Instance.Characterlist[0].campMgr)
                    camp = H52D_Framework.BattlefieldManager.Instance.Characterlist[0].campMgr.Camp;
            }
            else {
                Owner = H52D_Framework.BattlefieldManager.Instance.Characterlist[1].HeroList;
                Enemy = H52D_Framework.BattlefieldManager.Instance.Characterlist[0].HeroList;
                player = H52D_Framework.BattlefieldManager.Instance.Characterlist[1].player;
                if (H52D_Framework.BattlefieldManager.Instance.Characterlist[1].petMgr)
                    pet = H52D_Framework.BattlefieldManager.Instance.Characterlist[1].petMgr.PetIns;
                if (H52D_Framework.BattlefieldManager.Instance.Characterlist[1].campMgr)
                    camp = H52D_Framework.BattlefieldManager.Instance.Characterlist[1].campMgr.Camp;
            }
            switch (statusTarget) {
                /**自己 */
                case 1:
                    target.push(owner);
                    break;
                /**敌人 */
                case 2:
                    if (belongs == eBELONGS_TO.BIG) {
                        target = owner.CCTarget.concat();
                    }
                    else {
                        if (owner || owner.Target) {
                            target = owner.Target.concat();
                        }
                    }
                    break;
                /**我方队长 */
                case 3:
                    for (var i = 0; i < Owner.length; i++) {
                        if (Owner[i]) {
                            if (Owner[i].vo.location == 4) {
                                target.push(Owner[i]);
                            }
                        }
                    }
                    break;
                /**敌方队长 */
                case 4:
                    for (var k in Enemy) {
                        var m = Enemy[k];
                        if (m && m.vo.location == 4) {
                            target.push(m);
                        }
                    }
                    break;
                /**同排英雄 */
                case 5:
                    for (var i = 0; i < Owner.length; i++) {
                        if (Owner[i]) {
                            var rowNum = owner.vo.rowNum;
                            if (Owner[i].vo.rowNum == rowNum && owner.ID != Owner[i].ID) {
                                target.push(Owner[i]);
                            }
                        }
                    }
                    break;
                /**同列英雄 */
                case 6:
                    for (var i = 0; i < Owner.length; i++) {
                        if (Owner[i]) {
                            var colNum = owner.vo.colNum;
                            if (Owner[i].vo.colNum == colNum && owner.ID != Owner[i].ID) {
                                target.push(Owner[i]);
                            }
                        }
                    }
                    break;
                /**与队长范围内一格的英雄 */
                case 7:
                    for (var i = 0; i < Owner.length; i++) {
                        if (Owner[i]) {
                            var location_2 = Owner[i].vo.location;
                            if (location_2 == 1
                                || location_2 == 3
                                || location_2 == 5
                                || location_2 == 7) {
                                target.push(Owner[i]);
                            }
                        }
                    }
                    break;
                /**所有出战但未激活的英雄 */
                case 8:
                    var hclist = H52D_Framework.HeroManager.Instance.NHero();
                    for (var i = 0; i < hclist.length; i++) {
                        var hcdata = H52D_Framework.HeroManager.Instance.GetHero(hclist[i]);
                        var hc = new H52D_Framework.HeroCard(hcdata);
                        target.push(hc);
                    }
                    break;
                /**所有出战的英雄 */
                case 9:
                    target = Owner.concat();
                    break;
            }
            var id = buffdata.attributeId;
            if (!statusTarget || statusTarget == 0) {
                target = Owner.concat();
                if (id == 17 || id == 27 || id == 37 || id == 47) {
                    target.push(player);
                    target.push(pet);
                    target.push(camp);
                }
            }
            return target;
        };
        return SelectTarget;
    }());
    H52D_Framework.SelectTarget = SelectTarget;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SelectTarget.js.map