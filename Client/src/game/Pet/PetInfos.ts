

module H52D_Framework {
    /**神兽信息类 */
    export class PetInfos {
        private static _init: PetInfos;

        private _petname: string;

        private _petID: number;

        private _petLv: number;
        constructor() {

        }

        /** 解析服务器数据 */
        public unpackData(tData) {
            this._petID = tData[1]
            this._petLv = tData[2]
            //Event.RegistEvent(EventDefine.MODIFYATTR, Laya.Handler.create(this, this.LevelComplete)); 
        }

        /**神兽ID */
        public get PetID(): number {
            return this._petID;
        }
        public set PetID(id) {
            this._petID = id;
        }

        /**神兽等级 */
        public get PetLv() {
            return this._petLv;
        }

        public set PetLv(lv) {
            this._petLv = lv;
        }
    }
}
