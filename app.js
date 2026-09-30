let mallData;
let mapShapes = []; 
const MAP_SCALE = 0.75;

function preload() {
    mallData = loadJSON('stores.json');
}

function setup() {
    let canvas = createCanvas(1000 * MAP_SCALE, 420 * MAP_SCALE); 
    canvas.parent(document.querySelector('.stores'));
    
    let storesArray = Object.values(mallData);
    if (!Array.isArray(storesArray) || storesArray.length === 0) return;


  let highlightColors = [
        [240, 195, 60],  // Sunny Yellow (PacSun)
        [150, 50, 140],  // Purple / Magenta (Spencer Gifts)
        [225, 65, 35],   // Orange-Red (Hot Topic)
        [215, 30, 35],   // Red Red (GameStop)
        [35, 115, 65],   // Jungle Green (Rainforest Cafe)
        [235, 120, 165], // Soft Pink (Bath & Body Works)
        [140, 145, 150], // Minimalist Grey (Apple Store)
        [235, 190, 50],  // Warm Yellow (Build-A-Bear)
        [210, 145, 50],  // Pretzel Gold (Auntie Anne's)
        [35, 75, 50],    // Dark Muted Forest Green (Barnes & Noble - Right Anchor)
        [165, 110, 130], // Muted Mauve (Claire's)
        [20, 45, 100]    // Classic Navy Blue (Gap - Left Anchor)
    ];

    let layoutConfig = [
        
        { x: 20, y: 20, w: 140, h: 380, dataIndex: 11 },

        // === TOP ROW STORES ===
        { x: 165, y: 70,  w: 70,  h: 120, dataIndex: -1 }, 
        { x: 240, y: 20,  w: 90,  h: 170, dataIndex: 0 },  
        { x: 335, y: 90,  w: 55,  h: 100, dataIndex: -1 }, 
        { x: 395, y: 40,  w: 85,  h: 150, dataIndex: 1 },  
        { x: 485, y: 80,  w: 65,  h: 110, dataIndex: 2 },  
        { x: 555, y: 20,  w: 110, h: 170, dataIndex: -1 }, 
        { x: 670, y: 60,  w: 80,  h: 130, dataIndex: 3 },  
        { x: 755, y: 35,  w: 80,  h: 155, dataIndex: 4 },  

        // === BOTTOM ROW STORES ===
        { x: 165, y: 230, w: 80,  h: 140, dataIndex: 5 },  
        { x: 250, y: 230, w: 55,  h: 90,  dataIndex: -1 }, 
        { x: 310, y: 230, w: 80,  h: 165, dataIndex: 6 },  
        
        // --- SOUTH ENTRANCE CORRIDOR ---
        { x: 450, y: 230, w: 65,  h: 110, dataIndex: -1 }, 
        { x: 520, y: 230, w: 85,  h: 150, dataIndex: 7 },  
        { x: 610, y: 230, w: 55,  h: 85,  dataIndex: -1 }, 
        { x: 670, y: 230, w: 85,  h: 165, dataIndex: 8 },  
        { x: 760, y: 230, w: 75,  h: 130, dataIndex: 10 }, 

        // === RIGHT ANCHOR: BARNES & NOBLE (Index 9) ===
        { x: 840, y: 20, w: 140, h: 380, dataIndex: 9 }
    ];

    for (let i = 0; i < layoutConfig.length; i++) {
        let config = layoutConfig[i];
        
        if (config.dataIndex !== -1 && storesArray[config.dataIndex]) {
            mapShapes.push({
                x: config.x, y: config.y, w: config.w, h: config.h,
                isInteractive: true,
                highlightColor: highlightColors[config.dataIndex % highlightColors.length],
                data: storesArray[config.dataIndex]
            });
        } else {
            mapShapes.push({
                x: config.x, y: config.y, w: config.w, h: config.h,
                isInteractive: false
            });
        }
    }
}

function draw() {
    background(218, 208, 188);
    push();
    scale(MAP_SCALE); 

    let mX = mouseX / MAP_SCALE;
    let mY = mouseY / MAP_SCALE;

    // Central walking hallway & entrance paths (Muted sandy tan)
    noStroke();
    fill(195, 182, 158); 
    rect(160, 190, 680, 40);
    rect(395, 230, 50, 190);
    rect(140, 200, 20, 20);
    rect(840, 200, 20, 20);

    // Draw each store unit
    for (let i = 0; i < mapShapes.length; i++) {
        let shape = mapShapes[i];

        stroke(58, 83, 17); // Hunter green blueprint outline (#3a5311)
        strokeWeight(1.8);

        if (shape.isInteractive) {
            let isHovering = mX > shape.x && mX < shape.x + shape.w && mY > shape.y && mY < shape.y + shape.h;
            
            if (isHovering) {
            
                fill(shape.highlightColor[0], shape.highlightColor[1], shape.highlightColor[2]); 
            } else {
                fill(250, 246, 236);
            }
        } else {
            fill(232, 223, 200);
        }

        rect(shape.x, shape.y, shape.w, shape.h);
    }

    pop();
}

function mousePressed() {
    let mX = mouseX / MAP_SCALE;
    let mY = mouseY / MAP_SCALE;

    for (let i = 0; i < mapShapes.length; i++) {
        let shape = mapShapes[i];

        if (shape.isInteractive) {
            if (mX > shape.x && mX < shape.x + shape.w && mY > shape.y && mY < shape.y + shape.h) {
                
                let infoDiv = document.querySelector('#store-info');
                
                infoDiv.innerHTML = `
                    <h2>${shape.data.name} (Est. ${shape.data.year})</h2>
                    <div class="info-content">
                        <img src="${shape.data.img_src}" alt="${shape.data.name}">
                        <p>${shape.data.paragraph}</p>
                    </div>
                `;
            }
        }
    }
}