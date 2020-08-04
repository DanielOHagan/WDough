namespace WDOH {

    export class Renderer implements IRenderer {

        public static readonly DEFAULT_CLEAR_COLOUR : Vector4 = new Vector4(0.264, 0.328, 0.484, 1.0);

        private mRendererAPI : IRendererAPI;
        private mRenderer2d : Renderer2D;

        private mProjectionViewMatrix : Matrix4x4;

        public constructor() {
            this.mRendererAPI = new RendererAPIWebGL();
            this.mRenderer2d = new Renderer2D();
            this.mProjectionViewMatrix = new Matrix4x4();
        }

        public init() : void {
            this.mRendererAPI.init();
            this.mRenderer2d.init();
        }

        public beginScene(camera : ICamera) : void {
            
            camera.updateProjectionViewMatrix();

            this.mProjectionViewMatrix = camera.getProjectionViewMatrix();

            this.mRenderer2d.beginScene(camera);
        }

        public endScene() : void {
            this.mRenderer2d.endScene();
        }

        public flush() : void {
            this.mRenderer2d.flush();
        }

        public submitShader(
            shader : IShader,
            vertexArray : IVertexArray,
            transformationMatrix : Matrix4x4
        ) : void {
            shader.bind();
            vertexArray.bind();

            shader.createUniforms(["uProjectionViewMatrix", "uTransformationMatrix"]);

            shader.setUniformMat4("uProjectionViewMatrix", this.mProjectionViewMatrix);
            shader.setUniformMat4("uTransformationMatrix", transformationMatrix);

            this.mRendererAPI.drawIndexed(vertexArray.getIndexBuffer().getCount());
        }

        public getRendererAPI() : IRendererAPI {
            return this.mRendererAPI;
        }

        //Not named getRenderer2D() for brevity
        public render2D() : Renderer2D {
            return this.mRenderer2d;
        }

        public cleanUp() : void {
            this.mRenderer2d.cleanUp();

            ShaderReader.cleanUp();
        }
    }
}