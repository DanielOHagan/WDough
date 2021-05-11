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

    export class MouseButtonDownEvent extends MouseEvent {

        private mInputCode : EMouseInputCode;

        public constructor(posX : number, posY : number, inputCode : EMouseInputCode) {
            super(EEventType.INPUT_MOUSE_BUTTON_DOWN, posX, posY);

            this.mInputCode = inputCode;
        }

        public getInputCode() : EMouseInputCode {
            return this.mInputCode;
        }
    }

    export class MouseButtonUpEvent extends MouseEvent {

        private mInputCode : EMouseInputCode;

        public constructor(posX : number, posY : number, inputCode : EMouseInputCode) {
            super(EEventType.INPUT_MOUSE_BUTTON_UP, posX, posY);

            this.mInputCode = inputCode;
        }

        public getInputCode() : EMouseInputCode {
            return this.mInputCode;
        }
    }

    export class MouseScrollEvent extends MouseEvent {

        private mScrollAmount : number;

        public constructor(posX : number, posY : number, scrollAmount : number) {
            super(EEventType.INPUT_MOUSE_SCROLL, posX, posY);
            this.mScrollAmount = scrollAmount;
        }

        public getScrollAmount() : number {
            return this.mScrollAmount;
        }
    }
}
