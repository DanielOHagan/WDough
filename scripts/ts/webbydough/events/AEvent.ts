namespace WDOH {

    export abstract class AEvent {

        protected readonly mEventType : EEventType;
        protected readonly mEventCategory : EEventCatagory;

        protected mIgnore : boolean;

        protected constructor(eventType : EEventType, eventCategory : EEventCatagory) {
            this.mEventType = eventType;
            this.mEventCategory = eventCategory;
            this.mIgnore = false;
        }

        public getType() : EEventType {
            return this.mEventType;
        }

        public getCatagory() : EEventCatagory {
            return this.mEventCategory;
        }

        public shouldIgnore() : boolean {
            return this.mIgnore;
        }
    }
}
