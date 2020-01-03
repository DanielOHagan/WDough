namespace WDOH {

    export interface IIndexBuffer {
        bind() : void;
        unBind() : void;

        getCount() : number;

        cleanUp() : void;
    }
}