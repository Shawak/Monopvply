/*

 Helpful links
 https://github.com/underscorediscovery/realtime-multiplayer-in-html5

 game loop
 http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
 https://jsfiddle.net/IceCreamYou/rnqLfz14/9/?utm_source=website&utm_medium=embed&utm_campaign=rnqLfz14

 viewport
 http://stackoverflow.com/questions/16919601/html5-canvas-camera-viewport-how-to-actally-do-it ?


 */

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
            app.ctx.scale(ratio, ratio);
        }

        camera.origin.width = app.canvas.width;
        camera.origin.height = app.canvas.height;
    },

    transform: function(ctx) {
        ctx.setTransform(camera.zoom, 0, 0, camera.zoom,
            -camera.view.x * camera.ratio,
            -camera.view.y * camera.ratio);
    },

    screenToWorld: function(point) {
        return {
            x: (point.x + camera.view.x) / camera.zoom * camera.ratio,
            y: (point.y + camera.view.y) / camera.zoom * camera.ratio
        };
    },

    /*worldToScreen: function (point) {
        return {
            x: point.x / camera.ratio,
            y: point.y / camera.ratio
        };
    }*/

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

    init: function () {
        app.canvas = $('canvas')[0];
        app.ctx = app.canvas.getContext('2d');
        app.canvas.width = window.innerWidth;
        app.canvas.height = window.innerHeight;

        camera.init();


        // track events
        app.canvas.onmousedown = function (e) {
            app.mouseIsDown = true;
            app.dragOffset.x = -e.pageX - camera.view.x;
            app.dragOffset.y = -e.pageY - camera.view.y;
        };

        app.canvas.onmouseup = function (e) {
            app.mouseIsDown = false;
        };

        app.canvas.onmousemove = function (e) {
            app.cursor.x = e.clientX;
            app.cursor.y = e.clientY;

            if (!app.mouseIsDown) {
                return;
            }

            camera.view.x = -e.pageX - app.dragOffset.x;
            camera.view.y = -e.pageY - app.dragOffset.y;
        };

        app.canvas.onmousewheel = function (e) {
            e.preventDefault();

            var diff = -e.deltaY * 0.1 / 640;

            if (camera.zoom + diff < 0.1) {
                diff = 0.1 - camera.zoom;
            } else if (camera.zoom + diff > 1) {
                diff = 1 - camera.zoom;
            }

            camera.zoom += diff;

            // TODO
            // move camera view depending on the current view and the zoom diff
            // to keep the camera centering
        };

        camera.view.x = -300;
        camera.view.y = -20;
        camera.zoom = 0.2;

        app.load();
        app.start();
    },

    load: function () {
        app.resources['background'] = new Image();
        app.resources['background'].src = 'monopvply.jpg';
        app.resources['background'].onload = function () {
            app.resourcesLoaded++;
        };
        app.resourcesCount++;
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

    draw: function (interp) {
        app.ctx.fillStyle = 'rgb(29,29,29)';
        app.ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);

        if (app.resourcesLoaded != app.resourcesCount) {
            app.ctx.fillText('Loading..', 10, 10);
            return;
        }

        app.ctx.save();
        camera.transform(app.ctx);

        // drawing

        app.ctx.drawImage(app.resources['background'], 0, 0);


        app.ctx.beginPath();
        app.ctx.fillStyle = 'red';
        app.ctx.arc(2925, 2737.5, 10, 0, 2 * Math.PI, false);
        app.ctx.fill();
        app.ctx.stroke();


        // information
        app.ctx.restore();

        app.ctx.fillStyle = 'rgb(220, 220, 220)';

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
            '  View: x ' + Math.round(camera.view.x) + ' y ' + Math.round(camera.view.y),
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
    }

};
(function () {
    window.applicationCache.update();
    app.init();
})();