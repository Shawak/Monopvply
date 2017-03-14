/*

 Helpful links
 https://github.com/underscorediscovery/realtime-multiplayer-in-html5

 game loop
 http://www.isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing
 https://jsfiddle.net/IceCreamYou/rnqLfz14/9/?utm_source=website&utm_medium=embed&utm_campaign=rnqLfz14

 viewport
 http://stackoverflow.com/questions/16919601/html5-canvas-camera-viewport-how-to-actally-do-it ?


 */

var app = {

    ctx: null,
    mouseIsDown: false,
    zoom: 1,
    view: {x: 0, y: 0},
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

        app.ratio = ratio;
        app.ctx.scale(ratio, ratio);


        // track events
        app.canvas.onmousedown = function (e) {
            app.mouseIsDown = true;
            app.dragOffset.x = e.x - app.view.x;
            app.dragOffset.y = e.y - app.view.y;
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

            app.view.x = e.x - app.dragOffset.x;
            app.view.y = e.y - app.dragOffset.y;
        };

        app.canvas.onmousewheel = function (e) {
            e.preventDefault();

            var diff = -e.deltaY * 0.1 / 640;

            if (app.zoom + diff < 0.1) {
                diff = 0.1 - app.zoom;
            } else if (app.zoom + diff > 1) {
                diff = 1 - app.zoom;
            }

            app.zoom += diff;

            // TODO
            // move camera view depending on the current view and the zoom diff
            // to keep the camera centering
        };

        app.view.x = app.canvas.height / 2;
        app.view.y = 50;
        app.zoom = 0.2;

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

        app.ctx.save();

        //app.ctx.scale(app.scale, app.scale);
        app.ctx.setTransform(app.zoom, 0, 0, app.zoom, app.view.x * app.ratio, app.view.y * app.ratio);

        if (app.resourcesLoaded != app.resourcesCount) {
            app.ctx.fillText('Loading..', 10, 10);
            return;
        }

        app.ctx.drawImage(app.resources['background'], 0, 0);

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
            'Ratio: ' + app.ratio,
            'Zoom: ' + app.zoom,
            'View: x ' + Math.round(app.view.x) + ' y ' + Math.round(app.view.y),
            'Cursor: x ' + Math.round(app.cursor.x) + ' y ' + Math.round(app.cursor.y),
            'FPS: ' + Math.round(app.fps)
        ];

        for(var i = 0; i < info.length; i++) {
            app.ctx.fillText(info[i], 35, (i + 3) * 10)
        }

        i = 0;
        while (i <= 20 * 100) {
            app.ctx.fillText(i, i != 0 ? i : 4, 10);
            app.ctx.fillText(i, 4, i);
            i += 100;
        }
    }

};
(function () {
    app.init();
})();