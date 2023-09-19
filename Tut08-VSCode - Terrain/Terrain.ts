
export class Terrain {

    public initialise(heightMap: any, terrainTex: any) {

        // Get the data from the texture
        let imagedata = this.GetImageData(heightMap);
        let pixelData = imagedata.data;
        let heightData = [];

        for (let i = 0; i < pixelData.length; i += 4) {
            // RGB elements are combined & the alpha value is skipped
            heightData.push((pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 10);
        }
    }

    // Function to Create a Tile that represents the heightmap
    public createVertices(x: number = 2, y: number = 2) {
        let gridSize = 2;
        let spacing = 1;
        let xOffset = -1.0;
        let zOffset = -1.0;
        let vertex = 0;

        let vertices = [];
        for (let i = 0; i < gridSize; ++i) {
            for (let j = 0; j < gridSize; ++j) {
                vertices.push(j * spacing + xOffset);
                vertices.push(i * spacing + zOffset);
                vertices.push(0);
                ++vertex;
            }
        }
        return vertices;
    }

    public createIndices() {

        let gridSize = 2;
        let spacing = 2;
        let index = 0;

        let indices = [];
        for (let i = 0; i < gridSize; ++i) {
            for (let j = 0; j < gridSize; ++j) {
                // First triangle
                indices.push((i * spacing) + j);
                indices.push((i * spacing) + (j + 1));
                indices.push(((i + 1) * spacing) + j + 1);
                indices.push((i * spacing) + j);

                // Second triangle
                indices.push(((i + 1) * spacing) + j);
                indices.push(((i + 1) * spacing) + (j + 1));
                indices.push((i * spacing) + j);

                index += 7;

            }
        }
        return indices;
    }

    // Method to extract the data from the Image
    private GetImageData(image: any) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error("getContext('2d') failed");
        }
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    }
}
