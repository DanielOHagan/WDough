namespace WDOH {

    export class FocusChangeEvent extends AEvent {

        private mFocused : boolean;

        public constructor(focused : boolean) {
            super(EEventType.APPLICATION_FOCUS_CHANGE, EEventCatagory.APPLICATION);
            this.mFocused = focused;
        }

        public isFocused() : boolean {
            return this.mFocused;
        }
    }
}