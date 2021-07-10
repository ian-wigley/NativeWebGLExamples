define(["require", "exports", "./Plane", "./Cube", "./ShaderProgram"], function (require, exports, Plane, Cube, ShaderProgram) {
    "use strict";
    class App {
        constructor() {
            this.zNear = 0.1;
            this.zFar = 100.0;
            this.aspect = 0;
            // In radians
            this.fieldOfView = 45 * Math.PI / 180;
            this.pMatrix = mat4.create();
        }
        Initialise() {
            var canvas = document.getElementById("CanvasGL");
            this.InitGL(canvas);
            this.sp = new ShaderProgram(this.gl);
            this.shaderProgram = this.sp.GetShaderProgram();
            this.SetUpCamera();
            this.plane = new Plane(this.shaderProgram, this.gl, this.pMatrix);
            this.cube = new Cube(this.shaderProgram, this.gl, this.pMatrix);
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.gl.enable(this.gl.DEPTH_TEST);
        }
        Run() {
            setInterval(() => this.DrawScene(), 10);
        }
        SetUpCamera() {
            this.aspect = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
            mat4.perspective(this.pMatrix, this.fieldOfView, this.aspect, this.zNear, this.zFar);
        }
        InitGL(canvas) {
            var names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];
            for (const name of names) {
                try {
                    this.gl = canvas.getContext(name);
                }
                catch (e) { }
                if (this.gl) {
                    break;
                }
            }
            if (this.gl == null) {
                alert("Could not initialise WebGL");
                return null;
            }
        }
        DrawScene() {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.plane.Draw();
            this.cube.Draw();
        }
    }
    return App;
});
//# sourceMappingURL=app.js.map