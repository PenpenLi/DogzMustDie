/*
* name;
*/
module H52D_Framework {
    export class InstMsg {
        private _InstID = 0
        private _FreeList: Array<number> = []
        private _UseMap = {}
        private _Num = 0
        /** 获取一个新的实力ID */
        public GetNewInstID() {
            let nNewInstID = 0
            if (this._FreeList.length > 0) {
                nNewInstID = this._FreeList.pop()
            } else {
                this._InstID += 1
                nNewInstID = this._InstID
            }
            this._UseMap[nNewInstID] = 1
            this._Num += 1
            return nNewInstID
        }

        /** 释放回收ID */
        public RemInstID(nInstID) {
            if (this._UseMap[nInstID] != 1) {
                return false
            }
            this._UseMap[nInstID] = 0
            this._FreeList.push(nInstID)
            this._Num -= 1
            return true
        }
    }
}