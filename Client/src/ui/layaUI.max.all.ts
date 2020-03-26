
import View=laya.ui.View;
import Dialog=laya.ui.Dialog;
module ui.achievement {
    export class AchievementViewUI extends View {
		public bj:Laya.Image;
		public tipName:laya.display.Text;
		public close:Laya.Button;
		public achieven_List:Laya.List;
		public btn1:Laya.Button;
		public bg3:Laya.Image;
		public txt1:Laya.Label;
		public red1:Laya.Image;
		public btn2:Laya.Button;
		public txt2:Laya.Label;
		public red2:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.6}},{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":126,"width":684,"var":"bj","height":1026,"centerX":0,"anchorX":0.5},"child":[{"type":"Image","props":{"y":490,"x":341,"width":700,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":980,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":-39,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Text","props":{"y":15,"x":47,"width":514,"var":"tipName","text":"输入Tip名字","strokeColor":"#50560c","height":28,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":true,"align":"left"}},{"type":"Button","props":{"var":"close","top":0,"stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":30}}]}]},{"type":"Image","props":{"y":11,"x":-8,"width":474,"skin":"ui_camp/img-huawen1.png","height":124}},{"type":"List","props":{"y":81,"width":679,"var":"achieven_List","spaceY":6,"repeatX":1,"height":893,"centerX":-2},"child":[{"type":"Box","props":{"y":0,"x":3,"width":670,"renderType":"render","height":96},"child":[{"type":"Image","props":{"y":0,"x":0,"width":670,"skin":"ui_rank/img-ziji-paiming.png","sizeGrid":"0,10,0,80","name":"achieven_bj","height":94}},{"type":"Image","props":{"y":47,"x":43,"width":70,"skin":"ui_icon/lw_icon_19.png","name":"achieven_icon","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":8,"x":99,"width":293,"text":"任务阶段:","height":30,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","bold":false}},{"type":"Label","props":{"y":37,"x":98,"width":293,"text":"任务目标描述","name":"achieven_content","height":30,"fontSize":18,"font":"Microsoft YaHei","color":"#d6d7dd","bold":false}},{"type":"Image","props":{"y":7,"x":206,"width":282,"name":"achieven_stage","height":30}},{"type":"Label","props":{"y":63,"x":96,"width":401,"name":"achieven_progress","height":20,"bgColor":"#292936"},"child":[{"type":"Image","props":{"y":3,"x":2,"width":396,"skin":"ui_hero/img-taitou-jinenghuifu-jindutiao.png","height":14}},{"type":"Label","props":{"y":2,"x":399,"width":75,"name":"achieven_bar","height":16,"borderColor":"#292936","bgColor":"#292936","anchorX":1}},{"type":"Label","props":{"y":0,"x":1,"width":398,"valign":"top","text":"2/6","strokeColor":"#4b4b56","stroke":3,"name":"achieven_barValue","height":18,"fontSize":14,"font":"Microsoft YaHei","color":"#ffffff","bold":false,"align":"center"}}]},{"type":"Label","props":{"y":1,"x":522,"width":148,"height":92,"bgColor":"#242243"}},{"type":"Button","props":{"y":53,"x":596,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"achievent_btn","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":5,"x":5,"width":112,"valign":"top","text":" 领奖","name":"achievent_btnText","height":39,"fontSize":26,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"HTMLDivElement","props":{"y":8,"x":534,"width":124,"name":"achieven_awart","height":18}}]}]},{"type":"Image","props":{"y":16,"x":5,"width":311,"skin":"ui_rank/img-xiaobiaoqian-tuo.png","sizeGrid":"2,44,2,2","height":58}},{"type":"Button","props":{"y":45,"x":83,"width":147,"var":"btn1","stateNum":1,"skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,36,0,33","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":-4,"var":"bg3","skin":"ui_rank/img-zi-xuan.png"}},{"type":"Label","props":{"y":10,"x":0,"width":117,"var":"txt1","valign":"top","text":"每日目标","height":31,"fontSize":22,"font":"Microsoft YaHei","color":"#bebbf8","bold":true,"align":"center"}},{"type":"Image","props":{"y":25,"x":111,"var":"red1","skin":"ui_common/img-tixing.png"}}]},{"type":"Button","props":{"y":45,"x":218,"width":182,"var":"btn2","stateNum":1,"skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,36,0,33","height":49,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":9,"x":34,"width":117,"var":"txt2","valign":"top","text":"常规成就","height":31,"fontSize":22,"font":"Microsoft YaHei","color":"#bebbf8","bold":true,"align":"center"}},{"type":"Image","props":{"y":24,"x":147,"var":"red2","skin":"ui_common/img-tixing.png"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.achievement.AchievementViewUI.uiView);

        }

    }
}

module ui.action.boss {
    export class WroldBossBuffViewUI extends View {
		public Other:Laya.Label;
		public Btn_close:Laya.Button;
		public Buff_list:Laya.List;
		public Look:Laya.Button;
		public StartChange:Laya.Button;
		public bot_font:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":586,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,3,0","height":466,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":1,"x":0,"width":588,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":18,"width":6,"height":34,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":40,"text":"BUFF详情","fontSize":24,"font":"SimHei","color":"#dde2f2","centerY":0}},{"type":"Button","props":{"x":609,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12,"centerY":0}}]},{"type":"List","props":{"y":61,"x":16,"width":551,"var":"Buff_list","spaceY":6,"height":293},"child":[{"type":"Box","props":{"y":0,"x":0,"width":550,"renderType":"render","height":94},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#5b335d"}},{"type":"Image","props":{"y":9,"x":10,"width":76,"skin":"ui_common/icon-jinbi.png","name":"buff_icon","height":76}},{"type":"HTMLDivElement","props":{"y":31,"x":107,"width":293,"name":"buff_say","height":35}},{"type":"Button","props":{"y":47,"x":475,"width":124,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"btn_buy","labelSize":25,"labelFont":"SimHei","labelBold":true,"height":48,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":14,"x":32,"width":26,"skin":"ui_icon/icon_prop_013.png","name":"buff_price_icon","height":20}},{"type":"Label","props":{"y":11,"x":60,"width":40,"text":"20","name":"buff_price","height":27,"fontSize":26,"font":"SimHei","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":17,"x":406,"skin":"ui_wroldboss/img-yigoumai-shijieboss.png","name":"buff_buyed"}}]}]},{"type":"Button","props":{"var":"Look","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"观看","centerX":-128,"bottom":24}},{"type":"Button","props":{"var":"StartChange","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"开始挑战","centerX":128,"bottom":23}},{"type":"Image","props":{"y":478,"width":370,"var":"bot_font","height":34,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":370,"height":34,"bgColor":"#030305","alpha":0.5}},{"type":"Image","props":{"y":6,"x":8,"skin":"ui_sign/img-tanhao-tongyong.png"}},{"type":"Label","props":{"y":5,"x":51,"width":318,"text":"观看广告可直接激活所有BUFF","height":24,"fontSize":22,"font":"SimHei","color":"#ffa5a7","align":"left"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.boss.WroldBossBuffViewUI.uiView);

        }

    }
}

module ui.action.boss {
    export class WroldBossEndViewUI extends View {
		public bg:Laya.Label;
		public Other:Laya.Label;
		public My_hurt:Laya.Label;
		public Btn_sure:Laya.Button;
		public Quit_time:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"bg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.3}},{"type":"Label","props":{"y":218,"var":"My_hurt","strokeColor":"#3b2213","stroke":6,"fontSize":26,"font":"SimHei","color":"#fef8e9","centerX":0,"align":"center"}},{"type":"Button","props":{"x":377,"var":"Btn_sure","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"labelAlign":"center","label":"点击退出","bottom":208,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":159,"x":293,"text":"挑战完成","strokeColor":"#3b2213","stroke":6,"fontSize":40,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":871,"x":288,"var":"Quit_time","text":"自动退出倒计时","strokeColor":"#3b2213","stroke":6,"fontSize":22,"font":"SimHei","color":"#fef3ce"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.boss.WroldBossEndViewUI.uiView);

        }

    }
}

module ui.action.boss {
    export class WroldBossRewardViewUI extends View {
		public Btn_close:Laya.Button;
		public reward_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"renderType":"render","height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":285,"x":82,"width":587,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,3,0","height":630,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":587,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":18,"width":6,"height":34,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":40,"text":"奖励预览","fontSize":24,"font":"SimHei","color":"#dde2f2","centerY":0}},{"type":"Button","props":{"x":532,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}}]},{"type":"List","props":{"y":56,"x":15,"width":552,"var":"reward_list","spaceY":6,"height":570},"child":[{"type":"Box","props":{"y":0,"x":0,"width":552,"renderType":"render","height":120},"child":[{"type":"Image","props":{"y":0,"x":0,"width":553,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","name":"reward_bg","height":120}},{"type":"Image","props":{"y":12,"x":99,"width":72,"name":"reward_icon_bg1","height":72},"child":[{"type":"Image","props":{"width":54,"name":"reward_icon","height":54,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":59,"right":0,"name":"rew_num","fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"right"}},{"type":"Label","props":{"y":77,"x":-5,"width":80,"name":"rew_name","height":25,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Image","props":{"y":12,"x":189,"width":72,"name":"reward_icon_bg2","height":72},"child":[{"type":"Image","props":{"width":54,"name":"reward_icon","height":54,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":59,"right":0,"name":"rew_num","fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"right"}},{"type":"Label","props":{"y":77,"x":-5,"width":80,"name":"rew_name","height":25,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Image","props":{"y":12,"x":279,"width":72,"name":"reward_icon_bg3","height":72},"child":[{"type":"Image","props":{"width":54,"name":"reward_icon","height":54,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":59,"right":0,"name":"rew_num","fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"right"}},{"type":"Label","props":{"y":77,"x":-5,"width":80,"name":"rew_name","height":25,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Image","props":{"y":12,"x":369,"width":72,"name":"reward_icon_bg4","height":72},"child":[{"type":"Image","props":{"width":54,"name":"reward_icon","height":54,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":59,"right":0,"name":"rew_num","fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"right"}},{"type":"Label","props":{"y":77,"x":-5,"width":80,"name":"rew_name","height":25,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Image","props":{"y":12,"x":459,"width":72,"name":"reward_icon_bg5","height":72},"child":[{"type":"Image","props":{"width":54,"name":"reward_icon","height":54,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":59,"right":0,"name":"rew_num","fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"right"}},{"type":"Label","props":{"y":77,"x":0,"width":80,"name":"rew_name","height":25,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Image","props":{"y":0,"x":43,"width":120,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,50,0,0","rotation":90,"height":42}},{"type":"Image","props":{"y":0,"x":76,"width":120,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,56,0,0","rotation":90,"height":42}},{"type":"Image","props":{"y":96,"x":71,"width":65,"skin":"ui_wroldboss/img-vs-bg-pkliansai.png","rotation":180,"height":70}},{"type":"Text","props":{"y":10,"x":0,"wordWrap":true,"width":77,"valign":"middle","text":"1","name":"rankNum","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.boss.WroldBossRewardViewUI.uiView);

        }

    }
}

module ui.action.boss {
    export class WroldBossViewUI extends View {
		public titlebg:Laya.Image;
		public Btn_Close:Laya.Button;
		public tatil:Laya.Label;
		public Btn_Challenge:Laya.Button;
		public Boss_say:Laya.Label;
		public Boss_Name:Laya.Label;
		public Boss_Icon:Laya.Image;
		public hurt_bg:Laya.Image;
		public Hurt_max:Laya.Label;
		public Btn_reward:Laya.Button;
		public Btn_Rank:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":-1,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908"},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_scene01/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1178}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1014,"bottom":-80}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":527}},{"type":"Image","props":{"x":583,"skin":"ui_scene01/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":581}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":12}}]},{"type":"Image","props":{"width":750,"top":0,"right":0,"left":0,"height":1200,"bottom":0},"child":[{"type":"Image","props":{"width":750,"var":"titlebg","top":0,"sizeGrid":"10,24,6,0","right":0,"left":0,"height":120},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908"}},{"type":"Image","props":{"width":750,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","right":0,"left":0,"height":32,"bottom":3},"child":[{"type":"Image","props":{"y":-6,"width":167,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","right":0,"height":38},"child":[{"type":"Button","props":{"y":-1,"var":"Btn_Close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerX":0}}]}]},{"type":"Label","props":{"x":57,"width":115,"var":"tatil","valign":"middle","text":"世界BOSS","height":29,"fontSize":26,"font":"SimHei","color":"#feb979","bottom":4,"bold":false,"align":"left"}},{"type":"Label","props":{"x":32,"width":6,"height":22,"bottom":9,"bgColor":"#4a408a"}}]},{"type":"Button","props":{"width":294,"var":"Btn_Challenge","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"label":"挑战","height":90,"centerY":450,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"var":"Boss_say","fontSize":22,"font":"SimHei","color":"#fef3ce","centerY":375,"centerX":0,"align":"center"}},{"type":"Label","props":{"width":180,"var":"Boss_Name","text":"BOSS名称","strokeColor":"#3b2213","stroke":3,"height":30,"fontSize":26,"font":"SimHei","color":"#fef8e9","centerY":-337,"centerX":0,"bold":true,"align":"center"}},{"type":"Image","props":{"width":400,"var":"Boss_Icon","height":540,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":159,"x":464,"width":242,"var":"hurt_bg","skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":37},"child":[{"type":"Label","props":{"y":4,"x":0,"wordWrap":false,"width":241,"var":"Hurt_max","text":"最高伤害:","name":"倒计时","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":141,"x":112,"var":"Btn_reward","stateNum":1,"skin":"ui_wroldboss/btn-jaingliyulan-shijieboss.png","left":112},"child":[{"type":"Label","props":{"y":43,"x":-10,"text":"奖励预览","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":142,"x":30,"var":"Btn_Rank","stateNum":1,"skin":"ui_wroldboss/btn-paihang-shijieboss.png","left":30},"child":[{"type":"Label","props":{"y":39,"x":-6,"text":"排行榜","strokeColor":"#7c6d92","stroke":3,"fontSize":22,"font":"SimHei","color":"#f4f4f4"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.boss.WroldBossViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class HeroBloodViewUI extends View {
		public img_blood:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":50,"height":4},"child":[{"type":"Image","props":{"y":0,"x":0,"width":60,"height":5},"child":[{"type":"Image","props":{"y":-1,"x":-1,"width":620,"skin":"ui_main/img-xietuo-boss.png","sizeGrid":"1,10,10,3","scaleY":0.1,"scaleX":0.1,"name":"bg","height":70}},{"type":"Image","props":{"y":0,"x":0,"width":60,"height":5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":60,"var":"img_blood","skin":"ui_main/img-guai-xuetiao.png","sizeGrid":"0,6,0,0","height":5}},{"type":"Sprite","props":{"y":0,"x":0,"renderType":"mask"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":60,"lineWidth":1,"height":5,"fillColor":"#ff0000"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.kicking.HeroBloodViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class KickingChooseViewUI extends View {
		public tx_attack_name:Laya.Label;
		public btn_close:Laya.Button;
		public btn_gold:Laya.Button;
		public btn_diamond:Laya.Button;
		public btn_pvp:Laya.Button;
		public btn_pet:Laya.Button;
		public btn_add:Laya.Button;
		public txt_challenge:laya.display.Text;
		public My_money:laya.html.dom.HTMLDivElement;
		public room_list:Laya.List;
		public btn_matching:Laya.Button;
		public tx_martch_time:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"x":10,"width":700,"height":1058,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":700,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":1058},"child":[{"type":"Label","props":{"y":0,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":23,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":49,"width":268,"var":"tx_attack_name","text":"选择房间","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"bold":false,"align":"left"}},{"type":"Button","props":{"x":532,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12,"centerY":0}}]},{"type":"Label","props":{"y":59,"x":0,"width":700,"height":60,"bgColor":"#2c2129"}},{"type":"Image","props":{"y":924,"width":662,"skin":"ui_camp/img-baibian-zhenying.png","sizeGrid":"5,2,1,1","height":120,"centerX":0}}]},{"type":"Image","props":{"y":71,"x":15,"width":290,"skin":"ui_rank/img-xiaobiaoqian-tuo.png","sizeGrid":"2,40,2,2","name":"分房按钮","height":48},"child":[{"type":"Button","props":{"y":24,"x":76,"width":152,"var":"btn_gold","stateNum":1,"skin":"ui_rank/img-zi-xuan.png","sizeGrid":"0,34,0,2","labelStrokeColor":"#000000","labelStroke":1,"labelSize":24,"labelPadding":"0,8,0,0","labelFont":"SimHei","labelColors":"#eff8bb","labelBold":true,"label":"金币房间","height":43,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":24,"x":202,"width":160,"var":"btn_diamond","stateNum":1,"skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,34,0,34","labelStrokeColor":"#000000","labelStroke":1,"labelSize":24,"labelPadding":"0,0,0,0","labelFont":"SimHei","labelColors":"#bebbf8","labelBold":true,"label":"钻石房间","height":43,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":21,"x":502,"width":90,"var":"btn_pvp","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"PVP阵型","height":38,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":21,"x":615,"width":90,"var":"btn_pet","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"上阵神兽","height":38,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Label","props":{"y":135,"x":25,"width":298,"height":27,"bgColor":"#3b2234"},"child":[{"type":"Label","props":{"x":5,"width":6,"height":25,"centerY":0,"bgColor":"#c68a1f"}},{"type":"Button","props":{"y":15,"x":275,"var":"btn_add","stateNum":1,"skin":"ui_icon/btn-jiacishu-tianti.png","anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":4,"x":25,"text":"剩余挑战次数:","fontSize":20,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":164,"width":73,"var":"txt_challenge","text":"1/3","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}}]},{"type":"HTMLDivElement","props":{"y":134,"x":472,"width":221,"var":"My_money","innerHTML":"htmlText","height":26}},{"type":"List","props":{"y":185,"x":52,"width":648,"var":"room_list","vScrollBarSkin":"\"\"","spaceY":38,"spaceX":50,"height":780},"child":[{"type":"Box","props":{"y":0,"x":0,"width":275,"renderType":"render","height":369},"child":[{"type":"Image","props":{"y":9,"x":2,"skin":"ui_camp/btn-junaxuan-zhenying.png","sizeGrid":"0,20,20,0","name":"img_bg"}},{"type":"Image","props":{"y":0,"x":0,"width":275,"skin":"ui_pet/img-liebiao-xuanzhong-shenshou.png","sizeGrid":"4,22,16,4","name":"box_select","height":369}},{"type":"Image","props":{"y":55,"skin":"ui_kicking/img-1-pvp.png","name":"img_sign","centerX":-1}},{"type":"Image","props":{"y":243,"x":13,"width":28,"skin":"ui_common/icon-jinbi.png","name":"icon_money","height":28}},{"type":"Text","props":{"y":245,"x":44,"width":215,"text":"1000金币以上","name":"money","height":26,"fontSize":24,"font":"SimHei","color":"#d6d7dd","bold":true,"align":"center"}},{"type":"Text","props":{"y":309,"x":8,"width":252,"text":"青铜","name":"room_name","height":30,"fontSize":26,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"}},{"type":"Image","props":{"y":288,"x":187,"skin":"ui_pet/img-liebiao-xuanzhongbiaozhi-shenshou.png","name":"img_hook"}}]}]},{"type":"Button","props":{"y":950,"x":269,"var":"btn_matching","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelPadding":"-8","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"匹配","centerX":0},"child":[{"type":"Image","props":{"y":44,"x":0,"width":162,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,9,9,5","height":22}},{"type":"Text","props":{"y":44,"x":3,"width":155,"var":"tx_martch_time","valign":"middle","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.kicking.KickingChooseViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class KickingPetViewUI extends View {
		public lclbg:Laya.Image;
		public btn_close:Laya.Button;
		public petHit:Laya.Label;
		public info:Laya.Image;
		public Pet_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":750,"var":"lclbg","height":1200,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":375,"width":750,"top":0,"mouseThrough":true,"centerX":0,"bottom":0,"anchorX":0.5},"child":[{"type":"Box","props":{"y":0,"width":750,"height":1200,"centerX":0,"alpha":1},"child":[{"type":"Label","props":{"y":38,"x":0,"width":750,"height":1080,"bgColor":"#313737","alpha":1}},{"type":"Image","props":{"y":0,"x":584,"width":166,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":42},"child":[{"type":"Image","props":{"y":0,"x":-583,"width":621,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":42}}]},{"type":"Button","props":{"y":2,"x":643,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png"}}]}]},{"type":"Label","props":{"y":48,"x":23,"width":125,"var":"petHit","text":"72.83K  神兽伤害","height":22,"fontSize":22,"font":"SimHei","color":"#dde2f2"},"child":[{"type":"Image","props":{"y":-8,"x":0,"var":"info","skin":"ui_action/btn-xiangqing-huodong.png"}}]},{"type":"List","props":{"y":80,"x":0,"width":750,"var":"Pet_list","spaceY":10,"spaceX":8,"repeatX":2,"height":1024,"alpha":1},"child":[{"type":"Box","props":{"y":6,"x":8,"width":363,"renderType":"render","height":96},"child":[{"type":"Image","props":{"y":7,"x":6,"width":360,"skin":"ui_pet/img-liebiao-shenshou.png","sizeGrid":"10,215,10,35","height":86,"alpha":1}},{"type":"Image","props":{"y":7,"x":6,"width":86,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"pet_icon_bg","height":78}},{"type":"Label","props":{"y":12,"x":106,"width":33,"text":"LV:","height":23,"fontSize":18,"font":"SimHei","color":"#86e779","align":"left"}},{"type":"Label","props":{"y":12,"x":133,"width":33,"text":"405","name":"Pet_lv","height":23,"fontSize":18,"font":"SimHei","color":"#ffff79","align":"left"}},{"type":"Label","props":{"y":9,"x":172,"width":96,"text":"陆咬胶鲨","name":"Pet_name","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":43,"x":106,"width":106,"text":"宠物伤害","name":"pet_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":65,"x":106,"width":106,"text":"宠物伤害","name":"hero_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Image","props":{"y":3,"x":2,"width":360,"skin":"ui_pet/img-liebiao-xuanzhong-shenshou.png","sizeGrid":"4,25,15,8","name":"choice","height":86,"alpha":1},"child":[{"type":"Image","props":{"y":17,"x":279,"skin":"ui_pet/img-liebiao-xuanzhongbiaozhi-shenshou.png","name":"pet_main"}}]},{"type":"Button","props":{"y":7,"x":4,"width":354,"name":"click","height":79}},{"type":"Image","props":{"y":6,"x":5,"width":86,"skin":"ui_icon/icon_tou_atm.png","name":"Pet_icon","height":80},"child":[{"type":"Image","props":{"y":44,"x":53,"skin":"ui_shop/img-tanhao.png","name":"Pet_info"}}]},{"type":"Image","props":{"y":0,"x":-1,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"point","height":30},"child":[{"type":"Label","props":{"y":-1,"x":1,"width":14,"text":"new","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.kicking.KickingPetViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class KickingPromptViewUI extends View {
		public tx_content:laya.display.Text;
		public btn_close:Laya.Button;
		public btn_back:Laya.Button;
		public btn_confirm:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":590,"height":338,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":87,"width":90,"text":"提示","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":-13,"x":260,"width":288,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":40},"child":[{"type":"Image","props":{"y":0,"x":248,"width":82,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":40}}]}]},{"type":"Label","props":{"y":28,"x":590,"width":40,"height":40},"child":[{"type":"Image","props":{"y":0,"x":0,"width":310,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","skewY":90,"skewX":-90,"height":590}}]},{"type":"Image","props":{"y":111,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"y":256,"x":510,"skin":"ui_common/img-huawen2.png","alpha":0.4}},{"type":"Image","props":{"y":230,"x":12,"width":566,"height":1}},{"type":"Text","props":{"y":113,"x":77,"width":435,"var":"tx_content","text":"退出后本次战斗失败，是否退出！","height":32,"fontSize":30,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Button","props":{"y":-13,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":2}},{"type":"Button","props":{"y":257,"x":86,"width":180,"var":"btn_back","stateNum":1,"height":50},"child":[{"type":"Label","props":{"y":0,"x":0,"width":180,"text":"取消","strokeColor":"#493215","stroke":3,"padding":"13","height":50,"fontSize":26,"font":"SimHei","color":"#fffdfd","bold":true,"bgColor":"#8d6e1e","align":"center"}}]},{"type":"Button","props":{"y":257,"x":324,"width":180,"var":"btn_confirm","stateNum":1,"height":50},"child":[{"type":"Label","props":{"y":0,"x":0,"width":180,"text":"确定","strokeColor":"#1f4915","stroke":3,"padding":"13","height":50,"fontSize":26,"font":"SimHei","color":"#fffdfd","bold":true,"bgColor":"#4e8d1e","align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.kicking.KickingPromptViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class KickingResultViewUI extends View {
		public fight_bg:Laya.Image;
		public fight_bg_icon:Laya.Image;
		public fight_war:Laya.List;
		public fight_logo:Laya.Image;
		public fight_quittime:Laya.Label;
		public fight_result:Laya.Label;
		public item_name:Laya.Label;
		public item_num:Laya.Label;
		public item_result:Laya.Label;
		public item_pinzhi:Laya.Image;
		public item_icon:Laya.Image;
		public fight_win:Laya.Image;
		public start_2:Laya.Image;
		public start_1:Laya.Image;
		public start_3:Laya.Image;
		public btn_receive:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":534,"height":680,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":7,"x":0,"width":534,"var":"fight_bg","skin":"ui_kicking/img-shengli-bg-pvp.png","sizeGrid":"0,3,0,3","height":680}},{"type":"Image","props":{"y":93,"x":30,"var":"fight_bg_icon","skin":"ui_kicking/img-shengli-zhuangshi-pvp.png"}},{"type":"List","props":{"y":98,"x":105,"width":319,"var":"fight_war","spaceY":20,"spaceX":30,"repeatX":3,"height":299},"child":[{"type":"Box","props":{"renderType":"render"},"child":[{"type":"Image","props":{"width":85,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"hero_bg","height":85}},{"type":"Image","props":{"y":0,"x":0,"width":85,"skin":"ui_icon/icon_tou_frk.png","name":"hero_icon","height":85}}]}]},{"type":"Image","props":{"x":267,"var":"fight_logo","skin":"ui_kicking/img-shibai-pvp.png","bottom":580,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":578,"width":130,"var":"fight_quittime","text":"5秒后自动退出","pivotY":0,"pivotX":0,"height":20,"fontSize":20,"font":"SimHei","color":"#49495b","centerX":0,"align":"center"}},{"type":"Label","props":{"y":563,"width":484,"height":2,"centerX":0}},{"type":"Image","props":{"y":417,"x":16,"width":300,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":28},"child":[{"type":"Label","props":{"width":226,"var":"fight_result","text":"本场平局","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"centerX":0,"align":"center"}},{"type":"Label","props":{"x":6,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Label","props":{"y":49,"x":120,"var":"item_name","text":"金币","strokeColor":"#000000","stroke":1,"fontSize":20,"font":"SimHei","color":"#e69bff"}},{"type":"Label","props":{"y":72,"x":120,"var":"item_num","text":"+99999999","fontSize":20,"font":"SimHei","color":"#49495b","bold":true}},{"type":"Label","props":{"y":96,"x":120,"var":"item_result","text":"平局不扣门票","fontSize":20,"font":"SimHei","color":"#49495b"}},{"type":"Image","props":{"y":47,"x":24,"width":76,"var":"item_pinzhi","skin":"ui_hero/img-hongpingzhikuang.png","height":76}},{"type":"Image","props":{"y":47,"x":24,"width":76,"var":"item_icon","skin":"ui_icon/icon_prop_004.png","height":76}}]},{"type":"Image","props":{"y":-60,"x":265,"visible":false,"var":"fight_win"},"child":[{"type":"Image","props":{"y":-35,"x":-27,"var":"start_2","skin":"ui_kicking/img-shengli-huixing-pvp.png"}},{"type":"Image","props":{"y":1,"x":-58,"width":64,"var":"start_1","skin":"ui_kicking/img-shengli-huixing-pvp.png","skewY":-10,"skewX":10,"height":64,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":1,"x":68,"var":"start_3","skin":"ui_kicking/img-shengli-huixing-pvp.png","skewY":10,"skewX":-10,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Button","props":{"var":"btn_receive","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"确定","centerX":-2,"bottom":8}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.kicking.KickingResultViewUI.uiView);

        }

    }
}

module ui.action.kicking {
    export class KickingWarUI extends View {
		public lclbg:Laya.Image;
		public BackGround:Laya.Image;
		public Btn_save:Laya.Button;
		public bgbox:Laya.Box;
		public List_head:Laya.List;
		public dragpos8:Laya.Image;
		public Pos_8:Laya.Image;
		public mod8:View;
		public dragpos7:Laya.Image;
		public Pos_7:Laya.Image;
		public mod7:View;
		public dragpos6:Laya.Image;
		public Pos_6:Laya.Image;
		public mod6:View;
		public dragpos5:Laya.Image;
		public Pos_5:Laya.Image;
		public mod5:View;
		public dragpos4:Laya.Image;
		public Pos_4:Laya.Image;
		public mod4:View;
		public dragpos3:Laya.Image;
		public Pos_3:Laya.Image;
		public mod3:View;
		public dragpos2:Laya.Image;
		public Pos_2:Laya.Image;
		public mod2:View;
		public dragpos1:Laya.Image;
		public Pos_1:Laya.Image;
		public mod1:View;
		public dragpos0:Laya.Image;
		public Pos_0:Laya.Image;
		public mod0:View;
		public dragHeroIcon:Laya.Image;
		public dragHeroMod:View;
		public L:Laya.Label;
		public main_skillName:Laya.Label;
		public Skill_Icon:Laya.Image;
		public tixing:Laya.Label;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#303b3b","alpha":1}},{"type":"Image","props":{"width":750,"var":"lclbg","height":1200,"centerX":0},"child":[{"type":"Image","props":{"y":-300,"x":0,"width":750,"var":"BackGround","sizeGrid":"15,15,15,15","renderType":"render","height":1200},"child":[{"type":"Sprite","props":{"y":390,"x":-9,"width":781,"renderType":"mask","height":531},"child":[{"type":"Rect","props":{"y":19,"x":-197,"width":1176,"lineWidth":1,"height":489,"fillColor":"#ff0000"}}]}]},{"type":"Image","props":{"y":50,"x":0,"width":750,"visible":true,"height":58},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"visible":true,"height":58,"bgColor":"#2c2129","alpha":0.7}},{"type":"Image","props":{"y":6,"x":41,"width":88,"skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":44},"child":[{"type":"Label","props":{"y":8,"x":14,"width":2,"valign":"middle","height":28,"fontSize":18,"font":"SimHei","bgColor":"#aa9fc5","align":"center"}},{"type":"Label","props":{"y":3,"x":1,"width":88,"text":"布阵","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","align":"center"}}]},{"type":"Button","props":{"y":0,"x":591,"width":159,"var":"Btn_save","top":0,"stateNum":1,"skin":"ui_hero/btn-buzhen-baocun.png","right":0,"labelStrokeColor":"be5f13","labelStroke":4,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff","label":"保存","height":58}}]},{"type":"Box","props":{"y":108,"x":0,"width":750,"var":"bgbox","height":1088},"child":[{"type":"List","props":{"y":518,"x":0,"width":750,"var":"List_head","spaceY":14,"spaceX":22,"repeatX":4,"height":503},"child":[{"type":"Box","props":{"y":97,"x":120,"width":150,"renderType":"render","height":185,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":148,"skin":"ui_hero/img-buzhen-renwu-bg.png","renderType":"render","name":"background","height":188}},{"type":"Button","props":{"y":2,"x":1,"width":147,"stateNum":1,"name":"Btn_skill","height":185},"child":[{"type":"Image","props":{"y":1,"x":1,"width":143,"name":"background_k","height":182}},{"type":"Image","props":{"y":1,"x":2,"width":140,"name":"HeadIcon","height":140}},{"type":"Label","props":{"y":142,"x":7,"width":49,"text":"伤害","name":"Hp_name","height":20,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":162,"x":7,"width":49,"text":"生命","renderType":"render","name":"Hp_name","height":24,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":160,"x":40,"width":105,"renderType":"render","name":"Hp","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":142,"x":40,"width":105,"renderType":"render","name":"Hurt","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Image","props":{"y":-1,"x":-10,"width":41,"skin":"ui_hero/img-yingxiong-zhiwei-bg.png","renderType":"render","name":"IsGoWar","height":50}},{"type":"Image","props":{"y":-1,"x":-10,"skin":"ui_hero/img-yingxiong-zhiwei-dui.png","name":"hero_zhiwei"}},{"type":"Image","props":{"y":10,"x":110,"width":25,"skin":"ui_hero/icon-renwu-leixing-bg.png","renderType":"render","name":"Hero_Type_bg","height":29}},{"type":"Image","props":{"y":12,"x":117,"width":11,"skin":"ui_hero/icon-renwu-leixing-gongji.png","renderType":"render","name":"Hero_Type","height":22}},{"type":"Button","props":{"y":138,"x":1,"width":147,"name":"Btn_Info","height":45}}]}]}]},{"type":"Image","props":{"y":324,"x":79,"width":100,"var":"dragpos8","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_8","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_9","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_9.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod8","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":178,"width":100,"var":"dragpos7","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_7","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_8","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_8.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod7","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":79,"width":100,"var":"dragpos6","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_6","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_7","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_7.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod6","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":277,"width":100,"var":"dragpos5","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_5","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_6","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_6.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod5","name":"mod"}}]},{"type":"Image","props":{"y":243,"x":374,"width":100,"var":"dragpos4","height":150},"child":[{"type":"Image","props":{"y":-28,"x":6,"skin":"ui_hero/img-yingxiong-duizhang-biaozhi.png"}},{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_4","skin":"ui_hero/img-yingxiong-duizhang-bg.png","name":"Pos_5","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_5.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod4","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":277,"width":100,"var":"dragpos3","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_3","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_4","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_4.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod3","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":475,"width":100,"var":"dragpos2","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_2","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_3","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_3.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod2","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":574,"width":100,"var":"dragpos1","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_1","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_2","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_2.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod1","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":475,"width":100,"var":"dragpos0","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_0","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_1","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_1.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod0","name":"mod"}}]},{"type":"Image","props":{"y":144,"x":78,"width":140,"var":"dragHeroIcon","height":140,"anchorY":1,"anchorX":0.5},"child":[{"type":"View","props":{"var":"dragHeroMod","centerX":0,"bottom":0}}]},{"type":"Image","props":{"y":16,"width":92,"skin":"ui_hero/img-duizhangjineng-bg-yingxiong.png","height":110,"centerX":-10},"child":[{"type":"Label","props":{"y":85,"x":8,"width":2,"var":"L","height":20,"bgColor":"#ccd6c6"}},{"type":"Label","props":{"y":86,"x":13,"var":"main_skillName","text":"队长技能","strokeColor":"#7c6d92","stroke":3,"height":20,"fontSize":18,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":5,"x":8,"width":76,"var":"Skill_Icon","height":76}}]},{"type":"Label","props":{"y":16,"x":236,"width":459,"var":"tixing","text":"奥法弄","strokeColor":"#7c6d92","stroke":3,"height":64,"fontSize":18,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":0,"x":617,"width":133,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":48},"child":[{"type":"Image","props":{"y":0,"x":-616,"width":654,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":48}}]},{"type":"Button","props":{"y":2,"x":667,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":22}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.kicking.KickingWarUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class BuyTimesViewUI extends View {
		public Btn_close:Laya.Button;
		public say:Laya.Label;
		public BuyTimes:Laya.Label;
		public Btn_sure:Laya.Button;
		public Btn_canle:Laya.Button;
		public price:laya.html.dom.HTMLDivElement;
		public Btn_reduce:Laya.Button;
		public Btn_add:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":586,"height":360,"centerY":0,"centerX":0,"bgColor":"#c2c1ca","alpha":1},"child":[{"type":"Image","props":{"y":71,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":99,"text":"购买","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":21,"x":546,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Label","props":{"y":83,"x":57,"width":485,"var":"say","height":35,"fontSize":22,"font":"SimHei","color":"#225a88","centerX":9,"align":"left"}},{"type":"Label","props":{"y":161,"x":240,"width":80,"height":42,"fontSize":22,"font":"SimHei","color":"#ffffd","bgColor":"#3c3b54","alpha":1,"align":"right"},"child":[{"type":"Label","props":{"y":0,"x":24,"width":55,"var":"BuyTimes","text":"1","padding":"10,2,2,5,","height":41,"fontSize":22,"font":"SimHei","color":"#fffffd","align":"right"}},{"type":"Label","props":{"y":6,"x":77,"width":55,"text":"次","height":27,"fontSize":30,"font":"SimHei","color":"#49495b","align":"center"}}]},{"type":"Button","props":{"y":316,"x":414,"width":180,"var":"Btn_sure","labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff,#fefeff,#fefeff,#fefeff","label":"确定","height":51,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Button","props":{"y":316,"x":176,"width":180,"var":"Btn_canle","labelStrokeColor":"#6a3e14","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff,#fefeff,#fefeff,#fefeff","label":"取消","height":51,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#8a712e"}}]},{"type":"HTMLDivElement","props":{"y":265,"x":392,"width":100,"var":"price","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":252,"x":8,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Image","props":{},"child":[{"type":"Button","props":{"y":181,"x":166,"var":"Btn_reduce","stateNum":1,"skin":"ui_ladder/btn-jian-goumai.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":181,"x":421,"var":"Btn_add","stateNum":1,"skin":"ui_ladder/btn-jia-goumai.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"anchorY":0.5,"anchorX":0.5}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.Ladder.BuyTimesViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class LadderLvRewardLineViewUI extends View {
		public show_item:Laya.Box;
		public Duan_name:Laya.Image;
		public name_Id:laya.html.dom.HTMLDivElement;
		public btn_downup:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":56},"child":[{"type":"Box","props":{"y":36,"x":0,"var":"show_item","renderType":"render","name":"show_item"}},{"type":"Image","props":{"y":0,"x":0,"width":570,"var":"Duan_name","skin":"ui_ladder/未标题-1.png","sizeGrid":"1,1,1,1","name":"Duan_name","height":36},"child":[{"type":"HTMLDivElement","props":{"y":6,"x":24,"width":239,"var":"name_Id","name":"name_Id","innerHTML":"htmlText","height":25}},{"type":"Label","props":{"x":4,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":18,"x":532,"var":"btn_downup","stateNum":1,"skin":"ui_ladder/btn_xialai.png","rotation":180,"right":20,"name":"btn_downup","anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.Ladder.LadderLvRewardLineViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class LadderLvUpViewUI extends View {
		public tx_tatil:Laya.Label;
		public btn_close:Laya.Button;
		public old_duan_icon:Laya.Image;
		public old_duan_name:Laya.Label;
		public old_lv_1:Laya.Image;
		public old_lv_2:Laya.Image;
		public old_lv_3:Laya.Image;
		public new_duan_icon:Laya.Image;
		public new_duan_name:Laya.Label;
		public new_lv_1:Laya.Image;
		public new_lv_2:Laya.Image;
		public new_lv_3:Laya.Image;
		public say:Laya.Label;
		public Btn_share:Laya.Button;
		public rew:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":301,"x":81,"width":589,"height":355,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":-168,"x":-1,"top":133,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"left":80,"height":84,"alpha":0.2}},{"type":"Image","props":{"y":815,"x":589,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":99,"var":"tx_tatil","text":"欢迎回来","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"centerY":0}}]},{"type":"Image","props":{"y":86,"x":94,"var":"old_duan_icon","skin":"ui_icon/icon_duanwei_7.png"},"child":[{"type":"Label","props":{"y":133,"x":39,"var":"old_duan_name","text":"大师IV","fontSize":20,"font":"SimHei"}},{"type":"Image","props":{"y":50,"x":50,"var":"old_lv_1","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_1"}},{"type":"Image","props":{"y":50,"x":58,"var":"old_lv_2","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_2"}},{"type":"Image","props":{"y":50,"x":66,"var":"old_lv_3","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_3"}}]},{"type":"Image","props":{"y":87,"x":366,"var":"new_duan_icon","skin":"ui_icon/icon_duanwei_8.png"},"child":[{"type":"Label","props":{"y":130,"x":40,"width":53,"var":"new_duan_name","text":"王者I","height":20,"fontSize":20,"font":"SimHei"}},{"type":"Image","props":{"y":50,"x":50,"var":"new_lv_1","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_1"}},{"type":"Image","props":{"y":50,"x":58,"var":"new_lv_2","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_2"}},{"type":"Image","props":{"y":50,"x":66,"var":"new_lv_3","skin":"ui_icon/icon_duanwei_shuzi_yi.png","name":"rank_lv_3"}}]},{"type":"Label","props":{"y":252,"x":7,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Label","props":{"y":51,"x":22,"width":165,"var":"say","text":"恭喜晋升","height":23,"fontSize":21,"font":"Helvetica","color":"#225a88"}},{"type":"Image","props":{"y":123,"x":264,"skin":"ui_ladder/icon-xiajueduan-jiantou.png"}},{"type":"Button","props":{"y":309,"x":294,"width":180,"var":"Btn_share","strokeColors":"#fefeff,#fefeff,#fefeff,#fefeff","labelSize":30,"labelFont":"SimHei","labelColors":"#fefeff","labelAlign":"center","label":"分享","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":-582,"x":-291,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Label","props":{"y":259,"x":207,"width":174,"var":"rew","text":"积分","height":20,"fontSize":20,"font":"SimHei","color":"#4f7c23","align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.Ladder.LadderLvUpViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class LadderResultViewUI extends View {
		public bg:Laya.Image;
		public bg_icon:Laya.Image;
		public result_logo_icon:Laya.Image;
		public win:Laya.Image;
		public start_2:Laya.Image;
		public start_1:Laya.Image;
		public start_3:Laya.Image;
		public btn_receive:Laya.Button;
		public fight_quittime:Laya.Label;
		public result_list:Laya.List;
		public min_num:Laya.Label;
		public start_num:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"width":534,"height":560,"centerY":66,"centerX":0},"child":[{"type":"Image","props":{"y":7,"x":0,"width":534,"var":"bg","skin":"ui_kicking/img-shengli-bg-pvp.png","sizeGrid":"0,3,0,3","height":560}},{"type":"Image","props":{"y":93,"x":30,"var":"bg_icon","skin":"ui_kicking/img-shengli-zhuangshi-pvp.png"}},{"type":"Image","props":{"y":-28,"x":267,"var":"result_logo_icon","skin":"ui_kicking/img-shengli-pvp.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":-89,"x":258,"visible":false,"var":"win"},"child":[{"type":"Image","props":{"y":-35,"x":-27,"var":"start_2","skin":"ui_kicking/img-shengli-huixing-pvp.png"}},{"type":"Image","props":{"y":1,"x":-58,"width":64,"var":"start_1","skin":"ui_kicking/img-shengli-huixing-pvp.png","skewY":-10,"skewX":10,"height":64,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":1,"x":68,"var":"start_3","skin":"ui_kicking/img-shengli-huixing-pvp.png","skewY":10,"skewX":-10,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Button","props":{"var":"btn_receive","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"领取","centerX":-2,"bottom":8}},{"type":"Label","props":{"y":430,"x":0,"width":484,"height":2}},{"type":"Label","props":{"y":448,"x":204,"width":130,"var":"fight_quittime","text":"5秒后自动退出","pivotY":0,"pivotX":0,"height":20,"fontSize":20,"font":"SimHei","color":"#49495b","align":"center"}},{"type":"List","props":{"y":145,"x":97,"width":342,"var":"result_list","spaceY":50,"spaceX":41,"repeatX":3,"height":249},"child":[{"type":"Box","props":{"width":86,"renderType":"render","height":86},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#20263e"}},{"type":"Label","props":{"top":1,"right":1,"name":"item_bg","left":1,"bottom":1,"bgColor":"#6b85ea"}},{"type":"Image","props":{"y":0,"x":0,"width":85,"skin":"ui_icon/icon_tou_frk.png","name":"item_icon","height":85}},{"type":"Image","props":{"y":74,"visible":true,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"y":86,"right":0,"padding":"5","name":"item_name","left":0,"height":25,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":66,"right":0,"padding":"0,0,0,0","name":"item_num","left":0,"height":20,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"right"}}]}]},{"type":"Label","props":{"y":82,"x":361,"width":162,"var":"min_num","text":"积分:+25","height":41,"fontSize":22,"font":"SimHei","color":"#e4eafe"}},{"type":"Label","props":{"y":81,"x":61,"width":162,"var":"start_num","text":"我方评星:2星","height":41,"fontSize":22,"font":"SimHei","color":"#e4eafe"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.Ladder.LadderResultViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class LadderRewardUI extends View {
		public Btn_close:Laya.Button;
		public panel:Laya.Panel;
		public Vbox:Laya.VBox;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":586,"text":"label","height":760,"centerY":0,"centerX":0,"bgColor":"#c2c1ca"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":586,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,0,1,0","height":50},"child":[{"type":"Label","props":{"y":12,"x":20,"width":6,"height":25,"bgColor":"#df8e2f"}},{"type":"Label","props":{"y":12,"x":44,"width":105,"text":"奖励预览","height":31,"fontSize":26,"font":"SimHei","color":"#e4eafe","align":"left"}},{"type":"Button","props":{"y":4,"x":528,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png"}}]},{"type":"Image","props":{"y":968,"x":589,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":72,"x":-41,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"left":0,"alpha":0.2}},{"type":"Panel","props":{"y":70,"width":560,"var":"panel","height":625,"centerX":0},"child":[{"type":"VBox","props":{"y":0,"x":0,"width":560,"var":"Vbox","height":625,"centerX":0}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.Ladder.LadderRewardUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class LadderViewUI extends View {
		public bg:Laya.Label;
		public title:Laya.Label;
		public Btn_close:Laya.Button;
		public LadderRank_name:Laya.Label;
		public play_min:Laya.Label;
		public LadderRank_icon:Laya.Image;
		public rank_lv_1:Laya.Image;
		public rank_lv_2:Laya.Image;
		public rank_lv_3:Laya.Image;
		public btn_hero_war:Laya.Button;
		public btn_pet_war:Laya.Button;
		public my_times:laya.html.dom.HTMLDivElement;
		public Btn_buytimes:Laya.Button;
		public oppo_captain_mod:Laya.Image;
		public oppo_lv:Laya.Label;
		public oppo_win_num:Laya.Label;
		public my_captain_mod:Laya.Image;
		public play_lv:Laya.Label;
		public play_ladderrank:Laya.Label;
		public play_win_num:Laya.Label;
		public play_name:Laya.Label;
		public oppo_name:Laya.Label;
		public oppo_ladderrank:Laya.Label;
		public reward:Laya.Label;
		public win_base:Laya.Label;
		public win_basebg:Laya.Label;
		public win_baseicon:Laya.Image;
		public win_basename:Laya.Label;
		public win_basenum:Laya.Label;
		public win_extra:Laya.Label;
		public win_extrabg:Laya.Label;
		public win_extraicon:Laya.Image;
		public win_extraname:Laya.Label;
		public win_extranum:Laya.Label;
		public btn_challage:Laya.Button;
		public match_win:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"bg","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":700,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,3,0","height":974,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":59,"x":21,"width":660,"height":160,"bgColor":"#32324d","alpha":1}},{"type":"Label","props":{"y":-4,"right":0,"left":0,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":18,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":40,"var":"title","text":"英雄详情","fontSize":24,"font":"SimHei","color":"#dde2f2","centerY":0}},{"type":"Button","props":{"y":7,"x":642,"width":44,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","height":42}}]},{"type":"Label","props":{"y":73,"x":210,"width":230,"var":"LadderRank_name","height":46,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":112,"x":210,"width":230,"var":"play_min","height":42,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Image","props":{"y":139,"x":97,"var":"LadderRank_icon","skin":"ui_icon/icon_duanwei_7.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":50,"x":48,"var":"rank_lv_1","skin":"ui_icon/icon_duanwei_shuzi_yi.png"}},{"type":"Image","props":{"y":50,"x":56,"var":"rank_lv_2","skin":"ui_icon/icon_duanwei_shuzi_yi.png"}},{"type":"Image","props":{"y":50,"x":64,"var":"rank_lv_3","skin":"ui_icon/icon_duanwei_shuzi_yi.png"}}]},{"type":"Button","props":{"y":108,"x":604,"width":94,"var":"btn_hero_war","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"英雄布阵","height":39,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":166,"x":604,"width":94,"var":"btn_pet_war","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"宠物布阵","height":39,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":246,"x":31,"width":298,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":28},"child":[{"type":"HTMLDivElement","props":{"y":0,"x":0,"width":263,"var":"my_times","innerHTML":"htmlText","height":25}},{"type":"Label","props":{"x":4,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":-10,"x":248,"var":"Btn_buytimes","stateNum":1,"skin":"ui_icon/btn-jiacishu-tianti.png"}}]},{"type":"Image","props":{"y":290,"x":48,"skin":"ui_ladder/btn-pipei-bg-tianti.png"},"child":[{"type":"Image","props":{"y":75,"x":429,"width":128,"var":"oppo_captain_mod","skin":"ui_ladder/btn-wenhao-tianti.png","height":172}},{"type":"Sprite","props":{"y":0,"x":-49,"width":701,"renderType":"mask","height":360},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":701,"lineWidth":1,"height":360,"fillColor":"#ff0000"}}]},{"type":"Image","props":{},"child":[{"type":"Label","props":{"y":475,"x":583,"visible":false,"var":"oppo_lv","right":0,"fontSize":32,"font":"SimHei","align":"right"}},{"type":"Label","props":{"y":551,"x":583,"visible":false,"var":"oppo_win_num","right":0,"fontSize":32,"font":"SimHei","align":"right"}}]},{"type":"Image","props":{"y":0,"x":0,"width":610,"height":368},"child":[{"type":"Image","props":{"y":-48,"x":18,"width":87,"var":"my_captain_mod","height":37}},{"type":"Label","props":{"y":351,"x":105,"visible":false,"var":"play_lv","right":0,"fontSize":32,"font":"SimHei","align":"right"}},{"type":"Label","props":{"y":327,"x":27,"var":"play_ladderrank","text":"段位:黄金","fontSize":20,"font":"SimHei","color":"#d7e6ff","align":"left"}},{"type":"Label","props":{"y":427,"x":105,"visible":false,"var":"play_win_num","right":0,"fontSize":32,"font":"SimHei","align":"right"}},{"type":"Label","props":{"y":295,"x":27,"var":"play_name","fontSize":22,"font":"SimHei","color":"#feeed1","align":"right"}}]},{"type":"Label","props":{"y":294,"x":450,"var":"oppo_name","fontSize":22,"font":"SimHei","color":"#feeed1","align":"right"}},{"type":"Label","props":{"y":325,"x":450,"var":"oppo_ladderrank","text":"段位:??????","fontSize":20,"font":"SimHei","color":"#d7e6ff","align":"left"}}]},{"type":"Label","props":{"y":678,"x":561,"width":89,"var":"reward","underline":true,"text":"奖励预览","height":28,"fontSize":22,"font":"SimHei","color":"#b0ff9d"}},{"type":"Label","props":{"width":84,"var":"win_base","top":713,"left":61,"height":84,"bgColor":"#20263e"},"child":[{"type":"Label","props":{"var":"win_basebg","top":1,"right":1,"left":1,"bottom":1}},{"type":"Image","props":{"y":1,"x":1,"width":82,"var":"win_baseicon","height":82,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":85,"x":2,"width":87,"var":"win_basename","height":25,"fontSize":22,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":64,"var":"win_basenum","right":3,"name":"item_num","fontSize":18,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Image","props":{"y":74,"x":10,"visible":true,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}}]},{"type":"Label","props":{"y":712,"x":186,"width":84,"var":"win_extra","height":84,"bgColor":"#20263e"},"child":[{"type":"Label","props":{"var":"win_extrabg","top":1,"right":1,"left":1,"bottom":1}},{"type":"Image","props":{"y":1,"x":1,"width":82,"var":"win_extraicon","height":82,"centerY":0,"centerX":0}},{"type":"Label","props":{"y":85,"x":2,"width":87,"var":"win_extraname","height":25,"fontSize":22,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":64,"var":"win_extranum","right":3,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Image","props":{"y":84,"x":20,"visible":true,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}}]},{"type":"Image","props":{"y":841,"x":22,"width":662,"skin":"ui_camp/img-baibian-zhenying.png","sizeGrid":"5,2,1,1","height":120}},{"type":"Button","props":{"y":902,"x":352,"var":"btn_challage","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"匹配","centerX":2,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":867,"x":217,"width":260,"visible":false,"var":"match_win","text":"匹配成功","padding":"20","height":69,"fontSize":30,"font":"SimHei","color":"#38429f","bold":true,"align":"center"}},{"type":"Label","props":{"y":676,"x":49,"width":6,"height":25,"bgColor":"#df8e2f"}},{"type":"Label","props":{"y":676,"x":69,"text":"获得奖励","fontSize":24,"font":"SimHei","color":"#dde2f2"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.Ladder.LadderViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class QuitLadderViewUI extends View {
		public Say:laya.display.Text;
		public Btn_close:Laya.Button;
		public Btn_canle:Laya.Button;
		public Btn_sure:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"width":590,"height":338,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":87,"width":90,"text":"提示","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":-13,"x":260,"width":288,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":40},"child":[{"type":"Image","props":{"y":0,"x":248,"width":82,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":40}}]}]},{"type":"Label","props":{"y":28,"x":590,"width":40,"height":40},"child":[{"type":"Image","props":{"y":0,"x":0,"width":310,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","skewY":90,"skewX":-90,"height":590}}]},{"type":"Image","props":{"y":111,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"y":256,"x":510,"skin":"ui_common/img-huawen2.png","alpha":0.4}},{"type":"Image","props":{"y":230,"x":12,"width":566,"height":1}},{"type":"Text","props":{"y":113,"x":77,"width":435,"var":"Say","text":"退出后本次战斗失败，是否退出！","height":32,"fontSize":30,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Button","props":{"y":-13,"var":"Btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":2}},{"type":"Button","props":{"y":257,"x":86,"width":180,"var":"Btn_canle","stateNum":1,"height":50},"child":[{"type":"Label","props":{"y":0,"x":0,"width":180,"text":"取消","strokeColor":"#493215","stroke":3,"padding":"13","height":50,"fontSize":26,"font":"SimHei","color":"#fffdfd","bold":true,"bgColor":"#8d6e1e","align":"center"}}]},{"type":"Button","props":{"y":257,"x":324,"width":180,"var":"Btn_sure","stateNum":1,"height":50},"child":[{"type":"Label","props":{"y":0,"x":0,"width":180,"text":"确定","strokeColor":"#1f4915","stroke":3,"padding":"13","height":50,"fontSize":26,"font":"SimHei","color":"#fffdfd","bold":true,"bgColor":"#4e8d1e","align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.Ladder.QuitLadderViewUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class RewardItemLineUI extends View {
		public start_icon:Laya.Image;
		public start_num:Laya.Label;
		public item0:Laya.Label;
		public item_bg:Laya.Label;
		public item_icon:Laya.Image;
		public bg_img:Laya.Image;
		public item_name:Laya.Label;
		public item_num:Laya.Label;
		public item1:Laya.Label;
		public item_bg1:Laya.Label;
		public item_icon1:Laya.Image;
		public bg_img1:Laya.Image;
		public item_name1:Laya.Label;
		public item_num1:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":132},"child":[{"type":"Box","props":{"y":0,"x":0,"width":570,"renderType":"render","height":132},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#2f3548"}},{"type":"Image","props":{"y":3,"x":16,"var":"start_icon","skin":"ui_icon/icon-yixing-tianti.png"}},{"type":"Label","props":{"y":102,"x":36,"width":90,"var":"start_num","text":"一星奖励","height":22,"fontSize":22,"font":"SimHei","color":"#e4eafe"}},{"type":"Label","props":{"y":12,"x":156,"width":84,"visible":true,"var":"item0","height":84,"bgColor":"#20263e"},"child":[{"type":"Label","props":{"var":"item_bg","top":2,"right":2,"name":"item_bg","left":2,"bottom":2,"bgColor":"#453d2f"}},{"type":"Image","props":{"var":"item_icon","name":"item_icon","centerY":0,"centerX":0}},{"type":"Image","props":{"y":64,"x":0,"visible":true,"var":"bg_img","skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg_img","left":0,"bottom":0}},{"type":"Label","props":{"y":83,"x":1,"width":81,"var":"item_name","text":"钻石","padding":"5","height":25,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":65,"width":81,"var":"item_num","padding":"0,0,0,0","height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","centerX":0,"align":"right"}}]},{"type":"Label","props":{"y":13,"x":262,"width":84,"visible":true,"var":"item1","height":84,"bgColor":"#20263e"},"child":[{"type":"Label","props":{"var":"item_bg1","top":2,"right":2,"left":2,"bottom":2}},{"type":"Image","props":{"var":"item_icon1","centerY":0,"centerX":0}},{"type":"Image","props":{"y":64,"x":0,"visible":true,"var":"bg_img1","skin":"ui_consumer/img-shuliang-bg.png","right":0,"left":0,"bottom":0}},{"type":"Label","props":{"y":83,"x":1,"width":81,"var":"item_name1","padding":"5","height":25,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":65,"width":81,"var":"item_num1","padding":"0,0,0,0","height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","centerX":0,"align":"right"}}]},{"type":"Label","props":{"y":13,"x":367,"width":84,"visible":false,"name":"item2","height":84,"bgColor":"#20263e"},"child":[{"type":"Image","props":{"y":64,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Image","props":{"top":2,"right":2,"name":"item_bg","left":2,"bottom":2}},{"type":"Image","props":{"name":"item_icon","centerY":0,"centerX":0}},{"type":"Label","props":{"y":83,"x":1,"width":81,"padding":"5","name":"item_name","height":25,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":58,"x":1,"width":81,"name":"item_num","height":25,"fontSize":18,"font":"SimHei","align":"right"}}]},{"type":"Label","props":{"y":13,"x":473,"width":84,"visible":false,"name":"item3","height":84,"bgColor":"#20263e"},"child":[{"type":"Image","props":{"y":64,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Image","props":{"top":2,"right":2,"name":"item_bg","left":2,"bottom":2}},{"type":"Image","props":{"name":"item_icon","centerY":0,"centerX":0}},{"type":"Label","props":{"y":83,"x":1,"width":81,"padding":"5","name":"item_name","height":25,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"y":58,"x":1,"width":81,"name":"item_num","height":25,"fontSize":18,"font":"SimHei","align":"right"}}]},{"type":"Label","props":{"y":130,"x":2,"width":568,"height":2,"color":"500","centerX":0,"bgColor":"#191e2e"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.Ladder.RewardItemLineUI.uiView);

        }

    }
}

module ui.action.Ladder {
    export class StreakWinViewUI extends View {
		public tx_tatil:Laya.Label;
		public Btn_close:Laya.Button;
		public one:Laya.Clip;
		public two:Laya.Clip;
		public action_type:Laya.Label;
		public Btn_share:Laya.Button;
		public share_rew:laya.html.dom.HTMLDivElement;
		public say:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":301,"x":85,"width":588,"height":355,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":99,"var":"tx_tatil","text":"欢迎回来","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"centerY":0}}]},{"type":"Image","props":{"y":72,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"left":0,"alpha":0.2}},{"type":"Image","props":{"y":10,"x":10,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Label","props":{"y":252,"x":7,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Clip","props":{"y":92,"x":323,"width":58,"var":"one","skin":"ui_ladder/img-dianji-shanghai.png","pivotY":0,"pivotX":0,"index":5,"height":67,"clipY":1,"clipX":10},"child":[{"type":"Clip","props":{"y":0,"x":50,"width":58,"visible":false,"var":"two","skin":"ui_ladder/img-dianji-shanghai.png","index":5,"height":67,"clipY":1,"clipX":10}}]},{"type":"Label","props":{"y":111,"x":121,"width":185,"var":"action_type","text":"恭喜天梯达成","height":39,"fontSize":30,"font":"SimHei","color":"#741310","align":"center"}},{"type":"Label","props":{"y":111,"x":400,"width":74,"text":"连胜!","height":34,"fontSize":30,"font":"SimHei","color":"#741310","align":"center"}},{"type":"Button","props":{"y":309,"x":290,"width":180,"var":"Btn_share","stateNum":1,"labelSize":30,"labelFont":"SimHei","labelColors":"#fefeff","labelAlign":"center","label":"分享","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":-284,"x":-200,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"HTMLDivElement","props":{"y":260,"x":200,"width":179,"var":"share_rew","innerHTML":"htmlText","height":23}},{"type":"Label","props":{"y":172,"x":115,"width":365,"var":"say","text":"分享","height":30,"fontSize":25,"font":"SimHei","color":"#225a88","align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.Ladder.StreakWinViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class ChampionPraiseViewUI extends View {
		public Btn_close:Laya.Button;
		public Praise_1:Laya.Image;
		public Praise_2:Laya.Image;
		public title:laya.display.Text;
		public Time:laya.display.Text;
		public Name_1:laya.display.Text;
		public Name_2:laya.display.Text;
		public box_1:Laya.Box;
		public dragpos0_1:Laya.Image;
		public mod0_1:View;
		public dragpos1_1:Laya.Image;
		public mod1_1:View;
		public dragpos2_1:Laya.Image;
		public mod2_1:View;
		public dragpos3_1:Laya.Image;
		public mod3_1:View;
		public dragpos4_1:Laya.Image;
		public mod4_1:View;
		public dragpos5_1:Laya.Image;
		public mod5_1:View;
		public dragpos6_1:Laya.Image;
		public mod6_1:View;
		public dragpos7_1:Laya.Image;
		public mod7_1:View;
		public dragpos8_1:Laya.Image;
		public mod8_1:View;
		public box_2:Laya.Box;
		public dragpos0_2:Laya.Image;
		public mod0_2:View;
		public dragpos1_2:Laya.Image;
		public mod1_2:View;
		public dragpos2_2:Laya.Image;
		public mod2_2:View;
		public dragpos3_2:Laya.Image;
		public mod3_2:View;
		public dragpos4_2:Laya.Image;
		public mod4_2:View;
		public dragpos5_2:Laya.Image;
		public mod5_2:View;
		public dragpos6_2:Laya.Image;
		public mod6_2:View;
		public dragpos7_2:Laya.Image;
		public mod7_2:View;
		public dragpos8_2:Laya.Image;
		public mod8_2:View;
		public WinOrFail_1:Laya.Image;
		public WinOrFail_2:Laya.Image;
		public Btn_see:Laya.Button;
		public Btn_praise_1:Laya.Button;
		public praiseCost_1:laya.display.Text;
		public Btn_text_1:laya.display.Text;
		public Btn_praise_2:Laya.Button;
		public praiseCost_2:laya.display.Text;
		public Btn_text_2:laya.display.Text;
		public odds_1:laya.display.Text;
		public odds_2:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":30,"x":30,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":223,"x":0,"width":750,"height":571,"bgColor":"#303b3b"},"child":[{"type":"Image","props":{"y":567,"x":334,"skin":"ui_common/img-huawen1.png","scaleY":-1,"scaleX":-1}},{"type":"Image","props":{"y":567,"x":430,"skin":"ui_common/img-huawen1.png","scaleY":-1}}]},{"type":"Image","props":{"y":223,"x":0,"width":750,"height":571}},{"type":"Image","props":{"y":188,"x":578,"width":172,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":38},"child":[{"type":"Button","props":{"y":0,"x":69,"var":"Btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":42}},{"type":"Label","props":{"y":604,"x":-578,"width":750,"height":3,"bgColor":"#4a408a"}},{"type":"Label","props":{"y":35,"x":-578,"width":750,"height":3,"bgColor":"#4a408a"}},{"type":"Image","props":{"y":-11,"x":-636,"skin":"ui_match/img-bg-taitou-pkliansai.png","alpha":0.7}}]},{"type":"Image","props":{"y":267,"x":-62,"width":812,"skin":"ui_match/img-guanjun-bg-pkliansai.png","height":426},"child":[{"type":"Image","props":{"y":4,"x":380,"skin":"ui_match/img-vs-pkliansai.png"}}]},{"type":"Image","props":{"y":575,"x":253,"visible":false,"var":"Praise_1","skin":"ui_match/img-zan-pkliansai.png"}},{"type":"Image","props":{"y":575,"x":341,"visible":false,"var":"Praise_2","skin":"ui_match/img-zan-pkliansai.png"}},{"type":"Text","props":{"y":175,"x":10,"width":183,"var":"title","text":"冠军点赞","strokeColor":"#9452de","stroke":2,"height":57,"fontSize":43,"font":"SimHei","color":"#dbd5df","bold":true}},{"type":"Text","props":{"y":236,"x":26,"width":313,"var":"Time","text":"4小时34分11秒进入冠军决赛","height":33,"fontSize":20,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Text","props":{"y":590,"x":69,"width":181,"var":"Name_1","text":"玩家名字名字","height":26,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Text","props":{"y":590,"x":392,"width":181,"var":"Name_2","text":"玩家名字名字","height":26,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Box","props":{"y":311,"x":0,"width":366,"var":"box_1","height":326},"child":[{"type":"Image","props":{"y":-7,"x":199,"width":100,"var":"dragpos0_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod0_1","name":"mod"}}]},{"type":"Image","props":{"y":56,"x":251,"width":100,"var":"dragpos1_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod1_1","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":199,"width":100,"var":"dragpos2_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod2_1","name":"mod"}}]},{"type":"Image","props":{"y":-7,"x":101,"width":100,"var":"dragpos3_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod3_1","name":"mod"}}]},{"type":"Image","props":{"y":58,"x":138,"width":100,"var":"dragpos4_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod4_1","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":101,"width":100,"var":"dragpos5_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod5_1","name":"mod"}}]},{"type":"Image","props":{"y":-7,"x":3,"width":100,"var":"dragpos6_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod6_1","name":"mod"}}]},{"type":"Image","props":{"y":56,"x":41,"width":100,"var":"dragpos7_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod7_1","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":3,"width":100,"var":"dragpos8_1","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod8_1","name":"mod"}}]}]},{"type":"Box","props":{"y":311,"x":383,"width":366,"var":"box_2","height":326},"child":[{"type":"Image","props":{"y":-7,"x":58,"width":100,"var":"dragpos0_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod0_2","name":"mod"}}]},{"type":"Image","props":{"y":56,"x":3,"width":100,"var":"dragpos1_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod1_2","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":58,"width":100,"var":"dragpos2_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod2_2","name":"mod"}}]},{"type":"Image","props":{"y":-7,"x":156,"width":100,"var":"dragpos3_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod3_2","name":"mod"}}]},{"type":"Image","props":{"y":58,"x":118,"width":100,"var":"dragpos4_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod4_2","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":156,"width":100,"var":"dragpos5_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod5_2","name":"mod"}}]},{"type":"Image","props":{"y":-7,"x":261,"width":100,"var":"dragpos6_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod6_2","name":"mod"}}]},{"type":"Image","props":{"y":57,"x":221,"width":100,"var":"dragpos7_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod7_2","name":"mod"}}]},{"type":"Image","props":{"y":121,"x":261,"width":100,"var":"dragpos8_2","height":150},"child":[{"type":"View","props":{"y":135,"x":50,"var":"mod8_2","name":"mod"}}]}]},{"type":"Image","props":{"y":514,"x":-1,"visible":false,"var":"WinOrFail_1","skin":"ui_match/icon-pkliansai-shengli.png"}},{"type":"Image","props":{"y":514,"x":638,"visible":false,"var":"WinOrFail_2","skin":"ui_match/icon-pkliansai-shengli.png"}},{"type":"Button","props":{"y":715,"x":378,"var":"Btn_see","stateNum":1,"skin":"ui_common/btn-huodong-p.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Text","props":{"y":0,"x":0,"width":163,"valign":"middle","text":"观战","height":68,"fontSize":28,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":715,"x":153,"width":162,"var":"Btn_praise_1","stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"btn_praise1","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","height":70,"gray":false,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":43,"x":51,"width":23,"skin":"ui_icon/icon_prop_013.png","height":20}},{"type":"Text","props":{"y":42,"x":84,"width":58,"var":"praiseCost_1","valign":"middle","text":"66","name":"praiseCost_1","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}},{"type":"Text","props":{"y":-10,"x":0,"width":163,"var":"Btn_text_1","valign":"middle","text":"点赞","height":68,"fontSize":28,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":715,"x":598,"width":162,"var":"Btn_praise_2","stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"btn_praise1","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","height":70,"gray":false,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":43,"x":51,"width":23,"skin":"ui_icon/icon_prop_013.png","height":20}},{"type":"Text","props":{"y":42,"x":84,"width":58,"var":"praiseCost_2","valign":"middle","text":"66","name":"praiseCost_1","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}},{"type":"Text","props":{"y":-10,"x":0,"width":163,"var":"Btn_text_2","valign":"middle","text":"点赞","height":68,"fontSize":28,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"}}]},{"type":"Text","props":{"y":645,"x":93,"width":131,"var":"odds_1","valign":"top","text":"赔率2.38","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#feeed1","bold":false,"align":"center"}},{"type":"Text","props":{"y":645,"x":535,"width":131,"var":"odds_2","valign":"top","text":"赔率2.38","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#feeed1","bold":false,"align":"center"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.match.ChampionPraiseViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class JoinMatchTipViewUI extends View {
		public Btn_close:Laya.Button;
		public Btn_sure:Laya.Button;
		public Btn_cancel:Laya.Button;
		public say:Laya.Label;
		public Quit_time:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"x":82,"width":587,"height":400,"centerY":0,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":587,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50},"child":[{"type":"Button","props":{"x":532,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}},{"type":"Label","props":{"x":45,"width":105,"text":"观战提示","height":31,"fontSize":24,"font":"SimHei","color":"#fefeff","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}}]},{"type":"Button","props":{"x":330,"width":180,"var":"Btn_sure","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"确定","height":50,"bottom":33},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Button","props":{"x":76,"width":180,"var":"Btn_cancel","stateNum":1,"labelStrokeColor":"#6a3e14","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"取消","height":50,"bottom":33},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#8a712e"}}]},{"type":"Label","props":{"y":173,"x":293,"width":500,"var":"say","valign":"middle","text":"是否观战16强决赛","height":45,"fontSize":30,"font":"SimHei","color":"#49495b","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"x":7,"width":567,"height":2,"bottom":111,"bgColor":"#7c7a88"}},{"type":"Label","props":{"y":241,"x":218,"var":"Quit_time","text":"自动退出倒计时","fontSize":22,"font":"SimHei","color":"#49495b"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.match.JoinMatchTipViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchBossEndViewUI extends View {
		public bg:Laya.Label;
		public Other:Laya.Label;
		public My_hurt:Laya.Label;
		public Btn_sure:Laya.Button;
		public title:Laya.Label;
		public Quit_time:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"var":"bg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.3}},{"type":"Label","props":{"y":218,"var":"My_hurt","strokeColor":"#3b2213","stroke":6,"fontSize":26,"font":"SimHei","color":"#fef8e9","centerX":0,"align":"center"}},{"type":"Button","props":{"x":377,"var":"Btn_sure","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"labelAlign":"center","label":"点击退出","bottom":208,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":159,"x":293,"var":"title","text":"挑战完成","strokeColor":"#3b2213","stroke":6,"fontSize":40,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":871,"x":288,"var":"Quit_time","text":"自动退出倒计时","strokeColor":"#3b2213","stroke":6,"fontSize":22,"font":"SimHei","color":"#fef3ce"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.match.MatchBossEndViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchElectionViewUI extends View {
		public rootLabel:Laya.Label;
		public Btn_Close:Laya.Button;
		public tatil:Laya.Label;
		public Btn_Challenge:Laya.Button;
		public BtnText:laya.display.Text;
		public Boss_say:Laya.Label;
		public Boss_Name:Laya.Label;
		public Boss_Icon:Laya.Image;
		public Time:Laya.Label;
		public hurt_bg:Laya.Image;
		public Hurt_max:Laya.Label;
		public rank_bg:Laya.Image;
		public rank_text:Laya.Label;
		public Btn_Rank:Laya.Button;
		public Btn_war:Laya.Button;
		public Btn_pet:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":9,"x":10,"var":"rootLabel","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":1},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_scene01/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1178}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1014,"bottom":-80}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":527}},{"type":"Image","props":{"x":583,"skin":"ui_scene01/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":581}},{"type":"Image","props":{"x":0,"skin":"ui_scene01/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":12}}]},{"type":"Image","props":{"width":750,"top":0,"right":0,"left":0,"height":1200,"bottom":0},"child":[{"type":"Image","props":{"width":750,"top":0,"sizeGrid":"10,24,6,0","right":0,"left":0,"height":82},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908"}},{"type":"Image","props":{"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","right":0,"left":0,"height":47,"bottom":1},"child":[{"type":"Image","props":{"y":0,"x":571,"width":179,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","right":0,"pivotY":0,"pivotX":0,"height":47},"child":[{"type":"Button","props":{"y":0,"width":48,"var":"Btn_Close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","height":44,"centerX":14}}]}]},{"type":"Label","props":{"x":37,"width":115,"var":"tatil","valign":"middle","text":"海选大赛","height":29,"fontSize":26,"font":"SimHei","color":"#feb979","bottom":4,"bold":false,"align":"left"}},{"type":"Label","props":{"x":12,"width":6,"height":22,"bottom":9,"bgColor":"#4a408a"}}]},{"type":"Button","props":{"width":294,"var":"Btn_Challenge","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"height":90,"centerY":357,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Text","props":{"y":0,"x":0,"width":295,"var":"BtnText","valign":"middle","text":"挑战","height":92,"fontSize":40,"font":"SimHei","color":"#491a22","bold":true,"align":"center"}}]},{"type":"Label","props":{"y":847,"x":375,"width":500,"var":"Boss_say","pivotY":15,"pivotX":250,"height":30,"fontSize":22,"font":"SimHei","color":"#fef3ce","align":"center"}},{"type":"Label","props":{"width":180,"var":"Boss_Name","text":"BOSS名称","strokeColor":"#5c4637","stroke":3,"height":30,"fontSize":26,"font":"SimHei","color":"#fef8e9","centerY":-380,"centerX":0,"bold":true,"align":"center"}},{"type":"Image","props":{"width":400,"var":"Boss_Icon","height":540,"centerY":-99,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":887,"x":375,"width":500,"var":"Time","pivotY":15,"pivotX":250,"height":30,"fontSize":22,"font":"SimHei","color":"#fef3ce","align":"center"}}]},{"type":"Image","props":{"y":118,"x":23,"width":210,"visible":false,"var":"hurt_bg","skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":40},"child":[{"type":"Label","props":{"y":4,"x":0,"wordWrap":false,"width":241,"var":"Hurt_max","valign":"middle","text":"我的伤害:","name":"倒计时","height":33,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"left"}}]},{"type":"Image","props":{"y":171,"x":23,"width":210,"visible":false,"var":"rank_bg","skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":40},"child":[{"type":"Label","props":{"y":4,"x":0,"wordWrap":false,"width":241,"var":"rank_text","valign":"middle","text":"我的排行:","height":33,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"left"}}]},{"type":"Button","props":{"y":146,"x":51,"var":"Btn_Rank","stateNum":1,"skin":"ui_wroldboss/btn-paihang-shijieboss.png","left":24,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":39,"x":-6,"text":"排行榜","strokeColor":"#7c6d92","stroke":3,"fontSize":22,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":118,"x":608,"width":130,"var":"Btn_war","stateNum":1,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":40},"child":[{"type":"Label","props":{"y":4,"x":0,"wordWrap":false,"width":130,"valign":"middle","text":"英雄布阵","height":33,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]},{"type":"Button","props":{"y":169,"x":608,"width":130,"var":"Btn_pet","stateNum":1,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":40},"child":[{"type":"Label","props":{"y":4,"x":0,"wordWrap":false,"width":130,"valign":"middle","text":"宠物布阵","height":33,"fontSize":20,"font":"SimHei","color":"#f4f4f4","align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.match.MatchElectionViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchPKEndViewUI extends View {
		public bg:Laya.Label;
		public Other:Laya.Label;
		public My_hurt:Laya.Label;
		public Btn_sure:Laya.Button;
		public title:Laya.Label;
		public Quit_time:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":20,"x":20,"var":"bg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.3}},{"type":"Label","props":{"y":218,"var":"My_hurt","strokeColor":"#3b2213","stroke":6,"fontSize":26,"font":"SimHei","color":"#fef8e9","centerX":0,"align":"center"}},{"type":"Button","props":{"x":377,"var":"Btn_sure","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"labelAlign":"center","label":"点击退出","bottom":208,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":159,"x":293,"var":"title","text":"战斗胜利","strokeColor":"#3b2213","stroke":6,"fontSize":40,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":871,"x":288,"var":"Quit_time","text":"自动退出倒计时","strokeColor":"#3b2213","stroke":6,"fontSize":22,"font":"SimHei","color":"#fef3ce"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.match.MatchPKEndViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchPraiseViewUI extends View {
		public title_text:Laya.Label;
		public praiseCount:laya.html.dom.HTMLDivElement;
		public timetext:Laya.Label;
		public groupList:Laya.List;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":20,"x":20,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":10,"x":10,"width":750,"height":1200,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":39,"x":50,"width":650,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":49,"var":"title_text","text":"16强决赛","fontSize":26,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}}]},{"type":"Label","props":{"y":88,"x":50,"width":650,"height":1014,"bgColor":"#616985"}},{"type":"Label","props":{"y":89,"x":50,"width":650,"height":42},"child":[{"type":"HTMLDivElement","props":{"y":7,"x":49,"width":242,"var":"praiseCount","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"x":384,"width":259,"var":"timetext","text":".xx分xx秒进入16强决赛","height":26,"fontSize":22,"font":"SimHei","color":"#e4eafe","centerY":-1,"align":"left"}}]},{"type":"List","props":{"y":128,"x":62,"width":626,"var":"groupList","spaceY":6,"height":967},"child":[{"type":"Box","props":{"y":11,"x":8,"width":611,"renderType":"render","height":275},"child":[{"type":"Image","props":{"y":0,"x":0,"width":611,"skin":"ui_memory/btn-pipei-bg-tianti.png","sizeGrid":"0,3,0,82","height":275}},{"type":"Image","props":{"y":52,"x":241,"skin":"ui_match/img-vs-bg-pkliansai.png"},"child":[{"type":"Image","props":{"y":23,"x":8,"skin":"ui_match/img-vs-pkliansai.png"}}]},{"type":"Text","props":{"y":50,"x":268,"width":77,"valign":"middle","text":"第一组","name":"groupNum","height":30,"fontSize":22,"font":"SimHei","color":"#ecddeb","align":"center"}},{"type":"Image","props":{"y":20,"x":45,"skin":"ui_match/img-bg-bieren-dianzan-pkliansai.png","name":"bgImg_1"}},{"type":"Image","props":{"y":50,"x":81,"width":85,"skin":"ui_hero/img-lanpingzhilkuang.png","height":85}},{"type":"Image","props":{"y":50,"x":81,"width":85,"skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","name":"icon_1","height":85}},{"type":"Text","props":{"y":147,"x":57,"width":131,"valign":"top","text":"赔率2.38","name":"odds_1","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#feeed1","bold":false,"align":"center"}},{"type":"Text","props":{"y":20,"x":48,"width":151,"valign":"middle","text":"李毅大帝","name":"name_1","height":32,"fontSize":20,"font":"SimHei","color":"#fffbf1","align":"center"}},{"type":"Image","props":{"y":6,"x":173,"visible":false,"skin":"ui_match/img-zan-pkliansai.png","name":"praise_1"}},{"type":"Image","props":{"y":20,"x":410,"skin":"ui_match/img-bg-bieren-dianzan-pkliansai.png","name":"bgImg_2"}},{"type":"Image","props":{"y":50,"x":446,"width":85,"skin":"ui_hero/img-lanpingzhilkuang.png","height":85}},{"type":"Image","props":{"y":50,"x":446,"width":85,"skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","name":"icon_2","height":85}},{"type":"Text","props":{"y":147,"x":422,"width":131,"valign":"top","text":"赔率2.38","name":"odds_2","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#feeed1","bold":false,"align":"center"}},{"type":"Text","props":{"y":20,"x":413,"width":151,"valign":"middle","text":"李毅大帝","name":"name_2","height":32,"fontSize":20,"font":"SimHei","color":"#fffbf1","align":"center"}},{"type":"Image","props":{"y":6,"x":390,"visible":false,"skin":"ui_match/img-zan-pkliansai.png","name":"praise_2"}},{"type":"Button","props":{"y":223,"x":122,"width":162,"stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"btn_praise1","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"点赞","height":70,"gray":false,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":43,"x":51,"width":23,"skin":"ui_icon/icon_prop_013.png","height":20}},{"type":"Text","props":{"y":42,"x":84,"width":58,"valign":"middle","text":"66","name":"praiseCost_1","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}}]},{"type":"Button","props":{"y":223,"x":486,"width":162,"stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"btn_praise2","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"点赞","height":70,"gray":false,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":43,"x":51,"width":23,"skin":"ui_icon/icon_prop_013.png","height":20}},{"type":"Text","props":{"y":42,"x":84,"width":58,"valign":"middle","text":"66","name":"praiseCost_2","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}}]},{"type":"Button","props":{"y":198,"x":245,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"btn_see","labelSize":22,"labelFont":"SimHei","labelColors":"#ffffff","label":"观看"}}]}]}]},{"type":"Button","props":{"y":61,"x":662,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":66,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);
			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.match.MatchPraiseViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchRankViewUI extends View {
		public title:Laya.Label;
		public rankList:Laya.List;
		public myInfo:Laya.Box;
		public myRankIcon:Laya.Image;
		public myRankContent:laya.display.Text;
		public myRankName:laya.display.Text;
		public myRankNum:laya.display.Text;
		public notNum:laya.display.Text;
		public myCampName:Laya.Label;
		public close:Laya.Image;
		public myVip:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"width":750,"height":1200,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":147,"x":25,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":49,"var":"title","text":"海选排名","fontSize":26,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}}]},{"type":"Label","props":{"y":197,"x":25,"width":700,"height":906,"bgColor":"#616985"}},{"type":"List","props":{"y":218,"x":62,"width":626,"var":"rankList","spaceY":5,"name":"rankList","height":754},"child":[{"type":"Box","props":{"y":0,"x":0,"width":626,"renderType":"render","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"width":626,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,3,0,82","name":"bgImg","height":94}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_hero/img-lanpingzhilkuang.png","height":70}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","name":"rankIcon","height":70}},{"type":"Text","props":{"y":49,"x":185,"width":131,"valign":"middle","text":"content","name":"rankContent","height":30,"fontSize":18,"font":"Microsoft YaHei","color":"#fafa85","bold":false,"align":"left"}},{"type":"Text","props":{"y":15,"x":185,"width":153,"valign":"middle","text":"name","name":"rankName","height":32,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":true,"align":"left"}},{"type":"Text","props":{"y":0,"x":0,"width":77,"valign":"middle","text":"1","name":"rankNum","height":94,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Image","props":{"y":23,"x":175,"skin":"ui_camp/icn-vip-jiemian-tongyong.png","name":"vip"}},{"type":"Label","props":{"y":23,"x":380,"text":"阵营：","name":"camp_name","fontSize":18,"font":"SimHei","color":"#fafa85"}}]}]},{"type":"Box","props":{"y":979,"x":62,"width":626,"var":"myInfo","renderType":"render","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"width":626,"skin":"ui_rank/img-ziji-paiming.png","sizeGrid":"0,11,0,82","height":94}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_hero/img-lanpingzhilkuang.png","height":70}},{"type":"Image","props":{"y":12,"x":100,"width":70,"var":"myRankIcon","skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","height":70}},{"type":"Text","props":{"y":49,"x":185,"width":131,"var":"myRankContent","valign":"middle","text":"content","height":30,"fontSize":18,"font":"Microsoft YaHei","color":"#fafa85","bold":false,"align":"left"}},{"type":"Text","props":{"y":15,"x":185,"width":153,"var":"myRankName","valign":"middle","text":"name","height":32,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":true,"align":"left"}},{"type":"Text","props":{"y":7,"x":10,"width":67,"var":"myRankNum","valign":"middle","text":"4","height":66,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Text","props":{"y":12,"x":10,"wordWrap":true,"width":67,"var":"notNum","valign":"middle","text":"暂未上榜","height":66,"fontSize":24,"font":"SimHei","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"y":33,"x":380,"var":"myCampName","text":"阵营：","fontSize":18,"font":"SimHei","color":"#fafa85"}}]},{"type":"Image","props":{"y":148,"var":"close","skin":"ui_common/btn-X-tongyong.png","right":30}},{"type":"Image","props":{"y":1004,"x":247,"visible":false,"var":"myVip","skin":"ui_camp/icn-vip-jiemian-tongyong.png"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.match.MatchRankViewUI.uiView);

        }

    }
}

module ui.action.match {
    export class MatchWarViewUI extends View {
		public BackGround:Laya.Image;
		public Btn_save:Laya.Button;
		public bgbox:Laya.Box;
		public match_listwar:Laya.List;
		public dragpos8:Laya.Image;
		public Pos_8:Laya.Image;
		public mod8:View;
		public dragpos7:Laya.Image;
		public Pos_7:Laya.Image;
		public mod7:View;
		public dragpos6:Laya.Image;
		public Pos_6:Laya.Image;
		public mod6:View;
		public dragpos5:Laya.Image;
		public Pos_5:Laya.Image;
		public mod5:View;
		public dragpos4:Laya.Image;
		public Pos_4:Laya.Image;
		public mod4:View;
		public dragpos3:Laya.Image;
		public Pos_3:Laya.Image;
		public mod3:View;
		public dragpos2:Laya.Image;
		public Pos_2:Laya.Image;
		public mod2:View;
		public dragpos1:Laya.Image;
		public Pos_1:Laya.Image;
		public mod1:View;
		public dragpos0:Laya.Image;
		public Pos_0:Laya.Image;
		public mod0:View;
		public dragHeroIcon:Laya.Image;
		public dragHeroMod:View;
		public L:Laya.Label;
		public main_skillName:Laya.Label;
		public Skill_Icon:Laya.Image;
		public tixing:Laya.Label;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#303b3b","alpha":1}},{"type":"Image","props":{"y":20,"x":20,"width":750,"height":1200,"centerX":0,"bottom":0},"child":[{"type":"Image","props":{"y":-300,"x":0,"width":750,"var":"BackGround","sizeGrid":"15,15,15,15","renderType":"render","height":1200},"child":[{"type":"Sprite","props":{"y":390,"x":-9,"width":781,"renderType":"mask","height":531},"child":[{"type":"Rect","props":{"y":19,"x":-197,"width":1176,"lineWidth":1,"height":489,"fillColor":"#ff0000"}}]}]},{"type":"Image","props":{"y":50,"x":0,"width":750,"visible":true,"height":58},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"visible":true,"height":58,"bgColor":"#2c2129","alpha":0.7}},{"type":"Image","props":{"y":6,"x":41,"width":88,"visible":false,"skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":44},"child":[{"type":"Label","props":{"y":8,"x":14,"width":2,"valign":"middle","height":28,"fontSize":18,"font":"SimHei","bgColor":"#aa9fc5","align":"center"}},{"type":"Label","props":{"y":3,"x":1,"width":88,"text":"布阵","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","align":"center"}}]},{"type":"Button","props":{"y":0,"x":591,"width":159,"var":"Btn_save","top":0,"stateNum":1,"skin":"ui_hero/btn-buzhen-baocun.png","right":0,"labelStrokeColor":"be5f13","labelStroke":4,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff","label":"保存","height":58}}]},{"type":"Box","props":{"y":108,"x":0,"width":750,"var":"bgbox","height":1088},"child":[{"type":"List","props":{"y":518,"x":0,"width":750,"var":"match_listwar","spaceY":14,"spaceX":22,"repeatX":4,"height":503},"child":[{"type":"Box","props":{"y":97,"x":120,"width":150,"renderType":"render","height":185,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":148,"skin":"ui_hero/img-buzhen-renwu-bg.png","renderType":"render","name":"background","height":188}},{"type":"Button","props":{"y":2,"x":1,"width":147,"stateNum":1,"name":"Btn_skill","height":185},"child":[{"type":"Image","props":{"y":1,"x":1,"width":143,"name":"background_k","height":182}},{"type":"Image","props":{"y":1,"x":2,"width":140,"name":"HeadIcon","height":140}},{"type":"Label","props":{"y":142,"x":7,"width":49,"text":"伤害","name":"Hp_name","height":20,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":162,"x":7,"width":49,"text":"生命","renderType":"render","name":"Hp_name","height":24,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":160,"x":40,"width":105,"renderType":"render","name":"Hp","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":142,"x":40,"width":105,"renderType":"render","name":"Hurt","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Image","props":{"y":-1,"x":-10,"width":41,"skin":"ui_hero/img-yingxiong-zhiwei-bg.png","renderType":"render","name":"IsGoWar","height":50}},{"type":"Image","props":{"y":-1,"x":-10,"skin":"ui_hero/img-yingxiong-zhiwei-dui.png","name":"hero_zhiwei"}},{"type":"Image","props":{"y":10,"x":110,"width":25,"skin":"ui_hero/icon-renwu-leixing-bg.png","renderType":"render","name":"Hero_Type_bg","height":29}},{"type":"Image","props":{"y":12,"x":117,"width":11,"skin":"ui_hero/icon-renwu-leixing-gongji.png","renderType":"render","name":"Hero_Type","height":22}},{"type":"Button","props":{"y":138,"x":1,"width":147,"name":"Btn_Info","height":45}}]}]}]},{"type":"Image","props":{"y":324,"x":79,"width":100,"var":"dragpos8","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_8","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_9","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_9.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod8","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":178,"width":100,"var":"dragpos7","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_7","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_8","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_8.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod7","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":79,"width":100,"var":"dragpos6","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_6","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_7","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_7.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod6","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":277,"width":100,"var":"dragpos5","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_5","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_6","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_6.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod5","name":"mod"}}]},{"type":"Image","props":{"y":243,"x":374,"width":100,"var":"dragpos4","height":150},"child":[{"type":"Image","props":{"y":-28,"x":6,"skin":"ui_hero/img-yingxiong-duizhang-biaozhi.png"}},{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_4","skin":"ui_hero/img-yingxiong-duizhang-bg.png","name":"Pos_5","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_5.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod4","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":277,"width":100,"var":"dragpos3","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_3","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_4","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_4.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod3","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":475,"width":100,"var":"dragpos2","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_2","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_3","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_3.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod2","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":574,"width":100,"var":"dragpos1","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_1","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_2","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_2.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod1","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":475,"width":100,"var":"dragpos0","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_0","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_1","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_1.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod0","name":"mod"}}]},{"type":"Image","props":{"y":144,"x":78,"width":140,"var":"dragHeroIcon","height":140,"anchorY":1,"anchorX":0.5},"child":[{"type":"View","props":{"var":"dragHeroMod","centerX":0,"bottom":0}}]},{"type":"Image","props":{"y":16,"width":92,"skin":"ui_hero/img-duizhangjineng-bg-yingxiong.png","height":110,"centerX":-10},"child":[{"type":"Label","props":{"y":85,"x":8,"width":2,"var":"L","height":20,"bgColor":"#ccd6c6"}},{"type":"Label","props":{"y":86,"x":13,"var":"main_skillName","text":"队长技能","strokeColor":"#7c6d92","stroke":3,"height":20,"fontSize":18,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":5,"x":8,"width":76,"var":"Skill_Icon","height":76}}]},{"type":"Label","props":{"y":16,"x":236,"width":459,"var":"tixing","text":"奥法弄","strokeColor":"#7c6d92","stroke":3,"height":64,"fontSize":18,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":0,"x":617,"width":133,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":48},"child":[{"type":"Image","props":{"y":0,"x":-616,"width":654,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":48}}]},{"type":"Button","props":{"y":2,"x":667,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":22}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.match.MatchWarViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class BuyMemoryPowerViewUI extends View {
		public residueTimes:laya.html.dom.HTMLDivElement;
		public Btn_close:Laya.Button;
		public tx_power:Laya.Label;
		public tx_time:Laya.Label;
		public say:Laya.Label;
		public Btn_sure:Laya.Button;
		public tx_price:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":20,"x":20,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":587,"top":267,"height":360,"centerX":0,"bgColor":"#c2c1ca","alpha":1},"child":[{"type":"Image","props":{"y":71,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":150,"text":"购买","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"HTMLDivElement","props":{"y":10,"x":105,"width":411,"var":"residueTimes","innerHTML":"(今日剩余可用1次)","height":36}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":21,"x":546,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":129,"x":250,"width":40,"skin":"ui_icon/icon_prop_014_tili.png","height":40,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":272,"width":88,"var":"tx_power","text":"100/118","height":26,"fontSize":22,"font":"SimHei","color":"#225a88","centerY":-50,"bold":true,"align":"left"}},{"type":"Label","props":{"x":363,"width":91,"var":"tx_time","text":"(06:48)","height":26,"fontSize":22,"font":"SimHei","color":"#225a88","centerY":-50,"bold":true,"align":"left"}},{"type":"Label","props":{"x":129,"width":150,"text":"当前体力：","height":26,"fontSize":22,"font":"SimHei","color":"#225a88","centerY":-50,"bold":true,"align":"left"}},{"type":"Label","props":{"x":144,"width":283,"var":"say","text":"是否消耗50钻石购买30体力","height":26,"fontSize":22,"font":"SimHei","color":"#225a88","centerY":0,"bold":true,"align":"left"}},{"type":"Button","props":{"y":314,"x":293,"width":180,"var":"Btn_sure","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff,#fefeff,#fefeff,#fefeff","labelAlign":"center","label":"确定","height":51,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"width":180,"valign":"middle","height":51,"bgColor":"#4f7c23"}}]},{"type":"Label","props":{"y":252,"x":8,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Text","props":{"y":265,"x":292,"var":"tx_price","text":"200","fontSize":18,"font":"SimHei","color":"#000000","align":"left"},"child":[{"type":"Image","props":{"y":-2,"x":-32,"width":28,"skin":"ui_icon/icon_prop_013.png","height":22}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);
			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.BuyMemoryPowerViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class BuyMemoryTimesViewUI extends View {
		public residueTimes:laya.html.dom.HTMLDivElement;
		public Btn_close:Laya.Button;
		public say:Laya.Label;
		public BuyTimes:Laya.Label;
		public Btn_sure:Laya.Button;
		public Btn_canle:Laya.Button;
		public price:laya.html.dom.HTMLDivElement;
		public Btn_reduce:Laya.Button;
		public Btn_add:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":586,"top":267,"height":360,"centerX":0,"bgColor":"#c2c1ca","alpha":1},"child":[{"type":"Image","props":{"y":71,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"y":12,"x":35,"width":99,"text":"购买","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"HTMLDivElement","props":{"y":14,"x":95,"width":407,"var":"residueTimes","innerHTML":"(今日剩余可用1次)","height":34}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":21,"x":546,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Label","props":{"y":83,"x":57,"width":485,"var":"say","height":35,"fontSize":22,"font":"SimHei","color":"#225a88","centerX":9,"align":"left"}},{"type":"Label","props":{"y":161,"x":240,"width":80,"height":42,"fontSize":22,"font":"SimHei","color":"#ffffd","bgColor":"#3c3b54","alpha":1,"align":"right"},"child":[{"type":"Label","props":{"y":0,"x":24,"width":55,"var":"BuyTimes","text":"1","padding":"10,2,2,5,","height":41,"fontSize":22,"font":"SimHei","color":"#fffffd","align":"right"}},{"type":"Label","props":{"y":6,"x":77,"width":55,"text":"次","height":27,"fontSize":30,"font":"SimHei","color":"#49495b","align":"center"}}]},{"type":"Button","props":{"y":316,"x":414,"width":180,"var":"Btn_sure","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff,#fefeff,#fefeff,#fefeff","labelAlign":"center","label":"确定","height":51,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Button","props":{"y":316,"x":176,"width":180,"var":"Btn_canle","stateNum":1,"labelStrokeColor":"#6a3e14","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff,#fefeff,#fefeff,#fefeff","label":"取消","height":51,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#8a712e"}}]},{"type":"HTMLDivElement","props":{"y":265,"x":392,"width":100,"var":"price","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":252,"x":8,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Image","props":{"y":-267,"x":-85},"child":[{"type":"Button","props":{"y":448,"x":251,"var":"Btn_reduce","stateNum":1,"skin":"ui_ladder/btn-jian-goumai.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":448,"x":506,"var":"Btn_add","stateNum":1,"skin":"ui_ladder/btn-jia-goumai.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"anchorY":0.5,"anchorX":0.5}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.memory.BuyMemoryTimesViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryChallengeViewUI extends View {
		public tx_title:Laya.Label;
		public btn_close:Laya.Button;
		public btn_add:Laya.Button;
		public tx_surplus_num:laya.display.Text;
		public tx_hero_name:laya.display.Text;
		public box_avatar_bg:Laya.Box;
		public btn_front:Laya.Button;
		public btn_pet:Laya.Button;
		public img_challenge:Laya.Image;
		public tx_info_1:laya.display.Text;
		public tx_win:laya.display.Text;
		public target_1:Laya.Image;
		public target_2:Laya.Image;
		public target_3:Laya.Image;
		public img_reward:Laya.Image;
		public btn_challenge:Laya.Button;
		public tx_power:laya.display.Text;
		public btn_raided:Laya.Button;
		public tx_raided:laya.display.Text;
		public img_raided:Laya.Image;
		public tx_power_raided:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":700,"height":974,"centerY":-28,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":700,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":974},"child":[{"type":"Label","props":{"y":0,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":21,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":47,"width":268,"var":"tx_title","text":"挑战记忆","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"bold":false,"align":"left"}},{"type":"Button","props":{"x":532,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12,"centerY":0}},{"type":"Image","props":{"y":837,"x":19,"width":662,"skin":"ui_camp/img-baibian-zhenying.png","sizeGrid":"5,2,1,1","height":120,"centerX":0}}]},{"type":"Label","props":{"y":66,"x":19,"width":298,"height":27,"bgColor":"#3b2234"},"child":[{"type":"Label","props":{"x":5,"width":6,"height":25,"centerY":0,"bgColor":"#c68a1f"}},{"type":"Button","props":{"y":15,"x":275,"var":"btn_add","stateNum":1,"skin":"ui_icon/btn-jiacishu-tianti.png","anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":4,"x":25,"text":"剩余挑战次数:","fontSize":20,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":164,"width":61,"var":"tx_surplus_num","text":"1/3","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}}]},{"type":"Image","props":{"y":112,"x":44,"skin":"ui_memory/btn-pipei-bg-tianti.png","sizeGrid":"0,20,20,0","name":"img_bg"},"child":[{"type":"Label","props":{"y":32,"x":32,"width":135,"height":30,"bgColor":"#313342"},"child":[{"type":"Text","props":{"y":5,"x":9,"var":"tx_hero_name","text":"hero 1-1","fontSize":20,"font":"SimHei","color":"#b3b8ce"}}]},{"type":"Box","props":{"y":0,"x":0,"width":610,"var":"box_avatar_bg","height":368}},{"type":"Button","props":{"y":50,"x":532,"width":90,"var":"btn_front","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"英雄阵型","height":38,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":108,"x":532,"width":90,"var":"btn_pet","stateNum":1,"skin":"ui_kicking/btn-kafangjian-pvp.png","sizeGrid":"6,6,6,6","labelSize":20,"labelFont":"SimHei","labelColors":"#c8d2f7","labelAlign":"center","label":"上阵神兽","height":38,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Image","props":{"y":491,"x":19,"var":"img_challenge","skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"挑战目标","fontSize":22,"font":"SimHei","color":"#9ba1de","bold":true,"align":"left"}},{"type":"Text","props":{"y":4,"x":397,"var":"tx_info_1","text":"评星奖励首次达成才能领取","fontSize":20,"font":"SimHei","color":"#c9d3f7","align":"left"}},{"type":"Text","props":{"y":38,"x":20,"var":"tx_win","text":"胜利条件：击败地方单位","fontSize":20,"font":"SimHei","color":"#c9d3f7","align":"left"}},{"type":"Image","props":{"y":70,"x":20,"width":610,"var":"target_1","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":104,"x":20,"width":610,"var":"target_2","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":138,"x":20,"width":610,"var":"target_3","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]}]},{"type":"Image","props":{"y":680,"x":19,"var":"img_reward","skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"可能获得奖励","fontSize":22,"font":"SimHei","color":"#9ba1de","bold":true,"align":"left"}}]},{"type":"Button","props":{"y":868,"var":"btn_challenge","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelPadding":"0,0,10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"挑战","centerX":-129},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,10,10,2","height":22},"child":[{"type":"Text","props":{"y":0,"x":42,"var":"tx_power","text":"消耗体力9","fontSize":22,"font":"SimHei","color":"#d6ab80","bold":true,"align":"left"}},{"type":"Image","props":{"y":-2,"x":17,"width":26,"skin":"ui_icon/icon_prop_014_tili.png","height":26}}]}]},{"type":"Button","props":{"y":903,"x":521,"var":"btn_raided","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelPadding":"0,0,10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"扫荡","centerX":171,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,10,10,2","height":22},"child":[{"type":"Text","props":{"y":0,"x":29,"var":"tx_raided","text":"三星可扫荡","fontSize":22,"font":"SimHei","color":"#d6ab80","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":44,"x":1,"width":160,"var":"img_raided","skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,10,10,2","height":22},"child":[{"type":"Image","props":{"y":-2,"x":17,"width":26,"skin":"ui_icon/icon_prop_014_tili.png","height":26}},{"type":"Text","props":{"y":0,"x":42,"var":"tx_power_raided","text":"消耗体力9","fontSize":22,"font":"SimHei","color":"#d6ab80","bold":true,"align":"left"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.MemoryChallengeViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryLineViewUI extends View {
		public ver:Laya.Image;
		public ver_light:Laya.Image;
		public hor:Laya.Image;
		public hor_light:Laya.Image;
		public corner_lt:Laya.Image;
		public lt_light:Laya.Image;
		public corner_lb:Laya.Image;
		public lb_light:Laya.Image;
		public corner_rt:Laya.Image;
		public rt_light:Laya.Image;
		public corner_rb:Laya.Image;
		public rb_light:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":75,"height":120},"child":[{"type":"Image","props":{"y":6,"x":49,"var":"ver","skin":"ui_memory/img-xian-2-an-huiyi.png","sizeGrid":"2,1,2,1"},"child":[{"type":"Image","props":{"y":0,"x":-8,"var":"ver_light","skin":"ui_memory/img-xian-2-liang-huiyi.png"}}]},{"type":"Image","props":{"y":9,"x":12,"width":9,"var":"hor","skin":"ui_memory/img-xian-1-an-huiyi.png","sizeGrid":"1,1,1,1","height":4},"child":[{"type":"Image","props":{"y":-8,"var":"hor_light","skin":"ui_memory/img-xian-1-liang-huiyi.png"}}]},{"type":"Image","props":{"y":34,"x":8,"var":"corner_lt","skin":"ui_memory/img-jiao-1-an-huiyi.png","pivotY":0,"pivotX":0},"child":[{"type":"Image","props":{"y":-8,"x":-8,"var":"lt_light","skin":"ui_memory/img-jiao-1-liang-huiyi.png"}}]},{"type":"Image","props":{"y":76,"x":8,"var":"corner_lb","skin":"ui_memory/img-jiao-2-an-huiyi.png","pivotY":16,"pivotX":0},"child":[{"type":"Image","props":{"x":-8,"var":"lb_light","skin":"ui_memory/img-jiao-2-liang-huiyi.png"}}]},{"type":"Image","props":{"y":33,"x":59,"var":"corner_rt","skin":"ui_memory/img-jiao-3-an-huiyi.png","pivotY":0,"pivotX":16},"child":[{"type":"Image","props":{"y":-8,"var":"rt_light","skin":"ui_memory/img-jiao-3-liang-huiyi.png"}}]},{"type":"Image","props":{"y":77,"x":58,"var":"corner_rb","skin":"ui_memory/img-jiao-4-an-huiyi.png","pivotY":16,"pivotX":16},"child":[{"type":"Image","props":{"var":"rb_light","skin":"ui_memory/img-jiao-4-liang-huiyi.png"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.memory.MemoryLineViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryModelViewUI extends View {
		public page_icon:Laya.Image;
		public icon_red_move:Laya.Image;
		public icon_red:Laya.Image;
		public icon_light:Laya.Image;
		public page_head:Laya.Image;
		public head_light_move:Laya.Image;
		public head_light:Laya.Image;
		public head_bg:Laya.Image;
		public head_lock:Laya.Image;
		public label_bg:Laya.Label;
		public tx_name:laya.display.Text;
		public img_star:Laya.Image;
		public star_red_1:Laya.Image;
		public star_red_2:Laya.Image;
		public star_red_3:Laya.Image;
		public star_gray_1:Laya.Image;
		public star_gray_2:Laya.Image;
		public star_gray_3:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":170,"height":170},"child":[{"type":"Image","props":{"y":0,"x":0,"width":170,"height":170},"child":[{"type":"Image","props":{"y":23,"x":23,"width":125,"var":"page_icon","height":125},"child":[{"type":"Image","props":{"y":62,"x":62,"var":"icon_red_move","skin":"ui_memory/ui-dao-zhiyuanfuben.png","anchorY":0.5,"anchorX":0.5,"alpha":0.8}},{"type":"Image","props":{"var":"icon_red","skin":"ui_memory/ui-dao-zhiyuanfuben.png"}},{"type":"Image","props":{"var":"icon_light","skin":"ui_memory/ui-daoguo-zhiyuanfuben.png"}}]},{"type":"Image","props":{"y":0,"x":0,"width":170,"var":"page_head","height":170},"child":[{"type":"Image","props":{"y":85,"x":85,"visible":false,"var":"head_light_move","skin":"ui_memory/ui-da-bg-ziyuanfuben.png","anchorY":0.5,"anchorX":0.5,"alpha":0.8}},{"type":"Image","props":{"y":0,"x":0,"var":"head_light","skin":"ui_memory/ui-da-bg-ziyuanfuben.png"}},{"type":"Image","props":{"y":17,"x":17,"var":"head_bg","skin":"ui_icon/icon_tou_wzm.png"}},{"type":"Image","props":{"y":62,"x":62,"var":"head_lock","skin":"ui_main/img-suo.png"}}]},{"type":"Image","props":{"y":136,"width":176,"height":35,"centerX":0},"child":[{"type":"Label","props":{"y":18,"width":176,"var":"label_bg","height":35,"centerX":0,"bgColor":"#000000","anchorY":0.5,"anchorX":0.5,"alpha":0.4}},{"type":"Text","props":{"y":6,"x":-54,"width":176,"var":"tx_name","text":"1-3","height":22,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":0,"x":0,"width":176,"var":"img_star","height":35},"child":[{"type":"Label","props":{"y":6,"x":62,"width":3,"height":24,"bgColor":"#c05351"}},{"type":"Label","props":{"y":6,"x":171,"width":3,"height":24,"bgColor":"#c05351"}},{"type":"Image","props":{"y":4,"x":72,"var":"star_red_1","skin":"ui_icon/icon-hong-jinjie-yingxiong.png"}},{"type":"Image","props":{"y":4,"x":105,"var":"star_red_2","skin":"ui_icon/icon-hong-jinjie-yingxiong.png"}},{"type":"Image","props":{"y":4,"x":138,"var":"star_red_3","skin":"ui_icon/icon-hong-jinjie-yingxiong.png"}},{"type":"Image","props":{"y":4,"x":72,"var":"star_gray_1","skin":"ui_icon/icon-weodacheng-ziyuanfuben.png"}},{"type":"Image","props":{"y":4,"x":105,"var":"star_gray_2","skin":"ui_icon/icon-weodacheng-ziyuanfuben.png"}},{"type":"Image","props":{"y":4,"x":138,"var":"star_gray_3","skin":"ui_icon/icon-weodacheng-ziyuanfuben.png"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.MemoryModelViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryPetViewUI extends View {
		public btn_close:Laya.Button;
		public petHit:Laya.Label;
		public info:Laya.Image;
		public Pet_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":10,"x":10,"width":750,"height":1200,"centerX":0,"bottom":0},"child":[{"type":"Image","props":{"y":0,"x":375,"width":750,"top":0,"mouseThrough":true,"centerX":0,"bottom":0,"anchorX":0.5},"child":[{"type":"Box","props":{"y":0,"width":750,"height":1200,"centerX":0,"alpha":1},"child":[{"type":"Label","props":{"y":38,"x":0,"width":750,"height":1080,"bgColor":"#313737","alpha":1}},{"type":"Image","props":{"y":0,"x":584,"width":166,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":42},"child":[{"type":"Image","props":{"y":0,"x":-583,"width":621,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":42}}]},{"type":"Button","props":{"y":2,"x":643,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png"}}]}]},{"type":"Label","props":{"y":48,"x":23,"width":125,"var":"petHit","text":"72.83K  神兽伤害","height":22,"fontSize":22,"font":"SimHei","color":"#dde2f2"},"child":[{"type":"Image","props":{"y":-8,"x":0,"var":"info","skin":"ui_action/btn-xiangqing-huodong.png"}}]},{"type":"List","props":{"y":80,"x":0,"width":750,"var":"Pet_list","spaceY":10,"spaceX":8,"repeatX":2,"height":1024,"alpha":1},"child":[{"type":"Box","props":{"y":6,"x":8,"width":363,"renderType":"render","height":96},"child":[{"type":"Image","props":{"y":7,"x":6,"width":360,"skin":"ui_pet/img-liebiao-shenshou.png","sizeGrid":"10,215,10,35","height":86,"alpha":1}},{"type":"Image","props":{"y":7,"x":6,"width":86,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"pet_icon_bg","height":78}},{"type":"Label","props":{"y":12,"x":106,"width":33,"text":"LV:","height":23,"fontSize":18,"font":"SimHei","color":"#86e779","align":"left"}},{"type":"Label","props":{"y":12,"x":133,"width":33,"text":"405","name":"Pet_lv","height":23,"fontSize":18,"font":"SimHei","color":"#ffff79","align":"left"}},{"type":"Label","props":{"y":9,"x":172,"width":96,"text":"陆咬胶鲨","name":"Pet_name","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":43,"x":106,"width":106,"text":"宠物伤害","name":"pet_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":65,"x":106,"width":106,"text":"宠物伤害","name":"hero_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Image","props":{"y":3,"x":2,"width":360,"skin":"ui_pet/img-liebiao-xuanzhong-shenshou.png","sizeGrid":"4,25,15,8","name":"choice","height":86,"alpha":1},"child":[{"type":"Image","props":{"y":17,"x":279,"skin":"ui_pet/img-liebiao-xuanzhongbiaozhi-shenshou.png","name":"pet_main"}}]},{"type":"Button","props":{"y":7,"x":4,"width":354,"name":"click","height":79}},{"type":"Image","props":{"y":6,"x":5,"width":86,"skin":"ui_icon/icon_tou_atm.png","name":"Pet_icon","height":80},"child":[{"type":"Image","props":{"y":44,"x":53,"skin":"ui_shop/img-tanhao.png","name":"Pet_info"}}]},{"type":"Image","props":{"y":0,"x":-1,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"point","height":30},"child":[{"type":"Label","props":{"y":-1,"x":1,"width":14,"text":"new","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.memory.MemoryPetViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryResultViewUI extends View {
		public panel_win:Laya.Image;
		public btn_close:Laya.Button;
		public tx_win_condition:laya.display.Text;
		public target_1:Laya.Image;
		public target_2:Laya.Image;
		public target_3:Laya.Image;
		public img_reward:Laya.Image;
		public tx_time:laya.display.Text;
		public img_star_1:Laya.Image;
		public img_star_2:Laya.Image;
		public img_star_3:Laya.Image;
		public btn_win_back:Laya.Button;
		public btn_win_agin:Laya.Button;
		public tx_challenge_num:laya.display.Text;
		public panel_lose:Laya.Image;
		public tx_lose_condition:laya.display.Text;
		public btn_lose_back:Laya.Button;
		public btn_lose_agin:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.6}},{"type":"Image","props":{"width":700,"var":"panel_win","height":746,"centerY":-40,"centerX":0},"child":[{"type":"Image","props":{"y":38,"x":0,"width":700,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":700},"child":[{"type":"Label","props":{"y":0,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Button","props":{"x":532,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12,"centerY":0}},{"type":"Image","props":{"y":568,"width":662,"skin":"ui_camp/img-baibian-zhenying.png","sizeGrid":"5,2,1,1","height":120,"centerX":0}},{"type":"Image","props":{"y":-38,"x":8,"skin":"ui_memory/ui-zhandoushengli.png"}}]}]},{"type":"Image","props":{"y":107,"x":19,"skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"挑战目标","fontSize":22,"font":"SimHei","color":"#ced0e5","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":397,"text":"评星奖励首次达成才能领取","fontSize":20,"font":"SimHei","color":"#c9d3f7","align":"left"}},{"type":"Text","props":{"y":38,"x":20,"var":"tx_win_condition","text":"胜利条件：击败地方单位","fontSize":20,"font":"SimHei","color":"#c9d3f7","align":"left"}},{"type":"Image","props":{"y":70,"x":20,"width":610,"var":"target_1","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"未完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":106,"x":20,"width":610,"var":"target_2","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"未完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":142,"x":20,"width":610,"var":"target_3","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":604,"lineWidth":2,"lineColor":"#45487f"}},{"type":"Text","props":{"y":3,"x":48,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Image","props":{"y":-2,"x":12,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":540,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":575,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#fbfbfb","bold":false,"align":"left"}},{"type":"Text","props":{"y":4,"x":542,"width":58,"text":"未完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}}]}]},{"type":"Image","props":{"y":296,"x":19,"var":"img_reward","skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"text":"获得奖励","fontSize":22,"font":"SimHei","color":"#ced0e5","bold":false,"align":"left"}}]},{"type":"Image","props":{"y":474,"x":21,"width":635,"height":100},"child":[{"type":"Label","props":{"y":0,"x":0,"width":635,"height":38,"bgColor":"#5c3145"},"child":[{"type":"Text","props":{"y":6,"x":21,"text":"挑战用时","fontSize":26,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Text","props":{"y":7,"x":545,"var":"tx_time","text":"00:00","fontSize":26,"font":"SimHei","color":"#ffffff","align":"right"}}]},{"type":"Label","props":{"y":61,"x":0,"width":635,"height":38,"bgColor":"#5c3145"},"child":[{"type":"Text","props":{"y":6,"x":21,"text":"星级评价","fontSize":26,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":18,"x":520,"var":"img_star_1","skin":"ui_icon/icon-hong-jinjie-yingxiong.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":18,"x":558,"var":"img_star_2","skin":"ui_icon/icon-hong-jinjie-yingxiong.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":18,"x":596,"var":"img_star_3","skin":"ui_icon/icon-hong-jinjie-yingxiong.png","anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Button","props":{"y":632,"var":"btn_win_back","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"返回","centerX":-129}},{"type":"Button","props":{"y":667,"var":"btn_win_agin","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelPadding":"0,0,12","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"再次挑战","centerX":163,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,10,10,2","height":22},"child":[{"type":"Text","props":{"y":0,"x":6,"text":"剩余次数:","fontSize":22,"font":"SimHei","color":"#d6ab80","bold":true,"align":"left"}},{"type":"Text","props":{"y":0,"x":108,"width":49,"var":"tx_challenge_num","text":"1/3","height":22,"fontSize":22,"font":"SimHei","color":"#d6ab80","bold":true,"align":"center"}}]}]}]},{"type":"Image","props":{"width":424,"var":"panel_lose","height":255,"centerY":-118,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":54,"skin":"ui_memory/img-tianzhaoshibai.png"}},{"type":"Text","props":{"y":96,"x":58,"var":"tx_lose_condition","text":"(胜利条件：抵挡地方10秒钟攻击)","fontSize":20,"font":"SimHei","color":"#fda2ab","align":"left"}},{"type":"Button","props":{"y":218,"x":81,"var":"btn_lose_back","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"返回","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":218,"x":341,"var":"btn_lose_agin","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"再次挑战","anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.MemoryResultViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryTargetViewUI extends View {
		public tx_title:Laya.Label;
		public btn_close:Laya.Button;
		public img_challenge:Laya.Image;
		public tx_hero_name:laya.display.Text;
		public tx_win:laya.display.Text;
		public target_1:Laya.Image;
		public target_2:Laya.Image;
		public target_3:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":588,"height":320,"centerY":-170,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":320,"centerY":0,"bgColor":"#c2c1ca","alpha":1},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50}},{"type":"Label","props":{"y":12,"x":21,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Label","props":{"y":12,"x":49,"width":268,"var":"tx_title","text":"挑战目标","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"left"}},{"type":"Button","props":{"y":4,"x":532,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12}},{"type":"Image","props":{"y":236,"x":508,"skin":"ui_common/img-huawen2.png","alpha":0.3}},{"type":"Image","props":{"y":134,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.3}}]},{"type":"Image","props":{"y":86,"x":20,"var":"img_challenge","skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":23,"var":"tx_hero_name","text":"Hero 1-1","fontSize":22,"font":"SimHei","color":"#d4d6ee","bold":true,"align":"left"}},{"type":"Text","props":{"y":38,"x":20,"var":"tx_win","text":"胜利条件：击败地方单位","fontSize":20,"font":"SimHei","color":"#1c5485","bold":true,"align":"left"}},{"type":"Image","props":{"y":73,"x":26,"width":500,"var":"target_1","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":492,"lineWidth":2,"lineColor":"#3d435d"}},{"type":"Text","props":{"y":3,"x":41,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Image","props":{"y":-2,"x":5,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":436,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":471,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Text","props":{"y":4,"x":438,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":110,"x":26,"width":500,"var":"target_2","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":492,"lineWidth":2,"lineColor":"#3d435d"}},{"type":"Text","props":{"y":3,"x":41,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Image","props":{"y":-2,"x":5,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":436,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":471,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Text","props":{"y":4,"x":438,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":147,"x":26,"width":500,"var":"target_3","height":30},"child":[{"type":"Line","props":{"y":26,"x":0,"toY":0,"toX":492,"lineWidth":2,"lineColor":"#3d435d"}},{"type":"Text","props":{"y":3,"x":41,"text":"成功通过本关","name":"tx_through","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Image","props":{"y":-2,"x":5,"skin":"ui_icon/icon-hong-jinjie-yingxiong.png","name":"img_star"}},{"type":"Image","props":{"y":3,"x":436,"width":25,"skin":"ui_icon/icon_prop_013.png","name":"img_diamonds","height":19}},{"type":"Text","props":{"y":5,"x":471,"text":"+5","name":"tx_diamonds","fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}},{"type":"Text","props":{"y":4,"x":438,"width":58,"text":"已完成","name":"tx_cannot_complete","height":19,"fontSize":18,"font":"SimHei","color":"#575564","bold":true,"align":"left"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.MemoryTargetViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryViewUI extends View {
		public view_bg:Laya.Image;
		public panel_bg:Laya.Panel;
		public img_line:Laya.Image;
		public img_icon:Laya.Image;
		public img_arrow:Laya.Image;
		public img_arrow_up:Laya.Image;
		public img_arrow_down:Laya.Image;
		public tx_power:laya.display.Text;
		public tx_diamonds:laya.display.Text;
		public btn_close:Laya.Button;
		public btn_add:Laya.Button;
		public btn_hero:Laya.Image;
		public btn_lock:Laya.Image;
		public btn_open:Laya.Label;
		public btn_pet:Laya.Image;
		public btn_equip:Laya.Image;
		public btn_tujian:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"y":10,"x":20,"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"x":0,"width":750,"var":"view_bg","skin":"ui_noPack/ui-daguo-bgziyuanfuben.png","sizeGrid":"10,10,10,10","height":1126,"bottom":0}},{"type":"Panel","props":{"y":134,"x":0,"width":750,"var":"panel_bg","height":1066},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"var":"img_line","height":1066}},{"type":"Image","props":{"y":0,"x":0,"width":750,"var":"img_icon","height":1066}}]},{"type":"Image","props":{"y":134,"x":344,"width":62,"var":"img_arrow","mouseEnabled":false,"height":1066,"centerX":0},"child":[{"type":"Image","props":{"y":40,"x":0,"width":61,"var":"img_arrow_up","skin":"ui_main/ui_mainbtn-xialai.png","scaleY":-1,"height":41}},{"type":"Image","props":{"y":1025,"x":0,"width":61,"var":"img_arrow_down","skin":"ui_main/ui_mainbtn-xialai.png","height":41}}]},{"type":"Label","props":{"y":0,"x":0,"width":750,"height":74,"bgColor":"#1d182d"},"child":[{"type":"Label","props":{"x":21,"width":158,"height":32,"centerY":1,"bgColor":"#fbfbfd","alpha":0.2}},{"type":"Image","props":{"y":16,"x":15,"width":46,"skin":"ui_icon/icon_prop_014_tili.png","height":46}},{"type":"Text","props":{"y":28,"x":56,"width":104,"var":"tx_power","text":"100/150","strokeColor":"#000000","stroke":1,"height":22,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":false,"align":"center"}},{"type":"Label","props":{"x":240,"width":158,"height":32,"centerY":1,"bgColor":"#fbfbfd","alpha":0.2}},{"type":"Image","props":{"y":18,"x":238,"width":50,"skin":"ui_icon/icon_prop_013.png","height":40}},{"type":"Text","props":{"y":28,"x":291,"width":103,"var":"tx_diamonds","text":"100150","strokeColor":"#000000","stroke":1,"height":22,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":false,"align":"center"}},{"type":"Image","props":{"y":24,"x":574,"width":175,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":50},"child":[{"type":"Image","props":{"y":0,"x":-572,"width":610,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":50}}]},{"type":"Button","props":{"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":55,"bottom":4,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":15,"x":161,"var":"btn_add","stateNum":1,"skin":"ui_icon/btn-jiacishu-tianti.png"}}]},{"type":"Label","props":{"y":75,"x":0,"width":750,"height":60},"child":[{"type":"Line","props":{"y":57,"x":0,"toY":0,"toX":750,"lineWidth":1,"lineColor":"#ffffff"}},{"type":"Line","props":{"y":0,"x":22,"toY":57,"toX":0,"lineWidth":1,"lineColor":"#ffffff"}},{"type":"Line","props":{"y":0,"x":164,"toY":57,"toX":0,"lineWidth":1,"lineColor":"#ffffff"}},{"type":"Label","props":{"y":0,"x":22,"width":144,"height":58,"bgColor":"#d4d4d4","alpha":0.2}}]},{"type":"Image","props":{"y":75,"x":22,"width":142,"var":"btn_hero","height":58},"child":[{"type":"Image","props":{"y":19,"x":11,"width":18,"visible":false,"var":"btn_lock","skin":"ui_main/img-suo.png","height":20}},{"type":"Label","props":{"y":15,"x":17,"width":4,"var":"btn_open","height":24,"bgColor":"#d1cfcf","alpha":0.8}},{"type":"Label","props":{"y":0,"x":0,"width":144,"name":"open","height":58,"alpha":0},"child":[{"type":"Label","props":{"y":15,"x":16,"width":6,"height":25,"centerY":-2,"bgColor":"#767776"}}]},{"type":"Text","props":{"y":14,"x":33,"text":"英雄记忆","name":"tx_name","fontSize":25,"font":"SimHei","color":"#d4d4d4"}}]},{"type":"Image","props":{"y":75,"x":164,"width":142,"visible":false,"var":"btn_pet","height":58},"child":[{"type":"Label","props":{"y":0,"x":0,"width":144,"height":58,"alpha":0}},{"type":"Image","props":{"y":19,"x":11,"width":18,"skin":"ui_main/img-suo.png","height":20}},{"type":"Label","props":{"y":0,"x":0,"width":144,"name":"open","height":58,"alpha":0},"child":[{"type":"Label","props":{"y":15,"x":16,"width":6,"height":25,"centerY":-2,"bgColor":"#767776"}}]},{"type":"Text","props":{"y":14,"x":33,"text":"神兽回想","name":"tx_name","fontSize":25,"font":"SimHei","color":"#d4d4d4"}}]},{"type":"Image","props":{"y":75,"x":306,"width":142,"visible":false,"var":"btn_equip","height":58},"child":[{"type":"Label","props":{"y":0,"x":0,"width":144,"height":58,"alpha":0}},{"type":"Image","props":{"y":19,"x":11,"width":18,"skin":"ui_main/img-suo.png","height":20}},{"type":"Label","props":{"y":0,"x":0,"width":144,"name":"open","height":58,"alpha":0},"child":[{"type":"Label","props":{"y":15,"x":16,"width":6,"height":25,"centerY":-2,"bgColor":"#767776"}}]},{"type":"Text","props":{"y":14,"x":33,"text":"神装之梦","name":"tx_name","fontSize":25,"font":"SimHei","color":"#d4d4d4"}}]},{"type":"Image","props":{"y":83,"x":588,"width":142,"var":"btn_tujian","height":44},"child":[{"type":"Label","props":{"y":0,"x":0,"width":144,"height":46,"bgColor":"#ffffff","alpha":0.4}},{"type":"Text","props":{"y":9,"x":23,"text":"查看图鉴","name":"tx_name","fontSize":25,"font":"SimHei","color":"#f8f8ad","bold":false}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.action.memory.MemoryViewUI.uiView);

        }

    }
}

module ui.action.memory {
    export class MemoryWarViewUI extends View {
		public BackGround:Laya.Image;
		public Btn_save:Laya.Button;
		public bgbox:Laya.Box;
		public memory_listwar:Laya.List;
		public dragpos8:Laya.Image;
		public Pos_8:Laya.Image;
		public mod8:View;
		public dragpos7:Laya.Image;
		public Pos_7:Laya.Image;
		public mod7:View;
		public dragpos6:Laya.Image;
		public Pos_6:Laya.Image;
		public mod6:View;
		public dragpos5:Laya.Image;
		public Pos_5:Laya.Image;
		public mod5:View;
		public dragpos4:Laya.Image;
		public Pos_4:Laya.Image;
		public mod4:View;
		public dragpos3:Laya.Image;
		public Pos_3:Laya.Image;
		public mod3:View;
		public dragpos2:Laya.Image;
		public Pos_2:Laya.Image;
		public mod2:View;
		public dragpos1:Laya.Image;
		public Pos_1:Laya.Image;
		public mod1:View;
		public dragpos0:Laya.Image;
		public Pos_0:Laya.Image;
		public mod0:View;
		public dragHeroIcon:Laya.Image;
		public dragHeroMod:View;
		public L:Laya.Label;
		public main_skillName:Laya.Label;
		public Skill_Icon:Laya.Image;
		public tixing:Laya.Label;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#303b3b","alpha":1}},{"type":"Image","props":{"y":10,"x":10,"width":750,"height":1200,"centerX":0,"bottom":0},"child":[{"type":"Image","props":{"y":-300,"x":0,"width":750,"var":"BackGround","sizeGrid":"15,15,15,15","renderType":"render","height":1200},"child":[{"type":"Sprite","props":{"y":390,"x":-9,"width":781,"renderType":"mask","height":531},"child":[{"type":"Rect","props":{"y":19,"x":-197,"width":1176,"lineWidth":1,"height":489,"fillColor":"#ff0000"}}]}]},{"type":"Image","props":{"y":50,"x":0,"width":750,"visible":true,"height":58},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"visible":true,"height":58,"bgColor":"#2c2129","alpha":0.7}},{"type":"Image","props":{"y":6,"x":41,"width":88,"visible":false,"skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":44},"child":[{"type":"Label","props":{"y":8,"x":14,"width":2,"valign":"middle","height":28,"fontSize":18,"font":"SimHei","bgColor":"#aa9fc5","align":"center"}},{"type":"Label","props":{"y":3,"x":1,"width":88,"text":"布阵","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","align":"center"}}]},{"type":"Button","props":{"y":0,"x":591,"width":159,"var":"Btn_save","top":0,"stateNum":1,"skin":"ui_hero/btn-buzhen-baocun.png","right":0,"labelStrokeColor":"be5f13","labelStroke":4,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff","label":"保存","height":58}}]},{"type":"Box","props":{"y":108,"x":0,"width":750,"var":"bgbox","height":1088},"child":[{"type":"List","props":{"y":518,"x":0,"width":750,"var":"memory_listwar","spaceY":14,"spaceX":22,"repeatX":4,"height":503},"child":[{"type":"Box","props":{"y":97,"x":120,"width":150,"renderType":"render","height":185,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":148,"skin":"ui_hero/img-buzhen-renwu-bg.png","renderType":"render","name":"background","height":188}},{"type":"Button","props":{"y":2,"x":1,"width":147,"stateNum":1,"name":"Btn_skill","height":185},"child":[{"type":"Image","props":{"y":1,"x":1,"width":143,"name":"background_k","height":182}},{"type":"Image","props":{"y":1,"x":2,"width":140,"name":"HeadIcon","height":140}},{"type":"Label","props":{"y":142,"x":7,"width":49,"text":"伤害","name":"Hp_name","height":20,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":162,"x":7,"width":49,"text":"生命","renderType":"render","name":"Hp_name","height":24,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":160,"x":40,"width":105,"renderType":"render","name":"Hp","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":142,"x":40,"width":105,"renderType":"render","name":"Hurt","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Image","props":{"y":-1,"x":-10,"width":41,"skin":"ui_hero/img-yingxiong-zhiwei-bg.png","renderType":"render","name":"IsGoWar","height":50}},{"type":"Image","props":{"y":-1,"x":-10,"skin":"ui_hero/img-yingxiong-zhiwei-dui.png","name":"hero_zhiwei"}},{"type":"Image","props":{"y":10,"x":110,"width":25,"skin":"ui_hero/icon-renwu-leixing-bg.png","renderType":"render","name":"Hero_Type_bg","height":29}},{"type":"Image","props":{"y":12,"x":117,"width":11,"skin":"ui_hero/icon-renwu-leixing-gongji.png","renderType":"render","name":"Hero_Type","height":22}},{"type":"Button","props":{"y":138,"x":1,"width":147,"name":"Btn_Info","height":45}}]}]}]},{"type":"Image","props":{"y":324,"x":79,"width":100,"var":"dragpos8","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_8","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_9","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_9.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod8","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":178,"width":100,"var":"dragpos7","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_7","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_8","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_8.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod7","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":79,"width":100,"var":"dragpos6","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_6","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_7","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_7.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod6","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":277,"width":100,"var":"dragpos5","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_5","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_6","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_6.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod5","name":"mod"}}]},{"type":"Image","props":{"y":243,"x":374,"width":100,"var":"dragpos4","height":150},"child":[{"type":"Image","props":{"y":-28,"x":6,"skin":"ui_hero/img-yingxiong-duizhang-biaozhi.png"}},{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_4","skin":"ui_hero/img-yingxiong-duizhang-bg.png","name":"Pos_5","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_5.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod4","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":277,"width":100,"var":"dragpos3","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_3","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_4","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_4.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod3","name":"mod"}}]},{"type":"Image","props":{"y":324,"x":475,"width":100,"var":"dragpos2","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_2","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_3","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_3.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod2","name":"mod"}}]},{"type":"Image","props":{"y":241,"x":574,"width":100,"var":"dragpos1","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_1","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_2","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_2.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod1","name":"mod"}}]},{"type":"Image","props":{"y":175,"x":475,"width":100,"var":"dragpos0","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_0","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_1","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_1.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod0","name":"mod"}}]},{"type":"Image","props":{"y":144,"x":78,"width":140,"var":"dragHeroIcon","height":140,"anchorY":1,"anchorX":0.5},"child":[{"type":"View","props":{"var":"dragHeroMod","centerX":0,"bottom":0}}]},{"type":"Image","props":{"y":16,"width":92,"skin":"ui_hero/img-duizhangjineng-bg-yingxiong.png","height":110,"centerX":-10},"child":[{"type":"Label","props":{"y":85,"x":8,"width":2,"var":"L","height":20,"bgColor":"#ccd6c6"}},{"type":"Label","props":{"y":86,"x":13,"var":"main_skillName","text":"队长技能","strokeColor":"#7c6d92","stroke":3,"height":20,"fontSize":18,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":5,"x":8,"width":76,"var":"Skill_Icon","height":76}}]},{"type":"Label","props":{"y":16,"x":236,"width":459,"var":"tixing","text":"奥法弄","strokeColor":"#7c6d92","stroke":3,"height":64,"fontSize":18,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":0,"x":617,"width":133,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":48},"child":[{"type":"Image","props":{"y":0,"x":-616,"width":654,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":48}}]},{"type":"Button","props":{"y":2,"x":667,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":22}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.memory.MemoryWarViewUI.uiView);

        }

    }
}

module ui.action.topic {
    export class AcitonSettViewUI extends View {
		public my_hurt:Laya.Label;
		public quit_time:Laya.Label;
		public Btn_quit:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"name":"Other","left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":159,"x":293,"text":"挑战完成","strokeColor":"#3b2213","stroke":6,"fontSize":40,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":218,"var":"my_hurt","strokeColor":"#3b2213","stroke":6,"fontSize":23,"font":"SimHei","color":"#fef8e9","centerX":0,"align":"center"}},{"type":"Label","props":{"y":871,"x":288,"var":"quit_time","text":"自动退出倒计时","strokeColor":"#3b2213","stroke":6,"fontSize":22,"font":"SimHei","color":"#fef3ce"}},{"type":"Button","props":{"x":377,"var":"Btn_quit","stateNum":1,"skin":"ui_pet/btn-xuanzhong-shenshou.png","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"labelAlign":"center","label":"点击退出","bottom":208,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.topic.AcitonSettViewUI.uiView);

        }

    }
}

module ui.action.topic {
    export class CountdownViewUI extends View {
		public model:Laya.Clip;

        public static  uiView:any ={"type":"View","props":{"width":147,"height":189},"child":[{"type":"Clip","props":{"width":42,"var":"model","skin":"ui_common/img-dianji-shanghai.png","mouseThrough":true,"index":3,"height":54,"clipY":1,"clipX":10,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.action.topic.CountdownViewUI.uiView);

        }

    }
}

module ui.action.topic {
    export class TopicViewUI extends View {
		public bg:Laya.Image;
		public wxbg:Laya.Box;
		public imgbg:Laya.Image;
		public bgImg:Laya.Image;
		public btn_close:Laya.Image;
		public attack_name:Laya.Label;
		public attack_point:Laya.Label;
		public attack_instruction:laya.html.dom.HTMLDivElement;
		public tx_reward:Laya.Label;
		public attack_contribution:Laya.Label;
		public txt_countdown:Laya.Label;
		public fighting:Laya.Image;
		public target:Laya.Box;
		public pic_end_click:Laya.Image;
		public pic_start_click:Laya.Image;
		public pic_point_click:Laya.Image;
		public btn_support:Laya.Button;
		public btn_against:Laya.Button;
		public icon_win:Laya.Image;
		public win_txt:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"bg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"text":"label","right":0,"left":0,"color":"#000000","bottom":0,"bgColor":"#000000"}},{"type":"Box","props":{"y":0,"width":750,"var":"wxbg","height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"imgbg","top":0,"right":0,"mouseThrough":false,"left":0,"bottom":0,"alpha":1},"child":[{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0,"alpha":1},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":750,"lineWidth":1,"height":1154,"fillColor":"#0c0908"}}]},{"type":"Image","props":{"y":0,"x":0,"width":750,"height":1200,"alpha":0.8},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":750,"lineWidth":1,"height":1200,"fillColor":"#0c0908"}}]},{"type":"Image","props":{"y":74,"x":0,"width":750,"var":"bgImg","height":959}},{"type":"Label","props":{"y":45,"x":17,"width":6,"height":25,"bgColor":"#4a408a"}},{"type":"Image","props":{"y":1,"x":0,"width":750,"sizeGrid":"10,24,6,0","height":74},"child":[{"type":"Image","props":{"y":41,"x":0,"width":620,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":32},"child":[{"type":"Image","props":{"y":0,"x":582,"width":167,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":32}}]},{"type":"Image","props":{"y":39,"x":647,"var":"btn_close","skin":"ui_main/btn-guanbi.png"}}]},{"type":"Label","props":{"y":44,"x":46,"width":115,"var":"attack_name","valign":"middle","text":"话题先锋","height":29,"fontSize":26,"font":"SimHei","color":"#feb979","bold":false,"align":"left"}}]},{"type":"Image","props":{"y":119,"x":23,"width":212,"top":119,"name":"底图","left":23,"height":120},"child":[{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":45}},{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-jianbian-huodong.png","sizeGrid":"0,1,0,1","height":45}},{"type":"Image","props":{"y":3,"x":8,"skin":"ui_action/ui-daojishi-biao-huodong.png"}},{"type":"Image","props":{"y":82,"x":0,"width":187,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":37}}]},{"type":"Image","props":{"y":0,"x":0,"top":0,"right":0,"name":"文字","left":0,"height":1036},"child":[{"type":"Label","props":{"y":885,"x":86,"wordWrap":true,"width":585,"var":"attack_point","text":"话题点：","leading":8,"height":57,"fontSize":18,"font":"SimHei","color":"#d6d7dd"}},{"type":"HTMLDivElement","props":{"y":848,"x":84,"width":585,"var":"attack_instruction","innerHTML":"玩法说明：","height":25}},{"type":"Label","props":{"y":758,"wordWrap":true,"width":536,"var":"tx_reward","text":"15点30分结算奖励","leading":8,"height":33,"fontSize":28,"font":"SimHei","color":"#d6d7dd","centerX":0,"bold":true,"align":"center"}},{"type":"Label","props":{"y":209,"x":35,"wordWrap":true,"width":188,"var":"attack_contribution","text":"贡献值","height":24,"fontSize":20,"font":"SimHei","color":"#f4f4f4"}},{"type":"Label","props":{"y":129,"x":82,"wordWrap":true,"width":141,"var":"txt_countdown","text":"倒计时：60","name":"倒计时","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Image","props":{"y":0,"x":0,"var":"fighting","top":0,"sizeGrid":"20,20,20,20","right":0,"mouseThrough":true,"left":0,"height":1036},"child":[{"type":"Box","props":{"y":240,"x":0,"width":750,"var":"target","name":"目标层","height":600}},{"type":"Image","props":{"y":590,"x":375,"width":274,"mouseThrough":true,"height":77,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":274,"var":"pic_end_click","skin":"ui_action/img-jieshu-huatixianfeng.png","height":77}},{"type":"Image","props":{"y":0,"x":0,"var":"pic_start_click","skin":"ui_action/img-kaishi-huatixianfeng.png"}},{"type":"Image","props":{"y":3,"x":-32,"var":"pic_point_click"},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_action/img-dian-huatixianfeng.png","scaleY":1.5,"scaleX":1.5}},{"type":"Image","props":{"y":0,"x":130,"skin":"ui_action/img-dian-huatixianfeng.png","scaleY":1.5,"scaleX":1.5}},{"type":"Image","props":{"y":0,"x":260,"skin":"ui_action/img-dian-huatixianfeng.png","scaleY":1.5,"scaleX":1.5}}]}]},{"type":"Button","props":{"y":990,"x":243,"width":316,"var":"btn_support","stateNum":1,"skin":"ui_action/btn-toupiao-zhichi-huodong.png","name":"支持","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"label":"支持","height":85,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":990,"x":514,"width":316,"var":"btn_against","stateNum":1,"skin":"ui_action/btn-toupiao-fandui-huodong.png","name":"反对","labelSize":40,"labelFont":"SimHei","labelColors":"#491a22","labelBold":true,"label":"反对","height":85,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":948,"x":112,"width":52,"var":"icon_win","height":64},"child":[{"type":"Image","props":{"skin":"ui_action/img-biaoqian-zhekou-bg.png"}},{"type":"Image","props":{"y":0,"x":52,"skin":"ui_action/img-biaoqian-zhekou-bg.png","scaleX":-1}},{"type":"Label","props":{"y":27,"x":28,"width":57,"var":"win_txt","text":"胜利","strokeColor":"#e33b3b","stroke":2,"skewY":18,"skewX":-18,"height":38,"fontSize":26,"font":"Microsoft YaHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.action.topic.TopicViewUI.uiView);

        }

    }
}

module ui.camp {
    export class CampDonateViewUI extends View {
		public Other:Laya.Label;
		public Btn_Close:Laya.Button;
		public m_d:Laya.Button;
		public money:Laya.Image;
		public num_m:Laya.Label;
		public money_heat:Laya.Label;
		public M_num:Laya.Label;
		public M_Times:laya.html.dom.HTMLDivElement;
		public D_d:Laya.Button;
		public Diamond:Laya.Image;
		public num_d:Laya.Label;
		public D_heat:Laya.Label;
		public D_num:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":586,"height":488,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"top":0,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"0,0,19,0","right":0,"left":0,"bottom":0}},{"type":"Image","props":{"y":-153,"x":-86,"top":0,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,21,0","right":0,"left":0,"bottom":0}},{"type":"Label","props":{"y":440,"x":68,"text":"阵营捐献获得阵营热度,阵营热度提升阵营等级","height":20,"fontSize":22,"font":"SimHei","color":"#d6d7dd","centerX":0,"align":"left"}},{"type":"Label","props":{"y":0,"x":0,"width":586,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Button","props":{"x":479,"var":"Btn_Close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":41,"text":"阵营捐献","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}}]},{"type":"Image","props":{"y":435,"x":25,"skin":"ui_shop/img-tanhao.png"}},{"type":"Button","props":{"y":250,"x":156,"width":274,"var":"m_d","stateNum":1,"height":364,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"money","skin":"ui_camp/btn-junaxuan-zhenying.png"},"child":[{"type":"Label","props":{"y":166,"x":182,"var":"num_m","text":"20","fontSize":20,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":239,"x":43,"var":"money_heat","text":"阵营热度:  +100","fontSize":24,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":287,"x":31,"width":216,"var":"M_num","text":"捐献10金币","height":26,"fontSize":26,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"},"child":[{"type":"HTMLDivElement","props":{"y":30,"x":-23,"width":254,"var":"M_Times","innerHTML":"htmlText","height":30}}]},{"type":"Image","props":{"y":46,"x":58,"width":140,"skin":"ui_icon/icon_prop_015.png","height":140}}]}]},{"type":"Button","props":{"y":250,"x":435,"width":274,"var":"D_d","stateNum":1,"height":364,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"Diamond","skin":"ui_camp/btn-junaxuan-zhenying.png"},"child":[{"type":"Label","props":{"y":163,"x":182,"var":"num_d","text":"20","fontSize":20,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":236,"x":44,"var":"D_heat","text":"阵营热度:  +100","fontSize":24,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":300,"x":63,"var":"D_num","text":"捐献10钻石","fontSize":26,"font":"SimHei","color":"#5f2904","bold":true,"align":"left"}},{"type":"Image","props":{"y":65,"x":76,"skin":"ui_icon/icon_prop_006.png"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.camp.CampDonateViewUI.uiView);

        }

    }
}

module ui.camp {
    export class CampInfoViewUI extends View {
		public Other:Laya.Label;
		public Btn_close:Laya.Button;
		public camp_Btn_join:Laya.Button;
		public Look_member:Laya.Image;
		public Camp_icon:Laya.Image;
		public Camp_name:Laya.Label;
		public Camp_Level:Laya.Label;
		public Camp_MemberNum:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"x":82,"width":587,"height":400,"centerY":0,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":587,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50},"child":[{"type":"Button","props":{"x":532,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}},{"type":"Label","props":{"x":45,"width":105,"text":"阵营信息","height":31,"fontSize":24,"font":"SimHei","color":"#fefeff","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}}]},{"type":"Button","props":{"x":203,"width":180,"var":"camp_Btn_join","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"加入阵营","height":50,"bottom":31},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Image","props":{"y":136,"x":435,"var":"Look_member","skin":"ui_camp/btn-changkanhengyuan-zhenying.png"}},{"type":"Image","props":{"y":93,"x":49,"width":144,"var":"Camp_icon","skin":"ui_main/btn-boos-ketiaozhan.png","height":144}},{"type":"Label","props":{"y":92,"x":223,"width":180,"var":"Camp_name","height":35,"fontSize":30,"font":"SimHei","color":"#225a88","align":"left"}},{"type":"Label","props":{"y":125,"x":324,"width":86,"var":"Camp_Level","height":21,"fontSize":20,"font":"SimHei","align":"left"}},{"type":"Label","props":{"y":154,"x":326,"width":111,"var":"Camp_MemberNum","height":20,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":154,"x":223,"width":62,"text":"阵营成员:","height":20,"fontSize":20,"font":"SimHei","color":"#000000"}},{"type":"Label","props":{"y":125,"x":223,"width":86,"text":"阵营等级:","height":21,"fontSize":20,"font":"SimHei","color":"#000000"}},{"type":"Label","props":{"x":7,"width":567,"height":2,"bottom":111,"bgColor":"#7c7a88"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.camp.CampInfoViewUI.uiView);

        }

    }
}

module ui.camp {
    export class CampMainInfoUI extends View {
		public Other:Laya.Label;
		public Btn_Close:Laya.Button;
		public camp_help:Laya.Image;
		public camp_icon:Laya.Image;
		public camp_name:Laya.Label;
		public camp_lv:laya.html.dom.HTMLDivElement;
		public camp_hurt:laya.html.dom.HTMLDivElement;
		public camp_num:laya.html.dom.HTMLDivElement;
		public Btn_Change:Laya.Button;
		public Camp_Panel:Laya.Panel;
		public Camp_Info:Laya.VBox;
		public Btn_CampDonate:Laya.Image;
		public D_red:Laya.Image;
		public Btn_CampPlay:Laya.Image;
		public Btn_CampRank:Laya.Image;
		public camp_hot:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":682,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"6,0,23,0","height":893,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":1,"x":3,"width":682,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#5d4565"}},{"type":"Button","props":{"x":609,"var":"Btn_Close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}},{"type":"Label","props":{"x":41,"text":"阵营","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Image","props":{"x":97,"var":"camp_help","skin":"ui_action/btn-xiangqing-huodong.png","centerY":0}}]},{"type":"Label","props":{"y":0,"x":0,"name":"toop"},"child":[{"type":"Image","props":{"y":62,"x":34,"width":144,"var":"camp_icon","height":144}},{"type":"Label","props":{"y":62,"x":198,"var":"camp_name","text":"大学生了没","fontSize":20,"font":"SimHei","color":"#FEFEFF"}},{"type":"HTMLDivElement","props":{"y":90,"x":198,"var":"camp_lv","height":20}},{"type":"HTMLDivElement","props":{"y":118,"x":198,"width":200,"var":"camp_hurt","height":20}},{"type":"HTMLDivElement","props":{"y":146,"x":198,"width":196,"var":"camp_num","height":20}},{"type":"Label","props":{"y":71,"x":402,"width":1,"height":123,"bgColor":"#7c7a88"}},{"type":"Button","props":{"y":97,"x":462,"var":"Btn_Change","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"更换阵营"}}]},{"type":"Label","props":{"y":225,"x":13,"width":662,"height":420,"bgColor":"#34354b"},"child":[{"type":"Image","props":{"y":23,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"y":696,"x":623,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":45,"x":11,"width":642,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":4},"child":[{"type":"Label","props":{"y":-34,"x":45,"width":99,"text":"阵营信息","height":26,"fontSize":22,"font":"SimHei","color":"#e4eafe","align":"left"}},{"type":"Label","props":{"y":-35,"x":19,"width":6,"height":25,"bgColor":"#df8e2f"}}]},{"type":"Panel","props":{"y":55,"x":11,"width":642,"var":"Camp_Panel","height":350},"child":[{"type":"VBox","props":{"y":0,"var":"Camp_Info","right":0,"renderType":"render","left":0,"height":330}}]}]},{"type":"Label","props":{"y":782,"width":662,"height":100,"fontSize":18,"font":"SimHei","color":"#d6d7dd","centerX":0},"child":[{"type":"Image","props":{"top":0,"skin":"ui_camp/img-baibian-zhenying.png","sizeGrid":"5,2,1,1","right":0,"left":0,"bottom":0}},{"type":"Image","props":{"y":9,"x":486,"var":"Btn_CampDonate","skin":"ui_camp/btn-juanxian-zhenying.png"},"child":[{"type":"Image","props":{"y":-5,"x":-5,"var":"D_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Image","props":{"y":9,"x":116,"var":"Btn_CampPlay","skin":"ui_camp/btn-chengyuan-zhenying.png"}},{"type":"Image","props":{"y":9,"x":303,"var":"Btn_CampRank","skin":"ui_camp/btn-paihangbang-zhenying.png"}}]},{"type":"HTMLDivElement","props":{"y":662,"x":45,"width":589,"var":"camp_hot","innerHTML":"htmlText","height":79}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.camp.CampMainInfoUI.uiView);

        }

    }
}

module ui.camp {
    export class CampMemberViewUI extends View {
		public background_label:Laya.Label;
		public Btn_close:Laya.Image;
		public Camp_playlist:Laya.List;
		public arrow_up:Laya.Image;
		public my_rank:Laya.Label;
		public camp_name:Laya.Label;
		public play_Donate:Laya.Label;
		public play_su:Laya.Label;
		public arrow_down:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"background_label","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"x":25,"width":701,"height":994,"centerY":0,"centerX":0,"bgColor":"#a2b0c7","alpha":1},"child":[{"type":"Label","props":{"y":1,"x":0,"width":701,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#5d4565","alpha":1}},{"type":"Label","props":{"x":42,"text":"成员列表","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Image","props":{"x":636,"var":"Btn_close","skin":"ui_main/btn-guanbi.png","centerY":0}}]},{"type":"Label","props":{"y":60,"x":0,"width":701,"height":46,"bgColor":"#5a456a","alpha":1},"child":[{"type":"Label","props":{"y":12,"x":49,"width":50,"text":"排名","name":"rank","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":172,"width":50,"text":"名字","name":"name","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":398,"width":50,"text":"捐献","name":"donate","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":563,"width":50,"text":"关卡","name":"su","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":7,"x":110,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":294,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":511,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}}]},{"type":"List","props":{"y":115,"x":35,"width":627,"var":"Camp_playlist","spaceY":8,"height":754,"alpha":1},"child":[{"type":"Box","props":{"y":0,"x":0,"width":627,"renderType":"render","height":92,"alpha":1},"child":[{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","name":"bg","height":92}},{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-1-paiming.png","sizeGrid":"0,6,0,78","name":"Rank_Num","height":92}},{"type":"Text","props":{"y":2,"x":0,"width":77,"valign":"middle","text":"1","name":"rankNum","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"y":12,"x":259,"width":2,"height":70,"bgColor":"#36374f","alpha":1}},{"type":"Label","props":{"y":36,"x":112,"width":69,"text":"玩家id","name":"play_Name","height":29,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":12,"x":476,"width":2,"height":70,"bgColor":"#36374f","alpha":1}},{"type":"Label","props":{"y":36,"x":332,"width":69,"text":"1000","name":"play_Donate","height":29,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":36,"x":522,"width":69,"text":"1000","name":"play_Customs","height":29,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"width":627,"name":"background_label","height":92}}]}]},{"type":"Image","props":{"y":27,"var":"arrow_up","skin":"ui_camp/btn-jiantou-tongyong.png","centerX":0,"alpha":1}},{"type":"Label","props":{"y":894,"x":35,"width":626,"height":94,"bgColor":"#5a456a","alpha":1},"child":[{"type":"Label","props":{"y":13,"x":10,"wordWrap":true,"width":66,"var":"my_rank","padding":"18","height":78,"fontSize":28,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":30,"x":80,"width":172,"var":"camp_name","height":25,"fontSize":22,"font":"Microsoft YaHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":10,"x":259,"width":2,"height":70,"bgColor":"#36374f"}},{"type":"Label","props":{"y":11,"x":476,"width":2,"height":70,"bgColor":"#36374f","alpha":1}},{"type":"Label","props":{"y":40,"x":354,"width":0,"var":"play_Donate","height":0,"fontSize":22,"font":"SimHei","color":"#fefeff"}},{"type":"Label","props":{"y":43,"x":548,"width":0,"var":"play_su","height":0,"fontSize":22,"font":"SimHei","color":"#fefeff"}}]},{"type":"Image","props":{"y":895,"x":305,"var":"arrow_down","skin":"ui_camp/btn-jiantou-tongyong.png","skewX":180,"centerX":0,"alpha":1}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.camp.CampMemberViewUI.uiView);

        }

    }
}

module ui.camp {
    export class CampPlayInfoUI extends View {
		public Other:Laya.Label;
		public Btn_Close:Laya.Image;
		public play_headIcon:Laya.Image;
		public Play_Name:Laya.Label;
		public camp:Laya.Label;
		public camp_name:Laya.Label;
		public guanka:Laya.Label;
		public guanka_num:Laya.Label;
		public pet:Laya.Label;
		public pet_num:Laya.Label;
		public hero:Laya.Label;
		public hero_num:Laya.Label;
		public time:Laya.Label;
		public time_num:Laya.Label;
		public btn_sure:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":587,"height":614,"centerY":0,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":587,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50},"child":[{"type":"Image","props":{"x":479,"var":"Btn_Close","skin":"ui_main/btn-guanbi.png","centerY":0}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Label","props":{"x":44,"text":"欢迎回来","fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}}]},{"type":"Image","props":{"y":63,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"y":61,"x":20,"width":70,"var":"play_headIcon","skin":"ui_head/icon-tou-lydd.png","height":70}},{"type":"Label","props":{"y":61,"x":110,"width":180,"var":"Play_Name","height":40,"fontSize":30,"font":"SimHei"}},{"type":"Image","props":{"y":165,"x":20,"width":546,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40},"child":[{"type":"Label","props":{"y":11,"x":21,"var":"camp","text":"所在阵营","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":8,"x":375,"var":"camp_name","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":225,"x":20,"width":546,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40},"child":[{"type":"Label","props":{"y":11,"x":21,"var":"guanka","text":"最高通关","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":8,"x":375,"var":"guanka_num","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":285,"x":20,"width":546,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40},"child":[{"type":"Label","props":{"y":11,"x":21,"var":"pet","text":"解锁宠物","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":8,"x":375,"var":"pet_num","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":345,"x":20,"width":546,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40},"child":[{"type":"Label","props":{"y":11,"x":21,"var":"hero","text":"解锁英雄","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":8,"x":375,"var":"hero_num","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":405,"x":20,"width":546,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40},"child":[{"type":"Label","props":{"y":11,"x":21,"var":"time","text":"上次在线时间","fontSize":24,"font":"SimHei","color":"#fef8e9","align":"left"}},{"type":"Label","props":{"y":8,"x":234,"width":285,"var":"time_num","text":"大学生了没吧","height":24,"fontSize":24,"font":"SimHei","color":"#fef8e9","align":"right"}}]},{"type":"Image","props":{"y":871,"x":585,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Label","props":{"y":503,"x":7,"width":568,"height":2,"bgColor":"#7c7a88"}},{"type":"Button","props":{"y":524,"x":209,"var":"btn_sure","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"确定"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.camp.CampPlayInfoUI.uiView);

        }

    }
}

module ui.camp {
    export class CampRankViewUI extends View {
		public Other:Laya.Label;
		public btn_close:Laya.Button;
		public camp_list:Laya.List;
		public my_campname:Laya.Label;
		public camp_num:laya.html.dom.HTMLDivElement;
		public camp_rank:laya.display.Text;
		public camp_lv:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"x":25,"width":701,"height":935,"centerY":0,"centerX":0,"bgColor":"#a2b0c7"},"child":[{"type":"Label","props":{"y":0,"x":0,"width":701,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#5d4565"}},{"type":"Label","props":{"x":42,"text":"阵营排名","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Button","props":{"x":636,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}}]},{"type":"Label","props":{"y":51,"x":0,"width":701,"height":46,"bgColor":"#5a456a","alpha":1},"child":[{"type":"Label","props":{"y":12,"x":49,"width":50,"text":"排名","name":"rank","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":172,"width":50,"text":"阵营","name":"name","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":368,"width":50,"text":"成员","name":"PLAY","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":7,"x":110,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":294,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":556,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":12,"x":558,"width":50,"text":"等级","name":"PLAY","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}}]},{"type":"List","props":{"y":108,"x":34,"width":627,"var":"camp_list","spaceY":6,"height":732},"child":[{"type":"Box","props":{"y":0,"x":0,"width":627,"renderType":"render","height":92},"child":[{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","name":"bg","height":92}},{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-1-paiming.png","sizeGrid":"0,6,0,78","name":"Rank_Num","height":98}},{"type":"Label","props":{"y":35,"x":90,"width":150,"text":"大学生吧","name":"Camp_Name","height":25,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":12,"x":257,"width":2,"height":70,"bgColor":"#36374f"}},{"type":"Image","props":{"y":31,"x":279,"skin":"ui_camp/icon-chengyuanshuliang-zhenying.png"}},{"type":"HTMLDivElement","props":{"y":35,"x":329,"width":130,"name":"Camp_play_num","height":25}},{"type":"Text","props":{"y":2,"x":0,"width":77,"valign":"middle","text":"1","name":"rankNum","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"width":148,"right":0,"height":92,"bgColor":"#242243","alpha":0.6}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"alpha":0.6}},{"type":"Button","props":{"y":26,"x":487,"visible":false,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_Change","labelSize":25,"labelFont":"SimHei","labelColors":"#fefeff","label":"更换","alpha":1}},{"type":"Label","props":{"y":35,"x":503,"width":100,"name":"camp_lv","height":25,"fontSize":20,"font":"SimHei","color":"#fefeff","align":"center"}}]}]},{"type":"Image","props":{"y":845,"x":35,"width":626,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","height":94},"child":[{"type":"Label","props":{"y":33,"x":87,"var":"my_campname","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":13,"x":259,"width":2,"height":70,"bgColor":"#36374f"}},{"type":"Image","props":{"y":30,"x":287,"skin":"ui_camp/icon-chengyuanshuliang-zhenying.png"}},{"type":"HTMLDivElement","props":{"y":36,"x":353,"width":100,"var":"camp_num","innerHTML":"1000/1000","height":20}},{"type":"Text","props":{"y":0,"x":0,"width":77,"var":"camp_rank","valign":"middle","text":"1","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"y":36,"x":498,"width":100,"var":"camp_lv","height":20,"fontSize":20,"font":"SimHei","color":"#fefeff","align":"center"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);
			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.camp.CampRankViewUI.uiView);

        }

    }
}

module ui.camp {
    export class CampViewUI extends View {
		public bg:Laya.Label;
		public lclbg:Laya.Box;
		public Btn_Close:Laya.Button;
		public Camp_List:Laya.List;
		public arrow_down:Laya.Image;
		public arrow_up:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"var":"bg","top":0,"right":0,"left":0,"bottom":0,"alpha":1},"child":[{"type":"Box","props":{"width":750,"var":"lclbg","height":1200},"child":[{"type":"Label","props":{"y":47,"x":0,"right":0,"left":0,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#5d4565","alpha":1}},{"type":"Label","props":{"x":40,"text":"加入阵营","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"bold":true,"align":"left"}},{"type":"Button","props":{"x":655,"var":"Btn_Close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}}]},{"type":"Label","props":{"y":96,"x":0,"right":0,"left":0,"height":1035,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":-16,"skin":"ui_common/img-huawen1.png"}},{"type":"Label","props":{"y":12,"x":422,"text":"成员","fontSize":25,"font":"SimHei","color":"#d6d7dd"}},{"type":"Label","props":{"y":12,"x":142,"text":"阵营","fontSize":25,"font":"SimHei","color":"#d6d7dd"}},{"type":"Label","props":{"y":7,"x":319,"width":2,"height":34,"bgColor":"#4c3a5a","alpha":1}},{"type":"Label","props":{"y":7,"x":581,"width":2,"height":34,"bgColor":"#4c3a5a","alpha":1}}]},{"type":"Label","props":{"y":141,"x":10,"right":10,"left":10,"height":981,"bgColor":"#a2b0c7","alpha":1},"child":[{"type":"Image","props":{"y":84,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0}}]},{"type":"List","props":{"y":151,"x":20,"var":"Camp_List","spaceY":6,"right":20,"repeatY":30,"left":20,"height":964},"child":[{"type":"Box","props":{"y":0,"x":0,"width":711,"renderType":"render","height":86},"child":[{"type":"Image","props":{"y":0,"x":0,"width":711,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":86}},{"type":"Image","props":{"y":0,"x":0,"width":86,"name":"Camp_Icon","height":86}},{"type":"Label","props":{"x":107,"width":180,"name":"Camp_Name","height":30,"fontSize":24,"font":"SimHei","color":"#fefeff","centerY":0,"align":"center"}},{"type":"Label","props":{"x":298,"width":2,"height":70,"centerY":0,"bgColor":"# 6f394d"}},{"type":"Image","props":{"y":30,"x":344,"skin":"ui_camp/icon-chengyuanshuliang-zhenying.png"}},{"type":"HTMLDivElement","props":{"y":30,"x":398,"width":133,"name":"Camp_PalyNum","height":30}},{"type":"Label","props":{"width":148,"right":0,"height":86,"bgColor":"#242243","alpha":0.6}},{"type":"Image","props":{"width":64,"skin":"ui_common/img-huawen2.png","right":0,"height":67,"bottom":0,"alpha":0.6}},{"type":"Button","props":{"y":20,"x":574,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_join","labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"加入","alpha":1}},{"type":"Label","props":{"y":0,"x":0,"width":575,"name":"Camp_Info","height":86}}]}]},{"type":"Image","props":{"y":1113,"x":330,"var":"arrow_down","skin":"ui_camp/btn-jiantou-tongyong.png","scaleY":-1,"centerX":0}},{"type":"Image","props":{"y":111,"x":330,"var":"arrow_up","skin":"ui_camp/btn-jiantou-tongyong.png","centerX":0}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.camp.CampViewUI.uiView);

        }

    }
}

module ui.camp {
    export class JoinCampTipUI extends View {
		public Other:Laya.Label;
		public btn_close:Laya.Button;
		public camp_text:Laya.Label;
		public btn_jioncamp:Laya.Button;
		public btn_cancel:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":10,"x":10,"var":"Other","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Label","props":{"width":587,"height":598,"centerY":0,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":587,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,0,1,0","height":50},"child":[{"type":"Label","props":{"x":45,"width":105,"text":"加入阵营","height":31,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"x":534,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}}]},{"type":"Image","props":{"y":72,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Label","props":{"y":487,"x":10,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"Label","props":{"y":281,"x":42,"text":"加入一个阵营","fontSize":22,"font":"SimHei","color":"#225a88","bold":true}},{"type":"Label","props":{"y":321,"x":38,"wordWrap":true,"width":522,"var":"camp_text","height":102,"fontSize":20,"font":"SimHei","color":"#49495b","align":"left"}},{"type":"Button","props":{"y":515,"x":326,"width":180,"var":"btn_jioncamp","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"加入阵营","height":50},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Button","props":{"y":515,"x":88,"width":180,"var":"btn_cancel","stateNum":1,"labelStrokeColor":"#6a3e14","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"不再提示","height":50},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#8a712e"}}]},{"type":"Image","props":{"y":54,"x":13,"skin":"ui_camp/img-jiaru-hua-zhenying.png"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.camp.JoinCampTipUI.uiView);

        }

    }
}

module ui.camp {
    export class ReplaceCampViewUI extends View {
		public Other:Laya.Label;
		public Btn_Close:Laya.Button;
		public Camp_List:Laya.List;
		public camp_Name:Laya.Label;
		public camp_num:laya.html.dom.HTMLDivElement;
		public rankNum:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"text":"label","right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"x":25,"width":701,"height":935,"centerY":0,"centerX":0,"bgColor":"#a2b0c7"},"child":[{"type":"Label","props":{"y":0,"x":0,"width":701,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#5d4565"}},{"type":"Label","props":{"x":42,"text":"更换阵营","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Button","props":{"x":636,"var":"Btn_Close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}}]},{"type":"Label","props":{"y":51,"x":0,"width":701,"height":46,"bgColor":"#5a456a","alpha":1},"child":[{"type":"Label","props":{"y":12,"x":49,"width":50,"text":"热度","name":"rank","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":172,"width":50,"text":"阵营","name":"name","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":12,"x":398,"width":50,"text":"成员","name":"donate","height":29,"fontSize":24,"font":"SimHei","color":"#bebbf8","align":"left"}},{"type":"Label","props":{"y":7,"x":110,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":294,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}},{"type":"Label","props":{"y":7,"x":556,"width":2,"height":34,"bgColor":"#4e3c5d","alpha":1}}]},{"type":"List","props":{"y":108,"x":34,"width":627,"var":"Camp_List","spaceY":6,"height":732},"child":[{"type":"Box","props":{"y":0,"x":0,"width":627,"renderType":"render","height":92},"child":[{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","name":"bg","height":92}},{"type":"Image","props":{"y":0,"x":0,"width":629,"skin":"ui_rank/img-1-paiming.png","sizeGrid":"0,6,0,78","name":"Rank_Num","height":98}},{"type":"Label","props":{"y":35,"x":81,"width":173,"text":"大学生吧","name":"Camp_Name","height":25,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":12,"x":257,"width":2,"height":70,"bgColor":"#36374f"}},{"type":"Image","props":{"y":31,"x":279,"skin":"ui_camp/icon-chengyuanshuliang-zhenying.png"}},{"type":"HTMLDivElement","props":{"y":35,"x":327,"width":145,"name":"Camp_play_num","height":25}},{"type":"Text","props":{"y":2,"x":0,"width":77,"valign":"middle","text":"1","name":"rankNum","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"width":148,"right":0,"height":92,"bgColor":"#242243","alpha":0.6}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"alpha":0.6}},{"type":"Button","props":{"y":26,"x":487,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_Change","labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"更换","alpha":1}}]}]},{"type":"Image","props":{"y":845,"x":35,"width":626,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,6,0,78","height":94},"child":[{"type":"Label","props":{"y":33,"x":87,"var":"camp_Name","text":"大学生了没吧","fontSize":24,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":13,"x":259,"width":2,"height":70,"bgColor":"#36374f"}},{"type":"Image","props":{"y":30,"x":287,"skin":"ui_camp/icon-chengyuanshuliang-zhenying.png"}},{"type":"HTMLDivElement","props":{"y":36,"x":353,"width":145,"var":"camp_num","innerHTML":"1000/1000","height":20}},{"type":"Text","props":{"y":0,"x":0,"width":77,"var":"rankNum","valign":"middle","text":"1","height":93,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);
			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.camp.ReplaceCampViewUI.uiView);

        }

    }
}

module ui.camp {
    export class ReplaceTipViewUI extends View {
		public Other:Laya.Label;
		public Btn_close:Laya.Button;
		public look_play:Laya.Image;
		public camp_icon:Laya.Image;
		public camp_name:Laya.Label;
		public camp_playnum:Laya.Label;
		public camp_lv:Laya.Label;
		public camp_hot:Laya.Label;
		public btn_change:Laya.Button;
		public DiamondNUm:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"text":"label","right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"width":587,"height":400,"centerY":0,"centerX":0,"bgColor":"#c8c7c7"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":587,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50},"child":[{"type":"Button","props":{"x":532,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","centerY":0}},{"type":"Label","props":{"x":45,"width":105,"text":"阵营信息","height":31,"fontSize":24,"font":"SimHei","color":"#fefeff","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#df8e2f"}}]},{"type":"Image","props":{"y":136,"x":435,"var":"look_play","skin":"ui_camp/btn-changkanhengyuan-zhenying.png"}},{"type":"Image","props":{"y":93,"x":49,"width":144,"var":"camp_icon","skin":"ui_main/btn-boos-ketiaozhan.png","height":144}},{"type":"Label","props":{"y":92,"x":223,"width":180,"var":"camp_name","height":35,"fontSize":30,"font":"SimHei","color":"#225a88","align":"left"}},{"type":"Label","props":{"y":154,"x":223,"width":62,"text":"阵营成员:","height":20,"fontSize":20,"font":"SimHei","color":"#000000"},"child":[{"type":"Label","props":{"y":0,"x":103,"width":111,"var":"camp_playnum","height":20,"fontSize":20,"font":"SimHei"}}]},{"type":"Label","props":{"y":125,"x":223,"width":86,"text":"阵营等级:","height":21,"fontSize":20,"font":"SimHei","color":"#000000"},"child":[{"type":"Label","props":{"y":0,"x":101,"width":86,"var":"camp_lv","height":21,"fontSize":20,"font":"SimHei","align":"left"}}]},{"type":"Label","props":{"x":7,"width":567,"height":2,"bottom":111,"bgColor":"#7c7a88"}},{"type":"Label","props":{"y":185,"x":223,"width":86,"text":"阵营热度:","height":21,"fontSize":20,"font":"SimHei","color":"#000000"},"child":[{"type":"Label","props":{"y":0,"x":101,"width":86,"var":"camp_hot","height":21,"fontSize":20,"font":"SimHei","align":"left"}}]},{"type":"Button","props":{"y":815,"x":203,"width":180,"var":"btn_change","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"更换阵营","height":50,"centerX":0,"bottom":31},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"HTMLDivElement","props":{"y":289,"x":243,"width":100,"var":"DiamondNUm","height":29}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.camp.ReplaceTipViewUI.uiView);

        }

    }
}

module ui.Chat {
    export class ChatFaceResViewUI extends View {
		public lefts:Laya.Image;
		public rights:Laya.Image;
		public list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":false,"mouseEnabled":true,"height":246},"child":[{"type":"Image","props":{"x":0,"width":750,"skin":"ui_chat/img-biaoqingtuo-liaotian.png","sizeGrid":"20,20,20,20","mouseThrough":false,"mouseEnabled":true,"height":246},"child":[{"type":"Image","props":{"y":78,"var":"lefts","skin":"ui_camp/btn-jiantou-tongyong.png","scaleY":-1,"rotation":90,"anchorY":0,"anchorX":0}},{"type":"Image","props":{"y":78,"x":749,"var":"rights","skin":"ui_camp/btn-jiantou-tongyong.png","rotation":90,"anchorY":0,"anchorX":0}},{"type":"List","props":{"x":54,"width":644,"var":"list","top":0,"renderType":"render","bottom":0},"child":[{"type":"Box","props":{"x":0,"width":644,"top":0,"renderType":"render","bottom":0},"child":[{"type":"Image","props":{"y":32,"x":26,"width":45,"name":"item0","height":45}},{"type":"Image","props":{"y":32,"x":86,"width":45,"name":"item1","height":45}},{"type":"Image","props":{"y":32,"x":146,"width":45,"name":"item2","height":45}},{"type":"Image","props":{"y":32,"x":206,"width":45,"name":"item3","height":45}},{"type":"Image","props":{"y":32,"x":266,"width":45,"name":"item4","height":45}},{"type":"Image","props":{"y":32,"x":327,"width":45,"name":"item5","height":45}},{"type":"Image","props":{"y":32,"x":387,"width":45,"name":"item6","height":45}},{"type":"Image","props":{"y":32,"x":447,"width":45,"name":"item7","height":45}},{"type":"Image","props":{"y":32,"x":507,"width":45,"name":"item8","height":45}},{"type":"Image","props":{"y":32,"x":567,"width":45,"name":"item9","height":45}},{"type":"Image","props":{"y":102,"x":26,"width":45,"name":"item10","height":45}},{"type":"Image","props":{"y":102,"x":86,"width":45,"name":"item11","height":45}},{"type":"Image","props":{"y":102,"x":146,"width":45,"name":"item12","height":45}},{"type":"Image","props":{"y":102,"x":206,"width":45,"name":"item13","height":45}},{"type":"Image","props":{"y":102,"x":266,"width":45,"name":"item14","height":45}},{"type":"Image","props":{"y":102,"x":327,"width":45,"name":"item15","height":45}},{"type":"Image","props":{"y":102,"x":387,"width":45,"name":"item16","height":45}},{"type":"Image","props":{"y":102,"x":447,"width":45,"name":"item17","height":45}},{"type":"Image","props":{"y":102,"x":507,"width":45,"name":"item18","height":45}},{"type":"Image","props":{"y":102,"x":567,"width":45,"name":"item19","height":45}},{"type":"Image","props":{"y":172,"x":26,"width":45,"name":"item20","height":45}},{"type":"Image","props":{"y":172,"x":86,"width":45,"name":"item21","height":45}},{"type":"Image","props":{"y":172,"x":146,"width":45,"name":"item22","height":45}},{"type":"Image","props":{"y":172,"x":206,"width":45,"name":"item23","height":45}},{"type":"Image","props":{"y":172,"x":266,"width":45,"name":"item24","height":45}},{"type":"Image","props":{"y":172,"x":327,"width":45,"name":"item25","height":45}},{"type":"Image","props":{"y":172,"x":387,"width":45,"name":"item26","height":45}},{"type":"Image","props":{"y":172,"x":447,"width":45,"name":"item27","height":45}},{"type":"Image","props":{"y":172,"x":507,"width":45,"name":"item28","height":45}},{"type":"Image","props":{"y":172,"x":567,"width":45,"name":"item29","height":45}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.Chat.ChatFaceResViewUI.uiView);

        }

    }
}

module ui.Chat {
    export class ChatLineViewUI extends View {
		public headBg:Laya.Image;
		public headImage:Laya.Image;
		public downBg:Laya.Image;
		public textfieldDown:laya.html.dom.HTMLDivElement;
		public timeLabel:Laya.Label;
		public channelLabel:Laya.Label;
		public textfieldUp:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":600,"height":128},"child":[{"type":"Box","props":{"x":25,"width":600,"height":128},"child":[{"type":"Image","props":{"y":16,"x":2,"width":98,"skin":"ui_chat/img-touxiangtuo-liaotian.png","sizeGrid":"0,39,0,1","height":98},"child":[{"type":"Image","props":{"y":4,"x":4,"width":90,"var":"headBg","skin":"ui_hero/img-lanpingzhilkuang.png","height":90}},{"type":"Image","props":{"y":5,"x":5,"width":86,"var":"headImage","skin":"ui_head/icon-tou-lydd.png","height":86}}]},{"type":"Image","props":{"y":35,"x":108,"width":480,"var":"downBg","skin":"ui_chat/img-duihuakuang-liaotian.png","sizeGrid":"9,10,18,10","height":86},"child":[{"type":"Image","props":{"y":28,"x":-4,"skin":"ui_chat/img-sanjiao-liaotian.png"}},{"type":"HTMLDivElement","props":{"y":11,"x":17,"width":440,"var":"textfieldDown","innerHTML":"发生fdfd的范德萨范德萨发的发窘的设计开发的时空距离范德萨范德萨发生的发生的副驾驶的肌肤的设计考虑空间发了圣诞节覅觉得四架飞机的所发生的","height":58}}]},{"type":"Label","props":{"y":25,"x":564,"var":"timeLabel","text":"00:00:00","fontSize":20,"font":"SimHei","color":"#5a456a","anchorY":0.5,"anchorX":1,"align":"right"}},{"type":"Label","props":{"y":25,"x":115,"var":"channelLabel","text":"【仙盟】","fontSize":20,"font":"SimHei","color":"#ffec50","anchorY":0.5,"anchorX":0,"align":"left"}},{"type":"HTMLDivElement","props":{"y":14,"x":194,"width":303,"var":"textfieldUp","innerHTML":"htmlText","height":24}},{"type":"Label","props":{"y":-13,"width":588,"visible":false,"height":2,"fontSize":22,"font":"SimHei","bgColor":"#0c151c","align":"left"},"child":[{"type":"Label","props":{"y":2,"x":0,"width":640,"height":2,"fontSize":22,"font":"SimHei","bgColor":"#222c34","align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.Chat.ChatLineViewUI.uiView);

        }

    }
}

module ui.Chat {
    export class ChatViewUI extends View {
		public chatbg:Laya.Box;
		public panelBgImage0:Laya.Image;
		public chatPanel0:Laya.Panel;
		public panelBgImage1:Laya.Image;
		public chatPanel1:Laya.Panel;
		public closeBtn:Laya.Button;
		public sendBgImage:Laya.Image;
		public chatInfo:Laya.TextInput;
		public selectFaceClip:Laya.Clip;
		public sendMsgBtn:Laya.Button;
		public btn0:Laya.Image;
		public btn1:Laya.Image;
		public camppoint:Laya.Image;
		public worldpoint:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#1b2838"}},{"type":"Box","props":{"var":"chatbg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Box","props":{"y":0,"x":0,"width":750,"top":0,"centerX":0,"bottom":0},"child":[{"type":"Label","props":{"width":750,"top":64,"right":0,"left":0,"height":919,"bottom":217,"bgColor":"#1b2838"}},{"type":"Label","props":{"x":41,"top":85,"text":"聊天","fontSize":25,"font":"SimHei","color":"#d6d7dd","bold":true,"align":"left"}},{"type":"Label","props":{"x":19,"width":6,"top":85,"height":25,"bgColor":"#5d4565","alpha":1}},{"type":"Label","props":{"width":750,"top":121,"right":0,"left":0,"height":1048,"bottom":78,"bgColor":"#4a408a"}},{"type":"Label","props":{"top":132,"right":5,"left":5,"bottom":105,"bgColor":"#a2b0c7"}},{"type":"Image","props":{"skin":"ui_chat/btn-liaotian (2).png","right":5,"bottom":107}},{"type":"Image","props":{"width":124,"top":256,"skin":"ui_chat/btn-liaotian (2).png","scaleY":-1,"scaleX":-1,"left":128,"height":122}}]},{"type":"Image","props":{"y":149,"x":10,"width":730,"var":"panelBgImage0","top":149,"centerX":0,"bottom":130},"child":[{"type":"Panel","props":{"var":"chatPanel0","top":0,"right":0,"left":0,"bottom":0}}]},{"type":"Image","props":{"y":149,"x":10,"width":730,"var":"panelBgImage1","top":149,"sizeGrid":"20,20,20,20","centerX":0,"bottom":130},"child":[{"type":"Panel","props":{"var":"chatPanel1","top":0,"right":0,"left":0,"bottom":0}}]},{"type":"Button","props":{"y":75,"x":654,"var":"closeBtn","top":75,"stateNum":1,"skin":"ui_common/btn-X-tongyong.png"}}]},{"type":"Image","props":{"width":750,"var":"sendBgImage","skin":"ui_chat/img-shuruqutuo-liaotian.png","sizeGrid":"5,4,5,2","height":70,"centerX":0,"bottom":0},"child":[{"type":"TextInput","props":{"y":11,"x":10,"width":526,"var":"chatInfo","text":"请输入聊天内容","skin":"ui_chat/img-shurukuang-liaotian.png","sizeGrid":"7,3,6,4","promptColor":"#ffffff","padding":"0,0,0,12","height":50,"fontSize":24,"color":"#ffffff"}},{"type":"Clip","props":{"y":11,"x":544,"var":"selectFaceClip","skin":"ui_chat/btn-biaoqing-n.png","clipY":1,"clipX":1}},{"type":"Button","props":{"y":12,"x":611,"var":"sendMsgBtn","stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","labelStrokeColor":"#6f1e13","labelStroke":3,"labelSize":24,"labelPadding":"0,0,0,0","labelFont":"SimHei","labelColors":"#ffe5e5,#ffe5e5,#ffe5e5,#ffe5e5","labelBold":true,"label":"发送"}}]},{"type":"Box","props":{"bottom":71},"child":[{"type":"Image","props":{"y":-2,"x":0,"width":298,"skin":"ui_rank/img-xiaobiaoqian-tuo.png","sizeGrid":"0,41,0,3","height":48}},{"type":"Image","props":{"y":0,"x":0,"width":150,"var":"btn0","skin":"ui_rank/img-zi-xuan.png","sizeGrid":"0,33,0,0","height":44},"child":[{"type":"Label","props":{"y":9,"x":34,"valign":"middle","text":"世界","name":"type","fontSize":26,"font":"SimHei","color":"#eff8bb","bold":true,"align":"center"}}]},{"type":"Image","props":{"x":117,"width":174,"var":"btn1","skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,34,0,34","height":44},"child":[{"type":"Label","props":{"y":9,"x":60,"valign":"middle","text":"阵营","name":"type","fontSize":26,"font":"SimHei","color":"#bebbf8","bold":true,"align":"center"}}]}]},{"type":"Image","props":{"x":238,"visible":false,"var":"camppoint","skin":"ui_common/img-tixing.png","bottom":90}},{"type":"Image","props":{"x":94,"visible":false,"var":"worldpoint","skin":"ui_common/img-tixing.png","bottom":90}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.Chat.ChatViewUI.uiView);

        }

    }
}

module ui.Chat {
    export class InteractViewUI extends View {
		public redPoint:Laya.Image;
		public giveto:Laya.Label;
		public giveBtn:Laya.Button;
		public btnlabel:Laya.Label;
		public list:Laya.List;
		public close:Laya.Image;
		public image1:Laya.Image;
		public image2:Laya.Image;
		public image3:Laya.Image;
		public image4:Laya.Image;
		public image5:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Box","props":{"width":754,"height":1105,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":-43,"x":-1025,"width":3000,"height":1360,"bgColor":"#000000","alpha":0.6}},{"type":"Label","props":{"y":252,"x":35,"width":685,"height":588,"bgColor":"#5a5b7c"}},{"type":"Label","props":{"y":290,"x":41,"width":674,"height":498,"bgColor":"#2c2d45"}},{"type":"Image","props":{"y":213,"x":33,"width":686,"height":41},"child":[{"type":"Label","props":{"y":2,"x":0,"width":688,"height":45,"bgColor":"#0f192d","alpha":1}},{"type":"Label","props":{"y":10,"x":22,"width":6,"height":24,"bgColor":"#4a408a","alpha":1}},{"type":"Label","props":{"y":10,"x":45,"text":"互动","fontSize":25,"font":"SimHei","color":"#d6d7dd","bold":true,"align":"left"}},{"type":"Image","props":{"y":2,"x":82,"width":26,"visible":false,"var":"redPoint","skin":"ui_common/img-tixing.png","height":26}},{"type":"Image","props":{"y":94,"x":22,"width":643,"skin":"ui_sign/img-hongtuo-qiandao.png","sizeGrid":"0,2,0,2","height":76}}]},{"type":"Label","props":{"y":344,"x":81,"text":"你要赠送礼物给：","fontSize":20,"font":"SimHei","color":"#b7aabc","align":"left"}},{"type":"Label","props":{"y":345,"x":243,"width":143,"var":"giveto","text":"玩家名字","height":20,"fontSize":20,"font":"SimHei","color":"#ff5187","align":"left"}},{"type":"Button","props":{"y":357,"x":618,"width":100,"var":"giveBtn","stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","height":42,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":10,"x":2,"wordWrap":true,"width":95,"var":"btnlabel","valign":"middle","text":"赠送","strokeColor":"#d38343","stroke":3,"height":22,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"List","props":{"y":395,"x":52,"width":658,"var":"list","spaceY":10,"spaceX":15,"repeatX":5,"renderType":"render","height":377},"child":[{"type":"Box","props":{"width":658,"renderType":"render","height":377},"child":[{"type":"Box","props":{"y":-6,"x":-4},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":-6,"x":159},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":-6,"x":323},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":-6,"x":486},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":184,"x":-4},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":184,"x":159},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":184,"x":323},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]},{"type":"Box","props":{"y":184,"x":486},"child":[{"type":"Image","props":{"y":7,"x":7,"width":155,"skin":"ui_interact/img-kuang-baoxiang.png","height":178}},{"type":"Image","props":{"y":154,"x":7,"width":155,"skin":"ui_interact/img-jiagetiao.png","sizeGrid":"0,47,0,4","height":29}},{"type":"Image","props":{"y":131,"x":34,"skin":"ui_interact/img-tuo-shuliang.png"}},{"type":"Label","props":{"y":25,"x":14,"width":138,"text":"紫色品质宝箱","strokeColor":"#352f51","stroke":2,"name":"giftname","height":18,"fontSize":18,"font":"SimHei","color":"#fbffd6","align":"center"}},{"type":"Image","props":{"y":53,"x":30,"width":103,"skin":"ui_common/icon_baoxiang.png","name":"gifticon","height":88}},{"type":"Label","props":{"y":42,"x":16,"width":135,"text":"魅力 +3","strokeColor":"#352f51","stroke":2,"name":"charm","height":20,"fontSize":18,"font":"SimHei","color":"#ff50bf","bold":true,"align":"center"}},{"type":"Label","props":{"y":132,"x":85,"wordWrap":true,"width":69,"valign":"middle","text":"3","name":"giftnum","height":20,"fontSize":20,"font":"SimHei","color":"#b4acd0","align":"right"}},{"type":"Image","props":{"y":152,"x":17,"width":30,"skin":"ui_main/icon-jinbi.png","name":"gold","height":30}},{"type":"Label","props":{"y":159,"x":51,"wordWrap":true,"width":88,"valign":"middle","text":"666","strokeColor":"#4c446d","stroke":3,"name":"goldnum","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"width":170,"skin":"ui_sign/img-guangquan.png","sizeGrid":"53,36,40,30","name":"selecticon","height":191}}]}]}]},{"type":"Image","props":{"y":217,"x":633,"var":"close","skin":"ui_main/btn-guanbi.png"}},{"type":"Box","props":{"y":804,"x":338},"child":[{"type":"Image","props":{"width":18,"var":"image1","skin":"ui_interact/img-huaye2.png","height":18}},{"type":"Image","props":{"x":32,"width":18,"var":"image2","skin":"ui_interact/img-huaye2.png","height":18}},{"type":"Image","props":{"x":65,"width":18,"var":"image3","skin":"ui_interact/img-huaye2.png","height":18}},{"type":"Image","props":{"x":97,"width":18,"var":"image4","skin":"ui_interact/img-huaye2.png","height":18}},{"type":"Image","props":{"x":129,"width":18,"var":"image5","skin":"ui_interact/img-huaye2.png","height":18}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.Chat.InteractViewUI.uiView);

        }

    }
}

module ui.Chat {
    export class LinkViewUI extends View {
		public addfriend:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":80,"height":30},"child":[{"type":"Box","props":{"width":80,"scaleY":1,"scaleX":1},"child":[{"type":"Label","props":{"var":"addfriend","underline":true,"text":"加为好友","fontSize":20,"font":"SimHei","color":"#60e247","bold":true,"align":"left"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.Chat.LinkViewUI.uiView);

        }

    }
}

module ui.common {
    export class FloatViewUI extends View {
		public bgs:Laya.Box;
		public hBox:Laya.HBox;
		public clip0:Laya.Clip;
		public clip1:Laya.Clip;
		public clip2:Laya.Clip;
		public clip3:Laya.Clip;
		public clip4:Laya.Clip;
		public clip5:Laya.Clip;
		public clip6:Laya.Clip;
		public clip7:Laya.Clip;
		public clip8:Laya.Clip;
		public clip9:Laya.Clip;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Box","props":{"y":0,"var":"bgs","right":0,"left":0,"height":1200},"child":[{"type":"HBox","props":{"y":0,"x":0,"var":"hBox","scaleY":1,"scaleX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Clip","props":{"y":-36,"x":-94,"width":42,"visible":false,"var":"clip0","skin":"ui_common/img-dianji-shanghai.png","index":0,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":-52,"width":42,"visible":false,"var":"clip1","skin":"ui_common/img-dianji-shanghai.png","index":1,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":-10,"width":42,"visible":false,"var":"clip2","skin":"ui_common/img-dianji-shanghai.png","index":2,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":32,"width":42,"visible":false,"var":"clip3","skin":"ui_common/img-dianji-shanghai.png","index":3,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":74,"width":42,"visible":false,"var":"clip4","skin":"ui_common/img-dianji-shanghai.png","index":4,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":116,"width":42,"visible":false,"var":"clip5","skin":"ui_common/img-dianji-shanghai.png","index":5,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":158,"width":42,"visible":false,"var":"clip6","skin":"ui_common/img-dianji-shanghai.png","index":6,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":200,"width":42,"visible":false,"var":"clip7","skin":"ui_common/img-dianji-shanghai.png","index":7,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":242,"width":42,"visible":false,"var":"clip8","skin":"ui_common/img-dianji-shanghai.png","index":8,"height":54,"clipY":1,"clipX":10}},{"type":"Clip","props":{"y":-36,"x":284,"width":42,"visible":false,"var":"clip9","skin":"ui_common/img-dianji-shanghai.png","index":9,"height":54,"clipY":1,"clipX":10}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.common.FloatViewUI.uiView);

        }

    }
}

module ui.common {
    export class ReConnectViewUI extends View {
		public backGround:Laya.Image;
		public desc:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":false,"mouseEnabled":true,"height":1200},"child":[{"type":"Image","props":{"width":750,"var":"backGround","mouseThrough":false,"mouseEnabled":true,"height":1200},"child":[{"type":"Label","props":{"width":3000,"text":"label","mouseThrough":false,"mouseEnabled":true,"height":3000,"centerY":0,"centerX":0,"bgColor":"#000000","alpha":0.5}},{"type":"Label","props":{"y":650,"x":258,"var":"desc","valign":"middle","text":"断线重连中...","fontSize":40,"font":"SimHei","color":"#ffffff","bold":true,"align":"left"},"child":[{"type":"Animation","props":{"y":-100,"x":70,"wrapMode":"0","source":"ui_reconnect/01.png,ui_reconnect/02.png,ui_reconnect/03.png,ui_reconnect/04.png,ui_reconnect/05.png,ui_reconnect/06.png,ui_reconnect/07.png,ui_reconnect/08.png,ui_reconnect/09.png,ui_reconnect/10.png,ui_reconnect/11.png,ui_reconnect/12.png,ui_reconnect/13.png,ui_reconnect/14.png,ui_reconnect/15.png,ui_reconnect/16.png,ui_reconnect/17.png,ui_reconnect/18.png,ui_reconnect/19.png,ui_reconnect/20.png,ui_reconnect/21.png,ui_reconnect/22.png,ui_reconnect/23.png,ui_reconnect/24.png","scaleY":1.5,"scaleX":1.5,"autoPlay":true}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.common.ReConnectViewUI.uiView);

        }

    }
}

module ui.common {
    export class RewardViewUI extends View {
		public item:Laya.Image;
		public img_quality:Laya.Label;
		public img_icon:Laya.Image;
		public tx_num:Laya.Label;
		public tx_name:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":76,"height":100},"child":[{"type":"Image","props":{"y":0,"x":0,"width":76,"var":"item","skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","height":76},"child":[{"type":"Label","props":{"width":72,"var":"img_quality","height":72,"centerY":0,"centerX":0}},{"type":"Image","props":{"y":2,"x":2,"width":72,"var":"img_icon","skin":"ui_icon/icon-lihe1.png","height":72}},{"type":"Label","props":{"y":60,"x":3,"width":70,"var":"tx_num","text":"10","height":14,"fontSize":14,"font":"SimHei","color":"#f8e4dd","bold":false,"align":"right"}},{"type":"Label","props":{"y":78,"x":0,"width":80,"var":"tx_name","text":"生命增加","left":0,"height":20,"fontSize":20,"font":"SimHei","color":"#f8e4dd","bold":false,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.common.RewardViewUI.uiView);

        }

    }
}

module ui.common {
    export class SkillNameUI extends View {
		public SName:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":25,"x":40,"width":136,"var":"SName","skin":"ui_skillname/lflj.png","scaleY":1,"scaleX":1,"height":48,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.common.SkillNameUI.uiView);

        }

    }
}

module ui.common {
    export class TextDamageUI extends View {
		public sList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"text":"label","height":1200,"bgColor":"#000000","alpha":0.6}},{"type":"List","props":{"width":750,"var":"sList","spaceY":5,"mouseThrough":true,"height":1200},"child":[{"type":"Box","props":{"y":0,"x":0,"renderType":"render","mouseThrough":true},"child":[{"type":"Text","props":{"y":0,"x":0,"wordWrap":true,"width":750,"text":"hfdsikhikASHOCIHSAIOFHDSIOHFOISDAHFIOHSDIOFHOSIAHDFAOISDHFOISDAHFDSIOHFIODSHAFDOIHF","name":"tx_log","height":55,"fontSize":25,"font":"SimHei","color":"#ffffff","align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.common.TextDamageUI.uiView);

        }

    }
}

module ui.consumer {
    export class ActiveBgViewUI extends View {
		public lclbg:Laya.Image;
		public ChildBox:Laya.Box;
		public btn_close:Laya.Button;
		public top_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.5}},{"type":"Image","props":{"width":750,"var":"lclbg","skin":"ui_consumer/img-biaoqianye-bg-huodong.png","sizeGrid":"0,3,0,3","height":1166,"centerX":0},"child":[{"type":"Image","props":{"x":0,"width":750,"skin":"ui_consumer/img-jiemian-bg-zhuagnshi-huodong.png","height":978,"bottom":0}},{"type":"Box","props":{"y":206,"x":0,"var":"ChildBox"}},{"type":"Image","props":{"y":39,"x":0,"width":750,"skin":"ui_consumer/img-biaoqianye-bg-huodong.png","sizeGrid":"162,0,45,0"}},{"type":"Image","props":{"y":-1,"x":0,"width":750,"skin":"ui_consumer/img-tuanchuchuang-taitu-yunying.png"},"child":[{"type":"Button","props":{"y":2,"x":646,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png"}},{"type":"Image","props":{"y":-27,"x":14,"skin":"ui_consumer/img-taitou-zhuagnshi-yunying.png","sizeGrid":"0,43,0,111"}},{"type":"Label","props":{"y":-7,"x":87,"text":"活动","fontSize":35,"font":"SimHei","color":"#7e1e1f","align":"left"},"child":[{"type":"Label","props":{"y":-3,"x":-1,"text":"活动","strokeColor":"#feb0a7","stroke":1,"fontSize":35,"font":"SimHei","color":"#ff7869","align":"left"}}]}]},{"type":"List","props":{"y":44,"x":0,"width":750,"var":"top_list","spaceX":15,"repeatY":1,"height":147},"child":[{"type":"Box","props":{"y":7,"x":14,"width":152,"renderType":"render","height":147},"child":[{"type":"Image","props":{"y":-7,"x":-3,"skin":"ui_consumer/btn-meirichognzi-huodong.png","name":"icon"}},{"type":"Label","props":{"y":112,"x":19,"width":102,"text":"充值反馈","name":"name","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":14,"x":64,"skin":"ui_common/img-tixing.png","name":"red"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.consumer.ActiveBgViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class ChangeGoodsViewUI extends View {
		public ChangeItem_list:Laya.List;
		public say:Laya.Label;
		public times:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"List","props":{"y":60,"x":20,"width":710,"var":"ChangeItem_list","spaceY":20,"height":800},"child":[{"type":"Box","props":{"width":710,"renderType":"render","height":130},"child":[{"type":"Image","props":{"y":-0.5,"x":-0.5,"skin":"ui_consumer/img-liebiaotiao-yunying.jpg"}},{"type":"Image","props":{"y":16,"x":16,"width":72,"visible":false,"name":"itemInfo1","height":72},"child":[{"type":"Label","props":{"width":72,"name":"item_bg","height":72}},{"type":"Label","props":{"top":2,"right":2,"name":"item_pinzhi","left":2,"bottom":2}},{"type":"Image","props":{"top":2,"skin":"ui_consumer/icon-duihuan-zhu.png","right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":2,"left":2,"bottom":0}},{"type":"Label","props":{"y":75,"right":2,"name":"item_num","left":2,"height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}},{"type":"Label","props":{"y":75,"right":2,"name":"item_name","left":3,"height":20,"fontSize":20,"font":"SimHei","align":"center"}}]},{"type":"Image","props":{"y":16,"x":104,"width":72,"visible":false,"name":"itemInfo2","height":72},"child":[{"type":"Label","props":{"top":0,"right":0,"name":"item_bg","left":0,"bottom":0}},{"type":"Label","props":{"top":2,"right":2,"name":"item_pinzhi","left":2,"bottom":2}},{"type":"Image","props":{"top":2,"skin":"ui_consumer/icon-duihuan-shi.png","right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":2,"left":2,"bottom":0}},{"type":"Label","props":{"y":75,"right":2,"name":"item_num","left":2,"height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}},{"type":"Label","props":{"y":75,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}}]},{"type":"Image","props":{"y":16,"x":192,"width":72,"visible":false,"name":"itemInfo3","height":72},"child":[{"type":"Label","props":{"top":0,"right":0,"name":"item_bg","left":0,"bottom":0}},{"type":"Label","props":{"top":2,"right":2,"name":"item_pinzhi","left":2,"bottom":2}},{"type":"Image","props":{"top":2,"skin":"ui_consumer/icon-duihuan-shun.png","right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"y":20,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":2,"left":2,"bottom":0}},{"type":"Label","props":{"y":75,"right":2,"name":"item_num","left":2,"height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}},{"type":"Label","props":{"y":75,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}}]},{"type":"Image","props":{"y":16,"x":280,"width":72,"visible":false,"name":"itemInfo4","height":72},"child":[{"type":"Label","props":{"top":0,"right":0,"name":"item_bg","left":0,"bottom":0}},{"type":"Label","props":{"top":2,"right":2,"name":"item_pinzhi","left":2,"bottom":2}},{"type":"Image","props":{"top":2,"skin":"ui_consumer/icon-duihuan-li.png","right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"y":30,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":2,"left":2,"bottom":0}},{"type":"Label","props":{"y":75,"right":2,"name":"item_num","left":2,"height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}},{"type":"Label","props":{"y":75,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}}]},{"type":"Image","props":{"y":16,"x":408,"width":86,"name":"changeItem","height":86},"child":[{"type":"Label","props":{"top":0,"right":0,"name":"item_bg","left":0,"bottom":0}},{"type":"Label","props":{"top":2,"right":2,"name":"item_pinzhi","left":2,"bottom":2}},{"type":"Image","props":{"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"y":66,"skin":"ui_consumer/img-shuliang-bg.png","right":2,"left":2,"bottom":0}},{"type":"Label","props":{"y":66,"right":2,"name":"item_num","left":2,"height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"right"}},{"type":"Label","props":{"y":93,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}}]},{"type":"Button","props":{"y":68,"width":162,"right":20,"name":"man","mouseThrough":true,"height":70,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":35,"x":81,"stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"Btn_change","labelSize":22,"labelPadding":"0,0,10,0","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"兑换","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":53,"x":82,"width":160,"name":"item_ChangetImes","height":20,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":35,"x":81,"visible":false,"top":0,"text":"已兑完","right":0,"padding":"15,","name":"Changed","left":0,"fontSize":35,"font":"SimHei","color":"#5f2904","bottom":0,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]},{"type":"Image","props":{"y":20,"x":368,"skin":"ui_consumer/img-jiantou-tongyong.png"}}]}]},{"type":"Label","props":{"y":20,"x":20,"var":"say","fontSize":20,"font":"SimHei","color":"#826c95","align":"center"}},{"type":"Label","props":{"y":18,"x":497,"var":"times","fontSize":20,"font":"SimHei","color":"#826c95","align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.consumer.ChangeGoodsViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class DiamondViewUI extends View {
		public Other:Laya.Label;
		public D_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"List","props":{"y":0,"x":52.5,"width":645,"var":"D_list","spaceY":20,"height":733},"child":[{"type":"Box","props":{"y":30,"x":0,"width":646,"renderType":"render","height":171},"child":[{"type":"Image","props":{"y":30,"skin":"ui_consumer/img-liebiaotiao-yunying.jpg","right":0,"left":0},"child":[{"type":"Image","props":{"y":-30,"skin":"ui_consumer/img-liebiaotiao-yunying-titep.jpg","right":0,"left":0}}]},{"type":"HTMLDivElement","props":{"y":5,"x":7,"width":612,"name":"D_say","innerHTML":"htmlText","height":30}},{"type":"Button","props":{"y":94,"x":550,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","name":"btn_receive","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"领取","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":63,"x":481,"visible":false,"skin":"ui_consumer/img-yilingqu-yunying.png","name":"reced"}},{"type":"Label","props":{"y":55,"x":25,"width":76,"name":"item_icon1","height":76},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":131,"width":76,"name":"item_icon2","height":76},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":237,"width":76,"name":"item_icon3","height":76},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":343,"width":76,"visible":false,"name":"item_icon4","height":76},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":18,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.consumer.DiamondViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class EverydayMoneyViewUI extends View {
		public say:Laya.Label;
		public showmoney:Laya.Label;
		public lay_outlist:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":20,"x":19,"var":"say","fontSize":20,"font":"SimHei","color":"#9e8eac","align":"left"}},{"type":"Label","props":{"y":20,"x":408,"width":326,"visible":false,"var":"showmoney","text":"今日已充值:0/60","height":26,"fontSize":26,"font":"SimHei","color":"#9e8eac","align":"right"}},{"type":"List","props":{"y":56,"x":18,"width":714,"var":"lay_outlist","spaceY":20,"repeatX":1,"height":855},"child":[{"type":"Box","props":{"y":0,"width":646,"renderType":"render","height":171,"centerX":0},"child":[{"type":"Image","props":{"skin":"ui_consumer/img-liebiaotiao-yunying-titep.jpg","right":0,"left":0},"child":[{"type":"Image","props":{"y":30,"skin":"ui_consumer/img-liebiaotiao-yunying.jpg","right":0,"left":0}}]},{"type":"HTMLDivElement","props":{"y":5,"x":7,"width":612,"name":"D_say","innerHTML":"htmlText","height":30}},{"type":"Button","props":{"y":94,"x":550,"width":162,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","name":"btn_isgo","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"充值","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":63,"x":481,"visible":false,"skin":"ui_consumer/img-yilingqu-yunying.png","name":"reced"}},{"type":"Label","props":{"y":55,"x":25,"width":76,"visible":false,"name":"item_icon1","height":76},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":131,"width":76,"visible":false,"name":"item_icon2","height":76},"child":[{"type":"Label","props":{"y":2,"x":2,"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":237,"width":76,"visible":false,"name":"item_icon3","height":76},"child":[{"type":"Label","props":{"y":2,"x":2,"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]},{"type":"Label","props":{"y":55,"x":343,"width":76,"name":"item_icon4","height":76},"child":[{"type":"Label","props":{"y":-53,"x":-341,"top":2,"right":2,"name":"bg","left":2,"bottom":2}},{"type":"Image","props":{"y":78,"x":20,"top":2,"right":2,"name":"item_icon","left":2,"bottom":2}},{"type":"Label","props":{"y":82,"right":2,"name":"item_name","left":2,"height":20,"fontSize":20,"font":"SimHei"}},{"type":"Image","props":{"y":56,"x":0,"visible":false,"skin":"ui_consumer/img-shuliang-bg.png","right":0,"name":"bg-img","left":0,"bottom":0}},{"type":"Label","props":{"right":0,"name":"item_num","fontSize":20,"font":"SimHei","color":"#d7e0ea","bottom":0,"align":"right"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.consumer.EverydayMoneyViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class EveryDayTurnTableUI extends View {
		public titlestr:Laya.Label;
		public timeDelay:Laya.Label;
		public zhizhenImg:Laya.Image;
		public xuanxiangImg:Laya.Image;
		public Img1:Laya.Image;
		public numLab1:Laya.Label;
		public Img2:Laya.Image;
		public numLab2:Laya.Label;
		public Img3:Laya.Image;
		public numLab3:Laya.Label;
		public Img4:Laya.Image;
		public numLab4:Laya.Label;
		public Img5:Laya.Image;
		public numLab5:Laya.Label;
		public Img6:Laya.Image;
		public numLab6:Laya.Label;
		public Img7:Laya.Image;
		public numLab7:Laya.Label;
		public Img8:Laya.Image;
		public numLab8:Laya.Label;
		public Img9:Laya.Image;
		public numLab9:Laya.Label;
		public Img10:Laya.Image;
		public numLab10:Laya.Label;
		public turnTenBtn:Laya.Button;
		public tenNeedNum:Laya.Label;
		public turnOneBtn:Laya.Button;
		public turnOneLab:Laya.Label;
		public diamond1:Laya.Image;
		public oneNeedNum:Laya.Label;
		public turnNumLab:Laya.Label;
		public recordBtn:Laya.Label;
		public box1:Laya.Image;
		public boxRed1:Laya.Image;
		public box2:Laya.Image;
		public boxRed2:Laya.Image;
		public box3:Laya.Image;
		public boxRed3:Laya.Image;
		public box4:Laya.Image;
		public boxRed4:Laya.Image;
		public box5:Laya.Image;
		public boxRed5:Laya.Image;
		public progressBox:Laya.Box;
		public progressBg:Laya.Image;
		public progressBar:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":960},"child":[{"type":"Box","props":{"y":2,"x":20},"child":[{"type":"Label","props":{"y":24,"x":0,"var":"titlestr","text":"1.多次连抽\\n可享9折优惠","strokeColor":"#13272f","fontSize":20,"font":"SimHei","color":"#826c95","align":"left"}},{"type":"Label","props":{"y":65,"x":0,"text":"距离活动结束","strokeColor":"#13272f","name":"time","fontSize":20,"font":"SimHei","color":"#826c95","align":"left"},"child":[{"type":"Label","props":{"y":0,"x":126,"var":"timeDelay","text":"10时","strokeColor":"#13272f","name":"time","fontSize":20,"font":"SimHei","color":"#826c95","align":"left"}}]},{"type":"Image","props":{"y":105,"x":36,"skin":"ui_consumer/img-zhuanpan-be-huoidong.png","name":"tubg"},"child":[{"type":"Image","props":{"y":339,"x":321,"width":138,"var":"zhizhenImg","skin":"ui_consumer/img-zhuanpan-zhizhen-huoidong.png","pivotY":103,"pivotX":69,"height":170}},{"type":"Image","props":{"y":339,"x":321,"width":166,"var":"xuanxiangImg","skin":"ui_consumer/zhuanpanxz.png","pivotY":256,"pivotX":84,"height":222}},{"type":"Box","props":{"y":79,"x":48,"width":550,"height":550},"child":[{"type":"Box","props":{"y":47,"x":228,"width":95,"name":"1","height":115},"child":[{"type":"Image","props":{"y":42,"x":44,"width":70,"var":"Img1","skin":"ui_common/icon_prop_012.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":57,"x":1,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":89,"var":"numLab1","text":12,"strokeColor":"#000000","right":10,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":40,"align":"center"}}]},{"type":"Box","props":{"y":79,"x":331,"width":95,"name":"2","height":115},"child":[{"type":"Image","props":{"y":43,"x":37,"width":70,"var":"Img2","skin":"ui_icon/icon_baoxiang_1.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":56,"x":-8,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":82,"var":"numLab2","text":12,"strokeColor":"#000000","right":20,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":40,"align":"center"}}]},{"type":"Box","props":{"y":167,"x":389,"width":95,"name":"3","height":115},"child":[{"type":"Image","props":{"y":47,"x":43,"width":70,"var":"Img3","skin":"ui_icon/icon_baoxiang_2.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":58,"x":-4,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":84,"var":"numLab3","text":12,"strokeColor":"#000000","right":14,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":38,"align":"center"}}]},{"type":"Box","props":{"y":266,"x":390,"width":95,"name":"4","height":88},"child":[{"type":"Image","props":{"y":40,"x":40,"width":70,"var":"Img4","skin":"ui_icon/icon_baoxiang_3.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":50,"x":-5,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":82,"var":"numLab4","text":12,"strokeColor":"#000000","right":18,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":19,"align":"center"}}]},{"type":"Box","props":{"y":342,"x":321,"width":95,"name":"5","height":115},"child":[{"type":"Image","props":{"y":44,"x":46,"width":70,"var":"Img5","skin":"ui_icon/icon_baoxiang_4.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":54,"x":5,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":89,"var":"numLab5","text":12,"strokeColor":"#000000","right":4,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":42,"align":"center"}}]},{"type":"Box","props":{"y":369,"x":225,"width":95,"name":"6","height":115},"child":[{"type":"Image","props":{"y":5,"x":11,"width":70,"var":"Img6","skin":"ui_icon/icon_lanzuan.png","name":"bgImg","height":70}},{"type":"Image","props":{"y":66,"x":6,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":89,"var":"numLab6","text":12,"strokeColor":"#000000","right":2,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":31,"align":"center"}}]},{"type":"Box","props":{"y":351,"x":125,"width":95,"name":"7","height":115},"child":[{"type":"Image","props":{"y":33,"x":53,"width":70,"var":"Img7","skin":"ui_icon/icon_baoxiang_4.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":50,"x":9,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":89,"var":"numLab7","text":12,"strokeColor":"#000000","right":-1,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":46,"align":"center"}}]},{"type":"Box","props":{"y":269,"x":74,"width":93,"name":"8","height":71},"child":[{"type":"Image","props":{"y":-1,"x":9,"width":70,"var":"Img8","skin":"ui_icon/icon_baoxiang_3.png","name":"bgImg","height":70}},{"type":"Image","props":{"y":47,"x":4,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"y":48,"x":0,"width":89,"var":"numLab8","text":12,"strokeColor":"#000000","name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":169,"x":71,"width":97,"name":"9","height":81},"child":[{"type":"Image","props":{"y":38,"x":44,"width":70,"var":"Img9","skin":"ui_icon/icon_baoxiang_2.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":56,"x":3,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"y":57,"x":0,"width":89,"var":"numLab9","text":12,"strokeColor":"#000000","name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","align":"center"}}]},{"type":"Box","props":{"y":77,"x":124,"width":95,"name":"10","height":115},"child":[{"type":"Image","props":{"y":40,"x":56,"width":70,"var":"Img10","skin":"ui_icon/icon-zuanshi1.png","name":"bgImg","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":58,"x":12,"skin":"ui_consumer/img-shuliang-bg.png","height":20}},{"type":"Label","props":{"width":89,"var":"numLab10","text":12,"strokeColor":"#000000","right":-4,"name":"num","height":18,"fontSize":20,"font":"SimHei","color":"#ffffff","bottom":38,"align":"center"}}]}]}]},{"type":"Button","props":{"y":786,"x":518,"var":"turnTenBtn","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelBold":true,"labelAlign":"center","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":29,"x":3,"width":155,"text":"十连抽","strokeColor":"#872d09","stroke":3,"mouseThrough":true,"height":28,"fontSize":28,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":25,"x":157,"width":154,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","scaleY":-1,"scaleX":-1,"height":22}},{"type":"Image","props":{"y":5,"x":29,"skin":"ui_icon/icon_prop_013.png","scaleY":0.3,"scaleX":0.3}},{"type":"Label","props":{"y":6,"x":63,"var":"tenNeedNum","text":"123456","fontSize":19,"font":"SimHei","color":"#ffcb47"}}]},{"type":"Button","props":{"y":786,"x":191,"var":"turnOneBtn","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelBold":true,"labelAlign":"center","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":29,"x":3,"width":155,"var":"turnOneLab","text":"抽一次","strokeColor":"#872d09","stroke":3,"mouseThrough":true,"height":28,"fontSize":28,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":25,"x":157,"width":154,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","scaleY":-1,"scaleX":-1,"height":22}},{"type":"Image","props":{"y":5,"x":29,"var":"diamond1","skin":"ui_icon/icon_prop_013.png","scaleY":0.3,"scaleX":0.3}},{"type":"Label","props":{"y":6,"x":63,"var":"oneNeedNum","text":"123456","fontSize":19,"font":"SimHei","color":"#ffcb47"}}]},{"type":"Label","props":{"y":778,"x":13,"visible":false,"text":"累积抽奖次数:","name":"heapNum","fontSize":26,"font":"SimHei","color":"#9e8eac","bold":true,"align":"left"},"child":[{"type":"Label","props":{"y":0,"x":184,"var":"turnNumLab","text":"0","fontSize":26,"font":"SimHei","color":"#9e8eac","bold":true,"align":"left"}}]},{"type":"Label","props":{"y":22,"x":621,"var":"recordBtn","underline":true,"text":"抽奖记录","fontSize":22,"font":"SimHei","color":"#b0ff9d","align":"left"}},{"type":"Box","props":{"y":814,"x":1,"visible":false},"child":[{"type":"Image","props":{"width":710,"visible":false,"skin":"ui_common/img-lanzituo-tongyong.png","name":"dbg","height":124},"child":[{"type":"Image","props":{"y":40,"x":80,"skin":"ui_common/img-huawen2.png","scaleX":-1}}]},{"type":"Box","props":{"y":5,"x":61,"name":"box"},"child":[{"type":"Image","props":{"y":2,"var":"box1","skin":"ui_icon/icon_baoxiang_1.png"},"child":[{"type":"Image","props":{"y":3,"x":52,"var":"boxRed1","skin":"ui_common/img-tixing.png","scaleY":0.8,"scaleX":0.8,"name":"boxRed"}}]},{"type":"Image","props":{"x":172,"var":"box2","skin":"ui_icon/icon_baoxiang_2.png"},"child":[{"type":"Image","props":{"y":5,"x":52,"var":"boxRed2","skin":"ui_common/img-tixing.png","scaleY":0.8,"scaleX":0.8}}]},{"type":"Image","props":{"y":0,"x":289,"var":"box3","skin":"ui_icon/icon_baoxiang_3.png"},"child":[{"type":"Image","props":{"y":4,"x":51,"var":"boxRed3","skin":"ui_common/img-tixing.png","scaleY":0.8,"scaleX":0.8}}]},{"type":"Image","props":{"y":-2,"x":436,"var":"box4","skin":"ui_icon/icon_baoxiang_hong.png"},"child":[{"type":"Image","props":{"y":6,"x":53,"var":"boxRed4","skin":"ui_common/img-tixing.png","scaleY":0.8,"scaleX":0.8}}]},{"type":"Image","props":{"y":-3,"x":557,"var":"box5","skin":"ui_icon/icon_baoxiang_4.png"},"child":[{"type":"Image","props":{"y":7,"x":52,"var":"boxRed5","skin":"ui_common/img-tixing.png","scaleY":0.8,"scaleX":0.8}}]}]},{"type":"Box","props":{"y":76,"x":53,"var":"progressBox"},"child":[{"type":"Image","props":{"y":-2,"x":1,"width":603,"var":"progressBg","skin":"ui_main/img-taitou-jinenghuifutuo-jindutiao.png","sizeGrid":"0,15,0,15","name":"slider_bg","height":18}},{"type":"Image","props":{"y":0,"x":2,"width":600,"var":"progressBar","skin":"ui_hero/img-taitou-jinenghuifu-jindutiao.png","sizeGrid":"0,3,0,3","height":14},"child":[{"type":"Image","props":{"y":-1,"x":41,"width":2,"skin":"ui_consumer/img-shuliang-bg.png","name":"1","height":17}},{"type":"Image","props":{"y":-1,"x":215,"width":2,"skin":"ui_consumer/img-shuliang-bg.png","name":"2","height":17}},{"type":"Image","props":{"y":-1,"x":332,"width":2,"skin":"ui_consumer/img-shuliang-bg.png","name":"3","height":17}},{"type":"Image","props":{"y":-1,"x":475,"width":2,"skin":"ui_consumer/img-shuliang-bg.png","name":"4","height":17}},{"type":"Image","props":{"y":-1,"x":596,"width":2,"skin":"ui_consumer/img-shuliang-bg.png","name":"5","height":17}}]}]},{"type":"Box","props":{"y":93,"x":67},"child":[{"type":"Image","props":{"width":60,"skin":"ui_consumer/img-shuliang-bg.png","height":24},"child":[{"type":"Label","props":{"y":3,"x":17,"text":"5次","fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"x":173,"width":60,"skin":"ui_consumer/img-shuliang-bg.png","height":24},"child":[{"type":"Label","props":{"y":3,"x":13,"text":"10次","fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"x":291,"width":60,"skin":"ui_consumer/img-shuliang-bg.png","height":24},"child":[{"type":"Label","props":{"y":3,"x":13,"text":"50次","fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"x":434,"width":60,"skin":"ui_consumer/img-shuliang-bg.png","height":24},"child":[{"type":"Label","props":{"y":3,"x":13,"text":"70次","fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"x":555,"width":60,"skin":"ui_consumer/img-shuliang-bg.png","height":24},"child":[{"type":"Label","props":{"y":4,"x":8,"text":"100次","fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.consumer.EveryDayTurnTableUI.uiView);

        }

    }
}

module ui.consumer {
    export class HeroStarPeckViewUI extends View {
		public tipsicon:Laya.Image;
		public Btn_close:Laya.Button;
		public List_peck:Laya.List;
		public List_peck_:Laya.List;
		public ListPeck_noM:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200,"centerX":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":0,"x":0,"width":750,"skin":"ui_consumer/img-biaoqianye-bg-huodong.png","sizeGrid":"0,3,0,3","height":1200,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":13,"width":180,"var":"tipsicon","skin":"ui_consumer/img-taitou-zhuagnshi-yunying.png","sizeGrid":"0,43,0,111","height":96},"child":[{"type":"Label","props":{"y":29,"x":76,"text":"英雄进阶礼包","fontSize":35,"font":"SimHei","color":"#7e1e1f","align":"left"},"child":[{"type":"Label","props":{"y":-3,"x":-1,"text":"英雄进阶礼包","strokeColor":"#feb0a7","stroke":1,"fontSize":35,"font":"SimHei","color":"#ff7869","align":"left"}}]}]},{"type":"Button","props":{"y":1,"x":643,"var":"Btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png"}},{"type":"List","props":{"y":84,"x":21,"width":707,"visible":false,"var":"List_peck","spaceY":10,"height":1079},"child":[{"type":"Box","props":{"y":0,"x":0,"width":718,"renderType":"render","height":612},"child":[{"type":"Label","props":{"y":10,"width":376,"name":"Shop_time","height":32,"fontSize":26,"font":"SimHei","color":"#9e8eac","centerX":0.5,"align":"left"}},{"type":"Image","props":{"y":63,"x":2,"width":343,"skin":"ui_consumer/img-kaung-meirichognzi-huodong.png","name":"hero_d","height":551},"child":[{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_pinzhi","height":374}},{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_icon_d","height":374}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-zhekou-bg-shangcheng.png"}},{"type":"Label","props":{"y":17,"x":17,"width":46,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":17,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":7,"x":104,"width":155,"name":"hero_name","height":40,"fontSize":23,"font":"SimHei","color":"#ff7f77","align":"center"}},{"type":"Label","props":{"y":410,"x":274,"text":"ASD","name":"hero_num_D","fontSize":22,"font":"SimHei","color":"#C0C7DE","bold":true,"align":"left"}},{"type":"HTMLDivElement","props":{"y":449,"x":110,"width":124,"name":"old_price","innerHTML":"htmlText","height":34}},{"type":"Button","props":{"y":508,"x":173,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_buy","anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":8,"x":0,"width":124,"name":"new_price","height":40}}]},{"type":"Label","props":{"y":456,"x":127,"width":100,"rotation":10,"name":"line","height":4,"bgColor":"#ff0400"}}]},{"type":"Image","props":{"y":59,"x":369,"width":340,"skin":"ui_consumer/img-kaung-meirichognzi-huodong.png","name":"hero_m","height":553},"child":[{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_pinzhi","height":374}},{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_icon_d","height":374}},{"type":"HTMLDivElement","props":{"y":455,"x":107,"width":124,"name":"new_price","height":35}},{"type":"Label","props":{"y":461,"x":124,"width":100,"rotation":10,"name":"line","height":4,"bgColor":"#ff0400"}},{"type":"Button","props":{"y":512,"x":170,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_buy","labelSize":25,"labelFont":"SimHei","labelColors":"#fdcbad","labelAlign":"center","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-zhekou-bg-shangcheng.png"}},{"type":"Label","props":{"y":17,"x":17,"width":46,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":17,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":7,"x":104,"width":155,"name":"hero_name","height":40,"fontSize":25,"font":"SimHei","color":"#ff7f77","align":"center"}},{"type":"Label","props":{"y":415,"x":270,"name":"hero_num_M","fontSize":22,"font":"SimHei","color":"#C0C7DE","bold":true,"align":"left"}}]}]}]},{"type":"List","props":{"y":84,"x":21,"width":707,"visible":false,"var":"List_peck_","spaceY":10,"height":1079},"child":[{"type":"Box","props":{"y":0,"x":0,"width":352,"renderType":"render","height":612},"child":[{"type":"Image","props":{"y":63,"x":2,"width":343,"skin":"ui_consumer/img-kaung-meirichognzi-huodong.png","name":"hero_d","height":551},"child":[{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_pinzhi","height":374}},{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_icon_d","height":374}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-zhekou-bg-shangcheng.png"}},{"type":"Label","props":{"y":17,"x":17,"width":46,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":17,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":7,"x":104,"width":155,"name":"hero_name","height":40,"fontSize":23,"font":"SimHei","color":"#ff7f77","align":"center"}},{"type":"Label","props":{"y":410,"x":274,"text":"ASD","name":"hero_num_D","fontSize":22,"font":"SimHei","color":"#C0C7DE","bold":true,"align":"left"}},{"type":"HTMLDivElement","props":{"y":446,"x":29,"width":287,"name":"old_price","innerHTML":"htmlText","height":34}},{"type":"Button","props":{"y":508,"x":173,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_buy","anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":8,"x":0,"width":124,"name":"new_price","height":40}}]},{"type":"Label","props":{"y":456,"x":127,"width":100,"rotation":10,"name":"line","height":4,"bgColor":"#ff0400"}}]},{"type":"Image","props":{"y":160,"x":175,"visible":false,"skin":"ui_wroldboss/img-yigoumai-shijieboss.png","name":"buyend"}},{"type":"Label","props":{"y":110,"x":-12,"width":376,"name":"Shop_time","height":32,"fontSize":18,"font":"SimHei","color":"#9e8eac","centerX":0,"align":"center"}}]}]},{"type":"List","props":{"y":84,"x":21,"width":707,"visible":false,"var":"ListPeck_noM","spaceY":10,"height":1079},"child":[{"type":"Box","props":{"y":0,"x":0,"width":352,"renderType":"render","height":612},"child":[{"type":"Image","props":{"y":63,"x":2,"width":343,"skin":"ui_consumer/img-kaung-meirichognzi-huodong.png","name":"hero_d","height":551},"child":[{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_pinzhi","height":374}},{"type":"Image","props":{"y":71,"x":26,"width":290,"name":"hero_icon_d","height":374}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-zhekou-bg-shangcheng.png"}},{"type":"Label","props":{"y":17,"x":17,"width":46,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":17,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":7,"x":104,"width":155,"name":"hero_name","height":40,"fontSize":23,"font":"SimHei","color":"#ff7f77","align":"center"}},{"type":"Label","props":{"y":410,"x":274,"text":"ASD","name":"hero_num_D","fontSize":22,"font":"SimHei","color":"#C0C7DE","bold":true,"align":"left"}},{"type":"HTMLDivElement","props":{"y":446,"x":29,"width":287,"name":"old_price","innerHTML":"htmlText","height":34}},{"type":"Button","props":{"y":508,"x":173,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"Btn_buy","anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":8,"x":0,"width":124,"name":"new_price","height":40}}]},{"type":"Label","props":{"y":456,"x":127,"width":100,"rotation":10,"name":"line","height":4,"bgColor":"#ff0400"}}]},{"type":"Label","props":{"y":110,"x":166,"width":376,"name":"Shop_time","height":32,"fontSize":18,"font":"SimHei","color":"#9e8eac","centerX":0,"align":"center"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.consumer.HeroStarPeckViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class MoerGameViewUI extends View {
		public other:Laya.Label;
		public btn_close:Laya.Button;
		public tatil_tx:Laya.Label;
		public game_tank:Laya.Button;
		public tank_name:Laya.Label;
		public game_pet:Laya.Button;
		public pet_name:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":203,"x":96,"width":586,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"0,0,19,0","height":360},"child":[{"type":"Label","props":{"y":0,"x":0,"width":586,"height":50,"centerX":0,"bgColor":"#1b2838"},"child":[{"type":"Button","props":{"x":479,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}},{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":41,"var":"tatil_tx","text":"更多游戏","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}}]},{"type":"Label","props":{"y":59,"x":11,"width":566,"height":288,"bgColor":"#34354b"}},{"type":"Button","props":{"y":185,"x":427,"var":"game_tank","stateNum":1,"skin":"ui_wroldboss/icon-tanke.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":208,"x":39,"var":"tank_name","text":"坦克大战","fontSize":30,"font":"SimHei","color":"#ffffff"}}]},{"type":"Button","props":{"y":183,"x":160,"var":"game_pet","stateNum":1,"skin":"ui_wroldboss/icon-mengchong.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":210,"x":10,"var":"pet_name","text":"天天欢乐萌宠","fontSize":30,"font":"SimHei","color":"#ffffff"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.consumer.MoerGameViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class MoneybackViewUI extends View {
		public Other:Laya.Label;
		public btn_close:Laya.Button;
		public m_backlist:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":662,"skin":"ui_consumer/img-biaoqianye-bg-huodong.png","sizeGrid":"0,3,0,3","height":820,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":662,"skin":"ui_consumer/img-jiemian-bg-zhuagnshi-huodong.png","height":820}},{"type":"Image","props":{"y":0,"x":0,"width":662,"skin":"ui_consumer/img-tuanchuchuang-taitu-yunying.png","centerX":0},"child":[{"type":"Image","props":{"y":-35,"x":5,"width":180,"skin":"ui_consumer/img-taitou-zhuagnshi-yunying.png","sizeGrid":"0,43,0,111","height":96},"child":[{"type":"Label","props":{"y":29,"x":76,"text":"充值反馈","fontSize":35,"font":"SimHei","color":"#7e1e1f","align":"left"},"child":[{"type":"Label","props":{"y":-3,"x":-1,"text":"充值反馈","strokeColor":"#feb0a7","stroke":1,"fontSize":35,"font":"SimHei","color":"#ff7869","align":"left"}}]}]},{"type":"Button","props":{"y":1,"x":594,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","height":41}}]},{"type":"List","props":{"y":61,"x":14,"width":635,"var":"m_backlist","spaceY":20,"height":620},"child":[{"type":"Box","props":{"width":646,"renderType":"render","height":171},"child":[{"type":"Image","props":{"y":0,"skin":"ui_consumer/img-liebiaotiao-yunying-titep.jpg","right":0,"left":0},"child":[{"type":"Image","props":{"y":30,"skin":"ui_consumer/img-liebiaotiao-yunying.jpg","right":0,"left":0}}]},{"type":"Button","props":{"y":91,"x":544,"width":162,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","name":"btn_isgo","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"前往","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":7,"x":8,"width":477,"name":"M_say","innerHTML":"htmlText","height":20}},{"type":"Image","props":{"y":44,"x":18,"width":84,"skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","name":"item_bg1","height":84},"child":[{"type":"Label","props":{"y":88,"x":6,"width":76,"name":"item_name","height":21,"fontSize":20,"font":"SimHei","align":"center"}},{"type":"Label","props":{"top":3,"right":3,"name":"bg","left":3,"bottom":3}},{"type":"Image","props":{"x":4,"width":76,"skin":"ui_icon/icon_prop_007.png","pivotX":0,"name":"item_icon1","height":76,"centerY":0,"centerX":0}}]},{"type":"Image","props":{"y":91,"x":544,"visible":false,"skin":"ui_consumer/img-yilingqu-yunying.png","name":"lab_text","anchorY":0.5,"anchorX":0.5}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.consumer.MoneybackViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class RecordListViewUI extends View {
		public Btn_close:Laya.Button;
		public rewardList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":193,"x":85,"width":586,"height":760,"bgColor":"#c2c1ca","alpha":1},"child":[{"type":"Image","props":{"y":71,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":99,"text":"抽奖记录","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Button","props":{"y":21,"x":546,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":20,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"List","props":{"y":261,"x":97,"width":566,"var":"rewardList","vScrollBarSkin":" ","spaceY":8,"repeatX":1,"height":666},"child":[{"type":"Box","props":{"y":0,"x":6,"width":555,"renderType":"render","height":97},"child":[{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"bjIcon","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_icon/icon_prop_005.png","name":"boxProImg","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":65,"x":1,"width":82,"visible":false,"height":20,"bgColor":"#000000","alpha":0.3}},{"type":"Label","props":{"y":64,"x":5,"width":75,"visible":false,"text":"99","name":"boxProNum","height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","bold":true,"align":"right"}},{"type":"Label","props":{"y":0,"x":103,"width":84,"text":"钻石","strokeColor":"#1c1c1c","stroke":1,"name":"boxProName","height":24,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"left"}},{"type":"Label","props":{"y":29,"x":106,"text":"2018年12月10日1:10:10获得","name":"describeLab","fontSize":18,"font":"SimHei","color":"#202020"}},{"type":"Label","props":{"y":94,"x":-5,"width":560,"height":1,"bgColor":"#6b6b6b","alpha":0.8}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.consumer.RecordListViewUI.uiView);

        }

    }
}

module ui.consumer {
    export class TipsRewardViewUI extends View {
		public bj:Laya.Image;
		public bj_2:Laya.Image;
		public ExitBtn:Laya.Button;
		public ExitLab:Laya.Label;
		public boxBox:Laya.Box;
		public boxList:Laya.List;
		public describe:Laya.Label;
		public tipName:laya.display.Text;
		public close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.4}},{"type":"Image","props":{"width":586,"var":"bj","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"19,10,10,10","height":500,"centerY":9,"centerX":1,"anchorY":0.5,"anchorX":0.5,"alpha":1},"child":[{"type":"Image","props":{"y":361,"width":568,"visible":false,"var":"bj_2","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"46,1,1,1","height":353,"centerX":0,"anchorY":1,"anchorX":1},"child":[{"type":"Label","props":{"y":353,"x":0,"width":568,"height":1,"bgColor":"#8185A7"}}]},{"type":"Button","props":{"y":430,"x":295,"var":"ExitBtn","stateNum":1,"skin":"ui_common/btn-huodong-p.png","sizeGrid":"20,20,20,20","name":"boxBuy","labelStrokeColor":"#e5fff3","labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","labelBold":true,"labelAlign":"center","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":20,"x":0,"width":160,"var":"ExitLab","valign":"middle","text":"退出","strokeColor":"#a65e5d","height":30,"fontSize":25,"font":"SimHei","color":"#6b3b24","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":0,"x":0,"width":547,"var":"boxBox","height":345},"child":[{"type":"List","props":{"y":83,"x":72,"width":442,"var":"boxList","vScrollBarSkin":" ","spaceY":10,"spaceX":35,"repeatY":2,"repeatX":4,"name":"boxList","height":250},"child":[{"type":"Box","props":{"y":4,"x":0,"width":84,"renderType":"render","height":124},"child":[{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"bjIcon","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_icon/icon_prop_005.png","name":"boxProImg","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":1,"width":82,"height":20,"bottom":41,"bgColor":"#000000","alpha":0.3}},{"type":"Label","props":{"y":64,"x":5,"width":75,"text":"99","name":"boxProNum","height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","bold":true,"align":"right"}},{"type":"Label","props":{"y":88,"x":0,"width":84,"text":"name","name":"boxProName","height":24,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]}]},{"type":"Label","props":{"y":20,"x":22,"width":192,"var":"describe","text":"阿斯达","height":27,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}}]},{"type":"Label","props":{"y":-40,"x":0,"width":586,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Text","props":{"y":12,"x":47,"width":514,"var":"tipName","text":"输入Tip名字","strokeColor":"#50560c","name":"tipName","height":28,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":true,"align":"left"}},{"type":"Button","props":{"var":"close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":30,"name":"close","centerY":0}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.consumer.TipsRewardViewUI.uiView);

        }

    }
}

module ui.Equep {
    export class EquipTipsUI extends View {
		public Other:Laya.Label;
		public btn_close:Laya.Button;
		public E_pinzhi:Laya.Image;
		public E_icon:Laya.Image;
		public E_name:Laya.Label;
		public E_lv:laya.html.dom.HTMLDivElement;
		public btn_use:Laya.Button;
		public btn_price:Laya.Button;
		public price_num:laya.html.dom.HTMLDivElement;
		public E_base2:laya.html.dom.HTMLDivElement;
		public E_base1:laya.html.dom.HTMLDivElement;
		public btn_lock:Laya.Button;
		public E_lock:Laya.Image;
		public used:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":586,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,15,15,0","height":417,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":-1,"x":0,"width":587,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":43,"text":"法器详情","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Button","props":{"x":480,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}}]},{"type":"Image","props":{"y":59,"x":20,"width":84,"var":"E_pinzhi","skin":"ui_hero/img-lanpingzhilkuang.png","height":84},"child":[{"type":"Image","props":{"y":0,"x":0,"width":84,"var":"E_icon","height":84}}]},{"type":"Label","props":{"y":59,"x":126,"width":115,"var":"E_name","height":24,"fontSize":20,"align":"left"}},{"type":"HTMLDivElement","props":{"y":86,"x":126,"width":115,"var":"E_lv","innerHTML":"htmlText","height":24}},{"type":"Button","props":{"y":317,"x":82,"var":"btn_use","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","label":"佩戴"}},{"type":"Button","props":{"y":317,"x":330,"var":"btn_price","stateNum":1,"skin":"ui_action/btn-huodong-p.png","labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"出售"},"child":[{"type":"HTMLDivElement","props":{"y":43,"x":3,"width":158,"var":"price_num","innerHTML":"htmlText","height":22}}]},{"type":"Label","props":{"y":165,"x":10,"width":567,"height":120,"bgColor":"#2c2d45"},"child":[{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":0,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":84,"pivotX":40,"alpha":0.2}},{"type":"HTMLDivElement","props":{"y":47,"x":19,"width":200,"var":"E_base2","height":37}},{"type":"HTMLDivElement","props":{"y":15,"x":19,"width":392,"var":"E_base1","innerHTML":"htmlText","height":37}}]},{"type":"Image","props":{"y":40,"skin":"ui_common/img-huawen1.png","skewY":180,"right":-322}},{"type":"Button","props":{"y":105,"x":521,"width":70,"var":"btn_lock","height":82,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"E_lock","skin":"ui_equip/btn-suoding-faqi.png"}}]},{"type":"Label","props":{"y":336,"x":109,"visible":false,"var":"used","text":"已装备","fontSize":28,"font":"SimHei","color":"#d38343","bold":true,"align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.Equep.EquipTipsUI.uiView);

        }

    }
}

module ui.Equep {
    export class MakeEquipViewUI extends View {
		public Other:Laya.Label;
		public M_help:Laya.Image;
		public btn_close:Laya.Button;
		public btn_1:Laya.Button;
		public left1:Laya.Image;
		public img1:Laya.Image;
		public btn_name1:Laya.Label;
		public btn_2:Laya.Button;
		public img2:Laya.Image;
		public btn_name2:Laya.Label;
		public btn_3:Laya.Button;
		public img3:Laya.Image;
		public btn_name3:Laya.Label;
		public my_num:laya.html.dom.HTMLDivElement;
		public E_suitList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"var":"Other","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":64,"x":25,"width":700,"height":948}},{"type":"Image","props":{"width":700,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"10,15,15,0","height":948,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":20,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":43,"text":"工艺","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"align":"left"}},{"type":"Image","props":{"x":97,"var":"M_help","skin":"ui_action/btn-xiangqing-huodong.png","centerY":0}},{"type":"Button","props":{"x":637,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}}]},{"type":"Label","props":{"y":57,"x":0,"width":700,"height":60,"bgColor":"#2c2129","alpha":0.7},"child":[{"type":"Button","props":{"y":35,"x":70,"width":120,"var":"btn_1","height":45,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":24,"x":14,"width":38,"var":"left1","skin":"ui_rank/img-zi-xuan.png","sizeGrid":"-3,-4,0,3","height":45,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":24,"x":72,"width":148,"var":"img1","skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,35,0,35","rotation":0,"height":45,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"var":"btn_name1","text":"五福","fontSize":26,"font":"SimHei","color":"#eff8bb","centerY":0,"centerX":0,"bold":true}}]},{"type":"Button","props":{"y":35,"x":211,"width":95,"var":"btn_2","height":45,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":-34,"width":163,"var":"img2","skin":"ui_rank/img-lan-weixuan.png","sizeGrid":"0,33,0,33","height":45}},{"type":"Label","props":{"var":"btn_name2","text":"稀有","fontSize":26,"font":"SimHei","color":"#bebbf8","centerY":0,"centerX":0,"bold":true}}]},{"type":"Button","props":{"y":36,"x":351,"width":92,"var":"btn_3","height":45,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-1,"x":-38,"width":163,"var":"img3","skin":"ui_rank/img-lan-weixuan.png","sizeGrid":"0,33,0,33","height":45}},{"type":"Label","props":{"var":"btn_name3","text":"传奇","fontSize":26,"font":"SimHei","color":"#bebbf8","centerY":0,"centerX":0,"bold":true}}]},{"type":"HTMLDivElement","props":{"y":15,"x":450,"width":240,"var":"my_num","innerHTML":"htmlText","height":35}}]},{"type":"Label","props":{"y":117,"x":0,"width":700,"height":2,"bgColor":"#7c7a88"}},{"type":"List","props":{"y":120,"x":10,"width":680,"var":"E_suitList","spaceY":5,"repeatY":5,"height":824},"child":[{"type":"Box","props":{"y":0,"x":0,"width":680,"renderType":"render","height":646},"child":[{"type":"Label","props":{"x":0,"top":0,"right":0,"left":0,"bottom":5,"bgColor":"#262449"}},{"type":"Label","props":{"y":42,"x":0,"width":668,"name":"1","height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_pinzhi1","height":94}},{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_icon1","height":94}},{"type":"Label","props":{"y":14,"x":114,"width":70,"name":"E_name1","height":22,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":0,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":809,"x":635,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Button","props":{"y":55,"x":598,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"E_make1","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"制作","anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":1,"x":545,"width":100,"name":"E_makenum1","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":43,"x":114,"width":70,"name":"E_base1","height":22,"fontSize":20,"font":"SimHei"}},{"type":"HTMLDivElement","props":{"y":14,"x":202,"width":166,"name":"E_lv1","innerHTML":"htmlText","height":22}},{"type":"Label","props":{"y":0,"x":0,"width":94,"name":"E_lock","height":94,"fontSize":20,"font":"SimHei","bgColor":"#0c0908","alpha":0.5}}]},{"type":"Label","props":{"y":142,"x":0,"width":668,"name":"2","height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_pinzhi2","height":94}},{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_icon2","height":94}},{"type":"Label","props":{"y":14,"x":114,"width":70,"name":"E_name2","height":22,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":0,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":809,"x":635,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Button","props":{"y":55,"x":598,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"E_make2","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"制作","anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":1,"x":548,"width":100,"name":"E_makenum2","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":43,"x":114,"width":70,"name":"E_base2","height":22,"fontSize":20,"font":"SimHei"}},{"type":"HTMLDivElement","props":{"y":14,"x":202,"width":166,"name":"E_lv2","innerHTML":"htmlText","height":22}},{"type":"Label","props":{"y":0,"x":0,"width":94,"name":"E_lock","height":94,"fontSize":20,"font":"SimHei","bgColor":"#0c0908","alpha":0.5}}]},{"type":"Label","props":{"y":242,"x":0,"width":668,"name":"3","height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_pinzhi3","height":94}},{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_icon3","height":94}},{"type":"Label","props":{"y":14,"x":114,"width":70,"name":"E_name3","height":22,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":0,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":809,"x":635,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Button","props":{"y":55,"x":598,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"E_make3","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"制作","anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":1,"x":548,"width":100,"name":"E_makenum3","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":43,"x":114,"width":70,"name":"E_base3","height":22,"fontSize":20,"font":"SimHei"}},{"type":"HTMLDivElement","props":{"y":14,"x":202,"width":166,"name":"E_lv3","innerHTML":"htmlText","height":22}},{"type":"Label","props":{"y":0,"x":0,"width":94,"name":"E_lock","height":94,"fontSize":20,"font":"SimHei","bgColor":"#0c0908","alpha":0.5}}]},{"type":"Label","props":{"y":342,"x":0,"width":668,"name":"4","height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_pinzhi4","height":94}},{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_icon4","height":94}},{"type":"Label","props":{"y":14,"x":114,"width":70,"name":"E_name4","height":22,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":0,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":809,"x":635,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Button","props":{"y":55,"x":598,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"E_make4","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"制作","anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":1,"x":548,"width":100,"name":"E_makenum4","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":43,"x":114,"width":70,"name":"E_base4","height":22,"fontSize":20,"font":"SimHei"}},{"type":"HTMLDivElement","props":{"y":14,"x":202,"width":166,"name":"E_lv4","innerHTML":"htmlText","height":22}},{"type":"Label","props":{"y":0,"x":0,"width":94,"name":"E_lock","height":94,"fontSize":20,"font":"SimHei","bgColor":"#0c0908","alpha":0.5}}]},{"type":"Label","props":{"y":442,"x":0,"width":668,"name":"5","height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_pinzhi5","height":94}},{"type":"Image","props":{"y":0,"x":0,"width":94,"name":"E_icon5","height":94}},{"type":"Label","props":{"y":14,"x":114,"width":70,"name":"E_name5","height":22,"fontSize":20,"font":"SimHei"}},{"type":"Label","props":{"y":0,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":809,"x":635,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Button","props":{"y":55,"x":598,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"E_make5","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"制作","anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":1,"x":548,"width":100,"name":"E_makenum5","innerHTML":"htmlText","height":28}},{"type":"Label","props":{"y":43,"x":114,"width":70,"name":"E_base5","height":22,"fontSize":20,"font":"SimHei"}},{"type":"HTMLDivElement","props":{"y":14,"x":202,"width":166,"name":"E_lv5","innerHTML":"htmlText","height":22}},{"type":"Label","props":{"y":0,"x":0,"width":94,"name":"E_lock","height":94,"fontSize":20,"font":"SimHei","bgColor":"#0c0908","alpha":0.5}}]},{"type":"HTMLDivElement","props":{"y":550,"x":23,"width":382,"name":"suit_base1","height":28}},{"type":"Label","props":{"y":13,"x":16,"width":7,"height":25,"bgColor":"#4a408a","alpha":1}},{"type":"Image","props":{"y":12,"x":15,"width":297,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":27,"alpha":0.4}},{"type":"HTMLDivElement","props":{"y":10,"x":55,"name":"Equip_name","innerHTML":"htmlText","height":30}},{"type":"HTMLDivElement","props":{"y":577,"x":23,"width":382,"name":"suit_base2","height":28}},{"type":"HTMLDivElement","props":{"y":604,"x":23,"width":382,"name":"suit_base3","height":28}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.Equep.MakeEquipViewUI.uiView);

        }

    }
}

module ui.fund {
    export class FundViewUI extends View {
		public isad_bg:Laya.Image;
		public btn_close:Laya.Button;
		public tx_name_bg:Laya.Label;
		public tx_name:Laya.Label;
		public btn_investment:Laya.Button;
		public tx_money:laya.display.Text;
		public list_fund:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":32,"x":0,"width":750,"skin":"ui_consumer/img-biaoqianye-bg-huodong.png","sizeGrid":"0,3,0,3","height":1166},"child":[{"type":"Image","props":{"x":0,"width":750,"skin":"ui_consumer/img-jiemian-bg-zhuagnshi-huodong.png","height":978,"bottom":0}},{"type":"Image","props":{"y":42,"x":0,"var":"isad_bg","skin":"ui_fund/img-guanggao-jijin.jpg"}},{"type":"Image","props":{"y":0,"x":0,"width":750,"skin":"ui_consumer/img-tuanchuchuang-taitu-yunying.png"},"child":[{"type":"Button","props":{"y":2,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}},{"type":"Image","props":{"y":-27,"x":14,"skin":"ui_consumer/img-taitou-zhuagnshi-yunying.png","sizeGrid":"0,43,0,111"}},{"type":"Label","props":{"y":-7,"x":87,"var":"tx_name_bg","text":"基金","fontSize":35,"font":"SimHei","color":"#7e1e1f","align":"left"},"child":[{"type":"Label","props":{"y":-3,"x":-1,"var":"tx_name","text":"基金","strokeColor":"#feb0a7","stroke":1,"fontSize":35,"font":"SimHei","color":"#ff7869","align":"left"}}]}]}]},{"type":"Button","props":{"y":263,"x":505,"width":162,"var":"btn_investment","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":28,"labelPadding":"-8","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"投资","height":69,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":43,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,10,10,2","height":22}},{"type":"Image","props":{"y":46,"x":37,"width":28,"skin":"ui_icon/icon_prop_013.png","height":21}},{"type":"Text","props":{"y":46,"x":77,"width":76,"var":"tx_money","text":"000","height":20,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":true}}]},{"type":"List","props":{"y":332,"x":53,"width":649,"var":"list_fund","vScrollBarSkin":"\"\"","spaceY":20,"repeatX":1,"height":846},"child":[{"type":"Box","props":{"y":0,"x":0,"width":646,"renderType":"render","height":170},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_consumer/img-liebiaotiao-yunying.png","name":"bgImg"}},{"type":"Image","props":{"y":67,"x":477,"skin":"ui_consumer/img-yilingqu-yunying.png","name":"img_complete"}},{"type":"Button","props":{"y":95,"x":546,"width":162,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","name":"btn_reward","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"领取","height":70,"anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":9,"x":13,"width":624,"name":"tx_show","innerHTML":"htmlText","height":24}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.fund.FundViewUI.uiView);

        }

    }
}

module ui.GameOver {
    export class ProfitViewUI extends View {
		public Btn_close:Laya.Image;
		public Btn_sure:Laya.Button;
		public Off_time:Laya.Label;
		public Money_Num:Laya.Label;
		public icon_jinbi:Laya.Image;
		public ward_name1:Laya.Label;
		public exp_num:Laya.Label;
		public icon_zuanshi:Laya.Image;
		public ward_name:Laya.Label;
		public sys_Info:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908"}},{"type":"Label","props":{"x":81,"width":588,"height":678,"centerY":0,"centerX":0,"bgColor":"#c8c7c7","alpha":1},"child":[{"type":"Image","props":{"y":62,"x":40,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"pivotY":62,"pivotX":40,"alpha":0.2}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}},{"type":"Image","props":{"y":54,"x":7,"width":571,"skin":"ui_over/img-hua-lixianshouyi.png","height":212}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":50},"child":[{"type":"Label","props":{"x":35,"width":99,"text":"欢迎回来","height":26,"fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":20,"width":5,"height":25,"centerY":0,"bgColor":"#df8e2f"}},{"type":"Image","props":{"x":524,"var":"Btn_close","skin":"ui_common/btn-X-tongyong.png","right":20,"centerY":0}}]},{"type":"Button","props":{"x":210,"width":161,"var":"Btn_sure","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"确定","height":67,"bottom":20}},{"type":"Label","props":{"y":286,"x":42,"width":200,"var":"Off_time","text":"123","height":30,"fontSize":22,"font":"SimHei","color":"#225a88","bold":true,"align":"left"}},{"type":"Image","props":{"y":336,"width":532,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":40,"centerX":0,"alpha":0.9},"child":[{"type":"Label","props":{"width":131,"var":"Money_Num","text":"666","right":8,"height":28,"fontSize":24,"font":"SimHei","color":"#fef8e9","centerY":0,"align":"right"}},{"type":"Image","props":{"y":0,"x":10,"width":40,"var":"icon_jinbi","skin":"ui_common/icon_prop_012.png","height":40}},{"type":"Label","props":{"x":60,"width":82,"var":"ward_name1","text":"金币","height":28,"fontSize":24,"font":"SimHei","color":"#fef8e9","centerY":0,"align":"center"}}]},{"type":"Image","props":{"y":386,"width":532,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":40,"centerX":0,"alpha":0.9},"child":[{"type":"Label","props":{"width":138,"var":"exp_num","text":"666","right":8,"height":28,"fontSize":24,"font":"SimHei","color":"#fef8e9","centerY":0,"align":"right"}},{"type":"Image","props":{"y":0,"x":10,"width":40,"var":"icon_zuanshi","skin":"ui_icon/icon-tequan-jyjc.png","height":40}},{"type":"Label","props":{"x":60,"width":82,"var":"ward_name","text":"经验","height":28,"fontSize":24,"font":"SimHei","color":"#fef8e9","centerY":0,"align":"center"}}]},{"type":"Label","props":{"y":560,"x":7,"width":568,"height":2,"color":"500","bgColor":"#7c7a88"}},{"type":"HTMLDivElement","props":{"y":514,"x":10,"width":568,"var":"sys_Info","renderType":"render","innerHTML":"sd","height":24}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.GameOver.ProfitViewUI.uiView);

        }

    }
}

module ui.guidance {
    export class GuidanceViewUI extends View {
		public guidBj:Laya.Image;
		public spr_1:Laya.Sprite;
		public spr_2:Laya.Sprite;
		public shade:Laya.Label;
		public click:Laya.Sprite;
		public clickImg:Laya.Box;
		public aperture:Laya.Image;
		public arrows:Laya.Image;
		public time:Laya.Label;
		public infoBg:Laya.Image;
		public introduce:Laya.Label;
		public storyBj:Laya.Image;
		public blackBj:Laya.Label;
		public storyImg:View;
		public over:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"var":"guidBj","top":0,"right":0,"mouseThrough":true,"left":0,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Sprite","props":{"y":2,"x":0,"width":750,"var":"spr_1","mouseEnabled":true,"height":1200,"cacheAs":"bitmap"},"child":[{"type":"Sprite","props":{"var":"spr_2","mouseEnabled":true,"cacheAs":"bitmap"},"child":[{"type":"Label","props":{"width":750,"var":"shade","top":0,"mouseThrough":false,"left":0,"height":1200,"color":"#000000","bgColor":"#0c0908","alpha":0.8}}]},{"type":"Sprite","props":{"y":-2,"x":0,"width":100,"var":"click","pivotY":50,"pivotX":50,"height":100},"child":[{"type":"Circle","props":{"y":50,"x":50,"radius":15,"lineWidth":1,"fillColor":"#ff0000"}}]}]},{"type":"Box","props":{"y":788,"x":547,"width":138,"visible":true,"var":"clickImg","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":-33,"skin":"ui_action/img-dian-huatixianfeng.png"}},{"type":"Image","props":{"y":0,"x":46,"skin":"ui_action/img-dian-huatixianfeng.png"}},{"type":"Image","props":{"y":0,"x":119,"skin":"ui_action/img-dian-huatixianfeng.png"}}]},{"type":"Image","props":{"width":100,"var":"aperture","height":100,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":0,"x":0,"width":128,"var":"arrows","skin":"ui_guid/ui_shouzhi.png","height":128}},{"type":"Label","props":{"y":213,"x":373,"width":750,"visible":true,"var":"time","text":"读表","height":70,"fontSize":26,"font":"Microsoft YaHei","color":"#e0ff03","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Image","props":{"width":414,"var":"infoBg","top":676,"skin":"ui_guid/img-bg-yindao.png","sizeGrid":"1,1,1,1","left":189,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":-1,"x":111,"wordWrap":true,"width":271,"visible":true,"var":"introduce","text":"教程教程教程教程教程教程教程教程教程","padding":"12,14,12,14","leading":12,"height":86,"fontSize":22,"font":"SimHei","color":"#1e5480","bold":false}},{"type":"Image","props":{"y":-49,"x":-70,"width":195,"skin":"ui_icon/icon_equip_46.png","height":197}}]}]},{"type":"Image","props":{"var":"storyBj","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"var":"blackBj","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000"}},{"type":"View","props":{"var":"storyImg","centerY":0,"centerX":0}},{"type":"Image","props":{"y":1090,"x":310,"var":"over","skin":"ui_guid/btn-tiaoguojuqing.png","right":49,"bottom":46}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.guidance.GuidanceViewUI.uiView);

        }

    }
}

module ui.guidance {
    export class StoryViewUI extends View {
		public aim:Laya.Box;
		public overBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000"}},{"type":"Box","props":{"var":"aim","centerY":0,"centerX":0}}]},{"type":"Button","props":{"var":"overBtn","stateNum":1,"skin":"ui_guid/btn-tiaoguojuqing.png","right":49,"bottom":46}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.guidance.StoryViewUI.uiView);

        }

    }
}

module ui.heroList.HeroHandBook {
    export class MostHandBookViewUI extends View {
		public mosthanbook:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"List","props":{"y":5,"x":8,"width":734,"var":"mosthanbook","spaceY":15,"height":1058,"centerX":0},"child":[{"type":"Box","props":{"y":0,"right":0,"renderType":"render","left":-2,"height":369},"child":[{"type":"Image","props":{"top":45,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"10,11,23,6","right":0,"left":0,"height":324}},{"type":"Image","props":{"x":670,"skin":"ui_common/img-huawen2.png","right":0,"bottom":1,"alpha":1}},{"type":"Image","props":{"y":214,"skin":"ui_common/img-huawen1.png","skewY":180,"skewX":180,"right":0,"anchorY":0.5,"anchorX":0.5,"alpha":0.4}},{"type":"Image","props":{"y":343,"x":42,"skin":"ui_common/img-huawen2.png","skewY":180,"skewX":180,"left":2,"bottom":2,"anchorY":0.5,"anchorX":0.5,"alpha":1}},{"type":"Image","props":{"y":0.5,"x":-0.5,"skin":"ui_hero/img-da-taitou-tongyong.png"},"child":[{"type":"Label","props":{"y":6,"x":4,"width":6,"height":25,"bgColor":"#df8e2f"}}]},{"type":"Label","props":{"y":8,"x":24,"text":"烽火如荼","name":"mosthand_name","fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"Label","props":{"y":8,"x":355,"text":"所有英雄达到400级","name":"mosthand_lock","fontSize":20,"font":"SimHei","color":"#dde2f2","align":"left"},"child":[{"type":"Image","props":{"y":-1,"x":-27,"skin":"ui_sign/img-tanhao-tongyong.png"}}]},{"type":"Label","props":{"y":260,"width":718,"height":1,"centerX":0,"bgColor":"#4e5943"}},{"type":"Label","props":{"y":267,"x":3,"width":471,"height":92,"bgColor":"#575d7a"}},{"type":"Image","props":{"y":53,"x":21,"width":94,"visible":false,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"mosthand_1","height":94},"child":[{"type":"Image","props":{"top":0,"skin":"ui_icon/icon_tou_frk.png","right":0,"name":"hand_icon","left":0,"bottom":0}},{"type":"Label","props":{"y":3,"x":107,"width":106,"underline":true,"text":"英雄是个","name":"hand_name","height":20,"fontSize":21,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":29,"x":102,"width":111,"name":"hand_lv","height":20}}]},{"type":"Image","props":{"y":52,"x":255,"width":94,"visible":false,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"mosthand_2","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_icon/icon_tou_frk.png","right":0,"name":"hand_icon","left":0,"bottom":0}},{"type":"Label","props":{"y":3,"x":107,"width":108,"underline":true,"name":"hand_name","height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":29,"x":102,"width":111,"name":"hand_lv","height":20}}]},{"type":"Image","props":{"y":52,"x":489,"width":94,"visible":false,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"mosthand_3","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_icon/icon_tou_frk.png","right":0,"name":"hand_icon","left":0,"bottom":0}},{"type":"Label","props":{"y":3,"x":107,"width":106,"underline":true,"name":"hand_name","height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":29,"x":102,"width":111,"name":"hand_lv","height":20}}]},{"type":"Image","props":{"y":157,"x":23,"width":94,"visible":false,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"mosthand_4","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_icon/icon_tou_frk.png","right":0,"name":"hand_icon","left":0,"bottom":0}},{"type":"Label","props":{"y":3,"x":107,"width":106,"underline":true,"name":"hand_name","height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":29,"x":102,"width":111,"name":"hand_lv","height":20}}]},{"type":"Image","props":{"y":157,"x":255,"width":94,"visible":false,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"mosthand_5","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_icon/icon_tou_frk.png","right":0,"name":"hand_icon","left":0,"bottom":0}},{"type":"Label","props":{"y":3,"x":107,"width":106,"underline":true,"name":"hand_name","height":20,"fontSize":20,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":29,"x":102,"width":111,"name":"hand_lv","height":20}}]},{"type":"Button","props":{"y":320,"x":611,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","name":"Btn_lvup","labelSize":25,"labelFont":"SimHei","labelBold":true,"labelAlign":"center","label":"激活","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":270,"x":18,"width":140,"text":"属性加成","name":"mostbase_now","height":22,"fontSize":20,"font":"SimHei","color":"#c8d2f7","align":"left"},"child":[{"type":"Label","props":{"y":29,"x":0,"text":"伤害","name":"Attritue_1","fontSize":20,"font":"SimHei","color":"#c8d2f7"}},{"type":"Label","props":{"y":54,"x":0,"text":"生命","name":"Attritue_2","fontSize":20,"font":"SimHei","color":"#c8d2f7"}}]},{"type":"Label","props":{"y":271,"x":354,"width":100,"text":"下级属性","name":"mostbase_next","height":22,"fontSize":20,"font":"SimHei","color":"#c8d2f7","align":"left"},"child":[{"type":"Label","props":{"y":28,"text":"108776312","name":"Attritue_1","fontSize":21,"font":"SimHei","color":"#75d888","centerX":0,"align":"right"}},{"type":"Label","props":{"y":53,"text":"19567758","name":"Attritue_2","fontSize":21,"font":"SimHei","color":"#75d888","centerX":0,"align":"right"}}]},{"type":"Image","props":{"y":290,"x":298,"skin":"ui_consumer/img-jiantou-tongyong.png","name":"jiantou"}},{"type":"Label","props":{"y":294,"x":564,"wordWrap":false,"width":97,"visible":false,"valign":"middle","text":"已满级","strokeColor":"#d38343","stroke":3,"name":"lv_max","mouseThrough":true,"height":51,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.heroList.HeroHandBook.MostHandBookViewUI.uiView);

        }

    }
}

module ui.heroList.HeroHandBook {
    export class SingleHandBookViewUI extends View {
		public play_say:Laya.Label;
		public singlehandbook_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":5,"skin":"ui_hero/img-da-taitou-tongyong.png","centerX":0},"child":[{"type":"Label","props":{"y":8,"x":41,"width":241,"var":"play_say","text":"激活","height":25,"fontSize":21,"font":"SimHei","color":"#dde2f2","align":"left"}},{"type":"Image","props":{"y":9,"x":11,"skin":"ui_sign/img-tanhao-tongyong.png"}}]},{"type":"List","props":{"y":53,"x":-375,"width":750,"var":"singlehandbook_list","spaceY":6,"spaceX":12,"repeatX":2,"height":1025,"centerX":0},"child":[{"type":"Box","props":{"y":0,"x":8,"width":362,"renderType":"render","height":320},"child":[{"type":"Image","props":{"top":0,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"6,23,23,14","right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":43,"skin":"ui_common/img-huawen1.png","skewY":180,"right":0,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":2,"bottom":2,"alpha":1}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","skewY":180,"left":2,"bottom":2,"anchorY":0.5,"anchorX":0.5,"alpha":1}},{"type":"Image","props":{"y":10,"x":10,"width":94,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"hand_pinzhi","height":93}},{"type":"Image","props":{"y":10,"x":10,"width":94,"skin":"ui_icon/icon_tou_frk.png","name":"hand_icon","height":94}},{"type":"Label","props":{"y":12,"x":115,"width":172,"underline":true,"text":"英雄是个大","name":"hand_name","height":21,"fontSize":22,"font":"SimHei","color":"#d7e0ea","align":"left"}},{"type":"HTMLDivElement","props":{"y":39,"x":115,"width":74,"name":"hand_lv","height":21}},{"type":"Label","props":{"y":114,"width":350,"height":116,"centerX":0,"bgColor":"#575d7a"}},{"type":"Button","props":{"y":274,"x":182,"stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"Btn_lvup","labelSize":25,"labelPadding":"0,0,10,0","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"升级","anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":43,"x":-14,"width":187,"name":"hand_num","innerHTML":"htmlText","height":21}}]},{"type":"Label","props":{"y":122,"x":11,"width":85,"text":"属性加成","name":"base_now","height":21,"fontSize":21,"font":"SimHei","color":"#bfc7e4"},"child":[{"type":"Label","props":{"y":29,"x":1,"width":163,"visible":false,"text":"伤害","name":"base_now_1","height":21,"fontSize":19,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Label","props":{"y":54,"x":0,"width":163,"visible":false,"text":"生命","name":"base_now_2","height":21,"fontSize":20,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Label","props":{"y":79,"x":-1,"width":163,"visible":false,"text":"生命","name":"base_now_3","height":21,"fontSize":20,"font":"SimHei","color":"#bfc7e4","align":"left"}}]},{"type":"Label","props":{"y":122,"x":240,"width":92,"text":"下级属性","name":"base_next","height":21,"fontSize":22,"font":"SimHei","color":"#bfc7e4","align":"left"},"child":[{"type":"Label","props":{"y":29,"x":-9,"width":99,"visible":false,"text":"108776312","name":"base_next_1","height":21,"fontSize":21,"font":"SimHei","color":"#75d888","align":"right"}},{"type":"Label","props":{"y":54,"x":-9,"width":99,"visible":false,"name":"base_next_2","height":21,"fontSize":21,"font":"SimHei","color":"#75d888","align":"right"}},{"type":"Label","props":{"y":79,"x":-9,"width":99,"visible":false,"name":"base_next_3","height":21,"fontSize":21,"font":"SimHei","color":"#75d888","align":"right"}}]},{"type":"Image","props":{"y":152,"x":161,"skin":"ui_consumer/img-jiantou-tongyong.png"}},{"type":"Label","props":{"y":247,"x":132,"wordWrap":false,"width":97,"visible":false,"valign":"middle","text":"已满级","strokeColor":"#d38343","stroke":3,"name":"lv_max","mouseThrough":true,"height":51,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.heroList.HeroHandBook.SingleHandBookViewUI.uiView);

        }

    }
}

module ui.heroList {
    export class HeroHandBookViewUI extends View {
		public HeroHand_single:Laya.Button;
		public single_bg:Laya.Label;
		public single_name:Laya.Label;
		public Single_red:Laya.Image;
		public ChildBox:Laya.Box;
		public HeroHand_most:Laya.Button;
		public most_bg:Laya.Label;
		public most_name:Laya.Label;
		public Most_red:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1108},"child":[{"type":"Button","props":{"y":105,"x":80,"width":139,"var":"HeroHand_single","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"var":"single_bg","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#443e4c"}},{"type":"Label","props":{"y":14,"x":20,"var":"single_name","text":"英雄图鉴","fontSize":24,"font":"SimHei","color":"#a9b3cd"}},{"type":"Image","props":{"y":-5,"x":-5,"var":"Single_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Box","props":{"y":140,"x":0,"var":"ChildBox"}},{"type":"Button","props":{"y":107,"x":231,"width":140,"var":"HeroHand_most","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"var":"most_bg","top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f445c"}},{"type":"Label","props":{"y":14,"x":20,"var":"most_name","text":"英雄图鉴","fontSize":24,"font":"SimHei","color":"#ced0d6"}},{"type":"Image","props":{"y":-5,"x":-5,"var":"Most_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Label","props":{"y":130,"x":0,"width":750,"height":2,"bgColor":"#4f445c"}},{"type":"Label","props":{"y":132,"x":0,"width":750,"height":1,"bgColor":"#201a26"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.heroList.HeroHandBookViewUI.uiView);

        }

    }
}

module ui.heroList {
    export class HeroLvUpUI extends View {
		public bg:Laya.Label;
		public List_hero:Laya.List;
		public Btn_shop:Laya.Label;
		public Btn_shop10:Laya.Label;
		public Btn_shop1:Laya.Label;
		public Btn_shopMax:Laya.Label;
		public BtnShop:Laya.ComboBox;

        public static  uiView:any ={"type":"View","props":{"y":0,"width":750,"height":1108},"child":[{"type":"Label","props":{"var":"bg","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"List","props":{"y":60,"x":0,"width":750,"var":"List_hero","spaceY":10,"repeatX":1,"renderType":"render","height":1039},"child":[{"type":"Box","props":{"y":0,"x":10,"width":730,"renderType":"render","height":93},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":730,"lineWidth":1,"height":85,"fillColor":"#5d4565"}},{"type":"Image","props":{"y":0,"x":0,"width":730,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,4,0","height":93}},{"type":"Image","props":{"y":0,"x":90,"skin":"ui_common/img-huawen1.png"}},{"type":"Image","props":{"y":0,"skin":"ui_common/img-huawen2.png","right":0}},{"type":"Image","props":{"y":0,"x":0,"width":93,"name":"pinzhi_bg","height":93}},{"type":"Image","props":{"y":0,"x":0,"width":93,"name":"HeadIcon","height":93,"anchorY":0,"anchorX":0},"child":[{"type":"Image","props":{"y":0,"x":-4,"width":36,"visible":true,"skin":"ui_hero/img-yingxiong-zhiwei-bg.png","name":"War_bg","height":33}},{"type":"Image","props":{"y":0,"x":-4,"width":36,"name":"War_img","height":33}},{"type":"Image","props":{"visible":false,"skin":"ui_common/img-tixing.png","name":"hero_point"}}]},{"type":"Image","props":{"y":2,"x":106,"width":16,"skin":"ui_hero/icon-renwu-leixing-gongji.png","name":"HeroType","height":18}},{"type":"Label","props":{"y":2,"x":132,"text":"英雄名字","name":"HeroName","fontSize":22,"font":"SimHei","color":"#fbffd6","align":"left"}},{"type":"Label","props":{"y":26,"x":105,"text":"LV:","fontSize":20,"font":"SimHei","color":"#9be589","bold":true,"align":"left"}},{"type":"Label","props":{"y":26,"x":138,"text":"1","name":"HeroLevel","fontSize":20,"font":"SimHei","color":"#f4ff79","bold":true,"align":"left"}},{"type":"Label","props":{"y":32,"x":300,"width":80,"text":"生命：","name":"HeroHp","height":20,"fontSize":20,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Label","props":{"y":5,"x":300,"width":80,"text":"伤害：","name":"HeroHurt","height":20,"fontSize":20,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Button","props":{"y":-1,"x":0,"width":556,"name":"Btn_2","height":85}},{"type":"Label","props":{"y":5,"x":287,"width":2,"height":44,"fontSize":20,"font":"SimHei","bold":true,"bgColor":"#4e5943","align":"left"}},{"type":"Label","props":{"y":32,"x":438,"width":106,"visible":true,"text":"(↑32.2289)","name":"Add_hp","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}},{"type":"Label","props":{"y":5,"x":438,"width":106,"visible":true,"text":"(↑32.2289)","name":"Add_Hurt","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}},{"type":"Image","props":{"y":58,"x":396,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon10","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":364,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon9","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":331,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon8","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":298,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon7","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":265,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon6","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":232,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon5","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":197,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon4","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":164,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon3","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":131,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon2","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":58,"x":98,"width":28,"visible":false,"skin":"ui_icon/0.png","name":"skill_icon1","height":28},"child":[{"type":"Label","props":{"y":0,"x":0,"width":28,"name":"skill_lock","height":28,"bgColor":"#0c0908","alpha":0.8}}]},{"type":"Image","props":{"y":40,"x":565,"skin":"ui_hero/img-zhuangshi-tangchuchuang.png"}},{"type":"Image","props":{"y":0,"x":536,"skin":"ui_hero/img-yiman-bg-tongyong.png","name":"lv_max"}},{"type":"Button","props":{"y":42,"x":641,"width":165,"stateNum":1,"name":"Btn_1","height":75,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":165,"skin":"ui_hero/btn-huang.png","name":"btn_img"}},{"type":"Label","props":{"y":24,"x":0,"wordWrap":false,"width":165,"visible":true,"valign":"middle","text":"激活","strokeColor":"#d38343","stroke":3,"name":"Btn_label","mouseThrough":true,"height":51,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Label","props":{"y":54,"x":0,"width":165,"name":"lvup_lock","height":20,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"HTMLDivElement","props":{"y":2,"width":165,"name":"money","height":18}},{"type":"Image","props":{"y":0,"visible":false,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","right":0,"name":"new_logo"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"Label","props":{"y":28,"x":586,"wordWrap":true,"width":97,"visible":false,"valign":"middle","strokeColor":"#d38343","stroke":3,"name":"Btn_skill","height":51,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":0,"x":0,"width":76,"name":"heroicon1","height":76,"anchorY":0,"anchorX":0}},{"type":"Label","props":{"y":27,"x":588,"wordWrap":false,"width":97,"visible":false,"valign":"middle","text":"已满级","strokeColor":"#d38343","stroke":3,"name":"Btn_labels","mouseThrough":true,"height":51,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Label","props":{"y":60,"x":98,"width":80,"visible":false,"text":"获取途径:","name":"get_LandName","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}},{"type":"Label","props":{"y":60,"x":200,"width":45,"visible":false,"underlineColor":"#75d888","underline":true,"name":"get_Land1","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}},{"type":"Label","props":{"y":60,"x":280,"width":45,"visible":false,"underline":true,"name":"get_Land2","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}},{"type":"Label","props":{"y":60,"x":340,"width":45,"visible":false,"underline":true,"name":"get_Land3","height":20,"fontSize":20,"font":"SimHei","color":"#75d888","align":"left"}}]}]},{"type":"Label","props":{"y":28,"x":629,"width":100,"visible":false,"var":"Btn_shop","text":"升级","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","bgColor":"#30303a","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":88,"x":579,"width":100,"visible":false,"var":"Btn_shop10","text":"X10","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","bgColor":"#30303a","align":"center"},"child":[{"type":"Label","props":{"y":0,"x":193,"width":1,"right":0,"height":40,"bgColor":"#595969"}}]},{"type":"Label","props":{"y":48,"x":579,"width":100,"visible":false,"var":"Btn_shop1","text":"X1","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","bgColor":"#30303a","align":"center"},"child":[{"type":"Label","props":{"y":0,"width":1,"right":0,"height":40,"bgColor":"#595969"}}]},{"type":"Label","props":{"y":148,"x":629,"width":100,"visible":false,"var":"Btn_shopMax","text":"最大","padding":"8","height":40,"fontSize":22,"font":"SimHei","color":"#9a9fb2","bgColor":"#30303a","anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"ComboBox","props":{"y":-226,"x":581,"width":102,"visible":false,"var":"BtnShop","skin":"ui_hero/combobox.png","selectedIndex":0,"labels":"升级X1,升级X10,升级最大","labelSize":18,"labelPadding":"0,15,0,5","labelFont":"SimHei","labelColors":"#9a9fb2,#9a9fb2,#9a9fb2,#9a9fb2","labelBold":true,"itemSize":18,"itemColors":"#474557,#9a9fb2,#9a9fb2,#ffffff,#30303a","height":50,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.heroList.HeroLvUpUI.uiView);

        }

    }
}

module ui.heroList {
    export class HeroStarUI extends View {
		public background:Laya.Label;
		public heroStar_List:Laya.List;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":750,"height":1108},"child":[{"type":"Label","props":{"width":750,"var":"background","height":1108,"bgColor":"#34354b","alpha":0.8},"child":[{"type":"Label","props":{"y":5,"width":750,"height":48,"bgColor":"#2c2129","alpha":0.7}}]},{"type":"List","props":{"y":60,"x":0,"width":750,"var":"heroStar_List","spaceY":10,"repeatY":100,"height":1039},"child":[{"type":"Box","props":{"y":0,"x":10,"width":730,"renderType":"render","height":93},"child":[{"type":"Image","props":{"y":0,"x":0,"width":730,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,6,0","height":93}},{"type":"Image","props":{"y":0,"x":90,"width":324,"visible":true,"skin":"ui_common/img-huawen1.png","name":"Di_Wen","height":86}},{"type":"Image","props":{"y":0,"x":650,"skin":"ui_common/img-huawen2.png","right":0}},{"type":"Image","props":{"y":55,"x":110,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon1","height":26}},{"type":"Image","props":{"y":55,"x":425,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon10","height":26}},{"type":"Image","props":{"y":55,"x":390,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon9","height":26}},{"type":"Image","props":{"y":55,"x":355,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon8","height":26}},{"type":"Image","props":{"y":55,"x":320,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon7","height":26}},{"type":"Image","props":{"y":55,"x":285,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon6","height":26}},{"type":"Image","props":{"y":55,"x":250,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon5","height":26}},{"type":"Image","props":{"y":55,"x":215,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon4","height":26}},{"type":"Image","props":{"y":55,"x":180,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon3","height":26}},{"type":"Image","props":{"y":55,"x":145,"width":28,"visible":false,"skin":"ui_hero/icon-weijihuo-jinjie-yingxiong.png","renderType":"render","name":"Star_Icon2","height":26}},{"type":"Image","props":{"y":0,"x":539,"skin":"ui_hero/img-yiman-bg-tongyong.png","name":"star_max"}},{"type":"Button","props":{"y":42,"x":641,"width":165,"stateNum":1,"skin":"ui_hero/btn-huang.png","renderType":"render","name":"Btn_StarUp","mouseEnabled":false,"labelStrokeColor":"#d38343","labelStroke":3,"labelSize":26,"labelColors":"#ffffff","height":75,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":50,"x":0,"width":165,"strokeColor":"#d38343","stroke":3,"name":"BaseChange","height":25,"fontSize":15,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Label","props":{"width":165,"text":"进阶","strokeColor":"#d38343","stroke":3,"right":0,"name":"UP_Start","left":0,"height":49,"fontSize":20,"font":"Microsoft YaHei","color":"#ffffff","bottom":0,"align":"center"}},{"type":"HTMLDivElement","props":{"y":3,"width":165,"name":"ItemNum","height":20}}]},{"type":"Image","props":{"y":5,"x":106,"width":16,"renderType":"render","name":"hero_TypeIcon","height":18}},{"type":"Label","props":{"y":30,"x":330,"width":100,"renderType":"render","name":"hero_Hp","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff"}},{"type":"Label","props":{"y":5,"x":330,"width":100,"renderType":"render","name":"hero_Hurt","height":20,"fontSize":20,"font":"SimHei","color":"#ffffff"}},{"type":"Label","props":{"y":33,"x":138,"width":30,"text":"0阶","renderType":"render","name":"hero_StarNum","height":20,"fontSize":20,"font":"SimHei","color":"#ffff79","align":"left"}},{"type":"Label","props":{"y":5,"x":132,"text":"label","renderType":"render","name":"hero_Name","fontSize":22,"font":"SimHei","color":"#fbffd6","align":"left"}},{"type":"Image","props":{"y":0,"x":0,"width":93,"renderType":"render","name":"pinzhi_bg","height":93}},{"type":"Image","props":{"y":0,"x":0,"width":93,"skin":"ui_head/icon-tou-lydd.png","renderType":"render","name":"hero_Icon","height":93}},{"type":"Label","props":{"y":35,"x":610,"width":78,"visible":false,"text":"已满阶","strokeColor":"#d38343","stroke":3,"renderType":"render","name":"Star_Max","height":31,"fontSize":22,"font":"Microsoft YaHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":8,"x":317,"width":1,"height":38,"bgColor":"#290836"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.heroList.HeroStarUI.uiView);

        }

    }
}

module ui.heroList {
    export class HeroWarUI extends View {
		public BackGround:Laya.Image;
		public bgbox:Laya.Box;
		public dragpos8:Laya.Image;
		public Pos_8:Laya.Image;
		public mod8:View;
		public dragpos7:Laya.Image;
		public Pos_7:Laya.Image;
		public mod7:View;
		public dragpos6:Laya.Image;
		public Pos_6:Laya.Image;
		public mod6:View;
		public dragpos5:Laya.Image;
		public Pos_5:Laya.Image;
		public mod5:View;
		public dragpos4:Laya.Image;
		public Pos_4:Laya.Image;
		public mod4:View;
		public dragpos3:Laya.Image;
		public Pos_3:Laya.Image;
		public mod3:View;
		public dragpos2:Laya.Image;
		public Pos_2:Laya.Image;
		public mod2:View;
		public dragpos1:Laya.Image;
		public Pos_1:Laya.Image;
		public mod1:View;
		public dragpos0:Laya.Image;
		public Pos_0:Laya.Image;
		public mod0:View;
		public List_head:Laya.List;
		public dragHeroIcon:Laya.Image;
		public dragHeroMod:View;
		public L:Laya.Label;
		public main_skillName:Laya.Label;
		public Skill_Icon:Laya.Image;
		public Btn_save:Laya.Button;
		public tixing:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"y":0,"x":0,"width":750,"height":1078},"child":[{"type":"Label","props":{"y":-73,"x":0,"width":750,"top":0,"right":0,"left":0,"height":1200,"bottom":-50,"bgColor":"#303b3b","alpha":0.9}},{"type":"Image","props":{"y":-350,"x":1,"width":750,"var":"BackGround","sizeGrid":"15,15,15,15","renderType":"render","height":1200},"child":[{"type":"Sprite","props":{"y":390,"x":-9,"width":781,"renderType":"mask","height":531},"child":[{"type":"Rect","props":{"y":19,"x":-197,"width":1176,"lineWidth":1,"height":489,"fillColor":"#ff0000"}}]}]},{"type":"Label","props":{"y":573,"x":1,"width":750,"height":555,"bgColor":"#303b3b","alpha":0.9}},{"type":"Box","props":{"y":0,"x":1,"var":"bgbox"},"child":[{"type":"Image","props":{"y":382,"x":79,"width":100,"var":"dragpos8","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_8","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_9","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_9.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod8","name":"mod"}}]},{"type":"Image","props":{"y":299,"x":178,"width":100,"var":"dragpos7","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_7","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_8","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_8.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod7","name":"mod"}}]},{"type":"Image","props":{"y":233,"x":79,"width":100,"var":"dragpos6","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_6","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_7","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_7.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod6","name":"mod"}}]},{"type":"Image","props":{"y":382,"x":277,"width":100,"var":"dragpos5","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_5","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_6","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_6.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod5","name":"mod"}}]},{"type":"Image","props":{"y":301,"x":374,"width":100,"var":"dragpos4","height":150},"child":[{"type":"Image","props":{"y":-28,"x":6,"skin":"ui_hero/img-yingxiong-duizhang-biaozhi.png"}},{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_4","skin":"ui_hero/img-yingxiong-duizhang-bg.png","name":"Pos_5","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_5.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod4","name":"mod"}}]},{"type":"Image","props":{"y":233,"x":277,"width":100,"var":"dragpos3","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_3","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_4","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_4.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod3","name":"mod"}}]},{"type":"Image","props":{"y":382,"x":475,"width":100,"var":"dragpos2","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_2","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_3","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_3.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod2","name":"mod"}}]},{"type":"Image","props":{"y":299,"x":574,"width":100,"var":"dragpos1","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_1","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_2","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_2.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod1","name":"mod"}}]},{"type":"Image","props":{"y":233,"x":475,"width":100,"var":"dragpos0","height":150},"child":[{"type":"Image","props":{"y":130,"x":50,"width":100,"var":"Pos_0","skin":"ui_hero/img-yingxiong-renwuyuan-bg.png","name":"Pos_1","mouseThrough":true,"height":40,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":26,"skin":"ui_hero/img_buzhen_1.png"}}]},{"type":"View","props":{"y":135,"x":50,"var":"mod0","name":"mod"}}]},{"type":"List","props":{"y":576,"x":0,"width":754,"var":"List_head","spaceY":14,"spaceX":22,"repeatX":4,"height":503},"child":[{"type":"Box","props":{"y":97,"x":120,"width":150,"renderType":"render","height":185,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":148,"skin":"ui_hero/img-buzhen-renwu-bg.png","renderType":"render","name":"background","height":188}},{"type":"Button","props":{"y":2,"x":1,"width":147,"stateNum":1,"name":"Btn_skill","height":185},"child":[{"type":"Image","props":{"y":1,"x":1,"width":143,"name":"background_k","height":182}},{"type":"Image","props":{"y":1,"x":2,"width":140,"name":"HeadIcon","height":140}},{"type":"Label","props":{"y":142,"x":7,"width":49,"text":"伤害","name":"Hp_name","height":20,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":162,"x":7,"width":49,"text":"生命","renderType":"render","name":"Hp_name","height":24,"fontSize":18,"font":"SimHei","color":"#e5c64a","align":"left"}},{"type":"Label","props":{"y":160,"x":40,"width":105,"renderType":"render","name":"Hp","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Label","props":{"y":142,"x":40,"width":105,"renderType":"render","name":"Hurt","height":21,"fontSize":18,"font":"SimHei","color":"#fefeff","align":"center"}},{"type":"Image","props":{"y":-1,"x":-10,"width":41,"skin":"ui_hero/img-yingxiong-zhiwei-bg.png","renderType":"render","name":"IsGoWar","height":50}},{"type":"Image","props":{"y":-1,"x":-10,"skin":"ui_hero/img-yingxiong-zhiwei-dui.png","name":"hero_zhiwei"}},{"type":"Image","props":{"y":10,"x":110,"width":25,"skin":"ui_hero/icon-renwu-leixing-bg.png","renderType":"render","name":"Hero_Type_bg","height":29}},{"type":"Image","props":{"y":12,"x":117,"width":11,"skin":"ui_hero/icon-renwu-leixing-gongji.png","renderType":"render","name":"Hero_Type","height":22}},{"type":"Button","props":{"y":138,"x":1,"width":147,"name":"Btn_Info","height":45}}]}]}]},{"type":"Image","props":{"y":202,"x":78,"width":140,"var":"dragHeroIcon","height":140,"anchorY":1,"anchorX":0.5},"child":[{"type":"View","props":{"var":"dragHeroMod","centerX":0,"bottom":0}}]},{"type":"Image","props":{"y":74,"width":92,"skin":"ui_hero/img-duizhangjineng-bg-yingxiong.png","height":110,"centerX":0},"child":[{"type":"Label","props":{"y":85,"x":8,"width":2,"var":"L","height":20,"bgColor":"#ccd6c6"}},{"type":"Label","props":{"y":86,"x":13,"var":"main_skillName","text":"队长技能","strokeColor":"#7c6d92","stroke":3,"height":20,"fontSize":18,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":5,"x":8,"width":76,"var":"Skill_Icon","height":76}}]}]},{"type":"Image","props":{"y":0,"width":750,"visible":true,"height":58,"centerX":1},"child":[{"type":"Label","props":{"y":0,"x":0,"width":750,"visible":true,"height":58,"bgColor":"#2c2129","alpha":0.7}},{"type":"Button","props":{"y":29,"x":670,"width":159,"var":"Btn_save","top":0,"stateNum":1,"skin":"ui_hero/btn-buzhen-baocun.png","right":0,"labelStrokeColor":"be5f13","labelStroke":4,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff","label":"保存","height":58,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Label","props":{"y":74,"width":459,"var":"tixing","text":"奥法弄","strokeColor":"#7c6d92","stroke":3,"right":45,"height":64,"fontSize":18,"font":"SimHei","color":"#fef8e9","align":"right"}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.heroList.HeroWarUI.uiView);

        }

    }
}

module ui.heroList {
    export class Hero_AlInfoUI extends View {
		public Background:Laya.Image;
		public close:Laya.Button;
		public hero_type:Laya.Image;
		public heroIcon_bg:Laya.Image;
		public heroIcon:Laya.Image;
		public heroName:Laya.Label;
		public level:Laya.Label;
		public herolevel:Laya.Label;
		public heroattl1:Laya.Label;
		public val1:Laya.Label;
		public heroattl2:Laya.Label;
		public val2:Laya.Label;
		public heroattl3:Laya.Label;
		public val3:Laya.Label;
		public heroattl4:Laya.Label;
		public val4:Laya.Label;
		public heroattl5:Laya.Label;
		public val5:Laya.Label;
		public heroOrigin:Laya.Label;
		public skill_panel:Laya.Panel;
		public Teamskill_Icon:Laya.Image;
		public skill_Name:Laya.Label;
		public skill_Origin:laya.html.dom.HTMLDivElement;
		public skill_List:Laya.List;
		public hero_peck:Laya.Button;
		public peck_time:Laya.Label;
		public heropeck_red:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"text":"label","right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":624,"var":"Background","skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"10,20,20,20","height":846,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":624,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":18,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":40,"text":"英雄详情","fontSize":24,"font":"SimHei","color":"#dde2f2","centerY":0}},{"type":"Button","props":{"x":573,"width":44,"var":"close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","height":42,"centerY":0}}]},{"type":"Image","props":{"y":66,"x":361,"width":15,"var":"hero_type","height":17}},{"type":"Image","props":{"y":60,"x":18,"width":306,"var":"heroIcon_bg","skin":"ui_hero/img-yingxiong-zhanshi-lan.png","height":390}},{"type":"Image","props":{"y":60,"x":18,"width":306,"var":"heroIcon","pivotX":0,"height":390}},{"type":"Label","props":{"y":65,"x":384,"width":150,"var":"heroName","text":"时光沙","height":30,"fontSize":22,"font":"SimHei","color":"#fbffd6","align":"left"}},{"type":"Label","props":{"y":95,"x":354,"width":91,"var":"level","text":"等级：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":95,"width":152,"var":"herolevel","text":"10阶111级","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":125,"x":354,"width":97,"var":"heroattl1","text":"生命：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":125,"width":120,"var":"val1","text":"120","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":155,"x":354,"width":80,"var":"heroattl2","text":"伤害：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":155,"width":130,"var":"val2","text":"145.47ac","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":185,"x":354,"width":84,"var":"heroattl3","text":"先手：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":185,"width":144,"var":"val3","text":"326.22aa","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":215,"x":354,"width":81,"var":"heroattl4","text":"暴击：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":215,"width":106,"var":"val4","text":"22%","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":245,"x":354,"width":102,"var":"heroattl5","text":"暴伤：","padding":"5","height":30,"fontSize":18,"font":"SimHei","color":"#9be589","alpha":1,"align":"left"}},{"type":"Label","props":{"y":245,"width":86,"var":"val5","text":"220%","right":20,"padding":"5,15","height":30,"fontSize":20,"font":"SimHei","color":"#f4ff79","alpha":1,"align":"right"}},{"type":"Label","props":{"y":310,"x":350,"wordWrap":true,"width":250,"var":"heroOrigin","text":"暗示法法师打发大发送到发送阿斯达发送到发送到按时按时发送到","padding":"5,0,0,5","height":85,"fontSize":18,"font":"SimHei","color":"#d7e6ff","align":"left"}},{"type":"Panel","props":{"y":464,"x":18,"width":562,"var":"skill_panel","height":367},"child":[{"type":"Image","props":{"y":6,"x":-7,"width":298,"skin":"ui_hero/img-tongyong-taitou-1.png","sizeGrid":"15,20,20,15","height":26},"child":[{"type":"Label","props":{"y":2,"x":92,"text":"队长技能","fontSize":20,"color":"#dde2f2","align":"center"}}]},{"type":"Label","props":{"y":44,"x":0,"width":550,"height":115,"bgColor":"#262449","alpha":1},"child":[{"type":"Image","props":{"x":10,"width":70,"var":"Teamskill_Icon","height":70,"centerY":0}},{"type":"Label","props":{"y":18,"x":93,"width":264,"var":"skill_Name","text":"sword master","height":22,"fontSize":20,"font":"SimHei","color":"#fbffd6"}},{"type":"HTMLDivElement","props":{"y":42,"x":89,"width":454,"var":"skill_Origin","height":69}}]},{"type":"Image","props":{"y":170,"x":0,"width":298,"skin":"ui_hero/img-tongyong-taitou-1.png","sizeGrid":"15,20,20,15","height":26},"child":[{"type":"Label","props":{"y":2,"x":92,"text":"被动技能","fontSize":20,"color":"#dde2f2","align":"center"}}]},{"type":"List","props":{"y":204,"x":0,"width":550,"var":"skill_List","spaceY":10,"renderType":"render","height":640},"child":[{"type":"Box","props":{"y":0,"x":0,"width":550,"renderType":"render","height":94},"child":[{"type":"Label","props":{"y":0,"x":0,"width":550,"height":94,"bgColor":"#5b335d","alpha":1}},{"type":"Image","props":{"y":12,"x":6,"width":76,"skin":"ui_main/btn-zhu-shangcheng.png","sizeGrid":"15,15,15,15","renderType":"render","name":"skill_Icon","height":76}},{"type":"Label","props":{"y":12,"x":89,"width":400,"renderType":"render","name":"skill_Name","height":23,"fontSize":20,"color":"#fbffd6"}},{"type":"HTMLDivElement","props":{"y":40,"x":89,"width":434,"name":"skill_Base","height":26}},{"type":"Label","props":{"y":12,"x":6,"width":76,"visible":true,"name":"SkillLock","height":76,"bgColor":"#20263e","alpha":0.9}},{"type":"Label","props":{"y":24,"x":21,"text":"解锁","strokeColor":"#000000","stroke":2,"name":"openlock","fontSize":22,"font":"SimHei","color":"#e03535","align":"left"}},{"type":"Label","props":{"y":47,"x":8,"text":"lv.100","strokeColor":"#000000","stroke":2,"name":"SkillLv","fontSize":20,"font":"SimHei","color":"#e03535","align":"left"}}]}]}]},{"type":"Button","props":{"y":111,"x":257,"width":72,"var":"hero_peck","stateNum":1,"skin":"ui_main/btn-zhujiemian-yingxiongjinjie.png","labelSize":20,"labelFont":"SimHei","labelColors":"#fefeff","label":"礼包","height":72,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":69,"x":-5,"width":68,"var":"peck_time","strokeColor":"#506084","stroke":2,"height":22,"fontSize":16,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":-3,"x":38,"visible":false,"var":"heropeck_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Label","props":{"y":286,"x":354,"width":174,"text":"英雄简介:","height":29,"fontSize":20,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":459,"x":18,"width":550,"height":2,"bgColor":"#262449"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.heroList.Hero_AlInfoUI.uiView);

        }

    }
}

module ui.loading {
    export class ChangeSceneViewUI extends View {
		public backGround:Laya.Image;
		public img_bg:Laya.Image;
		public img_sign:Laya.Image;
		public scene_name:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"var":"backGround","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"img_bg","top":0,"skin":"ui_noPack/login_background.png","right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":752,"x":10,"width":750,"skin":"ui_login/login_foreground.png","height":448,"bottom":0}},{"type":"Label","props":{"text":"Powered by LayaAir Engine","left":40,"fontSize":18,"font":"SimHei","color":"#bfc0b2","bottom":30}}]},{"type":"Label","props":{"top":-100,"right":-100,"mouseThrough":false,"mouseEnabled":false,"left":-100,"bottom":-100,"bgColor":"#000000","alpha":0.6}},{"type":"Image","props":{"y":188,"skin":"ui_login/img-qihuan-guanka.png","centerX":0},"child":[{"type":"Image","props":{"y":16,"x":32,"width":136,"height":148},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_login/icon-haiditieshi--guanka.png","renderType":"mask"}},{"type":"Image","props":{"y":0,"x":0,"var":"img_sign","skin":"ui_login/icon-haiditieshi--guanka.png"}}]},{"type":"Label","props":{"y":87,"x":349,"var":"scene_name","text":"东方古街","fontSize":60,"font":"SimHei","color":"#ffffff","anchorY":0.5,"anchorX":0.5,"align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.loading.ChangeSceneViewUI.uiView);

        }

    }
}

module ui.loading {
    export class LoadingViewUI extends View {
		public backGround:Laya.Image;
		public loadingtxt:Laya.Label;
		public sliderValue:Laya.Image;
		public logoicon:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"backGround","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"width":469,"var":"loadingtxt","text":"加载中...","strokeColor":"#3a3245","stroke":4,"height":33,"fontSize":33,"font":"SimHei","color":"#fffaec","centerX":6,"bottom":342,"bold":true,"align":"center"}},{"type":"Label","props":{"width":592,"height":26,"centerX":2,"bottom":309,"bgColor":"#1a1225","alpha":0.8}},{"type":"Image","props":{"y":867,"x":82,"width":1,"visible":true,"var":"sliderValue","skin":"ui_login/img-jindutiao-tongyong.png","height":23,"bottom":310,"anchorY":0,"anchorX":0}},{"type":"Label","props":{"text":"Powered by LayaAir Engine","left":40,"fontSize":18,"font":"SimHei","color":"#bfc0b2","bottom":30}},{"type":"Image","props":{"y":157,"var":"logoicon","scaleY":2,"scaleX":2,"centerX":5,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":0,"width":750,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","strokeColor":"#000000","stroke":3,"right":0,"left":0,"height":58,"fontSize":25,"color":"#ffffff","bottom":64,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.loading.LoadingViewUI.uiView);

        }

    }
}

module ui.login {
    export class CreateViewUI extends View {
		public backGround:Laya.Image;
		public bgImg:Laya.Image;
		public suipianeffect:View;
		public xingxingmod:View;
		public heromod:View;
		public stareffect:View;
		public input:Laya.TextInput;
		public rBtn:Laya.Button;
		public loginBtn:Laya.Button;
		public countlabel:Laya.Label;
		public logoicon:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"backGround","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"var":"bgImg","top":0,"skin":"ui_noPack/login_background.png","right":0,"left":0,"bottom":0}},{"type":"View","props":{"y":940,"x":410,"var":"suipianeffect"}},{"type":"View","props":{"y":1018,"x":535,"var":"xingxingmod"}},{"type":"Image","props":{"y":752,"x":0,"width":750,"skin":"ui_login/login_foreground.png","height":448,"bottom":0}},{"type":"View","props":{"x":182,"var":"heromod","bottom":67}},{"type":"View","props":{"x":182,"var":"stareffect","bottom":67}},{"type":"Image","props":{"x":193,"skin":"ui_common/img-gaiming-bg-chuangjue.png","centerX":3,"bottom":301}},{"type":"TextInput","props":{"width":285,"var":"input","valign":"middle","type":"text","promptColor":"#bfc0b2","prompt":"请输入角色名","maxChars":12,"height":54,"fontSize":29,"font":"SimHei","color":"#bfc0b2","centerX":-35,"bottom":324,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"var":"rBtn","stateNum":1,"skin":"ui_common/btn-suijin-mingzi.png","mouseEnabled":true,"centerX":150,"bottom":308}},{"type":"Button","props":{"var":"loginBtn","stateNum":1,"skin":"ui_common/btn-kaishi-chuangjue.png","sizeGrid":"20,20,20,20","mouseEnabled":true,"labelStrokeColor":"#d3383a","labelStroke":4,"labelSize":37,"labelPadding":"-1","labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","label":"开始游戏","centerX":7,"bottom":203,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":209,"width":346,"var":"countlabel","strokeColor":"#14151b","stroke":4,"height":36,"fontSize":36,"font":"SimHei","color":"#fffaec","bottom":135,"bold":true,"align":"center"}},{"type":"Image","props":{"y":157,"var":"logoicon","scaleY":2,"scaleX":2,"centerX":5,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":58,"text":"Powered by LayaAir Engine","fontSize":20,"font":"SimHei","color":"#bfc0b2","bottom":30}},{"type":"Label","props":{"width":750,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","strokeColor":"#000000","stroke":3,"right":0,"left":0,"height":58,"fontSize":25,"color":"#ffffff","bottom":64,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.login.CreateViewUI.uiView);

        }

    }
}

module ui.login {
    export class GetScopeViewUI extends View {
		public backGround:Laya.Image;
		public logoicon:Laya.Image;
		public suipianeffect:View;
		public xingxingmod:View;
		public heromod:View;
		public stareffect:View;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":10,"x":10,"var":"backGround","top":0,"skin":"ui_noPack/login_background.png","right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":752,"x":10,"width":750,"skin":"ui_login/login_foreground.png","height":448,"bottom":0}},{"type":"Label","props":{"text":"Powered by LayaAir Engine","left":40,"fontSize":18,"font":"SimHei","color":"#bfc0b2","bottom":30}},{"type":"Image","props":{"y":157,"var":"logoicon","scaleY":2,"scaleX":2,"centerX":5,"anchorY":0.5,"anchorX":0.5}},{"type":"View","props":{"y":940,"x":410,"var":"suipianeffect"}},{"type":"View","props":{"y":1018,"x":535,"var":"xingxingmod"}},{"type":"View","props":{"x":182,"var":"heromod","bottom":67}},{"type":"View","props":{"x":182,"var":"stareffect","bottom":67}},{"type":"Label","props":{"width":750,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","strokeColor":"#000000","stroke":3,"right":0,"left":0,"height":58,"fontSize":25,"color":"#ffffff","bottom":64,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.login.GetScopeViewUI.uiView);

        }

    }
}

module ui.login {
    export class InitialHeroViewUI extends View {
		public bg:Laya.Image;
		public txt_information:laya.display.Text;
		public txt_name:laya.display.Text;
		public txt_introduce:laya.display.Text;
		public txt_time:laya.display.Text;
		public hero_0:Laya.Image;
		public hero_1:Laya.Image;
		public hero_2:Laya.Image;
		public btn_define:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000"}},{"type":"Image","props":{"y":0,"x":0,"var":"bg","top":0,"skin":"ui_noPack/ui-daguo-bgziyuanfuben.png","sizeGrid":"10,10,10,10","right":0,"left":0,"bottom":0},"child":[{"type":"Text","props":{"y":200,"x":230,"width":311,"var":"txt_information","text":"选择你的本命英雄","height":34,"fontSize":30,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Text","props":{"y":803,"x":52,"width":180,"var":"txt_name","text":"英三嘉哥","height":32,"fontSize":32,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}},{"type":"Text","props":{"y":850,"x":52,"wordWrap":true,"width":655,"var":"txt_introduce","text":"百度贴吧第一个18级用户，贴吧妹子团创始人，被喻为贴吧第一人","leading":10,"height":164,"fontSize":28,"font":"SimHei","color":"#ffffff"}},{"type":"Text","props":{"y":1150,"x":536,"width":212,"var":"txt_time","text":"进入游戏：100s","height":34,"fontSize":30,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"width":61,"skin":"ui_main/ui_mainbtn-xialai.png","scaleY":-1,"height":41,"centerY":197,"centerX":-4,"alpha":0.7}},{"type":"Image","props":{"y":666,"x":142,"width":160,"var":"hero_0","skin":"ui_hero/img-yingxiong-tuozhaua-bg.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-182,"x":-8,"width":173,"skin":"ui_consumer/img-zhuanpan-be-huoidong.png","height":187,"alpha":0.8}},{"type":"Image","props":{"y":-182,"x":-8,"width":176,"name":"img_bg","mouseEnabled":true,"height":243}}]},{"type":"Image","props":{"y":666,"x":376,"width":160,"var":"hero_1","skin":"ui_hero/img-yingxiong-duizhang-bg.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-182,"x":-8,"width":173,"skin":"ui_consumer/img-zhuanpan-be-huoidong.png","height":187,"centerX":0,"alpha":0.8}},{"type":"Image","props":{"y":-182,"x":-8,"width":176,"name":"img_bg","mouseEnabled":true,"height":243}}]},{"type":"Image","props":{"y":666,"x":610,"width":160,"var":"hero_2","skin":"ui_hero/img-yingxiong-xuanzhong-bg.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-182,"x":-8,"width":173,"skin":"ui_consumer/img-zhuanpan-be-huoidong.png","height":187,"alpha":0.8}},{"type":"Image","props":{"y":-182,"x":-8,"width":176,"name":"img_bg","mouseEnabled":true,"height":243}}]},{"type":"Button","props":{"y":1067,"x":375,"width":286,"var":"btn_define","stateNum":1,"skin":"ui_common/btn-kaishi-chuangjue.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":32,"labelPadding":"-2","labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","labelAlign":"center","label":"就是你了","height":80,"centerX":0,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.login.InitialHeroViewUI.uiView);

        }

    }
}

module ui.login {
    export class LoginViewUI extends View {
		public backGround:Laya.Image;
		public accountInputBg:Laya.Image;
		public accountInput:Laya.TextInput;
		public rBtn:Laya.Button;
		public loginBtn:Laya.Button;
		public logoicon:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"backGround","top":0,"skin":"ui_noPack/login_background.png","right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":752,"x":10,"width":750,"skin":"ui_login/login_foreground.png","height":448,"bottom":0}},{"type":"Image","props":{"y":808,"x":193,"var":"accountInputBg","skin":"ui_common/img-gaiming-bg-chuangjue.png","centerX":3}},{"type":"TextInput","props":{"y":849,"width":285,"var":"accountInput","valign":"middle","type":"text","text":"请输入角色名","promptColor":"#bfc0b2","maxChars":12,"height":54,"fontSize":29,"font":"SimHei","color":"#bfc0b2","centerX":-35,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"y":805,"x":480,"var":"rBtn","stateNum":1,"skin":"ui_common/btn-suijin-mingzi.png","mouseEnabled":true,"centerX":150}},{"type":"Button","props":{"y":957,"var":"loginBtn","stateNum":1,"skin":"ui_common/btn-kaishi-chuangjue.png","sizeGrid":"20,20,20,20","mouseEnabled":true,"labelStrokeColor":"#d3383a","labelStroke":4,"labelSize":37,"labelPadding":"-1","labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","label":"开始游戏","centerX":7,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"text":"Powered by LayaAir Engine","left":40,"fontSize":18,"font":"SimHei","color":"#bfc0b2","bottom":30}},{"type":"Image","props":{"y":157,"var":"logoicon","scaleY":2,"scaleX":2,"centerX":5,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"width":750,"text":"抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。\\n适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。","strokeColor":"#000000","stroke":3,"right":0,"left":0,"height":58,"fontSize":25,"color":"#ffffff","bottom":64,"align":"center"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.login.LoginViewUI.uiView);

        }

    }
}

module ui.Mail {
    export class MailLineViewUI extends View {
		public btn:Laya.Image;
		public mailTitle:Laya.Label;
		public notRead:Laya.Label;
		public lastTime:Laya.Label;
		public mailContent:Laya.Label;
		public itemImg:Laya.Image;
		public mailReciveTime:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":622,"height":122},"child":[{"type":"Box","props":{"y":0,"x":0,"renderType":"render"},"child":[{"type":"Image","props":{"width":626,"var":"btn","skin":"ui_mail/ui-liebiao-bg-youjian.png","sizeGrid":"4,11,10,3","height":102}},{"type":"Label","props":{"y":11,"x":111,"var":"mailTitle","text":"PVP联赛活动奖励","fontSize":23,"font":"SimHei","color":"#46506b","bold":true,"align":"left"}},{"type":"Label","props":{"y":42,"x":108,"var":"notRead","text":"未读","fontSize":22,"font":"SimHei","color":"#377b51","align":"left"}},{"type":"Label","props":{"y":12,"x":490,"var":"lastTime","text":"有效期:30天","fontSize":18,"font":"SimHei","color":"#596072","bold":true,"align":"left"}},{"type":"Label","props":{"y":66,"x":105,"wordWrap":true,"width":406,"var":"mailContent","leading":4,"height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":14,"x":542,"skin":"ui_camp/img-huawen2.png","alpha":0.6}},{"type":"Image","props":{"y":10,"x":21,"width":76,"skin":"ui_mail/img-youjian-youjian.png","height":76}},{"type":"Image","props":{"y":43,"x":563,"width":38,"var":"itemImg","skin":"ui_mail/img-liwu-youjian.png","height":42}},{"type":"Label","props":{"y":11,"x":384,"var":"mailReciveTime","text":"2018.09.27","fontSize":20,"font":"SimHei","color":"#596072","align":"left"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.Mail.MailLineViewUI.uiView);

        }

    }
}

module ui.Mail {
    export class MailTipViewUI extends View {
		public returnImg:Laya.Label;
		public aFFixBox:Laya.Box;
		public list:Laya.List;
		public mailTitle:Laya.Label;
		public mailReciveTime:Laya.Label;
		public mailContent:laya.html.dom.HTMLDivElement;
		public operationBtn:Laya.Box;
		public operationBtn0:Laya.Button;
		public btnLab:Laya.Label;
		public closeBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":-900,"x":-1125,"width":3000,"var":"returnImg","height":3000,"centerY":0,"centerX":0,"bgColor":"#000000","alpha":0.6}},{"type":"Button","props":{"y":153,"x":84,"width":590,"label":"label","height":679}},{"type":"Label","props":{"y":191,"x":84,"width":590,"mouseThrough":false,"height":640,"bgColor":"#c2c1ca","alpha":1}},{"type":"Image","props":{"y":152,"x":84,"width":590,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"2,0,1,0","mouseThrough":false,"height":44},"child":[{"type":"Label","props":{"x":45,"text":"邮件","fontSize":24,"font":"SimHei","color":"#e4eafe","centerY":0,"align":"left"}},{"type":"Label","props":{"x":21,"width":6,"height":27,"centerY":0,"bgColor":"#df8e2f","alpha":1}}]},{"type":"Box","props":{"y":601,"x":124,"var":"aFFixBox"},"child":[{"type":"Image","props":{"width":512,"skin":"ui_common/img-jichushuxing-bg.png","sizeGrid":"10,10,10,10","height":106},"child":[{"type":"List","props":{"y":11,"x":23,"width":479,"var":"list","spaceX":16,"height":83},"child":[{"type":"Box","props":{"renderType":"render","name":"render"},"child":[{"type":"Button","props":{"width":80,"name":"btn","height":80}},{"type":"Label","props":{"y":0,"x":0,"width":84,"height":84,"color":"#20263e"}},{"type":"Label","props":{"y":0,"x":0,"width":84,"name":"bgImg","height":84,"color":"#20263e"}},{"type":"Image","props":{"y":1,"x":2,"width":80,"visible":true,"skin":"ui_icon/icon_shili.png","name":"quaImg","height":80}},{"type":"Image","props":{"y":1,"x":2,"width":80,"visible":true,"skin":"ui_icon/icon_shili.png","name":"img","height":80}},{"type":"Label","props":{"y":62,"x":6,"width":74,"text":"12","strokeColor":"#000000","stroke":2,"name":"num","height":16,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Label","props":{"y":86,"x":3,"width":78,"text":"12","name":"name","height":16,"fontSize":20,"font":"SimHei","color":"#ffffff","align":"center"}}]}]}]}]},{"type":"Box","props":{"y":558,"x":92,"width":577,"height":173},"child":[{"type":"Image","props":{"y":-1,"x":14,"width":297,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":27}},{"type":"Label","props":{"y":2,"x":36.99999999999977,"text":"附件","fontSize":22,"font":"SimHei","color":"#e4eafe","align":"left"}},{"type":"Label","props":{"x":15.999999999999773,"width":7,"height":25,"bgColor":"#df8e2f","alpha":1}},{"type":"Image","props":{"y":188,"x":496.9999999999998,"skin":"ui_camp/img-huawen2.png","alpha":0.3}},{"type":"Image","props":{"y":164,"x":567.9999999999998,"width":2,"skin":"ui_shop/img-jianbian-choujiang.png","skewY":-90,"skewX":-90,"height":568}},{"type":"Image","props":{"y":-281,"x":77,"skin":"ui_camp/img-huawen2.png","skewY":-90,"skewX":-90,"alpha":0.3}}]},{"type":"Box","props":{"y":236,"x":86},"child":[{"type":"Label","props":{"y":1,"x":47,"var":"mailTitle","text":"PVP联赛活动奖励","fontSize":20,"font":"SimHei","color":"#225a88","align":"left"}},{"type":"Label","props":{"y":274,"x":446,"var":"mailReciveTime","text":"2018.09.27","fontSize":20,"font":"SimHei","color":"#20201f","align":"left"}},{"type":"HTMLDivElement","props":{"y":38,"x":51,"width":478,"var":"mailContent","height":175}}]},{"type":"Box","props":{"y":752,"x":302,"width":185,"var":"operationBtn"},"child":[{"type":"Button","props":{"width":186,"var":"operationBtn0","stateNum":1,"skin":"ui_main/btn-zhu-zhuangbei.png","sizeGrid":"0,1,0,1","labelSize":28,"labelFont":"SimHei","labelBold":true,"labelAlign":"center","height":50},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Label","props":{"y":13,"x":0,"width":186,"var":"btnLab","text":"领取","strokeColor":"#095a28","stroke":2,"mouseThrough":true,"height":26,"fontSize":26,"font":"SimHei","color":"#fefeff","bold":true,"align":"center"}}]},{"type":"Button","props":{"width":47,"var":"closeBtn","top":154,"stateNum":1,"skin":"ui_common/btn-X-tongyong.png","left":610,"height":44}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.Mail.MailTipViewUI.uiView);

        }

    }
}

module ui.Mail {
    export class MailViewUI extends View {
		public capacityLab:laya.html.dom.HTMLDivElement;
		public leftBg:Laya.Image;
		public mailBox:Laya.Box;
		public mailList:Laya.List;
		public mailPanel:Laya.Panel;
		public noMailLab:Laya.Image;
		public MailLab:Laya.Label;
		public delAll:Laya.Button;
		public getAll:Laya.Button;
		public closeBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Box","props":{"width":689,"height":999,"centerY":0,"centerX":0},"child":[{"type":"Box","props":{"y":14,"name":"t","centerX":0},"child":[{"type":"Label","props":{"y":-4,"x":0,"width":660,"height":50,"bgColor":"#1b2838","alpha":1},"child":[{"type":"Label","props":{"x":18,"width":6,"height":24,"centerY":0,"bgColor":"#5d4565","alpha":1}},{"type":"Label","props":{"x":40,"text":"邮件","fontSize":25,"font":"SimHei","color":"#d6d7dd","centerY":0,"bold":true,"align":"left"}}]},{"type":"HTMLDivElement","props":{"y":2,"x":148,"width":100,"var":"capacityLab","height":21}},{"type":"Label","props":{"y":45,"x":0,"width":660,"mouseThrough":false,"height":900,"bgColor":"#616985"}},{"type":"Image","props":{"y":846,"x":24,"skin":"ui_camp/img-huawen1.png","skewX":180,"alpha":0.5}}]},{"type":"Box","props":{"y":54,"width":660,"height":900,"centerX":0},"child":[{"type":"Image","props":{"width":660,"var":"leftBg","skin":"","height":900}}]},{"type":"Box","props":{"y":66,"x":41,"var":"mailBox"},"child":[{"type":"List","props":{"y":0,"x":0,"width":626,"visible":false,"var":"mailList","spaceY":20,"height":791},"child":[{"type":"Box","props":{"renderType":"render"},"child":[{"type":"Image","props":{"width":626,"skin":"ui_mail/ui-liebiao-bg-youjian.png","sizeGrid":"4,11,10,3","name":"btn","height":102}},{"type":"Label","props":{"y":11,"x":111,"text":"PVP联赛活动奖励","name":"mailTitle","fontSize":23,"font":"SimHei","color":"#46506b","bold":true,"align":"left"}},{"type":"Label","props":{"y":42,"x":108,"text":"未读","name":"notRead","fontSize":22,"font":"SimHei","color":"#377b51","align":"left"}},{"type":"Label","props":{"y":12,"x":490,"text":"有效期:30天","name":"lastTime","fontSize":18,"font":"SimHei","color":"#596072","bold":true,"align":"left"}},{"type":"Label","props":{"y":66,"x":105,"wordWrap":true,"width":406,"name":"mailContent","leading":4,"height":18,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Image","props":{"y":10,"x":21,"width":76,"skin":"ui_mail/img-youjian-youjian.png","height":76}},{"type":"Image","props":{"y":43,"x":563,"width":38,"skin":"ui_mail/img-liwu-youjian.png","name":"itemImg","height":42}},{"type":"Label","props":{"y":11,"x":384,"text":"2018.09.27","name":"mailReciveTime","fontSize":20,"font":"SimHei","color":"#596072","align":"left"}}]}]},{"type":"Panel","props":{"width":626,"var":"mailPanel","height":791}}]},{"type":"Image","props":{"y":366,"x":204,"width":304,"var":"noMailLab","height":172},"child":[{"type":"Label","props":{"y":73,"x":-2,"width":303,"var":"MailLab","text":"当前无邮件","height":55,"fontSize":50,"font":"SimHei","color":"#373851","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":905,"x":199,"width":356,"var":"delAll","stateNum":1,"skin":"ui_action/btn-toupiao-zhichi-huodong.png","sizeGrid":"0,55,0,63","labelSize":28,"labelFont":"SimHei","labelBold":true,"labelAlign":"center","height":86,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":22,"x":74,"text":"一键删除","mouseThrough":true,"fontSize":40,"font":"SimHei","color":"#491a22","bold":true,"align":"left"}}]},{"type":"Button","props":{"y":905,"x":507,"width":352,"var":"getAll","stateNum":1,"skin":"ui_action/btn-toupiao-fandui-huodong.png","sizeGrid":"0,55,0,63","height":86,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":22,"x":115,"text":"一键领取","mouseThrough":true,"fontSize":40,"font":"SimHei","color":"#491a22","bold":true,"align":"left"}}]},{"type":"Button","props":{"y":30,"x":642,"var":"closeBtn","stateNum":1,"skin":"ui_main/btn-guanbi.png","anchorY":0.5,"anchorX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.Mail.MailViewUI.uiView);

        }

    }
}

module ui.main {
    export class ItemToolViewUI extends View {
		public backGround:Laya.Image;
		public tipstext:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"var":"backGround","height":1200},"child":[{"type":"Label","props":{"y":58,"x":38,"width":548,"visible":true,"var":"tipstext","text":"啦啦啦德玛西亚","strokeColor":"#000000","stroke":3,"height":691,"fontSize":29,"font":"SimHei","color":"#f3f3f3","bold":true,"align":"left"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.ItemToolViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListActionViewUI extends View {
		public actionList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1108},"child":[{"type":"Image","props":{"width":750,"height":1020},"child":[{"type":"Label","props":{"y":0,"x":0,"wordWrap":false,"width":750,"height":1108,"bgColor":"#0c0908","alpha":0.8}},{"type":"List","props":{"y":10,"x":10,"width":735,"var":"actionList","spaceY":8,"height":1020},"child":[{"type":"Box","props":{"y":80,"x":365,"width":730,"renderType":"render","height":162,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"width":730,"skin":"ui_action/ui-liebiaotiao-bg-huodong.png","sizeGrid":"6,20,20,6","name":"bgImg","height":162},"child":[{"type":"Image","props":{"y":1,"x":1,"width":727,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"1,1,1,1","height":38}},{"type":"Image","props":{"y":6,"x":11,"width":4,"skin":"ui_action/ui-daojishi-bg-huodong.png","height":28}}]},{"type":"Image","props":{"y":53,"x":0,"width":548,"name":"img_reward","height":100}},{"type":"Text","props":{"y":3,"x":29,"width":110,"valign":"middle","text":"话题先锋","name":"txt_action_name","height":32,"fontSize":26,"font":"SimHei","color":"#f6d6af","bold":true,"align":"left"}},{"type":"Text","props":{"y":3,"x":224,"width":461,"valign":"middle","text":"活动时间：12:00-13:00,15:00-16:00","name":"txt_action_content","height":31,"fontSize":22,"font":"SimHei","color":"#fbd4a4","bold":false,"align":"right"}},{"type":"Button","props":{"y":3,"x":143,"stateNum":1,"skin":"ui_action/btn-xiangqing-huodong.png","name":"btn_tips"}},{"type":"Button","props":{"y":20,"x":708,"visible":false,"stateNum":1,"skin":"ui_action/btn-fenxiang.png","name":"btn_share","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":100,"x":631,"width":162,"stateNum":1,"skin":"ui_action/btn-huodong-p.png","name":"btn_attend","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"参加","height":70,"gray":false,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":39,"x":4,"skin":"ui_action/img-anniudaojishi-huodong.png","name":"attend_time"},"child":[{"type":"Text","props":{"y":3,"x":0,"width":152,"valign":"middle","text":"12:00:00","name":"txt_remaning","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"right"}}]},{"type":"Text","props":{"y":42,"x":6,"width":151,"valign":"middle","text":"100级开启","name":"txt_condition","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"center"}},{"type":"Image","props":{"y":-6,"x":142,"visible":false,"skin":"ui_common/img-tixing.png","name":"red_point"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.main.list.ListActionViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListEquipViewUI extends View {
		public E_list:Laya.List;
		public E_mynum:Laya.Label;
		public btn_4:Laya.Button;
		public o4:Laya.Image;
		public icon4:Laya.Image;
		public name4:Laya.Label;
		public red_4:Laya.Image;
		public E_4:Laya.Image;
		public btn_5:Laya.Button;
		public o5:Laya.Image;
		public icon5:Laya.Image;
		public name5:Laya.Label;
		public red_5:Laya.Image;
		public E_5:Laya.Image;
		public btn_3:Laya.Button;
		public o3:Laya.Image;
		public icon3:Laya.Image;
		public name3:Laya.Label;
		public red_3:Laya.Image;
		public E_3:Laya.Image;
		public btn_1:Laya.Button;
		public o1:Laya.Image;
		public icon1:Laya.Image;
		public name1:Laya.Label;
		public red_1:Laya.Image;
		public E_1:Laya.Image;
		public btn_2:Laya.Button;
		public o2:Laya.Image;
		public icon2:Laya.Image;
		public red_2:Laya.Image;
		public name2:Laya.Label;
		public E_2:Laya.Image;
		public E_make:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1108},"child":[{"type":"List","props":{"y":120,"var":"E_list","spaceY":5,"right":0,"renderType":"render","left":0,"height":991},"child":[{"type":"Box","props":{"y":0,"x":10,"width":730,"renderType":"render","height":90},"child":[{"type":"Image","props":{"y":0,"x":0,"top":0,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"0,0,15,0","right":0,"name":"bg","left":0,"bottom":0}},{"type":"Image","props":{"y":30,"x":566,"skin":"ui_hero/img-zhuangshi-tangchuchuang.png"}},{"type":"Image","props":{"y":0,"x":660,"skin":"ui_common/img-huawen2.png","right":0}},{"type":"Image","props":{"y":0,"x":87,"skin":"ui_common/img-huawen1.png"}},{"type":"Image","props":{"y":2,"x":0,"width":84,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"E_pinzhi","height":84}},{"type":"Image","props":{"y":2,"x":0,"width":84,"skin":"ui_icon/2.png","name":"e_icon","height":84}},{"type":"Label","props":{"y":5,"x":130,"text":"手套","name":"e_name","fontSize":20,"font":"SimHei","align":"left"}},{"type":"HTMLDivElement","props":{"y":35,"x":130,"width":130,"name":"e_lv","innerHTML":"htmlText","height":23}},{"type":"Label","props":{"y":65,"x":130,"name":"e_base","mouseThrough":true,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":28,"x":501,"width":44,"visible":false,"text":"活动","name":"Equep_Quality","height":25,"fontSize":20,"font":"SimHei"}},{"type":"Button","props":{"y":45,"x":640,"width":162,"stateNum":1,"skin":"ui_common/btn-huodong-p.png","sizeGrid":"15,0,3,0","name":"btn_use","labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"佩戴","height":68,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":0,"x":2,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"red"},"child":[{"type":"Label","props":{"y":1,"x":5,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":33,"x":598,"visible":false,"text":"已佩戴","name":"used","fontSize":28,"font":"SimHei","color":"#d38343","bold":true,"align":"left"}}]}]},{"type":"Box","props":{"y":34,"x":0,"width":750,"height":80},"child":[{"type":"Label","props":{"x":0,"top":0,"right":0,"left":0,"bottom":3,"bgColor":"#2c2129","alpha":0.7}},{"type":"Label","props":{"y":-28,"x":108,"text":"时空法器","fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":-28,"x":10,"var":"E_mynum","fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Button","props":{"y":38,"x":419,"width":118,"var":"btn_4","height":76,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":0,"width":118,"var":"o4","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":72}},{"type":"Image","props":{"y":5,"x":15,"var":"icon4","skin":"ui_equip/img-rongqi-weizhuangbei-faqi.png","pivotY":-8,"pivotX":-27}},{"type":"Label","props":{"y":3,"x":118,"width":2,"height":77,"bgColor":"#232522"}},{"type":"Label","props":{"y":55,"x":42,"var":"name4","text":"容器","fontSize":24,"font":"SimHei","color":"#89848a","align":"left"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"red_4","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"y":5,"x":40,"width":50,"var":"E_4","height":50}}]},{"type":"Button","props":{"y":38,"x":539,"width":118,"var":"btn_5","height":76,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":0,"width":118,"var":"o5","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":72}},{"type":"Image","props":{"y":5,"x":15,"width":36,"var":"icon5","skin":"ui_equip/img-ling-weizhuangbei-faqi.png","pivotY":-8,"pivotX":-27,"height":36}},{"type":"Label","props":{"y":3,"x":118,"width":2,"height":77,"bgColor":"#232522"}},{"type":"Label","props":{"y":55,"x":42,"width":40,"var":"name5","text":"灵","height":20,"fontSize":24,"font":"SimHei","color":"#89848a","align":"center"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"red_5","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"y":5,"x":40,"width":50,"var":"E_5","height":50}}]},{"type":"Button","props":{"y":38,"x":298,"width":118,"var":"btn_3","height":76,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":0,"width":118,"var":"o3","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":72}},{"type":"Image","props":{"y":5,"x":15,"var":"icon3","skin":"ui_equip/img-juanzhou-weizhuangbei-faqi.png","pivotY":-8,"pivotX":-27}},{"type":"Label","props":{"y":3,"x":119,"width":2,"height":77,"bgColor":"#232522"}},{"type":"Label","props":{"y":55,"x":42,"var":"name3","text":"卷轴","fontSize":24,"font":"SimHei","color":"#89848a"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"red_3","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"y":5,"x":40,"width":50,"var":"E_3","height":50}}]},{"type":"Button","props":{"y":38,"x":59,"width":118,"var":"btn_1","height":76,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":0,"width":118,"var":"o1","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":72}},{"type":"Image","props":{"y":5,"x":16,"var":"icon1","skin":"ui_equip/img-shoutou-weizhuangbei-faqi.png","pivotY":-8,"pivotX":-27}},{"type":"Label","props":{"y":3,"x":118,"width":2,"height":77,"bgColor":"#232522"}},{"type":"Label","props":{"y":55,"x":35,"var":"name1","text":"手套","fontSize":24,"font":"SimHei","color":"#89848a","align":"left"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"red_1","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Image","props":{"y":5,"x":40,"width":50,"var":"E_1","height":50}}]},{"type":"Button","props":{"y":38,"x":179,"width":118,"var":"btn_2","height":76,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":4,"x":0,"width":118,"var":"o2","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":72}},{"type":"Image","props":{"y":5,"x":15,"var":"icon2","skin":"ui_equip/img-xingjie-weizhuangbei-faqi.png","pivotY":-8,"pivotX":-27}},{"type":"Label","props":{"y":3,"x":118,"width":2,"height":77,"bgColor":"#232522"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"red_2","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"Label","props":{"y":55,"x":42,"var":"name2","text":"星戒","fontSize":24,"font":"SimHei","color":"#89848a"}},{"type":"Image","props":{"y":5,"x":40,"width":50,"var":"E_2","height":50}}]},{"type":"Button","props":{"y":42,"x":672,"width":125,"var":"E_make","stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","label":"工艺","height":48,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.main.list.ListEquipViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListHeroViewUI extends View {
		public ChildBox:Laya.Box;
		public tail_lv:Laya.Label;
		public lv:Laya.Image;
		public Btn_Lv:Laya.Label;
		public view_lv:Laya.Label;
		public red_lv:Laya.Image;
		public lv_gang:Laya.Label;
		public tail_star:Laya.Label;
		public star:Laya.Image;
		public Btn_Star:Laya.Label;
		public view_star:Laya.Label;
		public red_star:Laya.Image;
		public star_gang:Laya.Label;
		public tail_handbook:Laya.Label;
		public handbook:Laya.Image;
		public Btn_handbook:Laya.Label;
		public view_handbook:Laya.Label;
		public red_handbook:Laya.Image;
		public handbook_gang:Laya.Label;
		public tail_war:Laya.Label;
		public war:Laya.Image;
		public Btn_War:Laya.Label;
		public view_war:Laya.Label;
		public war_gang:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1108},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"height":58},"child":[{"type":"Label","props":{"y":5,"x":0,"width":750,"height":48,"bgColor":"#2c2129","alpha":0.7}},{"type":"Box","props":{"y":0,"x":0,"width":0,"var":"ChildBox"}},{"type":"Label","props":{"y":0,"x":0},"child":[{"type":"Label","props":{"var":"tail_lv"},"child":[{"type":"Image","props":{"y":5,"x":17,"width":108,"visible":false,"var":"lv","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":52}},{"type":"Label","props":{"y":5,"x":17,"width":108,"visible":true,"var":"Btn_Lv","padding":"8","height":48}},{"type":"Label","props":{"y":5,"x":17,"width":108,"var":"view_lv","text":"升级","padding":"8","height":48,"fontSize":26,"font":"SimHei","color":"#d3c1aa","align":"center"}},{"type":"Image","props":{"y":0,"x":10,"width":26,"visible":false,"var":"red_lv","skin":"ui_common/img-tixing.png","height":26}},{"type":"Label","props":{"y":14,"x":34,"width":2,"visible":false,"var":"lv_gang","valign":"middle","height":25,"fontSize":18,"font":"SimHei","bgColor":"#d3c1aa","align":"center"}}]},{"type":"Label","props":{"x":206,"var":"tail_star"},"child":[{"type":"Image","props":{"y":31,"x":0,"width":108,"visible":false,"var":"star","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":52,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":29,"x":0,"width":108,"visible":true,"var":"Btn_Star","padding":"8","height":48,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":5,"x":-54,"width":108,"var":"view_star","text":"进阶","padding":"8","height":48,"fontSize":26,"font":"SimHei","color":"#9a9fb2","align":"center"}},{"type":"Image","props":{"y":0,"x":-61,"width":26,"visible":false,"var":"red_star","skin":"ui_common/img-tixing.png","height":26}},{"type":"Label","props":{"y":14,"x":-36,"width":2,"visible":false,"var":"star_gang","valign":"middle","height":25,"fontSize":18,"font":"SimHei","bgColor":"#d3c1aa","align":"center"}}]},{"type":"Label","props":{"x":287,"var":"tail_handbook"},"child":[{"type":"Image","props":{"y":5,"x":0,"width":108,"visible":false,"var":"handbook","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":52}},{"type":"Label","props":{"y":5,"x":0,"width":108,"visible":true,"var":"Btn_handbook","padding":"8","height":48}},{"type":"Label","props":{"y":5,"x":0,"width":108,"var":"view_handbook","text":"图鉴","padding":"8","height":48,"fontSize":26,"font":"SimHei","color":"#9a9fb2","align":"center"}},{"type":"Image","props":{"y":0,"x":-7,"width":26,"visible":false,"var":"red_handbook","skin":"ui_common/img-tixing.png","height":26}},{"type":"Label","props":{"y":14,"x":21,"width":2,"visible":false,"var":"handbook_gang","valign":"middle","height":25,"fontSize":18,"font":"SimHei","bgColor":"#d3c1aa","align":"center"}}]},{"type":"Label","props":{"y":0,"x":422,"var":"tail_war"},"child":[{"type":"Image","props":{"y":5,"x":0,"width":108,"visible":false,"var":"war","skin":"ui_common/btn-biaoqianye-yinxiong.png","sizeGrid":"12,11,4,16","height":52}},{"type":"Label","props":{"y":5,"x":0,"width":108,"visible":true,"var":"Btn_War","padding":"8","height":48}},{"type":"Label","props":{"y":5,"x":0,"width":108,"var":"view_war","text":"布阵","padding":"8","height":48,"fontSize":26,"font":"SimHei","color":"#9a9fb2","align":"center"}},{"type":"Label","props":{"y":14,"x":21,"width":2,"visible":false,"var":"war_gang","valign":"middle","height":25,"fontSize":18,"font":"SimHei","bgColor":"#d3c1aa","align":"center"}}]},{"type":"Label","props":{"y":8,"x":139,"width":2,"height":42,"bgColor":"#232522"}},{"type":"Label","props":{"y":8,"x":273,"width":2,"height":42,"bgColor":"#232522"}},{"type":"Label","props":{"y":8,"x":406,"width":2,"height":42,"bgColor":"#232522"}},{"type":"Label","props":{"y":8,"x":541,"width":2,"height":42,"bgColor":"#232522"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.list.ListHeroViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListPetViewUI extends View {
		public petHit:laya.display.Text;
		public info:Laya.Image;
		public UpdateTime:Laya.Label;
		public Has_num:Laya.Label;
		public Pet_iconbg:Laya.Image;
		public Pet_icon:Laya.Image;
		public Pet_lv:Laya.Label;
		public Pet_name:Laya.Label;
		public add_pethurt:Laya.Label;
		public add_herohurt:Laya.Label;
		public add_nexthurt_pet:Laya.Label;
		public add_nexthurt_hero:Laya.Label;
		public Pet_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1108},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"alpha":1},"child":[{"type":"Text","props":{"y":10,"x":23,"width":187,"var":"petHit","text":"text","height":22,"fontSize":22,"font":"SimHei","color":"#dde2f2","align":"left"}},{"type":"Image","props":{"y":2,"x":23,"var":"info","skin":"ui_action/btn-xiangqing-huodong.png"}},{"type":"Label","props":{"y":10,"x":23,"width":187,"height":22,"fontSize":22,"font":"SimHei","color":"#dde2f2"}},{"type":"Label","props":{"y":40,"x":0,"width":750,"height":98,"bgColor":"#2b2b2d","alpha":1},"child":[{"type":"Image","props":{"y":-1,"x":0,"width":171,"height":98},"child":[{"type":"Label","props":{"x":11,"width":150,"var":"UpdateTime","text":"孵化时间：00:00:00","height":22,"fontSize":16,"font":"SimHei","color":"#d6d7dd","bottom":1,"align":"left"}},{"type":"Label","props":{"y":24,"x":100,"width":47,"var":"Has_num","text":"X0","height":31,"fontSize":30,"color":"#fffef4"}},{"type":"Image","props":{"y":3,"x":12,"skin":"ui_icon/pet_egg.png"}}]},{"type":"Image","props":{"y":5,"x":181,"width":85,"var":"Pet_iconbg","skin":"ui_hero/img-lanpingzhilkuang.png","height":85},"child":[{"type":"Image","props":{"var":"Pet_icon","top":0,"skin":"ui_icon/icon_tou_cjyzm.png","right":0,"left":0,"bottom":0}},{"type":"Label","props":{"y":5,"x":98,"width":32,"text":"LV:","height":23,"fontSize":20,"font":"SimHei","color":"#99ff79","align":"left"}},{"type":"Image","props":{"y":43,"x":311,"skin":"ui_pet/img-xingzhuang-lan.png"}},{"type":"Label","props":{"y":5,"x":128,"width":66,"var":"Pet_lv","text":"405","height":23,"fontSize":20,"font":"SimHei","color":"#ffff79","align":"left"}},{"type":"Label","props":{"y":3,"x":170,"width":86,"var":"Pet_name","text":"陆咬","height":24,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":37,"x":97,"width":150,"var":"add_pethurt","text":"x100%近战英雄伤害啊啊啊","height":24,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":61,"x":97,"width":150,"var":"add_herohurt","text":"x100%近战英雄伤害啊啊啊","height":24,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":37,"x":348,"width":102,"var":"add_nexthurt_pet","text":"x100%近战英雄伤害啊啊啊","height":19,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}},{"type":"Label","props":{"y":61,"x":348,"width":102,"var":"add_nexthurt_hero","text":"x100%近战英雄伤害啊啊啊","height":19,"fontSize":18,"font":"SimHei","color":"#d6d7dd","align":"left"}}]},{"type":"Label","props":{"y":13,"x":169,"width":1,"height":76,"bgColor":"#689a6a"}}]},{"type":"List","props":{"y":138,"x":0,"width":750,"var":"Pet_list","spaceY":10,"spaceX":8,"repeatX":2,"height":932,"alpha":1},"child":[{"type":"Box","props":{"y":6,"x":8,"width":363,"renderType":"render","height":96},"child":[{"type":"Image","props":{"y":7,"x":6,"width":360,"skin":"ui_pet/img-liebiao-shenshou.png","sizeGrid":"10,215,10,35","height":86,"alpha":1}},{"type":"Image","props":{"y":7,"x":6,"width":86,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"pet_icon_bg","height":78}},{"type":"Label","props":{"y":14,"x":107,"width":33,"text":"LV:","height":23,"fontSize":20,"font":"SimHei","color":"#86e779","align":"left"}},{"type":"Label","props":{"y":14,"x":137,"width":33,"text":"405","name":"Pet_lv","height":23,"fontSize":20,"font":"SimHei","color":"#ffff79","align":"left"}},{"type":"Label","props":{"y":12,"x":175,"width":96,"text":"陆咬胶鲨","name":"Pet_name","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":43,"x":106,"width":106,"text":"宠物伤害","name":"pet_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Label","props":{"y":66,"x":106,"width":106,"text":"宠物伤害","name":"hero_hurt","height":18,"fontSize":18,"font":"SimHei","color":"#bfc7e4","align":"left"}},{"type":"Image","props":{"y":46,"x":182,"width":360,"skin":"ui_pet/img-liebiao-xuanzhong-shenshou.png","sizeGrid":"4,25,15,8","name":"choice","height":86,"anchorY":0.5,"anchorX":0.5,"alpha":1},"child":[{"type":"Image","props":{"y":17,"x":279,"skin":"ui_pet/img-liebiao-xuanzhongbiaozhi-shenshou.png","name":"pet_main"}}]},{"type":"Button","props":{"y":46,"x":181,"width":354,"name":"click","height":79,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":6,"x":5,"width":86,"skin":"ui_icon/icon_tou_atm.png","name":"Pet_icon","height":80},"child":[{"type":"Image","props":{"y":44,"x":53,"skin":"ui_shop/img-tanhao.png","name":"Pet_info"}}]},{"type":"Image","props":{"y":0,"x":-1,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"point","height":30},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.main.list.ListPetViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListRoleViewUI extends View {
		public achieven:Laya.Label;
		public achPoint:Laya.Image;
		public onMail:Laya.Label;
		public redPoint:Laya.Image;
		public setting:Laya.Label;
		public sign:Laya.Label;
		public btnHong_3:Laya.Image;
		public Camp_name:Laya.Label;
		public HeadIcon:Laya.Image;
		public vip:Laya.Image;
		public HeroName:Laya.Label;
		public HeroLevel:Laya.Label;
		public damage:Laya.Label;
		public progressbg:Laya.Image;
		public progressbar:Laya.Image;
		public progresslabel:Laya.Label;
		public ListPanel:Laya.Panel;
		public skillBox:Laya.Box;
		public list:Laya.List;
		public privilegeBox:Laya.Box;
		public privList:Laya.List;
		public eff_privilege:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1102},"child":[{"type":"Image","props":{"y":10,"x":0,"width":750,"height":58},"child":[{"type":"Label","props":{"y":5,"x":28,"width":104,"var":"achieven","valign":"middle","text":"成就","padding":"0,-13","height":48,"fontSize":20,"font":"SimHei","color":"#d5bdd9","bgColor":"#4d3a6b","align":"center"},"child":[{"type":"Label","props":{"y":4,"x":112,"width":2,"valign":"middle","height":40,"fontSize":18,"font":"SimHei","bgColor":"#a395c5","align":"center"}},{"type":"Image","props":{"y":8,"x":7,"skin":"ui_main/icon-chengjiu-renwu.png"}},{"type":"Image","props":{"y":-5,"x":84,"width":26,"visible":false,"var":"achPoint","skin":"ui_common/img-tixing.png","height":26}}]},{"type":"Label","props":{"y":5,"x":274,"width":104,"var":"onMail","valign":"middle","text":"邮件","padding":"0,-13","height":48,"fontSize":20,"font":"SimHei","color":"#9a9fb2","bgColor":"#30485c","alpha":1,"align":"center"},"child":[{"type":"Label","props":{"y":5,"x":113,"width":2,"visible":true,"valign":"middle","height":38,"fontSize":18,"font":"SimHei","bgColor":"#a395c5","align":"center"}},{"type":"Image","props":{"y":8,"x":4,"skin":"ui_main/icon-youjian-renwu.png"}},{"type":"Image","props":{"y":-5,"x":85,"width":26,"var":"redPoint","skin":"ui_common/img-tixing.png","height":26}}]},{"type":"Label","props":{"y":5,"x":398,"width":104,"var":"setting","valign":"middle","text":"设置","padding":"0,-13","height":48,"fontSize":20,"font":"SimHei","color":"#9a9fb2","bgColor":"#2b5451","alpha":1,"align":"center"},"child":[{"type":"Image","props":{"y":8,"x":5,"skin":"ui_main/icon-shezhi-renwu.png"}}]},{"type":"Label","props":{"y":5,"x":152,"width":104,"var":"sign","valign":"middle","text":"签到","padding":"0,-13","height":48,"fontSize":20,"font":"SimHei","color":"#9a9fb2","bgColor":"#30485c","alpha":1,"align":"center"},"child":[{"type":"Label","props":{"y":5,"x":113,"width":2,"visible":true,"valign":"middle","height":38,"fontSize":18,"font":"SimHei","bgColor":"#a395c5","align":"center"}},{"type":"Image","props":{"y":8,"x":4,"skin":"ui_main/icon-youjian-renwu.png"}},{"type":"Image","props":{"y":-5,"x":85,"width":26,"var":"btnHong_3","skin":"ui_common/img-tixing.png","height":26}}]}]},{"type":"Box","props":{"y":68,"x":10,"width":730,"height":96},"child":[{"type":"Image","props":{"x":0,"width":730,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"14,12,16,15","height":96}},{"type":"Label","props":{"y":7,"x":320,"width":188,"var":"Camp_name","text":"[阵营：巴拉巴拉巴拉]","height":18,"fontSize":18,"font":"SimHei","color":"#d6d7dd"}},{"type":"Image","props":{"y":-1,"skin":"ui_hero/img-zhuangshi-tongyong-liebina.png","right":0,"alpha":0.5}},{"type":"Image","props":{"y":0,"x":9,"width":93,"skin":"ui_hero/img-lanpingzhilkuang.png","height":93}},{"type":"Image","props":{"y":0,"x":9,"width":93,"var":"HeadIcon","skin":"ui_head/icon_ui_01.png","height":93}},{"type":"Image","props":{"y":8,"x":112,"var":"vip","skin":"ui_camp/icn-vip-jiemian-tongyong.png"}},{"type":"Label","props":{"y":6,"x":167,"width":145,"var":"HeroName","text":"英雄名字英雄名字","height":22,"fontSize":22,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":37,"x":113,"width":31.171875,"text":"LV:","height":20,"fontSize":20,"font":"SimHei","color":"#9be589","bold":true,"align":"left"}},{"type":"Label","props":{"y":37,"x":144,"width":80,"var":"HeroLevel","text":"999","height":20,"fontSize":20,"font":"SimHei","color":"#f4ff79","bold":true,"align":"left"}},{"type":"Label","props":{"y":8,"x":536,"text":"点击伤害：","fontSize":18,"font":"SimHei","color":"#9be589","align":"left"}},{"type":"Label","props":{"y":6,"x":625,"width":105,"var":"damage","text":"235461469","height":22,"fontSize":22,"font":"SimHei","color":"#ffff79","align":"left"}}]},{"type":"Box","props":{"y":107,"x":188,"width":537,"height":16},"child":[{"type":"Image","props":{"y":1,"x":0,"width":537,"var":"progressbg","skin":"ui_main/img-guai-xuetiao-bg.png","sizeGrid":"0,5,0,6","scaleY":0.2,"height":75},"child":[{"type":"Image","props":{"y":0,"x":0,"width":537,"var":"progressbar","skin":"ui_common/img-jindutiao-tongyong.png","sizeGrid":"0,5,0,5","height":75}}]},{"type":"Label","props":{"y":0,"x":0,"width":537,"var":"progresslabel","text":"999/100000","strokeColor":"#4b4b56","stroke":3,"height":13,"fontSize":16,"font":"SimHei","color":"#fefeff","bold":true,"align":"center"}}]},{"type":"Panel","props":{"y":168,"x":10,"width":730,"var":"ListPanel","height":940},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"skillBox"},"child":[{"type":"Image","props":{"x":233,"skin":"ui_hero/img-tongyong-taitou-1.png"}},{"type":"Label","props":{"y":3,"x":320,"text":"主动技能","fontSize":22,"font":"SimHei","color":"#dde2f2","align":"left"}},{"type":"List","props":{"y":29,"width":730,"var":"list","spaceY":10,"renderType":"render","height":380},"child":[{"type":"Box","props":{"width":730,"renderType":"render","height":87},"child":[{"type":"Image","props":{"width":730,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"14,12,16,15","height":90}},{"type":"Image","props":{"y":0,"skin":"ui_hero/img-zhuangshi-tongyong-liebina.png","skewY":180,"right":-90,"alpha":0.5}},{"type":"Image","props":{"y":5,"x":9,"width":76,"name":"skillicon","height":76}},{"type":"Label","props":{"y":6,"x":161,"text":"英雄名字","name":"skillname","fontSize":22,"font":"SimHei","color":"#fffbf1","align":"left"}},{"type":"Label","props":{"y":7,"x":97,"text":"LV:","name":"level","fontSize":20,"font":"SimHei","color":"#9be589","bold":true,"align":"left"}},{"type":"Label","props":{"y":8,"x":129,"width":69,"text":"4","name":"skilllvlabel","height":20,"fontSize":20,"font":"SimHei","color":"#f4ff79","align":"left"}},{"type":"HTMLDivElement","props":{"y":36,"x":96,"width":436,"name":"desc","innerHTML":"fdsfdsfd","height":16}},{"type":"Label","props":{"y":0,"x":1,"width":731,"visible":false,"name":"background","height":85,"bgColor":"#000000","alpha":0.45}},{"type":"Label","props":{"y":32,"x":570,"width":159,"valign":"middle","text":"已达最高级","strokeColor":"#d38343","stroke":3,"name":"maxLv","height":22,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Label","props":{"y":0,"x":0,"width":549,"name":"skillBgBtn","height":87}},{"type":"Button","props":{"y":42,"x":632,"width":165,"stateNum":1,"skin":"ui_hero/btn-huang.png","name":"unlock","mouseThrough":false,"height":75,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":34,"x":3,"wordWrap":true,"width":159,"valign":"middle","text":"解锁技能","strokeColor":"#d38343","stroke":3,"name":"btnlabel","height":22,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":-2,"x":146,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"newskill","height":30},"child":[{"type":"Label","props":{"y":1,"x":6,"width":23,"text":"新","strokeColor":"#d10805","stroke":3,"rotation":10,"height":16,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]},{"type":"HTMLDivElement","props":{"y":5,"x":1,"width":164,"name":"money","height":19}}]}]}]}]},{"type":"Box","props":{"y":406,"x":0,"visible":false,"var":"privilegeBox"},"child":[{"type":"Image","props":{"x":233,"skin":"ui_hero/img-tongyong-taitou-1.png"}},{"type":"Label","props":{"y":3,"x":320,"width":83,"text":"特权","height":22,"fontSize":22,"font":"SimHei","color":"#dde2f2","align":"center"}},{"type":"List","props":{"y":29,"width":730,"var":"privList","spaceY":10,"renderType":"render"},"child":[{"type":"Box","props":{"width":730,"renderType":"render","height":85},"child":[{"type":"Image","props":{"y":0,"x":0,"width":730,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"14,12,16,15","height":87}},{"type":"Image","props":{"skin":"ui_hero/img-zhuangshi-tongyong-liebina.png","skewY":180,"right":-90,"alpha":0.5}},{"type":"Image","props":{"y":5,"x":8,"width":76,"name":"privIcon","height":76}},{"type":"Label","props":{"y":6,"x":97,"text":"英雄名字","name":"privName","fontSize":22,"font":"SimHei","color":"#fbffd6","align":"left"}},{"type":"HTMLDivElement","props":{"y":36,"x":96,"width":436,"name":"desc","innerHTML":"fdsfdsfd","height":16}},{"type":"Label","props":{"y":0,"x":1,"width":731,"visible":false,"name":"background","height":85,"bgColor":"#000000","alpha":0.45}},{"type":"Label","props":{"y":0,"x":0,"width":549,"name":"skillBgBtn","height":87}},{"type":"Button","props":{"y":42,"x":631,"width":165,"visible":true,"stateNum":1,"skin":"ui_hero/btn-huang.png","name":"useBtn","labelStrokeColor":"#d38343","labelStroke":3,"labelSize":26,"labelPadding":"10","labelFont":"SimSun","labelColors":"#ffffff","labelBold":true,"label":"使用","height":75,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":4,"x":0,"width":164,"name":"useNumHtml","height":19}},{"type":"Label","props":{"y":57,"x":4,"width":161,"visible":false,"text":"00:00:00","strokeColor":"#d38343","stroke":2,"name":"time","height":16,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":-2,"x":145,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"discountBg","height":30},"child":[{"type":"Label","props":{"y":1,"x":0,"width":29,"text":"3折","strokeColor":"#e33735","stroke":3,"rotation":10,"name":"discount","height":20,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"center"}}]}]},{"type":"Label","props":{"y":10,"x":237,"visible":false,"text":"主动","strokeColor":"#d38343","stroke":2,"name":"bewrite","fontSize":18,"font":"SimHei","color":"#ffffff"}},{"type":"Label","props":{"y":10,"x":636,"width":69,"visible":false,"name":"useNum","height":18,"fontSize":18,"font":"SimHei","color":"#fafa85"}}]}]},{"type":"Box","props":{"y":0,"x":0,"width":730,"var":"eff_privilege","mouseEnabled":false,"height":118}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.main.list.ListRoleViewUI.uiView);

        }

    }
}

module ui.main.list {
    export class ListShopViewUI extends View {
		public backGround:Laya.Image;
		public money:Laya.Image;
		public gemTxtNum:laya.display.Text;
		public TxtNum:laya.display.Text;
		public shopPanel:Laya.Panel;
		public boxShop:ui.shop.TreasureBoxShopViewUI;
		public lotteryShop:ui.shop.LotteryShopViewUI;
		public eff_lottery:Laya.Box;
		public gemShop:ui.shop.GemShopViewUI;

        public static  uiView:any ={"type":"View","props":{"width":750,"top":0,"height":1108},"child":[{"type":"Image","props":{"var":"backGround","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"y":0,"var":"money","right":0,"left":0,"height":56},"child":[{"type":"Image","props":{"y":13,"x":348,"width":40,"skin":"ui_icon/icon_prop_012.png","height":40}},{"type":"Text","props":{"y":20,"x":80,"width":111,"var":"gemTxtNum","text":"X10000","name":"gemTxtNum","height":31,"fontSize":25,"font":"Microsoft YaHei","color":"#eaff00","bold":true}},{"type":"Text","props":{"y":19,"x":394,"width":111,"var":"TxtNum","text":"X10000","name":"TxtNum","height":31,"fontSize":25,"font":"Microsoft YaHei","color":"#eaff00","bold":true}},{"type":"Image","props":{"y":15,"x":34,"width":43,"skin":"ui_icon/icon_prop_013.png","height":35}}]},{"type":"Panel","props":{"var":"shopPanel","top":56,"right":0,"name":"shopPanel","left":0,"height":1140},"child":[{"type":"VBox","props":{},"child":[{"type":"TreasureBoxShopView","props":{"var":"boxShop","runtime":"ui.shop.TreasureBoxShopViewUI"}},{"type":"LotteryShopView","props":{"var":"lotteryShop","runtime":"ui.shop.LotteryShopViewUI"},"child":[{"type":"Box","props":{"y":0,"x":0,"width":730,"var":"eff_lottery","mouseEnabled":false,"height":587}}]},{"type":"GemShopView","props":{"var":"gemShop","runtime":"ui.shop.GemShopViewUI"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("ui.shop.TreasureBoxShopViewUI",ui.shop.TreasureBoxShopViewUI);
			View.regComponent("ui.shop.LotteryShopViewUI",ui.shop.LotteryShopViewUI);
			View.regComponent("ui.shop.GemShopViewUI",ui.shop.GemShopViewUI);

            super.createChildren();
            this.createView(ui.main.list.ListShopViewUI.uiView);

        }

    }
}

module ui.main {
    export class MainViewUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":750,"top":0,"right":0,"left":0,"height":1200,"bottom":0}};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.MainViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainAngleViewUI extends View {
		public panel:Laya.Box;
		public view:Laya.Image;
		public box:Laya.Box;
		public img_box:Laya.Image;
		public model:Laya.Box;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Box","props":{"var":"panel","top":220,"right":40,"mouseThrough":true,"left":40,"bottom":440},"child":[{"type":"Image","props":{"y":0,"x":0,"width":70,"var":"view","mouseThrough":true,"height":100,"anchorX":0.5},"child":[{"type":"Box","props":{"y":40,"x":35,"width":70,"var":"box","height":40,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-15,"x":35,"width":70,"var":"img_box","skin":"ui_main/box123.png","height":70,"anchorX":0.5}}]},{"type":"Box","props":{"y":0,"x":0,"width":70,"var":"model","height":100},"child":[{"type":"Label","props":{"y":0,"x":0,"width":70,"height":80,"alpha":0}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainAngleViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainBossViewUI extends View {
		public tips_boss:Laya.Image;
		public challenge_boss:Laya.Image;
		public fail_boss:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":108},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"var":"tips_boss","mouseThrough":true,"height":108,"alpha":1},"child":[{"type":"Image","props":{"y":0,"var":"challenge_boss","skin":"ui_main/img-bosslaixi-bg.png","sizeGrid":"5,5,5,5","right":0,"left":0,"height":108,"alpha":1},"child":[{"type":"Image","props":{"y":4,"skin":"ui_main/img-bosslaixi-meishuzi.png","centerX":0}}]},{"type":"Image","props":{"y":0,"var":"fail_boss","skin":"ui_main/img-tiaozhanshibai-bg.png","sizeGrid":"5,5,5,5","right":0,"left":0,"height":108,"alpha":1},"child":[{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-shibai.png","centerX":0}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainBossViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainBubbleViewUI extends View {
		public bubble:Laya.Image;
		public bubble_hreo:Laya.Image;
		public bubble_monster:Laya.Image;
		public bubble_pet:Laya.Image;
		public bubble_skill:Laya.Image;
		public clickPet:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"var":"bubble","right":0,"mouseThrough":true,"left":0,"height":1200,"bottom":0},"child":[{"type":"Image","props":{"y":660,"x":236,"width":180,"visible":false,"var":"bubble_hreo","skin":"ui_main/img-yingxiong-qiaopao.png","sizeGrid":"13,15,37,77","pivotX":26,"height":62,"anchorY":1},"child":[{"type":"HTMLDivElement","props":{"y":10,"x":8,"width":88,"name":"text","innerHTML":"htmlText","height":15}}]},{"type":"Image","props":{"y":438,"x":529,"width":180,"visible":false,"var":"bubble_monster","skin":"ui_main/img-guaiwu-qiaopao.png","sizeGrid":"12,75,35,9","pivotX":154,"height":64,"anchorY":1},"child":[{"type":"HTMLDivElement","props":{"y":8,"x":6,"width":89,"name":"text","innerHTML":"htmlText","height":16}}]},{"type":"Image","props":{"y":472,"x":76,"width":180,"visible":false,"var":"bubble_pet","skin":"ui_main/img-chongwu-qipao.png","sizeGrid":"11,14,36,76","pivotX":25,"height":64,"anchorY":1},"child":[{"type":"HTMLDivElement","props":{"y":6,"x":6,"width":91,"name":"text","innerHTML":"htmlText","height":15}}]},{"type":"Image","props":{"y":791,"x":304,"width":180,"visible":false,"var":"bubble_skill","skin":"ui_main/img-chongwu-qipao.png","sizeGrid":"11,14,36,76","pivotX":25,"height":64,"anchorY":1},"child":[{"type":"HTMLDivElement","props":{"y":6,"x":6,"width":91,"name":"text","innerHTML":"htmlText","height":15}}]}]},{"type":"Image","props":{"y":572,"x":99,"width":100,"var":"clickPet","height":100,"anchorY":1,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.main.subinterface.MainBubbleViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainClickViewUI extends View {
		public clickBg:Laya.Image;
		public control_box:Laya.Image;
		public gold_num:Laya.Label;
		public gold_icon:Laya.Image;
		public effect_bg:Laya.Box;
		public control_diond:Laya.Image;
		public diond_num:Laya.Label;
		public diond_icon:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"clickBg","right":0,"left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"y":280,"x":418,"width":238,"var":"control_box","sizeGrid":"8,30,8,30","height":56},"child":[{"type":"Label","props":{"y":15,"x":77,"width":165,"var":"gold_num","text":"0","strokeColor":"#3b2213","stroke":6,"height":33,"fontSize":33,"font":"SimHei","color":"#fef8e9","bold":true}},{"type":"Image","props":{"y":27,"x":30,"width":58,"var":"gold_icon","skin":"ui_common/icon_prop_012.png","height":58,"anchorY":0.5,"anchorX":0.5}},{"type":"Box","props":{"y":0,"x":0,"var":"effect_bg"}}]},{"type":"Image","props":{"y":280,"x":132,"width":238,"var":"control_diond","sizeGrid":"8,30,8,30","height":56},"child":[{"type":"Label","props":{"y":15,"x":77,"width":165,"var":"diond_num","text":"0","strokeColor":"#3b2213","stroke":6,"height":33,"fontSize":33,"font":"SimHei","color":"#fef8e9","bold":true}},{"type":"Image","props":{"y":27,"x":30,"width":55,"var":"diond_icon","skin":"ui_icon/icon_prop_013.png","height":44,"anchorY":0.5,"anchorX":0.5}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainClickViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainControlViewUI extends View {
		public Customs:Laya.Image;
		public btn_rank:Laya.Button;
		public btn_camp:Laya.Button;
		public Camp_red:Laya.Image;
		public showPet:Laya.Image;
		public showPetBg:Laya.Box;
		public btn_deploy:Laya.Button;
		public deploy_red:Laya.Image;
		public toprightbox:Laya.Box;
		public btn_week:Laya.Button;
		public btnweekred:Laya.Image;
		public btn_fund:Laya.Button;
		public fund_red:Laya.Image;
		public btn_heropeck:Laya.Button;
		public heropeck_red:Laya.Image;
		public img_tie:Laya.Image;
		public xiaotieshi:laya.display.Text;
		public tx_tie:laya.html.dom.HTMLDivElement;
		public Btn_showbox:Laya.Box;
		public btn_share:Laya.Button;
		public share_red:Laya.Image;
		public return_money:Laya.Button;
		public money_red:Laya.Image;
		public m_showred:Laya.Box;
		public btn_active1:Laya.Button;
		public action_print:Laya.Image;
		public action_eff:Laya.Box;
		public btn_frist:Laya.Button;
		public f_showred:Laya.Box;
		public frist_print:Laya.Image;
		public btn_vip:Laya.Button;
		public btnHong_3:Laya.Image;
		public e_vip:Laya.Box;
		public img_ad:Laya.Image;
		public box_ad:Laya.Box;
		public btn_ad:Laya.Button;
		public ad_red:Laya.Image;
		public tx_ad:laya.display.Text;
		public btn_moregame:Laya.Button;
		public chatbtn:Laya.Image;
		public chatbtnpoint:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"x":0,"width":750,"var":"Customs","top":0,"mouseThrough":true,"height":1200,"bottom":0},"child":[{"type":"Button","props":{"y":61,"x":53,"var":"btn_rank","stateNum":1,"skin":"ui_main/btn-paihang-shijieboss.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":38,"x":9,"text":"排行","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":61,"x":119,"var":"btn_camp","stateNum":1,"skin":"ui_main/btn-zhenyin.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":38,"x":9,"text":"阵营","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":-5,"x":33,"visible":false,"var":"Camp_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Image","props":{"y":783,"x":160,"width":1e-7,"visible":false,"var":"showPet","height":1e-7,"bottom":417},"child":[{"type":"Box","props":{"y":0,"x":0,"var":"showPetBg"}},{"type":"Button","props":{"y":0,"x":0,"width":70,"stateNum":1,"skin":"ui_icon/pet_egg.png","height":70,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":49,"x":15,"text":"神兽","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}}]}]},{"type":"Button","props":{"y":145,"x":700,"width":55,"var":"btn_deploy","stateNum":1,"skin":"ui_main/btn-zhujiemian-zhankai.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":28,"visible":false,"var":"deploy_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Box","props":{"y":0,"x":0,"var":"toprightbox","mouseThrough":true},"child":[{"type":"Button","props":{"y":220,"x":698,"var":"btn_week","stateNum":1,"skin":"ui_main/btn-zhujiemian-qiridenglu.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-3,"x":39,"visible":false,"var":"btnweekred","skin":"ui_common/img-tixing.png"}}]},{"type":"Button","props":{"y":293,"x":698,"var":"btn_fund","stateNum":1,"skin":"ui_main/btn-zhujiemian-jijin.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-3,"x":39,"visible":false,"var":"fund_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Button","props":{"y":365,"x":698,"visible":false,"var":"btn_heropeck","stateNum":1,"skin":"ui_main/btn-zhujiemian-yingxiongjinjie.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-3,"x":39,"visible":false,"var":"heropeck_red","skin":"ui_common/img-tixing.png"}}]}]},{"type":"Image","props":{"y":740,"var":"img_tie","skin":"ui_main/img-bg-xiaoieshi.png","right":-500},"child":[{"type":"Text","props":{"y":22,"x":100,"wordWrap":true,"width":292,"var":"xiaotieshi","text":"百度小贴士：","height":42,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}},{"type":"HTMLDivElement","props":{"y":46,"x":100,"width":297,"var":"tx_tie","innerHTML":"htmlText","height":22}}]},{"type":"Box","props":{"y":0,"x":0,"var":"Btn_showbox","mouseThrough":true},"child":[{"type":"Button","props":{"y":145,"x":600,"width":55,"var":"btn_share","stateNum":1,"skin":"ui_main/btn-zhujiemian-fenxiang.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-1,"x":33,"visible":false,"var":"share_red","skin":"ui_common/img-tixing.png"}}]},{"type":"Button","props":{"y":220,"x":50,"visible":false,"var":"return_money","stateNum":1,"skin":"ui_main/btn-zhujiemian-danbichongzhi.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-5,"x":33,"visible":false,"var":"money_red","skin":"ui_common/img-tixing.png"}},{"type":"Box","props":{"y":32,"x":35,"var":"m_showred"}}]},{"type":"Button","props":{"y":145,"x":119,"visible":false,"var":"btn_active1","stateNum":1,"skin":"ui_main/btn-zhujiemian-huodong.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-5,"x":33,"visible":false,"var":"action_print","skin":"ui_common/img-tixing.png"}},{"type":"Box","props":{"y":32,"x":27,"var":"action_eff"}}]},{"type":"Button","props":{"y":220,"x":49,"width":55,"visible":false,"var":"btn_frist","stateNum":1,"skin":"ui_main/btn-zhujiemian-shouchong.png","height":64,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":38,"x":9,"visible":false,"text":"设置","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}},{"type":"Box","props":{"y":32,"x":28,"var":"f_showred"}},{"type":"Image","props":{"y":-5,"x":33,"visible":false,"var":"frist_print","skin":"ui_common/img-tixing.png"}}]},{"type":"Button","props":{"y":145,"x":50,"width":55,"var":"btn_vip","stateNum":1,"skin":"ui_main/btn-zhujiemian-vip.png","height":63,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":38,"x":9,"visible":false,"text":"签到","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":-6,"x":33,"visible":false,"var":"btnHong_3","skin":"ui_common/img-tixing.png"}},{"type":"Box","props":{"y":32,"x":27,"var":"e_vip"}}]},{"type":"Image","props":{"y":182,"x":24},"child":[{"type":"Image","props":{"y":0,"x":0,"var":"img_ad"},"child":[{"type":"Box","props":{"y":28,"x":29,"width":58,"var":"box_ad","height":56,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":35,"x":27,"var":"btn_ad","stateNum":1,"skin":"ui_main/btn-zhujiemian-guanggao.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-2,"x":35,"visible":false,"var":"ad_red","skin":"ui_common/img-tixing.png"}}]}]},{"type":"Text","props":{"y":50,"x":-5,"width":64,"var":"tx_ad","text":"免费钻石","strokeColor":"#ad3700","stroke":2,"height":15,"fontSize":15,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":295,"x":50,"var":"btn_moregame","stateNum":1,"skin":"ui_wroldboss/icon-gengduoyouxi.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":789,"x":53,"var":"chatbtn","skin":"ui_main/btn-liaotian.png","bottom":380,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":1,"x":36,"visible":false,"var":"chatbtnpoint","skin":"ui_common/img-tixing.png"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.main.subinterface.MainControlViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainCounterpartViewUI extends View {
		public tatil:Laya.Label;
		public Btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"sizeGrid":"10,24,6,0","right":0,"left":0,"height":74},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908"},"child":[{"type":"Image","props":{"y":41,"x":0,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","right":0,"left":0,"height":32},"child":[{"type":"Image","props":{"y":-6,"width":167,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","right":0,"height":38}}]}]},{"type":"Label","props":{"y":46,"x":57,"width":115,"var":"tatil","valign":"middle","text":"副本标题","height":29,"fontSize":26,"font":"SimHei","color":"#feb979","bold":false,"align":"left"},"child":[{"type":"Label","props":{"y":1,"x":-25,"width":6,"height":22,"bgColor":"#4a408a"}}]},{"type":"Button","props":{"y":35,"x":668,"var":"Btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":38}},{"type":"Image","props":{"y":119,"x":23,"width":212,"name":"图标","height":45},"child":[{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":45}},{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-jianbian-huodong.png","sizeGrid":"0,1,0,1","height":45}},{"type":"Image","props":{"y":3,"x":8,"skin":"ui_action/ui-daojishi-biao-huodong.png"}},{"type":"Label","props":{"y":10,"x":57,"wordWrap":true,"width":152,"text":"倒计时:60S","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":580,"x":352,"visible":false,"skin":"ui_kicking/img-kaishi-pvp.png","anchorY":0.5,"anchorX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainCounterpartViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainCustomsViewUI extends View {
		public bg:Laya.Image;
		public icon:Laya.Box;
		public img_link_left:Laya.Image;
		public img_link_right:Laya.Image;
		public prev_customs_panel:Laya.Image;
		public prev_customs:Laya.Image;
		public prev_num:Laya.Label;
		public curr_customs_panel:Laya.Image;
		public curr_customs:Laya.Image;
		public curr_num:Laya.Label;
		public next_customs_panel:Laya.Image;
		public next_customs:Laya.Image;
		public next_num:Laya.Label;
		public middle_customs_panel:Laya.Image;
		public middle_customs:Laya.Image;
		public middle_num:Laya.Label;
		public behind_customs_panel:Laya.Image;
		public behind_customs:Laya.Image;
		public behind_num:Laya.Label;
		public effect_customs:Laya.Box;
		public custom_wave_loop:Laya.Box;
		public progress_bg:Laya.Image;
		public sign_0:Laya.Label;
		public sign_1:Laya.Label;
		public sign_2:Laya.Label;
		public sign_3:Laya.Label;
		public sign_4:Laya.Label;
		public effect_fight:Laya.Box;
		public blood:Laya.Box;
		public follow:Laya.Image;
		public blood_follow:Laya.Image;
		public blood_list:Laya.Image;
		public blood_num:Laya.Label;
		public monster_name:Laya.Label;
		public bg_bossicon:Laya.Image;
		public boss_time:Laya.Image;
		public blood_time:Laya.Label;
		public effect_head:Laya.Box;
		public time_boss:Laya.Label;
		public custom_wave_boss:Laya.Button;
		public tx_num_boss:Laya.Label;
		public effect_boss:Laya.Box;
		public bg_num:Laya.Image;
		public bg_hurt:Laya.Image;
		public Boss_hurt:Laya.Label;
		public fight_time:Laya.Image;
		public Boss_time:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":270},"child":[{"type":"Image","props":{"width":750,"var":"bg","top":0,"mouseThrough":true,"height":270,"centerX":0},"child":[{"type":"Box","props":{"y":0,"x":0,"width":750,"var":"icon","height":127},"child":[{"type":"Image","props":{"y":52,"x":272,"width":59,"var":"img_link_left","height":30,"alpha":0.8},"child":[{"type":"Image","props":{"y":6,"x":0,"skin":"ui_main/img-zhujiemian-guanka-dian.png","scaleY":0.6,"scaleX":0.6}},{"type":"Image","props":{"y":3,"x":13,"skin":"ui_main/img-zhujiemian-guanka-dian.png","scaleY":0.8,"scaleX":0.8}},{"type":"Image","props":{"y":0,"x":31,"skin":"ui_main/img-zhujiemian-guanka-dian.png"}}]},{"type":"Image","props":{"y":52,"x":430,"width":61,"var":"img_link_right","height":31,"alpha":0.8},"child":[{"type":"Image","props":{"y":6,"x":43,"skin":"ui_main/img-zhujiemian-guanka-dian.png","scaleY":0.6,"scaleX":0.6}},{"type":"Image","props":{"y":3,"x":23,"skin":"ui_main/img-zhujiemian-guanka-dian.png","scaleY":0.8,"scaleX":0.8}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-zhujiemian-guanka-dian.png"}}]},{"type":"Image","props":{"y":64,"x":239,"var":"prev_customs_panel","skin":"ui_main/img-qianhouguanka-tuo.png","centerX":-136,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-qianhouguanka-tuo.png"}},{"type":"Image","props":{"y":10,"x":8,"width":43,"var":"prev_customs","skin":"ui_main/img-hai-xiaotu.png","height":44}},{"type":"Label","props":{"y":42,"x":0,"width":60,"var":"prev_num","text":"1","strokeColor":"#4f5271","stroke":3,"height":22,"fontSize":22,"font":"SimHei","color":"#fdfbfb","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":64,"x":375,"var":"curr_customs_panel","stroke":-106,"skin":"ui_main/img-danqianguanka-tuo.png","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-danqianguanka-tuo.png"}},{"type":"Image","props":{"y":21,"x":18,"var":"curr_customs","skin":"ui_main/img-tudi-xiaotu.png"}},{"type":"Label","props":{"y":70,"x":6,"width":80,"var":"curr_num","text":"2","strokeColor":"#4f5271","stroke":3,"height":26,"fontSize":24,"font":"SimHei","color":"#fdfbfb","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":64,"x":517,"var":"next_customs_panel","skin":"ui_main/img-qianhouguanka-tuo.png","centerX":142,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-qianhouguanka-tuo.png"}},{"type":"Image","props":{"y":10,"x":8,"width":43,"var":"next_customs","skin":"ui_main/img-caopin-xiaotu.png","height":44}},{"type":"Label","props":{"y":43,"x":0,"width":60,"var":"next_num","text":"3","strokeColor":"#4f5271","stroke":3,"fontSize":22,"font":"SimHei","color":"#fdfbfb","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":64,"x":375,"visible":false,"var":"middle_customs_panel","stroke":-106,"skin":"ui_main/img-danqianguanka-tuo.png","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-danqianguanka-tuo.png"}},{"type":"Image","props":{"y":21,"x":18,"var":"middle_customs","skin":"ui_main/img-tudi-xiaotu.png"}},{"type":"Label","props":{"y":70,"x":6,"width":80,"var":"middle_num","text":"2","strokeColor":"#4f5271","stroke":3,"height":26,"fontSize":24,"font":"SimHei","color":"#fdfbfb","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":64,"x":517,"visible":false,"var":"behind_customs_panel","stroke":-106,"skin":"ui_main/img-danqianguanka-tuo.png","centerX":142,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-danqianguanka-tuo.png"}},{"type":"Image","props":{"y":21,"x":18,"var":"behind_customs","skin":"ui_main/img-tudi-xiaotu.png"}},{"type":"Label","props":{"y":70,"x":6,"width":80,"var":"behind_num","text":"2","strokeColor":"#4f5271","stroke":3,"height":26,"fontSize":24,"font":"SimHei","color":"#fdfbfb","bold":true,"align":"center"}}]},{"type":"Box","props":{"y":26,"x":340,"width":70,"var":"effect_customs","mouseThrough":true,"height":75,"anchorY":0,"anchorX":0}}]},{"type":"Box","props":{"y":125,"width":268,"visible":false,"var":"custom_wave_loop","height":60,"centerX":0},"child":[{"type":"Image","props":{"y":20,"x":30,"width":210,"var":"progress_bg","skin":"ui_main/img-jindutiao-guanka.png","height":6}},{"type":"Label","props":{"y":0,"x":0,"width":44,"var":"sign_0","height":60},"child":[{"type":"Image","props":{"y":7,"x":6,"skin":"ui_main/img-weikaiqi.png","name":"weikaiqi"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-gongjizhong.png","name":"gongjizhong"}},{"type":"Image","props":{"y":7,"skin":"ui_main/img-yidawan.png","name":"yidawan","centerX":0}},{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-guanka.png","name":"boss_weida","centerX":0}},{"type":"Image","props":{"skin":"ui_main/img-gongjizhong.png","name":"boss_kaida"},"child":[{"type":"Image","props":{"y":24,"x":22,"skin":"ui_main/img-boss-guanka.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Label","props":{"y":0,"x":56,"width":44,"var":"sign_1","height":60},"child":[{"type":"Image","props":{"y":7,"x":6,"skin":"ui_main/img-weikaiqi.png","name":"weikaiqi"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-gongjizhong.png","name":"gongjizhong"}},{"type":"Image","props":{"y":7,"skin":"ui_main/img-yidawan.png","name":"yidawan","centerX":0}},{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-guanka.png","name":"boss_weida","centerX":0}},{"type":"Image","props":{"skin":"ui_main/img-gongjizhong.png","name":"boss_kaida"},"child":[{"type":"Image","props":{"y":24,"x":22,"skin":"ui_main/img-boss-guanka.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Label","props":{"y":0,"x":112,"width":44,"var":"sign_2","height":60},"child":[{"type":"Image","props":{"y":7,"x":6,"skin":"ui_main/img-weikaiqi.png","name":"weikaiqi"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-gongjizhong.png","name":"gongjizhong"}},{"type":"Image","props":{"y":7,"skin":"ui_main/img-yidawan.png","name":"yidawan","centerX":0}},{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-guanka.png","name":"boss_weida","centerX":0}},{"type":"Image","props":{"skin":"ui_main/img-gongjizhong.png","name":"boss_kaida"},"child":[{"type":"Image","props":{"y":24,"x":22,"skin":"ui_main/img-boss-guanka.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Label","props":{"y":0,"x":168,"width":44,"var":"sign_3","height":60},"child":[{"type":"Image","props":{"y":7,"x":6,"skin":"ui_main/img-weikaiqi.png","name":"weikaiqi"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-gongjizhong.png","name":"gongjizhong"}},{"type":"Image","props":{"y":7,"skin":"ui_main/img-yidawan.png","name":"yidawan","centerX":0}},{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-guanka.png","name":"boss_weida","centerX":0}},{"type":"Image","props":{"skin":"ui_main/img-gongjizhong.png","name":"boss_kaida"},"child":[{"type":"Image","props":{"y":24,"x":22,"skin":"ui_main/img-boss-guanka.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Label","props":{"y":0,"x":224,"width":44,"var":"sign_4","height":60},"child":[{"type":"Image","props":{"y":7,"x":6,"skin":"ui_main/img-weikaiqi.png","name":"weikaiqi"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-gongjizhong.png","name":"gongjizhong"}},{"type":"Image","props":{"y":7,"skin":"ui_main/img-yidawan.png","name":"yidawan","centerX":0}},{"type":"Image","props":{"y":5,"skin":"ui_main/img-boss-guanka.png","name":"boss_weida","centerX":0}},{"type":"Image","props":{"skin":"ui_main/img-gongjizhong.png","name":"boss_kaida"},"child":[{"type":"Image","props":{"y":24,"x":22,"skin":"ui_main/img-boss-guanka.png","scaleY":1.2,"scaleX":1.2,"anchorY":0.5,"anchorX":0.5}}]}]},{"type":"Box","props":{"y":0,"x":0,"width":44,"var":"effect_fight","mouseThrough":true,"height":60,"anchorY":0,"anchorX":0}}]},{"type":"Box","props":{"y":198,"width":430,"var":"blood","height":71,"centerX":41},"child":[{"type":"Image","props":{"y":-3,"x":0,"width":427,"skin":"ui_main/img-xietuo-boss.png","sizeGrid":"1,15,2,3","name":"bg","height":30}},{"type":"Image","props":{"y":0,"x":0,"width":423,"var":"follow","height":24},"child":[{"type":"Image","props":{"y":1,"x":2,"width":423,"var":"blood_follow","height":24,"alpha":0.8},"child":[{"type":"Poly","props":{"points":"0,0,423,0,423,16,415,24,0,24","lineColor":"#fcff00","fillColor":"#fcff00"}}]},{"type":"Sprite","props":{"y":1,"x":2,"width":423,"renderType":"mask","name":"mask","height":24,"cacheAs":"bitmap"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":423,"lineWidth":1,"height":24,"fillColor":"#8e0e09"}}]}]},{"type":"Image","props":{"y":1,"x":2,"width":423,"var":"blood_list","skin":"ui_main/img-guai-xuetiao.png","sizeGrid":"0,5,0,5","height":24}},{"type":"Label","props":{"y":0,"x":234,"width":180,"var":"blood_num","height":24,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"right"}},{"type":"Label","props":{"y":0,"x":27,"width":178,"var":"monster_name","height":24,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true}},{"type":"Image","props":{"y":-5,"x":-82,"width":512,"var":"bg_bossicon","height":76},"child":[{"type":"Image","props":{"y":31,"x":82,"width":418,"var":"boss_time","skin":"ui_main/img-shijiantuo-boss.png","sizeGrid":"1,15,2,3","height":8}},{"type":"Label","props":{"y":33,"x":84,"width":408,"visible":true,"var":"blood_time","height":4,"bgColor":"#fbf9f9"}},{"type":"Image","props":{"y":0,"x":0,"width":110,"skin":"ui_main/btn-zhu-boss-bg.png","sizeGrid":"0,45,0,5","height":62}},{"type":"Box","props":{"y":0,"x":0,"width":64,"var":"effect_head","mouseThrough":true,"height":60,"anchorY":0,"anchorX":0}},{"type":"Label","props":{"y":46,"x":140,"width":158,"text":"打怪倒计时：","strokeColor":"#3b281d","stroke":5,"height":31,"fontSize":28,"font":"SimHei","color":"#fef8e9","bold":false}},{"type":"Label","props":{"y":45,"x":302,"width":90,"var":"time_boss","text":"12.20S","strokeColor":"#1d082d","stroke":4,"height":28,"fontSize":30,"font":"SimHei","color":"#fd2323","bold":true}}]}]},{"type":"Button","props":{"y":69,"x":672,"var":"custom_wave_boss","stateNum":1,"skin":"ui_main/btn-bosstiaozhan.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":9,"x":56,"wordWrap":true,"width":69,"var":"tx_num_boss","text":"挑战\\nBOSS","height":37,"fontSize":18,"font":"SimHei","color":"#fff5dc","bold":true,"align":"center"}},{"type":"Box","props":{"y":0,"x":0,"width":130,"var":"effect_boss","mouseThrough":true,"height":56,"anchorY":0,"anchorX":0}}]}]},{"type":"Image","props":{"width":212,"var":"bg_num","top":118,"name":"底图","left":30,"height":120},"child":[{"type":"Image","props":{"y":60,"x":0,"width":242,"var":"bg_hurt","skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":37},"child":[{"type":"Label","props":{"y":4,"x":3,"wordWrap":false,"width":241,"var":"Boss_hurt","text":"伤害:","name":"倒计时","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}}]}]},{"type":"Image","props":{"y":118,"x":30,"width":211,"visible":false,"var":"fight_time","skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":45},"child":[{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-jianbian-huodong.png","sizeGrid":"0,1,0,1","height":45}},{"type":"Image","props":{"y":3,"x":8,"skin":"ui_action/ui-daojishi-biao-huodong.png"}},{"type":"Label","props":{"y":10,"x":57,"wordWrap":true,"width":156,"var":"Boss_time","text":"倒计时：30","name":"倒计时","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainCustomsViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainDeputyViewUI extends View {
		public tatil:Laya.Label;
		public txt_countdown:Laya.Label;
		public play:Laya.Image;
		public Btn_buff:Laya.Button;
		public btn_memory:Laya.Button;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"x":0,"width":750,"sizeGrid":"10,24,6,0","mouseThrough":true,"height":1200},"child":[{"type":"Label","props":{"y":-690,"width":750,"right":0,"left":0,"height":764,"bgColor":"#0c0908"}},{"type":"Label","props":{"y":39,"x":48,"width":115,"var":"tatil","valign":"middle","text":"副本标题","height":29,"fontSize":26,"font":"SimHei","color":"#feb979","bold":false,"align":"left"},"child":[{"type":"Label","props":{"y":1,"x":-25,"width":6,"height":22,"bgColor":"#4a408a"}}]},{"type":"Image","props":{"y":119,"x":23,"width":212,"name":"图标","height":45},"child":[{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-bg-huodong.png","sizeGrid":"0,2,0,2","height":45}},{"type":"Image","props":{"y":0,"x":0,"width":211,"skin":"ui_action/ui-daojishi-jianbian-huodong.png","sizeGrid":"0,1,0,1","height":45}},{"type":"Image","props":{"y":3,"x":8,"skin":"ui_action/ui-daojishi-biao-huodong.png"}},{"type":"Label","props":{"y":10,"x":57,"wordWrap":true,"width":152,"var":"txt_countdown","text":"倒计时:60S","height":33,"fontSize":27,"font":"SimHei","color":"#f4f4f4"}},{"type":"Image","props":{"y":580,"x":352,"visible":false,"var":"play","skin":"ui_main/img-kaishi-pvp.png","anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":41,"x":0,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","right":0,"left":0,"height":32},"child":[{"type":"Image","props":{"y":-6,"width":167,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","right":0,"height":38}}]},{"type":"Button","props":{"y":118,"x":650,"visible":true,"var":"Btn_buff","stateNum":1,"skin":"ui_wroldboss/buff.png"},"child":[{"type":"Label","props":{"y":59,"x":15,"text":"BUFF","strokeColor":"#7c6d92","stroke":3,"fontSize":22,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":120,"x":659,"visible":true,"var":"btn_memory","stateNum":1,"skin":"ui_main/btn-xingxing.png"},"child":[{"type":"Label","props":{"y":47,"x":-17,"text":"查看目标","strokeColor":"#7c6d92","stroke":3,"fontSize":22,"font":"SimHei","color":"#f4f4f4"}}]},{"type":"Button","props":{"y":35,"x":668,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":38}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainDeputyViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainDpsViewUI extends View {
		public bg:Laya.Image;
		public dsp_totles:Laya.Label;
		public dsp_hero:Laya.Label;
		public dsp_pet:Laya.Label;
		public dsp_camp:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":92},"child":[{"type":"Image","props":{"y":0,"width":750,"var":"bg","mouseThrough":true,"height":92,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":312,"skin":"ui_main/img-zong-shuxing.png","sizeGrid":"0,25,0,120","height":40},"child":[{"type":"Label","props":{"y":0,"x":94,"width":75,"valign":"middle","text":"总DPS","strokeColor":"#311f1b","height":40,"fontSize":22,"font":"SimHei","color":"#a7f469"}},{"type":"Label","props":{"y":0,"x":187,"width":89,"var":"dsp_totles","valign":"middle","text":"0","height":40,"fontSize":18,"font":"SimHei","color":"#c5c5c5","align":"right"}}]},{"type":"Image","props":{"y":0,"x":466,"width":284,"skin":"ui_main/img-yingxiong-shuxing.png","sizeGrid":"0,10,0,130","height":40},"child":[{"type":"Label","props":{"y":0,"x":115,"width":75,"valign":"middle","text":"英雄DPS","height":40,"fontSize":20,"font":"SimHei","color":"#dcdc65"}},{"type":"Label","props":{"y":0,"x":190,"width":89,"var":"dsp_hero","valign":"middle","text":"0","height":40,"fontSize":18,"font":"SimHei","color":"#c5c5c5","align":"right"}}]},{"type":"Image","props":{"y":48,"x":0,"width":286,"skin":"ui_main/img-shenshou-shuxing.png","sizeGrid":"0,25,0,120","height":40},"child":[{"type":"Label","props":{"y":0,"x":75,"valign":"middle","text":"神兽DPS","height":40,"fontSize":20,"font":"SimHei","color":"#dcdc65"}},{"type":"Label","props":{"y":0,"x":168,"width":89,"var":"dsp_pet","valign":"middle","text":"0","height":40,"fontSize":18,"font":"SimHei","color":"#c5c5c5","align":"right"}}]},{"type":"Image","props":{"y":48,"x":440,"width":310,"skin":"ui_main/img-zhenying-shuxing.png","sizeGrid":"0,10,0,138","height":40},"child":[{"type":"Label","props":{"y":0,"x":106,"width":75,"valign":"middle","text":"阵营DPS","height":40,"fontSize":20,"font":"SimHei","color":"#dcdc65"}},{"type":"Label","props":{"y":0,"x":199,"width":89,"var":"dsp_camp","valign":"middle","text":"0","height":40,"fontSize":18,"font":"SimHei","color":"#c5c5c5","align":"right"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainDpsViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainListViewUI extends View {
		public top_bg:Laya.Image;
		public ui_box:Laya.Box;
		public bombg:Laya.Label;
		public btn_ui_close:Laya.Image;
		public btn_ui_max:Laya.Image;
		public btn_ui_up:Laya.Image;
		public btn_ui_down:Laya.Image;
		public ui_panel:Laya.Panel;
		public bg:Laya.Image;
		public btn_role:Laya.Box;
		public getIn1:Laya.Image;
		public role_point:Laya.Image;
		public btn_hero:Laya.Box;
		public getIn2:Laya.Image;
		public hero_point:Laya.Image;
		public hero_new:Laya.Image;
		public btn_pet:Laya.Box;
		public getIn3:Laya.Image;
		public pet_point:Laya.Image;
		public pet_new:Laya.Image;
		public btn_equip:Laya.Box;
		public getIn4:Laya.Image;
		public equip_point:Laya.Image;
		public equip_new:Laya.Image;
		public btn_active:Laya.Box;
		public getIn5:Laya.Image;
		public active_point:Laya.Image;
		public btn_shop:Laya.Box;
		public getIn6:Laya.Image;
		public shop_point:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":375,"width":750,"var":"top_bg","top":0,"mouseThrough":true,"centerX":0,"bottom":0,"anchorX":0.5},"child":[{"type":"Box","props":{"y":0,"width":750,"var":"ui_box","centerX":0,"alpha":1},"child":[{"type":"Label","props":{"y":-2339,"x":0,"width":750,"visible":false,"var":"bombg","height":4345,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":50,"x":0,"width":750,"height":2000,"bgColor":"#313737","alpha":1}},{"type":"Image","props":{"y":0,"x":424,"width":326,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,8,0,33","height":50},"child":[{"type":"Image","props":{"y":0,"x":-424,"width":462,"skin":"ui_common/img-tongyong-taitou.png","sizeGrid":"0,31,0,11","height":50}}]},{"type":"Image","props":{"y":4,"x":606,"width":138,"var":"btn_ui_close","mouseEnabled":true,"height":50},"child":[{"type":"Image","props":{"skin":"ui_main/ui_mainbtn-guanbi.png","centerY":0,"centerX":0}}]},{"type":"Image","props":{"y":6,"x":450,"width":138,"var":"btn_ui_max","mouseEnabled":true,"height":50},"child":[{"type":"Image","props":{"y":0,"x":44,"width":61,"height":50},"child":[{"type":"Image","props":{"width":61,"var":"btn_ui_up","skin":"ui_main/ui_mainbtn-xialai.png","scaleY":-1,"height":41,"centerY":0,"centerX":0}},{"type":"Image","props":{"width":61,"var":"btn_ui_down","skin":"ui_main/ui_mainbtn-xialai.png","height":41,"centerY":0,"centerX":0}}]}]},{"type":"Label","props":{"y":20,"x":597,"width":2,"height":24,"bgColor":"#343a3d"}},{"type":"Panel","props":{"y":50,"width":750,"var":"ui_panel","height":1940}}]}]},{"type":"Image","props":{"width":750,"var":"bg","mouseThrough":true,"height":52,"centerX":0,"bottom":-1},"child":[{"type":"Box","props":{"y":26,"x":62,"var":"btn_role","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"x":0,"width":125,"height":52,"bgColor":"#c74436"}},{"type":"Image","props":{"y":-2,"width":125,"visible":false,"var":"getIn1","skin":"ui_main/btn-zhu-juese.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":61,"text":"角色","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":60,"text":"角色","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":20,"skin":"ui_main/img-zhu-juese.png"}},{"type":"Image","props":{"var":"role_point","skin":"ui_common/img-tixing.png"}}]},{"type":"Box","props":{"y":26,"x":187,"var":"btn_hero","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"width":125,"height":52,"bgColor":"#21b6d5"}},{"type":"Image","props":{"y":-2,"width":125,"visible":false,"var":"getIn2","skin":"ui_main/btn-zhu-shangcheng.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":59,"text":"英雄","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":58,"text":"英雄","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":20,"skin":"ui_main/img-zhu-yingxiong.png"}},{"type":"Image","props":{"visible":false,"var":"hero_point","skin":"ui_common/img-tixing.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"hero_new","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":26,"x":312,"var":"btn_pet","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"width":125,"height":52,"bgColor":"#dbba20"}},{"type":"Image","props":{"y":-2,"width":125,"visible":false,"var":"getIn3","skin":"ui_main/btn-zhu-shenshou.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":60,"text":"神兽","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":59,"text":"神兽","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":20,"skin":"ui_main/img-zhu-shenshou.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"pet_point","skin":"ui_common/img-tixing.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"pet_new","skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"new_logo"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":26,"x":437,"visible":true,"var":"btn_equip","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"width":125,"height":52,"bgColor":"#75c727"}},{"type":"Image","props":{"y":-2,"width":125,"visible":false,"var":"getIn4","skin":"ui_main/btn-zhu-zhuangbei.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":59,"text":"法器","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":58,"text":"法器","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":15,"skin":"ui_main/img-zhu-zhuangbei.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"equip_point","skin":"ui_common/img-tixing.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"equip_new","skin":"ui_hero/img-biaoqian-zhekou-bg.png"},"child":[{"type":"Label","props":{"y":1,"x":6,"width":14,"text":"新","strokeColor":"#d10805","stroke":3,"skewY":13,"skewX":-8,"height":12,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"Box","props":{"y":26,"x":562,"var":"btn_active","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"width":125,"height":52,"bgColor":"#8339c9"}},{"type":"Image","props":{"y":-2,"width":125,"visible":false,"var":"getIn5","skin":"ui_main/btn-zhu-huodong.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":65,"text":"活动","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":63,"text":"活动","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":20,"skin":"ui_main/zhu-huodongzhu-huodong.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"active_point","skin":"ui_common/img-tixing.png"}}]},{"type":"Box","props":{"y":26,"x":687,"var":"btn_shop","top":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":0,"x":0,"width":125,"height":52,"bgColor":"#4541c8"}},{"type":"Image","props":{"y":-2,"x":0,"width":125,"visible":false,"var":"getIn6","skin":"ui_main/btn-zhu-yingxiong.png","sizeGrid":"5,0,0,0","name":"getIn","height":54}},{"type":"Label","props":{"y":15,"x":65,"text":"商城","name":"tx_title_0","fontSize":26,"font":"SimHei","color":"#141930","bold":true}},{"type":"Label","props":{"y":13,"x":63,"text":"商城","name":"tx_title_1","fontSize":26,"font":"SimHei","color":"#fcfcfb","bold":true}},{"type":"Image","props":{"y":8,"x":20,"skin":"ui_main/img-zhu-shangcheng.png"}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"var":"shop_point","skin":"ui_common/img-tixing.png"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.main.subinterface.MainListViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class MainSkillViewUI extends View {
		public bg:Laya.Image;
		public mp_list:Laya.Image;
		public tx_skill_num:laya.display.Text;
		public tx_skill_time:laya.display.Text;
		public btn_recovery:Laya.Button;
		public Captain:Laya.Box;
		public captain_skill:Laya.Image;
		public captainSkillIcon:Laya.Image;
		public captainSkillCD:Laya.Label;
		public captainSkillCDSprite:Laya.Sprite;
		public captainSkillCDLabel:Laya.Label;
		public effect_bg:Laya.Box;
		public autoBtn:Laya.Image;
		public autoIcon:Laya.Image;
		public Skill:Laya.List;
		public mouseclick:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"mouseThrough":true,"height":315},"child":[{"type":"Image","props":{"y":0,"width":750,"var":"bg","mouseThrough":true,"height":315,"centerX":0},"child":[{"type":"Image","props":{"y":124,"x":18,"width":711,"skin":"ui_main/img-lantuo.png","sizeGrid":"20,115,20,90","mouseThrough":true,"height":62},"child":[{"type":"Box","props":{"y":35,"x":77,"name":"list"},"child":[{"type":"Image","props":{"width":617,"skin":"ui_main/img-taitou-jinenghuifutuo-jindutiao.png","sizeGrid":"0,5,0,5"}},{"type":"Panel","props":{"y":2,"x":2,"width":613,"height":14},"child":[{"type":"Image","props":{"y":0,"x":0,"width":613,"var":"mp_list","skin":"ui_main/img-taitou-jinenghuifu-jindutiao.png","sizeGrid":"5,8,5,16","height":14}}]}]},{"type":"Text","props":{"y":7,"x":85,"var":"tx_skill_num","text":"20/20","fontSize":24,"font":"SimHei","color":"#ffff79","bold":true}},{"type":"Text","props":{"y":10,"x":153,"var":"tx_skill_time","text":"(恢复2/分钟)","fontSize":20,"font":"SimHei","color":"#fbfdfc","bold":false}}]},{"type":"Button","props":{"y":127,"x":593,"width":108,"visible":false,"var":"btn_recovery","stateNum":1,"labelSize":24,"labelFont":"SimHei","labelColors":"#a2e991","labelBold":true,"labelAlign":"center","label":"一键恢复","height":28},"child":[{"type":"Label","props":{"y":27,"x":0,"width":108,"height":1,"bgColor":"#a2e991"}}]},{"type":"Box","props":{"y":55,"x":369,"var":"Captain","centerX":-7,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":32,"var":"captain_skill","skin":"ui_main/img-jinengkuang-duizhang.png"},"child":[{"type":"Image","props":{"y":45,"x":44,"width":70,"skin":"ui_main/img-jinengkuang-duizhang.png","height":70,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-6,"x":-6,"width":80,"var":"captainSkillIcon","skin":"ui_icon/2.png","height":80}},{"type":"Sprite","props":{"y":0,"x":0,"width":70,"renderType":"mask","height":70},"child":[{"type":"Circle","props":{"y":35,"x":35,"radius":35,"lineWidth":1,"fillColor":"#ff0000"}}]}]},{"type":"Label","props":{"y":43,"x":42,"width":74,"var":"captainSkillCD","pivotY":35,"pivotX":35,"height":74,"bgColor":"#060606","alpha":0.5},"child":[{"type":"Sprite","props":{"y":0,"x":0,"width":74,"var":"captainSkillCDSprite","renderType":"mask","pivotY":0,"height":74},"child":[{"type":"Circle","props":{"y":37,"x":37,"radius":37,"lineWidth":0,"fillColor":"#ff0000"}}]}]},{"type":"Label","props":{"y":32,"x":4,"width":80,"var":"captainSkillCDLabel","strokeColor":"#000000","stroke":4.5,"height":27,"fontSize":30,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Box","props":{"y":0,"x":4,"width":82,"var":"effect_bg","height":82}}]},{"type":"Image","props":{"y":82,"x":-8,"var":"autoBtn","skin":"ui_main/img-shifangtuo-zhujineng.png"}},{"type":"Image","props":{"y":86,"x":0,"var":"autoIcon","skin":"ui_main/img-shifang-zhujineng.png"}},{"type":"Label","props":{"y":85,"x":41,"text":"自动释放","fontSize":22,"font":"SimHei","color":"#f9f9d0","bold":true}}]},{"type":"List","props":{"y":206,"x":17,"width":704,"var":"Skill","spaceX":17,"repeatY":1,"repeatX":6,"height":111},"child":[{"type":"Box","props":{"width":104,"renderType":"render","height":104},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_main/img-jinengkuang-tongyong.png"}},{"type":"Image","props":{"y":2,"x":2,"skin":"ui_main/img-huang-jindu.png","name":"cd_circle"}},{"type":"Image","props":{"y":9,"x":9,"width":86,"skin":"ui_icon/1.png","name":"cd_pic","height":86}},{"type":"Image","props":{"y":26,"x":31,"skin":"ui_main/img-suo.png","name":"cd_lock"}},{"type":"Label","props":{"y":95,"x":52,"width":86,"name":"cd_mask","height":86,"bgColor":"#000000","anchorY":1,"anchorX":0.5,"alpha":0.8}},{"type":"Label","props":{"y":40,"x":2,"width":100,"strokeColor":"#000000","stroke":4.5,"name":"cd_time","height":27,"fontSize":30,"font":"SimHei","color":"#7ef395","bold":true,"align":"center"}},{"type":"Label","props":{"y":68,"x":10,"width":84,"valign":"bottom","strokeColor":"#000000","stroke":4.5,"name":"conMp","height":27,"fontSize":24,"font":"SimHei","color":"#ffffff","bold":true,"align":"right"}},{"type":"Box","props":{"y":7,"x":7,"width":90,"name":"effect_bg","height":90}}]}]},{"type":"Label","props":{"y":206,"x":17,"width":712,"var":"mouseclick","mouseThrough":false,"height":106}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.main.subinterface.MainSkillViewUI.uiView);

        }

    }
}

module ui.main.subinterface {
    export class NoticeViewUI extends View {
		public backGround:Laya.Image;
		public htmlBg:Laya.Image;
		public noticeLabel:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"y":0,"width":750,"mouseThrough":true,"mouseEnabled":true,"height":1200},"child":[{"type":"Image","props":{"width":750,"var":"backGround","height":1200},"child":[{"type":"Image","props":{"y":171,"x":0,"width":700,"visible":false,"var":"htmlBg","sizeGrid":"21,95,25,92","height":70,"centerX":0}},{"type":"HTMLDivElement","props":{"y":186,"x":750,"var":"noticeLabel"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.main.subinterface.NoticeViewUI.uiView);

        }

    }
}

module ui.rank {
    export class RankViewUI extends View {
		public typeList_d:Laya.List;
		public tp:Laya.Image;
		public typeList_s:Laya.List;
		public rankList:Laya.List;
		public myInfo:Laya.Box;
		public myRankIcon:Laya.Image;
		public myRankContent:laya.display.Text;
		public myRankName:laya.display.Text;
		public myRankNum:laya.display.Text;
		public notNum:laya.display.Text;
		public myCampName:Laya.Label;
		public close:Laya.Image;
		public myVip:Laya.Image;
		public Btn_reward:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"width":750,"height":1200,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":197,"x":25,"width":700,"height":906,"bgColor":"#616985"}},{"type":"Label","props":{"y":25,"x":33,"width":229,"valign":"middle","text":"排行榜","italic":true,"height":59,"fontSize":42,"font":"SimHei","color":"#d8f0f5","bold":true,"align":"left"}},{"type":"Label","props":{"y":81,"x":0,"width":750,"height":38,"fontSize":40,"font":"Microsoft YaHei","color":"#1b1616","bold":true,"bgColor":"#27212c"}},{"type":"List","props":{"y":82,"x":25,"width":750,"var":"typeList_d","spaceX":3,"repeatY":1,"repeatX":4,"height":38},"child":[{"type":"Box","props":{"y":0,"x":0,"width":140,"renderType":"render","height":38},"child":[{"type":"Image","props":{"y":0,"x":5,"width":158,"skin":"ui_rank/img-zi-daxuanze.png","sizeGrid":"0,25,0,29","name":"cur","height":37}},{"type":"Image","props":{"skin":"ui_rank/img-xiebian.png","name":"line"}},{"type":"Label","props":{"y":0,"x":24,"width":112,"valign":"middle","text":"type","name":"type","height":38,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":0,"x":27,"width":118,"name":"btn","height":38}}]}]},{"type":"Image","props":{"y":140,"x":25,"width":674,"skin":"ui_rank/img-xiaobiaoqian-tuo.png","sizeGrid":"3,41,1,3","height":58}},{"type":"Image","props":{"y":145,"x":29,"width":38,"var":"tp","skin":"ui_rank/img-lan-xuan.png","height":49}},{"type":"List","props":{"y":144,"x":28,"width":667,"var":"typeList_s","spaceX":-30,"repeatY":1,"height":50},"child":[{"type":"Box","props":{"y":0,"x":0,"width":174,"renderType":"render","height":50},"child":[{"type":"Image","props":{"y":0,"x":0,"width":174,"skin":"ui_rank/img-lan-weixuan.png","sizeGrid":"0,34,0,34","name":"btn","height":50}},{"type":"Label","props":{"y":0,"x":33,"width":107,"valign":"middle","text":"type","name":"type","height":50,"fontSize":26,"font":"SimHei","color":"#bebbf8","bold":true,"align":"center"}}]},{"type":"Sprite","props":{"y":0,"x":0,"width":33,"renderType":"mask","height":31},"child":[{"type":"Poly","props":{"y":0,"x":0,"points":"0,0,0,50,660,50,627,0","lineWidth":1,"lineColor":"#ff0000","fillColor":"#00ffff"}}]}]},{"type":"List","props":{"y":218,"x":62,"width":626,"var":"rankList","spaceY":5,"name":"rankList","height":754},"child":[{"type":"Box","props":{"y":0,"x":0,"width":626,"renderType":"render","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"width":626,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,3,0,82","name":"bgImg","height":94}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_hero/img-lanpingzhilkuang.png","height":70}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","name":"rankIcon","height":70}},{"type":"Text","props":{"y":49,"x":185,"width":131,"valign":"middle","text":"content","name":"rankContent","height":30,"fontSize":18,"font":"Microsoft YaHei","color":"#fafa85","bold":false,"align":"left"}},{"type":"Text","props":{"y":15,"x":185,"width":153,"valign":"middle","text":"name","name":"rankName","height":32,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":true,"align":"left"}},{"type":"Text","props":{"y":0,"x":0,"width":77,"valign":"middle","text":"1","name":"rankNum","height":94,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Image","props":{"y":23,"x":175,"skin":"ui_camp/icn-vip-jiemian-tongyong.png","name":"vip"}},{"type":"Label","props":{"y":23,"x":380,"text":"阵营：","name":"camp_name","fontSize":18,"font":"SimHei","color":"#fafa85"}}]}]},{"type":"Box","props":{"y":979,"x":62,"width":626,"var":"myInfo","renderType":"render","height":94},"child":[{"type":"Image","props":{"y":0,"x":0,"width":626,"skin":"ui_rank/img-ziji-paiming.png","sizeGrid":"0,11,0,82","height":94}},{"type":"Image","props":{"y":12,"x":100,"width":70,"skin":"ui_hero/img-lanpingzhilkuang.png","height":70}},{"type":"Image","props":{"y":12,"x":100,"width":70,"var":"myRankIcon","skin":"ui_head/icon_ui_01.png","sizeGrid":"10,10,10,10","height":70}},{"type":"Text","props":{"y":49,"x":185,"width":131,"var":"myRankContent","valign":"middle","text":"content","height":30,"fontSize":18,"font":"Microsoft YaHei","color":"#fafa85","bold":false,"align":"left"}},{"type":"Text","props":{"y":15,"x":185,"width":153,"var":"myRankName","valign":"middle","text":"name","height":32,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":true,"align":"left"}},{"type":"Text","props":{"y":7,"x":10,"width":67,"var":"myRankNum","valign":"middle","text":"4","height":66,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Text","props":{"y":12,"x":10,"wordWrap":true,"width":67,"var":"notNum","valign":"middle","text":"暂未上榜","height":66,"fontSize":24,"font":"SimHei","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Label","props":{"y":33,"x":380,"var":"myCampName","text":"阵营：","fontSize":18,"font":"SimHei","color":"#fafa85"}}]},{"type":"Image","props":{"y":79,"x":676,"var":"close","skin":"ui_common/btn-X-tongyong.png","right":30}},{"type":"Image","props":{"y":1004,"x":247,"visible":false,"var":"myVip","skin":"ui_camp/icn-vip-jiemian-tongyong.png"}},{"type":"Button","props":{"y":166,"x":683,"visible":false,"var":"Btn_reward","stateNum":1,"skin":"ui_wroldboss/btn-jaingliyulan-shijieboss.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":43,"x":-10,"text":"奖励预览","strokeColor":"#7c6d92","stroke":3,"fontSize":19,"font":"SimHei","color":"#f4f4f4"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.rank.RankViewUI.uiView);

        }

    }
}

module ui.scene {
    export class Scene01UI extends View {
		public baiduskd1:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":0,"skin":"ui_scene01/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1178}},{"type":"Image","props":{"skin":"ui_scene01/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1014,"bottom":0}},{"type":"Image","props":{"x":16,"width":210,"visible":false,"var":"baiduskd1","skin":"ui_scene01/06.png","height":54,"bottom":672}},{"type":"Image","props":{"skin":"ui_scene01/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":607}},{"type":"Image","props":{"skin":"ui_scene01/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":661}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"skin":"ui_scene01/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":92}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":-1}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene01UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene02UI extends View {

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":-91,"skin":"ui_scene02/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0}},{"type":"Image","props":{"skin":"ui_scene02/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1140,"bottom":-16}},{"type":"Image","props":{"skin":"ui_scene02/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":548}},{"type":"Image","props":{"skin":"ui_scene02/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":548}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene02UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene03UI extends View {

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":0,"skin":"ui_scene03/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":891}},{"type":"Image","props":{"skin":"ui_scene03/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1114,"bottom":-21}},{"type":"Image","props":{"skin":"ui_scene03/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":550}},{"type":"Image","props":{"skin":"ui_scene03/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":550}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"width":141,"skin":"ui_scene03/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"height":76,"bottom":359}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene03UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene04UI extends View {
		public baiduskd1:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":0,"skin":"ui_scene04/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1089}},{"type":"Image","props":{"skin":"ui_scene04/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":635,"bottom":545}},{"type":"Image","props":{"x":95,"width":76,"visible":false,"var":"baiduskd1","skin":"ui_scene04/08.png","height":15,"bottom":757}},{"type":"Image","props":{"width":750,"skin":"ui_scene04/03.png","height":177,"bottom":553}},{"type":"Image","props":{"skin":"ui_scene04/04.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":546}},{"type":"Image","props":{"skin":"ui_scene04/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":546}},{"type":"Image","props":{"skin":"ui_scene04/06.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":618,"bottom":-20}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"skin":"ui_scene04/07.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":341}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":1}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene04UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene05UI extends View {
		public baiduskd1:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"skin":"ui_scene05/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":578}},{"type":"Image","props":{"skin":"ui_scene05/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1190,"bottom":0}},{"type":"Image","props":{"x":584,"width":166,"visible":false,"var":"baiduskd1","skin":"ui_scene05/06.png","height":63,"bottom":887}},{"type":"Image","props":{"skin":"ui_scene05/04.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":636}},{"type":"Image","props":{"skin":"ui_scene05/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":636}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene05UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene06UI extends View {
		public baiduskd1:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"skin":"ui_scene06/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1153,"bottom":447}},{"type":"Image","props":{"skin":"ui_scene06/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1038,"bottom":0}},{"type":"Image","props":{"x":509,"width":98,"visible":false,"var":"baiduskd1","skin":"ui_scene06/05.png","height":42,"bottom":951}},{"type":"View","props":{"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"skin":"ui_scene06/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":139,"bottom":299}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene06UI.uiView);

        }

    }
}

module ui.scene {
    export class Scene07UI extends View {

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"skin":"ui_scene07/01.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":913,"bottom":684}},{"type":"Image","props":{"skin":"ui_scene07/02.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":1127,"bottom":0}},{"type":"Image","props":{"skin":"ui_scene07/03.png","mouseThrough":true,"mouseEnabled":false,"left":0,"bottom":578}},{"type":"Image","props":{"skin":"ui_scene07/04.png","right":0,"mouseThrough":true,"mouseEnabled":false,"bottom":578}},{"type":"View","props":{"y":0,"x":0,"right":0,"name":"avatarRoot","left":0,"height":1200,"bottom":0}},{"type":"Image","props":{"skin":"ui_scene07/05.png","right":0,"mouseThrough":true,"mouseEnabled":false,"left":0,"height":121,"bottom":337}},{"type":"View","props":{"right":0,"name":"effectRoot","left":0,"height":1200,"bottom":0}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.scene.Scene07UI.uiView);

        }

    }
}

module ui.setting {
    export class SettingHeadViewUI extends View {
		public panel_base:Laya.Image;
		public type:Laya.Label;
		public btn_close:Laya.Button;
		public btn_ok:Laya.Button;
		public warehouse:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"x":79,"width":592,"height":474,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":-2,"width":592,"var":"panel_base","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":474},"child":[{"type":"Label","props":{"y":0,"x":0,"width":592,"height":40,"bgColor":"#1b2838"}},{"type":"Label","props":{"y":8,"x":23,"width":6,"height":25,"bgColor":"#4a408a"}},{"type":"Image","props":{"y":61,"x":12,"width":562,"height":300},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":562,"lineWidth":1,"height":300,"fillColor":"#32324d"}}]},{"type":"Image","props":{"y":145,"x":92,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.2}},{"type":"Image","props":{"y":276,"x":494,"skin":"ui_common/img-huawen2.png","alpha":0.2}}]},{"type":"Label","props":{"y":8,"x":49,"width":268,"var":"type","text":"选择头像","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"left"}},{"type":"Button","props":{"y":0,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12}},{"type":"Button","props":{"y":381,"x":215,"var":"btn_ok","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":36,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":161,"valign":"middle","text":"确定","strokeColor":"#a66336","stroke":1,"height":67,"fontSize":28,"font":"SimHei","color":"#280605","align":"center"}}]},{"type":"List","props":{"y":73,"x":37,"width":529,"var":"warehouse","spaceY":10,"spaceX":16,"repeatX":5,"height":286},"child":[{"type":"Box","props":{"y":0,"x":0,"renderType":"render"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":82,"skin":"ui_setting/img-xuanzhong-shezhi.png","sizeGrid":"5,18,12,5","name":"img_select","height":82}},{"type":"Label","props":{"y":3,"x":3,"width":76,"height":76,"bgColor":"#0a0a12","alpha":0.8},"child":[{"type":"Image","props":{"y":3,"x":3,"width":70,"height":70},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":70,"lineWidth":1,"height":70,"fillColor":"#3b4461"}}]}]},{"type":"Image","props":{"y":6,"x":6,"width":70,"name":"img_head","height":70}},{"type":"Image","props":{"y":54,"x":62,"width":30,"skin":"ui_setting/btn-weixuanzhong.png","name":"img_use","height":33}}]}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.setting.SettingHeadViewUI.uiView);

        }

    }
}

module ui.setting {
    export class SettingNameViewUI extends View {
		public panel_base:Laya.Image;
		public type:Laya.Label;
		public btn_close:Laya.Button;
		public input:Laya.TextInput;
		public btn_random:Laya.Button;
		public btn_ok:Laya.Button;
		public txt_freed:laya.display.Text;
		public img_diamonds:Laya.Image;
		public txt_cost:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Image","props":{"width":682,"height":474,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":682,"var":"panel_base","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":474},"child":[{"type":"Label","props":{"y":0,"x":0,"width":682,"height":40,"bgColor":"#1b2838"}},{"type":"Label","props":{"y":8,"x":23,"width":6,"height":25,"bgColor":"#4a408a"}},{"type":"Rect","props":{"y":61,"x":12,"width":660,"lineWidth":1,"height":300,"fillColor":"#32324d"}},{"type":"Image","props":{"y":145,"x":92,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.2}},{"type":"Image","props":{"y":276,"x":591,"skin":"ui_common/img-huawen2.png","alpha":0.2}},{"type":"Image","props":{"y":165,"width":225,"skin":"ui_common/img-gaiming-bg-chuangjue.png","scaleY":2,"scaleX":2,"height":55,"centerX":19}}]},{"type":"Label","props":{"y":8,"x":49,"width":268,"var":"type","text":"更改姓名","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"left"}},{"type":"Button","props":{"y":0,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12}},{"type":"TextInput","props":{"y":213,"x":325,"width":350,"var":"input","valign":"middle","type":"text","promptColor":"#b9b9b9","maxChars":12,"height":54,"fontSize":36,"font":"SimHei","color":"#ffffff","centerX":-6,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Button","props":{"y":166,"width":94,"var":"btn_random","stateNum":1,"skin":"ui_common/btn-suijin-mingzi.png","mouseEnabled":true,"height":94,"centerX":197}},{"type":"Button","props":{"y":418,"x":331,"width":162,"var":"btn_ok","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":26,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"确定","height":70,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"x":0,"width":162,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"5,9,9,5","height":22,"bottom":0}},{"type":"Text","props":{"y":47,"x":42,"width":86,"var":"txt_freed","valign":"middle","text":"本次免费","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}},{"type":"Image","props":{"y":50,"x":51,"width":20,"visible":false,"var":"img_diamonds","skin":"ui_icon/icon_prop_013.png","height":18}},{"type":"Text","props":{"y":47,"x":74,"width":61,"var":"txt_cost","valign":"middle","text":"200","height":24,"fontSize":20,"font":"SimHei","color":"#ffc58b","bold":false,"align":"left"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.setting.SettingNameViewUI.uiView);

        }

    }
}

module ui.setting {
    export class SettingViewUI extends View {
		public panel_base:Laya.Image;
		public type:Laya.Label;
		public btn_close:Laya.Button;
		public txt_username:Laya.Label;
		public img_head:Laya.Image;
		public btn_head:Laya.Button;
		public btn_name:Laya.Button;
		public btn_ok:Laya.Button;
		public btn_effect:Laya.Button;
		public effect_select:Laya.Image;
		public btn_music:Laya.Button;
		public music_select:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"x":81,"width":588,"height":422,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"var":"panel_base","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":422},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":40,"bgColor":"#1b2838"}},{"type":"Label","props":{"y":8,"x":23,"width":6,"height":25,"bgColor":"#4a408a"}},{"type":"Label","props":{"y":8,"x":49,"width":268,"var":"type","text":"设置","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"left"}},{"type":"Image","props":{"y":91,"x":100,"width":338,"height":42},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":338,"lineWidth":1,"height":40,"fillColor":"#32324d"}}]},{"type":"Label","props":{"y":60,"x":25,"width":76,"height":76,"bgColor":"#0a0a12","alpha":0.8},"child":[{"type":"Image","props":{"y":3,"x":3,"width":70,"height":70},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":70,"lineWidth":1,"height":70,"fillColor":"#3b4461"}}]}]},{"type":"Image","props":{"y":298,"x":12,"width":566,"height":2},"child":[{"type":"Line","props":{"y":0,"x":0,"toY":0,"toX":566,"lineWidth":2,"lineColor":"#7c7a88"}}]},{"type":"Image","props":{"y":207,"x":94,"skin":"ui_setting/icon-shengying-shezhi.png"}},{"type":"Label","props":{"y":208,"x":270,"width":54,"text":"音效","height":28,"fontSize":26,"font":"SimHei","color":"#fdfdfd"}},{"type":"Label","props":{"y":208,"x":447,"width":54,"text":"音乐","height":28,"fontSize":26,"font":"SimHei","color":"#fdfdfd"}}]},{"type":"Button","props":{"y":21,"x":554,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":98,"x":129,"width":297,"var":"txt_username","text":"玩家名字七个字","height":28,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"right"}},{"type":"Image","props":{"y":63,"x":28,"width":70,"var":"img_head","skin":"ui_head/icon_ui_01.png","height":70}},{"type":"Button","props":{"y":131,"x":99,"var":"btn_head","stateNum":1,"skin":"ui_setting/btn-huantouxiang-shezhi.png","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":112,"x":512,"var":"btn_name","stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","labelSize":36,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":4,"x":36,"width":76,"valign":"middle","text":"改名","strokeColor":"#a66336","stroke":2,"height":40,"fontSize":20,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":11,"x":26,"skin":"ui_setting/img-gaiming-shezhi.png"}}]},{"type":"Button","props":{"y":353,"x":296,"var":"btn_ok","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":36,"labelFont":"SimHei","labelColors":"#954104","labelBold":true,"labelAlign":"center","label":"确定","anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":221,"x":228,"var":"btn_effect","stateNum":1,"skin":"ui_setting/btn-weixuanzhong-bg.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":2,"var":"effect_select","skin":"ui_setting/btn-weixuanzhong.png"}}]},{"type":"Button","props":{"y":221,"x":405,"var":"btn_music","stateNum":1,"skin":"ui_setting/btn-weixuanzhong-bg.png","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":3,"x":2,"var":"music_select","skin":"ui_setting/btn-weixuanzhong.png"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.setting.SettingViewUI.uiView);

        }

    }
}

module ui.share {
    export class InvitationCustomsViewUI extends View {
		public tx_title:laya.display.Text;
		public btn_close:Laya.Button;
		public tx_num:laya.html.dom.HTMLDivElement;
		public hero_icon:Laya.Image;
		public tx_content:laya.html.dom.HTMLDivElement;
		public btn_customs:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":588,"height":392,"centerY":-110,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":392},"child":[{"type":"Label","props":{"x":0,"width":588,"height":392,"bgColor":"#dadbdd"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50}},{"type":"Label","props":{"y":13,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":133,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.3}},{"type":"Image","props":{"y":309,"x":508,"skin":"ui_common/img-huawen2.png","alpha":0.3}},{"type":"Image","props":{"y":280,"x":11,"width":568,"height":2},"child":[{"type":"Line","props":{"toY":0,"toX":568,"lineWidth":1,"lineColor":"#746e97"}}]}]},{"type":"Text","props":{"y":13,"x":43,"width":109,"var":"tx_title","text":"助力通关","height":26,"fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}},{"type":"Button","props":{"y":2,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}}]},{"type":"Image","props":{"y":50,"x":0,"width":588,"height":342},"child":[{"type":"HTMLDivElement","props":{"y":12,"x":249,"width":331,"var":"tx_num","innerHTML":"今日成功邀请人数：4/3人","height":22}},{"type":"Image","props":{"y":43,"x":52,"width":120,"var":"hero_icon","height":160}},{"type":"Image","props":{"y":57,"x":200,"width":341,"skin":"ui_chat/img-duihuakuang-liaotian.png","sizeGrid":"9,10,18,10","height":119},"child":[{"type":"Image","props":{"y":28,"x":-4,"skin":"ui_chat/img-sanjiao-liaotian.png"}},{"type":"HTMLDivElement","props":{"y":16,"x":21,"width":304,"var":"tx_content","innerHTML":"稍微遇到点小困难呢，成功邀请没关系，点击一下直接通过本关哦~","height":74}}]},{"type":"Image","props":{"y":191,"x":242,"skin":"ui_shop/img-tanhao.png"},"child":[{"type":"Text","props":{"y":8,"x":36,"width":307,"text":"邀请到新用户还可以获得邀请豪礼哦！","height":19,"fontSize":18,"font":"SimHei","color":"#211f1f","bold":false,"align":"left"}}]},{"type":"Button","props":{"y":287,"var":"btn_customs","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"即刻通关","centerX":0,"anchorY":0.5,"anchorX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.share.InvitationCustomsViewUI.uiView);

        }

    }
}

module ui.share {
    export class ShareAchievenViewUI extends View {
		public tx_content:laya.display.Text;
		public btn_share:Laya.Button;
		public tx_sharenum:laya.display.Text;
		public btn_receive:Laya.Button;
		public tx_nosharenum:laya.display.Text;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":588,"height":354,"centerY":-110,"centerX":0},"child":[{"type":"Image","props":{"y":-1,"x":0,"width":588,"height":354},"child":[{"type":"Label","props":{"y":-1,"x":0,"width":588,"height":354,"bgColor":"#dadbdd"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40}},{"type":"Label","props":{"y":7,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":123,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"y":271,"x":508,"skin":"ui_common/img-huawen2.png","alpha":0.4}},{"type":"Image","props":{"y":248,"x":10,"width":568,"height":1,"alpha":0.6}}]},{"type":"Text","props":{"y":7,"x":43,"text":"成就分享","fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}}]},{"type":"Image","props":{"y":-1,"x":0,"width":588,"height":354},"child":[{"type":"Text","props":{"y":134,"x":88,"width":436,"var":"tx_content","text":"分享给好友可获得双倍奖励哦！","height":30,"fontSize":30,"font":"SimHei","color":"#211f1f","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":306,"x":399,"var":"btn_share","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"分享","centerX":105,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22},"child":[{"type":"Text","props":{"y":1,"x":80,"width":53,"var":"tx_sharenum","text":"20","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"left"}},{"type":"Image","props":{"y":1,"x":52,"width":24,"skin":"ui_icon/icon_prop_013.png","height":20}}]}]},{"type":"Button","props":{"y":306,"x":182,"var":"btn_receive","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"直接领取","centerX":-112,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22},"child":[{"type":"Text","props":{"y":1,"x":80,"width":34,"var":"tx_nosharenum","text":"0","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"left"}},{"type":"Image","props":{"y":1,"x":52,"width":24,"skin":"ui_icon/icon_prop_013.png","height":20}}]}]},{"type":"Button","props":{"y":0,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.share.ShareAchievenViewUI.uiView);

        }

    }
}

module ui.share {
    export class ShareBaseViewUI extends View {
		public btn_close:Laya.Button;
		public btnlist_share:Laya.Button;
		public btnlist_invitation:Laya.Button;
		public red_invitation:Laya.Image;
		public panel_share:Laya.Image;
		public btn_share:Laya.Button;
		public tx_tequan:laya.html.dom.HTMLDivElement;
		public tx_content:laya.html.dom.HTMLDivElement;
		public list_tequan:Laya.List;
		public tx_author:laya.html.dom.HTMLDivElement;
		public panel_invitation:Laya.Image;
		public imagebg1:Laya.Box;
		public tx_invitation_today:laya.html.dom.HTMLDivElement;
		public tx_receive:laya.display.Text;
		public btn_receive:Laya.Button;
		public tx_time:laya.display.Text;
		public tx_everyday:laya.display.Text;
		public imagebg2:Laya.Box;
		public list_invitation:Laya.List;
		public tx_invitation_totle:laya.html.dom.HTMLDivElement;
		public btn_immediate:Laya.Button;
		public tx_immediately:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":588,"height":768,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":768},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"text":"label","height":768,"bgColor":"#5a4862"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40}},{"type":"Image","props":{"y":40,"x":266,"skin":"ui_common/img-huawen1.png"}},{"type":"Image","props":{"y":768,"x":265,"skin":"ui_common/img-huawen1.png","scaleY":-1}},{"type":"Image","props":{"y":768,"x":0,"skin":"ui_common/img-huawen1.png","scaleY":-1}},{"type":"Image","props":{"y":40,"x":0,"skin":"ui_common/img-huawen1.png"}}]},{"type":"Button","props":{"y":0,"x":612,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":12}},{"type":"Image","props":{"y":-9,"x":0,"width":290,"skin":"ui_rank/img-xiaobiaoqian-tuo.png","sizeGrid":"2,40,2,2","height":48},"child":[{"type":"Button","props":{"y":24,"x":76,"width":152,"var":"btnlist_share","stateNum":1,"skin":"ui_rank/img-zi-xuan.png","sizeGrid":"0,34,0,2","labelStrokeColor":"#000000","labelStroke":1,"labelSize":24,"labelFont":"SimHei","labelColors":"#eff8bb","labelBold":true,"label":"分享","height":43,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":24,"x":202,"width":160,"var":"btnlist_invitation","stateNum":1,"skin":"ui_rank/img-zi-weixuan.png","sizeGrid":"0,34,0,34","labelStrokeColor":"#000000","labelStroke":1,"labelSize":24,"labelFont":"SimHei","labelColors":"#bebbf8","labelBold":true,"label":"邀请","height":43,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Image","props":{"y":0,"x":240,"visible":false,"var":"red_invitation","skin":"ui_common/img-tixing.png"}}]},{"type":"Image","props":{"y":40,"x":0,"width":588,"var":"panel_share","height":728},"child":[{"type":"Image","props":{"y":12,"x":0,"skin":"ui_share/img-bg-fenxiang.png"}},{"type":"Button","props":{"y":671,"x":294,"var":"btn_share","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"分享","anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":83,"x":49,"width":99,"text":"免费特权","height":26,"fontSize":24,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"HTMLDivElement","props":{"y":85,"x":176,"width":376,"var":"tx_tequan","innerHTML":"今日已获得特权次数：x/y次","height":20}},{"type":"HTMLDivElement","props":{"y":242,"x":43,"width":510,"var":"tx_content","height":48}},{"type":"List","props":{"y":135,"x":65,"width":465,"var":"list_tequan","spaceX":20,"repeatY":1,"repeatX":5,"height":100},"child":[{"type":"Image","props":{"y":0,"x":0,"width":76,"skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","renderType":"render","name":"item","height":76},"child":[{"type":"Image","props":{"y":3,"x":3,"skin":"ui_icon/icon-tequan-hjzl.png","name":"pic"}},{"type":"Label","props":{"y":54,"x":2,"width":70,"text":"1","stroke":2,"name":"num","height":20,"fontSize":20,"font":"SimHei","color":"#f8f2ef","bold":false,"align":"right"}},{"type":"Label","props":{"y":80,"width":108,"stroke":1,"name":"name","height":23,"fontSize":20,"font":"SimHei","color":"#f8e4dd","centerX":0,"bold":false,"align":"center"}}]}]},{"type":"HTMLDivElement","props":{"y":535,"x":40,"width":513,"var":"tx_author","height":58}}]},{"type":"Image","props":{"y":40,"x":0,"width":588,"var":"panel_invitation","height":728},"child":[{"type":"Box","props":{"y":0,"x":0,"width":588,"var":"imagebg1","height":224},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":728},"child":[{"type":"Label","props":{"y":38,"x":9,"width":568,"height":114,"bgColor":"#262449"}},{"type":"Image","props":{"y":12,"x":9,"skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":2,"x":87,"width":90,"text":"惊喜大礼","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}}]},{"type":"Image","props":{"y":37,"x":54,"skin":"ui_share/icon-vip-yaoqing.png"}}]},{"type":"HTMLDivElement","props":{"y":13,"x":330,"width":243,"var":"tx_invitation_today","innerHTML":"当日邀请人数：4人","height":21}},{"type":"Text","props":{"y":85,"x":408,"width":128,"var":"tx_receive","text":"VIP已激活","height":28,"fontSize":28,"font":"SimHei","color":"#fffaec","align":"left"}},{"type":"Button","props":{"y":98,"x":481,"width":162,"var":"btn_receive","stateNum":1,"skin":"ui_common/btn-huodong-p.png","mouseThrough":false,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"领取","height":69,"anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":122,"x":144,"width":90,"var":"tx_time","height":22,"fontSize":20,"font":"SimHei","color":"#fffaec","align":"left"},"child":[{"type":"Text","props":{"y":0,"x":-121,"width":120,"text":"VIP剩余时间：","height":22,"fontSize":20,"font":"SimHei","color":"#fffaec","align":"left"}}]},{"type":"Text","props":{"y":162,"x":25,"wordWrap":true,"width":543,"var":"tx_everyday","text":"每日邀请一名新用户登录游戏即可免费领取一天VIP特权，尊享贵族优惠，多日邀请时间可累计哦！","leading":5,"height":42,"fontSize":18,"font":"SimHei","color":"#d6d7ee","align":"left"}}]},{"type":"Box","props":{"y":224,"x":0,"var":"imagebg2","height":388},"child":[{"type":"List","props":{"x":11,"width":572,"var":"list_invitation","vScrollBarSkin":"\"\"","top":35,"repeatX":1,"bottom":0},"child":[{"type":"Box","props":{"y":0,"x":0,"width":568,"renderType":"render","height":118},"child":[{"type":"Image","props":{"y":0,"x":0,"width":568,"skin":"ui_rank/img-zhihou-paiming.png","sizeGrid":"0,3,0,82","name":"bgImg","height":118}},{"type":"Text","props":{"y":12,"x":8,"width":62,"valign":"middle","text":"1","name":"rankNum","height":98,"fontSize":46,"font":"Helvetica","color":"#e6e6eb","bold":true,"align":"center"}},{"type":"Image","props":{"y":13,"x":95,"width":70,"visible":false,"skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","name":"item_0","height":70},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"item_quaity","left":2,"bottom":2}},{"type":"Image","props":{"y":0,"x":0,"width":70,"skin":"ui_icon/icon_equip_38.png","sizeGrid":"10,10,10,10","name":"itemIcon","height":70}},{"type":"Text","props":{"y":49,"x":0,"width":68,"text":"10","name":"itemNum","height":20,"fontSize":16,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"right"}},{"type":"Text","props":{"y":70,"x":-10,"width":91,"text":"name","name":"itemName","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"center"}}]},{"type":"Image","props":{"y":13,"x":190,"width":70,"visible":false,"skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","name":"item_1","height":70},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"item_quaity","left":2,"bottom":2}},{"type":"Image","props":{"y":0,"x":1,"width":70,"skin":"ui_icon/icon_equip_44.png","sizeGrid":"10,10,10,10","name":"itemIcon","height":70}},{"type":"Text","props":{"y":49,"x":0,"width":68,"text":"10","name":"itemNum","height":20,"fontSize":16,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"right"}},{"type":"Text","props":{"y":70,"x":-9,"width":91,"text":"name","name":"itemName","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"center"}}]},{"type":"Image","props":{"y":12,"x":285,"width":70,"visible":false,"skin":"ui_common/ui-daojukuang-lan-tongyong.png","sizeGrid":"4,4,4,4","name":"item_2","height":70},"child":[{"type":"Label","props":{"top":2,"right":2,"name":"item_quaity","left":2,"bottom":2}},{"type":"Image","props":{"y":0,"x":1,"width":70,"skin":"ui_icon/icon_equip_42.png","sizeGrid":"10,10,10,10","name":"itemIcon","height":70}},{"type":"Text","props":{"y":49,"x":0,"width":68,"text":"10","name":"itemNum","height":20,"fontSize":16,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"right"}},{"type":"Text","props":{"y":70,"x":-9,"width":91,"text":"name","name":"itemName","height":27,"fontSize":22,"font":"Microsoft YaHei","color":"#fffaec","bold":false,"align":"center"}}]},{"type":"Button","props":{"y":62,"x":489,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"btn_reward","labelSize":18,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":false,"labelAlign":"center","label":" 领奖","anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":42,"x":394,"text":"邀请满5人可领取","name":"tx_invitation_content","fontSize":20,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"HTMLDivElement","props":{"y":7,"x":360,"width":212,"var":"tx_invitation_totle","innerHTML":"当日邀请人数：4人","height":21}},{"type":"Image","props":{"y":3,"x":20,"skin":"ui_hero/img-tongyong-taitou-1.png"},"child":[{"type":"Text","props":{"y":3,"x":87,"width":90,"text":"邀请豪礼","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}}]}]},{"type":"Button","props":{"y":676,"x":293,"width":162,"var":"btn_immediate","stateNum":1,"skin":"ui_common/btn-huodong-p.png","mouseThrough":false,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"label":"即刻邀请","height":67,"anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":620,"x":127,"width":397,"var":"tx_immediately","text":"成功邀请一定数量的新用户即可领取众多奖励！","height":22,"fontSize":18,"font":"SimHei","color":"#d8d9e2","align":"left"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.share.ShareBaseViewUI.uiView);

        }

    }
}

module ui.share {
    export class ShareCustomsViewUI extends View {
		public tx_title:laya.display.Text;
		public strTex:laya.display.Text;
		public btn_share:Laya.Button;
		public tx_reward:laya.display.Text;
		public btn_close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"width":588,"top":250,"height":453,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":454},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":454,"bgColor":"#dadbdd"}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"2,0,2,0","height":40}},{"type":"Label","props":{"y":7,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":123,"x":81,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"y":370,"x":508,"skin":"ui_common/img-huawen2.png","alpha":0.4}},{"type":"Text","props":{"y":8,"x":43,"var":"tx_title","text":"恭喜突破50关","fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}}]},{"type":"Image","props":{"y":0,"x":0,"width":588,"height":454},"child":[{"type":"Image","props":{"y":49,"x":10,"skin":"ui_share/img-hua-fengxiang.png"}},{"type":"Text","props":{"y":321,"x":83,"width":451,"var":"strTex","text":"危机尚未平息，往后还需要更多支持，继续加油吧！！！","height":25,"fontSize":18,"font":"SimHei","color":"#404040","bold":true,"align":"center"}}]}]},{"type":"Button","props":{"y":645,"x":375,"var":"btn_share","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"分享","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22},"child":[{"type":"Text","props":{"y":1,"x":13,"width":83,"text":"即可获得","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b"}},{"type":"Text","props":{"y":1,"x":121,"width":34,"var":"tx_reward","text":"200","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b"}},{"type":"Image","props":{"y":1,"x":95,"width":24,"skin":"ui_icon/icon_prop_013.png","height":20}}]}]},{"type":"Button","props":{"y":270,"x":634,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":85,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.share.ShareCustomsViewUI.uiView);

        }

    }
}

module ui.share {
    export class ShareHeroViewUI extends View {
		public exhero:Laya.Image;
		public nameTex:laya.display.Text;
		public tx_levelup:laya.display.Text;
		public btn_close:Laya.Button;
		public btn_share:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"y":-49,"x":-50,"width":850,"height":1300,"centerY":50,"centerX":0,"alpha":0.8},"child":[{"type":"Rect","props":{"width":850,"lineWidth":1,"height":1300,"fillColor":"#000000"}}]},{"type":"Image","props":{"y":230,"x":81,"width":588,"height":642},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":642,"bgColor":"#dadbdd"}},{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":40}},{"type":"Label","props":{"y":7,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":-1,"x":41,"skin":"ui_share/icon-new.png"}},{"type":"Image","props":{"y":127,"x":81,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"y":558,"x":508,"skin":"ui_common/img-huawen2.png","alpha":0.4}},{"type":"Image","props":{"y":498,"x":10,"width":568,"height":2},"child":[{"type":"Line","props":{"toY":0,"toX":568,"lineWidth":1,"lineColor":"#746e97"}}]}]},{"type":"Image","props":{"y":230,"x":81,"width":588,"height":642},"child":[{"type":"Image","props":{"y":93,"width":306,"skin":"ui_hero/img-yingxiong-zhanshi-lan.png","height":390,"centerX":0},"child":[{"type":"Image","props":{"y":10,"x":10,"width":280,"var":"exhero","height":363}}]},{"type":"Text","props":{"y":64,"x":232,"width":125,"var":"nameTex","text":"赵日天","height":25,"fontSize":22,"font":"SimHei","color":"#663912","bold":true,"align":"center"}},{"type":"Text","props":{"y":518,"x":120,"width":361,"var":"tx_levelup","text":"当前英雄可直升25级哦！","height":25,"fontSize":24,"font":"SimHei","color":"#404040","bold":true,"align":"center"}}]},{"type":"Button","props":{"y":230,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":81}},{"type":"Button","props":{"y":817,"x":375,"var":"btn_share","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"分享","centerX":0,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.share.ShareHeroViewUI.uiView);

        }

    }
}

module ui.shop {
    export class FirstRechargeShopViewUI extends View {
		public firstList:Laya.List;
		public firstPrice_s:laya.display.Text;
		public firstPrice:laya.display.Text;
		public proInfo:Laya.Image;
		public BuyBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":530},"child":[{"type":"Image","props":{"y":66,"x":20,"skin":"ui_shop/img-tuo-shouchong.png"}},{"type":"List","props":{"y":191,"x":45,"width":673,"var":"firstList","spaceX":60,"repeatY":1,"repeatX":3,"height":185},"child":[{"type":"Box","props":{"width":180,"renderType":"render","height":180},"child":[{"type":"Image","props":{"width":180,"name":"icon","height":180}}]}]},{"type":"Image","props":{"y":10,"x":14,"skin":"ui_shop/img-title-shouchong.png"}},{"type":"Text","props":{"y":16,"x":16,"width":707,"valign":"middle","text":"传奇首充","strokeColor":"#87574d","stroke":3,"height":34,"fontSize":30,"font":"SimHei","color":"#fffcaa","bold":true,"align":"center"}},{"type":"Text","props":{"y":402,"x":33,"width":694,"var":"firstPrice_s","text":"￥30.00","strokeColor":"#55433f","stroke":1,"height":109,"fontSize":95,"font":"Arial","color":"#3c2626","bold":true,"alpha":0.6,"align":"center"}},{"type":"Text","props":{"y":397,"x":29,"width":691,"var":"firstPrice","text":"￥30.00","strokeColor":"#55433f","stroke":1,"height":109,"fontSize":95,"font":"Arial","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":517,"x":29,"width":696,"visible":false,"pivotY":0,"pivotX":0,"height":40,"alpha":0.9},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":696,"lineWidth":1,"height":40,"fillColor":"#3f4968"}},{"type":"Poly","props":{"y":0,"x":180,"points":"-20,40,0,0,348,0,328,40","lineWidth":1,"fillColor":"#374981"}},{"type":"Image","props":{"y":3,"x":654,"visible":false,"var":"proInfo","skin":"ui_shop/img-tanhao.png"}},{"type":"Text","props":{"y":6,"x":273,"width":192,"text":"道具具体信息","strokeColor":"#2d3652","stroke":2,"height":34,"fontSize":24,"font":"Helvetica","color":"#6298ae","bold":true}}]},{"type":"Button","props":{"width":710,"var":"BuyBtn","name":"BuyBtn","height":435,"centerY":19,"centerX":-5,"anchorY":0.5,"anchorX":0.5}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.shop.FirstRechargeShopViewUI.uiView);

        }

    }
}

module ui.shop {
    export class GemShopViewUI extends View {
		public gemList:Laya.List;
		public gemBox:Laya.Box;
		public proInfo:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":620},"child":[{"type":"List","props":{"y":65,"x":30,"width":702,"var":"gemList","spaceY":20,"spaceX":16,"repeatY":2,"repeatX":3,"name":"gemList","height":537},"child":[{"type":"Box","props":{"y":0,"x":0,"width":220,"var":"gemBox","renderType":"render","name":"gemBox","height":252},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-kuang-baoxiang.png"}},{"type":"Image","props":{"y":210,"x":0,"width":220,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,48,0,0","height":42}},{"type":"Text","props":{"y":217,"x":43,"width":55,"text":"￥","strokeColor":"#4c446d","stroke":4,"height":28,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"right"}},{"type":"Text","props":{"y":217,"x":97,"width":55,"text":"20","strokeColor":"#4c446d","stroke":4,"name":"gemPrice","height":28,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"left"}},{"type":"Image","props":{"y":128,"x":114,"skin":"ui_icon/icon_prop_006.png","scaleY":1,"scaleX":1,"name":"gemIcon","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":58,"x":68,"width":220,"name":"buyBtn","height":252,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Text","props":{"y":19,"x":13,"width":192,"text":"一把宝石","strokeColor":"#000000","stroke":2,"renderType":"render","name":"gemName","height":29,"fontSize":24,"font":"Microsoft YaHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Text","props":{"y":167,"x":50,"width":118,"text":"160","strokeColor":"#000000","stroke":2,"renderType":"render","name":"gemNum","height":29,"fontSize":25,"font":"Microsoft YaHei","color":"#ffe000","bold":true,"align":"center"}},{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-zhekou-bg-shangcheng.png","name":"discountBg"},"child":[{"type":"Label","props":{"y":17,"x":17,"width":46,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":17,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]}]},{"type":"Image","props":{"y":10,"x":14,"skin":"ui_shop/img-tuo-baoxiang.png"}},{"type":"Text","props":{"y":18,"x":344,"width":66,"text":"钻石","strokeColor":"#497d98","stroke":3,"height":35,"fontSize":30,"font":"SimHei","color":"#a7d6ec","bold":true,"align":"left"}},{"type":"Image","props":{"y":14,"x":684,"visible":false,"var":"proInfo","skin":"ui_shop/img-tanhao.png"}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.shop.GemShopViewUI.uiView);

        }

    }
}

module ui.shop {
    export class GiftBag2YuanViewUI extends View {
		public bg:Laya.Label;
		public bgImg:Laya.Image;
		public btn_close:Laya.Button;
		public hero_bg:Laya.Image;
		public hero_icon:Laya.Image;
		public btn_buy:Laya.Button;
		public hero_bigskill:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"var":"bg","top":0,"right":0,"left":1,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":600,"x":374,"width":554,"var":"bgImg","height":784,"centerY":0,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":32,"x":503,"var":"btn_close","top":12,"stateNum":1,"skin":"ui_main/btn-guanbi.png","right":20,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"var":"hero_bg","top":150,"skin":"ui_hero/img-yingxiong-zhanshi-lan.png","centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"var":"hero_icon","top":150,"skin":"ui_hero/img-yingxiong-zhanshi-lan.png","centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":717,"x":277,"var":"btn_buy","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelSize":30,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"centerX":0,"bottom":32,"anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":600,"x":45,"width":462,"var":"hero_bigskill","innerHTML":"htmlText","height":100}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.shop.GiftBag2YuanViewUI.uiView);

        }

    }
}

module ui.shop {
    export class LotteryShopViewUI extends View {
		public proInfo:Laya.Image;
		public ticketNum:laya.display.Text;
		public oneBtn:Laya.Image;
		public onePrict:laya.display.Text;
		public oneNum:laya.display.Text;
		public tenBtn:Laya.Image;
		public img_1:Laya.Image;
		public tenPrict:laya.display.Text;
		public new:Laya.Image;
		public discountNum:Laya.Label;
		public discount:Laya.Image;
		public discount_1:laya.display.Text;
		public discount_2:laya.display.Text;
		public residueNum:Laya.Label;
		public btn_free:Laya.Image;
		public tx_adtime:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":500},"child":[{"type":"Image","props":{"y":20,"x":24,"skin":"ui_shop/img-tuo-baoxiang.png"}},{"type":"Image","props":{"y":44,"x":708,"var":"proInfo","skin":"ui_shop/img-tanhao.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":23,"x":66,"width":43,"skin":"ui_shop/icon-kapai.png","height":43}},{"type":"Text","props":{"y":33,"x":113,"width":62,"var":"ticketNum","text":"x16","strokeColor":"#497d98","stroke":3,"height":27,"fontSize":24,"font":"SimHei","color":"#a7d6ec","bold":true,"align":"left"}},{"type":"Text","props":{"y":26,"x":354,"width":66,"text":"抽奖","strokeColor":"#497d98","stroke":3,"height":35,"fontSize":30,"font":"SimHei","color":"#a7d6ec","bold":true,"align":"left"}},{"type":"Box","props":{"y":83,"x":40,"width":338,"height":375},"child":[{"type":"Image","props":{"y":0,"x":0,"width":338,"skin":"ui_shop/img-jianbian-choujiang.png","height":333}},{"type":"Image","props":{"y":333,"x":0,"width":338,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,45,0,0","height":42}},{"type":"Image","props":{"y":176,"x":171,"var":"oneBtn","skin":"ui_icon/icon-danchou.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":338,"x":31,"width":37,"skin":"ui_icon/icon_prop_013.png","height":33}},{"type":"Image","props":{"y":333,"x":196,"width":43,"skin":"ui_shop/icon-kapai.png","height":43}},{"type":"Text","props":{"y":339,"x":157,"width":31,"text":"或","height":35,"fontSize":24,"font":"Microsoft YaHei","color":"#654a77","bold":true,"align":"left"}},{"type":"Text","props":{"y":339,"x":79,"width":74,"var":"onePrict","text":"750","strokeColor":"#4c446d","stroke":4,"height":31,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}},{"type":"Text","props":{"y":339,"x":245,"width":43,"var":"oneNum","text":"x1","strokeColor":"#4c446d","stroke":4,"height":36,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"left"}}]},{"type":"Image","props":{"y":-600,"x":10,"skin":"ui_shop/商城4.jpg"}},{"type":"Box","props":{"y":83,"x":393,"width":338,"height":375},"child":[{"type":"Image","props":{"y":0,"x":0,"width":338,"skin":"ui_shop/img-jianbian-choujiang.png","height":333}},{"type":"Image","props":{"y":333,"x":0,"width":338,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,45,0,0","height":42}},{"type":"Image","props":{"y":176,"x":171,"var":"tenBtn","skin":"ui_icon/icon-shilianchou.png","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":338,"x":113,"width":37,"var":"img_1","skin":"ui_icon/icon_prop_013.png","height":33}},{"type":"Text","props":{"y":339,"x":154,"width":74,"var":"tenPrict","text":"750","strokeColor":"#4c446d","stroke":4,"height":31,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}},{"type":"Image","props":{"y":330,"x":6,"width":26,"var":"new","skin":"ui_hero/img-biaoqian-zhekou-bg.png","height":30},"child":[{"type":"Label","props":{"y":0,"x":-6,"width":42,"var":"discountNum","text":"半价","strokeColor":"#d10805","stroke":3,"rotation":10,"height":19,"fontSize":18,"font":"SimHei","color":"#ffffff","align":"center"}}]},{"type":"Image","props":{"y":338,"x":61,"width":221,"var":"discount","height":34},"child":[{"type":"Image","props":{"y":0,"x":0,"width":33,"skin":"ui_icon/icon_prop_013.png","height":29}},{"type":"Text","props":{"y":0,"x":36,"width":74,"var":"discount_1","text":"750","strokeColor":"#4c446d","stroke":4,"height":31,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}},{"type":"Label","props":{"y":5,"x":-8,"width":125,"rotation":10,"height":4,"bgColor":"#ff0400"}},{"type":"Image","props":{"y":1,"x":119,"width":33,"skin":"ui_icon/icon_prop_013.png","height":29}},{"type":"Text","props":{"y":1,"x":155,"width":74,"var":"discount_2","text":"750","strokeColor":"#4c446d","stroke":4,"height":31,"fontSize":30,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"Label","props":{"y":307,"x":61,"width":231,"var":"residueNum","text":"今日剩余优惠次数：0/1","height":18,"fontSize":16,"font":"SimHei","color":"#84ff00","bold":true}}]},{"type":"Image","props":{"y":85,"x":293,"var":"btn_free","skin":"ui_shop/btn-danchou-kanguanggao.png"},"child":[{"type":"HTMLDivElement","props":{"y":65,"x":-3,"width":90,"var":"tx_adtime","innerHTML":"htmlText","height":16}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.shop.LotteryShopViewUI.uiView);

        }

    }
}

module ui.shop {
    export class PromotionShopViewUI extends View {

        public static  uiView:any ={"type":"View","props":{"width":750,"height":300},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"skin":"ui_main/btn-zhu-zhuangbei.png","sizeGrid":"10,10,10,10","height":850}},{"type":"Text","props":{"y":20,"x":350,"width":63,"text":"促销","height":34,"fontSize":30,"font":"SimHei","color":"#ffffff","bold":true}}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.shop.PromotionShopViewUI.uiView);

        }

    }
}

module ui.shop {
    export class ProShopViewUI extends View {
		public proInfo:Laya.Image;
		public proList:Laya.List;
		public box:Laya.Box;
		public proIcon:Laya.Image;
		public proPrice:laya.display.Text;
		public proPriceType:Laya.Image;
		public proName:laya.display.Text;
		public proNum:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":2000},"child":[{"type":"Image","props":{"y":10,"x":14,"skin":"ui_shop/img-tuo-baoxiang.png"}},{"type":"Text","props":{"y":16,"x":344,"width":66,"text":"道具","strokeColor":"#497d98","stroke":3,"height":35,"fontSize":30,"font":"SimHei","color":"#a7d6ec","bold":true,"align":"left"}},{"type":"Image","props":{"y":34,"x":698,"visible":false,"var":"proInfo","skin":"ui_shop/img-tanhao.png","name":"proInfo","anchorY":0.5,"anchorX":0.5}},{"type":"List","props":{"y":65,"x":30,"width":700,"var":"proList","spaceY":20,"spaceX":16,"repeatX":3,"name":"proList","height":1904},"child":[{"type":"Box","props":{"y":0,"x":0,"width":220,"var":"box","renderType":"render","height":252},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-kuang-baoxiang.png"}},{"type":"Image","props":{"y":210,"x":0,"width":220,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,48,0,0","height":42}},{"type":"Image","props":{"y":122,"x":112,"skin":"ui_hero/img-zipinzhikuang.png","sizeGrid":"10,10,10,10","name":"proBj","anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":122,"x":112,"width":140,"var":"proIcon","skin":"ui_icon/icon_tou_lzx.png","name":"proIcon","height":140,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":-59,"x":-40,"width":220,"name":"buyBtn","height":252}}]},{"type":"Text","props":{"y":217,"x":105,"width":55,"var":"proPrice","text":"160","strokeColor":"#4c446d","stroke":4,"name":"proPrice","height":28,"fontSize":30,"font":"SimHei","color":"#ffffff","bold":true,"align":"left"}},{"type":"Image","props":{"y":211,"x":41,"width":40,"var":"proPriceType","skin":"ui_icon/icon_prop_013.png","name":"proPriceType","height":40}},{"type":"Text","props":{"y":21,"x":15,"width":193,"var":"proName","text":"道具","strokeColor":"#2f2b1f","stroke":3,"name":"proName","height":28,"fontSize":24,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Text","props":{"y":168,"x":68,"width":107,"var":"proNum","text":"999","strokeColor":"#23211e","stroke":3,"name":"proNum","height":21,"fontSize":24,"font":"SimHei","color":"#ffffff","bold":true,"align":"right"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.shop.ProShopViewUI.uiView);

        }

    }
}

module ui.shop {
    export class TreasureBoxShopViewUI extends View {
		public proInfo:Laya.Image;
		public treList:Laya.List;
		public resIcon:Laya.Image;
		public priceType:Laya.Image;
		public resPrice:laya.display.Text;

        public static  uiView:any ={"type":"View","props":{"width":750,"renderType":"render","height":350},"child":[{"type":"Image","props":{"y":10,"x":14,"skin":"ui_shop/img-tuo-baoxiang.png"}},{"type":"Text","props":{"y":16,"x":344,"width":66,"text":"宝箱","strokeColor":"#497d98","stroke":3,"height":35,"fontSize":30,"font":"SimHei","color":"#a7d6ec","bold":true,"align":"left"}},{"type":"Image","props":{"y":17,"x":683,"visible":false,"var":"proInfo","skin":"ui_shop/img-tanhao.png"}},{"type":"List","props":{"y":65,"x":30,"width":700,"var":"treList","spaceY":20,"spaceX":16,"repeatY":1,"repeatX":3,"name":"treList","height":266},"child":[{"type":"Box","props":{"y":0,"x":0,"width":220,"renderType":"render","height":252},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"ui_shop/img-kuang-baoxiang.png"}},{"type":"Image","props":{"y":210,"x":0,"width":220,"skin":"ui_shop/img-jiagetiao.png","sizeGrid":"0,48,0,0","height":42}},{"type":"Image","props":{"y":129,"x":109,"width":168,"var":"resIcon","skin":"ui_icon/icon-lihe1.png","name":"resIcon","height":162,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Button","props":{"y":-48,"x":-25,"width":220,"name":"buyBtn","height":252}}]},{"type":"Image","props":{"y":211,"x":41,"width":40,"var":"priceType","skin":"ui_shop/icon-jinbi.png","name":"priceType","height":40}},{"type":"Label","props":{"y":183,"x":14,"width":195,"text":"2:22:22","strokeColor":"#4d4670","stroke":2,"name":"activityTime","height":27,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}},{"type":"Text","props":{"y":217,"x":105,"width":55,"var":"resPrice","text":"160","strokeColor":"#4c446d","stroke":4,"name":"resPrice","height":28,"fontSize":30,"font":"SimHei","color":"#ffffff","bold":true,"align":"left"}},{"type":"HTMLDivElement","props":{"y":20,"x":13,"width":194,"name":"resName","innerHTML":"htmlText","height":26}},{"type":"Image","props":{"y":0,"x":0,"visible":false,"skin":"ui_shop/img-zhekou-bg-shangcheng.png","name":"discountBg"},"child":[{"type":"Label","props":{"y":22,"x":16,"width":86,"valign":"middle","text":"3折","rotation":-45,"name":"discount","height":30,"fontSize":22,"font":"Microsoft YaHei","color":"#ffd28d","bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.shop.TreasureBoxShopViewUI.uiView);

        }

    }
}

module ui.signIn {
    export class AdFreeViewUI extends View {
		public btn_close:Laya.Button;
		public img_talk:Laya.Image;
		public tx_ad:laya.html.dom.HTMLDivElement;
		public shadow:Laya.Image;
		public box_angle:Laya.Box;
		public btn_ad:Laya.Button;
		public tx_reward_ad:laya.display.Text;
		public icon_ad:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":526,"height":587,"centerY":-100,"centerX":1},"child":[{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#dadbdd"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":526,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"2,0,2,0","height":50}},{"type":"Label","props":{"y":13,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":133,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.4}},{"type":"Image","props":{"y":471,"x":20,"width":480,"height":2,"alpha":0.4},"child":[{"type":"Line","props":{"toY":0,"toX":480,"lineWidth":1,"lineColor":"#746e97"}}]}]},{"type":"Text","props":{"y":13,"x":43,"width":120,"text":"小仙女","height":26,"fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}},{"type":"Button","props":{"y":2,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}}]},{"type":"Image","props":{"y":215,"x":188,"width":208,"visible":true,"var":"img_talk","skin":"ui_main/img-guaiwu-qiaopao.png","sizeGrid":"12,75,35,9","pivotX":154,"height":122,"anchorY":1}},{"type":"HTMLDivElement","props":{"y":109,"x":48,"width":180,"var":"tx_ad","height":69}},{"type":"Image","props":{"y":281,"skin":"ui_angle/img-zhuangshi-kanguangao.png","centerX":-129}},{"type":"Image","props":{"y":409,"width":111,"var":"shadow","skin":"ui_common/img-yingzi.png","height":49,"centerX":140,"alpha":0.6}},{"type":"Box","props":{"y":120,"x":300,"width":226,"var":"box_angle","height":300}},{"type":"Button","props":{"y":523,"var":"btn_ad","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"领取","centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":159,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22}},{"type":"Text","props":{"y":45,"x":82,"width":80,"var":"tx_reward_ad","text":"10","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"left"}},{"type":"Image","props":{"y":55,"x":65,"width":24,"var":"icon_ad","skin":"ui_icon/icon_prop_013.png","height":20,"anchorY":0.5,"anchorX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.signIn.AdFreeViewUI.uiView);

        }

    }
}

module ui.signIn {
    export class AdvertisementViewUI extends View {
		public tx_title:laya.display.Text;
		public btn_close:Laya.Button;
		public tx_content:laya.display.Text;
		public tx_num:laya.display.Text;
		public btn_ad:Laya.Button;
		public tx_reward_ad:laya.display.Text;
		public icon_ad:Laya.Image;
		public btn_rec_direct:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":588,"height":494,"centerY":-110,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":494},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":494,"bgColor":"#dadbdd"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","sizeGrid":"2,5,2,5","height":50}},{"type":"Label","props":{"y":13,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":133,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"x":508,"skin":"ui_common/img-huawen2.png","bottom":0,"alpha":0.4}},{"type":"Image","props":{"y":380,"x":11,"width":568,"height":2,"alpha":0.4},"child":[{"type":"Line","props":{"toY":0,"toX":568,"lineWidth":1,"lineColor":"#746e97"}}]}]},{"type":"Text","props":{"y":13,"x":43,"width":120,"var":"tx_title","text":"观看广告","height":26,"fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}},{"type":"Button","props":{"y":2,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}}]},{"type":"Image","props":{"y":48,"skin":"ui_angle/img-xiaoxiannv-tu2.png","centerX":0}},{"type":"Text","props":{"y":356,"x":34,"width":360,"var":"tx_content","text":"提示内容","height":19,"fontSize":20,"font":"SimHei","color":"#211f1f","bold":false,"align":"left"}},{"type":"Text","props":{"y":356,"x":418,"width":160,"var":"tx_num","text":"剩余次数：10/10","height":19,"fontSize":20,"font":"SimHei","color":"#211f1f","bold":false,"align":"left"}},{"type":"Button","props":{"y":440,"x":419,"var":"btn_ad","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"观看广告","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22}},{"type":"Text","props":{"y":45,"x":0,"width":162,"var":"tx_reward_ad","text":"400","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"center"}},{"type":"Image","props":{"y":55,"x":65,"width":24,"var":"icon_ad","skin":"ui_icon/icon_prop_013.png","height":20,"anchorY":0.5,"anchorX":0.5}}]},{"type":"Button","props":{"y":440,"x":169,"var":"btn_rec_direct","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"直接领取","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"visible":false,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22}},{"type":"Text","props":{"y":45,"x":0,"width":162,"visible":false,"text":"400","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"center"}},{"type":"Image","props":{"y":55,"x":65,"width":24,"visible":false,"skin":"ui_icon/icon_prop_013.png","height":20,"anchorY":0.5,"anchorX":0.5}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.signIn.AdvertisementViewUI.uiView);

        }

    }
}

module ui.signIn {
    export class AngleViewUI extends View {
		public tx_title:laya.display.Text;
		public btn_close:Laya.Button;
		public tx_content:laya.display.Text;
		public btn_direct:Laya.Button;
		public tx_reward:laya.display.Text;
		public btn_ad:Laya.Button;
		public tx_reward_ad:laya.display.Text;
		public icon_ad:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":588,"height":494,"centerY":-110,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"height":494},"child":[{"type":"Label","props":{"y":0,"x":0,"width":588,"height":494,"bgColor":"#dadbdd"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":588,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","height":50}},{"type":"Label","props":{"y":13,"x":18,"width":6,"height":25,"bgColor":"#c6832e"}},{"type":"Image","props":{"y":133,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Image","props":{"x":508,"skin":"ui_common/img-huawen2.png","bottom":0,"alpha":0.4}},{"type":"Image","props":{"y":380,"x":11,"width":568,"height":2,"alpha":0.4},"child":[{"type":"Line","props":{"toY":0,"toX":568,"lineWidth":1,"lineColor":"#746e97"}}]}]},{"type":"Text","props":{"y":13,"x":43,"width":109,"var":"tx_title","text":"小仙女","height":26,"fontSize":25,"font":"SimHei","color":"#ffffff","bold":true}},{"type":"Button","props":{"y":2,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","right":12}}]},{"type":"Image","props":{"y":48,"skin":"ui_angle/img-xiaoxiannv-tu.png","centerX":0},"child":[{"type":"Text","props":{"y":308,"x":26,"width":307,"var":"tx_content","height":19,"fontSize":20,"font":"SimHei","color":"#211f1f","bold":false,"align":"left"}}]},{"type":"Image","props":{"y":380,"x":0,"width":588,"height":115},"child":[{"type":"Button","props":{"y":60,"x":168,"var":"btn_direct","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"直接领奖","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22}},{"type":"Text","props":{"y":45,"x":81,"width":34,"var":"tx_reward","text":"200","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"left"}},{"type":"Image","props":{"y":45,"x":53,"width":24,"skin":"ui_icon/icon_prop_013.png","height":20}}]},{"type":"Button","props":{"y":60,"x":420,"var":"btn_ad","stateNum":1,"skin":"ui_common/btn-huodong-p.png","labelStrokeColor":"#5f2904","labelStroke":1,"labelSize":28,"labelPadding":"-10","labelFont":"SimHei","labelColors":"#5f2904","labelBold":true,"labelAlign":"center","label":"观看广告","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":44,"x":1,"width":160,"skin":"ui_common/btn-huodong-wenzi-bg.png","sizeGrid":"0,10,10,0","height":22}},{"type":"Text","props":{"y":45,"x":0,"width":162,"var":"tx_reward_ad","text":"400","height":22,"fontSize":20,"font":"SimHei","color":"#ffc58b","align":"center"}},{"type":"Image","props":{"y":55,"x":65,"width":24,"var":"icon_ad","skin":"ui_icon/icon_prop_013.png","height":20,"anchorY":0.5,"anchorX":0.5}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.signIn.AngleViewUI.uiView);

        }

    }
}

module ui.signIn {
    export class SevenSigninViewUI extends View {
		public type:Laya.Label;
		public close:Laya.Button;
		public sevenSignInList:Laya.List;
		public sevenday:Laya.Image;
		public sevenBg:Laya.Image;
		public sevenIcon:Laya.Image;
		public clickSevenBtn:Laya.Button;
		public sevenName:Laya.Label;
		public sevenNum:Laya.Label;
		public sevenAlready:Laya.Image;
		public baibuImg:Laya.Image;
		public textVip:Laya.Label;
		public weekqqadw:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"y":229,"width":704,"skin":"ui_sign/img-bg-qiriqiandao.png","sizeGrid":"10,10,10,10","height":898,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"y":0,"x":302,"skin":"ui_camp/img-huawen1.png","alpha":0.6}},{"type":"Image","props":{"y":-44,"width":704,"skin":"ui_sign/img-taitou-qinriqiandao.png","sizeGrid":"0,0,0,153","centerX":1},"child":[{"type":"Label","props":{"y":10,"x":0,"width":158,"var":"type","text":"标题读表","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"center"}},{"type":"Image","props":{"y":41,"x":0,"width":626,"skin":"ui_sign/img-zhuangshi-taitou-qiriqiandao.png","height":3}},{"type":"Button","props":{"y":0,"x":613,"var":"close","stateNum":1,"skin":"ui_main/btn-guanbi.png"}},{"type":"Image","props":{"y":-7,"x":154,"skin":"ui_sign/img-taitou-zhuangshi-qinriqiandao.png"}},{"type":"Image","props":{"y":-7,"x":244,"skin":"ui_sign/img-taitou-zhuangshi-qinriqiandao.png"}},{"type":"Image","props":{"y":-7,"x":334,"skin":"ui_sign/img-taitou-zhuangshi-qinriqiandao.png"}},{"type":"Image","props":{"y":-7,"x":424,"skin":"ui_sign/img-taitou-zhuangshi-qinriqiandao.png"}},{"type":"Image","props":{"y":-7,"x":514,"skin":"ui_sign/img-taitou-zhuangshi-qinriqiandao.png"}}]},{"type":"List","props":{"y":649,"width":578,"var":"sevenSignInList","spaceY":20,"spaceX":36,"repeatY":3,"repeatX":3,"height":452,"centerX":1,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Box","props":{"y":0,"x":0,"width":170,"visible":true,"renderType":"render","height":209},"child":[{"type":"Image","props":{"skin":"ui_sign/btn-wupin-bg-qinriqiandao.png","name":"bj"}},{"type":"Image","props":{"y":111,"x":82,"width":100,"skin":"ui_hero/img-huangpingzhikuang.png","name":"itemBg","height":100,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":111,"x":82,"width":97,"skin":"ui_icon/icon-lihe3.png","name":"itemIcon","height":98,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":17,"x":10,"width":149,"visible":true,"valign":"middle","text":"第1天","name":"dayNum","height":25,"fontSize":22,"font":"SimHei","color":"#ff7a6d","align":"center"}},{"type":"Label","props":{"y":170,"x":9,"width":148,"valign":"middle","text":"物品","name":"name","height":20,"fontSize":18,"font":"SimHei","color":"#ffffff","bold":false,"align":"center"}},{"type":"Image","props":{"y":130,"x":106,"visible":false,"skin":"ui_sign/img-yiling-duigou.png","name":"already"}},{"type":"Button","props":{"y":8,"x":8,"width":157,"name":"clickBtn","height":195}},{"type":"Label","props":{"y":138,"x":34,"width":97,"height":22,"bgColor":"#494054","alpha":0.8}},{"type":"Label","props":{"y":141,"x":33,"width":96,"text":"x11","name":"num","height":15,"fontSize":18,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}}]}]},{"type":"Image","props":{"y":282,"var":"sevenday","skin":"ui_sign/btn-wupin-bg-7tian-qinriqiandao.png","centerX":1,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":15,"x":219,"width":149,"visible":true,"valign":"middle","text":"第7天","height":25,"fontSize":26,"font":"SimHei","color":"#dd5c6c","alpha":0.5,"align":"center"}},{"type":"Label","props":{"y":9,"x":219,"width":149,"visible":true,"valign":"middle","text":"第7天","height":25,"fontSize":26,"font":"SimHei","color":"#fbd5cc","align":"center"}},{"type":"Image","props":{"y":56,"x":222,"var":"sevenBg","skin":"ui_hero/img-huangpingzhikuang.png"}},{"type":"Image","props":{"y":57,"x":223,"var":"sevenIcon","skin":"ui_icon/icon_tou_frk.png"}},{"type":"Button","props":{"y":59,"x":225,"width":138,"var":"clickSevenBtn","height":138}},{"type":"Label","props":{"y":210,"x":216,"width":149,"visible":true,"var":"sevenName","valign":"middle","text":"第7天","height":25,"fontSize":22,"font":"SimHei","color":"#ef97a2","align":"center"}},{"type":"Label","props":{"y":175,"x":225,"width":139,"height":22,"bgColor":"#494054","alpha":0.8},"child":[{"type":"Label","props":{"y":3,"x":106,"width":27,"var":"sevenNum","text":"x11","height":15,"fontSize":18,"font":"SimHei","color":"#d7e0ea","bold":true,"align":"right"}}]},{"type":"Image","props":{"y":131,"x":311,"visible":false,"var":"sevenAlready","skin":"ui_sign/img-yiling-duigou.png"}}]},{"type":"Image","props":{"y":655,"x":1,"skin":"ui_camp/img-huawen1.png","alpha":0.6}},{"type":"Image","props":{"y":646,"x":534,"width":89,"skin":"ui_camp/img-huawen2.png","height":94,"alpha":0.2}},{"type":"Image","props":{"y":94,"x":90,"width":89,"skin":"ui_camp/img-huawen2.png","rotation":180,"height":94,"alpha":0.2}},{"type":"Image","props":{"y":66,"var":"baibuImg","skin":"ui_sign/img-meishuzi-qiridenglu.png","centerX":1,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":111,"x":29,"width":308,"var":"textVip","text":"累计登录","height":32,"fontSize":22,"font":"SimHei","color":"#fde8e0","bold":false,"align":"left"}}]},{"type":"Label","props":{"y":825,"x":220,"width":247,"var":"weekqqadw","text":"可以继续","padding":"5","height":30,"fontSize":22,"font":"SimHei","color":"#bcbdc1"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.signIn.SevenSigninViewUI.uiView);

        }

    }
}

module ui.signIn {
    export class SignInViewUI extends View {
		public type:Laya.Label;
		public explain:Laya.Label;
		public signInList:Laya.List;
		public okBtn:Laya.Image;
		public txt:Laya.Label;
		public close:Laya.Image;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":588,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"10,10,10,10","height":731,"centerY":0.5,"centerX":0.5},"child":[{"type":"Label","props":{"y":43,"x":10,"width":568,"height":562,"bgColor":"#000000","alpha":0.4}},{"type":"Label","props":{"y":-39,"x":0,"width":588,"height":50,"bgColor":"#1b2838"}},{"type":"Label","props":{"y":-26,"x":20,"width":6,"height":25,"bgColor":"#4a408a"}},{"type":"Image","props":{"y":56,"x":33,"width":522,"skin":"ui_sign/img-hongtuo-qiandao.png","sizeGrid":"0,2,0,2","height":76}},{"type":"Label","props":{"y":-31,"x":40,"width":268,"var":"type","text":"标题读表","height":27,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":false,"align":"left"}},{"type":"Label","props":{"y":94,"x":109,"wordWrap":true,"width":418,"var":"explain","text":"说明读表","height":31,"fontSize":18,"font":"Microsoft YaHei","color":"#b7aabc","bold":false,"align":"left"}},{"type":"Image","props":{"y":96,"x":74,"skin":"ui_sign/img-tanhao-tongyong.png"}},{"type":"List","props":{"y":144,"x":35,"width":522,"var":"signInList","spaceY":20,"spaceX":22,"repeatY":3,"repeatX":5,"height":417},"child":[{"type":"Box","props":{"y":0,"x":0,"width":86,"visible":true,"renderType":"render","height":130},"child":[{"type":"Image","props":{"skin":"ui_sign/btn-yeqian-weiling.png","name":"bj"}},{"type":"Image","props":{"y":71,"x":44,"width":60,"skin":"ui_icon/icon-lihe3.png","name":"itemIcon","height":60,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":107,"x":4,"width":80,"height":22,"bgColor":"494054","alpha":0.8}},{"type":"Label","props":{"y":2,"x":8,"width":46,"visible":true,"valign":"middle","text":"1","name":"dayNum","height":25,"fontSize":28,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"Label","props":{"y":109,"x":6,"width":75,"valign":"middle","text":"物品","name":"name","height":20,"fontSize":18,"font":"SimHei","color":"#ffffff","bold":false,"align":"center"}},{"type":"Label","props":{"y":3,"x":1,"width":86,"visible":false,"name":"hui","height":127,"bgColor":"#000000","alpha":0.4}},{"type":"Image","props":{"y":62,"x":32,"visible":false,"skin":"ui_sign/img-yiling-duigou.png","name":"already"}},{"type":"Image","props":{"y":-6,"x":-6,"visible":false,"skin":"ui_sign/img-guangquan.png","name":"opt"}},{"type":"Button","props":{"y":0,"x":0,"width":86,"name":"clickBtn","height":130}},{"type":"Image","props":{"y":0,"x":54,"skin":"ui_sign/icon-shaungbei-qiandao.png","scaleY":0.8,"scaleX":0.8,"name":"vip"}}]}]},{"type":"Image","props":{"y":636,"x":228,"width":150,"var":"okBtn","skin":"ui_common/btn-huodong-p.png","sizeGrid":"10,10,10,10","height":63},"child":[{"type":"Label","props":{"y":10,"x":0,"width":150,"var":"txt","valign":"middle","text":"领取","strokeColor":"#a66336","stroke":2,"height":45,"fontSize":26,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"Image","props":{"y":-38,"var":"close","skin":"ui_main/btn-guanbi.png","right":12,"alpha":0.6}}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.signIn.SignInViewUI.uiView);

        }

    }
}

module ui.stronger {
    export class StrongerViewUI extends View {
		public btn_close:Laya.Button;
		public suit_list:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":700,"skin":"ui_common/img-lanzituo-tongyong.png","sizeGrid":"10,15,15,0","height":632,"centerY":-64,"centerX":0},"child":[{"type":"Label","props":{"y":0,"x":0,"width":700,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Button","props":{"x":637,"var":"btn_close","stateNum":1,"skin":"ui_main/btn-guanbi.png","centerY":0}},{"type":"Image","props":{"y":-33,"x":0,"skin":"ui_main/img-tianzhanshibai.png"}}]},{"type":"List","props":{"y":56,"x":11,"width":680,"var":"suit_list","spaceY":10,"height":562},"child":[{"type":"Box","props":{"y":0,"x":0,"width":680,"renderType":"render","height":96},"child":[{"type":"Label","props":{"y":0,"x":0,"width":680,"height":96,"bgColor":"#5a456a"},"child":[{"type":"Image","props":{"y":0,"x":0,"width":94,"skin":"ui_hero/img-lanpingzhilkuang.png","height":94}},{"type":"Label","props":{"y":0,"x":533,"width":147,"right":0,"height":96,"bgColor":"#242243"}},{"type":"Image","props":{"y":12,"x":600,"skin":"ui_common/img-huawen2.png","right":0,"bottom":0,"alpha":0.2}}]},{"type":"Image","props":{"y":0,"x":0,"width":94,"skin":"ui_head/icon_ui_01.png","name":"img_icon","height":94}},{"type":"Label","props":{"y":10,"x":114,"width":376,"text":"获取DPS","strokeColor":"#000000","stroke":1,"name":"tx_name","height":26,"fontSize":24,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}},{"type":"Label","props":{"y":44,"x":114,"wordWrap":true,"width":376,"text":"获取DPS，跳转到特权界面，显示肾上腺加速的特权，对应特。","name":"tx_destribe","height":44,"fontSize":20,"font":"SimHei","color":"#ffffff"}},{"type":"Button","props":{"y":50,"x":609,"stateNum":1,"skin":"ui_camp/btn-jiaru-tongyong-n.png","name":"btn_goto","labelSize":26,"labelFont":"SimHei","labelColors":"#ffffff","labelBold":true,"labelAlign":"center","label":"前往","anchorY":0.5,"anchorX":0.5}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.stronger.StrongerViewUI.uiView);

        }

    }
}

module ui.tips {
    export class AsideViewUI extends View {
		public black:Laya.Image;
		public tx_black:laya.html.dom.HTMLDivElement;
		public hero:Laya.Image;
		public avart_bg:Laya.Box;
		public text_bg:Laya.Image;
		public tx_name:laya.display.Text;
		public vector:Laya.Image;
		public tx_hero:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"black","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0f0f0f"}},{"type":"Image","props":{"width":670,"height":980,"centerY":0,"centerX":0},"child":[{"type":"HTMLDivElement","props":{"y":0,"x":0,"width":670,"var":"tx_black","height":980}}]}]},{"type":"Image","props":{"var":"hero","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.7}},{"type":"Box","props":{"y":0,"x":0,"var":"avart_bg"}},{"type":"Image","props":{"y":453,"width":720,"var":"text_bg","height":194,"centerX":0},"child":[{"type":"Image","props":{"skin":"ui_hero/img-tongyong-taitou-1.png"}},{"type":"Image","props":{"y":26,"x":0,"width":720,"skin":"ui_guid/img-bg-yindao.png","sizeGrid":"0,2,0,2","height":164}},{"type":"Label","props":{"x":0,"width":720,"top":22,"height":4,"bgColor":"#372840"}},{"type":"Label","props":{"y":22,"x":0,"width":720,"height":4,"bottom":0,"bgColor":"#372840"}},{"type":"Image","props":{"y":26,"width":720,"right":0,"height":164},"child":[{"type":"Image","props":{"y":-726,"x":17,"width":685,"skin":"ui_consumer/img-jiemian-bg-zhuagnshi-huodong.png","height":893}},{"type":"Sprite","props":{"y":0,"x":0,"renderType":"mask"},"child":[{"type":"Rect","props":{"y":0,"x":0,"width":720,"lineWidth":0,"height":164,"fillColor":"#010101"}}]}]},{"type":"Text","props":{"y":2,"x":12,"width":217,"var":"tx_name","height":23,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"center"}},{"type":"Image","props":{"y":164,"x":681,"var":"vector","skin":"ui_common/img-xiaju-oangbai.png"}},{"type":"HTMLDivElement","props":{"y":35,"x":20,"width":684,"var":"tx_hero","height":130}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);
			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.tips.AsideViewUI.uiView);

        }

    }
}

module ui.tips {
    export class MessageBoxViewUI extends View {
		public backGround:Laya.Image;
		public close1:Laya.Label;
		public title:Laya.Label;
		public bg:Laya.Image;
		public CancelBtn:Laya.Button;
		public OKBtn:Laya.Button;
		public closeBtn:Laya.Button;
		public msg:laya.html.dom.HTMLDivElement;
		public OKCenterBtn:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"var":"backGround","top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":-900,"x":-1125,"width":3000,"var":"close1","height":3000,"bgColor":"#000000","alpha":0.6}},{"type":"Label","props":{"y":438,"x":119,"width":513,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Label","props":{"x":49,"var":"title","text":"温馨提示","fontSize":26,"font":"SimHei","color":"#cce1f2","centerY":0,"align":"left"}}]},{"type":"Image","props":{"y":486,"x":120,"width":512,"var":"bg","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"40,11,9,14","height":285}},{"type":"Button","props":{"y":705,"x":256,"width":190,"var":"CancelBtn","stateNum":1,"skin":"ui_common/btn-tongyong.png","sizeGrid":"10,10,10,10","labelStrokeColor":"#872d09","labelStroke":3,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","labelBold":true,"labelAlign":"center","label":"取 消","height":65,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":704,"x":494,"width":190,"var":"OKBtn","stateNum":1,"skin":"ui_common/btn-tongyong.png","sizeGrid":"10,10,10,10","labelStrokeColor":"#872d09","labelStroke":3,"labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","labelBold":true,"labelAlign":"center","label":"确 定","height":65,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":457,"x":589,"width":44,"var":"closeBtn","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","pivotY":21,"pivotX":26,"height":42,"alpha":0.8}},{"type":"HTMLDivElement","props":{"y":517,"x":167,"width":418,"var":"msg","height":120}},{"type":"Button","props":{"y":680,"x":285,"width":180,"var":"OKCenterBtn","stateNum":1,"labelStrokeColor":"#095a28","labelStroke":3,"labelSize":26,"labelFont":"SimHei","labelColors":"#fefeff","label":"确定","height":50},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#4f7c23"}}]},{"type":"Label","props":{"y":660,"x":122,"width":510,"height":2,"color":"500","bgColor":"#7c7a88"}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.tips.MessageBoxViewUI.uiView);

        }

    }
}

module ui.tips {
    export class ShopInfoViewUI extends View {
		public infoName:laya.display.Text;
		public close:Laya.Button;
		public introduce:Laya.Label;
		public itemList:Laya.List;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"text":"label","right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.4}},{"type":"Label","props":{"y":205,"x":74,"width":613,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Text","props":{"y":13,"x":47,"width":514,"var":"infoName","text":"输入Tip名字","strokeColor":"#50560c","height":28,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":true,"align":"left"}},{"type":"Button","props":{"y":0,"x":548,"width":44,"var":"close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","height":42,"alpha":0.8}}]},{"type":"Image","props":{"y":255,"x":74,"width":613,"skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"25,10,10,10","height":692},"child":[{"type":"Image","props":{"y":69,"x":8,"width":597,"skin":"ui_shop/img-kuang-baoxiang.png","sizeGrid":"29,30,20,29","height":600}},{"type":"Label","props":{"y":27,"x":27,"width":453,"var":"introduce","valign":"middle","text":"抽奖有概率获得奖励如下：","strokeColor":"#7f5e5d","stroke":1,"height":30,"fontSize":22,"font":"SimHei","color":"#ffffff","align":"left"}},{"type":"List","props":{"y":81,"x":20,"width":573,"var":"itemList","spaceY":18,"spaceX":18,"repeatX":5,"height":579},"child":[{"type":"Box","props":{"y":0,"x":0,"width":100,"renderType":"render","height":127},"child":[{"type":"Image","props":{"y":52,"x":52,"width":84,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"bjIcon","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":52,"x":52,"width":84,"skin":"ui_icon/icon_prop_004.png","name":"icon","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":108,"x":52,"width":84,"valign":"middle","text":"name","strokeColor":"#000000","stroke":2,"name":"name","height":22,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":false,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.tips.ShopInfoViewUI.uiView);

        }

    }
}

module ui.tips {
    export class ShowGoodsTipsViewUI extends View {
		public closeTime:Laya.Label;
		public Item_1:Laya.Image;
		public bj_1:Laya.Image;
		public ItemTpye_1:Laya.Label;
		public ItemName_1:Laya.Label;
		public icon_1:Laya.Image;
		public hitValue_1:Laya.Label;
		public hpValue_1:Laya.Label;
		public tb_1:Laya.Image;
		public heroType_1:Laya.Image;
		public info_1:Laya.Image;
		public Item_2:Laya.Image;
		public bj_2:Laya.Image;
		public ItemTpye_2:Laya.Label;
		public ItemName_2:Laya.Label;
		public icon_2:Laya.Image;
		public hitValue_2:Laya.Label;
		public hpValue_2:Laya.Label;
		public tb_2:Laya.Image;
		public heroType_2:Laya.Image;
		public info_2:Laya.Image;
		public Item_3:Laya.Image;
		public bj_3:Laya.Image;
		public ItemTpye_3:Laya.Label;
		public ItemName_3:Laya.Label;
		public icon_3:Laya.Image;
		public hitValue_3:Laya.Label;
		public hpValue_3:Laya.Label;
		public tb_3:Laya.Image;
		public heroType_3:Laya.Image;
		public info_3:Laya.Image;
		public Item_4:Laya.Image;
		public bj_4:Laya.Image;
		public ItemTpye_4:Laya.Label;
		public ItemName_4:Laya.Label;
		public icon_4:Laya.Image;
		public hitValue_4:Laya.Label;
		public hpValue_4:Laya.Label;
		public tb_4:Laya.Image;
		public heroType_4:Laya.Image;
		public info_4:Laya.Image;
		public Item_5:Laya.Image;
		public bj_5:Laya.Image;
		public ItemTpye_5:Laya.Label;
		public ItemName_5:Laya.Label;
		public icon_5:Laya.Image;
		public hitValue_5:Laya.Label;
		public hpValue_5:Laya.Label;
		public tb_5:Laya.Image;
		public heroType_5:Laya.Image;
		public info_5:Laya.Image;
		public close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Label","props":{"y":1100,"x":376,"width":743,"var":"closeTime","height":28,"fontSize":30,"font":"SimHei","color":"#b2b2b2","centerX":1,"bottom":86,"bold":true,"anchorY":0.5,"anchorX":0.5,"alpha":0.6,"align":"center"}},{"type":"Image","props":{"width":200,"visible":false,"var":"Item_1","height":290,"centerY":-16,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-30,"name":"effect"}},{"type":"Image","props":{"y":11,"x":24,"var":"bj_1","skin":"ui_hero/img-chengka.png"}},{"type":"Label","props":{"y":214,"x":0,"width":200,"var":"ItemTpye_1","text":"等级  15","height":25,"fontSize":22,"font":"SimHei","color":"#fef6b0","align":"center"}},{"type":"Label","props":{"y":243,"x":0,"width":200,"var":"ItemName_1","text":"神秘宝珠","height":35,"fontSize":30,"font":"SimHei","color":"#fff073","align":"center"}},{"type":"Image","props":{"y":86,"x":100,"var":"icon_1","skin":"ui_icon/icon_tou_cg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":160,"x":92,"width":70,"var":"hitValue_1","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":180,"x":92,"width":70,"var":"hpValue_1","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":160,"x":40,"width":39,"text":"伤害","name":"hitname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":180,"x":40,"width":39,"text":"生命","name":"hpname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Image","props":{"y":19,"x":142,"var":"tb_1","skin":"ui_hero/icon-renwu-leixing-bg.png"}},{"type":"Image","props":{"y":24,"x":150,"var":"heroType_1","skin":"ui_hero/icon-renwu-leixing-gongji.png"}}]},{"type":"Image","props":{"width":200,"var":"info_1","height":290,"centerY":-16,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"width":200,"visible":false,"var":"Item_2","height":290,"centerY":-16,"centerX":-223,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-30,"name":"effect"}},{"type":"Image","props":{"y":11,"x":24,"var":"bj_2","skin":"ui_hero/img-chengka.png"}},{"type":"Label","props":{"y":214,"x":0,"width":200,"var":"ItemTpye_2","text":"等级  15","height":25,"fontSize":22,"font":"SimHei","color":"#fef6b0","align":"center"}},{"type":"Label","props":{"y":243,"x":0,"width":200,"var":"ItemName_2","text":"神秘宝珠","height":35,"fontSize":30,"font":"SimHei","color":"#fff073","align":"center"}},{"type":"Image","props":{"y":86,"x":100,"var":"icon_2","skin":"ui_icon/icon_tou_cg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":160,"x":40,"width":39,"text":"伤害","name":"hitname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":180,"x":40,"width":39,"text":"生命","name":"hpname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":160,"x":92,"width":70,"var":"hitValue_2","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":180,"x":92,"width":70,"var":"hpValue_2","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Image","props":{"y":19,"x":142,"var":"tb_2","skin":"ui_hero/icon-renwu-leixing-bg.png"}},{"type":"Image","props":{"y":24,"x":150,"var":"heroType_2","skin":"ui_hero/icon-renwu-leixing-gongji.png"}}]},{"type":"Image","props":{"width":200,"var":"info_2","height":290,"centerY":-16,"centerX":-223,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"width":200,"visible":false,"var":"Item_3","height":290,"centerY":-16,"centerX":223,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-30,"name":"effect"}},{"type":"Image","props":{"y":11,"x":24,"var":"bj_3","skin":"ui_hero/img-chengka.png"}},{"type":"Label","props":{"y":214,"x":0,"width":200,"var":"ItemTpye_3","text":"等级  15","height":25,"fontSize":22,"font":"SimHei","color":"#fef6b0","align":"center"}},{"type":"Label","props":{"y":243,"x":0,"width":200,"var":"ItemName_3","text":"神秘宝珠","height":35,"fontSize":30,"font":"SimHei","color":"#fff073","align":"center"}},{"type":"Image","props":{"y":86,"x":100,"var":"icon_3","skin":"ui_icon/icon_tou_cg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":160,"x":40,"width":39,"text":"伤害","name":"hitname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":180,"x":40,"width":39,"text":"生命","name":"hpname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":160,"x":92,"width":70,"var":"hitValue_3","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":180,"x":92,"width":70,"var":"hpValue_3","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Image","props":{"y":19,"x":142,"var":"tb_3","skin":"ui_hero/icon-renwu-leixing-bg.png"}},{"type":"Image","props":{"y":24,"x":150,"var":"heroType_3","skin":"ui_hero/icon-renwu-leixing-gongji.png"}}]},{"type":"Image","props":{"width":200,"var":"info_3","height":290,"centerY":-16,"centerX":223,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"width":200,"visible":false,"var":"Item_4","height":290,"centerY":305,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-30,"name":"effect"}},{"type":"Image","props":{"y":11,"x":24,"var":"bj_4","skin":"ui_hero/img-chengka.png"}},{"type":"Label","props":{"y":214,"x":0,"width":200,"var":"ItemTpye_4","text":"等级  15","height":25,"fontSize":22,"font":"SimHei","color":"#fef6b0","align":"center"}},{"type":"Label","props":{"y":243,"x":0,"width":200,"var":"ItemName_4","text":"神秘宝珠","height":35,"fontSize":30,"font":"SimHei","color":"#fff073","align":"center"}},{"type":"Image","props":{"y":86,"x":100,"var":"icon_4","skin":"ui_icon/icon_tou_cg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":160,"x":40,"width":39,"text":"伤害","name":"hitname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":180,"x":40,"width":39,"text":"生命","name":"hpname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":160,"x":92,"width":70,"var":"hitValue_4","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":180,"x":92,"width":70,"var":"hpValue_4","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Image","props":{"y":19,"x":142,"var":"tb_4","skin":"ui_hero/icon-renwu-leixing-bg.png"}},{"type":"Image","props":{"y":24,"x":150,"var":"heroType_4","skin":"ui_hero/icon-renwu-leixing-gongji.png"}}]},{"type":"Image","props":{"width":200,"var":"info_4","height":290,"centerY":305,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"width":200,"visible":false,"var":"Item_5","height":290,"centerY":-342,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":-30,"name":"effect"}},{"type":"Image","props":{"y":11,"x":24,"var":"bj_5","skin":"ui_hero/img-chengka.png"}},{"type":"Label","props":{"y":214,"x":0,"width":200,"var":"ItemTpye_5","text":"等级  15","height":25,"fontSize":22,"font":"SimHei","color":"#fef6b0","align":"center"}},{"type":"Label","props":{"y":243,"x":0,"width":200,"var":"ItemName_5","text":"神秘宝珠","height":35,"fontSize":30,"font":"SimHei","color":"#fff073","align":"center"}},{"type":"Image","props":{"y":86,"x":100,"var":"icon_5","skin":"ui_icon/icon_tou_cg.png","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":160,"x":40,"width":39,"text":"伤害","name":"hitname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":180,"x":40,"width":39,"text":"生命","name":"hpname","height":20,"fontSize":18,"font":"SimHei","color":"#fef6b0","bold":false}},{"type":"Label","props":{"y":160,"x":92,"width":70,"var":"hitValue_5","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":180,"x":92,"width":70,"var":"hpValue_5","text":"321.611","height":20,"fontSize":18,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Image","props":{"y":19,"x":142,"var":"tb_5","skin":"ui_hero/icon-renwu-leixing-bg.png"}},{"type":"Image","props":{"y":24,"x":150,"var":"heroType_5","skin":"ui_hero/icon-renwu-leixing-gongji.png"}}]},{"type":"Image","props":{"width":200,"var":"info_5","height":290,"centerY":-342,"centerX":0,"anchorY":0.5,"anchorX":0.5}},{"type":"Button","props":{"y":0,"x":3,"width":750,"var":"close","height":1200}}]};
        constructor(){ super()}
        createChildren():void {
        
            super.createChildren();
            this.createView(ui.tips.ShowGoodsTipsViewUI.uiView);

        }

    }
}

module ui.tips {
    export class SkillInfoViewUI extends View {
		public tipName:laya.display.Text;
		public close:Laya.Button;
		public skillicon:Laya.Image;
		public skillname:Laya.Label;
		public skilllvlabel:Laya.Label;
		public consume:Laya.Label;
		public desc:laya.html.dom.HTMLDivElement;
		public desceffect:laya.html.dom.HTMLDivElement;
		public nextffect:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"width":588,"height":688,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":51,"x":0,"width":588,"height":637,"bgColor":"#5e5f77"}},{"type":"Label","props":{"y":183,"x":10,"width":568,"height":495,"bgColor":"#2c2d45"}},{"type":"Label","props":{"y":0,"x":0,"width":588,"height":51,"bgColor":"#000000","alpha":1}},{"type":"Image","props":{"y":594,"x":498,"skin":"ui_camp/img-huawen2.png","alpha":0.2}},{"type":"Image","props":{"y":268,"x":91,"skin":"ui_camp/img-huawen2.png","skewY":180,"skewX":180,"alpha":0.2}},{"type":"Image","props":{"y":50,"x":589,"skin":"ui_camp/img-huawen1.png","skewY":180,"alpha":0.5}},{"type":"Text","props":{"y":10,"x":34,"width":110,"var":"tipName","text":"主动技能","strokeColor":"#000000","height":35,"fontSize":26,"font":"SimHei","color":"#e4eafa","bold":true,"align":"left"}},{"type":"Image","props":{"y":7,"x":0,"width":213,"skin":"ui_hero/img-zhuangshi-tangchuchuang.png","height":36}},{"type":"Button","props":{"var":"close","top":7,"stateNum":1,"skin":"ui_main/btn-guanbi.png","name":"close","left":506}},{"type":"Rect","props":{"y":62,"x":0,"width":589,"lineWidth":1,"height":111,"fillColor":"#5d4565"}},{"type":"Image","props":{"y":75,"x":22,"width":85,"var":"skillicon","height":85}},{"type":"Label","props":{"y":74,"x":238,"var":"skillname","text":"英雄名字","fontSize":24,"font":"SimHei","color":"#fefeff","align":"left"}},{"type":"Label","props":{"y":75,"x":131,"width":31.171875,"text":"LV:","height":20,"fontSize":22,"font":"SimHei","color":"#c0eb9f","bold":true,"align":"left"}},{"type":"Label","props":{"y":76,"x":393,"width":81,"text":"消耗法力:","height":18,"fontSize":22,"font":"SimHei","color":"#c0eb9f","align":"left"}},{"type":"Image","props":{"y":202,"x":20,"width":30,"skin":"ui_main/img-zhuangshi-xiaobingti-tongyong1.png","height":30},"child":[{"type":"Label","props":{"y":3,"x":36,"width":174,"text":"当前等级效果","height":24,"fontSize":26,"font":"SimHei","color":"#e4eafa"}}]},{"type":"Label","props":{"y":75,"x":165,"width":65,"var":"skilllvlabel","text":"4","height":20,"fontSize":22,"font":"SimHei","color":"#ffff79","bold":true,"align":"left"}},{"type":"Label","props":{"y":77,"x":496,"width":68,"var":"consume","text":"4","height":20,"fontSize":22,"font":"SimHei","color":"#ffff79","bold":true,"align":"left"}},{"type":"HTMLDivElement","props":{"y":107,"x":131,"width":372,"var":"desc","innerHTML":"fdsfdsfd","height":26}},{"type":"HTMLDivElement","props":{"y":245,"x":56,"width":529,"var":"desceffect","innerHTML":"fdsfdsfd","height":26}},{"type":"Label","props":{"y":319,"x":56,"text":"下一等级效果","fontSize":26,"font":"SimHei","color":"#e4eafa","align":"left"},"child":[{"type":"Image","props":{"y":-2,"x":-34,"width":30,"skin":"ui_main/img-zhuangshi-xiaobingti-tongyong1.png","height":30}}]},{"type":"HTMLDivElement","props":{"y":352,"x":56,"width":436,"var":"nextffect","innerHTML":"fdsfdsfd","height":26}}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.tips.SkillInfoViewUI.uiView);

        }

    }
}

module ui.tips {
    export class TipsActionViewUI extends View {
		public contentbg:Laya.Label;
		public txt_name:laya.display.Text;
		public btn_close:Laya.Button;
		public txt_head:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"y":0,"x":0,"width":750,"height":1200},"child":[{"type":"Label","props":{"y":0,"x":0,"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.8}},{"type":"Image","props":{"y":375,"x":82,"width":586,"mouseThrough":false,"height":451,"centerY":0,"centerX":0},"child":[{"type":"Image","props":{"width":586,"skin":"ui_action/ui-liebiaotiao-taitou-huodong.png","mouseThrough":false,"height":52,"centerX":0},"child":[{"type":"Label","props":{"y":50,"x":0,"width":586,"var":"contentbg","height":400,"bgColor":"#c8c7c7"}},{"type":"Image","props":{"y":133,"x":80,"skin":"ui_common/img-huawen2.png","scaleY":-1,"scaleX":-1,"alpha":0.4}},{"type":"Label","props":{"y":213,"x":12,"width":6,"height":25,"centerY":0,"bgColor":"#c3b33a"}}]},{"type":"Text","props":{"y":12,"x":33,"width":400,"var":"txt_name","text":"输入Tip名字","strokeColor":"#50560c","height":28,"fontSize":24,"font":"SimHei","color":"#e4eafe","align":"left"}},{"type":"Button","props":{"y":4,"var":"btn_close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":21}},{"type":"Label","props":{"y":71,"x":42,"width":231,"var":"txt_head","text":"详情","height":22,"fontSize":20,"font":"SimHei","color":"#225a88","align":"left"}},{"type":"Text","props":{"y":405,"x":468,"width":100,"text":"2019.9.1","height":31,"fontSize":20,"font":"SimHei"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);

            super.createChildren();
            this.createView(ui.tips.TipsActionViewUI.uiView);

        }

    }
}

module ui.tips {
    export class TipsTreasureViewUI extends View {
		public bj:Laya.Image;
		public bj_2:Laya.Image;
		public boxBuy:Laya.Button;
		public Boxprice:laya.display.Text;
		public prictIcon:Laya.Image;
		public boxBox:Laya.Box;
		public boxList:Laya.List;
		public describe:Laya.Label;
		public proBox:Laya.Box;
		public proBgIcon:Laya.Image;
		public proImg:Laya.Image;
		public proNum:laya.display.Text;
		public proName:laya.display.Text;
		public proContent:laya.display.Text;
		public heroBox:Laya.Box;
		public petBox:Laya.Box;
		public tipName:laya.display.Text;
		public close:Laya.Button;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0,"bgColor":"#000000","alpha":0.4}},{"type":"Image","props":{"width":586,"var":"bj","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"19,10,10,10","height":584,"centerY":9,"centerX":1,"anchorY":0.5,"anchorX":0.5,"alpha":1},"child":[{"type":"Image","props":{"y":361,"width":568,"visible":false,"var":"bj_2","skin":"ui_camp/img-lanzituo-tongyong.png","sizeGrid":"46,1,1,1","height":353,"centerX":0,"anchorY":1,"anchorX":1},"child":[{"type":"Label","props":{"y":353,"x":0,"width":568,"height":1,"bgColor":"#8185A7"}}]},{"type":"Button","props":{"y":532,"x":295,"var":"boxBuy","stateNum":1,"skin":"ui_hero/btn-huang.png","sizeGrid":"20,20,20,20","name":"boxBuy","labelStrokeColor":"#e5fff3","labelSize":28,"labelFont":"SimHei","labelColors":"#ffffff,#ffffff,#ffffff,#ffffff","labelBold":true,"labelAlign":"center","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Text","props":{"y":6,"x":74,"width":46,"var":"Boxprice","text":"750","strokeColor":"#8b4d34","stroke":1,"name":"Boxprice","height":19,"fontSize":18,"font":"Helvetica","color":"#27af3d","bold":true,"align":"left"}},{"type":"Image","props":{"y":7,"x":13,"width":17,"var":"prictIcon","skin":"ui_icon/icon_prop_013.png","name":"prictIcon","height":16}},{"type":"Label","props":{"y":30,"x":0,"width":160,"valign":"middle","text":"购买","strokeColor":"#a65e5d","stroke":3,"height":30,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":true,"align":"center"}}]},{"type":"Box","props":{"var":"boxBox"},"child":[{"type":"List","props":{"y":83,"x":72,"width":442,"var":"boxList","spaceY":10,"spaceX":35,"repeatY":2,"repeatX":4,"name":"boxList","height":250},"child":[{"type":"Box","props":{"y":4,"x":0,"width":84,"renderType":"render","height":124},"child":[{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_hero/img-lanpingzhilkuang.png","name":"bjIcon","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":42,"x":42,"width":84,"skin":"ui_icon/icon_prop_005.png","name":"boxProImg","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"x":1,"width":82,"height":20,"bottom":41,"bgColor":"#000000","alpha":0.3}},{"type":"Text","props":{"y":64,"x":46,"width":34,"text":"99","name":"boxProNum","height":18,"fontSize":18,"font":"Helvetica","color":"#C0C7DE","bold":true,"align":"right"}},{"type":"Text","props":{"y":88,"x":0,"width":84,"text":"name","name":"boxProName","height":24,"fontSize":20,"font":"Helvetica","color":"#ffffff","bold":true,"align":"center"}}]}]},{"type":"Label","props":{"y":20,"x":22,"width":192,"var":"describe","text":"阿斯达","height":27,"fontSize":22,"font":"SimHei","color":"#ffffff","bold":false,"align":"left"}}]},{"type":"Box","props":{"y":50,"x":65,"width":465,"visible":false,"var":"proBox","renderType":"render","height":201},"child":[{"type":"Image","props":{"y":42,"x":42,"width":84,"var":"proBgIcon","skin":"ui_hero/img-lanpingzhilkuang.png","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Image","props":{"y":42,"x":42,"width":84,"var":"proImg","skin":"ui_icon/icon_prop_005.png","height":84,"anchorY":0.5,"anchorX":0.5}},{"type":"Text","props":{"y":38,"x":111,"width":34,"var":"proNum","text":"99","height":18,"fontSize":18,"font":"Helvetica","color":"#C0C7DE","bold":true,"align":"left"}},{"type":"Text","props":{"y":2,"x":111,"width":84,"var":"proName","text":"name","height":24,"fontSize":20,"font":"Helvetica","color":"#ffffff","bold":true,"align":"left"}},{"type":"Text","props":{"y":127,"x":1,"wordWrap":true,"width":451,"var":"proContent","text":"内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容","height":99,"fontSize":18,"font":"Helvetica","color":"#d6d7dd","bold":true,"align":"left"}}]},{"type":"Box","props":{"y":192,"x":312,"width":518,"visible":false,"var":"heroBox","renderType":"render","height":314,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":-42,"width":206,"skin":"ui_hero/img-yingxiong-zhanshi-huang.png","sizeGrid":"30,30,30,30","scaleY":1.5,"scaleX":1.5,"name":"icon","height":262}},{"type":"Image","props":{"y":27,"x":299,"skin":"ui_hero/icon-renwu-leixing-gongji.png","name":"typeIcon","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":15,"x":311,"width":214,"text":"名字","name":"name","height":26,"fontSize":22,"font":"SimHei","color":"#fefeff","bold":true,"align":"left"}},{"type":"Label","props":{"y":50,"x":287,"width":73,"text":"等级：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":75,"x":287,"width":73,"text":"品质：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":100,"x":287,"width":73,"text":"类型：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":175,"x":287,"width":73,"text":"先手：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":125,"x":287,"width":73,"text":"生命：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":150,"x":287,"width":73,"text":"伤害：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":256,"x":287,"width":109,"text":"队长技能：","height":26,"fontSize":20,"font":"SimHei","color":"#fefeff","bold":false}},{"type":"Label","props":{"y":200,"x":287,"width":73,"text":"暴击率：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":225,"x":287,"width":73,"text":"暴击倍率：","height":26,"fontSize":18,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":50,"x":447,"width":73,"text":"label","name":"lv","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":75,"x":447,"width":73,"text":"label","name":"quality","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":100,"x":447,"width":73,"text":"label","name":"type","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":125,"x":447,"width":73,"text":"label","name":"hp","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":150,"x":447,"width":73,"text":"label","name":"hit","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":175,"x":447,"width":73,"text":"label","name":"earlier","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":200,"x":447,"width":73,"text":"label","name":"crit","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":225,"x":447,"width":73,"text":"label","name":"critRatio","height":26,"fontSize":18,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"HTMLDivElement","props":{"y":284,"x":287,"width":236,"name":"desc","innerHTML":"htmlText","height":94}},{"type":"Label","props":{"y":414,"x":-42,"width":566,"height":2,"bgColor":"#414d73"}}]},{"type":"Box","props":{"y":187,"x":312,"width":518,"visible":false,"var":"petBox","renderType":"render","height":314,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Image","props":{"y":0,"x":-42,"width":206,"skin":"ui_hero/img-yingxiong-zhanshi-huang.png","sizeGrid":"13,14,13,19","scaleY":1.5,"scaleX":1.5,"name":"icon","height":262}},{"type":"Image","props":{"y":27,"x":299,"skin":"ui_hero/icon-renwu-leixing-gongji.png","name":"type","anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":15,"x":287,"width":214,"text":"名字","name":"name","height":26,"fontSize":26,"font":"SimHei","color":"#fefeff","bold":true,"align":"left"}},{"type":"Label","props":{"y":50,"x":287,"width":73,"text":"等级：","height":26,"fontSize":20,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":75,"x":287,"width":73,"text":"品质：","height":26,"fontSize":20,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":100,"x":287,"width":73,"text":"种族：","height":26,"fontSize":20,"font":"SimHei","color":"#9be585","bold":false}},{"type":"Label","props":{"y":137,"x":287,"width":109,"text":"神兽介绍：","height":26,"fontSize":20,"font":"SimHei","color":"#fefeff","bold":true}},{"type":"Label","props":{"y":50,"x":440,"width":73,"text":"label","name":"lv","height":26,"fontSize":20,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":75,"x":440,"width":73,"text":"label","name":"color","height":26,"fontSize":20,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"Label","props":{"y":100,"x":366,"width":147,"text":"label","name":"phyle","height":26,"fontSize":20,"font":"SimHei","color":"#f4ff79","bold":false,"align":"right"}},{"type":"HTMLDivElement","props":{"y":175,"x":287,"width":236,"name":"desc","innerHTML":"htmlText","height":208}},{"type":"Image","props":{"y":422,"x":-52,"skin":"ui_pet/btn-xuanzhong-shenshou.png","name":"prime"},"child":[{"type":"Label","props":{"y":8,"x":10,"width":134,"text":"主属性","name":"txt_1","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#491a22","bold":true,"align":"left"}},{"type":"Label","props":{"y":32,"x":10,"width":175,"text":"主属性","name":"prime_1","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#491a22","bold":false,"align":"left"}},{"type":"Label","props":{"y":58,"x":10,"width":234,"text":"主属性","name":"prime_2","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#491a22","bold":false,"align":"left"}}]},{"type":"Image","props":{"y":422,"x":240,"skin":"ui_pet/btn-weixuanzhong-shenshou.png","name":"auxiliary"},"child":[{"type":"Label","props":{"y":4,"x":10,"width":177,"text":"辅助","name":"txt_2","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#7f8aaa","bold":true,"align":"left"}},{"type":"Label","props":{"y":30,"x":10,"width":224,"text":"辅助","name":"auxiliary_1","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#7f8aaa","bold":false,"align":"left"}},{"type":"Label","props":{"y":56,"x":10,"width":219,"text":"辅助","name":"auxiliary_2","height":24,"fontSize":22,"font":"Microsoft YaHei","color":"#7f8aaa","bold":false,"align":"left"}}]},{"type":"Label","props":{"y":512,"x":239,"width":560,"name":"zs","height":2,"bgColor":"#2e455b","anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":-73,"x":280,"width":2,"name":"txt_1","height":60,"bgColor":"#2e455b"}}]}]},{"type":"Label","props":{"y":-40,"x":0,"width":586,"height":50,"bgColor":"#1b2838"},"child":[{"type":"Label","props":{"x":26,"width":6,"height":25,"centerY":0,"bgColor":"#4a408a"}},{"type":"Text","props":{"y":12,"x":47,"width":514,"var":"tipName","text":"输入Tip名字","strokeColor":"#50560c","name":"tipName","height":28,"fontSize":24,"font":"SimHei","color":"#e4eafe","bold":true,"align":"left"}},{"type":"Button","props":{"var":"close","stateNum":1,"skin":"ui_common/btn-X-tongyong.png","right":30,"name":"close","centerY":0}}]}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("Text",laya.display.Text);
			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.tips.TipsTreasureViewUI.uiView);

        }

    }
}

module ui.tips {
    export class TipsViewUI extends View {
		public backGround:Laya.Image;
		public imageBg:Laya.Image;
		public msgLabel:laya.html.dom.HTMLDivElement;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Image","props":{"width":750,"var":"backGround","height":1200},"child":[{"type":"Image","props":{"y":600,"x":375,"width":400,"var":"imageBg","skin":"ui_common/img-heijianbian.png","height":50,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"HTMLDivElement","props":{"y":12.5,"x":50,"width":300,"var":"msgLabel","height":25}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.tips.TipsViewUI.uiView);

        }

    }
}

module ui.vip {
    export class VipViewUI extends View {
		public close:Laya.Image;
		public validTime:Laya.Label;
		public addNum:Laya.Label;
		public boxDiamondDescription:Laya.Box;
		public vipDiamondDescription:laya.html.dom.HTMLDivElement;
		public contentList:Laya.List;
		public buybun:Laya.Button;
		public buytext:Laya.Label;
		public moneytext:Laya.Label;
		public text_2:Laya.Label;
		public text_1:Laya.Label;

        public static  uiView:any ={"type":"View","props":{"width":750,"height":1200},"child":[{"type":"Label","props":{"top":0,"right":0,"left":0,"bottom":0},"child":[{"type":"Label","props":{"y":0,"x":-1,"top":0,"right":0,"left":-1,"bottom":0,"bgColor":"#0c0908","alpha":0.8}},{"type":"Image","props":{"width":660,"skin":"ui_vip/img-bg-vip.png","sizeGrid":"0,10,15,10","height":909,"centerY":0,"centerX":0},"child":[{"type":"Label","props":{"y":2,"x":5,"width":650,"height":42,"bgColor":"#202025"},"child":[{"type":"Image","props":{"var":"close","skin":"ui_main/btn-guanbi.png","right":12}},{"type":"Image","props":{"y":-39,"x":-6,"skin":"ui_vip/img-zhuangshi-taitou-vip.png"},"child":[{"type":"Label","props":{"y":36,"x":86,"width":92,"text":"VIP","height":60,"fontSize":43,"font":"SimHei","color":"#602051","bold":true}},{"type":"Label","props":{"y":28,"x":84,"width":92,"text":"VIP","strokeColor":"#aa509b","stroke":1,"height":60,"fontSize":43,"font":"SimHei","color":"#dbd5df","bold":true}}]}]},{"type":"Image","props":{"y":318,"skin":"ui_vip/img-hua-vip.png","centerX":1,"anchorY":0.5,"anchorX":0.5}},{"type":"Label","props":{"y":65,"x":30,"width":182,"var":"validTime","text":"有效时间：","height":29,"fontSize":20,"font":"Microsoft YaHei","color":"#826c95","bold":false}},{"type":"Label","props":{"y":65,"x":440,"width":182,"var":"addNum","text":"累计次数：3/5次","height":29,"fontSize":20,"font":"Microsoft YaHei","color":"#826c95","bold":false,"align":"right"}},{"type":"Image","props":{"y":96,"x":5,"skin":"ui_vip/img-xiaotaitou-bg-vip.png"},"child":[{"type":"Label","props":{"y":9,"x":49,"width":182,"text":"专属特权","height":29,"fontSize":28,"font":"SimHei","color":"#3e1a26","bold":false,"align":"left"}},{"type":"Label","props":{"y":7,"x":47,"width":182,"text":"专属特权","strokeColor":"713177","stroke":1,"height":30,"fontSize":28,"font":"SimHei","color":"#ecc8a3","bold":false,"align":"left"}},{"type":"Image","props":{"y":11,"x":23,"skin":"ui_vip/img-xiaotaitou-zhuagnshi-vip.png"}}]},{"type":"Box","props":{"y":471,"x":64,"width":567,"var":"boxDiamondDescription","renderType":"render","height":32},"child":[{"type":"Image","props":{"y":17,"x":12,"width":34,"skin":"ui_vip/img-wenzizhuangshi-vip.png","height":34,"anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":9,"x":36,"width":510,"var":"vipDiamondDescription","innerHTML":"htmlText","height":50}}]},{"type":"List","props":{"y":509,"x":64,"width":540,"var":"contentList","spaceY":7,"repeatX":1,"height":376},"child":[{"type":"Box","props":{"y":31,"x":0,"width":500,"renderType":"render","height":32},"child":[{"type":"Image","props":{"y":17,"x":12.409999999999997,"skin":"ui_vip/img-wenzizhuangshi-vip.png","scaleY":0.73,"scaleX":0.73,"anchorY":0.5,"anchorX":0.5}},{"type":"HTMLDivElement","props":{"y":8,"x":36,"width":500,"name":"contentStr","innerHTML":"htmlText","height":25}}]}]},{"type":"Button","props":{"y":838,"var":"buybun","stateNum":1,"skin":"ui_action/btn-huodong-p.png","scaleY":1,"scaleX":1,"centerX":0,"anchorY":0.5,"anchorX":0.5},"child":[{"type":"Label","props":{"y":8,"x":1,"width":160,"var":"buytext","text":"30元","height":29,"fontSize":26,"font":"SimHei","color":"#5f2904","bold":true,"align":"center"}},{"type":"Label","props":{"y":45,"x":0,"width":160,"text":"获得永久VIP特权","name":"text_2","height":29,"fontSize":18,"font":"SimHei","color":"#ffc58b","bold":false,"align":"center"}},{"type":"Image","props":{"y":-3,"x":15,"width":26,"skin":"ui_hero/img-biaoqian-zhekou-bg.png","name":"point","height":30},"child":[{"type":"Label","props":{"y":1,"x":-5,"width":37,"text":"限时","strokeColor":"#d10805","stroke":3,"rotation":8,"height":18,"fontSize":18,"font":"SimHei","color":"#ffffff"}}]}]},{"type":"Label","props":{"y":775,"width":157,"var":"moneytext","text":"原价：288","height":25,"fontSize":20,"font":"SimHei","color":"#fcf1ca","centerX":0,"bold":true,"align":"center"},"child":[{"type":"Label","props":{"y":3,"x":30,"width":100,"rotation":4,"height":2,"bgColor":"#ca2a28"}}]},{"type":"Label","props":{"y":808,"width":589,"visible":false,"var":"text_2","text":"已永久激活VIP","height":33,"fontSize":30,"font":"SimHei","color":"#842333","centerX":3,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}},{"type":"Label","props":{"y":806,"width":589,"visible":false,"var":"text_1","text":"已永久激活VIP","height":33,"fontSize":30,"font":"SimHei","color":"#fcda85","centerX":0,"bold":true,"anchorY":0.5,"anchorX":0.5,"align":"center"}}]}]}]};
        constructor(){ super()}
        createChildren():void {
        			View.regComponent("HTMLDivElement",laya.html.dom.HTMLDivElement);

            super.createChildren();
            this.createView(ui.vip.VipViewUI.uiView);

        }

    }
}
