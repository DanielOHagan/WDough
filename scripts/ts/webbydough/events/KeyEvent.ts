namespace WDOH {

    export class KeyEvent extends AEvent {

        private mInputCode : EKeyInputCode;

        private mModShift : boolean;
        private mModAlt : boolean;
        private mModMeta : boolean;
        private mRepeat : boolean;

        public constructor(keyBoardEvent : KeyboardEvent, eventType : EEventType) {
            super(eventType, EEventCatagory.INPUT_KEY);

            this.mInputCode = Input.get().keyStringAsInputCode(keyBoardEvent.key.toLowerCase());

            if (this.mInputCode === EKeyInputCode.INGORED) {
                this.mIgnore = true;
            } else if (eventType === EEventType.INPUT_KEY_UP) {
                Input.get().setKeyPressedFlag(this.mInputCode, false);
            } else if (eventType === EEventType.INPUT_KEY_DOWN) {
                Input.get().setKeyPressedFlag(this.mInputCode, true);
            }

            this.mModShift = keyBoardEvent.shiftKey;
            this.mModAlt = keyBoardEvent.altKey;
            this.mModMeta = keyBoardEvent.metaKey;
            this.mRepeat = keyBoardEvent.repeat;
        }

        public getInputCode() : EKeyInputCode {
            return this.mInputCode;
        }

        public usingModShift() : boolean {
            return this.mModShift;
        }

        public usingModAlt() : boolean {
            return this.mModAlt;
        }

        public usingModMeta() : boolean {
            return this.mModMeta;
        }

        public isRepeat() : boolean {
            return this.mRepeat;
        }
    }
}