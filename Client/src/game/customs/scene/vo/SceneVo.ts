module H52D_Framework {
    /**
     * 怪物数据模型
     * @author zhangyusong
     */
    export class SceneVo {

        /** 场景编号 */
        public sceneId:number;
        /** 场景名称 */
        public sceneName:string;
        /** 场景切换图 */
        public strSceneChange:string;
        /** 地图文件名 */
        public strSceneFileName:string;
        /** 场景音乐 */
        public strSceneBacSound:number;

        public constructor(sceneId:number)
        {
            this.sceneId = sceneId;
            let data:Object = SceneConfig[sceneId][1];
            this.sceneName = GetInfoAttr.Instance.GetText(data["SceneName"]);
            this.strSceneChange = data["strSceneChange"];
            this.strSceneFileName = data["strSceneFileName"];
            this.strSceneBacSound = data["strSceneBacSound"];
        }
    }

}