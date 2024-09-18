
function choosebodyBgColor(color) {
  document.body.style.backgroundColor = color;
}
function print(args) {
  console.log('output : ', args);
}

function getRandomFont() {
  var fonts = [
    "Arial, sans-serif",
    "Times New Roman, serif",
    "Courier New, monospace",
    "Georgia, serif",
    "Helvetica, sans-serif",
    "Palatino, serif",
    "Tahoma, sans-serif",
    "Geneva, sans-serif",
    "Comic Sans MS, cursive",
    "Impact, sans-serif",
    "Verdana, sans-serif",
    "Garamond, serif",
    "Lucida Console, monospace",
    "Arial Black, sans-serif",
    "Book Antiqua, serif",
    "Century Gothic, sans-serif",
    "Courier, monospace",
    "Franklin Gothic Medium, sans-serif",
    "MS Sans Serif, sans-serif",
    "MS Serif, serif",
    "Trebuchet MS, sans-serif",
    "Arial Narrow, sans-serif",
    "Baskerville, serif",
    "Futura, sans-serif",
    "Helvetica Neue, sans-serif",
    "Lucida Sans Unicode, sans-serif",
    "Rockwell, serif",
    "Segoe UI, sans-serif",
    "Arial Rounded MT Bold, sans-serif",
    "Calibri, sans-serif",
    "Candara, sans-serif",
    "Constantia, serif",
    "Corbel, sans-serif",
    "Palatino Linotype, serif",
    "Times, serif",
    "Arial Unicode MS, sans-serif",
    "Bodoni MT, serif",
    "Century Schoolbook, serif",
    "Consolas, monospace",
    "Didot, serif",
    "Gill Sans, sans-serif",
    "Myriad Pro, sans-serif",
    "Optima, sans-serif",
    "Perpetua, serif",
    "Verdana Pro, sans-serif"
  ];

  var randomIndex = Math.floor(Math.random() * fonts.length);
  return fonts[randomIndex];
}

function randombodyBgColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  const promptColor = Math.floor(Math.random() * 16777215).toString(16);
  const outputColor = `hsl(${Math.random() * 360}, 100%, 75%)`; //Math.floor(Math.random()*16777).toString(16);
  print(outputColor);
  const inputColor = Math.floor(Math.random() * 16777215).toString(16);
  terminal.style.backgroundColor = "#000" ;//+ randomColor;
  promptc.style.color = '#' + promptColor;
  storeItem('termcolor', randomColor);
  storeItem('prompt', promptColor);
  output.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  storeItem('outputcolor', outputColor);
  input.style.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  storeItem('inputcolor', inputColor);
  increaseFont.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  decreaseFont.style.backgroundColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

  output.style.fontFamily = getRandomFont();

  var randomFont = getRandomFont();
  console.log("Randomly selected font:", randomFont);
}

function setFontSize(a) {
  localStorage.setItem('font', a);
  speed_input.value = a;
  document.body.style.fontSize = a + 'px';
  if (/\d+/.test(a.value)) {
    if ((range_font_size.min < 10) || (range_font_size.max > 30)) return
    speed_input.value = a;
    localStorage.setItem('font', a)
    //document.body.style.fontSize = a + 'px';
  }
  if (nav_speed_input !== undefined) {
    nav_speed_input.value = a;
  }
}
function showpass() {
  if (id_password1.type === "password") {
    id_password1.type = "text";
  } else {
    id_password1.type = "password";
  }
}
function setDefaultsFontStyle() {
  try {
    const savedFont = localStorage.getItem('selectedFont');
    document.body.style.fontFamily = savedFont;
  } catch (error) {
    console.log(error.message, error.onLine)
  }
}

function testing() {
  console.log('loadfile is working when calling');
}
function greet(name) {
  console.log('Hello, ' + name + '!');
}

function storeItem(title, data) {
  localStorage.setItem(title, data);
}

function getStoreItem(title) {
  return localStorage.getItem(title);
}

