/*
 * John Heymans text motion templates for Premiere Pro.
 *
 * Builds Rise, Words, Ink and Flash as Motion Graphics templates (.mogrt) in
 * 16:9 and 9:16, with the timings and eases of lib/story/reveals.ts, and
 * exports them with their After Effects project to public/brand/mogrt/, or,
 * run outside the repository, to a "John Heymans templates" folder beside it.
 *
 * Run it in After Effects 2024 or later with File > Scripts > Run Script File, or
 *   osascript -e 'tell application "Adobe After Effects 2026" to DoScriptFile "<repo>/scripts/mogrt/build-mogrts.jsx"'
 *
 * It needs the static brand fonts installed (public/brand/fonts) and
 * Settings > Scripting & Expressions > "Allow Scripts to Write Files and
 * Access Network". It writes public/brand/mogrt/build-log.txt, which lists any
 * expression that failed to evaluate.
 *
 * Every expression is a string built by a function in JH, and the file only
 * builds when it runs inside After Effects, so check-expressions.mjs can load
 * it in Node and run the expressions against a stand-in for the comp.
 *
 * ExtendScript is ES3: no let, no arrow functions, no trailing commas.
 */

var JH = {};

JH.FPS = 25;
JH.DURATION = 5;
JH.OUTRO = 0.5;
JH.MAX_LINES = 6;

/* After Effects' blur units per CSS pixel of blur, and mask feather per pixel
   of the ink's fade. 1 is the starting assumption; set them from a side by side
   with the site's frames (scripts/mogrt/examples) after the first build. */
JH.BLUR = 1;
JH.FEATHER = 1;

JH.HEX = {
  night: "070613", night60: "0b0920", deep: "151038", card: "151038", violet: "3a2c91",
  lavender: "b9a8f5", amber: "ff7a2f", paper: "f3f1ea", ink: "141019", amberDeep: "a8400d"
};

JH.rgb = function (hex) {
  return [parseInt(hex.substr(0, 2), 16) / 255, parseInt(hex.substr(2, 2), 16) / 255, parseInt(hex.substr(4, 2), 16) / 255];
};

/* A colour property's value: After Effects wants four channels. */
JH.rgba = function (hex) {
  return JH.rgb(hex).concat([1]);
};

/* A colour as an expression literal, [r, g, b, 1]. */
JH.col = function (hex) {
  var c = JH.rgb(hex);
  return "[" + JH.num(c[0]) + ", " + JH.num(c[1]) + ", " + JH.num(c[2]) + ", 1]";
};

JH.num = function (n) {
  return String(Math.round(n * 10000) / 10000);
};

/* The safe margin is the site's 3.7% of the width on a 1920 frame, and the
   kit's 9:16 title card on a 1080 frame. */
JH.FORMATS = [
  { id: "16x9", label: "16:9", w: 1920, h: 1080, margin: 72 },
  { id: "9x16", label: "9:16", w: 1080, h: 1920, margin: 56 }
];

JH.FONTS = {
  display: "BigShouldersDisplayBold",
  sentence: "InstrumentSansNarrowMedium",
  regular: "InstrumentSansNarrowRegular",
  semibold: "InstrumentSansNarrowSemiBold"
};

/*
 * Sizes are the live page's. 16:9 is the page at a 1920px viewport (1rem =
 * 21.33px): a title is 6.72rem, a record line 4.2rem, the prologue sentence
 * 3.3rem. 9:16 is the page on a 390px phone (1rem = 16px, 20px of padding)
 * scaled to 1080 wide, so 1rem = 44.31px: a title is 2.91rem, a record line
 * 2.35rem, the prologue 1.6rem, and the padding becomes the 56px margin.
 * Line heights are the page's for each role.
 * `intro` is the protected reveal at the start of the clip, long enough for
 * six lines or about fifteen words.
 */
JH.STYLES = {
  rise: {
    title: "Rise", intro: 1.0, lh: 0.92, exit: 1, background: 3,
    display: { "16x9": 143, "9x16": 129 }, sentence: { "16x9": 70, "9x16": 71 },
    text: "The day after my graduation,\rI booked a plane\rticket to Kenya."
  },
  words: {
    title: "Words", intro: 2.0, lh: 0.92, exit: 1, background: 3,
    display: { "16x9": 143, "9x16": 129 }, sentence: { "16x9": 70, "9x16": 71 },
    text: "Two years.\rOne algorithm."
  },
  ink: {
    title: "Ink", intro: 1.7, lh: 0.96, exit: 1, background: 3,
    display: { "16x9": 90, "9x16": 104 }, sentence: { "16x9": 70, "9x16": 71 },
    text: "My team and my peers\rcalled me crazy."
  },
  flash: {
    title: "Flash", intro: 0.4, exit: 2, background: 1,
    sender: "My federation", message: "Run fast times in the big outdoor meets.\rThat's the route.", time: "now", initial: "F"
  }
};

JH.MENUS = {
  type: ["Display", "Sentence"],
  placement: ["Centred", "Bottom left"],
  background: ["None", "Scrim", "Night", "Paper"],
  exit: ["Blur", "Rise", "Cut"]
};

/*
 * The notification at the size the doubt beat shows it (app/story.css,
 * .notif-stack), in pixels at 100%: the desktop rules for 16:9, the phone
 * rules for 9:16, on the same rem as the type above.
 */
JH.CARDS = {
  "16x9": {
    minW: 896, padX: 29.87, padY: 26.67, gap: 23.47, radius: 32, icon: 70.4,
    initial: 27.73, sender: 23.47, senderLine: 30.51, bodyGap: 3.2,
    message: 37.33, messageLine: 46.67, time: 19.2
  },
  "9x16": {
    minW: 968, padX: 46.52, padY: 44.31, gap: 35.45, radius: 53.17, icon: 115.2,
    initial: 44.31, sender: 48.74, senderLine: 63.36, bodyGap: 6.65,
    message: 50.95, messageLine: 63.69, time: 39.88
  }
};

/* ------------------------------------------------------------ expressions */

JH.lines = function (parts) {
  return parts.join("\n");
};

/* Size, face and the lines of the master text, shared by every line layer. */
JH.prelude = function (style, fmt) {
  var s = JH.STYLES[style];
  return JH.lines([
    'var c = thisComp.layer("Controls");',
    'var face = c.effect("Type")(1).value;',
    'var place = c.effect("Placement")(1).value;',
    'var bg = c.effect("Background")(1).value;',
    'var size = (face == 1 ? ' + s.display[fmt.id] + ' : ' + s.sentence[fmt.id] + ') * Math.pow(2, (c.effect("Size")(1).value - 50) / 50);',
    'var lh = face == 1 ? ' + s.lh + ' : 1.2;',
    'var asc = face == 1 ? 0.9855 : 0.97, dsc = face == 1 ? 0.2145 : 0.25;',
    'var lead = size * lh, pad = (lead - (asc + dsc) * size) / 2;',
    JH.readText('thisComp.layer("Text")', 'raw'),
    'var parts = raw.split(/\\r\\n|\\r|\\n|\\u0003|\\|/), lines = [];',
    'for (var k = 0; k < parts.length; k++) lines.push(parts[k].replace(/^\\s+|\\s+$/g, ""));',
    'while (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();',
    'var n = Math.min(lines.length, ' + JH.MAX_LINES + ');'
  ]);
};

/* A text layer's words as a plain string, whichever form sourceText takes. */
JH.readText = function (layer, name) {
  return JH.lines([
    'var ' + name + '_p = ' + layer + '.text.sourceText, ' + name + ' = ' + name + '_p.value;',
    'if (' + name + ' === undefined || ' + name + ' === null) ' + name + ' = ' + name + '_p;',
    name + ' = (' + name + ' && typeof ' + name + '.text == "string") ? ' + name + '.text : "" + ' + name + ';'
  ]);
};

/* The three exits, as q (0 to 1, power2.in), a scale and a lift in pixels. */
JH.exit = function () {
  return JH.lines([
    'var ex = thisComp.layer("Controls").effect("Exit")(1).value;',
    'var xd = ex == 1 ? 0.3 : 0.25;',
    'var q = ex == 3 ? 0 : Math.min(Math.max((time - (thisComp.duration - xd)) / xd, 0), 1);',
    'q = q * q * q;',
    'var xs = ex == 1 ? 1 - 0.1 * q : 1;',
    'var dy = ex == 1 ? -24 * q : -8 * q;'
  ]);
};

/* When the rest of the clip reads a line's width, it reads it here: every reveal has landed, no exit has begun. */
JH.REST = 'thisComp.duration - ' + JH.OUTRO;

JH.expr = {};

/* One line of the master text, in the chosen face and size. Display is set in capitals, as the site does. */
JH.expr.lineText = function (style, fmt, i) {
  return JH.lines([
    JH.prelude(style, fmt),
    'var t = ' + i + ' < n ? lines[' + i + '] : "";',
    'if (face == 1) t = t.toUpperCase();',
    'text.sourceText.style.setFont(face == 1 ? "' + JH.FONTS.display + '" : "' + JH.FONTS.sentence + '").setFontSize(size).setTracking(face == 1 ? -2 : -18).setText(t)'
  ]);
};

/*
 * Where line i sits. Lines are CSS line boxes: `lead` tall, the glyphs centred
 * in them, so a block of n lines is n * lead high. Centred places the block in
 * the middle of the frame; bottom left puts the last baseline on the margin.
 * The blur exit scales the whole block around its centre.
 */
JH.expr.linePosition = function (style, fmt, i) {
  return JH.lines([
    JH.prelude(style, fmt),
    JH.exit(),
    'var W = thisComp.width, H = thisComp.height, M = ' + fmt.margin + ';',
    'var top = place == 1 ? (H - n * lead) / 2 : H - M - (face == 1 ? 0 : 0.2 * size) - (n - 1) * lead - pad - asc * size;',
    'var base = top + pad + asc * size + ' + i + ' * lead;',
    'var r = sourceRectAtTime(' + JH.REST + ', false);',
    'var x = place == 1 ? W / 2 - (r.left + r.width / 2) : M;',
    'var cx = place == 1 ? W / 2 : M, cy = top + n * lead / 2;',
    '[cx + (x - cx) * xs, cy + (base - cy) * xs + dy]'
  ]);
};

JH.expr.exitScale = function () {
  return JH.lines([JH.exit(), '[100 * xs, 100 * xs]']);
};

JH.expr.exitOpacity = function (base) {
  return JH.lines([JH.exit(), JH.num(base) + ' * (1 - q)']);
};

JH.expr.exitBlur = function () {
  return JH.lines([JH.exit(), JH.num(4 * JH.BLUR) + ' * q']);
};

JH.expr.textColor = function () {
  return 'thisComp.layer("Controls").effect("Background")(1).value == 4 ? ' + JH.col(JH.HEX.ink) + ' : ' + JH.col(JH.HEX.paper);
};

JH.expr.nibColor = function () {
  return 'thisComp.layer("Controls").effect("Background")(1).value == 4 ? ' + JH.col(JH.HEX.amberDeep) + ' : ' + JH.col(JH.HEX.amber);
};

JH.expr.background = function (k) {
  return 'thisComp.layer("Controls").effect("Background")(1).value == ' + k + ' ? 100 : 0';
};

/* Rise: the line starts one line box (plus the site's 0.06em of padding) lower, and rises in 0.6s, 0.07s after the line above. */
JH.expr.riseOffset = function (style, fmt, i) {
  return JH.lines([
    JH.prelude(style, fmt),
    'var p = Math.min(Math.max((time - ' + i + ' * 0.07) / 0.6, 0), 1);',
    'var y = (lead + 0.06 * size) * Math.pow(1 - p, 4);',
    'value.length == 3 ? [0, y, 0] : [0, y]'
  ]);
};

/*
 * Rise: the line's own box, open above, closed at the bottom of the line box,
 * so the line rises into view from behind it. Once the line has landed the
 * mask opens, as the site reverts its split, so nothing below it is clipped.
 */
JH.expr.riseMask = function (style, fmt, i) {
  return JH.lines([
    JH.prelude(style, fmt),
    'var landed = time >= ' + i + ' * 0.07 + 0.6;',
    'var b = landed ? 8 * size : pad + dsc * size + 0.06 * size;',
    'createPath([[-20000, -8 * size], [20000, -8 * size], [20000, b], [-20000, b]], [], [], true)'
  ]);
};

/* Words: word w (counted across all lines) arrives 0.11s after the one before, over 0.55s. The selector returns how much of the start state is left. */
JH.expr.wordsAmount = function (style, fmt, i) {
  return JH.lines([
    JH.prelude(style, fmt),
    'var before = 0;',
    'for (var j = 0; j < ' + i + ' && j < lines.length; j++) {',
    '  var ws = lines[j].split(/\\s+/);',
    '  for (var u = 0; u < ws.length; u++) if (ws[u] !== "") before++;',
    '}',
    'var p = Math.min(Math.max((time - (before + textIndex - 1) * 0.11) / 0.55, 0), 1);',
    '100 * Math.pow(1 - p, 4)'
  ]);
};

/*
 * Ink: the site paints the line with a gradient 3.5 times its width (text
 * colour to 30%, nib at 40%, clear from 50%) and slides it from 70% to 0%.
 * On a line W wide that is a clear edge travelling from 0 to 1.75W, the nib
 * 0.35W behind it and solid colour 0.7W behind it, over 1.1s, power1.inOut.
 */
JH.inkEdge = function (i) {
  return JH.lines([
    'var r = sourceRectAtTime(' + JH.REST + ', false);',
    'var p = Math.min(Math.max((time - ' + i + ' * 0.1) / 1.1, 0), 1);',
    'var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;',
    'var edge = r.left + 1.75 * r.width * e;'
  ]);
};

JH.expr.inkRampStart = function (i) {
  return JH.lines([JH.inkEdge(i), '[edge - 0.7 * r.width, r.top]']);
};

JH.expr.inkRampEnd = function (i) {
  return JH.lines([JH.inkEdge(i), '[edge - 0.35 * r.width, r.top]']);
};

/* The fade from the nib to clear: a mask edge centred between them, feathered linearly across 0.35W. */
JH.expr.inkMask = function (i) {
  return JH.lines([
    JH.inkEdge(i),
    'var x = edge - 0.175 * r.width;',
    'var y0 = r.top - r.height - 200, y1 = r.top + 2 * r.height + 200;',
    'createPath([[-20000, y0], [x, y0], [x, y1], [-20000, y1]], [], [], true)'
  ]);
};

JH.expr.inkFeather = function () {
  return JH.lines([
    'var r = sourceRectAtTime(' + JH.REST + ', false);',
    '[' + JH.num(0.35 * JH.FEATHER) + ' * r.width, 0]'
  ]);
};

/* Flash: in from 24px to the right over 0.35s, power3.out. */
JH.flashIn = function () {
  return JH.lines([
    'var p = Math.min(Math.max(time / 0.35, 0), 1), e = 1 - Math.pow(1 - p, 4);'
  ]);
};

JH.cardScale = 'Math.pow(2, (thisComp.layer("Controls").effect("Size")(1).value - 50) / 50)';

/* The card grows to fit the longest line, and never gets narrower than the site's 42rem. */
JH.expr.cardWidth = function (fmt) {
  var k = JH.CARDS[fmt.id];
  return JH.lines([
    'function w(n) { return thisComp.layer(n).sourceRectAtTime(0, false).width; }',
    'Math.max(' + k.minW + ', ' + JH.num(2 * k.padX + k.icon + 2 * k.gap) + ' + Math.max(w("Sender"), w("Message")) + w("Time"))'
  ]);
};

JH.expr.cardHeight = function (fmt) {
  var k = JH.CARDS[fmt.id];
  return JH.lines([
    JH.readText('thisComp.layer("Message")', 'msg'),
    'var nl = msg.split(/\\r\\n|\\r|\\n|\\u0003/).length;',
    JH.num(2 * k.padY) + ' + Math.max(' + k.icon + ', ' + JH.num(k.senderLine + k.bodyGap) + ' + nl * ' + k.messageLine + ')'
  ]);
};

JH.expr.cardPosition = function (fmt) {
  return JH.lines([
    'var c = thisComp.layer("Controls");',
    'var sc = ' + JH.cardScale + ';',
    'var cw = c.effect("Card width")(1).value * sc, ch = c.effect("Card height")(1).value * sc;',
    'var W = thisComp.width, H = thisComp.height, M = ' + fmt.margin + ';',
    'var place = c.effect("Placement")(1).value;',
    'var x = place == 1 ? (W - cw) / 2 : M, y = place == 1 ? (H - ch) / 2 : H - M - ch;',
    JH.flashIn(),
    JH.exit(),
    'var cx = x + cw / 2, cy = y + ch / 2;',
    '[cx + (x - cx) * xs + 24 * (1 - e), cy + (y - cy) * xs + dy]'
  ]);
};

JH.expr.cardNullScale = function () {
  return JH.lines([
    'var sc = ' + JH.cardScale + ';',
    JH.exit(),
    '[100 * sc * xs, 100 * sc * xs]'
  ]);
};

JH.expr.cardOpacity = function (base) {
  return JH.lines([JH.flashIn(), JH.exit(), JH.num(base) + ' * e * (1 - q)']);
};

JH.expr.cardSize = function () {
  return 'var c = thisComp.layer("Controls"); [c.effect("Card width")(1).value, c.effect("Card height")(1).value]';
};

JH.expr.cardCentre = function () {
  return 'var c = thisComp.layer("Controls"); [c.effect("Card width")(1).value / 2, c.effect("Card height")(1).value / 2]';
};

/* The one frame of paper border: the first frame the card is visible on. */
JH.flashFrame = 'time > 0.001 && time < thisComp.frameDuration * 1.5';

JH.expr.borderColor = function () {
  return JH.flashFrame + ' ? ' + JH.col(JH.HEX.paper) + ' : ' + JH.col(JH.HEX.lavender);
};

JH.expr.borderOpacity = function () {
  return JH.flashFrame + ' ? 100 : 20';
};

JH.expr.timePosition = function (fmt) {
  var k = JH.CARDS[fmt.id];
  return 'var c = thisComp.layer("Controls"); [c.effect("Card width")(1).value - ' + k.padX + ', ' + JH.num(k.padY + 0.97 * k.time) + ']';
};

/* ------------------------------------------------------------ the build */

JH.build = function () {
  var log = [];
  var errors = [];
  /* In the repository the templates go to public/brand/mogrt. Run on its own,
     anywhere else, they go to a folder next to this script. */
  var here = new File($.fileName).parent;
  var kit = new Folder(here.parent.parent.fsName + "/public/brand");
  var out = kit.exists ? new Folder(kit.fsName + "/mogrt") : new Folder(here.fsName + "/John Heymans templates");

  function say(s) { log.push(s); }

  /* Set JH_QUIET = true before evaluating this file to run without dialogs. */
  var quiet = typeof JH_QUIET !== "undefined" && JH_QUIET;

  function fail(s) {
    $.writeln("John Heymans templates: " + s);
    if (!quiet) alert("John Heymans templates: " + s);
  }

  var writable = 1;
  try { writable = app.preferences.getPrefAsLong("Main Pref Section v2", "Pref_SCRIPTING_FILE_NETWORK_SECURITY"); } catch (e) {}
  if (!writable) {
    fail("switch on Settings > Scripting & Expressions > Allow Scripts to Write Files and Access Network, then run this again.");
    return;
  }

  var missing = [];
  for (var f in JH.FONTS) {
    try {
      if (!app.fonts.getFontsByPostScriptName(JH.FONTS[f]).length) missing.push(JH.FONTS[f]);
    } catch (e) {}
  }
  if (missing.length) {
    fail("install these fonts from public/brand/fonts first: " + missing.join(", "));
    return;
  }

  if (app.project && app.project.dirty) {
    fail("save or close the open project first. This script builds in a new one.");
    return;
  }

  if (!out.exists) out.create();
  app.newProject();
  app.project.expressionEngine = "javascript-1.0";

  /* Property helpers. Adding to a group can invalidate references into it, so everything is looked up again by name. */

  function effects(layer) {
    return layer.property("ADBE Effect Parade");
  }

  function addEffect(layer, matchName, name) {
    var fx = effects(layer).addProperty(matchName);
    fx.name = name;
    return effects(layer).property(name);
  }

  /* The first parameter of an effect whose value is a colour. */
  function colorParam(fx) {
    for (var i = 1; i <= fx.numProperties; i++) {
      if (fx.property(i).propertyValueType === PropertyValueType.COLOR) return fx.property(i);
    }
    return null;
  }

  function slider(layer, name, value) {
    addEffect(layer, "ADBE Slider Control", name);
    var p = effects(layer).property(name).property(1);
    p.setValue(value);
    return p;
  }

  function dropdown(layer, name, items, value) {
    var fx = addEffect(layer, "ADBE Dropdown Control", name);
    fx.property(1).setPropertyParameters(items);
    var p = effects(layer).property(name).property(1);
    p.setValue(value);
    return p;
  }

  function expr(prop, source) {
    prop.expression = source;
    return prop;
  }

  function textLayer(comp, name, str, font, size, hex, justify, tracking, leading) {
    var l = comp.layers.addText(str);
    l.name = name;
    var sp = l.property("ADBE Text Properties").property("ADBE Text Document");
    var d = sp.value;
    d.resetCharStyle();
    d.resetParagraphStyle();
    d.font = font;
    d.fontSize = size;
    d.applyFill = true;
    d.fillColor = JH.rgb(hex);
    d.applyStroke = false;
    d.justification = justify;
    d.tracking = tracking || 0;
    if (leading) {
      d.autoLeading = false;
      d.leading = leading;
    }
    sp.setValue(d);
    return l;
  }

  function sourceText(layer) {
    return layer.property("ADBE Text Properties").property("ADBE Text Document");
  }

  function transform(layer, matchName) {
    return layer.property("ADBE Transform Group").property(matchName);
  }

  function solid(comp, name, hex) {
    return comp.layers.addSolid(JH.rgb(hex), name, comp.width, comp.height, 1);
  }

  function rectShape(x0, y0, x1, y1) {
    var s = new Shape();
    s.vertices = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    s.closed = true;
    return s;
  }

  function addMask(layer, shape) {
    var m = layer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
    m.property("ADBE Mask Shape").setValue(shape);
    return layer.property("ADBE Mask Parade").property(layer.property("ADBE Mask Parade").numProperties);
  }

  function ramp(layer, from, fromHex, to, toHex) {
    var fx = addEffect(layer, "ADBE Ramp", "Ramp");
    fx.property(1).setValue(from);
    fx.property(2).setValue(JH.rgba(fromHex));
    fx.property(3).setValue(to);
    fx.property(4).setValue(JH.rgba(toHex));
    return effects(layer).property("Ramp");
  }

  /* A textAnimator property, found by match name, falling back to its English name. */
  function find(group, matchName, name) {
    var p = null;
    try { p = group.property(matchName); } catch (e) {}
    if (!p && name) {
      try { p = group.property(name); } catch (e2) {}
    }
    return p;
  }

  /* ---- the grounds, shared by all four ---- */

  function grounds(comp) {
    var W = comp.width;
    var H = comp.height;
    var split = Math.round(0.6 * H);
    var scrimAt = Math.round(0.55 * H);

    /* Scrim: rgba(7, 6, 19) at 0.85 at the bottom, 0.35 at 45% up, 0 at the top.
       Two halves, each a grey ramp turned into alpha, then filled with night. */
    var halves = [
      { name: "Scrim, top", box: [0, 0, W, scrimAt], from: [0, scrimAt], a: 0.35, to: [0, 0], b: 0 },
      { name: "Scrim, bottom", box: [0, scrimAt, W, H], from: [0, H], a: 0.85, to: [0, scrimAt], b: 0.35 }
    ];
    for (var i = 0; i < halves.length; i++) {
      var h = halves[i];
      var s = solid(comp, h.name, "ffffff");
      addMask(s, rectShape(h.box[0], h.box[1], h.box[2], h.box[3]));
      var r = addEffect(s, "ADBE Ramp", "Ramp");
      r.property(1).setValue(h.from);
      r.property(2).setValue([h.a, h.a, h.a, 1]);
      r.property(3).setValue(h.to);
      r.property(4).setValue([h.b, h.b, h.b, 1]);
      var sc = addEffect(s, "ADBE Shift Channels", "Alpha from grey");
      sc.property(1).setValue(5);
      var fill = addEffect(s, "ADBE Fill", "Night");
      colorParam(fill).setValue(JH.rgba(JH.HEX.night));
      expr(transform(s, "ADBE Opacity"), JH.expr.background(2));
    }

    /* Night: #070613 to #0b0920 at 60%, then to #151038. */
    var top = solid(comp, "Night, top", JH.HEX.night);
    ramp(top, [0, 0], JH.HEX.night, [0, split], JH.HEX.night60);
    expr(transform(top, "ADBE Opacity"), JH.expr.background(3));
    var low = solid(comp, "Night, bottom", JH.HEX.night60);
    addMask(low, rectShape(0, split, W, H));
    ramp(low, [0, split], JH.HEX.night60, [0, H], JH.HEX.deep);
    expr(transform(low, "ADBE Opacity"), JH.expr.background(3));

    var paper = solid(comp, "Paper", JH.HEX.paper);
    expr(transform(paper, "ADBE Opacity"), JH.expr.background(4));
  }

  function exitBlur(comp) {
    var adj = solid(comp, "Exit blur", "ffffff");
    adj.adjustmentLayer = true;
    var fx = addEffect(adj, "ADBE Gaussian Blur 2", "Blur");
    fx.property(3).setValue(1);
    expr(effects(adj).property("Blur").property(1), JH.expr.exitBlur());
  }

  function controls(comp, style) {
    var s = JH.STYLES[style];
    var c = comp.layers.addNull();
    c.name = "Controls";
    var ui = {};
    if (style !== "flash") ui.type = dropdown(c, "Type", JH.MENUS.type, 1);
    ui.size = slider(c, "Size", 50);
    ui.placement = dropdown(c, "Placement", JH.MENUS.placement, 1);
    ui.background = dropdown(c, "Background", JH.MENUS.background, s.background);
    ui.exit = dropdown(c, "Exit", JH.MENUS.exit, s.exit);
    return { layer: c, ui: ui };
  }

  function protect(comp, intro) {
    var a = new MarkerValue("Reveal");
    a.duration = intro;
    a.protectedRegion = true;
    comp.markerProperty.setValueAtTime(0, a);
    var b = new MarkerValue("Exit");
    b.duration = JH.OUTRO;
    b.protectedRegion = true;
    comp.markerProperty.setValueAtTime(comp.duration - JH.OUTRO, b);
  }

  /* ---- Rise, Words and Ink: one master text, one layer per line ---- */

  function lineComp(style, fmt) {
    var s = JH.STYLES[style];
    var comp = app.project.items.addComp("JH " + s.title + " " + fmt.label, fmt.w, fmt.h, 1, JH.DURATION, JH.FPS);
    var ctl = controls(comp, style);
    grounds(comp);

    for (var i = JH.MAX_LINES - 1; i >= 0; i--) {
      var l = textLayer(comp, "Line " + (i + 1), "Line", JH.FONTS.display, 100, JH.HEX.paper, ParagraphJustification.LEFT_JUSTIFY, -2);
      expr(sourceText(l), JH.expr.lineText(style, fmt, i));
      expr(transform(l, "ADBE Position"), JH.expr.linePosition(style, fmt, i));
      expr(transform(l, "ADBE Scale"), JH.expr.exitScale());
      expr(transform(l, "ADBE Opacity"), JH.expr.exitOpacity(100));

      if (style === "ink") {
        var m = addMask(l, rectShape(-20000, -2000, 20000, 2000));
        m.maskFeatherFalloff = MaskFeatherFalloff.FFO_LINEAR;
        expr(m.property("ADBE Mask Shape"), JH.expr.inkMask(i));
        expr(m.property("ADBE Mask Feather"), JH.expr.inkFeather());
        var r = ramp(l, [0, 0], JH.HEX.paper, [100, 0], JH.HEX.amber);
        expr(r.property(1), JH.expr.inkRampStart(i));
        expr(r.property(2), JH.expr.textColor());
        expr(r.property(3), JH.expr.inkRampEnd(i));
        expr(r.property(4), JH.expr.nibColor());
      } else {
        var fill = addEffect(l, "ADBE Fill", "Colour");
        expr(colorParam(fill), JH.expr.textColor());
      }

      if (style === "rise") {
        var rm = addMask(l, rectShape(-20000, -2000, 20000, 0));
        expr(rm.property("ADBE Mask Shape"), JH.expr.riseMask(style, fmt, i));
        riseAnimator(l, style, fmt, i);
      }
      if (style === "words") wordsAnimator(l, style, fmt, i);
    }

    exitBlur(comp);

    var master = textLayer(comp, "Text", s.text, JH.FONTS.sentence, 60, JH.HEX.paper, ParagraphJustification.LEFT_JUSTIFY, 0);
    master.enabled = false;
    ctl.layer.moveToBeginning();

    comp.openInEssentialGraphics();
    egp(comp, sourceText(master), "Text");
    egp(comp, ctl.ui.type, "Type");
    egp(comp, ctl.ui.size, "Size");
    egp(comp, ctl.ui.placement, "Placement");
    egp(comp, ctl.ui.background, "Background");
    egp(comp, ctl.ui.exit, "Exit");
    protect(comp, s.intro);
    return comp;
  }

  function animators(l) {
    return l.property("ADBE Text Properties").property("ADBE Text Animators");
  }

  function riseAnimator(l, style, fmt, i) {
    var a = animators(l).addProperty("ADBE Text Animator");
    a.name = "Rise";
    var anim = function () { return animators(l).property("Rise"); };
    anim().property("ADBE Text Animator Properties").addProperty("ADBE Text Position 3D");
    anim().property("ADBE Text Selectors").addProperty("ADBE Text Selector");
    expr(anim().property("ADBE Text Animator Properties").property("ADBE Text Position 3D"), JH.expr.riseOffset(style, fmt, i));
  }

  function wordsAnimator(l, style, fmt, i) {
    var more = l.property("ADBE Text Properties").property("ADBE Text More Options");
    more.property("ADBE Text Anchor Point Option").setValue(2);
    more.property("ADBE Text Anchor Point Align").setValue([0, -40]);

    var a = animators(l).addProperty("ADBE Text Animator");
    a.name = "Words";
    var anim = function () { return animators(l).property("Words"); };
    var props = function () { return anim().property("ADBE Text Animator Properties"); };
    props().addProperty("ADBE Text Opacity");
    props().addProperty("ADBE Text Scale 3D");
    props().addProperty("ADBE Text Blur");
    props().property("ADBE Text Opacity").setValue(0);
    var scale = props().property("ADBE Text Scale 3D");
    try { scale.setValue([112, 112, 100]); } catch (e) { scale.setValue([112, 112]); }
    props().property("ADBE Text Blur").setValue([10 * JH.BLUR, 10 * JH.BLUR]);

    anim().property("ADBE Text Selectors").addProperty("ADBE Text Expressible Selector");
    var sel = function () { return anim().property("ADBE Text Selectors").property(1); };
    var basedOn = find(sel(), "ADBE Text Range Type2", "Based On");
    if (basedOn) basedOn.setValue(3);
    else errors.push(l.name + ": could not set the words selector to words");
    expr(find(sel(), "ADBE Text Expressible Amount", "Amount"), JH.expr.wordsAmount(style, fmt, i));
  }

  /* ---- Flash: the notification card ---- */

  function flashComp(fmt) {
    var s = JH.STYLES.flash;
    var k = JH.CARDS[fmt.id];
    var comp = app.project.items.addComp("JH " + s.title + " " + fmt.label, fmt.w, fmt.h, 1, JH.DURATION, JH.FPS);
    var ctl = controls(comp, "flash");
    grounds(comp);

    /* Layout, measured once and read by everything on the card. */
    expr(slider(ctl.layer, "Card width", k.minW), JH.expr.cardWidth(fmt));
    expr(slider(ctl.layer, "Card height", 2 * k.padY + k.icon), JH.expr.cardHeight(fmt));

    var anchor = comp.layers.addNull();
    anchor.name = "Card position";
    transform(anchor, "ADBE Anchor Point").setValue([0, 0]);

    var card = comp.layers.addShape();
    card.name = "Card";
    var group = card.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    group.name = "Box";
    var box = function () { return card.property("ADBE Root Vectors Group").property("Box").property("ADBE Vectors Group"); };
    box().addProperty("ADBE Vector Shape - Rect");
    box().addProperty("ADBE Vector Graphic - Stroke");
    box().addProperty("ADBE Vector Graphic - Fill");
    var rect = function () { return box().property("ADBE Vector Shape - Rect"); };
    expr(rect().property("ADBE Vector Rect Size"), JH.expr.cardSize());
    expr(rect().property("ADBE Vector Rect Position"), JH.expr.cardCentre());
    rect().property("ADBE Vector Rect Roundness").setValue(k.radius);
    var fill = box().property("ADBE Vector Graphic - Fill");
    fill.property("ADBE Vector Fill Color").setValue(JH.rgba(JH.HEX.card));
    fill.property("ADBE Vector Fill Opacity").setValue(94);
    var stroke = box().property("ADBE Vector Graphic - Stroke");
    stroke.property("ADBE Vector Stroke Width").setValue(1);
    expr(stroke.property("ADBE Vector Stroke Color"), JH.expr.borderColor());
    expr(stroke.property("ADBE Vector Stroke Opacity"), JH.expr.borderOpacity());
    var shadow = addEffect(card, "ADBE Drop Shadow", "Shadow");
    shadow.property(1).setValue([0, 0, 0, 1]);
    var op = shadow.property(2);
    op.setValue(op.hasMax && op.maxValue > 100 ? 0.6 * 255 : 60);
    shadow.property(3).setValue(180);
    shadow.property(4).setValue(20);
    shadow.property(5).setValue(60);

    var icon = comp.layers.addShape();
    icon.name = "Icon";
    var ig = icon.property("ADBE Root Vectors Group").addProperty("ADBE Vector Group");
    ig.name = "Circle";
    var circle = function () { return icon.property("ADBE Root Vectors Group").property("Circle").property("ADBE Vectors Group"); };
    circle().addProperty("ADBE Vector Shape - Ellipse");
    circle().addProperty("ADBE Vector Graphic - Fill");
    circle().property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Size").setValue([k.icon, k.icon]);
    circle().property("ADBE Vector Shape - Ellipse").property("ADBE Vector Ellipse Position").setValue([k.padX + k.icon / 2, k.padY + k.icon / 2]);
    circle().property("ADBE Vector Graphic - Fill").property("ADBE Vector Fill Color").setValue(JH.rgba(JH.HEX.violet));

    var textX = k.padX + k.icon + k.gap;
    var initial = textLayer(comp, "Initial", s.initial, JH.FONTS.semibold, k.initial, JH.HEX.paper, ParagraphJustification.CENTER_JUSTIFY, 0);
    var sender = textLayer(comp, "Sender", s.sender, JH.FONTS.semibold, k.sender, JH.HEX.paper, ParagraphJustification.LEFT_JUSTIFY, 0);
    var message = textLayer(comp, "Message", s.message, JH.FONTS.regular, k.message, JH.HEX.paper, ParagraphJustification.LEFT_JUSTIFY, -10, k.messageLine);
    var clock = textLayer(comp, "Time", s.time, JH.FONTS.regular, k.time, JH.HEX.paper, ParagraphJustification.RIGHT_JUSTIFY, 0);

    var parts = [card, icon, initial, sender, message, clock];
    for (var i = 0; i < parts.length; i++) parts[i].parent = anchor;
    transform(card, "ADBE Position").setValue([0, 0]);
    transform(card, "ADBE Anchor Point").setValue([0, 0]);
    transform(icon, "ADBE Position").setValue([0, 0]);
    transform(icon, "ADBE Anchor Point").setValue([0, 0]);
    transform(initial, "ADBE Position").setValue([k.padX + k.icon / 2, k.padY + k.icon / 2 + 0.36 * k.initial]);
    transform(sender, "ADBE Position").setValue([textX, k.padY + (k.senderLine - 1.22 * k.sender) / 2 + 0.97 * k.sender]);
    transform(message, "ADBE Position").setValue([textX, k.padY + k.senderLine + k.bodyGap + (k.messageLine - 1.22 * k.message) / 2 + 0.97 * k.message]);
    expr(transform(clock, "ADBE Position"), JH.expr.timePosition(fmt));

    for (var j = 0; j < parts.length; j++) {
      expr(transform(parts[j], "ADBE Opacity"), JH.expr.cardOpacity(parts[j] === clock ? 72 : 100));
    }
    expr(transform(anchor, "ADBE Position"), JH.expr.cardPosition(fmt));
    expr(transform(anchor, "ADBE Scale"), JH.expr.cardNullScale());

    exitBlur(comp);
    ctl.layer.moveToBeginning();

    comp.openInEssentialGraphics();
    egp(comp, sourceText(sender), "Sender");
    egp(comp, sourceText(message), "Message");
    egp(comp, sourceText(clock), "Time");
    egp(comp, sourceText(initial), "Initial");
    egp(comp, ctl.ui.size, "Size");
    egp(comp, ctl.ui.placement, "Placement");
    egp(comp, ctl.ui.background, "Background");
    egp(comp, ctl.ui.exit, "Exit");
    protect(comp, s.intro);
    return comp;
  }

  function egp(comp, prop, name) {
    var ok = false;
    try { ok = prop.addToMotionGraphicsTemplateAs(comp, name); } catch (e) {}
    if (!ok) errors.push(comp.name + ": could not add " + name + " to Essential Graphics");
  }

  /* Evaluate every expression once and collect the ones that fail. */
  function check(comp) {
    function walk(group, layer) {
      for (var i = 1; i <= group.numProperties; i++) {
        var p = group.property(i);
        if (p.propertyType === PropertyType.PROPERTY) {
          if (p.canSetExpression && p.expression !== "") {
            try { p.valueAtTime(JH.STYLES.words.intro, false); } catch (e) {}
            if (p.expressionError) errors.push(comp.name + " / " + layer.name + " / " + p.name + ": " + p.expressionError);
          }
        } else {
          walk(p, layer);
        }
      }
    }
    for (var i = 1; i <= comp.numLayers; i++) walk(comp.layer(i), comp.layer(i));
  }

  var order = ["rise", "words", "ink", "flash"];
  for (var o = 0; o < order.length; o++) {
    for (var q = 0; q < JH.FORMATS.length; q++) {
      var style = order[o];
      var fmt = JH.FORMATS[q];
      var comp = style === "flash" ? flashComp(fmt) : lineComp(style, fmt);
      comp.motionGraphicsTemplateName = "John Heymans " + JH.STYLES[style].title + " " + fmt.label;
      comp.time = JH.STYLES[style].intro + 0.5;
      check(comp);
      var file = new File(out.fsName + "/" + style + "-" + fmt.id + ".mogrt");
      var ok = false;
      try { ok = comp.exportAsMotionGraphicsTemplate(true, file.fsName); } catch (e) { errors.push(comp.name + ": " + e.toString()); }
      say((ok ? "exported " : "FAILED ") + file.name);
    }
  }

  app.project.save(new File(out.fsName + "/john-heymans-text-motion.aep"));
  say("saved john-heymans-text-motion.aep");

  var report = new File(out.fsName + "/build-log.txt");
  report.encoding = "UTF-8";
  report.open("w");
  report.write(log.join("\n") + "\n\n" + (errors.length ? "Problems:\n" + errors.join("\n") : "No expression errors.") + "\n");
  report.close();
  if (!quiet) alert("John Heymans templates: " + log.length + " steps, " + errors.length + " problems. See " + report.fsName);
};

if (typeof app !== "undefined" && typeof app.project !== "undefined") JH.build();
