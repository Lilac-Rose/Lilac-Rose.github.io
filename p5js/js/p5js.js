let editor;
let sketch;

function setup() {
  const canvas = createCanvas(500, 500);
  canvas.parent('sketch-holder');
}

document.getElementById('run-sketch').addEventListener('click', () => {
  const code = document.getElementById('code-editor').value;
  try {
    eval(code);
  } catch (err) {
    console.error(err);
  }
});

document.getElementById('clear-sketch').addEventListener('click', () => {
  clear();
});
