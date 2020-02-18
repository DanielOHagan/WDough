namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mShaderLibrary : WDOH.ShaderLibrary;
        private mTextureManager : WDOH.TextureManager;

        private textureVertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "",
            "uniform mat4 uProjectionViewMatrix;",
            "uniform mat4 uTransformationViewMatrix;",
            "",
            "in vec3 aVertPos;",
            "in vec2 aTexCoord;",
            "",
            "out vec2 vTexCoord;",
            "",
            "void main() {",
                "vTexCoord = aTexCoord;",
                "gl_Position = uProjectionViewMatrix * uTransformationViewMatrix * vec4(aVertPos, 1.0);",
            "}"
        ].join("\n");
        private textureFragSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform sampler2D uTexture;",
            "",
            "in vec2 vTexCoord;",
            "",
            "out vec4 fragColour;",
            "",
            "void main() {",
                "fragColour = texture(uTexture, vTexCoord);",
            "}"
        ].join("\n");

        //The position vertices for squareVAO and texturedSquareVAO are the same so these indices can be used for both
        private mSquareIndices : number[] = [
            0, 1, 2,
            2, 3, 0
        ];

        private texturedSquareVertices : number[] = [
            //Set out as (Position) X Y Z, (Tex Coords) U V
            //top left
            -0.5,  0.5, 0.0, 0.0, 0.0,
            //top right
            0.5,  0.5, 0.0, 1.0, 0.0,
            //bottom right
            0.5, -0.5, 0.0, 1.0, 1.0,
            //bottom left
            -0.5, -0.5, 0.0, 0.0, 1.0
        ];

        private texturedSquareVAO : WDOH.IVertexArray | null;
        private mTestTexture : WDOH.ITexture | null;
        private mOtherTestTexture : WDOH.ITexture | null;

        private mOrthoCameraController : WDOH.ICameraController;

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mShaderLibrary = new WDOH.ShaderLibrary();
            this.mTextureManager = new WDOH.TextureManager();
            this.mTestTexture = null;
            this.mOtherTestTexture = null;
            this.texturedSquareVAO = null;
            this.mCanRun = false;
        }

        public init() : void {
            console.log("TG_Logic: init");

            let textureShaderSources : Map<WDOH.EShaderType, string> = new Map();
            textureShaderSources.set(WDOH.EShaderType.VERTEX, this.textureVertexSrc);
            textureShaderSources.set(WDOH.EShaderType.FRAGMENT, this.textureFragSrc);

            let textureShader = this.mShaderLibrary.create("Texture", textureShaderSources);

            if (textureShader !== null) {
                textureShader.createUniform("uTexture");

                textureShader.bind();
                (textureShader as WDOH.ShaderWebGL).setUniformInt("uTexture", 0);
            }

            //Texture
            this.mTestTexture = this.mTextureManager.createTexture("res/TG/images/testTexture.png", WDOH.ETextureBindingPoint.TEX_2D);
            this.mOtherTestTexture = this.mTextureManager.createTexture("res/TG/images/partiallyTransparent.png", WDOH.ETextureBindingPoint.TEX_2D);

            //Textured VAO
            this.texturedSquareVAO = new WDOH.VertexArrayWebGL();
            let texturedSquareVBO : WDOH.IVertexBufer = new WDOH.VertexBufferWebGL(
                this.texturedSquareVertices,
                WDOH.EDataType.FLOAT
            );
            texturedSquareVBO.setBufferLayout(new WDOH.BufferLayout([
                new WDOH.BufferElement("aVertPos", WDOH.EDataType.FLOAT3),
                new WDOH.BufferElement("aTexCoord", WDOH.EDataType.FLOAT2)
            ]));
            this.texturedSquareVAO.addVertexBuffer(texturedSquareVBO);
            let texturedSquareIndexBuffer : WDOH.IIndexBuffer = new WDOH.IndexBufferWebGL(this.mSquareIndices);
            this.texturedSquareVAO.setIndexBuffer(texturedSquareIndexBuffer);

            this.mCanRun = true;
        }

        public canRun() : boolean {
            return this.mCanRun;
        }
        
        public update(deltaTime : number) : void {

            if (Math.random() * 10 <= 0.5) {
                //NOTE:: The Camera is being moved NOT the scene!
                //this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0.03, 0, 0));
                //this.mOrthoCameraController.rotateDegrees(0.5);
            }

            this.mOrthoCameraController.onUpdate(deltaTime);

            mApplication.getRenderer().beginScene(this.mOrthoCameraController.getCamera());

            let textureShader : WDOH.IShader | null = this.mShaderLibrary.get("Texture");

            mApplication.getRenderer().render2D().drawQuad(
                new WDOH.Vector3(0, 0, 0),
                new WDOH.Vector2(1, 1), //Doesn't currently work
                new WDOH.Vector4(0, 1, 0, 1)
            );

            

            /*
            if (textureShader !== null && this.mTestTexture !== null && this.mOtherTestTexture !== null) {
                textureShader.bind();

                this.mTestTexture.bind();
                this.mTestTexture.activate(0);
                
                if (this.texturedSquareVAO !== null) {
                    mApplication.getRenderer().submitShader(
                        textureShader,
                        this.texturedSquareVAO,
                        new WDOH.Matrix4x4()
                    );
                }

                this.mOtherTestTexture.bind();
                this.mOtherTestTexture.activate(0);

                if (this.texturedSquareVAO !== null) {
                    let transformationmatrix : WDOH.Matrix4x4 = new WDOH.Matrix4x4();

                    transformationmatrix.translateVec2(new WDOH.Vector2(0, 0.2));

                    // mApplication.getRenderer().submitShader(
                    //     textureShader,
                    //     this.texturedSquareVAO,
                    //     transformationmatrix
                    // );
                }
            }
*/

            mApplication.getRenderer().endScene();
        }

        public onEvent(event : WDOH.AEvent) : void {
            //No app logic related events have been created yet so this method is throws an error
            throw new Error("Method not implemented.");
        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {


            
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_W)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, 0.04, 0));
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_S)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0, -0.04, 0));
            }

            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_D)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(0.04, 0, 0));
            }

            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_A)) {
                this.mOrthoCameraController.translatePosition(new WDOH.Vector3(-0.04, 0, 0));
            }


            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_Q)) {
                this.mOrthoCameraController.rotateDegrees(-5);
            }
            if (WDOH.Input.isKeyPressed(WDOH.EKeyInputCode.KEY_E)) {
                this.mOrthoCameraController.rotateDegrees(5);
            }
        }

        public onMouseEvent(mouseEvent : WDOH.MouseEvent) : void {
            
        }

        public onCanvasResize(aspectRatio : number) : void {
            this.mOrthoCameraController.onCanvasResize(aspectRatio)
        }

        public cleanUp() : void {

        }
    }
}