namespace wDOH {

    export class VertexBufferWebGL implements IVertexBufer {
        
        private mBufferLayout : BufferLayout | null;
        private mBuffer : WebGLBuffer | null;

        public constructor(vertices : number[], size : number) {
            this.mBuffer = mContext.createBuffer();
            this.mBufferLayout = null;

            if (this.mBuffer === null) {
                throw new Error("Unable to create Vertex Buffer");
            }

            mContext.bindBuffer(mContext.ARRAY_BUFFER, this.mBuffer);
            mContext.bufferData(mContext.ARRAY_BUFFER, new Float32Array(vertices), mContext.STATIC_DRAW);
        }

        public bind() : void {
            mContext.bindBuffer(mContext.ARRAY_BUFFER, this.mBuffer);
        }

        public unBind() : void {
            mContext.bindBuffer(mContext.ARRAY_BUFFER, null);
        }

        public getBufferLayout() : BufferLayout {
            if (this.mBufferLayout === null) {
                throw new Error("Buffer Layout has not been set.");
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