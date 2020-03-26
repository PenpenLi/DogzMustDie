/*
* AI计算类;
*/
//备注：战斗流程
module H52D_Framework {
    export class AIOperation {

        private heroDpsNum: number = 0;

        private _campDps: number = 0;
        /**阵营DPS */
        public get CampDps() { return this._campDps; }

        private _heroDps: number = 0;
        /**英雄DPS */
        public get HeroDps() { return this._heroDps; }

        private _petDps: number = 0;
        /**神兽DPS */
        public get PetDps() { return this._petDps; }

        private _allDps: number = 0;
        /**总DPS */
        public get AllDps() { return this._allDps; }

        constructor() {
            this.heroDpsNum = MasterPlayer.Instance.GetEventProByType(EventProEnum.HeroDPS);
            Event.RegistEvent(EventDefine.MODIFYATTR, Laya.Handler.create(this, this.Dps));
        }

        /**销毁 */
        public Destroy() {
            Event.RemoveEvent(EventDefine.MODIFYATTR, Laya.Handler.create(this, this.Dps));
        }
        
        public OnUpdate(): void {

        }

        /**面板展示神兽伤害 不算秒伤 */
        public PetShoWDamage: number = 0;

        /**DPS小面板 */
        public Dps() {
            this._allDps = 0;
            this._petDps = 0;
            this._heroDps = 0;
            this._campDps = 0;
            this.PetShoWDamage = 0;
            if (BattleManager.Instance.HeroCardMgr) {
                let count = BattleManager.Instance.HeroCardMgr.CHeroList.length;
                for (let index = 0; index < count; index++) {
                    let heroC = BattleManager.Instance.HeroCardMgr.CHeroList[index];
                    if (heroC) {
                        let cd = heroC.attackSkill ? (heroC.attackSkill.Data.skillCD) / 1000 : 1.5;
                        let dps = heroC.vo.attr.GetAttributeValue(2) / cd;
                        this._heroDps += dps >> 0;
                        this._petDps += heroC.vo.attr.GetAttributeValue(2);
                        this.PetShoWDamage += heroC.vo.attr.GetAttributeValue(2);
                    }
                }
            }

            if (this.heroDpsNum < this._heroDps) {
                this.heroDpsNum = this._heroDps;
                //英雄DPS最大值
                MasterPlayer.Instance.ReqOnEvent(EventProEnum.HeroDPS, this.heroDpsNum);
            }
            /**通知修改英雄DPS显示 */
            Event.DispatchEvent(EventDefine.HERO_DPS, [this._heroDps.toString()]);
            /**通知修改神兽DPS显示 */
            if (BPetManager.Instance.PetIns) {
                BPetManager.Instance.PetIns.vo.attr.SetAttributeValue(2, eValueType.Base, this._petDps >> 0);
                this._petDps = this._petDps * BPetManager.Instance.PetIns.vo.ratio;
                this._petDps = this._petDps / BPetManager.Instance.PetIns.vo.CD;
                Event.DispatchEvent(EventDefine.PET_DPS, this._petDps >> 0);
                this._allDps = this._petDps + this._heroDps >> 0;
            }
            else {
                this._allDps = this._heroDps;
            }
            /**知修改阵营DPS显示*/
            if (BCampManager.Instance.Camp) {
                BCampManager.Instance.Camp.vo.setDamage();
                this._campDps = BCampManager.Instance.Camp.vo.attr.GetAttributeValue(2) * BCampManager.Instance.Camp.vo.ratio;
                let cd = BCampManager.Instance.Camp.vo.CD;
                this._campDps = this._campDps / BCampManager.Instance.Camp.vo.CD >> 0;
                Event.DispatchEvent(EventDefine.CAMP_DPS, this._campDps);
            }
            this._allDps = this._allDps + this._campDps;
            /**通知修改所有伤害DPS显示 */
            Event.DispatchEvent(EventDefine.ALL_DPS, [this._allDps.toString()]);
        }
        
        /**计算点击暴击 */
        private IsCrit(): boolean {
            let randnum = Math.random() * 10000;
            if (randnum == 0) return false;
            if (randnum <= MasterPlayer.Instance.player.vo.attr.GetAttributeValue(4)) {
                return true;
            }
            return false;
        }

        /**点击目标伤害 */
        private EnemyOnHurt(damage: number, bScrit) {
            let monsterarr = MonsterManager.Instance.monsterList;
            let num = GetTabLength(monsterarr);
            for (let j = 0; j < num; j++) {
                if (monsterarr[j] != null) {
                    damage = damage * monsterarr[j].vo.allDamgeReduction;
                    monsterarr[j].OnHurt(damage >> 0, SkinEnum.SkinTap, bScrit);
                    return;
                }
            }
        }

        /**执行ai计算并触发攻击指令 */
        public Do(): any {
            let data = new SkillData(100);
            if (MasterPlayer.Instance.Damage == 999999999) {
                let color: SkinEnum = SkinEnum.SkinTap;
                BattleManager.Instance.clickCritNum++;
                this.EnemyOnHurt(MasterPlayer.Instance.Damage >> 0, false);
                return { [1]: MasterPlayer.Instance.Damage >> 0, [2]: color, [3]: false };
            }
            else {
                let damage = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(2);
                let color: SkinEnum = SkinEnum.SkinTap;
                let isCrit = false;
                if (this.IsCrit()) {
                    isCrit = true;
                    let ratio = MasterPlayer.Instance.player.vo.attr.GetAttributeValue(5) / 10000;
                    damage = damage * ratio;
                    BattleManager.Instance.clickCritNum++;
                }
                this.EnemyOnHurt(damage + data.fixedDamage >> 0, isCrit);
                return { [1]: damage + data.fixedDamage >> 0, [2]: color, [3]: isCrit };
            }
        }

    }
}
