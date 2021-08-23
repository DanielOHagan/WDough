namespace WDOH {

    export interface IIndexBuffer {
        bind() : void;
        unBind() : void;

        setData(data : number[], offset : number) : void;

        getCount() : number;

        cleanUp() : void;
    }
}
