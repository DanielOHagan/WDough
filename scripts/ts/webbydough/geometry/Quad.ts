namespace WDOH {

    export class Quad extends AGeometry2D {
        
        public mColour : Vector4;
        public mRotation : number;
        public mTexture : ITexture | null;
        public mTextureCoordsU : number[];
        public mTextureCoordsV : number[];

        public constructor(
            pos : Vector3,
            size : Vector2,
            colour : Vector4,
            rotation : number,
            texture : ITexture | null
        ) {
            super(pos, size);
            this.mPosition = pos;
            this.mSize = size;
            this.mColour = colour;
            this.mRotation = rotation;
            this.mTexture = texture;
            this.mRotation = 0;
            this.mTextureCoordsU = [0, 1, 1, 0];
            this.mTextureCoordsV = [1, 1, 0, 0];
        }

        public isVec2Inside(vec2 : Vector2) : boolean {
            return !(vec2.y < this.mPosition.y) &&
                !(vec2.y > this.mPosition.y + this.mSize.y) &&
                !(vec2.x > this.mPosition.x + this.mSize.x || vec2.x < this.mPosition.x);
        }
    }
}