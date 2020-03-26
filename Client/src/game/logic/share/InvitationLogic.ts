module H52D_Framework {
	/**
	 * @class 邀请管理类
	 * @author zhangyusong 
	 **/
	export class InvitationLogic {
		private static _instance:InvitationLogic;
        public get Instance():InvitationLogic{
            if(InvitationLogic._instance == null){
                InvitationLogic._instance = new InvitationLogic();
            }
            return InvitationLogic._instance;
        }
        constructor(){
        }
    }
}