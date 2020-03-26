var H52D_Framework;
(function (H52D_Framework) {
    /**
     * @class 时段记忆划线功能类
     * @author zhangyusong
     */
    var MemoryArrangement = /** @class */ (function () {
        function MemoryArrangement(img_icon, img_line) {
            this.dungeonLocalY = 0;
            this.iconbg = img_icon;
            this.linebg = img_line;
            this.ViewInit();
        }
        MemoryArrangement.prototype.ViewInit = function () {
            //上一个线的入口
            var prevInto = 0;
            this.dataList = H52D_Framework.CopyConfig[H52D_Framework.MemoryType.equip];
            this.modelList = [];
            //当前关卡ID
            this.currentId = H52D_Framework.MemoryLogic.Instance.GetCurDungeonIdx(H52D_Framework.MemoryType.equip);
            //解锁最后关卡ID
            var lastId = 0;
            for (var i in this.dataList) {
                var model = new H52D_Framework.MemoryModelView(this.dataList[i]);
                model.x = this.GetLocal(i).x - 85;
                model.y = this.GetLocal(i).y - 85;
                this.iconbg.addChild(model);
                this.modelList.push(model);
                if (model.CustomsNum <= H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder && lastId < model.CopyId) {
                    lastId = model.CopyId;
                }
                if (this.dataList[Number(i) + 1]) {
                    var line = new H52D_Framework.MemoryLineView();
                    line.x = this.GetLocal(i).x - 2;
                    line.y = this.GetLocal(i).y - 2;
                    line.into = prevInto;
                    line.ChoosePath(this.GetLocal(Number(i) + 1));
                    prevInto = line.into;
                    line.Complete(false);
                    this.linebg.addChild(line);
                }
            }
            //在解锁最后关卡之前，则向后推一关。否则就到头了
            if (this.currentId < lastId) {
                this.currentId++;
            }
            for (var i in this.modelList) {
                var model = this.modelList[i];
                if (model.CustomsNum <= H52D_Framework.CustomsManager.Instance.CustomsVo.customsOrder) {
                    if (model.CopyId == this.currentId) {
                        model.unLock = true;
                        model.CurrentCustoms();
                        this.dungeonLocalY = model.y;
                    }
                    else if (model.CopyId < this.currentId) {
                        model.unLock = true;
                    }
                }
            }
        };
        MemoryArrangement.prototype.GetLocal = function (i) {
            return {
                "x": this.dataList[i]["Position"][1] * 60 + 50,
                "y": this.iconbg.height - this.dataList[i]["Position"][2] * 50
            };
        };
        return MemoryArrangement;
    }());
    H52D_Framework.MemoryArrangement = MemoryArrangement;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=MemoryArrangement.js.map