namespace WDOH {

    export class VertexArrayWebGL implements IVertexArray {

        private mVertexBufferIndex : number;
        private mVertexBuffers : IVertexBuffer[];
        private mIndexBuffer : IIndexBuffer | null;
        private mVertexArray : WebGLVertexArrayObject | null;

        public constructor() {
            this.mVertexArray = mContext.createVertexArray();

            if (this.mVertexArray === null) {
                throw new Error("Failed to create Vertex Array");
            }

            this.mVertexBufferIndex = 0;
            this.mVertexBuffers = [];
            this.mIndexBuffer = null;
        }

        public bind() : void {
            mContext.bindVertexArray(this.mVertexArray);
        }
        
        public unBind() : void {
            for ( ; this.mVertexBufferIndex > 0; this.mVertexBufferIndex--) {
                mContext.disableVertexAttribArray(this.mVertexBufferIndex);
            }
            mContext.bindVertexArray(null);
        }

        public addVertexBuffer(vertexBuffer : IVertexBuffer) : void {
            mContext.bindVertexArray(this.mVertexArray);
            vertexBuffer.bind();            

            let layout : BufferLayout = vertexBuffer.getBufferLayout();
            for (let element of layout.getBufferElements()) {
                mContext.enableVertexAttribArray(this.mVertexBufferIndex);
                mContext.vertexAttribPointer(
                    this.mVertexBufferIndex,
                    DataType.getComponentCount(element.dataType),
                    this.dataTypeToGLBaseType(element.dataType),
                    element.normalised,
                    layout.getStride(),
                    element.offset
                );

                this.mVertexBufferIndex++;
            }

            this.mVertexBuffers.push(vertexBuffer);
        }

        public setIndexBuffer(indexBuffer : IIndexBuffer) : void {
            mContext.bindVertexArray(this.mVertexArray);
            indexBuffer.bind();

            this.mIndexBuffer = indexBuffer;
        }

        public getVertexBuffers() : IVertexBuffer[] {
            return this.mVertexBuffers;
        }

        public getIndexBuffer() : IIndexBuffer {
            if (this.mIndexBuffer === null) {
                throw new Error("Index Buffer not set.");
            }
            
            return this.mIndexBuffer;
        }

        public cleanUp() : void {
            mContext.deleteVertexArray(this.mVertexArray);
        }

        private dataTypeToGLBaseType(dataType : EDataType) : number {
            switch (dataType) {
                case EDataType.FLOAT:
                case EDataType.FLOAT2:
                case EDataType.FLOAT3:
                case EDataType.FLOAT4:
                    return mContext.FLOAT;

                case EDataType.MAT3:
                case EDataType.MAT4:
                    return mContext.FLOAT;

                case EDataType.INT:
                case EDataType.INT2:
                case EDataType.INT3:
                case EDataType.INT4:
                    return mContext.INT;

                case EDataType.BOOL:
                    return mContext.BOOL;
        
                default:
                    throw new Error("Unknown EDataType!");
                    return mContext.NONE;
            }
        }
    }
}