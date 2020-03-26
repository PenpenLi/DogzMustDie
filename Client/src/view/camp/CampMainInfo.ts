/**Created by the LayaAirIDE*/
module H52D_Framework {
	AddViewResource("CampMainInfo",
		[
			{ url: "res/ui/ui_camp.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/ui/ui_action.atlas", type: Laya.Loader.ATLAS },
		]);

	/**阵营主界面 */
	export class CampMainInfo extends ui.camp.CampMainInfoUI {
		constructor() {
			super();
						
			this.Init();
			this.AddEvent();
			Tick.Loop(5000,this,CampManager.Instance.Camp_Info);
			Tick.Loop(2500,this,this.UpdateShow);			
		}		
		private _Info = [];
		private _camp_Id: number;
		private Btn_name = {
			CampPlay: ["CampMemberView"],
			CampRank: ["CampRankView"],
			CampDonate: ["CampDonateView"],
			CampReplace: ["ReplaceCampView"],
		}

		private Init() {			
			this._camp_Id = MasterPlayer.Instance.player.CampID
			this.CampInfo();
			this.SetCamp_Info();	
			this.UpdateShow();
		}

		private AddEvent() {
			Event.RegistEvent("chengehot", Laya.Handler.create(this, this.CampInfo))
			Event.RegistEvent("changetimes", Laya.Handler.create(this, this.CampInfo))
			Event.RegistEvent("updatecamplist", Laya.Handler.create(this, this.SetCamp_Info))
			this.Btn_Close.on(Laya.Event.CLICK, this, this.BtnClick_Close);
			this.Other.on(Laya.Event.CLICK, this, this.BtnClick_Close);
			this.Btn_CampPlay.on(Laya.Event.CLICK, this, this.GetPlayInfo);
			this.Btn_CampRank.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampRank]);
			this.Btn_CampDonate.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampDonate]);
			this.camp_help.on(Laya.Event.CLICK, this, this.OpenView)
			this.Btn_Change.on(Laya.Event.CLICK, this, this.Btn_Click, [this.Btn_name.CampReplace]);
			this.on(Laya.Event.REMOVED, this, this.Destory);
		}

		private CampInfo() {
			if(this._camp_Id==0) return ;
			let ncamp=CampManager.Instance.nCamp(this._camp_Id)
			let camp_tcfg = GangConfig[this._camp_Id];
			this.camp_name.text = GetInfoAttr.Instance.GetText(camp_tcfg.nameId);
			this.camp_icon.skin = "ui_icon/" + camp_tcfg.stricon;
			SetHtmlStyle(this.camp_lv, 20, "#9be589", "left");
			this.camp_lv.innerHTML = "阵营等级:" + GetHtmlStrByColor(ncamp[3], "#f4ff79");
			SetHtmlStyle(this.camp_hot, 20, "#9be589", "left");
			SetHtmlStyle(this.camp_hurt, 20, "#9be589", "left");
			let hurt=BCampManager.Instance.Camp.vo.attr.GetAttributeValue(2)* BCampManager.Instance.Camp.vo.ratio;
			this.camp_hurt.innerHTML = "大船伤害:" + GetHtmlStrByColor(Math.floor(hurt).toString(), "#f4ff79");
			let hot_num=CampManager.Instance.CampHot;			
			if(!hot_num){
				hot_num=ncamp[4];
			}
			let camp_lv=CampManager.Instance.Camp_LvMax()
			let str = Format(GetInfoAttr.Instance.GetText(6013), GetHtmlStrByColor( String(hot_num),"#f4ff79"), GangLevelUpConfig[ncamp[3]].GangExp);
			if(camp_lv<=ncamp[3]){
				str="已满级";
			}			
			this.camp_hot.innerHTML = str;
			SetHtmlStyle(this.camp_num, 20, "#9be589", "left");
			this.camp_num.innerHTML="阵营人数:"+GetHtmlStrByColor(ncamp[2],"#f4ff79")+"/"+GangLevelUpConfig[ncamp[3]].Membership;
		}

		/**设置阵营日志 */
		private SetCamp_Info() {
			let infoList = CampManager.Instance.LogList;
			this.Camp_Panel.vScrollBarSkin = "";
			this.Camp_Info.height=0;
			this.Camp_Panel.vScrollBar.value=0;
			for (let key in infoList) {
				let info = infoList[key];
				let html: Laya.HTMLDivElement = new Laya.HTMLDivElement();
				SetHtmlStyle(html, 22,BaseDefine.CampInfo_Color[info[0]],"left")//
				html.style.wordWrap = true;
				html.x = 35;				
				let Idx=Number(key);
				html.y = 10+(Idx*65);
				
				let str = CampManager.Instance.logInfo(info);
				let path="<img src= 'ui_camp/img-dian-tongyong.png' width='24px' height='24px'></img>";
				html.innerHTML =path+str;
				html.width=600;
				this.Camp_Info.addChild(html);				
				this.Camp_Info.height=(Idx+1)*65;				
				this.Camp_Panel.vScrollBar.value=html.y
			}
		}

		private BtnClick_Close() {
			UIManager.Instance.DestroyUI("CampMainInfo", [ViewUpRoot]);
		}

		/** */
		private Btn_Click(name: string) {
			UIManager.Instance.CreateUI(name, [ViewUpRoot]);			
		}

		private OpenView() {
			let title:string = "阵营说明";
			let content:string = GetInfoAttr.Instance.GetText(6010);
			UIManager.Instance.CreateUI("TipsActionView", [ViewToppestRoot, title, content]);
			SoundManager.Instance.OnPlaySound("res/sound/check.mp3");			
		}
        
		private GetPlayInfo() { 
			CampManager.Instance.GetCampPlayInfo(this._camp_Id);
			UIManager.Instance.CreateUI("CampMemberView", [ViewUpRoot,this._camp_Id]);			
		}

		private UpdateShow(){
			let bool=CampManager.Instance.ShowRed(this.D_red);
			this.D_red.visible=bool;
		}

		private Destory() {
			this.offAll();
			Event.RemoveEvent("chengehot", Laya.Handler.create(this, this.CampInfo));
			Event.RemoveEvent("updatecamplist", Laya.Handler.create(this, this.SetCamp_Info));
			Event.RemoveEvent("changetimes", Laya.Handler.create(this, this.CampInfo));
		}
	}
}