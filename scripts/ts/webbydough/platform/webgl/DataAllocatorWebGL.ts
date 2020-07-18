namespace WDOH {

    export class DataAllocatorWebGL {

        public static createBufferSourceFromData(data : number[], dataType : EDataType) : BufferSource {
            switch (dataType) {
                case EDataType.FLOAT:
                case EDataType.FLOAT2:
                case EDataType.FLOAT3:
                case EDataType.FLOAT4:
                    return new Float32Array(data);
                
                case EDataType.BYTE:
                    return new ArrayBuffer(data.length);
                
                case EDataType.INT:
                case EDataType.INT2:
                case EDataType.INT3:
                case EDataType.INT4:
                    return new Int32Array(data);

                default:
                    throw new Error(`Unknown EDataType: ${dataType}`);
            }
        }

        public static createEmptyBufferSource(size : number, dataType : EDataType) : BufferSource {
            switch (dataType) {
                case EDataType.FLOAT:
                case EDataType.FLOAT2:
                case EDataType.FLOAT3:
                case EDataType.FLOAT4:
                    return new Float32Array(size);
                
                //case EDataType.U_FLOAT
                
                case EDataType.INT:
                case EDataType.INT2:
                case EDataType.INT3:
                case EDataType.INT4:
                    return new Int32Array(size);
                
                //case EDataType.U_INT

                default:
                    throw new Error(`Unknown EDataType: ${dataType}`);
            }
        }
    }
}