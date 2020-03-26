/**
* name 
*/
module H52D_Framework {
	export class CampManager {
		/***所有的阵营信息 */
		private camp_List = {};
		private camp_Id: Array<number> = [];
		private Play_List: { [ID: number]: Player } = {};
		private static _instance: CampManager;
		private _LogList = []//捐献信息
		private _camp_hot: number;
		private bool = true;
		private _bool = true;
		private _OtherPlay_Info = [];
		private my_rank: number;
		private Campview_list = {
			0: "CampDonateView",
			1: "CampInfoView",
			2: "CampMainInfo",
			3: "CampMemberView",
			4: "CampPlayInfo",
			5: "CampRankView",
			6: "CampView",
			7: "JoinCampTip",
			8: "ReplaceCampView",
			9: "ReplaceTipView",
		}

		constructor() {
			for (let campid in GangConfig) {
				let nId: number = Number(campid);
				this.camp_Id.push(nId);
			}

		}

		private camp_info = [];
		public static get Instance(): CampManager {
			if (this._instance == null) {
				this._instance = new CampManager();
			}
			return this._instance;
		}

		private openlv;
		public Initialize() {
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqAddGuild", this);//请求加入阵营
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildList", this);//请求阵营列表  C_WinDungeons
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildPlayerList", this); //请求阵营成员信息
			RemoteCall.Instance.RegistJXS2CProtocol("C_AddGuildLog", this); //请求阵营日志
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqContribution", this); //捐献
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqObserverInfo", this); //他人信息
			RemoteCall.Instance.RegistJXS2CProtocol("C_ReqGuildInfo", this); //获取本公会信息			
			this.Play_List = {};
			this.OpenCond();
		}

		private OpenCond() {
			this.openlv = OpenGradeConfig[9].Checkpoint;
		}

		public get camp_Info() {
			return this.camp_info;
		}

		public set camp_Info(value) {
			this.camp_info = value;
		}

		public get Bool() {
			return this.bool
		}
		/**获取阵营中的玩家信息 */
		public get Camp_PlayInfO() {
			return this.Play_List;
		}

		/**zhe */
		public Camp_LvMax() {
			let lv = 0;
			for (let key in GangLevelUpConfig) {
				let MaxLv = Number(key);
				if (lv < MaxLv) {
					lv = MaxLv;
				}
				else {
					return lv;
				}
			}
			return lv
		}

		public Camp_sort() {
			for (let key in this.camp_List) {
				let camp = this.camp_List[key];
				this.camp_info.push(camp);
			}
			//return this.camp_info;
		}
		private camplist: Array<number> = [];
		public campList() {
			for (let key in CampManager.Instance.CampList) {
				let Indx = Number(key);
				this.camplist.push(Indx);
			}

		}

		/**当前阵营热度 */
		public get CampHot() {
			return this._camp_hot;
		}

		public get PlayRank() {
			return this.my_rank;
		}
		/**获取阵营日志信息 */
		public get LogList() {
			return this._LogList;
		}

		/**他人信息 */
		public get OntherPlatInfo() {
			return this._OtherPlay_Info;
		}

		/**阵营列表 */
		public get CampList() {
			return this.camp_List;
		}
		public set CampList(list) {
			this.camp_List = list;
		}

		/**获取指定的阵营 */
		public nCamp(ncampid: number) {
			return this.camp_List[ncampid]
		}

		/**阵营id */
		public get CampId() {
			return this.camp_Id;
		}

		/**发送消息给服务器 请求当前阵营信息 */
		public Camp_Info() {
			RemoteCall.Instance.Send("K_ReqGuildInfo");
		}

		/**发送消息给服务器 请求加入阵营 */
		public Camp_Jion(campId: number) {
			RemoteCall.Instance.Send("K_ReqAddGuild", campId);
		}

		/**发送消息给服务器 请求阵营列表 */
		public GetCamp_List() {
			RemoteCall.Instance.Send("K_ReqGuildList");
		}

		/**请求阵营成员列表 */
		public GetCampPlayInfo(campID: number) {
			RemoteCall.Instance.Send("K_ReqGuildPlayerList", campID);
		}

		/**发送消息  获取玩家的捐献次数 */
		public Donate_times(itemId: number) {
			RemoteCall.Instance.Send("K_ReqContribution", itemId);
		}

		/**请求查看他人信息  */
		public n_Play(play_Id) {
			RemoteCall.Instance.Send("K_ReqObserverInfo", play_Id);
		}

		/**接受他人信息 */
		public C_ReqObserverInfo(buf) {
			this._OtherPlay_Info = buf[0];
		}

		/**捐献成功 */
		public C_ReqContribution(buf) {
			let nType = buf[0]
			let campInfo = buf[1]
			let camp_Id = campInfo[1]
			this.camp_List[camp_Id] = campInfo
			this._camp_hot = campInfo[4];
			MasterPlayer.Instance.player.Donatetimes[nType] += 1;
			TipsLogic.Instance.OpenSystemTips("捐献成功！");
			Event.DispatchEvent("changetimes");
		}

		/**阵营日志信息 */
		public C_AddGuildLog(buf) {
			let info = [buf[0], buf[1]];
			this._LogList.push(info);
			Event.DispatchEvent("updatecamplist");
		}

		/**通知客户端 加入阵营成功 */
		public C_ReqAddGuild(buf) {
			let campid = buf[0];
			let campInfo = buf[1]
			let old_Id = MasterPlayer.Instance.player.CampID;
			MasterPlayer.Instance.player.CampID = campid;
			this.camp_List[campid] = campInfo
			if (old_Id != 0) {
				Event.DispatchEvent("ReqchangeCamp");
				this._LogList = [];
				this._camp_hot = 0;
			}
			else {
				Event.DispatchEvent("C_ReqAddCamp");
			}
			BCampManager.Instance.LoadBCamp();
		}

		/**获取玩家成员列表 */
		public C_ReqGuildPlayerList(buf) {
			this.Play_List = {};
			let camp_ID = buf[0];
			let nData = buf[1];
			this.my_rank = buf[2];
			this.Play_List = nData;

		}

		/**设定 关闭一次后 不再打开  再次登陆重置 */
		private bShowFlag = true
		public get BShowFlag(): boolean {
			return this.bShowFlag;
		}
		public set BShowFlag(bool: boolean) {
			this.bShowFlag = bool;
		}


		/**满足条件 弹出阵营面板 */
		public Add_camp() {
			if (UIManager.Instance.IsHave("CampView", ViewUpRoot)) {
				return
			}
			//CacheManager.Instance.setDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp, true)	
			let bool = CacheManager.Instance.getDerailByType(CacheTypeEnum.newGuid, GuidBooleanEnum.camp);
			let customsOrder = MasterPlayer.Instance.player.CunstLevel;
			if (MasterPlayer.Instance.player.CampID == 0) {
				if (customsOrder >= this.openlv) {
					if (!bool) {
						//UIManager.Instance.CreateUI("JoinCampTip", [ViewUpRoot]);
					}
				}
			}
		}

		/** 通知客户端  请求阵营列表 */
		public C_ReqGuildList(buf) {
			this.camp_List = buf[0]
			Event.DispatchEvent("C_ReqGuildList");
		}

		/** 获取当前阵营信息 */
		public C_ReqGuildInfo(buf) {
			let info = buf[0]
			let camp_Id = info[1]
			this.camp_List[camp_Id] = info
			Event.DispatchEvent("chengehot");
		}


		public SortCamp(camp_Info: Array<any>): Array<any> {
			function C_sort(up, down): number {
				let hot_up = up[4]//热度
				let hot_down = down[4]   //id 人数 等级 贡献值 
				if (up[3] == down[3]) {
					if (up[2] == down[2]) {
						if (up[4] == down[4]) {
							return up[1] > down[1] ? -1 : 1
						}
						return up[4] > down[4] ? -1 : 1
					}
					return up[2] > down[2] ? -1 : 1//根据阵营人数排行
				}
				return up[3] > down[3] ? -1 : 1
			}
			camp_Info.sort(C_sort);
			return camp_Info;
		}

		/**红点显示 */
		public ShowRed(D_red: any) {
			if (MasterPlayer.Instance.player.CunstLevel < this.openlv) {
				return false;
			}
			let n_tcfg = GangDonateConfig[1];
			if (!MasterPlayer.Instance.player.Donatetimes[1]) {
				MasterPlayer.Instance.player.Donatetimes[1] = 0;
			}
			let image = ViewUILogic.Instance.CampRed
			let tiems = n_tcfg.num - MasterPlayer.Instance.player.Donatetimes[1];
			let item = n_tcfg.consume;
			let itemId = item[1];
			let play_itemNum = BagManager.Instance.getItemNumber(itemId);
			if (tiems > 0 && play_itemNum > n_tcfg.consume[1]) {
				return D_red.visible = image.visible = true;
			}
			else {
				return D_red.visible = image.visible = false;
			}
		}

		public logInfo(info) {
			let str = "";
			let type = info[0];
			let date = info[1];
			switch (type) {
				case 1:
					str = Format(GetInfoAttr.Instance.GetText(6020), GetHtmlStrByColor("【" + date[1] + "】", "#e6fefe"));
					break;
				case 2:
					str = Format(GetInfoAttr.Instance.GetText(6022), GetHtmlStrByColor("【" + date[1] + "】", "#e6fefe"));
					break;
				case 3:
					let name = date[1]
					let itemType = date[2]
					let cfg = GangDonateConfig[itemType]
					let n_tcfg = cfg.consume;
					let n_heat = cfg.heat;
					let itemName = GetInfoAttr.Instance.GetText(ItemConfig[n_tcfg[1]].dwItemName)
					let itemNumber = n_tcfg[2];
					str = Format(GetInfoAttr.Instance.GetText(6021), GetHtmlStrByColor("【" + name + "】", "#e6fefe"), itemNumber, itemName, n_heat);
					break;
			}
			return str;
		}
	}
}
