var H52D_Framework;
(function (H52D_Framework) {
    /**
     * 怪物数据模型
     * @author zhangyusong
     */
    var SceneVo = /** @class */ (function () {
        function SceneVo(sceneId) {
            this.sceneId = sceneId;
            var data = H52D_Framework.SceneConfig[sceneId][1];
            this.sceneName = H52D_Framework.GetInfoAttr.Instance.GetText(data["SceneName"]);
            this.strSceneChange = data["strSceneChange"];
            this.strSceneFileName = data["strSceneFileName"];
            this.strSceneBacSound = data["strSceneBacSound"];
        }
        return SceneVo;
    }());
    H52D_Framework.SceneVo = SceneVo;
})(H52D_Framework || (H52D_Framework = {}));
//# sourceMappingURL=SceneVo.js.map