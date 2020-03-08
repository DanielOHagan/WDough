namespace WDOH {

    export class Renderer2D implements IRenderer {

        public constructor() {

        }
        
        public init() : void {
            Renderer2DStorage.init();
        }

        public beginScene(camera : ICamera) {
            if (Renderer2DStorage.isReady()) {
                let flatColourShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.FLAT_COLOUR_SHADER);
                if (flatColourShader === null) {
                    throw new Error("Renderer2D: Shader not available: " + Renderer2DStorage.FLAT_COLOUR_SHADER);
                }
                flatColourShader.bind();
                flatColourShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());

                let textureShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);
                if (textureShader === null) {
                    throw new Error("Renderer2D: Shader not available: " + Renderer2DStorage.TEXTURE_SHADER);
                }
                textureShader.bind();
                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_PROJ_VIEW_MAT, camera.getProjectionViewMatrix());
            } else {
                Renderer2DStorage.checkShadersLoaded();

                if (Renderer2DStorage.mRequiredShadersLoaded) {
                    Renderer2DStorage.initRequiredShaders();
                }
            }
        }

        public drawColouredQuad(pos : Vector3, size : Vector2, rotationDegrees : number, colour : Vector4) : void {
            if (Renderer2DStorage.isReady()) {
                let flatColourShader : IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.FLAT_COLOUR_SHADER);
                
                if (flatColourShader === null) {
                    throw new Error("Renderer2D: Shader not available: " + Renderer2DStorage.FLAT_COLOUR_SHADER);
                }
                flatColourShader.bind();

                let transformationMatrix : Matrix4x4 = new Matrix4x4();
                transformationMatrix.translateVec3(pos);
                transformationMatrix.rotateRads(WDOH.MathsWDOH.degToRad(rotationDegrees), new Vector3(0, 0, 1));
                transformationMatrix.scaleXYZ(size.x, size.y, 1);

                flatColourShader.setUniformFloat4("uColour", colour);
                flatColourShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT, transformationMatrix);

                Renderer2DStorage.mQuadVao.bind();
                mApplication.getRenderer().getRendererAPI().drawIndexed(Renderer2DStorage.mQuadVao.getIndexBuffer().getCount());
            }
        }

        public drawTexturedQuad(pos : Vector3, size : Vector2, rotationDegrees : number, texture : ITexture) : void {
            if (Renderer2DStorage.isReady()) {
                let textureShader :  IShader | null = Renderer2DStorage.mShaderLibrary.get(Renderer2DStorage.TEXTURE_SHADER);

                if (textureShader === null) {
                    throw new Error("Renderer2D: Shader not available: " + Renderer2DStorage.TEXTURE_SHADER);
                }
                textureShader.bind();
                texture.bind();

                let transformationMatrix : Matrix4x4 = new Matrix4x4();
                transformationMatrix.translateVec3(pos);
                transformationMatrix.rotateRads(WDOH.MathsWDOH.degToRad(rotationDegrees), new Vector3(0, 0, 1));
                transformationMatrix.scaleXYZ(size.x, size.y, 1);

                textureShader.setUniformMat4(Renderer2DStorage.UNIFORM_NAME_TRANSFORMATION_MAT, transformationMatrix);

                Renderer2DStorage.mQuadVao.bind();
                mApplication.getRenderer().getRendererAPI().drawIndexed(Renderer2DStorage.mQuadVao.getIndexBuffer().getCount());
            }
        }
        
        public cleanUp() : void {
            Renderer2DStorage.cleanUp();
        }
    }
}