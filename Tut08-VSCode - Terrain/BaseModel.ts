import * as mat4 from "./glmatrix/mat4.js"

export class BaseModel {

    protected shaderProgram;
    protected gl: WebGLRenderingContext;

    protected modelMatrix = mat4.create();
    protected projectionMatrix = mat4.create();
    protected viewMatrix = mat4.create();

    protected vertexPositionBuffer;
    protected vertexColorBuffer;
    protected vertexIndexBuffer;

    protected vertices;
    protected indices;
    protected colors;

    protected x: number = 0;
    protected y: number = 0;
    protected z: number = 0;


    constructor(shaderProgram: WebGLProgram, gl: WebGLRenderingContext, pMatrix) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.projectionMatrix = pMatrix;
    }

    protected setMatrixUniforms(): void {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.projectionMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.modelMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.viewMatrixUniform, false, this.viewMatrix);
    }

    protected update(x: number, y: number, z: number): void {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}