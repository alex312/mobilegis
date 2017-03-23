"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
define(["require", "exports", "knockout", "../uiFrame/WindowView", "text!./ResultView.html", "../../../../seecool/ajax"], function (require, exports, ko, WindowView_1, ResultViewTemplate, ajax_1) {
    "use strict";

    var ResultView = function (_WindowView_1$default) {
        _inherits(ResultView, _WindowView_1$default);

        function ResultView(options) {
            _classCallCheck(this, ResultView);

            var _this = _possibleConstructorReturn(this, (ResultView.__proto__ || Object.getPrototypeOf(ResultView)).call(this, ResultViewTemplate));

            _this.state_ = ko.observable('initialized');
            _this.dataItems_ = ko.observable([]);
            _this.requestId_ = 0;
            _this.fullSized_ = true;
            _this.knockout = false;
            _this.title('全局搜索');
            _this.providers_ = options.providers;
            ko.applyBindings(_this, _this.element);
            return _this;
        }

        _createClass(ResultView, [{
            key: "destroy",
            value: function destroy() {
                ko.cleanNode(this.element);
            }
        }, {
            key: "search",
            value: function search(keyword) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                    var rid, results;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    keyword = keyword.trim();

                                    if (keyword) {
                                        _context.next = 3;
                                        break;
                                    }

                                    throw new Error("Argument 'keyword' can not be empty.");

                                case 3:
                                    this.state_('searching');
                                    rid = ++this.requestId_;
                                    _context.prev = 5;
                                    _context.next = 8;
                                    return this.searchPlugins_(keyword);

                                case 8:
                                    results = _context.sent;

                                    if (rid === this.requestId_) {
                                        this.dataItems_(results);
                                        this.state_(this.dataItems_().length ? "result" : 'empty');
                                    }
                                    _context.next = 16;
                                    break;

                                case 12:
                                    _context.prev = 12;
                                    _context.t0 = _context["catch"](5);

                                    console.warn(_context.t0);
                                    if (rid === this.requestId_) {
                                        this.state_('error');
                                    }

                                case 16:
                                case "end":
                                    return _context.stop();
                            }
                        }
                    }, _callee, this, [[5, 12]]);
                }));
            }
        }, {
            key: "searchListClick_",
            value: function searchListClick_(item) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.providers_[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var x = _step.value;

                        if (x.onItemClick(item)) break;
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
        }, {
            key: "searchPlugins_",
            value: function searchPlugins_(keyword) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                    var promises, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, plugin, results;

                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    promises = [];
                                    _iteratorNormalCompletion2 = true;
                                    _didIteratorError2 = false;
                                    _iteratorError2 = undefined;
                                    _context2.prev = 4;

                                    for (_iterator2 = this.providers_[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                        plugin = _step2.value;

                                        if (plugin.search) promises.push(plugin.search(keyword));
                                    }
                                    _context2.next = 12;
                                    break;

                                case 8:
                                    _context2.prev = 8;
                                    _context2.t0 = _context2["catch"](4);
                                    _didIteratorError2 = true;
                                    _iteratorError2 = _context2.t0;

                                case 12:
                                    _context2.prev = 12;
                                    _context2.prev = 13;

                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                        _iterator2.return();
                                    }

                                case 15:
                                    _context2.prev = 15;

                                    if (!_didIteratorError2) {
                                        _context2.next = 18;
                                        break;
                                    }

                                    throw _iteratorError2;

                                case 18:
                                    return _context2.finish(15);

                                case 19:
                                    return _context2.finish(12);

                                case 20:
                                    promises.push(this.searchShips_(keyword));
                                    _context2.next = 23;
                                    return Promise.all(promises);

                                case 23:
                                    results = _context2.sent;

                                    results = Array.prototype.concat.apply([], results);
                                    results.sort(function (x, y) {
                                        if (!x.match) return 1;
                                        if (!y.match) return -1;
                                        var dx = x.match.length - keyword.length;
                                        var dy = y.match.length - keyword.length;
                                        var d = dx - dy;
                                        if (d != 0) return d;
                                        return x.match.localeCompare(y.match);
                                    });
                                    console.log(results);
                                    return _context2.abrupt("return", results);

                                case 28:
                                case "end":
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, this, [[4, 8, 12, 20], [13,, 15, 19]]);
                }));
            }
        }, {
            key: "searchShips_",
            value: function searchShips_(keyword) {
                return __awaiter(this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                    var ships;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    _context3.next = 2;
                                    return ajax_1.ajax.get("api/shiphistory/RealtimeData/GetRealTimeDataBySearchkey/" + keyword);

                                case 2:
                                    ships = _context3.sent;
                                    return _context3.abrupt("return", ships.map(function (v) {
                                        var mmsi = v.MMSI;
                                        var name = v.V_Name || v.Name || '';
                                        var title = name + (name && mmsi ? ' ' : name) + (mmsi ? '(' + mmsi + ')' : '');
                                        return {
                                            type: "ship",
                                            tags: ['船舶'],
                                            id: v.ShipId,
                                            title: name + (v.MMSI ? ' (' + v.MMSI + ')' : ''),
                                            match: title,
                                            data: v
                                        };
                                    }));

                                case 4:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, this);
                }));
            }
        }]);

        return ResultView;
    }(WindowView_1.default);

    exports.ResultView = ResultView;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ResultView;
});