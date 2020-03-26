module H52D_Framework {
    /** 背景逻辑累 */
    export class BackgroundManager {

        private static _inst: BackgroundManager;
        public static get Instance()
        {
            if (BackgroundManager._inst == null)
            {
                BackgroundManager._inst = new BackgroundManager();
            }
            return BackgroundManager._inst;
        }

        public Initialize(): void
        {
            
        }
        
        /** 更换背景图 */
        public changePictrue():void
        {
            
        }
    }
}