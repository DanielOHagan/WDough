namespace WDOH {

    export interface IVertexArray {
        bind() : void;
        unBind() : void;

        addVertexBuffer(vertexBuffer : IVertexBuffer) : void;
        setIndexBuffer(indexBuffer : IIndexBuffer) : void;

        getVertexBuffers() : IVertexBuffer[];
        getIndexBuffer() : IIndexBuffer;

        cleanUp() : void;
    }
}