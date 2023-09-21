import { Camera } from "./Camera.js"
import { Plane } from "./Plane.js";
import { ShaderProgram } from "./ShaderProgram.js";
import { Terrain } from "./Terrain.js";

export class App {

    private gl: WebGLRenderingContext;
    private shaderProgram: object;
    private sp: ShaderProgram;

    private camera: Camera;
    private plane: Plane;
    private terrain: Terrain;

    public initialise(): void {
        let canvas = <HTMLCanvasElement>document.getElementById("CanvasGL");
        canvas.width = 800;
        canvas.height = 800;

        this.initGL(canvas)
        this.sp = new ShaderProgram(this.gl);
        this.shaderProgram = this.sp.getShaderProgram();

        this.camera = new Camera(this.gl);
        let pMatrix = this.camera.initialise();

        this.terrain = new Terrain();
        let vertices = this.terrain.createVertices();
        let indices = this.terrain.createIndices();

        this.plane = new Plane(this.shaderProgram, this.gl, pMatrix);
        this.plane.init(vertices, indices);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    public run(): void {
        this.addHitListener(document.getElementById("CanvasGL"));
        setInterval(() => this.update(), 10);
    }

    private addHitListener(element: HTMLElement): void {
        window.addEventListener("keydown", (event) => {
            this.onKeyPress(event);
            return null;
        });
    }

    private onKeyPress(event: KeyboardEvent): void {
        event.preventDefault();
        this.onKeyboardPress(event);
    }

    private onKeyboardPress(event: KeyboardEvent): void {
        switch (event.code) {
            case "ArrowLeft":
                this.camera.moveLeft(0.1);
                break;
            case "ArrowUp":
                this.camera.moveForward(0.1);
                break;
            case "ArrowRight":
                this.camera.moveLeft(-0.1);
                break;
            case "ArrowDown":
                this.camera.moveForward(-0.1);
                break;
        }
    }

    private initGL(canvas: HTMLElement): void {
        let names = ["webgl", "experimental-webgl", "webkit-3d", "mozwebgl"];
        for (const name of names) {
            try {
                this.gl = <WebGLRenderingContext>(canvas as HTMLCanvasElement).getContext(name);
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

    private update(): void {
        this.camera.update();
        this.drawScene();
    }

    private drawScene(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.plane.draw(this.camera.getProjectionMatrix(), this.camera.getViewMatrix());
    }
}
