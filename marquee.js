/**
 * @file marquee.js 跑马灯效果
 * @author clarkt(clarktanglei@163.com)
 */

(function () {
    var rAF = window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    function Marquee(opts) {
        this.$target = opts.$target;
        this.direction = opts.direction;
        this.speed = opts.speed || 80;
        this.snap = opts.snap || false;
        this.pauseTime = opts.pauseTime || 3000;
        this.transitionTime = opts.transitionTime || 500;

        init(this);
        bindEvent(this);
    }

    Marquee.prototype.start = function () {
        this.$target.trigger('marqueeStart');
    };

    Marquee.prototype.stop = function () {
        this.isStop = true;
    };

    var MAP = {
        left: {
            min: 'width',
            static: 'height',
            outer: 'outerWidth'
        },
        top: {
            min: 'height',
            static: 'width',
            outer: 'outerHeight'
        }
    };

    function init(ctx) {
        ctx.$inner = ctx.$target.children();
        ctx.$inner.css('min-' + MAP[ctx.direction].min,
            ctx.$target.css(MAP[ctx.direction].min));
        ctx.$inner.css({
            width: ctx.$inner.css('width'),
            height: ctx.$inner.css('height')
        });

        ctx.$clone = $(ctx.$inner.clone(true));

        ctx.$wrapper = $('<div></div>');
        ctx.$wrapper.css({
            position: 'relative',
            display: 'inline-block',
            width: 'auto',
            height: 'auto',
            whiteSpace: 'nowrap',
            fontSize: 0,
            transform: 'translate3d(0, 0, 0)'
        });

        ctx.$target.prepend(ctx.$wrapper);
        ctx.$wrapper.append(ctx.$inner);
        ctx.$wrapper.append(ctx.$clone);
    }

    function bindEvent(ctx) {
        var $inner = ctx.$inner;
        var $wrapper = ctx.$wrapper;
        var direction = ctx.direction;
        var now;
        var lastMove = 0;
        var point;
        var lastMoment;

        var smoothSpeed = ctx.speed / 1000;
        var smoothSize = $inner[MAP[direction].outer]();

        function smoothLoop() {
            if (ctx.isStop) {
                return;
            }

            now = Date.now();
            point = smoothSpeed * (now - lastMoment);

            if (lastMove - point + smoothSize <= 0) {
                lastMoment = now;
                lastMove = 0;
                $wrapper.css(direction, 0);
            }
            else if (point > 1) {
                lastMoment = now;
                lastMove -= Math.round(point);
                $wrapper.css(direction, lastMove + 'px');
            }

            return rAF(smoothLoop);
        }

        var $itemChildren = $inner.children();
        var length = $itemChildren.length;
        var itemIndex = 0;
        var pauseTime = ctx.pauseTime;
        var moveTime = ctx.transitionTime;
        var lastPauseMoment = Date.now();

        var $currentItem;
        var currentItemSize;
        var snapSpeed;
        var snapStepSize = 0;

        function snapLoop() {
            if (ctx.isStop) {
                return;
            }

            now = Date.now();

            if (lastMoment) {
                point = snapSpeed * (now - lastMoment);

                if (lastMove - point + snapStepSize <= 0) {
                    lastPauseMoment = now;
                    lastMoment = null;

                    if (itemIndex < length - 1) {
                        lastMove = -snapStepSize;
                        itemIndex++;
                    }
                    else {
                        lastMove = 0;
                        itemIndex = 0;
                        snapStepSize = 0;
                    }

                    $wrapper.css(direction, lastMove + 'px');
                }
                else if (point > 1) {
                    lastMoment = now;
                    lastMove -= Math.round(point);
                    $wrapper.css(direction, lastMove + 'px');
                }
            }
            else if (now >= lastPauseMoment + pauseTime && lastMoment == null) {
                lastMoment = now;
                $currentItem = $itemChildren.eq(itemIndex);
                currentItemSize = $currentItem[MAP[ctx.direction].outer]();
                snapSpeed = currentItemSize / moveTime;
                snapStepSize += currentItemSize;
            }

            return rAF(snapLoop);
        }

        ctx.$target.on('mouseover touchstart touchmove', function () {
            ctx.isStop = true;
        });

        ctx.$target.on('mouseout touchend touchcancel marqueeStart', function () {
            ctx.isStop = false;

            if (ctx.snap) {
                lastMoment = null;
                rAF(snapLoop);
            }
            else {
                lastMoment = Date.now();
                rAF(smoothLoop);
            }
        });

        ctx.isStop = false;

        if (ctx.snap) {
            lastMoment = null;
            rAF(snapLoop);
        }
        else {
            lastMoment = Date.now();
            rAF(smoothLoop);
        }
    }

    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = Marquee;
    }
    else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return Marquee;
        });
    }
    else {
        this.Marquee = Marquee;
    }
})
.call(this || typeof window !== 'undefined' ? window : global);
