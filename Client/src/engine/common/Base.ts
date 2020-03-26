module H52D_Framework {
    export class Base implements IDisposable {
        private _id: number;
        private static __defaultID: number = 1000000;

        constructor() {
            this._id = (Base.__defaultID += 1);
        }

        public Dispose(): void {
            this._id = 0;
        }

        public IsDisposed(): boolean {
            return this._id == 0;
        }
    }
}