namespace WDOH {

    export class VertexBufferWebGL implements IVertexBuffer {

        private mBufferLayout : BufferLayout | null;
        private mBuffer : WebGLBuffer | null;

        private constructor() {
            this.mBufferLayout = null;
            this.mBuffer = null;
        }

        public static createStaticBuffer(vertices : number[], dataType : EDataType) : IVertexBuffer {
            let buffer : VertexBufferWebGL = new VertexBufferWebGL();

            buffer.mBuffer = mContext.createBuffer();
            buffer.mBufferLayout = null;

            if (buffer.mBuffer === null) {
                mApplication.throwError("Unable to create Vertex Buffer");
            }

            let data : BufferSource = DataAllocatorWebGL.createBufferSourceFromData(vertices, dataType);

            mContext.bindBuffer(mContext.ARRAY_BUFFER, buffer.mBuffer);
            mContext.bufferData(mContext.ARRAY_BUFFER, data, mContext.STATIC_DRAW);

            return buffer;
        }

        public static createDynamicBuffer(size : number, dataType : EDataType) : IVertexBuffer {
            let buffer : VertexBufferWebGL = new VertexBufferWebGL();

            buffer.mBuffer = mContext.createBuffer();
            buffer.mBufferLayout = null;

            if (buffer.mBuffer === null) {
                mApplication.throwError("Unable to create Vertex Buffer");
            }

            let data : BufferSource = DataAllocatorWebGL.createEmptyBufferSource(size, dataType);

            mContext.bindBuffer(mContext.ARRAY_BUFFER, buffer.mBuffer);
            mContext.bufferData(mContext.ARRAY_BUFFER, data, mContext.DYNAMIC_DRAW);

            return buffer;
        }

        public bind() : void {
            if (this.mBufferLayout === null) {
                _Logger().errWDOH("Buffer Layout not set.");
                throw new Error();
            }

            mContext.bindBuffer(mContext.ARRAY_BUFFER, this.mBuffer);
        }

        public unBind() : void {
            mContext.bindBuffer(mContext.ARRAY_BUFFER, null);
        }

        public setData(data : number[], offset : number) : void {
            if (this.mBuffer !== null) {
                mContext.bindBuffer(mContext.ARRAY_BUFFER, this.mBuffer);
                mContext.bufferSubData(
                    mContext.ARRAY_BUFFER,
                    offset,
                    new Float32Array(data)
                );
            }
        }

        public getBufferLayout() : BufferLayout {
            if (this.mBufferLayout === null) {
                _Logger().errWDOH("Buffer Layout not set.");
                throw new Error();
            }

            return this.mBufferLayout;
        }

        public setBufferLayout(bufferLayout : BufferLayout) : void {
            this.mBufferLayout = bufferLayout;
        }

        public cleanUp() : void {
            mContext.deleteBuffer(this.mBuffer);
        }
    }
}
