namespace WDOH {

    export class MouseEvent extends AEvent {

        public constructor(eventType : EEventType) {
            super(eventType, EEventCatagory.INPUT_MOUSE);
        }
    }
}