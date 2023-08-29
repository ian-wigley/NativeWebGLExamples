import * as mat4 from "./glmatrix/mat4.js"
import * as vec3 from "./glmatrix/vec3.js"

export class Plane {

    private shaderProgram;
    private gl: WebGLRenderingContext;

    private mvMatrix = mat4.create();
    private pMatrix = mat4.create();

    private vertexPositionBuffer;
    private vertexColorBuffer;
    private vertexIndexBuffer;

    private vertices;
    private indices;
    private colors;

    private x: number = 0;
    private y: number = 0;
    private z: number = 0;

    constructor(shaderProgram, gl: WebGLRenderingContext, pMatrix) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.pMatrix = pMatrix;
        this.InitBuffers();
        mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(0, 0, -7.0))
    }

    private InitBuffers() {
        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.vertices = [
            -1.0, -1.0, 0.0,  //v0
             1.0, -1.0, 0.0,  //v1
             1.0,  1.0, 0.0,  //v2
            -1.0,  1.0, 0.0   //v3
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 4;

        this.vertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.colors = [
            1.0, 1.0, 1.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = 4;
        this.vertexColorBuffer.numItems = 4;

        this.vertexIndexBuffer = this.gl.createBuffer();
        this.indices = [0, 1, 2, 0, 2, 3];
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public Update(x: number, y: number, z: number) {
        this.x = 0;
        this.y = 0;
        this.z = z;
    }

    public Draw() {
        mat4.translate(this.mvMatrix, this.mvMatrix, [this.x, this.y, this.z]);
        mat4.rotate(this.mvMatrix, this.mvMatrix, 0.01, vec3.fromValues(1, 0, 0));


        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT,
            false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, this.gl.FLOAT,
            false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

        this.SetMatrixUniforms();

        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    }

    private SetMatrixUniforms() {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }
}
