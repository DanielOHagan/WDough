namespace WDOH {

    export class Quad extends AGeometry {
        
        public mColour : Vector4;
        public mRotation : number;
        public mTexture : ITexture | null;
        public mTextureCoordsU : number[];
        public mTextureCoordsV : number[];

        public constructor(
            pos : Vector3,
            size : Vector2,
            colour : Vector4,
            texture : ITexture | null
        ) {
            super(pos, size);
            this.mPosition = pos;
            this.mSize = size;
            this.mColour = colour;
            this.mTexture = texture;
            this.mRotation = 0;
            this.mTextureCoordsU = [0, 1, 1, 0];
            this.mTextureCoordsV = [0, 0, 1, 1];
        }

        public isVec2Inside(vec2 : Vector2) : boolean {
            //TODO:: Shorten this to one return line
            let leftBound = this.mPosition.x;
            let rightBound = this.mPosition.x + this.mSize.x;
            let topBound = this.mPosition.y + this.mSize.y;
            let bottomBound = this.mPosition.y;

            if (vec2.x > rightBound || vec2.x < leftBound) return false;

            if (vec2.y < bottomBound || vec2.y > topBound) return false;

            return true;
        }
    }
}