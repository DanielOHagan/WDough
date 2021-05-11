namespace WDOH {

    export class Quad extends AGeometry2D {

        public static readonly DEFAULT_TEXTURE_COORDS_U : number[] = [0, 1, 1, 0];
        public static readonly DEFAULT_TEXTURE_COORDS_V : number[] = [1, 1, 0, 0];
        
        public mColour : Vector4;
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
            super(pos, size, rotation);
            this.mPosition = pos;
            this.mSize = size;
            this.mColour = colour;
            this.mTexture = texture;
            this.mTextureCoordsU = Quad.DEFAULT_TEXTURE_COORDS_U;
            this.mTextureCoordsV = Quad.DEFAULT_TEXTURE_COORDS_V;
        }
    }
}