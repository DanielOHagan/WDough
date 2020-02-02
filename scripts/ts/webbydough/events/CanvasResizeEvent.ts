namespace WDOH {

    export class CanvasResizeEvent extends AEvent {

        private mWidth : number;
        private mHeight : number;


        public constructor(width : number, height : number) {
            super(EEventType.CANVAS_RESIZE, EEventCatagory.CANVAS);
            this.mWidth = width;
            this.mHeight = height;
        }

        public get width() : number {
            return this.mWidth;
        }

        public get height() : number {
            return this.mHeight;
        }
    }
}