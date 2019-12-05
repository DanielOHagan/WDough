namespace wDOH {

    export interface IVertexArray {
        bind() : void;
        unBind() : void;

        addVertexBuffer(vertexBuffer : IVertexBufer) : void;
        setIndexBuffer(indexBuffer : IIndexBuffer) : void;

        getVertexBuffers() : IVertexBufer[];
        getIndexBuffer() : IIndexBuffer;

        cleanUp() : void;
    }
}