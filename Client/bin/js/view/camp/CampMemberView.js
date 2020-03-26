var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**Created by the LayaAirIDE*/
var H52D_Framework;
(function (H52D_Framework) {
    H52D_Framework.AddViewResource("CampMemberView", [
        { url: "res/ui/ui_rank.atlas", type: Laya.Loader.ATLAS },
    ]);
    /**成员列表 */
    var CampMemberView = /** @class */ (function (_super) {
        __extends(CampMemberView, _super);
        function CampMemberView(buf) {
            var _this = _super.call(this) || this;
            _this.Camp_play = [];
            _this.Camp_playInfo = {};
            _this.camp_ID = buf[1];
            _this.AddEvent();
            _this.Init();
            _this.arrow_up.visible = false;
            _this.arrow_down.visible = false;
            return _this;
        }
        CampMemberView.prototype.AddEvent = function () {
            //Event.RegistEvent("GetplayInfo", Laya.Handler.create(this, this.SetPlayInfo));
            this.Btn_close.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
            this.background_label.on(Laya.Event.CLICK, this, this.Btn_CloseClick);
            this.arrow_down.on(Laya.Event.CLICK, this, this.Move_List, [10]);
            this.arrow_up.on(Laya.Event.CLICK, this, this.Move_List, [-10]);
            this.on(Laya.Event.REMOVED, this, this.Destroy);
            this.Refresh();
        };
        CampMemberView.prototype.Init = function () {
            this.SetPlayInfo();
            //this.Updatelist();
        };
        /** */
        CampMemberView.prototype.SetPlayInfo = function () {
            for (var nIdx in H52D_Framework.CampManager.Instance.Camp_PlayInfO) {
                this.Camp_play.push(Number(nIdx));
            }
            this.Camp_playInfo = H52D_Framework.CampManager.Instance.Camp_PlayInfO;
            this.Updatelist();
        };
        CampMemberView.prototype.Destroy = function () {
            this.offAll();
            //Event.RemoveEvent("GetplayInfo", Laya.Handler.create(this, this.SetPlayInfo));			
        };
        CampMemberView.prototype.Updatelist = function () {
            this.arrow_down.visible = false;
            if (this.Camp_play.length > 8) {
                this.arrow_down.visible = true;
                this.Camp_playlist.vScrollBarSkin = "";
            }
            //this.Camp_playlist.repeatY = this.Camp_play.length;					
            this.Camp_playlist.array = this.Camp_play;
            this.Camp_playlist.renderHandler = new Laya.Handler(this, this.Camp_PlayList);
        };
        CampMemberView.prototype.Camp_PlayList = function (item, index) {
            if (index < this.Camp_play.length) {
                index += 1;
            }
            //this.Camp_playlist.scrollBar.stopScroll();
            var play = this.Camp_playInfo[index];
            //需要从这个阵营信息中拿到所有玩家信息  然后按照索引 id取出玩家
            var rank_num = item.getChildByName("Rank_Num"); //rankNum
            var play_name = item.getChildByName("play_Name");
            var ranknum = item.getChildByName("rankNum");
            var play_donate = item.getChildByName("play_Donate"); //捐献   
            var play_customs = item.getChildByName("play_Customs"); //关卡    background_img
            var play_info = item.getChildByName("background_label");
            if (index <= 3) {
                rank_num.skin = "ui_rank/img-" + index + "-paiming.png";
                ranknum.visible = false;
                rank_num.visible = true;
            }
            else {
                ranknum.text = index + "";
                ranknum.visible = true;
                rank_num.visible = false;
            }
            play_name.text = play[3];
            if (play[4] > 10000) {
                play_customs.text = play[4] - 10000 + "";
            }
            else {
                play_customs.text = play[4];
            }
            play_donate.text = play[5]; //捐献
            this.camp_name.text = H52D_Framework.MasterPlayer.Instance.player.Name;
            if (play[3] == H52D_Framework.MasterPlayer.Instance.player.Name) {
                this.my_rank.text = index + "名";
                this.play_Donate.text = play[5];
                this.play_su.text = play_customs.text;
            }
            if (this.camp_ID != H52D_Framework.MasterPlayer.Instance.player.CampID) {
                this.my_rank.text = "未加入";
                this.play_Donate.text = "";
                this.play_su.text = "";
            }
            play_info.on(Laya.Event.CLICK, this, this.OpenView, [play[1]]);
        };
        CampMemberView.prototype.Move_List = function (dis) {
            this.Camp_playlist.scrollBar.value += dis * 8.8;
            ;
        };
        /**箭头的显示 隐藏 */
        CampMemberView.prototype.Refresh = function () {
            var _this = this;
            H52D_Framework.Tick.FrameLoop(1, this, function () {
                if (!_this.Camp_playlist.scrollBar) {
                    return;
                }
                _this.Camp_playlist.scrollBar.changeHandler = Laya.Handler.create(_this, function (value) {
                    if (value < 10) {
                        _this.arrow_up.visible = false;
                    }
                    else {
                        _this.arrow_up.visible = true;
                    }
                    if (value > 780) {
                        _this.arrow_down.visible = false;
                    }
                    else {
                        _this.arrow_down.visible = true;
                    }
                });
            });
        };
        CampMemberView.prototype.Btn_CloseClick = function () {
            H52D_Framework.UIManager.Instance.DestroyUI("CampMemberView", [H52D_Framework.ViewUpRoot]);
        };
        /**打开视图 */
        CampMemberView.prototype.OpenView = function (play_id) {
            H52D_Framework.CampManager.Instance.n_Play(play_id);
            H52D_Framework.UIManager.Instance.CreateUI("CampPlayInfo", [H52D_Framework.ViewUpRoot, play_id]);
        };
        return CampMemberView;
    }(ui.camp.CampMemberViewUI));
    H52D_Framework.CampMemberView = CampMemberView;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=CampMemberView.js.map