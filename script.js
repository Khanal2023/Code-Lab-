const htmlEditor = document.getElementById('html-code');
const cssEditor = document.getElementById('css-code');
const jsEditor = document.getElementById('js-code');
const outputFrame = document.getElementById('output');
const runButton = document.getElementById('run-btn');
const clearButton = document.getElementById('clear-btn');
const refreshButton = document.getElementById('refresh-btn');
const statusText = document.getElementById('status-text');
const saveNote = document.getElementById('save-note');

const starterCode = {
  html: `<main class="card">
  <p class="tag">MY FIRST PROJECT</p>
  <h1>Hello, I am Devendra.</h1>
  <p>I enjoy building useful tools for operations and everyday work.</p>
  <button id="hello-btn">Say hello</button>
</main>`,
  css: `* { box-sizing: border-box; }

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #f5f0f8;
  font-family: Arial, sans-serif;
  color: #231a29;
}

.card {
  width: min(520px, 100%);
  padding: 36px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(49, 22, 61, 0.12);
}

.tag {
  color: #65028f;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.4px;
}

h1 { margin: 10px 0; }
p { line-height: 1.6; }

button {
  margin-top: 12px;
  padding: 11px 18px;
  border: 0;
  border-radius: 9px;
  background: #65028f;
  color: white;
  font-weight: bold;
  cursor: pointer;
}`,
  js: `const button = document.getElementById('hello-btn');

button.addEventListener('click', () => {
  button.textContent = 'Thanks for visiting!';
});`
};

function loadSavedCode() {
  htmlEditor.value = localStorage.getItem('devendra-code-lab-html') ?? starterCode.html;
  cssEditor.value = localStorage.getItem('devendra-code-lab-css') ?? starterCode.css;
  jsEditor.value = localStorage.getItem('devendra-code-lab-js') ?? starterCode.js;
}

function saveCode() {
  localStorage.setItem('devendra-code-lab-html', htmlEditor.value);
  localStorage.setItem('devendra-code-lab-css', cssEditor.value);
  localStorage.setItem('devendra-code-lab-js', jsEditor.value);

  saveNote.textContent = 'Saved locally';
  clearTimeout(saveCode.noteTimer);
  saveCode.noteTimer = setTimeout(() => {
    saveNote.textContent = 'Auto-save is on';
  }, 1300);
}

function buildPreviewDocument() {
  const safeJavaScript = jsEditor.value.replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${cssEditor.value}</style>
</head>
<body>
  ${htmlEditor.value}
  <script>
    window.onerror = function(message, source, line) {
      document.body.insertAdjacentHTML('beforeend', '<pre style="margin:16px;padding:12px;border-radius:8px;background:#fff0f0;color:#a40000;font-family:monospace;white-space:pre-wrap">JavaScript error on line ' + line + ': ' + message + '</pre>');
    };
    ${safeJavaScript}
  <\/script>
</body>
</html>`;
}

function runCode() {
  statusText.innerHTML = '<span class="status-dot"></span> Running';
  outputFrame.srcdoc = buildPreviewDocument();
  saveCode();

  setTimeout(() => {
    statusText.innerHTML = '<span class="status-dot"></span> Preview updated';
  }, 250);
}

function clearEditors() {
  const shouldClear = window.confirm('Clear all three editors? Your saved code will also be removed.');
  if (!shouldClear) return;

  htmlEditor.value = '';
  cssEditor.value = '';
  jsEditor.value = '';
  localStorage.removeItem('devendra-code-lab-html');
  localStorage.removeItem('devendra-code-lab-css');
  localStorage.removeItem('devendra-code-lab-js');
  outputFrame.srcdoc = '<!DOCTYPE html><html><body></body></html>';
  saveNote.textContent = 'Editors cleared';
  htmlEditor.focus();
}

function insertTab(event) {
  if (event.key !== 'Tab') return;

  event.preventDefault();
  const editor = event.currentTarget;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  editor.value = `${editor.value.slice(0, start)}  ${editor.value.slice(end)}`;
  editor.selectionStart = editor.selectionEnd = start + 2;
  saveCode();
}

function setupResponsiveTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.code-editor');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });
      panels.forEach((panel) => panel.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.dataset.editor).classList.add('active');
    });
  });
}

[htmlEditor, cssEditor, jsEditor].forEach((editor) => {
  editor.addEventListener('input', saveCode);
  editor.addEventListener('keydown', insertTab);
});

runButton.addEventListener('click', runCode);
refreshButton.addEventListener('click', runCode);
clearButton.addEventListener('click', clearEditors);

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runCode();
  }
});

loadSavedCode();
setupResponsiveTabs();
runCode();
