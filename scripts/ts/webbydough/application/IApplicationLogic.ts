namespace WDOH {

    export interface IApplicationLogic {

        init() : void;

        update(deltaTime : number) : void;

        onEvent(event : IEvent) : void;

    }
}