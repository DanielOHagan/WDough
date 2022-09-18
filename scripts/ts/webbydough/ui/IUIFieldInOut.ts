namespace WDOH {

    export interface IUIFieldInOut extends IUINode {

        updateValue(value : string) : void;
        getValue() : string;

    }
}
