module H52D_Framework {
      /**
       * @class 时段记忆划线功能类
       * @author zhangyusong
       */
      export class MemoryArrangement {
            public dungeonLocalY:number=0;

            private iconbg: Laya.Image;
            private linebg: Laya.Image;
            private dataList: any;
            private modelList: MemoryModelView[];
            /** 当前解锁ID */
            private currentId:number;

            constructor(img_icon: Laya.Image, img_line: Laya.Image) {
                  this.iconbg = img_icon;
                  this.linebg = img_line;
                  this.ViewInit();
            }

            private ViewInit() {
                  //上一个线的入口
                  let prevInto:number = 0;
                  this.dataList = CopyConfig[MemoryType.equip];
                  this.modelList = [];
                  //当前关卡ID
                  this.currentId = MemoryLogic.Instance.GetCurDungeonIdx(MemoryType.equip);
                  //解锁最后关卡ID
                  let lastId = 0;
                  for (let i in this.dataList) {
                        let model: MemoryModelView = new MemoryModelView(this.dataList[i]);
                        model.x = this.GetLocal(i).x-85;
                        model.y = this.GetLocal(i).y-85;
                        this.iconbg.addChild(model);
                        this.modelList.push(model);
                        if(model.CustomsNum <= CustomsManager.Instance.CustomsVo.customsOrder && lastId < model.CopyId){
                              lastId = model.CopyId;
                        }
                        if (this.dataList[Number(i)+1]) {
                              let line: MemoryLineView = new MemoryLineView();
                              line.x = this.GetLocal(i).x-2;
                              line.y = this.GetLocal(i).y-2;
                              line.into = prevInto;
                              line.ChoosePath(this.GetLocal(Number(i) + 1));
                              prevInto = line.into;
                              line.Complete(false);
                              this.linebg.addChild(line);
                        }
                  }
                  //在解锁最后关卡之前，则向后推一关。否则就到头了
                  if(this.currentId < lastId){
                        this.currentId++;
                  }
                  for (let i in this.modelList) {
                        let model: MemoryModelView = this.modelList[i];
                        if(model.CustomsNum <= CustomsManager.Instance.CustomsVo.customsOrder){
                              if(model.CopyId == this.currentId){
                                    model.unLock = true;
                                    model.CurrentCustoms();
                                    this.dungeonLocalY = model.y;
                              }
                              else if(model.CopyId < this.currentId){
                                    model.unLock = true;
                              }
                        }
                  }
            }

            private GetLocal(i): {"x":number,"y":number} {
                  return {
                        "x":this.dataList[i]["Position"][1]*60 + 50,
                        "y":this.iconbg.height - this.dataList[i]["Position"][2]*50
                  }
            }

      }

}