module H52D_Framework {
	/**
	 * @class 基金管理类
	 * @author zhangyusong 
	 **/
    export class FundLogic {
        private static _instance: FundLogic;
        public static get Instance(): FundLogic {
            if (FundLogic._instance == null) {
                FundLogic._instance = new FundLogic();
            }
            return FundLogic._instance;
        }

        public Initialize(): void {
            this.EventInit();
        }

        private EventInit() {
            RemoteCall.Instance.RegistJXS2CProtocol("C_RecBuyFund", this);
            RemoteCall.Instance.RegistJXS2CProtocol("C_RecGetFundAward", this);
        }

        /** 基金红点 */
        public ShowRedPoint():boolean{
            if( IsShieldRecharge( ) ){
                return false
            }
            let has:boolean = false;
            if(MasterPlayer.Instance.player.IsPermanentVip){
                if(MasterPlayer.Instance.fundBuy){
                    for(let i in FoundationConfig){
                        if(CustomsManager.Instance.CustomsVo &&
                        CustomsManager.Instance.CustomsVo.customsOrder >= FoundationConfig[i]["customsNum"] &&
                        !MasterPlayer.Instance.getFundReceive(Number(i))){
                            has = true;
                            break;
                        }
                    }
                }
            }
            return has;
        }

        /** 购买基金 */
        public ReqBuyFund(bool?:boolean){
            RemoteCall.Instance.Send("K_ReqBuyFund",bool);
        }

        /** 领取基金 */
        public ReqGetFundAward(fundId:number){
            RemoteCall.Instance.Send("K_ReqGetFundAward", fundId);
        }

        /** 购买基金回调 */
        private C_RecBuyFund(buf:any){
            MasterPlayer.Instance.fundBuy = true;
            TipsLogic.Instance.OpenSystemTips("基金购买成功");
            Event.DispatchEvent("ShowControlRedPoint",E_OpenGrade.FUND);
            Event.DispatchEvent("FundFrush");
        }

        /** 领取基金回调 */
        private C_RecGetFundAward(buf:any){
            MasterPlayer.Instance.setFundReceive(buf[0], 1);
            TipsLogic.Instance.OpenGoodsProTips(buf[1])
            Event.DispatchEvent("ShowControlRedPoint",E_OpenGrade.FUND);
            Event.DispatchEvent("FundFrush");
        }
    }
}