import * as mat4 from "./glmatrix/mat4.js"

export class BaseModel {

    protected shaderProgram;
    protected gl: WebGLRenderingContext;

    protected mvMatrix = mat4.create();
    protected pMatrix = mat4.create();

    protected vertexPositionBuffer;
    protected vertexColorBuffer;
    protected vertexIndexBuffer;

    protected vertices;
    protected indices;
    protected colors;

    constructor(shaderProgram, gl: WebGLRenderingContext, pMatrix) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.pMatrix = pMatrix;
    }

    protected SetMatrixUniforms(): void {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }
}