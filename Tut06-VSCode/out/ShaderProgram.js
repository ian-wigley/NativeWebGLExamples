define(["require", "exports"], function (require, exports) {
    "use strict";
    class ShaderProgram {
        constructor(gl) {
            this.gl = gl;
            this.InitShaders();
        }
        InitShaders() {
            var fragmentShader = this.GetShader(this.gl, "shader-fs");
            var vertexShader = this.GetShader(this.gl, "shader-vs");
            this.shaderProgram = this.gl.createProgram();
            this.gl.attachShader(this.shaderProgram, vertexShader);
            this.gl.attachShader(this.shaderProgram, fragmentShader);
            this.gl.linkProgram(this.shaderProgram);
            if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
                alert("Could not initialise shaders");
            }
            this.gl.useProgram(this.shaderProgram);
            // Bind the position attribute
            this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);
            // Bind the colour attribute
            this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
            this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
            this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "pMatrix");
            this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "mVMatrix");
        }
        GetShader(gl, id) {
            var shaderScript = document.getElementById(id);
            if (!shaderScript) {
                return null;
            }
            var str = "";
            var k = shaderScript.firstChild;
            while (k) {
                if (k.nodeType == 3) {
                    str += k.textContent;
                }
                k = k.nextSibling;
            }
            var shader;
            if (shaderScript.type == "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            }
            else if (shaderScript.type == "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            }
            else {
                return null;
            }
            gl.shaderSource(shader, str);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }
        GetShaderProgram() {
            return this.shaderProgram;
        }
    }
    return ShaderProgram;
});
//# sourceMappingURL=ShaderProgram.js.map