namespace WDOH {

    export class VertexBufferWebGL implements IVertexBufer {
        
        private mBufferLayout : BufferLayout | null;
        private mBuffer : WebGLBuffer | null;

        public constructor(vertices : number[], dataType : EDataType) {
            this.mBuffer = mContext.createBuffer();
            this.mBufferLayout = null;

            if (this.mBuffer === null) {
                throw new Error("Unable to create Vertex Buffer");
            }

            let data : BufferSource = this.dataToBufferSource(vertices, dataType);

            mContext.bindBuffer(mContext.ARRAY_BUFFER, this.mBuffer);
            mContext.bufferData(mContext.ARRAY_BUFFER, data, mContext.STATIC_DRAW);
        }

        public bind() : void {
            if (this.mBufferLayout === null) {
                throw new Error("Buffer Layout not set!");
            }

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

        private dataToBufferSource(data : number[], dataType : EDataType) : BufferSource {
            switch (dataType) {
                case EDataType.FLOAT:
                case EDataType.FLOAT2:
                case EDataType.FLOAT3:
                case EDataType.FLOAT4:
                    return new Float32Array(data);
                    break;
                
                //case EDataType.U_FLOAT
                
                case EDataType.INT:
                case EDataType.INT2:
                case EDataType.INT3:
                case EDataType.INT4:
                    return new Int32Array(data);
                    break;
                
                //case EDataType.U_INT

                default:
                    throw new Error(`Unknown EDataType: ${dataType}`);
                    break;
            }
        }
    }
}