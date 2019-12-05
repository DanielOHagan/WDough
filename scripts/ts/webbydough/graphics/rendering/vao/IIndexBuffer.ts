namespace wDOH {

    export interface IIndexBuffer {
        bind() : void;
        unBind() : void;

        getCount() : number;

        cleanUp() : void;
    }
}