namespace WDOH {

    export class CanvasResizeEvent implements IEvent {

        private mWidth : number;
        private mHeight : number;

        private mInvoked : boolean;

        public constructor(width : number, height : number) {
            this.mWidth = width;
            this.mHeight = height;
            this.mInvoked = false;
        }

        public getType() : EEventType {
            return EEventType.CANVAS_RESIZE;
        }

        public getCatagory() : EEventCatagory {
            return EEventCatagory.CANVAS;
        }

        public invoke() : void {
            this.mInvoked = true;
        }
        
        public hasBeenInvoked(): boolean {
            return this.mInvoked;
        }

        public get width() : number {
            return this.mWidth;
        }

        public get height() : number {
            return this.mHeight;
        }
    }
}