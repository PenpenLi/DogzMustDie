module H52D_Framework {
    export class Time {
        private static _diffTime: number = 0;
        //时区差(8小时)
        public static TimeSplus = 0 * 3600 * 1000;
        public static SetServerTime(serverTime: number): void {
            let serverDateTime: Date = new Date(serverTime * 1000);
            Time._diffTime = serverDateTime.getTime() - Date.now() + this.TimeSplus;
        }        
        public static get serverTime(): Date {
            var date:Date = new Date(Date.now() + Time._diffTime);
            return date;
        }

        public static get serverMilliSecodes(): number {
            return Date.now() + Time._diffTime;
        }

        public static get serverSecodes(): number {
            return Math.floor((Date.now() + Time._diffTime) / 1000);
        }

        public static get deltaTime(): number {
            return Laya.timer.delta;
        }

        public static get time(): number {
            return Laya.timer.currTimer;
        }

        public static get timeScale(): number {
            return Laya.timer.scale;
        }

        public static set timeScale(scale: number) {
            Laya.timer.scale = scale;
        }
    }
}