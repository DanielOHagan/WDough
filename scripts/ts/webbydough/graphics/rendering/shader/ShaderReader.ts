namespace WDOH {

    /**
     * The purpose of this class is to read shader files, NOT create IShader instances
     */
    export class ShaderReader {

        public static readonly GLSL_FILE_EXTENSION : string = "glsl";
        public static readonly VERTEX_SHADER_TAG : string = "vert";
        public static readonly FRAGMENT_SHADER_TAG : string = "frag";

        //Map of loaded shaders and whether they were or were not loaded successfully
        private static mShaderLoadList : Map<string, boolean> = new Map();

        public static loadShaderFileIntoStorage(filePath : string) : void {
            let splitFilePath : string[] = filePath.split('.');
            let extension : string = splitFilePath[splitFilePath.length - 1];
            if (extension !== ShaderReader.GLSL_FILE_EXTENSION) {
                throw new Error("Shader file type not supported. Extension found: " + extension);
            }

            let usingForwardSlash : boolean = filePath.includes('/');

            let fileName = splitFilePath[0].substring(splitFilePath[0].lastIndexOf(usingForwardSlash ? '/' : '\\') + 1).toLowerCase();
            if (fileName === null) {
                throw new Error("Unable to determine file name from file: " + filePath);
            }

            let request : XMLHttpRequest = new XMLHttpRequest();
            request.open("GET", filePath);
            request.addEventListener("load", this.onShaderFileLoadForStorage.bind(this, fileName, request));
            request.send();
        }

        private static onShaderFileLoadForStorage(fileName : string, request : XMLHttpRequest) : void {
            let fileContent : string | null = null;

            fileContent = request.responseText;
            
            if (fileContent === null) {
                ShaderReader.mShaderLoadList.set(fileName, false);
                throw new Error("File content not readable from file: " + fileName);
            }

            let shaderSrcMap : Map<EShaderType, string> = this.generateShaderSrcMapFromFileContent(fileName, fileContent);
            Renderer2DStorage.mShaderLibrary.create(fileName, shaderSrcMap);
            ShaderReader.mShaderLoadList.set(fileName, true);
        }

        public static generateShaderSrcMapFromFileContent(fileName : string, fileContent : string) : Map<EShaderType, string> {
            let shaderSourceMap : Map<EShaderType, string> = new Map();
            let vertexShaderSrc : string | null = null;
            let fragmentShaderSrc : string | null = null;

            let splitContent : string[] = fileContent.split('#');

            for (let i = 0; i < splitContent.length; i++) {
                if (splitContent[i].startsWith('type')) {
                    let type : string = splitContent[i].substring(4).trim();

                    if (type === ShaderReader.VERTEX_SHADER_TAG) {
                        vertexShaderSrc = "#" + splitContent[i + 1];
                    } else if (type === ShaderReader.FRAGMENT_SHADER_TAG) {
                        fragmentShaderSrc = "#" + splitContent[i + 1];
                    } else {
                        ShaderReader.mShaderLoadList.set(fileName, false);
                        throw new Error("Unknown type: " + type);
                    }
                }
            }

            if (vertexShaderSrc === null) {
                ShaderReader.mShaderLoadList.set(fileName, false);
                throw new Error("Failed to load Vertex shader from file: " + fileName);
            }
            
            if (fragmentShaderSrc === null) {
                ShaderReader.mShaderLoadList.set(fileName, false);
                throw new Error("Failed to load Fragment shader from file: " + fileName);
            }

            shaderSourceMap.set(EShaderType.VERTEX, vertexShaderSrc);
            shaderSourceMap.set(EShaderType.FRAGMENT, fragmentShaderSrc);

            return shaderSourceMap;
        }

        public static getShaderFileNamesByLoadStatus(loadStatus : boolean) : string[] {
            let shaderFileNames : string[] = new Array(ShaderReader.mShaderLoadList.size);
            let index : number = 0;

            for (let fileName of ShaderReader.mShaderLoadList.keys()) {
                if (this.mShaderLoadList.get(fileName) === loadStatus) {
                    shaderFileNames[index] = fileName;
                    index++;
                }
            }

            return shaderFileNames;
        }

        public static cleanUp() : void {
            ShaderReader.mShaderLoadList.clear();
        }
    }
}