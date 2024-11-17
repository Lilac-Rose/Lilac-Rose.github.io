// Global variables
let camera2DPosition = { x: 0, y: 0, zoom: 1 };
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let currentFractal = null;

// Fractal function mapping
const fractalFunctions = {
    'Mandelbrot Set': setupMandelbrot,
    'Julia Set': setupJuliaSet,
    'Sierpinski Triangle': setupSierpinskiTriangle,
    'Dragon Curve': setupDragonCurve,
    'Koch Snowflake': setupKochSnowflake,
    'Barnsley Fern': setupBarnsleyFern,
    'Cantor Set': setupCantorSet,
    'Burning Ship': setupBurningShip,
    'Fractal Tree': setupFractalTree,
    'Apollonian Gasket': setupApollonianGasket,
};

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function init() {
    // Add event listeners
    document.addEventListener('wheel', handleMouseWheel);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // Load initial fractal
    loadFractal('Mandelbrot Set');
}

// Event handlers
function handleMouseWheel(event) {
    const container = document.getElementById('fractal-container');
    if (container.contains(event.target)) {
        event.preventDefault();
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        camera2DPosition.zoom *= zoomFactor;
        redrawCurrentFractal();
    }
}

function handleMouseDown(event) {
    const container = document.getElementById('fractal-container');
    if (container.contains(event.target)) {
        isDragging = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }
}

function handleMouseMove(event) {
    if (isDragging) {
        const deltaX = event.clientX - lastMouseX;
        const deltaY = event.clientY - lastMouseY;
        camera2DPosition.x += deltaX / camera2DPosition.zoom;
        camera2DPosition.y += deltaY / camera2DPosition.zoom;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        redrawCurrentFractal();
    }
}

function handleMouseUp() {
    isDragging = false;
}

function redrawCurrentFractal() {
    if (currentFractal) {
        loadFractal(currentFractal);
    }
}

function loadFractal(type) {
    console.log(`Loading fractal: ${type}`);
    currentFractal = type;

    // Clear previous instance
    clearCanvas();

    // Reset camera position for 2D fractals
    camera2DPosition = { x: 0, y: 0, zoom: 1 };

    // Create new p5 instance for the selected fractal
    if (fractalFunctions[type]) {
        try {
            window.p5Instance = new p5(fractalFunctions[type], 'p5-container');
            console.log(`Successfully created p5 instance for ${type}`);
        } catch (error) {
            console.error(`Error creating p5 instance: ${error}`);
        }
    } else {
        console.error(`No fractal function found for: ${type}`);
    }

    // Update active button
    document.querySelectorAll('.button-group button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.trim() === type) {
            btn.classList.add('active');
        }
    });

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('active');
    }
}

function clearCanvas() {
    console.log('Clearing canvas...');
    if (window.p5Instance) {
        console.log('Removing existing p5 instance');
        window.p5Instance.remove();
        window.p5Instance = null;
    }
    const container = document.getElementById('p5-container');
    while (container.firstChild) {
        console.log('Removing child from container');
        container.removeChild(container.firstChild);
    }
    console.log('Canvas cleared');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Fractal Setup Functions
function setupMandelbrot() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(800, 800);
            p.pixelDensity(1);
        };

        p.draw = () => {
            p.loadPixels();
            for (let x = 0; x < p.width; x++) {
                for (let y = 0; y < p.height; y++) {
                    let a = p.map(x - camera2DPosition.x, 0, p.width, -2.5 / camera2DPosition.zoom, 1.5 / camera2DPosition.zoom);
                    let b = p.map(y - camera2DPosition.y, 0, p.height, -2 / camera2DPosition.zoom, 2 / camera2DPosition.zoom);
                    let ca = a, cb = b;
                    let iter = 0;
                    while (iter < 100 && a * a + b * b <= 16) {
                        let aa = a * a - b * b;
                        let bb = 2 * a * b;
                        a = aa + ca;
                        b = bb + cb;
                        iter++;
                    }
                    let bright = iter === 100 ? 0 : p.map(iter, 0, 100, 0, 255);
                    let pix = (x + y * p.width) * 4;
                    p.pixels[pix + 0] = bright;
                    p.pixels[pix + 1] = bright;
                    p.pixels[pix + 2] = bright;
                    p.pixels[pix + 3] = 255;
                }
            }
            p.updatePixels();
        };
    };
}

// Other fractal setup functions follow the same pattern...
function setupJuliaSet() {
    return (p) => {
        let ca = -0.7, cb = 0.27015;
        
        p.setup = () => {
            p.createCanvas(400, 400);
            p.pixelDensity(1);
        };

        p.draw = () => {
            p.loadPixels();
            for (let x = 0; x < p.width; x++) {
                for (let y = 0; y < p.height; y++) {
                    let a = p.map(x - camera2DPosition.x, 0, p.width, -1.5 / camera2DPosition.zoom, 1.5 / camera2DPosition.zoom);
                    let b = p.map(y - camera2DPosition.y, 0, p.height, -1.5 / camera2DPosition.zoom, 1.5 / camera2DPosition.zoom);
                    let iter = 0;
                    while (iter < 100 && a * a + b * b <= 16) {
                        let aa = a * a - b * b;
                        let bb = 2 * a * b;
                        a = aa + ca;
                        b = bb + cb;
                        iter++;
                    }
                    let bright = iter === 100 ? 0 : p.map(iter, 0, 100, 0, 255);
                    let pix = (x + y * p.width) * 4;
                    p.pixels[pix + 0] = bright;
                    p.pixels[pix + 1] = bright;
                    p.pixels[pix + 2] = bright;
                    p.pixels[pix + 3] = 255;
                }
            }
            p.updatePixels();
        };
    };
}

function setupSierpinskiTriangle() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.noStroke();
            p.fill(0);
            
            // Apply camera transformations
            p.push();
            p.translate(camera2DPosition.x, camera2DPosition.y);
            p.scale(camera2DPosition.zoom);
            
            sierpinskiTriangleHelper(p.width / 2, p.height / 2, Math.min(p.width, p.height) / 2, 6);
            p.pop();
        };

        function sierpinskiTriangleHelper(x, y, len, depth) {
            if (depth === 0) {
                p.triangle(x, y - len / 2, x - len / 2, y + len / 2, x + len / 2, y + len / 2);
            } else {
                sierpinskiTriangleHelper(x - len / 4, y - len / 4, len / 2, depth - 1);
                sierpinskiTriangleHelper(x + len / 4, y - len / 4, len / 2, depth - 1);
                sierpinskiTriangleHelper(x, y + len / 4, len / 2, depth - 1);
            }
        }
    };
}

function setupDragonCurve() {
    return (p) => {
        let points = [];
        
        p.setup = () => {
            p.createCanvas(400, 400);
            calculateDragonCurve(15);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.stroke(0);
            p.strokeWeight(2);
            
            p.push();
            p.translate(camera2DPosition.x + p.width/2, camera2DPosition.y + p.height/2);
            p.scale(camera2DPosition.zoom);
            
            p.beginShape();
            for (let point of points) {
                p.vertex(point.x, point.y);
            }
            p.endShape();
            p.pop();
        };

        function calculateDragonCurve(iterations) {
            points = [{x: 0, y: 0}, {x: 1, y: 0}];
            for (let i = 0; i < iterations; i++) {
                const newPoints = [];
                for (let j = 0; j < points.length - 1; j++) {
                    const p1 = points[j];
                    const p2 = points[j + 1];
                    const mx = (p1.x + p2.x) / 2;
                    const my = (p1.y + p2.y) / 2;
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    newPoints.push(p1);
                    newPoints.push({
                        x: mx + dy / 2,
                        y: my - dx / 2
                    });
                }
                newPoints.push(points[points.length - 1]);
                points = newPoints;
            }
            
            // Scale points to fit canvas
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let point of points) {
                minX = Math.min(minX, point.x);
                minY = Math.min(minY, point.y);
                maxX = Math.max(maxX, point.x);
                maxY = Math.max(maxY, point.y);
            }
            const scale = Math.min(p.width, p.height) * 0.8 / Math.max(maxX - minX, maxY - minY);
            for (let point of points) {
                point.x = (point.x - (maxX + minX) / 2) * scale;
                point.y = (point.y - (maxY + minY) / 2) * scale;
            }
        }
    };
}

function setupKochSnowflake() {
    return (p) => {
        let points = [];
        
        p.setup = () => {
            p.createCanvas(400, 400);
            calculateKochSnowflake(5);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.stroke(0);
            p.strokeWeight(1);
            p.noFill();
            
            p.push();
            p.translate(camera2DPosition.x + p.width/2, camera2DPosition.y + p.height/2);
            p.scale(camera2DPosition.zoom);
            
            p.beginShape();
            for (let point of points) {
                p.vertex(point.x, point.y);
            }
            p.endShape(p.CLOSE);
            p.pop();
        };

        function calculateKochSnowflake(iterations) {
            // Start with an equilateral triangle
            const side = Math.min(p.width, p.height) * 0.6;
            const height = side * Math.sqrt(3) / 2;
            points = [
                {x: -side/2, y: height/3},
                {x: side/2, y: height/3},
                {x: 0, y: -height*2/3}
            ];
            
            // Apply Koch algorithm to each side
            for (let i = 0; i < iterations; i++) {
                const newPoints = [];
                for (let j = 0; j < points.length; j++) {
                    const p1 = points[j];
                    const p2 = points[(j + 1) % points.length];
                    
                    const dx = (p2.x - p1.x) / 3;
                    const dy = (p2.y - p1.y) / 3;
                    
                    newPoints.push(p1);
                    newPoints.push({x: p1.x + dx, y: p1.y + dy});
                    
                    const angle = Math.PI / 3;
                    const x = p1.x + dx + dx * Math.cos(angle) - dy * Math.sin(angle);
                    const y = p1.y + dy + dx * Math.sin(angle) + dy * Math.cos(angle);
                    newPoints.push({x, y});
                    
                    newPoints.push({x: p1.x + 2 * dx, y: p1.y + 2 * dy});
                }
                points = newPoints;
            }
        }
    };
}

function setupBarnsleyFern() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.background(255);
            p.stroke(0, 128, 0);
            p.strokeWeight(1);
        };

        p.draw = () => {
            p.translate(p.width/2 + camera2DPosition.x, p.height + camera2DPosition.y);
            p.scale(camera2DPosition.zoom);
            
            for (let i = 0; i < 100; i++) {
                let x = 0, y = 0;
                for (let j = 0; j < 100; j++) {
                    const r = p.random(1);
                    let nextX, nextY;
                    
                    if (r < 0.01) {
                        nextX = 0;
                        nextY = 0.16 * y;
                    } else if (r < 0.86) {
                        nextX = 0.85 * x + 0.04 * y;
                        nextY = -0.04 * x + 0.85 * y + 1.6;
                    } else if (r < 0.93) {
                        nextX = 0.20 * x - 0.26 * y;
                        nextY = 0.23 * x + 0.22 * y + 1.6;
                    } else {
                        nextX = -0.15 * x + 0.28 * y;
                        nextY = 0.26 * x + 0.24 * y + 0.44;
                    }
                    
                    x = nextX;
                    y = nextY;
                    p.point(x * 50, -y * 50);
                }
            }
        };
    };
}

function setupCantorSet() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.stroke(0);
            p.strokeWeight(2);
            
            p.push();
            p.translate(camera2DPosition.x, camera2DPosition.y);
            p.scale(camera2DPosition.zoom);
            
            drawCantorSet(50, 50, p.width - 100, 8);
            p.pop();
        };

        function drawCantorSet(x, y, len, depth) {
            if (depth <= 0) return;
            
            p.line(x, y, x + len, y);
            const newLen = len / 3;
            drawCantorSet(x, y + 20, newLen, depth - 1);
            drawCantorSet(x + 2 * newLen, y + 20, newLen, depth - 1);
        }
    };
}

function setupBurningShip() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.pixelDensity(1);
        };

        p.draw = () => {
            p.loadPixels();
            for (let x = 0; x < p.width; x++) {
                for (let y = 0; y < p.height; y++) {
                    let a = p.map(x - camera2DPosition.x, 0, p.width, -2 / camera2DPosition.zoom, 1 / camera2DPosition.zoom);
                    let b = p.map(y - camera2DPosition.y, 0, p.height, -2 / camera2DPosition.zoom, 1 / camera2DPosition.zoom);
                    let ca = a;
                    let cb = b;
                    let iter = 0;
                    
                    while (iter < 100 && a * a + b * b <= 4) {
                        let aa = Math.abs(a * a - b * b) + ca;
                        let bb = Math.abs(2 * a * b) + cb;
                        a = aa;
                        b = bb;
                        iter++;
                    }
                    
                    let bright = iter === 100 ? 0 : p.map(iter, 0, 100, 0, 255);
                    let pix = (x + y * p.width) * 4;
                    p.pixels[pix + 0] = bright;
                    p.pixels[pix + 1] = bright;
                    p.pixels[pix + 2] = bright;
                    p.pixels[pix + 3] = 255;
                }
            }
            p.updatePixels();
        };
    };
}

function setupFractalTree() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.stroke(0);
            p.strokeWeight(1);
            
            p.push();
            p.translate(camera2DPosition.x + p.width/2, camera2DPosition.y + p.height);
            p.scale(camera2DPosition.zoom);
            drawBranch(100, p.PI/6);
            p.pop();
        };

        function drawBranch(len, angle) {
            if (len < 4) return;
            
            p.line(0, 0, 0, -len);
            p.translate(0, -len);
            
            p.push();
            p.rotate(angle);
            drawBranch(len * 0.67, angle);
            p.pop();
            
            p.push();
            p.rotate(-angle);
            drawBranch(len * 0.67, angle);
            p.pop();
        }
    };
}

function setupApollonianGasket() {
    return (p) => {
        p.setup = () => {
            p.createCanvas(400, 400);
            p.noLoop();
        };

        p.draw = () => {
            p.background(255);
            p.stroke(0);
            p.noFill();
            
            p.push();
            p.translate(camera2DPosition.x + p.width/2, camera2DPosition.y + p.height/2);
            p.scale(camera2DPosition.zoom);
            
            const r1 = 150;
            drawCircle(0, 0, r1);
            drawApollonian(0, 0, r1, 5);
            p.pop();
        };

        function drawApollonian(x, y, r, depth) {
            if (depth <= 0 || r < 1) return;
            
            const r2 = r * 0.4;
            const angle = p.TWO_PI / 3;
            for (let i = 0; i < 3; i++) {
                const nx = x + (r - r2) * p.cos(i * angle);
                const ny = y + (r - r2) * p.sin(i * angle);
                drawCircle(nx, ny, r2);
                drawApollonian(nx, ny, r2, depth - 1);
            }
        }

        function drawCircle(x, y, r) {
            p.ellipse(x, y, r * 2);
        }
    };
}