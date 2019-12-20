window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  fetch: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fc229BsQWdNiLwoSIi+lf0D", "fetch");
    "use strict";
    var httpUtils = cc.Class({
      extends: cc.Component,
      properties: {},
      httpGets: function httpGets(url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
            var respone = xhr.responseText;
            callback(respone);
          }
        };
        xhr.open("GET", url, true);
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        xhr.timeout = 5e3;
        xhr.send();
      },
      httpPost: function httpPost(url, params) {
        return new Promise(function(resolve, reject) {
          var xhr = cc.loader.getXMLHttpRequest();
          xhr.onreadystatechange = function() {
            cc.log("xhr.readyState=" + xhr.readyState + "  xhr.status=" + xhr.status);
            if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
              var respone = xhr.responseText;
              resolve(respone);
            }
          };
          var url_temp = "https://xcx.52zzyx.com/" + url;
          xhr.open("POST", url_temp, true);
          xhr.timeout = 5e3;
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          xhr.send(params);
        });
      },
      start: function start() {}
    });
    module.exports = httpUtils;
    cc._RF.pop();
  }, {} ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee94dBW8ZBBlrjEyYKnU5bm", "game");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        prefab: cc.Prefab,
        result: cc.Prefab,
        config: cc.JsonAsset,
        baseIcon: cc.Sprite,
        role: cc.Sprite,
        audio: cc.AudioClip
      },
      httpGets: function httpGets(url, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
            var respone = xhr.responseText;
            callback(respone);
          }
        };
        xhr.open("GET", url, true);
        cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        xhr.timeout = 5e3;
        xhr.send();
      },
      ctor: function ctor() {
        var _this = this;
        this.startTime = 0;
        this.maxDuration = 0;
        this.itemList = [];
        this.isFinished = true;
        this.httpGets("http://139.196.78.5/api/musicxml/index/getTimeAndNodes", function() {});
        window.game = {
          gameFailed: function gameFailed() {
            _this.gameFailed();
          },
          clicked: function clicked(item) {
            _this.itemList = _this.itemList.filter(function(i) {
              return i.delay !== item.delay;
            });
            0 == _this.itemList.length && setTimeout(function() {
              _this.showResult("\u6210\u529f");
            }, 200);
          }
        };
      },
      onLoad: function onLoad() {
        this.register();
        this.createItem();
      },
      register: function register() {
        var _this2 = this;
        this.baseIcon.node.zIndex = 2;
        this.baseIcon.node.on(cc.Node.EventType.TOUCH_START, function() {
          _this2.isFinished && _this2.startMove();
          cc.audioEngine.play(_this2.audio, false, 1);
          var a = new Date().getTime();
          _this2.itemList.forEach(function(item) {
            item.js.checkItem(new Date().getTime(), _this2.startTime);
          });
          var scaleTo = cc.scaleTo(.3, .8);
          var scaleToBack = cc.scaleTo(.1, 1);
          _this2.role.node.runAction(cc.sequence(cc.rotateTo(.3, 66), cc.rotateTo(.1, 0)));
          _this2.baseIcon.node.runAction(cc.sequence(scaleTo, scaleToBack));
        });
      },
      createItem: function createItem() {
        var _this3 = this;
        var timeNodes = [];
        this.config.json.forEach(function(json) {
          timeNodes = timeNodes.concat(json.TimeNodes);
        });
        timeNodes = timeNodes.filter(function(item) {
          return !item.Rest;
        });
        cc.log(timeNodes);
        timeNodes.forEach(function(item) {
          _this3.initMonster({
            key: Math.ceil(3 * Math.random()),
            delay: item.BaseTime,
            center: -310
          });
        });
      },
      readyItem: function readyItem() {},
      onClickHandle: function onClickHandle() {
        cc.director.loadScene("map");
        return;
      },
      initMonster: function initMonster(item) {
        var monster = cc.instantiate(this.prefab);
        this.node.addChild(monster);
        var js = monster.getComponent("monster");
        item.js = js;
        this.itemList.push(item);
        js.init(item, 200);
      },
      gameFailed: function gameFailed() {
        this.stopMove();
        this.showResult();
      },
      showResult: function showResult() {
        var monster = cc.instantiate(this.result);
        this.node.addChild(monster, 2);
      },
      stopMove: function stopMove() {
        this.startTime = new Date().getTime();
        this.itemList.forEach(function(item) {
          item.js.failed();
        });
        this.role.node.runAction(cc.rotateTo(.3, -66));
      },
      startMove: function startMove(e) {
        var _this4 = this;
        if (!this.isFinished) return;
        this.isFinished = false;
        this.startTime = new Date().getTime();
        this.itemList.forEach(function(item) {
          item.js.startMove(_this4.startTime);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  map: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4ae1TJr5NF2rddwCqZtdiK", "map");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        scene: cc.SceneAsset
      },
      startGame: function startGame() {
        this.node.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(function() {
          cc.director.loadScene("game");
        })));
      },
      onLoad: function onLoad() {
        cc.director.preloadScene("game");
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  midifile: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9cf0dXQj0BFoojH73j52LO8", "midifile");
    "use strict";
    function MidiFile(data) {
      function readChunk(stream) {
        var id = stream.read(4);
        var length = stream.readInt32();
        return {
          id: id,
          length: length,
          data: stream.read(length)
        };
      }
      var lastEventTypeByte;
      function readEvent(stream) {
        var event = {};
        event.deltaTime = stream.readVarInt();
        var eventTypeByte = stream.readInt8();
        if (240 == (240 & eventTypeByte)) {
          if (255 == eventTypeByte) {
            event.type = "meta";
            var subtypeByte = stream.readInt8();
            var length = stream.readVarInt();
            switch (subtypeByte) {
             case 0:
              event.subtype = "sequenceNumber";
              if (2 != length) throw "Expected length for sequenceNumber event is 2, got " + length;
              event.number = stream.readInt16();
              return event;

             case 1:
              event.subtype = "text";
              event.text = stream.read(length);
              return event;

             case 2:
              event.subtype = "copyrightNotice";
              event.text = stream.read(length);
              return event;

             case 3:
              event.subtype = "trackName";
              event.text = stream.read(length);
              return event;

             case 4:
              event.subtype = "instrumentName";
              event.text = stream.read(length);
              return event;

             case 5:
              event.subtype = "lyrics";
              event.text = stream.read(length);
              return event;

             case 6:
              event.subtype = "marker";
              event.text = stream.read(length);
              return event;

             case 7:
              event.subtype = "cuePoint";
              event.text = stream.read(length);
              return event;

             case 32:
              event.subtype = "midiChannelPrefix";
              if (1 != length) throw "Expected length for midiChannelPrefix event is 1, got " + length;
              event.channel = stream.readInt8();
              return event;

             case 47:
              event.subtype = "endOfTrack";
              if (0 != length) throw "Expected length for endOfTrack event is 0, got " + length;
              return event;

             case 81:
              event.subtype = "setTempo";
              if (3 != length) throw "Expected length for setTempo event is 3, got " + length;
              event.microsecondsPerBeat = (stream.readInt8() << 16) + (stream.readInt8() << 8) + stream.readInt8();
              return event;

             case 84:
              event.subtype = "smpteOffset";
              if (5 != length) throw "Expected length for smpteOffset event is 5, got " + length;
              var hourByte = stream.readInt8();
              event.frameRate = {
                0: 24,
                32: 25,
                64: 29,
                96: 30
              }[96 & hourByte];
              event.hour = 31 & hourByte;
              event.min = stream.readInt8();
              event.sec = stream.readInt8();
              event.frame = stream.readInt8();
              event.subframe = stream.readInt8();
              return event;

             case 88:
              event.subtype = "timeSignature";
              if (4 != length) throw "Expected length for timeSignature event is 4, got " + length;
              event.numerator = stream.readInt8();
              event.denominator = Math.pow(2, stream.readInt8());
              event.metronome = stream.readInt8();
              event.thirtyseconds = stream.readInt8();
              return event;

             case 89:
              event.subtype = "keySignature";
              if (2 != length) throw "Expected length for keySignature event is 2, got " + length;
              event.key = stream.readInt8(true);
              event.scale = stream.readInt8();
              return event;

             case 127:
              event.subtype = "sequencerSpecific";
              event.data = stream.read(length);
              return event;

             default:
              event.subtype = "unknown";
              event.data = stream.read(length);
              return event;
            }
            event.data = stream.read(length);
            return event;
          }
          if (240 == eventTypeByte) {
            event.type = "sysEx";
            var length = stream.readVarInt();
            event.data = stream.read(length);
            return event;
          }
          if (247 == eventTypeByte) {
            event.type = "dividedSysEx";
            var length = stream.readVarInt();
            event.data = stream.read(length);
            return event;
          }
          throw "Unrecognised MIDI event type byte: " + eventTypeByte;
        }
        var param1;
        if (0 == (128 & eventTypeByte)) {
          param1 = eventTypeByte;
          eventTypeByte = lastEventTypeByte;
        } else {
          param1 = stream.readInt8();
          lastEventTypeByte = eventTypeByte;
        }
        var eventType = eventTypeByte >> 4;
        event.channel = 15 & eventTypeByte;
        event.type = "channel";
        switch (eventType) {
         case 8:
          event.subtype = "noteOff";
          event.noteNumber = param1;
          event.velocity = stream.readInt8();
          return event;

         case 9:
          event.noteNumber = param1;
          event.velocity = stream.readInt8();
          0 == event.velocity ? event.subtype = "noteOff" : event.subtype = "noteOn";
          return event;

         case 10:
          event.subtype = "noteAftertouch";
          event.noteNumber = param1;
          event.amount = stream.readInt8();
          return event;

         case 11:
          event.subtype = "controller";
          event.controllerType = param1;
          event.value = stream.readInt8();
          return event;

         case 12:
          event.subtype = "programChange";
          event.programNumber = param1;
          return event;

         case 13:
          event.subtype = "channelAftertouch";
          event.amount = param1;
          return event;

         case 14:
          event.subtype = "pitchBend";
          event.value = param1 + (stream.readInt8() << 7);
          return event;

         default:
          throw "Unrecognised MIDI event type: " + eventType;
        }
      }
      stream = Stream(data);
      var headerChunk = readChunk(stream);
      if ("MThd" != headerChunk.id || 6 != headerChunk.length) throw "Bad .mid file - header not found";
      var headerStream = Stream(headerChunk.data);
      var formatType = headerStream.readInt16();
      var trackCount = headerStream.readInt16();
      var timeDivision = headerStream.readInt16();
      if (32768 & timeDivision) throw "Expressing time division in SMTPE frames is not supported yet";
      ticksPerBeat = timeDivision;
      var header = {
        formatType: formatType,
        trackCount: trackCount,
        ticksPerBeat: ticksPerBeat
      };
      var tracks = [];
      for (var i = 0; i < header.trackCount; i++) {
        tracks[i] = [];
        var trackChunk = readChunk(stream);
        if ("MTrk" != trackChunk.id) throw "Unexpected chunk - expected MTrk, got " + trackChunk.id;
        var trackStream = Stream(trackChunk.data);
        while (!trackStream.eof()) {
          var event = readEvent(trackStream);
          tracks[i].push(event);
        }
      }
      return {
        header: header,
        tracks: tracks
      };
    }
    cc._RF.pop();
  }, {} ],
  monster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "45969Ct3elJK5J5BAzC7nJR", "monster");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        atlas: cc.SpriteAtlas
      },
      ctor: function ctor() {
        this.item = {};
        this.monster = {};
        this.type = -1;
      },
      checkItem: function checkItem(timestamp, startTime) {
        var _this = this;
        var currentDelay = timestamp - startTime;
        var type = 0;
        0 == type && cc.log(currentDelay, this.item.delay);
        if (+this.item.delay - 450 <= currentDelay && +this.item.delay + 450 >= currentDelay) {
          type = 1;
          +this.item.delay - 250 <= currentDelay && +this.item.delay + 250 >= currentDelay && (type = 2);
          this.item.type = type;
          if (0 !== type) {
            this.monster.stopAllActions();
            var action2 = cc.moveTo(1, this.item.center + 200, 1200);
            this.monster.runAction(action2, cc.callFunc(function() {
              _this.monster.removeFromParent();
            }));
            window.game.clicked(this.item);
          }
        }
      },
      failed: function failed() {
        var _this2 = this;
        var action = cc.moveTo(2, 800, 0);
        var action2 = cc.callFunc(function() {
          _this2.monster.removeFromParent();
        });
        this.monster.stopAllActions();
      },
      startMove: function startMove(startTime) {
        var _this3 = this;
        var delay = new Date().getTime() - startTime;
        this.item.delay = this.item.delay - delay;
        cc.log(this.item.delay);
        var action = cc.moveTo(this.item.delay / 1e3 + 200 / this.speed, this.item.center - 200, 0);
        var action2 = cc.callFunc(function() {
          _this3.monster.removeFromParent();
          window.game.gameFailed();
        });
        this.monster.runAction(cc.sequence(action, action2));
      },
      init: function init(item, speed) {
        this.speed = speed;
        var delay = item.delay, key = item.key;
        this.item = item;
        var node = new cc.Node();
        var x = speed * delay / 1e3 + item.center;
        node.x = x;
        var sprite = node.addComponent(cc.Sprite);
        var atlas = this.atlas.getSpriteFrame(key);
        sprite.spriteFrame = atlas;
        this.node.addChild(node, 1);
        this.monster = node;
      }
    });
    cc._RF.pop();
  }, {} ],
  replayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5ea79tSjZVOiqxMV/vcnYlc", "replayer");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    var clone = function clone(o) {
      if ("object" != ("undefined" === typeof o ? "undefined" : _typeof(o))) return o;
      if (null == o) return o;
      var ret = "number" == typeof o.length ? [] : {};
      for (var key in o) ret[key] = clone(o[key]);
      return ret;
    };
    function Replayer(midiFile, timeWarp, eventProcessor, bpm) {
      var trackStates = [];
      var beatsPerMinute = bpm || 120;
      var bpmOverride = !!bpm;
      var ticksPerBeat = midiFile.header.ticksPerBeat;
      for (var i = 0; i < midiFile.tracks.length; i++) trackStates[i] = {
        nextEventIndex: 0,
        ticksToNextEvent: midiFile.tracks[i].length ? midiFile.tracks[i][0].deltaTime : null
      };
      var nextEventInfo;
      var samplesToNextEvent = 0;
      function getNextEvent() {
        var ticksToNextEvent = null;
        var nextEventTrack = null;
        var nextEventIndex = null;
        for (var i = 0; i < trackStates.length; i++) if (null != trackStates[i].ticksToNextEvent && (null == ticksToNextEvent || trackStates[i].ticksToNextEvent < ticksToNextEvent)) {
          ticksToNextEvent = trackStates[i].ticksToNextEvent;
          nextEventTrack = i;
          nextEventIndex = trackStates[i].nextEventIndex;
        }
        if (null != nextEventTrack) {
          var nextEvent = midiFile.tracks[nextEventTrack][nextEventIndex];
          midiFile.tracks[nextEventTrack][nextEventIndex + 1] ? trackStates[nextEventTrack].ticksToNextEvent += midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime : trackStates[nextEventTrack].ticksToNextEvent = null;
          trackStates[nextEventTrack].nextEventIndex += 1;
          for (var i = 0; i < trackStates.length; i++) null != trackStates[i].ticksToNextEvent && (trackStates[i].ticksToNextEvent -= ticksToNextEvent);
          return {
            ticksToEvent: ticksToNextEvent,
            event: nextEvent,
            track: nextEventTrack
          };
        }
        return null;
      }
      var midiEvent;
      var temporal = [];
      function processEvents() {
        function processNext() {
          bpmOverride || "meta" != midiEvent.event.type || "setTempo" != midiEvent.event.subtype || (beatsPerMinute = 6e7 / midiEvent.event.microsecondsPerBeat);
          var beatsToGenerate = 0;
          var secondsToGenerate = 0;
          if (midiEvent.ticksToEvent > 0) {
            beatsToGenerate = midiEvent.ticksToEvent / ticksPerBeat;
            secondsToGenerate = beatsToGenerate / (beatsPerMinute / 60);
          }
          var time = 1e3 * secondsToGenerate * timeWarp || 0;
          temporal.push([ midiEvent, time ]);
          midiEvent = getNextEvent();
        }
        if (midiEvent = getNextEvent()) while (midiEvent) processNext(true);
      }
      processEvents();
      return {
        getData: function getData() {
          return clone(temporal);
        }
      };
    }
    cc._RF.pop();
  }, {} ],
  result: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "72850oBflFHVrVCYAmXgOxq", "result");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        result: cc.Prefab
      },
      show: function show() {
        this.node.active = true;
      },
      hide: function hide() {
        this.node.active = false;
      },
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  stream: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "69c4eXyu6NA5L7yMNzyOq8f", "stream");
    "use strict";
    function Stream(str) {
      var position = 0;
      function read(length) {
        var result = str.substr(position, length);
        position += length;
        return result;
      }
      function readInt32() {
        var result = (str.charCodeAt(position) << 24) + (str.charCodeAt(position + 1) << 16) + (str.charCodeAt(position + 2) << 8) + str.charCodeAt(position + 3);
        position += 4;
        return result;
      }
      function readInt16() {
        var result = (str.charCodeAt(position) << 8) + str.charCodeAt(position + 1);
        position += 2;
        return result;
      }
      function readInt8(signed) {
        var result = str.charCodeAt(position);
        signed && result > 127 && (result -= 256);
        position += 1;
        return result;
      }
      function eof() {
        return position >= str.length;
      }
      function readVarInt() {
        var result = 0;
        while (true) {
          var b = readInt8();
          if (!(128 & b)) return result + b;
          result += 127 & b;
          result <<= 7;
        }
      }
      return {
        eof: eof,
        read: read,
        readInt32: readInt32,
        readInt16: readInt16,
        readInt8: readInt8,
        readVarInt: readVarInt
      };
    }
    cc._RF.pop();
  }, {} ],
  superagent: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      cc._RF.push(module, "d05d0JtpZtGAoEyrAe4Ri2+", "superagent");
      "use strict";
      var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      !function(t) {
        "object" == ("undefined" === typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).superagent = t();
      }(function() {
        var t = {
          exports: {}
        };
        function e(t) {
          if (t) return function(t) {
            for (var r in e.prototype) t[r] = e.prototype[r];
            return t;
          }(t);
        }
        t.exports = e, e.prototype.on = e.prototype.addEventListener = function(t, e) {
          return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), 
          this;
        }, e.prototype.once = function(t, e) {
          function r() {
            this.off(t, r), e.apply(this, arguments);
          }
          return r.fn = e, this.on(t, r), this;
        }, e.prototype.off = e.prototype.removeListener = e.prototype.removeAllListeners = e.prototype.removeEventListener = function(t, e) {
          if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, 
          this;
          var r, o = this._callbacks["$" + t];
          if (!o) return this;
          if (1 == arguments.length) return delete this._callbacks["$" + t], this;
          for (var n = 0; n < o.length; n++) if ((r = o[n]) === e || r.fn === e) {
            o.splice(n, 1);
            break;
          }
          return 0 === o.length && delete this._callbacks["$" + t], this;
        }, e.prototype.emit = function(t) {
          this._callbacks = this._callbacks || {};
          for (var e = new Array(arguments.length - 1), r = this._callbacks["$" + t], o = 1; o < arguments.length; o++) e[o - 1] = arguments[o];
          if (r) {
            o = 0;
            for (var n = (r = r.slice(0)).length; o < n; ++o) r[o].apply(this, e);
          }
          return this;
        }, e.prototype.listeners = function(t) {
          return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || [];
        }, e.prototype.hasListeners = function(t) {
          return !!this.listeners(t).length;
        }, t = t.exports;
        var r;
        function o(t) {
          return (o = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          })(t);
        }
        r = s, s.default = s, s.stable = u, s.stableStringify = u;
        var n = [], i = [];
        function s(t, e, r) {
          var s;
          for (function t(e, r, s, a) {
            var u;
            if ("object" == o(e) && null !== e) {
              for (u = 0; u < s.length; u++) if (s[u] === e) {
                var p = Object.getOwnPropertyDescriptor(a, r);
                return void (void 0 !== p.get ? p.configurable ? (Object.defineProperty(a, r, {
                  value: "[Circular]"
                }), n.push([ a, r, e, p ])) : i.push([ e, r ]) : (a[r] = "[Circular]", n.push([ a, r, e ])));
              }
              if (s.push(e), Array.isArray(e)) for (u = 0; u < e.length; u++) t(e[u], u, s, e); else {
                var h = Object.keys(e);
                for (u = 0; u < h.length; u++) {
                  var c = h[u];
                  t(e[c], c, s, e);
                }
              }
              s.pop();
            }
          }(t, "", [], void 0), s = 0 === i.length ? JSON.stringify(t, e, r) : JSON.stringify(t, p(e), r); 0 !== n.length; ) {
            var a = n.pop();
            4 === a.length ? Object.defineProperty(a[0], a[1], a[3]) : a[0][a[1]] = a[2];
          }
          return s;
        }
        function a(t, e) {
          return t < e ? -1 : t > e ? 1 : 0;
        }
        function u(t, e, r) {
          var s, u = function t(e, r, s, u) {
            var p;
            if ("object" == o(e) && null !== e) {
              for (p = 0; p < s.length; p++) if (s[p] === e) {
                var h = Object.getOwnPropertyDescriptor(u, r);
                return void (void 0 !== h.get ? h.configurable ? (Object.defineProperty(u, r, {
                  value: "[Circular]"
                }), n.push([ u, r, e, h ])) : i.push([ e, r ]) : (u[r] = "[Circular]", n.push([ u, r, e ])));
              }
              if ("function" == typeof e.toJSON) return;
              if (s.push(e), Array.isArray(e)) for (p = 0; p < e.length; p++) t(e[p], p, s, e); else {
                var c = {}, l = Object.keys(e).sort(a);
                for (p = 0; p < l.length; p++) {
                  var f = l[p];
                  t(e[f], f, s, e), c[f] = e[f];
                }
                if (void 0 === u) return c;
                n.push([ u, r, e ]), u[r] = c;
              }
              s.pop();
            }
          }(t, "", [], void 0) || t;
          for (s = 0 === i.length ? JSON.stringify(u, e, r) : JSON.stringify(u, p(e), r); 0 !== n.length; ) {
            var h = n.pop();
            4 === h.length ? Object.defineProperty(h[0], h[1], h[3]) : h[0][h[1]] = h[2];
          }
          return s;
        }
        function p(t) {
          return t = void 0 !== t ? t : function(t, e) {
            return e;
          }, function(e, r) {
            if (i.length > 0) for (var o = 0; o < i.length; o++) {
              var n = i[o];
              if (n[1] === e && n[0] === r) {
                r = "[Circular]", i.splice(o, 1);
                break;
              }
            }
            return t.call(this, e, r);
          };
        }
        function h(t) {
          return (h = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          })(t);
        }
        var c = function c(t) {
          return null !== t && "object" == h(t);
        }, l = {};
        function f(t) {
          return (f = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          })(t);
        }
        function d(t) {
          if (t) return function(t) {
            for (var e in d.prototype) Object.prototype.hasOwnProperty.call(d.prototype, e) && (t[e] = d.prototype[e]);
            return t;
          }(t);
        }
        l = d, d.prototype.clearTimeout = function() {
          return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), clearTimeout(this._uploadTimeoutTimer), 
          delete this._timer, delete this._responseTimeoutTimer, delete this._uploadTimeoutTimer, 
          this;
        }, d.prototype.parse = function(t) {
          return this._parser = t, this;
        }, d.prototype.responseType = function(t) {
          return this._responseType = t, this;
        }, d.prototype.serialize = function(t) {
          return this._serializer = t, this;
        }, d.prototype.timeout = function(t) {
          if (!t || "object" != f(t)) return this._timeout = t, this._responseTimeout = 0, 
          this._uploadTimeout = 0, this;
          for (var e in t) if (Object.prototype.hasOwnProperty.call(t, e)) switch (e) {
           case "deadline":
            this._timeout = t.deadline;
            break;

           case "response":
            this._responseTimeout = t.response;
            break;

           case "upload":
            this._uploadTimeout = t.upload;
            break;

           default:
            console.warn("Unknown timeout option", e);
          }
          return this;
        }, d.prototype.retry = function(t, e) {
          return 0 !== arguments.length && !0 !== t || (t = 1), t <= 0 && (t = 0), this._maxRetries = t, 
          this._retries = 0, this._retryCallback = e, this;
        };
        var y = [ "ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT" ];
        d.prototype._shouldRetry = function(t, e) {
          if (!this._maxRetries || this._retries++ >= this._maxRetries) return !1;
          if (this._retryCallback) try {
            var r = this._retryCallback(t, e);
            if (!0 === r) return !0;
            if (!1 === r) return !1;
          } catch (o) {
            console.error(o);
          }
          if (e && e.status && e.status >= 500 && 501 !== e.status) return !0;
          if (t) {
            if (t.code && y.includes(t.code)) return !0;
            if (t.timeout && "ECONNABORTED" === t.code) return !0;
            if (t.crossDomain) return !0;
          }
          return !1;
        }, d.prototype._retry = function() {
          return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), 
          this._aborted = !1, this.timedout = !1, this._end();
        }, d.prototype.then = function(t, e) {
          var r = this;
          if (!this._fullfilledPromise) {
            var o = this;
            this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), 
            this._fullfilledPromise = new Promise(function(t, e) {
              o.on("abort", function() {
                var t = new Error("Aborted");
                t.code = "ABORTED", t.status = r.status, t.method = r.method, t.url = r.url, e(t);
              }), o.end(function(r, o) {
                r ? e(r) : t(o);
              });
            });
          }
          return this._fullfilledPromise.then(t, e);
        }, d.prototype.catch = function(t) {
          return this.then(void 0, t);
        }, d.prototype.use = function(t) {
          return t(this), this;
        }, d.prototype.ok = function(t) {
          if ("function" != typeof t) throw new Error("Callback required");
          return this._okCallback = t, this;
        }, d.prototype._isResponseOK = function(t) {
          return !!t && (this._okCallback ? this._okCallback(t) : t.status >= 200 && t.status < 300);
        }, d.prototype.get = function(t) {
          return this._header[t.toLowerCase()];
        }, d.prototype.getHeader = d.prototype.get, d.prototype.set = function(t, e) {
          if (c(t)) {
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && this.set(r, t[r]);
            return this;
          }
          return this._header[t.toLowerCase()] = e, this.header[t] = e, this;
        }, d.prototype.unset = function(t) {
          return delete this._header[t.toLowerCase()], delete this.header[t], this;
        }, d.prototype.field = function(t, e) {
          if (null == t) throw new Error(".field(name, val) name can not be empty");
          if (this._data) throw new Error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
          if (c(t)) {
            for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && this.field(r, t[r]);
            return this;
          }
          if (Array.isArray(e)) {
            for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && this.field(t, e[o]);
            return this;
          }
          if (null == e) throw new Error(".field(name, val) val can not be empty");
          return "boolean" == typeof e && (e = String(e)), this._getFormData().append(t, e), 
          this;
        }, d.prototype.abort = function() {
          return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), 
          this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
        }, d.prototype._auth = function(t, e, r, o) {
          switch (r.type) {
           case "basic":
            this.set("Authorization", "Basic ".concat(o("".concat(t, ":").concat(e))));
            break;

           case "auto":
            this.username = t, this.password = e;
            break;

           case "bearer":
            this.set("Authorization", "Bearer ".concat(t));
          }
          return this;
        }, d.prototype.withCredentials = function(t) {
          return void 0 === t && (t = !0), this._withCredentials = t, this;
        }, d.prototype.redirects = function(t) {
          return this._maxRedirects = t, this;
        }, d.prototype.maxResponseSize = function(t) {
          if ("number" != typeof t) throw new TypeError("Invalid argument");
          return this._maxResponseSize = t, this;
        }, d.prototype.toJSON = function() {
          return {
            method: this.method,
            url: this.url,
            data: this._data,
            headers: this._header
          };
        }, d.prototype.send = function(t) {
          var e = c(t), r = this._header["content-type"];
          if (this._formData) throw new Error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
          if (e && !this._data) Array.isArray(t) ? this._data = [] : this._isHost(t) || (this._data = {}); else if (t && this._data && this._isHost(this._data)) throw new Error("Can't merge these send calls");
          if (e && c(this._data)) for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && (this._data[o] = t[o]); else "string" == typeof t ? (r || this.type("form"), 
          r = this._header["content-type"], this._data = "application/x-www-form-urlencoded" === r ? this._data ? "".concat(this._data, "&").concat(t) : t : (this._data || "") + t) : this._data = t;
          return !e || this._isHost(t) ? this : (r || this.type("json"), this);
        }, d.prototype.sortQuery = function(t) {
          return this._sort = void 0 === t || t, this;
        }, d.prototype._finalizeQueryString = function() {
          var t = this._query.join("&");
          if (t && (this.url += (this.url.includes("?") ? "&" : "?") + t), this._query.length = 0, 
          this._sort) {
            var e = this.url.indexOf("?");
            if (e >= 0) {
              var r = this.url.slice(e + 1).split("&");
              "function" == typeof this._sort ? r.sort(this._sort) : r.sort(), this.url = this.url.slice(0, e) + "?" + r.join("&");
            }
          }
        }, d.prototype._appendQueryString = function() {
          console.warn("Unsupported");
        }, d.prototype._timeoutError = function(t, e, r) {
          if (!this._aborted) {
            var o = new Error("".concat(t + e, "ms exceeded"));
            o.timeout = e, o.code = "ECONNABORTED", o.errno = r, this.timedout = !0, this.abort(), 
            this.callback(o);
          }
        }, d.prototype._setTimeouts = function() {
          var t = this;
          this._timeout && !this._timer && (this._timer = setTimeout(function() {
            t._timeoutError("Timeout of ", t._timeout, "ETIME");
          }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function() {
            t._timeoutError("Response timeout of ", t._responseTimeout, "ETIMEDOUT");
          }, this._responseTimeout));
        };
        var m = {
          type: function type(t) {
            return t.split(/ *; */).shift();
          },
          params: function params(t) {
            return t.split(/ *; */).reduce(function(t, e) {
              var r = e.split(/ *= */), o = r.shift(), n = r.shift();
              return o && n && (t[o] = n), t;
            }, {});
          },
          parseLinks: function parseLinks(t) {
            return t.split(/ *, */).reduce(function(t, e) {
              var r = e.split(/ *; */), o = r[0].slice(1, -1);
              return t[r[1].split(/ *= */)[1].slice(1, -1)] = o, t;
            }, {});
          }
        }, b = {};
        function _(t) {
          if (t) return function(t) {
            for (var e in _.prototype) Object.prototype.hasOwnProperty.call(_.prototype, e) && (t[e] = _.prototype[e]);
            return t;
          }(t);
        }
        b = _, _.prototype.get = function(t) {
          return this.header[t.toLowerCase()];
        }, _.prototype._setHeaderProperties = function(t) {
          var e = t["content-type"] || "";
          this.type = m.type(e);
          var r = m.params(e);
          for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && (this[o] = r[o]);
          this.links = {};
          try {
            t.link && (this.links = m.parseLinks(t.link));
          } catch (n) {}
        }, _.prototype._setStatusProperties = function(t) {
          var e = t / 100 | 0;
          this.statusCode = t, this.status = this.statusCode, this.statusType = e, this.info = 1 === e, 
          this.ok = 2 === e, this.redirect = 3 === e, this.clientError = 4 === e, this.serverError = 5 === e, 
          this.error = (4 === e || 5 === e) && this.toError(), this.created = 201 === t, this.accepted = 202 === t, 
          this.noContent = 204 === t, this.badRequest = 400 === t, this.unauthorized = 401 === t, 
          this.notAcceptable = 406 === t, this.forbidden = 403 === t, this.notFound = 404 === t, 
          this.unprocessableEntity = 422 === t;
        };
        var w = {};
        function v(t) {
          return function(t) {
            if (Array.isArray(t)) {
              for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e];
              return r;
            }
          }(t) || function(t) {
            if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t);
          }(t) || function() {
            throw new TypeError("Invalid attempt to spread non-iterable instance");
          }();
        }
        function T() {
          this._defaults = [];
        }
        [ "use", "on", "once", "set", "query", "type", "accept", "auth", "withCredentials", "sortQuery", "retry", "ok", "redirects", "timeout", "buffer", "serialize", "parse", "ca", "key", "pfx", "cert", "disableTLSCerts" ].forEach(function(t) {
          T.prototype[t] = function() {
            for (var e = arguments.length, r = new Array(e), o = 0; o < e; o++) r[o] = arguments[o];
            return this._defaults.push({
              fn: t,
              args: r
            }), this;
          };
        }), T.prototype._setDefaults = function(t) {
          this._defaults.forEach(function(e) {
            t[e.fn].apply(t, v(e.args));
          });
        }, w = T;
        var g, _O = {};
        function E(t) {
          return (E = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(t) {
            return "undefined" === typeof t ? "undefined" : _typeof(t);
          } : function(t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : "undefined" === typeof t ? "undefined" : _typeof(t);
          })(t);
        }
        function x() {}
        "undefined" != typeof window ? g = window : "undefined" == typeof self ? (console.warn("Using browser-only version of superagent in non-browser environment"), 
        g = void 0) : g = self;
        var k = _O = _O = function O(t, e) {
          return "function" == typeof e ? new _O.Request("GET", t).end(e) : 1 === arguments.length ? new _O.Request("GET", t) : new _O.Request(t, e);
        };
        _O.Request = q, k.getXHR = function() {
          if (g.XMLHttpRequest && (!g.location || "file:" !== g.location.protocol || !g.ActiveXObject)) return new XMLHttpRequest();
          try {
            return new ActiveXObject("Microsoft.XMLHTTP");
          } catch (t) {}
          try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
          } catch (e) {}
          try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
          } catch (r) {}
          try {
            return new ActiveXObject("Msxml2.XMLHTTP");
          } catch (o) {}
          throw new Error("Browser-only version of superagent could not find XHR");
        };
        var j = "".trim ? function(t) {
          return t.trim();
        } : function(t) {
          return t.replace(/(^\s*|\s*$)/g, "");
        };
        function S(t) {
          if (!c(t)) return t;
          var e = [];
          for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && C(e, r, t[r]);
          return e.join("&");
        }
        function C(t, e, r) {
          if (void 0 !== r) if (null !== r) if (Array.isArray(r)) r.forEach(function(r) {
            C(t, e, r);
          }); else if (c(r)) for (var o in r) Object.prototype.hasOwnProperty.call(r, o) && C(t, "".concat(e, "[").concat(o, "]"), r[o]); else t.push(encodeURIComponent(e) + "=" + encodeURIComponent(r)); else t.push(encodeURIComponent(e));
        }
        function A(t) {
          for (var e, r, o = {}, n = t.split("&"), i = 0, s = n.length; i < s; ++i) -1 === (r = (e = n[i]).indexOf("=")) ? o[decodeURIComponent(e)] = "" : o[decodeURIComponent(e.slice(0, r))] = decodeURIComponent(e.slice(r + 1));
          return o;
        }
        function P(t) {
          return /[/+]json($|[^-\w])/.test(t);
        }
        function R(t) {
          this.req = t, this.xhr = this.req.xhr, this.text = "HEAD" !== this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, 
          this.statusText = this.req.xhr.statusText;
          var e = this.xhr.status;
          1223 === e && (e = 204), this._setStatusProperties(e), this.headers = function(t) {
            for (var e, r, o, n, i = t.split(/\r?\n/), s = {}, a = 0, u = i.length; a < u; ++a) -1 !== (e = (r = i[a]).indexOf(":")) && (o = r.slice(0, e).toLowerCase(), 
            n = j(r.slice(e + 1)), s[o] = n);
            return s;
          }(this.xhr.getAllResponseHeaders()), this.header = this.headers, this.header["content-type"] = this.xhr.getResponseHeader("content-type"), 
          this._setHeaderProperties(this.header), null === this.text && t._responseType ? this.body = this.xhr.response : this.body = "HEAD" === this.req.method ? null : this._parseBody(this.text ? this.text : this.xhr.response);
        }
        function q(t, e) {
          var r = this;
          this._query = this._query || [], this.method = t, this.url = e, this.header = {}, 
          this._header = {}, this.on("end", function() {
            var t, e = null, o = null;
            try {
              o = new R(r);
            } catch (n) {
              return (e = new Error("Parser is unable to parse the response")).parse = !0, e.original = n, 
              r.xhr ? (e.rawResponse = void 0 === r.xhr.responseType ? r.xhr.responseText : r.xhr.response, 
              e.status = r.xhr.status ? r.xhr.status : null, e.statusCode = e.status) : (e.rawResponse = null, 
              e.status = null), r.callback(e);
            }
            r.emit("response", o);
            try {
              r._isResponseOK(o) || (t = new Error(o.statusText || "Unsuccessful HTTP response"));
            } catch (n) {
              t = n;
            }
            t ? (t.original = e, t.response = o, t.status = o.status, r.callback(t, o)) : r.callback(null, o);
          });
        }
        function D(t, e, r) {
          var o = k("DELETE", t);
          return "function" == typeof e && (r = e, e = null), e && o.send(e), r && o.end(r), 
          o;
        }
        return k.serializeObject = S, k.parseString = A, k.types = {
          html: "text/html",
          json: "application/json",
          xml: "text/xml",
          urlencoded: "application/x-www-form-urlencoded",
          form: "application/x-www-form-urlencoded",
          "form-data": "application/x-www-form-urlencoded"
        }, k.serialize = {
          "application/x-www-form-urlencoded": S,
          "application/json": r
        }, k.parse = {
          "application/x-www-form-urlencoded": A,
          "application/json": JSON.parse
        }, b(R.prototype), R.prototype._parseBody = function(t) {
          var e = k.parse[this.type];
          return this.req._parser ? this.req._parser(this, t) : (!e && P(this.type) && (e = k.parse["application/json"]), 
          e && t && (t.length > 0 || t instanceof Object) ? e(t) : null);
        }, R.prototype.toError = function() {
          var t = this.req, e = t.method, r = t.url, o = "cannot ".concat(e, " ").concat(r, " (").concat(this.status, ")"), n = new Error(o);
          return n.status = this.status, n.method = e, n.url = r, n;
        }, k.Response = R, t(q.prototype), l(q.prototype), q.prototype.type = function(t) {
          return this.set("Content-Type", k.types[t] || t), this;
        }, q.prototype.accept = function(t) {
          return this.set("Accept", k.types[t] || t), this;
        }, q.prototype.auth = function(t, e, r) {
          return 1 === arguments.length && (e = ""), "object" == E(e) && null !== e && (r = e, 
          e = ""), r || (r = {
            type: "function" == typeof btoa ? "basic" : "auto"
          }), this._auth(t, e, r, function(t) {
            if ("function" == typeof btoa) return btoa(t);
            throw new Error("Cannot use basic auth, btoa is not a function");
          });
        }, q.prototype.query = function(t) {
          return "string" != typeof t && (t = S(t)), t && this._query.push(t), this;
        }, q.prototype.attach = function(t, e, r) {
          if (e) {
            if (this._data) throw new Error("superagent can't mix .send() and .attach()");
            this._getFormData().append(t, e, r || e.name);
          }
          return this;
        }, q.prototype._getFormData = function() {
          return this._formData || (this._formData = new g.FormData()), this._formData;
        }, q.prototype.callback = function(t, e) {
          if (this._shouldRetry(t, e)) return this._retry();
          var r = this._callback;
          this.clearTimeout(), t && (this._maxRetries && (t.retries = this._retries - 1), 
          this.emit("error", t)), r(t, e);
        }, q.prototype.crossDomainError = function() {
          var t = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");
          t.crossDomain = !0, t.status = this.status, t.method = this.method, t.url = this.url, 
          this.callback(t);
        }, q.prototype.agent = function() {
          return console.warn("This is not supported in browser version of superagent"), this;
        }, q.prototype.buffer = q.prototype.ca, q.prototype.ca = q.prototype.agent, q.prototype.write = function() {
          throw new Error("Streaming is not supported in browser version of superagent");
        }, q.prototype.pipe = q.prototype.write, q.prototype._isHost = function(t) {
          return t && "object" == E(t) && !Array.isArray(t) && "[object Object]" !== Object.prototype.toString.call(t);
        }, q.prototype.end = function(t) {
          this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), 
          this._endCalled = !0, this._callback = t || x, this._finalizeQueryString(), this._end();
        }, q.prototype._setUploadTimeout = function() {
          var t = this;
          this._uploadTimeout && !this._uploadTimeoutTimer && (this._uploadTimeoutTimer = setTimeout(function() {
            t._timeoutError("Upload timeout of ", t._uploadTimeout, "ETIMEDOUT");
          }, this._uploadTimeout));
        }, q.prototype._end = function() {
          if (this._aborted) return this.callback(new Error("The request has been aborted even before .end() was called"));
          var t = this;
          this.xhr = k.getXHR();
          var e = this.xhr, r = this._formData || this._data;
          this._setTimeouts(), e.onreadystatechange = function() {
            var r = e.readyState;
            if (r >= 2 && t._responseTimeoutTimer && clearTimeout(t._responseTimeoutTimer), 
            4 === r) {
              var o;
              try {
                o = e.status;
              } catch (n) {
                o = 0;
              }
              if (!o) {
                if (t.timedout || t._aborted) return;
                return t.crossDomainError();
              }
              t.emit("end");
            }
          };
          var o = function o(e, r) {
            r.total > 0 && (r.percent = r.loaded / r.total * 100, 100 === r.percent && clearTimeout(t._uploadTimeoutTimer)), 
            r.direction = e, t.emit("progress", r);
          };
          if (this.hasListeners("progress")) try {
            e.addEventListener("progress", o.bind(null, "download")), e.upload && e.upload.addEventListener("progress", o.bind(null, "upload"));
          } catch (a) {}
          e.upload && this._setUploadTimeout();
          try {
            this.username && this.password ? e.open(this.method, this.url, !0, this.username, this.password) : e.open(this.method, this.url, !0);
          } catch (u) {
            return this.callback(u);
          }
          if (this._withCredentials && (e.withCredentials = !0), !this._formData && "GET" !== this.method && "HEAD" !== this.method && "string" != typeof r && !this._isHost(r)) {
            var n = this._header["content-type"], i = this._serializer || k.serialize[n ? n.split(";")[0] : ""];
            !i && P(n) && (i = k.serialize["application/json"]), i && (r = i(r));
          }
          for (var s in this.header) null !== this.header[s] && Object.prototype.hasOwnProperty.call(this.header, s) && e.setRequestHeader(s, this.header[s]);
          this._responseType && (e.responseType = this._responseType), this.emit("request", this), 
          e.send(void 0 === r ? null : r);
        }, k.agent = function() {
          return new w();
        }, [ "GET", "POST", "OPTIONS", "PATCH", "PUT", "DELETE" ].forEach(function(t) {
          w.prototype[t.toLowerCase()] = function(e, r) {
            var o = new k.Request(t, e);
            return this._setDefaults(o), r && o.end(r), o;
          };
        }), w.prototype.del = w.prototype.delete, k.get = function(t, e, r) {
          var o = k("GET", t);
          return "function" == typeof e && (r = e, e = null), e && o.query(e), r && o.end(r), 
          o;
        }, k.head = function(t, e, r) {
          var o = k("HEAD", t);
          return "function" == typeof e && (r = e, e = null), e && o.query(e), r && o.end(r), 
          o;
        }, k.options = function(t, e, r) {
          var o = k("OPTIONS", t);
          return "function" == typeof e && (r = e, e = null), e && o.send(e), r && o.end(r), 
          o;
        }, k.del = D, k.delete = D, k.patch = function(t, e, r) {
          var o = k("PATCH", t);
          return "function" == typeof e && (r = e, e = null), e && o.send(e), r && o.end(r), 
          o;
        }, k.post = function(t, e, r) {
          var o = k("POST", t);
          return "function" == typeof e && (r = e, e = null), e && o.send(e), r && o.end(r), 
          o;
        }, k.put = function(t, e, r) {
          var o = k("PUT", t);
          return "function" == typeof e && (r = e, e = null), e && o.send(e), r && o.end(r), 
          o;
        }, _O;
      });
      cc._RF.pop();
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ]
}, {}, [ "midifile", "replayer", "stream", "fetch", "game", "monster", "result", "map", "superagent" ]);