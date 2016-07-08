/**
 * @file traversal.js 遍历方法
 * @author clarkt(clarktanglei@163.com)
 */

(function () {

    function Marquee(opts) {
        this.$target = opts.$target;
        this.direction = opts.direction;
        this.speed = opts.speed;
    }

    var MAP = {
        left: {
            min: 'width',
            static: 'height',
            float: 'left'
        },
        top: {
            min: 'height',
            static: 'width',
            float: 'none'
        }
    };

    function init(ctx) {
        ctx.$inner = this.$target.children();
        ctx.$inner.css('min' + MAP[ctx.direction].min, ctx.$target.css(MAP[ctx.direction].min));
        ctx.$inner.css({
            width: ctx.$inner.css('width'),
            height: ctx.$inne.css('height'),
            float: MAP[ctx.direction].float
        });

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
