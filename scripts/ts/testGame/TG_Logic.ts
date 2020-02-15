namespace TestGame {

    export class TG_Logic implements WDOH.IApplicationLogic {

        private mCanRun : boolean;

        private mShaderLibrary : WDOH.ShaderLibrary;
        private mTextureManager : WDOH.TextureManager;

        private vertexSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform mat4 uProjectionViewMatrix;",
            "uniform mat4 uTransformationViewMatrix;",
            "",
            "in vec3 aVertPos;",
            "",
            "void main() {",
                "gl_Position = uProjectionViewMatrix * uTransformationViewMatrix * vec4(aVertPos, 1.0);",
            "}"
        ].join("\n");
        private fragmentSrc = [
            "#version 300 es",
            "",
            "precision mediump float;",
            "",
            "uniform vec4 uColour;",
            "",
            "out vec4 fragColour;",
            "",
            "void main() {",
                "fragColour = uColour;",
            "}"
        ].join("\n");

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

        private mSquareVertices : number[] = [
            //Set out as (Position) X Y Z
            //top left
            -0.5,  0.5, 0.0,
            //top right
            0.5,  0.5, 0.0, 
            //bottom right
            0.5, -0.5, 0.0, 
            //bottom left
            -0.5, -0.5, 0.0,
        ];

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

        private mFlatColour : WDOH.Vector4;

        private texturedSquareVAO : WDOH.IVertexArray | null;
        private mTestTexture : WDOH.ITexture | null;
        private mOtherTestTexture : WDOH.ITexture | null;

        private mSquareVAO : WDOH.IVertexArray | null;

        private mOrthoCameraController : WDOH.ICameraController;

        public constructor(aspectRatio : number) {
            this.mOrthoCameraController = new TG_OrthoCameraController(aspectRatio);
            this.mSquareVAO = null;
            this.mShaderLibrary = new WDOH.ShaderLibrary();
            this.mTextureManager = new WDOH.TextureManager();
            this.mFlatColour = new WDOH.Vector4(0, 1, 0, 1);
            this.mTestTexture = null;
            this.mOtherTestTexture = null;
            this.texturedSquareVAO = null;
            this.mCanRun = false;
        }

        public init() : void {
            console.log("TG_Logic: init");

            //Shader initialisation and compilation
            let flatColourShaderSources : Map<WDOH.EShaderType, string> = new Map();
            flatColourShaderSources.set(WDOH.EShaderType.VERTEX, this.vertexSrc);
            flatColourShaderSources.set(WDOH.EShaderType.FRAGMENT, this.fragmentSrc);

            let textureShaderSources : Map<WDOH.EShaderType, string> = new Map();
            textureShaderSources.set(WDOH.EShaderType.VERTEX, this.textureVertexSrc);
            textureShaderSources.set(WDOH.EShaderType.FRAGMENT, this.textureFragSrc);

            let flatColourShader = this.mShaderLibrary.create("FlatColour", flatColourShaderSources);
            let textureShader = this.mShaderLibrary.create("Texture", textureShaderSources);

            if (flatColourShader !== null) {
                flatColourShader.createUniform("uColour");
            }

            if (textureShader !== null) {
                textureShader.createUniform("uTexture");

                textureShader.bind();
                (textureShader as WDOH.ShaderWebGL).setUniformInt("uTexture", 0);
            }

            //Texture
            this.mTestTexture = this.mTextureManager.createTexture("res/TG/images/testTexture.png", WDOH.ETextureBindingPoint.TEX_2D);
            this.mOtherTestTexture = this.mTextureManager.createTexture("res/TG/images/partiallyTransparent.png", WDOH.ETextureBindingPoint.TEX_2D);

            //mSquareVAO
            this.mSquareVAO = new WDOH.VertexArrayWebGL();
            let squareVBO : WDOH.IVertexBufer = new WDOH.VertexBufferWebGL(
                this.mSquareVertices,
                WDOH.EDataType.FLOAT
            );
            squareVBO.setBufferLayout(new WDOH.BufferLayout([
                new WDOH.BufferElement("aVertPos", WDOH.EDataType.FLOAT3)
            ]))
            this.mSquareVAO.addVertexBuffer(squareVBO);

            let squareIB : WDOH.IIndexBuffer = new WDOH.IndexBufferWebGL(this.mSquareIndices);
            this.mSquareVAO.setIndexBuffer(squareIB);

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
            let flatColourShader : WDOH.IShader | null = this.mShaderLibrary.get("FlatColour");
            
            if (flatColourShader !== null) {
                flatColourShader.bind();
                (flatColourShader as WDOH.ShaderWebGL).setUniformFloat4("uColour", this.mFlatColour);

                if (this.mSquareVAO !== null) {

                    for (let x = 0; x < 20; x++) {
                        for (let y = 0; y < 20; y++) {
                            let transformationMatrix : WDOH.Matrix4x4 = new WDOH.Matrix4x4();
                            let pos : WDOH.Vector3 = new WDOH.Vector3(x * 0.03, y * 0.03, 0.0);

                            //offset down and left
                            pos.x += 1.45;
                            pos.y += 0.4;

                            if (Math.random() < 0.8) {
                                (flatColourShader as WDOH.ShaderWebGL).setUniformFloat4("uColour", this.mFlatColour);
                            } else {
                                (flatColourShader as WDOH.ShaderWebGL).setUniformFloat4("uColour", new WDOH.Vector4(1, 1, 0, 1));
                            }

                            if (Math.random() < 0.02) {
                                transformationMatrix.rotateRads(WDOH.MathsWDOH.degToRad(45), new WDOH.Vector3(0, 0, 1));
                            }

                            transformationMatrix.scaleNum(0.025);
                            transformationMatrix.translateVec3(pos);

                            mApplication.getRenderer().submitShader(flatColourShader, this.mSquareVAO, transformationMatrix);
                        }
                    }
                }
            }

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

                    mApplication.getRenderer().submitShader(
                        textureShader,
                        this.texturedSquareVAO,
                        transformationmatrix
                    );
                }
            }


            mApplication.getRenderer().endScene();
        }

        public onEvent(event : WDOH.AEvent) : void {
            //No app logic related events have been created yet so this method is throws an error
            throw new Error("Method not implemented.");
        }

        public onKeyEvent(keyEvent : WDOH.KeyEvent) : void {


            //Polling examples
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