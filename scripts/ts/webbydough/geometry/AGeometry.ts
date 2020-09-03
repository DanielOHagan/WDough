namespace WDOH {

    export abstract class AGeometry {

        public mPosition : Vector3;
        public mSize : Vector2;

        protected constructor(pos : Vector3, size : Vector2) {
            this.mPosition = pos;
            this.mSize = size;
        }
    }
}