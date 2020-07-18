namespace WDOH {

    export class IndexBufferWebGL implements IIndexBuffer {

        private mCount : number;
        private mIndexBuffer : WebGLBuffer | null;

        public constructor(indices : number[], count? : number) {

            if (count !== undefined) {
                this.mCount = count;
            } else {
                this.mCount = indices.length;
            }

            this.mIndexBuffer = mContext.createBuffer();

            if (this.mIndexBuffer === null) {
                throw new Error("Failed to create Index Buffer");
            }

            mContext.bindBuffer(mContext.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
            mContext.bufferData(mContext.ELEMENT_ARRAY_BUFFER, new Int32Array(indices), mContext.STATIC_DRAW);
        }
        
        public bind() : void {
            mContext.bindBuffer(mContext.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer)
        }
        
        public unBind() : void {
            mContext.bindBuffer(mContext.ELEMENT_ARRAY_BUFFER, null);
        }

        public setData(data : number[], offset : number = 0) : void {
            if (this.mIndexBuffer !== null) {
                mContext.bindBuffer(mContext.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer);
                mContext.bufferSubData(
                    mContext.ELEMENT_ARRAY_BUFFER,
                    offset,
                    new Int32Array(data)
                );
            }
        }

        public getCount() : number {
            return this.mCount;
        }

        public cleanUp() : void {
            mContext.deleteBuffer(this.mIndexBuffer);
        }
    }
}