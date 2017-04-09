(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":4}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":1}],4:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":7,"../../modules/es6.object.define-property":20}],5:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],6:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":16}],7:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],8:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":5}],9:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":12}],10:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":13,"./_is-object":16}],11:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":7,"./_ctx":8,"./_global":13,"./_hide":14}],12:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],13:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],14:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":9,"./_object-dp":17,"./_property-desc":18}],15:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":9,"./_dom-create":10,"./_fails":12}],16:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],17:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":6,"./_descriptors":9,"./_ie8-dom-define":15,"./_to-primitive":19}],18:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],19:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":16}],20:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":9,"./_export":11,"./_object-dp":17}],21:[function(require,module,exports){
'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('./utils');

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global Ext, $ */
/* eslint class-methods-use-this: "off" */
/* eslint no-use-before-define: "off" */
/* eslint no-useless-escape: "off" */
/* eslint no-control-regex: "off" */
/* eslint no-extend-native: "off" */
Array.prototype.remove = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var a = [].concat(args);
    var L = a.length;
    var what = void 0;
    var ax = void 0;
    while (L && this.length) {
        what = a[--L];
        ax = this.indexOf(what);
        if (ax > -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

HTMLTextAreaElement.prototype.setCaretPosition = function (start, end) {
    end = typeof end !== 'undefined' ? end : start;
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};

HTMLTextAreaElement.prototype.hasSelection = function () {
    if (this.selectionStart === this.selectionEnd) {
        return false;
    }
    return true;
};

HTMLTextAreaElement.prototype.isMultilineSelection = function () {
    var re = /(\n)/g;
    if ((this.value.substring(this.selectionStart, this.selectionEnd).match(re) || []).length > 0) {
        return true;
    }
    return false;
};

window.activeIDs = [];

var state = {
    onQuestionPage: window.location.pathname.startsWith('/q/'),
    onFeedPage: window.location.pathname === '' || window.location.pathname === '/' || window.location.pathname.startsWith('/my/feed'),
    onAllQuestionsPage: window.location.pathname.startsWith('/questions'),
    onTagQuestionsPage: window.location.pathname.startsWith('/tag/') && /\/?_?questions_?/g.test(window.location.pathname)
};

(function () {
    if (window.location.hash.startsWith('#comment_')) {
        var comment = $(window.location.hash).closest('li[role^="answer_item"]');
        window.activeIDs.push($(comment).attr('id'));
    }
})();

var callbackMessage = function callbackMessage(request, sender, callback) {
    window.Ext.callbackMessage(request, sender, callback);
};

var selectors = {
    QuestionCommentsRootSelector: 'ul[role="question_comments_list"]',
    SolutionsRootSelector: '#solutions > ul#solutions_list',
    AnswersRootSelector: '#answers > ul#answers_list',
    TagsListRootSelector: '#question_show ul.tags-list',
    FeedRootSelector: 'ul.content-list[role="content-list"]'
};

var Parser = new _parser2.default(selectors);

var Extension = function () {
    function Extension() {
        (0, _classCallCheck3.default)(this, Extension);

        this.Timer = undefined;
        var defaults = Object.freeze({
            ajax: true,
            check_answers: false,
            check_feed: true,
            interval: 10,
            use_kbd: true,
            use_tab: false,
            hide_top_panel: false,
            hide_right_sidebar: false
        });
        this.Options = Object.assign({}, defaults);
        this.textareaSelectorAll = 'textarea.textarea';
    }

    (0, _createClass3.default)(Extension, [{
        key: 'stopTimer',
        value: function stopTimer() {
            clearInterval(this.Timer);
        }
    }, {
        key: 'startTimer',
        value: function startTimer() {
            var _this = this;

            this.Timer = setInterval(function () {
                if (state.onQuestionPage && _this.Options.check_answers) {
                    _this.updatePage();
                }
                if ((state.onFeedPage || state.onAllQuestionsPage || state.onTagQuestionsPage) && _this.Options.check_feed) {
                    _this.updateFeed();
                }
            }, this.Options.interval * 1000);
        }
    }, {
        key: 'reStartTimer',
        value: function reStartTimer() {
            this.stopTimer();

            if (this.Options.ajax && this.Options.interval > 0) {
                this.startTimer();
            }
        }
    }, {
        key: 'updateQuestionComments',
        value: function updateQuestionComments(body) {
            var newQuestionComments = Parser.getQuestionComments(body);
            var QuestionCommentsRoot = $(document).find(selectors.QuestionCommentsRootSelector);
            QuestionCommentsRoot.find('li').remove('li[role*="comments_item"]');
            for (var i = 0; i < newQuestionComments.length; i++) {
                var comment = newQuestionComments[i];
                var li = $('<li/>', {
                    class: 'content-list__item',
                    role: 'comments_item'
                });
                $(li).html(comment.content);
                $(li).insertBefore($(QuestionCommentsRoot.find('li.content-list__item').last()));
            }
        }
    }, {
        key: 'updateSolutions',
        value: function updateSolutions(body) {
            var localSolutions = Parser.getSolutions(document);
            var Solutions = Parser.getSolutions(body);
            var SolutionsRoot = $(document).find(selectors.SolutionsRootSelector);
            var solutionsDeleteArray = [];

            if (Solutions.length < localSolutions.length) {
                solutionsDeleteArray = localSolutions.filter(function (item) {
                    return !Solutions.find(function (search) {
                        return search.id === item.id;
                    });
                });
            }

            $('#solutions span[role="answers_counter"]').text(localSolutions.length - solutionsDeleteArray.length);

            for (var i = 0; i < solutionsDeleteArray.length; i++) {
                var _id = $(solutionsDeleteArray[i]).attr('id');
                $(SolutionsRoot).find('li').remove('#' + _id);
            }

            for (var _i = 0; _i < Solutions.length; _i++) {
                var solution = $(Solutions[_i]);
                var currentId = $(solution).attr('id');
                var exists = $(SolutionsRoot).find('li#' + currentId).get(0);
                if (!window.activeIDs.includes(currentId)) {
                    if (exists) {
                        var isEdition = $(exists).find('div.answer-form_edit[role*="edit_answer_form"]').get(0);
                        if (!isEdition) {
                            $(exists).html($(solution).html());
                        }
                    } else {
                        $(SolutionsRoot).append($(solution));
                    }
                }
            }
        }
    }, {
        key: 'updateAnswers',
        value: function updateAnswers(body) {
            var localAnswers = Parser.getAnswers(document);
            var Answers = Parser.getAnswers(body);
            var AnswersRoot = $(document).find(selectors.AnswersRootSelector);
            var answersDeleteArray = [];

            if (Answers.length < localAnswers.length) {
                answersDeleteArray = localAnswers.filter(function (item) {
                    return !Answers.find(function (search) {
                        return search.id === item.id;
                    });
                });
            }

            $('#answers span[role="answers_counter"]').text(localAnswers.length - answersDeleteArray.length);

            for (var i = 0; i < answersDeleteArray.length; i++) {
                var _id = $(answersDeleteArray[i]).attr('id');
                $(AnswersRoot).find('li').remove('#' + _id);
            }

            for (var _i2 = 0; _i2 < Answers.length; _i2++) {
                var answer = $(Answers[_i2]);
                var currentId = $(answer).attr('id');
                var exists = $(AnswersRoot).find('li#' + currentId).get(0);
                if (!window.activeIDs.includes(currentId)) {
                    if (exists) {
                        var isEdition = $(exists).find('div.answer-form_edit[role*="edit_answer_form"]').get(0);
                        if (!isEdition) {
                            $(exists).html($(answer).html());
                        }
                    } else {
                        $(AnswersRoot).append($(answer));
                    }
                }
            }
        }
    }, {
        key: 'updateFeed',
        value: function updateFeed(body) {
            (0, _utils.getPage)(window.location.href).then(function (body) {
                var Questions = Parser.getFeed(body);
                var FeedRoot = $(document).find(selectors.FeedRootSelector);
                $(FeedRoot).find('li').remove();
                var li = $('<li/>', {
                    class: 'content-list__item new-question',
                    role: 'content-list__item'
                });
                for (var i = 0; i < Questions.length; i++) {
                    var question = $(Questions[i]);
                    var html = $(question).wrap($(li).clone());
                    $(FeedRoot).append($(html));
                }
            });
        }
    }, {
        key: 'updatePage',
        value: function updatePage() {
            var _this2 = this;

            (0, _utils.getPage)(window.location.href).then(function (body) {
                _this2.updateQuestionComments(body);
                _this2.updateSolutions(body);
                _this2.updateAnswers(body);
            });
        }
    }, {
        key: 'addKeyDownSendListener',
        value: function addKeyDownSendListener() {
            var _this3 = this;

            $(document).delegate(this.textareaSelectorAll, 'keydown', function (event) {
                if (!event) {
                    var _event = window.event;
                }
                var form = $(event.target.form);
                var button = $('button[type="submit"]', form);
                if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
                    if (_this3.Options.use_kbd) {
                        button.click();
                    }
                }
            });
        }
    }, {
        key: 'addKeyDownIndentFormatListener',
        value: function addKeyDownIndentFormatListener() {
            var _this4 = this;

            $(document).delegate(this.textareaSelectorAll, 'keydown', function (event) {
                if (!event) {
                    var _event2 = window.event;
                }

                if (event.keyCode !== 9 || event.ctrlKey || event.metaKey || event.altKey) return;

                if (!_this4.Options.use_tab) return false;

                var tabString = '\t';
                var target = event.target;
                var selectionStart = target.selectionStart;
                var selectionEnd = target.selectionEnd;

                var lineStart = selectionStart;
                for (lineStart = selectionStart; lineStart >= 0 && target.value[lineStart] !== '\n'; lineStart--) {}

                var lineEnd = selectionEnd;
                for (lineEnd = selectionEnd; lineEnd < target.value.length && target.value[lineEnd] !== '\n'; lineEnd++) {}

                var text = target.value.substring(lineStart, lineEnd);

                // Are we selecting multiple lines?
                if (target.hasSelection() && target.isMultilineSelection()) {
                    var numChanges = 0;
                    var firstLineNumChanges = 1;

                    if (!event.shiftKey) {
                        // Normal Tab
                        var re = new RegExp('(\n[ ]*)', 'g');

                        numChanges = (text.match(re) || []).length;

                        text = text.replace(re, '$1' + tabString);
                    } else {
                        // Shift+Tab
                        var _re = new RegExp('(\n[ ]*)' + tabString, 'g');

                        numChanges = (text.match(_re) || []).length;

                        var indexOfNewLine = 1;
                        for (indexOfNewLine = 1; indexOfNewLine < text.length && text[indexOfNewLine] !== '\n'; ++indexOfNewLine) {}
                        firstLineNumChanges = (text.substring(0, indexOfNewLine).match(_re) || []).length;

                        text = text.replace(_re, '$1');
                    }

                    target.value = target.value.substring(0, lineStart) + text + target.value.substring(lineEnd, target.value.length);

                    // Keep the selection we had before
                    var newSelectionStart = selectionStart + tabString.length * (!event.shiftKey ? 1 : -1) * firstLineNumChanges;
                    var newSelectionEnd = selectionEnd + tabString.length * numChanges * (!event.shiftKey ? 1 : -1);

                    target.setCaretPosition(newSelectionStart, newSelectionEnd);
                } else {
                    // We are not in multiline so
                    // we should add a tab at the position
                    // only shift-tab if there is a tab present before
                    if (!event.shiftKey) {
                        // Normal Tab
                        target.value = target.value.substring(0, selectionStart) + tabString + target.value.substring(selectionEnd, target.value.length);

                        target.setCaretPosition(selectionStart + tabString.length, selectionEnd + tabString.length);
                    } else if (target.value.substring(selectionStart - tabString.length, selectionStart) === tabString) {
                        // Shift+Tab
                        target.value = target.value.substring(0, selectionStart - tabString.length) + target.value.substring(selectionEnd, target.value.length);
                        target.setCaretPosition(selectionStart - tabString.length, selectionEnd - tabString.length);
                    }
                }
                return false;
            });
        }
    }, {
        key: 'updateSidebar',
        value: function updateSidebar(html) {
            var aside = $('aside.layout__navbar[role="navbar"]');

            try {
                aside.children('ul.events-list').remove();
            } catch (e) {}

            if (html) {
                aside.append($(html));
            }
        }
    }, {
        key: 'switchTopPanel',
        value: function switchTopPanel() {
            var topPanel = $('div.tmservices-panel[role="tm_panel"]');

            if (this.Options.hide_top_panel) {
                topPanel.hide();
            } else {
                topPanel.show();
            }
        }
    }, {
        key: 'switchRightSidebar',
        value: function switchRightSidebar() {
            var mainPage = $('main.page');

            if (this.Options.hide_right_sidebar) {
                $('div.dropdown__menu').css({
                    left: '-150px'
                });
                mainPage.css({
                    marginRight: '0px'
                });
            } else {
                $('div.dropdown__menu').css({
                    left: '0px'
                });
                mainPage.css({
                    marginRight: '300px'
                });
            }
        }
    }, {
        key: 'callbackMessage',
        value: function callbackMessage(request, sender, callback) {
            if (request && request.cmd) {
                switch (request.cmd) {
                    case 'updateSidebar':
                        this.updateSidebar(request.data);
                        break;
                    case 'options':
                    default:
                        this.Options = Object.assign({}, this.Options, request.data || {});
                        this.switchTopPanel();
                        this.switchRightSidebar();
                        this.addKeyDownSendListener();
                        this.addKeyDownIndentFormatListener();
                        this.reStartTimer();
                        break;
                }
            }
        }
    }, {
        key: 'sendMessageToBackgroundScript',
        value: function sendMessageToBackgroundScript(request) {
            _utils.Device.runtime.sendMessage(request, {}, callbackMessage);
        }
    }]);
    return Extension;
}();

window.Ext = new Extension();

_utils.Device.runtime.onMessage.addListener(callbackMessage);

window.Ext.sendMessageToBackgroundScript({
    cmd: 'options'
});

if (state.onQuestionPage) {
    $(document).delegate('a[role="toggle_answer_comments"]', 'click', function (event) {
        if (!event) {
            var _event3 = window.event;
        }

        var target = $(event.target).closest('a[role="toggle_answer_comments"]');
        var answerId = target.attr('id').replace(/[^\d]/g, '').replace(/([\d]+)/, 'answer_item_$1');
        var isHidden = target.closest('footer').siblings('div.answer__comments').hasClass('hidden');

        if (isHidden) {
            window.activeIDs.remove(answerId);
        } else {
            window.activeIDs.push(answerId);
        }
    });
}
},{"./parser":22,"./utils":23,"babel-runtime/helpers/classCallCheck":2,"babel-runtime/helpers/createClass":3}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global $ */

var _class = function () {
    function _class(selectors) {
        (0, _classCallCheck3.default)(this, _class);

        var defaults = Object.freeze({
            QuestionCommentsRootSelector: 'ul[role="question_comments_list"]',
            SolutionsRootSelector: '#solutions > ul#solutions_list',
            AnswersRootSelector: '#answers > ul#answers_list',
            TagsListRootSelector: '#question_show ul.tags-list',
            FeedRootSelector: 'ul.content-list[role="content-list"]'
        });
        this.selectors = Object.assign({}, defaults, selectors || {});
    }

    (0, _createClass3.default)(_class, [{
        key: 'getQuestionComments',
        value: function getQuestionComments(source) {
            var QuestionComments = $(source).find(this.selectors.QuestionCommentsRootSelector).find('li.content-list__item[role="comments_item"]');

            var QuestionCommentsJSON = $(QuestionComments).map(function (i, comment) {
                var result = {
                    id: $(comment).attr('id'),
                    content: $(comment).html(),
                    questionComment: true,
                    answer: false,
                    solution: false
                };
                return result;
            }).get();
            return QuestionCommentsJSON;
        }
    }, {
        key: 'getSolutions',
        value: function getSolutions(source) {
            var Solutions = $(source).find(this.selectors.SolutionsRootSelector).find('li.content-list__item[role^="answer_item"]').get();
            return Solutions;
        }
    }, {
        key: 'getAnswers',
        value: function getAnswers(source) {
            var Answers = $(source).find(this.selectors.AnswersRootSelector).find('li.content-list__item[role^="answer_item"]').get();
            return Answers;
        }
    }, {
        key: 'getTagsList',
        value: function getTagsList(source) {
            var TagsList = $(source).find(this.selectors.TagsListRootSelector).find('li.tags-list').get();
            return TagsList;
        }
    }, {
        key: 'getFeed',
        value: function getFeed(source) {
            var Feed = $(source).find(this.selectors.FeedRootSelector).find('li.content-list__item').get();
            return Feed;
        }
    }]);
    return _class;
}();

exports.default = _class;
},{"babel-runtime/helpers/classCallCheck":2,"babel-runtime/helpers/createClass":3}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var createElement = exports.createElement = function createElement(str, parent) {
    var elem = (parent || document).createElement('div');
    elem.innerHTML = str;
    if (elem.childNodes.length > 0) {
        return elem.childNodes[0];
    }
    return elem;
};

var isChrome = exports.isChrome = window.chrome && /chrome\//i.test(window.navigator.userAgent);

var isOpera = exports.isOpera = window.opr && window.opr.addons || window.opera || /opr\//i.test(window.navigator.userAgent);

var isFirefox = exports.isFirefox = typeof InstallTrigger !== 'undefined' || /firefox/i.test(window.navigator.userAgent);

var Device = exports.Device = function () {
    if (typeof browser === 'undefined') {
        return chrome;
    }
    return browser;
}();

var getPage = exports.getPage = function getPage(url) {
    return fetch(url, {
        credentials: 'include'
    }).then(function (response) {
        return response.text();
    }).catch(console.error);
};

var _l = exports._l = function _l(msg, placeholders) {
    if (Array.isArray(placeholders)) {
        return Device.i18n.getMessage(msg, placeholders);
    }
    return Device.i18n.getMessage(msg);
};

var openWin = exports.openWin = function openWin(url) {
    return window.open(url, 'wName');
};
},{}]},{},[21]);
