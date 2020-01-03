namespace WDOH {

    export interface IShader {

        getName() : string;

        bind() : void;
        unBind() : void;

        compileShaderSources(sources : Map<EShaderType, string>) : void;

        createUniform(uniformName : string) : void;
        createUniforms(uniformNames : string[]) : void;

    }
}