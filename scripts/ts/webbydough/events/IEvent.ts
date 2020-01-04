namespace WDOH {

    export interface IEvent {

        invoke() : void;
        hasBeenInvoked() : boolean;

        getType() : EEventType;
        getCatagory() : EEventCatagory;

    }
}