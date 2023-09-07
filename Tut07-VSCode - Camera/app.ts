import { Camera } from "./Camera.js"
import { Cube } from "./Cube.js";
import { Plane } from "./Plane.js";
import { ShaderProgram } from "./ShaderProgram.js";

export class App {

    private gl: WebGLRenderingContext;
    private shaderProgram: object;
    private sp: ShaderProgram;

    private camera: Camera;
    private cube: Cube;
    private plane: Plane;

    public Initialise(): void {
        let canvas = <HTMLCanvasElement>document.getElementById("CanvasGL");
        canvas.width = 800;
        canvas.height = 800;

        this.InitGL(canvas)
        this.sp = new ShaderProgram(this.gl);
        this.shaderProgram = this.sp.GetShaderProgram();

        this.camera = new Camera(this.gl);
        let pMatrix = this.camera.Initialise();

        this.plane = new Plane(this.shaderProgram, this.gl, pMatrix);
        this.cube = new Cube(this.shaderProgram, this.gl, pMatrix);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    public Run(): void {
        this.AddHitListener(document.getElementById("CanvasGL"));
        setInterval(() => this.Update(), 10);
    }

    private AddHitListener(element: HTMLElement): void {
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
                break;
            case "ArrowUp":
                this.camera.MoveForward(0.1);
                break;
            case "ArrowRight":
                break;
            case "ArrowDown":
                this.camera.MoveForward(-0.1);
                break;
        }
    }

    private InitGL(canvas: HTMLElement): void {
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

    private Update(): void {
        this.camera.Update();
        this.DrawScene();
    }

    private DrawScene(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.plane.Draw(this.camera.get_projection_matrix(), this.camera.get_view_matrix());
        this.cube.Draw(this.camera.get_projection_matrix(), this.camera.get_view_matrix());
    }
}
