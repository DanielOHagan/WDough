namespace WDOH {
    
    export class BufferElement {
        public name : string; //Name corresponding to Shader Atrib
        public dataType : EDataType;
        public offset : number;
        public size : number; //Length of buffer element in bytes
        public normalised : boolean;

        public constructor(
            name : string,
            dataType : EDataType,
            offset : number = 0,
            normalised : boolean = false
        ) {
            this.name = name;
            this.dataType = dataType;
            this.offset = offset;
            this.size = DataType.getDataTypeSize(dataType);
            this.normalised = normalised;
        }
    }
}