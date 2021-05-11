namespace WDOH {

    export abstract class AGeometry2D {

        public mPosition : Vector3;
        public mSize : Vector2;
        public mRotation : number;

        protected constructor(pos : Vector3, size : Vector2, rotation : number) {
            this.mPosition = pos;
            this.mSize = size;
            this.mRotation = rotation;
        }
    }
}
