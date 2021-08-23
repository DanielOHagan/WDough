namespace WDOH {

    export interface IVertexBuffer {
        bind() : void;
        unBind() : void;

        setData(data : number[], offset : number) : void;

        getBufferLayout() : BufferLayout;
        setBufferLayout(bufferLayout : BufferLayout) : void;

        cleanUp() : void;
    }
}
