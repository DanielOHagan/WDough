namespace WDOH {

    export class Renderer {

        private mRendererAPI : IRendererAPI;

        private mProjectionViewMatrix : Matrix4x4;

        public constructor() {
            this.mRendererAPI = new RendererAPIWebGL();
            this.mProjectionViewMatrix = new Matrix4x4();
        }

        public init() : void {
            this.mRendererAPI.init();
        }

        public beginScene(camera : ICamera) : void {
            
            camera.updateProjectionViewMatrix();

            this.mProjectionViewMatrix = camera.getProjectionViewMatrix();
        }

        public endScene() : void {

        }

        public submitShader(
            shader : IShader,
            vertexArray : IVertexArray,
            transformationMatrix : Matrix4x4
        ) : void {
            shader.bind();
            vertexArray.bind();

            shader.createUniforms(["uProjectionViewMatrix", "uTransformationViewMatrix"]);

            (shader as ShaderWebGL).setUniformMat4("uProjectionViewMatrix", this.mProjectionViewMatrix);
            (shader as ShaderWebGL).setUniformMat4("uTransformationViewMatrix", transformationMatrix);

            this.mRendererAPI.drawIndexed(vertexArray.getIndexBuffer().getCount());
        }

        public getRendererAPI() : IRendererAPI {
            return this.mRendererAPI;
        }
    }
}