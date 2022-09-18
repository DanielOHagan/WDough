namespace WDOH {

    export enum EDataType {

        /**
         * This describes the data stored in a Buffer
         * 
         * Float is the data type of the a single component of the data,
         * the corresponding number is the number of components,
         * no number means that it is a single compnent.
         */

        NONE = 0,

        FLOAT,
        FLOAT2,
        FLOAT3,
        FLOAT4,

        INT,
        INT2,
        INT3,
        INT4,

        BYTE,

        MAT3,
        MAT4,

        BOOL
    }

    export class DataType {

        //Prevent initialisation
        private constructor() { }

        /**
         * 
         * @param dataType 
         * @returns 
         * @throws 
         */
        public static getComponentCount(dataType : EDataType) : number {
            switch (dataType) {
                case EDataType.FLOAT: return 1;
                case EDataType.FLOAT2: return 2;
                case EDataType.FLOAT3: return 3;
                case EDataType.FLOAT4: return 4;
                case EDataType.MAT3: return 3 * 3;
                case EDataType.MAT4: return 4 * 4;
                case EDataType.INT: return 1;
                case EDataType.INT2: return 2;
                case EDataType.INT3: return 3;
                case EDataType.INT4: return 4;
                case EDataType.BOOL: return 1;
            }

            mApplication.throwError(`Unrecognised Data Type : ${dataType}`);
            return EDataType.NONE;
        }

        /**
         * 
         * @param dataType 
         * @returns 
         * @throws
         */
        public static getDataTypeSize(dataType : EDataType) : number {
            switch (dataType) {
                case EDataType.FLOAT: return 4;
                case EDataType.FLOAT2: return 4 * 2;
                case EDataType.FLOAT3: return 4 * 3;
                case EDataType.FLOAT4: return 4 * 4;
                case EDataType.MAT3: return 4 * 3 * 3;
                case EDataType.MAT4: return 4 * 4 * 4;
                case EDataType.INT: return 4;
                case EDataType.INT2: return 4 * 2;
                case EDataType.INT3: return 4 * 3;
                case EDataType.INT4: return 4 * 4;
                case EDataType.BOOL: return 1;
            }

            mApplication.throwError(`Unrecognised Data Type : ${dataType}`);
            return EDataType.NONE;
        }
    }
}
