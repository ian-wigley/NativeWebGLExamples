declare var mat4: any;
declare var vec3: any;

class AnimatedTexturedPlane {

    private gl: WebGLRenderingContext;

    private zNear: number = 0.1;
    private zFar: number = 100.0;
    private projectionMatrix: any = mat4.create();
    private aspect: number = 0;
    // In radians
    private fieldOfView: number = 45 * Math.PI / 180;

    private shaderProgram;
    private mvMatrix = mat4.create();
    private pMatrix = mat4.create();

    private vertexPositionBuffer;
    private vertexIndexBuffer;
    private cubeVertexTextureCoordBuffer;

    private vertices;
    private indices;
    private textureCoords;
    private animTexture;

    // count = texturewidth / number of frames (1/17 = 0.0588)
    private count: number = 0.0588;
    private startX: number = 0;
    private endX: number = this.count;
    private delay: boolean = false;

    constructor() {
        var canvas = document.getElementById("CanvasGL");
        this.InitGL(canvas);
        this.InitShaders();
        this.InitBuffers();
        this.InitTexture();
        this.SetUpCamera();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        mat4.translate(this.mvMatrix, this.mvMatrix, vec3.fromValues(0, 0, -7.0))
        setInterval(() => this.DrawScene(), 13);
    }

    private SetUpCamera(): void {
        this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        mat4.perspective(this.pMatrix,
            this.fieldOfView,
            this.aspect,
            this.zNear,
            this.zFar);
    }

    private InitGL(canvas) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];
        for (var i = 0; i < names.length; ++i) {
            try {
                this.gl = canvas.getContext(names[i]);
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

    private InitTexture() {
        this.animTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.animTexture);

        // Because images have to be download over the internet
        // they might take a moment until they are ready.
        // Until then put a single pixel in the texture so we can
        // use it immediately. When the image has finished downloading
        // we'll update the texture with the contents of the image.
        const level = 0;
        const internalFormat = this.gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = this.gl.RGBA;
        const srcType = this.gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat,
            width, height, border, srcFormat, srcType,
            pixel);

        this.animTexture.image = new Image();
        var __this = this;
        this.animTexture.image.onload = function () {

            __this.gl.bindTexture(__this.gl.TEXTURE_2D, __this.animTexture);
            __this.gl.texImage2D(__this.gl.TEXTURE_2D, 0, __this.gl.RGBA, __this.gl.RGBA, __this.gl.UNSIGNED_BYTE, __this.animTexture.image);

            // WebGL1 has different requirements for power of 2 images vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (__this.IsPowerOf2(__this.animTexture.image.width) && __this.IsPowerOf2(__this.animTexture.image.height)) {
                // Yes, it's a power of 2. Generate mips.
                __this.gl.generateMipmap(__this.gl.TEXTURE_2D);
            } else {
                // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
                __this.gl.texParameteri(__this.gl.TEXTURE_2D, __this.gl.TEXTURE_WRAP_S, __this.gl.CLAMP_TO_EDGE);
                __this.gl.texParameteri(__this.gl.TEXTURE_2D, __this.gl.TEXTURE_WRAP_T, __this.gl.CLAMP_TO_EDGE);
                __this.gl.texParameteri(__this.gl.TEXTURE_2D, __this.gl.TEXTURE_MIN_FILTER, __this.gl.LINEAR);
            }

            // Enable transparency
            __this.gl.blendFunc(__this.gl.SRC_ALPHA, __this.gl.ONE_MINUS_SRC_ALPHA);
            __this.gl.enable(__this.gl.BLEND);

        }
        this.animTexture.image.src = "Explosion.png";
    }

    private IsPowerOf2(value) {
        return (value & (value - 1)) == 0;
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

        // Bind the texture attribute
        this.shaderProgram.textureCoordAttribute = this.gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

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
            -1.0, -1.0, 0.0,  //v0
             1.0, -1.0, 0.0,  //v1
             1.0,  1.0, 0.0,  //v2
            -1.0,  1.0, 0.0   //v3
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.vertexPositionBuffer.itemSize = 3;
        this.vertexPositionBuffer.numItems = 4;

        this.cubeVertexTextureCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        this.textureCoords = [
            this.startX, 0.0, //uv0
            this.endX,   0.0, //uv1
            this.endX,   1.0, //uv2
            this.startX, 1.0  //uv3
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), this.gl.DYNAMIC_DRAW);
        this.cubeVertexTextureCoordBuffer.itemSize = 2;
        this.cubeVertexTextureCoordBuffer.numItems = 4;

        this.vertexIndexBuffer = this.gl.createBuffer();
        this.indices = [0, 1, 2, 0, 2, 3];
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    private DrawScene() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        this.gl.clearDepth(1.0);                 // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);      // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);       // Near things obscure far things

        // Clear the canvas before we start drawing on it.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        mat4.rotate(this.mvMatrix, this.mvMatrix, 0.01, vec3.fromValues(1, 0, 0));

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, this.gl.FLOAT,
            false, 0, 0);
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        // Tell WebGL how to pull out the texture coordinates from
        // the texture coordinate buffer into the textureCoord attribute.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

        // Tell WebGL we want to affect texture unit 0
        this.gl.activeTexture(this.gl.TEXTURE0);

        // Bind the texture to texture unit 0
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.animTexture);

        // Tell the shader we bound the texture to texture unit 0
        this.gl.uniform1i(this.shaderProgram.samplerUniform, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

        this.SetMatrixUniforms();
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
        this.UpdateTextureBuffer();
    }

    private SetMatrixUniforms() {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }

    private UpdateTextureBuffer() {

        this.delay = !this.delay;
        if (this.delay) {

            // Bind the buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);

            this.startX += this.count;
            this.endX += this.count;
            if (this.endX >= 1) {
                this.startX = 0;
                this.endX = this.count;
            }

            var data = [
                this.startX, 0.0, //uv0
                this.endX,   0.0, //uv1
                this.endX,   1.0, //uv2
                this.startX, 1.0  //uv3
            ];

            // Update the buffer values
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(data));

            // Un-bind the buffer
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        }
    }
}

window.onload = () => {
    var animatedTexturedPlane = new AnimatedTexturedPlane();
}