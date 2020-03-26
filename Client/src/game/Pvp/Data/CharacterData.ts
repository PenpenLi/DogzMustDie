module H52D_Framework {
    /**
     * PVP战斗数据类
     * @author zhang zhenming
     */
    export class CharacterData {

        private _Info = [];
        public get Info() { return this._Info; }

        public GetData(war: Object, petid: number) {
            this._Info = [];
            let h = this.GetHeroInfo(war);
            let p = this.GetPetInfo(petid);
            let c = this.GetCampInfo();
            this._Info.push(h);
            this._Info.push(p);
            this._Info.push(c);
            return this._Info;
        }

        private GetHeroInfo(War: Object) {
            let info = [];
            for (let _id in War) {
                let vo: HeroInfo = HeroManager.Instance.GetHero(War[_id]);
                if (!vo) {
                    continue;
                }
                vo.location = Number(_id);
                info.push(vo);
            }
            return info;
        }

        private GetPetInfo(id) {
            let info = {}
            if (id > 0) {
                info = BPetManager.Instance.LoadBPetinfo(id);
            }
            return info;
        }

        private GetCampInfo() {
            let info = {}
            if (MasterPlayer.Instance.player.CampID > 0)
                info = BCampManager.Instance.vo;
            return info;
        }

        constructor() { }

    }
}