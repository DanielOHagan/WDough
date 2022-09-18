namespace WDOH {

    export interface IUINode {

        getUIElement() : any;

        display(display : boolean) : void;
        isDisplayed() : boolean;

    }
}
