module H52D_Framework {
	AddViewResource("SettingView",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_head.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_hero.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_setting.atlas", type: Laya.Loader.ATLAS },
		]);
	/**
	 * @class 设置页面
	 * @author zhangyusong 
	 **/
	export class SettingView extends ui.setting.SettingViewUI {
		private defaultVo:HeadVo;
        private heroHead:Array<number>;
		private openSound:boolean;
		private openMusic:boolean;

		constructor() {
			super();
			this.ViewInit();
			this.EventInit();
			this.btn_name.visible=false
		}

		private ViewInit() {
			/** 默认头像信息 */
			this.defaultVo = new HeadVo();
            this.defaultVo.headSelect = true;
			this.ChangeName(false);
			this.ChangeHead(false);
			this.txt_username.text = MasterPlayer.Instance.player.Name;
			this.effect_select.visible = MasterPlayer.Instance.player.Sound;
			this.music_select.visible = MasterPlayer.Instance.player.Music;
		}

		private EventInit() {
			this.on(Laya.Event.REMOVED, this, this.Destroy);
			Event.RegistEvent(EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this,this.ChangeName));
			Event.RegistEvent(EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this,this.ChangeHead));
			
			this.btn_close.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_close"]);
			this.btn_head.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_head"]);
			this.img_head.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_head"]);
			//this.btn_name.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_name"]);
			this.btn_effect.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_sound"]);
			this.btn_music.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_music"]);
			this.btn_ok.on(Laya.Event.CLICK, this, this.OnBtnClick,["btn_ok"]);
		}

		private Destroy(){
			Event.RemoveEvent(EventDefine.PLAYER_NAME_UPDATE, Laya.Handler.create(this,this.ChangeName));
			Event.RemoveEvent(EventDefine.PLAYER_HEAD_UPDATE, Laya.Handler.create(this,this.ChangeHead));
		}

		/** 名字更新 */
		private ChangeName(tips:boolean = true){
			this.txt_username.text = MasterPlayer.Instance.player.Name;
			if(tips){
				TipsLogic.Instance.OpenSystemTips("改名成功");
				UIManager.Instance.DestroyUI("SettingNameView", [ViewUpRoot]);
			}
		}

		/** 头像更新 */
		private ChangeHead(tips:boolean = true){
			this.defaultVo.headId = MasterPlayer.Instance.player.HeadId;
			if(this.defaultVo.headId==0){
				this.defaultVo.headRes = "ui_head/icon_ui_01.png";
			}
			else{
				this.defaultVo.headRes = "ui_icon/" + HeroConfig[this.defaultVo.headId].strIcon;
			}
			this.img_head.skin = this.defaultVo.headRes;
			if(tips){
				TipsLogic.Instance.OpenSystemTips("更换头像成功");
				UIManager.Instance.DestroyUI("SettingHeadView", [ViewUpRoot]);
			}
		}

		private OnBtnClick(btnName:string){
			switch(btnName){
				case "btn_head"://改头像
					UIManager.Instance.CreateUI("SettingHeadView", [ViewUpRoot,this.defaultVo.headId]);
					//头像点击音效
					SoundManager.Instance.OnPlaySound("res/sound/check.mp3")
				break;
				case "btn_name"://改名
					//UIManager.Instance.CreateUI("SettingNameView", [ViewUpRoot]);
				break;
				case "btn_sound"://音效
					let sound = MasterPlayer.Instance.player.Sound = !MasterPlayer.Instance.player.Sound;
					this.effect_select.visible = sound;
					SetLocalStorage("sound", sound ? "1" : "0", true);
				break;
				case "btn_music"://音乐
					let music:boolean = MasterPlayer.Instance.player.Music = !MasterPlayer.Instance.player.Music
					this.music_select.visible = music;
					SetLocalStorage("music",music?"1":"0",true);
					Event.DispatchEvent("PlayMusic");
				break;
				case "btn_close"://关闭
				case "btn_ok"://确定
					UIManager.Instance.DestroyUI("SettingView", [ViewUpRoot]);
				break;
			}
		}

	}
}