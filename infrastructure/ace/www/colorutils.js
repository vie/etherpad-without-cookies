// THIS FILE IS ALSO SERVED AS CLIENT-SIDE JS

/**
 * Copyright 2009 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var colorutils = {};

// "#ffffff" or "#fff" or "ffffff" or "fff" to [1.0, 1.0, 1.0]
colorutils.css2triple = function(cssColor) {
  var sixHex = colorutils.css2sixhex(cssColor);
  function hexToFloat(hh) {
    return Number("0x"+hh)/255;
  }
  return [hexToFloat(sixHex.substr(0,2)),
	  hexToFloat(sixHex.substr(2,2)),
	  hexToFloat(sixHex.substr(4,2))];
}

// "#ffffff" or "#fff" or "ffffff" or "fff" to "ffffff"
colorutils.css2sixhex = function(cssColor) {
  var h = /[0-9a-fA-F]+/.exec(cssColor)[0];
  if (h.length != 6) {
    var a = h.charAt(0);
    var b = h.charAt(1);
    var c = h.charAt(2);
    h = a+a+b+b+c+c;
  }
  return h;
}

// [1.0, 1.0, 1.0] -> "#ffffff"
colorutils.triple2css = function(triple) {
  function floatToHex(n) {
    var n2 = colorutils.clamp(Math.round(n*255), 0, 255);
    return ("0"+n2.toString(16)).slice(-2);
  }
  return "#" + floatToHex(triple[0]) +
    floatToHex(triple[1]) + floatToHex(triple[2]);
}


colorutils.clamp = function(v,bot,top) { return v < bot ? bot : (v > top ? top : v); };
colorutils.min3 = function(a,b,c) { return (a < b) ? (a < c ? a : c) : (b < c ? b : c); };
colorutils.max3 = function(a,b,c) { return (a > b) ? (a > c ? a : c) : (b > c ? b : c); };
colorutils.colorMin = function(c) { return colorutils.min3(c[0], c[1], c[2]); };
colorutils.colorMax = function(c) { return colorutils.max3(c[0], c[1], c[2]); };
colorutils.scale = function(v, bot, top) { return colorutils.clamp(bot + v*(top-bot), 0, 1); };
colorutils.unscale = function(v, bot, top) { return colorutils.clamp((v-bot)/(top-bot), 0, 1); };

colorutils.scaleColor = function(c, bot, top) {
  return [colorutils.scale(c[0], bot, top),
	  colorutils.scale(c[1], bot, top),
	  colorutils.scale(c[2], bot, top)];
}

colorutils.unscaleColor = function(c, bot, top) {
  return [colorutils.unscale(c[0], bot, top),
	  colorutils.unscale(c[1], bot, top),
	  colorutils.unscale(c[2], bot, top)];
}

colorutils.luminosity = function(c) {
  // rule of thumb for RGB brightness; 1.0 is white
  return c[0]*0.30 + c[1]*0.59 + c[2]*0.11;
}

colorutils.saturate = function(c) {
  var min = colorutils.colorMin(c);
  var max = colorutils.colorMax(c);
  if (max - min <= 0) return [1.0, 1.0, 1.0];
  return colorutils.unscaleColor(c, min, max);
}

colorutils.blend = function(c1, c2, t) {
  return [colorutils.scale(t, c1[0], c2[0]),
	  colorutils.scale(t, c1[1], c2[1]),
	  colorutils.scale(t, c1[2], c2[2])];
}
