﻿declare var mat4: any;
declare var vec3: any;

class Cube {

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

    constructor(shaderProgram, gl: WebGLRenderingContext, pMatrix) {
        this.shaderProgram = shaderProgram;
        this.gl = gl;
        this.pMatrix = pMatrix;
        this.InitBuffers();
        mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(-1.0, 0, -7.0))
    }

    private InitBuffers() {
        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.vertices = [
            // Front face
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 24;

        this.vertexColorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
        this.colors = [
            [1.0, 0.0, 0.0, 1.0],     // Front face
            [1.0, 1.0, 0.0, 1.0],     // Back face
            [0.0, 1.0, 0.0, 1.0],     // Top face
            [1.0, 0.5, 0.5, 1.0],     // Bottom face
            [1.0, 0.0, 1.0, 1.0],     // Right face
            [0.0, 0.0, 1.0, 1.0],     // Left face
        ];

        var unpackedColors = [];
        for (var i in this.colors) {
            var color = this.colors[i];
            for (var j = 0; j < 4; j++) {
                unpackedColors = unpackedColors.concat(color);
            }
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(unpackedColors), this.gl.STATIC_DRAW);
        this.vertexColorBuffer.itemSize = 4;
        this.vertexColorBuffer.numItems = 24;


        this.vertexIndexBuffer = this.gl.createBuffer();
        this.indices = [
            0, 1, 2, 0, 2, 3,       // Front face
            4, 5, 6, 4, 6, 7,       // Back face
            8, 9, 10, 8, 10, 11,    // Top face
            12, 13, 14, 12, 14, 15, // Bottom face
            16, 17, 18, 16, 18, 19, // Right face
            20, 21, 22, 20, 22, 23  // Left face
        ];
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public Draw() {
        mat4.rotate(this.mvMatrix, this.mvMatrix, 0.01, vec3.fromValues(0, 1, 0));

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
export = Cube;