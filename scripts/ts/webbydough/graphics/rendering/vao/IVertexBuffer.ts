namespace WDOH {

    export interface IVertexBufer {
        bind() : void;
        unBind() : void;

        getBufferLayout() : BufferLayout;
        setBufferLayout(bufferLayout : BufferLayout) : void;

        cleanUp() : void;
    }
}