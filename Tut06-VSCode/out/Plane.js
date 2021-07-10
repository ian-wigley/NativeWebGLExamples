define(["require", "exports"], function (require, exports) {
    "use strict";
    class Plane {
        constructor(shaderProgram, gl, pMatrix) {
            this.mvMatrix = mat4.create();
            this.pMatrix = mat4.create();
            this.shaderProgram = shaderProgram;
            this.gl = gl;
            this.pMatrix = pMatrix;
            this.InitBuffers();
            mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(0, 0, -7.0));
        }
        InitBuffers() {
            this.vertexPositionBuffer = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.vertices = [
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0 //v3
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
        Draw() {
            mat4.rotate(this.mvMatrix, this.mvMatrix, 0.01, vec3.fromValues(1, 0, 0));
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexColorBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
            this.SetMatrixUniforms();
            this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        }
        SetMatrixUniforms() {
            this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
            this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
        }
    }
    return Plane;
});
//# sourceMappingURL=Plane.js.map