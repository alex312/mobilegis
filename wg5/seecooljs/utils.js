(function (fun, define) {
    define([], fun);
})(function () {
        var utils = {};
        utils.modeDiv = function (inDiv, outDiv, zindex) {
            outDiv = outDiv || $('body');
            var inDiv0 = $('<div><img src="resources/loading.gif"  style="width: 100px;height: 100px;"><div>请稍等...</div></div>');

            inDiv0
                .addClass('wait-image-div')
                .css('cssText', 'border-radius:5px !important')
                .css('position', 'absolute')
                .css('width', '120px')
                .css('height', '120px')
                // .css('background-color','white')
                .css('left', 'calc( 50% - 60px )')
                .css('bottom', '50%')
                .css('text-align', 'center');

            var inDiv0 = inDiv || inDiv0;
            var maxZ = zindex || Math.max.apply(null, $.map(outDiv.find('*'), function (e, n) {
                        //if ($(e).css('position') == 'absolute')
                        return parseInt($(e).css('z-index')) || 1;
                    })
                );
            var modeDiv = $('<div style="' +
                'position: absolute;' +
                'right: 0;' +
                'top: 0;' +
                'left: 0;' +
                'bottom: 0;' +
                'background-color: #eeeeee;' +
                'opacity: 0.5;' +
                '"></div>');
            var modeDivFlag = false;
            var show = function () {
                if (!modeDivFlag) {
                    modeDiv.appendTo(outDiv);
                }
                modeDiv.css('z-index', maxZ + 1);
                modeDiv.css('display', 'block');
                if (inDiv) {
                    inDiv0.css('z-index', maxZ + 2);
                } else {
                    if (!modeDivFlag) {
                        inDiv0.appendTo(outDiv);
                    }
                    inDiv0.css('display', 'block');
                    inDiv0.css('z-index', maxZ + 2);
                }
                modeDivFlag = true;
            };
            var zIndex = inDiv0.css('z-index');
            var close = function () {
                if (inDiv) {
                    inDiv0.css('z-index', zIndex);
                } else {
                    inDiv0.css('display', 'none');
                }
                modeDiv.css('display', 'none');
            };
            var remove = function () {
                close();
                if (!inDiv) {
                    inDiv0.remove()
                }
                modeDiv.remove();
                modeDivFlag = false;
            };
            modeDivDate = {
                modeDiv: modeDiv,
                show: show,
                close: close,
                remove: remove
            };
            inDiv0.data("modeDiv", modeDivDate);
            return inDiv0
        };
        return utils;
    },
    typeof define == 'function' && define.amd ? define : function (_, f) {
        window.utils = f();
    });
