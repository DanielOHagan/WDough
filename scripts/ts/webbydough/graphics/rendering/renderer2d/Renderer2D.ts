namespace WDOH {

    export class Renderer2D {

        public constructor() {

        }
        
        public init() : void {
            Renderer2DStorage.init();
        }

        public drawQuad(pos : Vector3, size : Vector2, colour : Vector4) : void {
            let shader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.FLAT_COLOUR_SHADER);
            
            if (shader === null) {
                throw new Error("Render2d: Shader not available: FlatColourShader");
            }
            shader.bind();

            shader.createUniform("uColour");
            (shader as WDOH.ShaderWebGL).setUniformFloat4("uColour", colour);

            let transformationMatrix : Matrix4x4 = new Matrix4x4();
            transformationMatrix.translateVec3(pos);


            mApplication.getRenderer().submitShader(shader, Renderer2DStorage.mQuadVao, transformationMatrix);
        }
        
        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }
    }
}