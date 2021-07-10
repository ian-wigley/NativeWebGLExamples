declare var mat4: any;
declare var vec3: any;

class Plane {

    private gl: WebGLRenderingContext;

    private zNear: number = 0.1;
    private zFar: number = 100.0;
    private aspect: number = 0;
    // In radians
    private fieldOfView: number = 45 * Math.PI / 180;

    private shaderProgram;
    private mvMatrix = mat4.create();
    private pMatrix = mat4.create();

    private vertexPositionBuffer;
    private vertexIndexBuffer;

    private vertices;
    private indices;

    public Initialise() {
        var canvas = document.getElementById("CanvasGL");
        this.InitGL(canvas)
        this.InitShaders();
        this.InitBuffers();
        this.SetUpCamera();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(0, 0, -7.0))
    }

    public Run() {
        setInterval(() => this.DrawScene(), 13);
    }

    private SetUpCamera(): void {
        this.aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
        mat4.perspective(this.pMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
    }

    private InitGL(canvas) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];
        for (const name of names) {
            try {
                this.gl = canvas.getContext(name);
            } catch (e) { }
            if (this.gl) {
                break;
            }
        }
        if (this.gl == null) {
            alert("Could not initialise WebGL");
            return null;
        }
    }

    private InitShaders() {
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

        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        this.shaderProgram.pMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "pMatrix");
        this.shaderProgram.mvMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "mVMatrix");
    }

    private GetShader(gl, id) {
        var shaderScript = (<HTMLInputElement>document.getElementById(id));
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
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
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

    private InitBuffers() {
        this.vertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.vertices = [
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            0.0, 1.0, 0.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 3;

        this.vertexIndexBuffer = this.gl.createBuffer();
        this.indices = [0, 1, 2];
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    private DrawScene() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT,
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

window.onload = () => {
    var plane = new Plane();
    plane.Initialise();
    plane.Run();
}