namespace WDOH {

    export class MouseEvent extends AEvent {

        private mPosX : number;
        private mPosY : number;

        public constructor(eventType : EEventType, posX : number, posY : number) {
            super(eventType, EEventCatagory.INPUT_MOUSE);

            this.mPosX = posX;
            this.mPosY = posY;
        }

        public getPosX() : number {
            return this.mPosX;
        }

        public getPosY() : number {
            return this.mPosY;
        }
    }

    export class MouseMoveEvent extends MouseEvent {
        public constructor(posX : number, posY : number) {
            super(EEventType.INPUT_MOUSE_MOVE, posX, posY);
        }
    }
}