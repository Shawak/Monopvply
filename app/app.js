/*

 Helpful links
 https://github.com/underscorediscovery/realtime-multiplayer-in-html5

 game loop
 http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
 https://jsfiddle.net/IceCreamYou/rnqLfz14/9/?utm_source=website&utm_medium=embed&utm_campaign=rnqLfz14

 viewport
 http://stackoverflow.com/questions/16919601/html5-canvas-camera-viewport-how-to-actally-do-it ?

 zooming in/out relative to the mouse position
 http://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate

 */

var resources = {

    count: 0,
    loaded: 0,

    map: {},

    add: function(name, src) {
        var img = new Image();
        img.src = src;
        img.onload = function() { resources.loaded++; };
        resources.count++;
        resources.map[name] = img;
    },

    get: function(name) {
        return resources.map[name];
    }

};

var camera = {

    ratio: 1,
    zoom: 1,
    view: {x: 0, y: 0},

    // original screen size
    origin: {width: 0, height: 0},

    init: function() {

        if(true) {
            // high definition canvas
            var dpr = window.devicePixelRatio || 1;
            var bsr = app.ctx.webkitBackingStorePixelRatio ||
                app.ctx.mozBackingStorePixelRatio ||
                app.ctx.msBackingStorePixelRatio ||
                app.ctx.oBackingStorePixelRatio ||
                app.ctx.backingStorePixelRatio || 1;

            var ratio = dpr / bsr;

            var oldWidth = app.canvas.width;
            var oldHeight = app.canvas.height;
            app.canvas.width = oldWidth * ratio;
            app.canvas.height = oldHeight * ratio;
            app.canvas.style.width = oldWidth + 'px';
            app.canvas.style.height = oldHeight + 'px';

            camera.ratio = ratio;
        }

        camera.origin.width = app.canvas.width;
        camera.origin.height = app.canvas.height;
    },

    transform: function(ctx) {
        app.ctx.scale(camera.ratio, camera.ratio);
        ctx.setTransform(camera.zoom, 0, 0, camera.zoom, -camera.view.x, -camera.view.y);
    },

    screenToWorld: function(point) {
        return {
            x: (point.x + camera.view.x) / camera.zoom,
            y: (point.y + camera.view.y) / camera.zoom
        };
    },

    /*worldToScreen: function (point) {
        return {
            x: point.x / camera.ratio,
            y: point.y / camera.ratio
        };
    }*/

    screenToCanvas: function(vector) {
        return {
            x: vector.x / camera.ratio,
            y: vector.y / camera.ratio
        };
    }

};

var engine = {

    drawText: function(text, pos, font, align, color) {
        app.ctx.font = font || fonts.info;
        app.ctx.textAlign = align || 'start';
        app.ctx.fillStyle = color || 'white';
        app.ctx.fillText(text, pos.x, pos.y);
    },

    drawImage: function(img, pos) {
        app.ctx.drawImage(img, pos.x, pos.y);
    }

};

var fonts = {
    info: '10px sans-serif',
    playerInfo: '20px sans-serif'
};

var align = {
    start: 'start',
    end: 'end',
    left: 'left',
    center: 'center',
    right: 'right'
};

var app = {

    ctx: null,
    mouseIsDown: false,
    cursor: {x: 0, y: 0},
    dragOffset: {x: 0, y: 0},

    fps: 0,
    delta: 0,
    frameID: 0,
    timestep: 1000 / 60,
    lastFpsUpdate: 0,
    lastFrameTimeMs: 0,
    framesThisSecond: 0,

    resources: {},
    resourcesCount: 0,
    resourcesLoaded: 0,

    test: [],

    init: function () {
        app.canvas = $('canvas')[0];
        app.ctx = app.canvas.getContext('2d');
        app.canvas.width = window.innerWidth;
        app.canvas.height = window.innerHeight;

        camera.init();


        app.canvas.oncontextmenu = function(e) {
            e.preventDefault();
        };

        // track events
        app.canvas.onmousedown = function (e) {
            app.mouseIsDown = true;
            app.mouseButton = e.button;
            if(app.mouseButton == 0) {
                app.test.push([]);
                var cursor = camera.screenToWorld({x: e.clientX * camera.ratio, y: e.clientY * camera.ratio});
                app.test[app.test.length - 1].push(cursor);
            } else if(app.mouseButton == 2) {
                app.dragOffset.x = -e.pageX * camera.ratio - camera.view.x;
                app.dragOffset.y = -e.pageY * camera.ratio - camera.view.y;
            }
        };

        app.canvas.onmouseup = function (e) {
            app.mouseIsDown = false;
        };

        app.canvas.onmousemove = function (e) {
            var cursor = camera.screenToWorld({x: e.clientX * camera.ratio, y: e.clientY * camera.ratio});
            app.cursor.x = cursor.x;
            app.cursor.y = cursor.y;

            if (!app.mouseIsDown) {
                return;
            }

            if(app.mouseButton == 0) {
                app.test[app.test.length - 1].push({x: app.cursor.x, y: app.cursor.y});
            } else if(app.mouseButton == 2) {
                camera.view.x = -e.pageX * camera.ratio - app.dragOffset.x;
                camera.view.y = -e.pageY * camera.ratio - app.dragOffset.y;
            }
        };

        app.canvas.onwheel = function (e) {
            e.preventDefault();

            var oldZoom = camera.zoom;

            var wheel = e.deltaY > 0 ? -1 : 1;
            var diff = Math.exp(wheel * 0.1);
            var newZoom = camera.zoom * diff;
            if(newZoom <= 0.01 || newZoom >= 1) {
                return;
            }

            camera.zoom = newZoom;

            // TODO
            // move camera view depending on the current view and the zoom diff
            // to keep the camera centering
            // current method doesn't work perfectly/flawless

            var scale = 1 / oldZoom;
            var mouse = {
                x: e.clientX * camera.ratio - camera.view.x,
                y: e.clientY * camera.ratio - camera.view.y
            };

            camera.view.x -= mouse.x / (scale * diff) - mouse.x / scale;
            camera.view.Y -= mouse.y / (scale * diff) - mouse.y / scale;
        };

        camera.view.x = -300;
        camera.view.y = -20;
        camera.zoom = 0.2;

        app.load();
        app.start();
    },

    load: function () {
        resources.add('enemy', 'https://placeholdit.imgix.net/~text?txtsize=14&txt=Enemy&w=100&h=100');
        resources.add('background', 'monopvply.jpg');
    },

    start: function () {
        app.frameID = requestAnimationFrame(function (timestamp) {
            app.draw(1);
            app.lastFrameTimeMs = timestamp;
            app.lastFpsUpdate = timestamp;
            app.framesThisSecond = 0;
            app.frameID = requestAnimationFrame(app.mainLoop);
        });
    },

    mainLoop: function (timestamp) {
        app.delta += timestamp - app.lastFrameTimeMs;
        app.lastFrameTimeMs = timestamp;

        if (timestamp > app.lastFpsUpdate + 1000) {
            app.fps = app.framesThisSecond;
            app.lastFpsUpdate = timestamp;
            app.framesThisSecond = 0;
        }
        app.framesThisSecond++;

        while (app.delta > app.timestep) {
            app.update(app.timestep);
            app.delta -= app.timestep;
        }

        app.draw(app.delta / app.timestep);

        app.frameID = requestAnimationFrame(app.mainLoop);
    },

    update: function (delta) {

    },

    preRenderCanvas: document.createElement('canvas'),

    draw: function (interp) {
        app.preRenderCanvas.width = app.canvas.width;
        app.preRenderCanvas.height = app.canvas.height;
        app.preRenderCanvas.style.width = app.canvas.style.width + 'px';
        app.preRenderCanvas.style.height = app.canvas.style.height + 'px';
        app.ctx = app.preRenderCanvas.getContext('2d');

        // reset
        app.ctx.fillStyle = 'rgb(29,29,29)';
        app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);

        if (resources.loaded != resources.count) {
            engine.drawText('Loading..', {x: app.canvas.width / 2, y: app.canvas.height / 2});
            return;
        }

        // start of map drawing
        app.ctx.save();
        camera.transform(app.ctx);

        // drawing map

        engine.drawImage(resources.get('background'), {x: 0, y: 0});

        app.ctx.beginPath();
        app.ctx.fillStyle = 'red';
        app.ctx.arc(2925, 2737.5, 10, 0, 2 * Math.PI, false);
        app.ctx.fill();

        if(app.test.length > 0) {
            app.ctx.beginPath();
            app.ctx.strokeStyle = 'orange';
            app.ctx.lineWidth = 5;
            for(var i = 0; i < app.test.length; i++) {
                app.ctx.moveTo(app.test[i][0].x, app.test[i][0].y);
                for(var k = 1; k < app.test[i].length; k++) {
                    app.ctx.lineTo(app.test[i][k].x, app.test[i][k].y);
                }
                app.ctx.stroke();
            }
        }

        // end of map drawing
        app.ctx.restore();

        // game information
        var playerCount = 4;
        var offsetY = (app.canvas.height - playerCount * 110) / 2;
        for(var i = 0; i < playerCount; i++) {
            var pos = {x: app.canvas.width - 100, y: offsetY + 110 * i};
            engine.drawImage(resources.get('enemy'), pos);
            engine.drawText('Enemy', {x: pos.x - 10, y: pos.y + 16}, fonts.playerInfo, align.right);
            engine.drawText('8673 $', {x: pos.x - 10, y: pos.y + 56}, fonts.playerInfo, align.right);
            engine.drawText('5 H', {x: pos.x - 10, y: pos.y + 76}, fonts.playerInfo, align.right);
        }

        // general information
        app.ctx.fillStyle = 'rgb(220, 220, 220)';
        app.ctx.font = fonts.info;
        app.ctx.textAlign = 'start';

        app.ctx.beginPath();
        app.ctx.moveTo(0, 0);
        app.ctx.lineTo(app.canvas.width, 0);
        app.ctx.lineTo(app.canvas.width, app.canvas.height);
        app.ctx.lineTo(0, app.canvas.height);
        app.ctx.lineTo(0, 0);
        app.ctx.stroke();

        var info = [
            'Resources: ' + app.resourcesLoaded + '/' + app.resourcesCount,
            'Canvas: ' + app.canvas.width + 'x' + app.canvas.height,
            'Camera',
            '  Ratio: ' + camera.ratio,
            '  Zoom: ' + camera.zoom,
            '  View: x ' + camera.view.x + ' y ' + Math.round(camera.view.y),
            'Cursor: x ' + Math.round(app.cursor.x) + ' y ' + Math.round(app.cursor.y),
            'FPS: ' + Math.round(app.fps)
        ];

        for(var i = 0; i < info.length; i++) {
            app.ctx.fillText(info[i], 45, (i + 4) * 10)
        }

        for(var i = 1; i < Math.max(app.canvas.width, app.canvas.height) / 100; i++) {
            var offset = i * 100;
            var world = camera.screenToWorld({x: offset, y: offset});
            app.ctx.fillText(offset.toString(), offset != 0 ? offset : 4, 10);
            app.ctx.fillText(offset.toString(), 4, offset);
            app.ctx.fillText(Math.round(world.x).toString(), offset != 0 ? offset : 4, 20);
            app.ctx.fillText(Math.round(world.y).toString(), 4, offset + 10);
        }

        app.ctx = app.canvas.getContext('2d');
        app.ctx.drawImage(app.preRenderCanvas, 0, 0);
    }

};
(function () {
    window.applicationCache.update();
    app.init();
})();