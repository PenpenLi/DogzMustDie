module H52D_Framework {
    export class NoticeView extends ui.main.subinterface.NoticeViewUI {
        private _msg: string = "";
        constructor() {
            super();        
            SetHtmlStyle(this.noticeLabel, 30, "#ffffff", "left", true);
            this.noticeLabel.style.wordWrap = false;
            this.noticeLabel.style.stroke = 2;
            this.noticeLabel.style.strokeColor = "#000000";
            // Tick.Loop(1000, this, this.Update);
            Laya.timer.loop(1, this, this.NewUpdate);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.noticeLabel.x = -10000000;
        }

        private Destroy(): void {
            this.offAll();
            // Tick.ClearAll(this);
            // Laya.Tween.clearAll(this);
        }

        private NewUpdate() {
            this.noticeLabel.x -= 5;
            let targetX = this.noticeLabel.x + this.noticeLabel.contextWidth + 10;
            if (targetX < 0) {
                this._msg = NoticeLogic.Inst.GetNoticeMsg();                
                if (this._msg != "") {
                    this.noticeLabel.innerHTML = this._msg;
                    if (this.noticeLabel._childs.length > 0 && this.noticeLabel.contextWidth > 5) {
                        this.noticeLabel.x = 760;
                        this.noticeLabel.visible = true;
                        this.htmlBg.visible = true;
                    } else {
                        this.noticeLabel.visible = false;
                        this.htmlBg.visible = false;
                    }
                } else {
                    this.noticeLabel.visible = false;
                    this.htmlBg.visible = false;
                }
            }
        }

            // private Update() {
            //     this.noticeLabel.innerHTML = NoticeLogic.Inst.GetNoticeMsg();
            //     if (this.noticeLabel._childs.length > 0) {
            //         this.noticeLabel.x = 760;
            //         this.noticeLabel.visible = true;
            //         this.htmlBg.visible = true;
            //         Tick.ClearAll(this);
            //         let targetX = this.noticeLabel.x - this.noticeLabel.contextWidth - 760;
            //         let time = this.noticeLabel.contextWidth / 120;
            //         Laya.Tween.to(this.noticeLabel, { x: targetX }, time * 1000, null, Laya.Handler.create(this, this.Complete));
            //     }
            // }

            // private Complete() {
            //     this.htmlBg.visible = false;
            //     this.noticeLabel.visible = false;
            //     Tick.Loop(1000, this, this.Update);
            // }
        }
    }