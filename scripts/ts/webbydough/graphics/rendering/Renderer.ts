namespace WDOH {

    export class Renderer {

        public static readonly DEFAULT_CLEAR_COLOUR : Vector4 = new Vector4(1, 0, 1, 1);

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

        //Not named getRenderer2D() for brevity
        public render2D() : Renderer2D {
            return this.mRenderer2d;
        }

        public cleanUp() : void {
            this.mRenderer2d.cleanUp();
        }
    }
}