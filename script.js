const display = document.getElementById("display");
const historyBox = document.getElementById("history");
const degRadBtn = document.getElementById("degRad");

let expression = "";
let isDegree = true;

/* ---------- Display ---------- */
function updateDisplay() {
    display.value = expression || "0";
}

/* ---------- Input ---------- */
function append(val) {
    expression += val;
    updateDisplay();
}

function clearAll() {
    expression = "";
    updateDisplay();
}

/* ✅ DELETE ONE CHARACTER ONLY */
function backspace() {
    if (expression.length === 0) return;
    expression = expression.slice(0, -1);
    updateDisplay();
}

/* ---------- Functions ---------- */
function applyFunction(fn) {
    if (!expression) return;
    expression = fn === "sqrt"
        ? `√(${expression})`
        : `${fn}(${expression})`;
    updateDisplay();
}

function insertConst(c) {
    expression += (c === "pi") ? "π" : "e";
    updateDisplay();
}

/* ---------- Math ---------- */
function normalizeExpression(expr) {
    let e = expr;

    e = e.replace(/π/g, "Math.PI");
    e = e.replace(/e/g, "Math.E");

    e = e.replace(/(\d+|\))\^(\d+|\()/g, "Math.pow($1,$2)");

    e = e.replace(/√/g, "Math.sqrt");
    e = e.replace(/sin/g, "Math.sin");
    e = e.replace(/cos/g, "Math.cos");
    e = e.replace(/tan/g, "Math.tan");
    e = e.replace(/log/g, "Math.log10");
    e = e.replace(/ln/g, "Math.log");

    if (isDegree) {
        e = e.replace(/Math\.(sin|cos|tan)\(([^)]+)\)/g,
            (_, fn, val) => `Math.${fn}(${val}*Math.PI/180)`
        );
    }
    return e;
}

function calculate() {
    try {
        const result = eval(normalizeExpression(expression));
        historyBox.innerHTML += `<div>${expression} = ${result}</div>`;
        expression = String(result);
        updateDisplay();
    } catch {
        display.value = "Error";
        expression = "";
    }
}

/* ---------- Buttons ---------- */
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
        const val = btn.textContent;

        if (btn.dataset.fn) applyFunction(btn.dataset.fn);
        else if (btn.dataset.const) insertConst(btn.dataset.const);
        else if (btn.dataset.op === "pow") append("^");
        else if (btn.dataset.op === "pow2") append("^2");
        else if (btn.dataset.action === "back") backspace();
        else if (val === "C") clearAll();
        else if (val === "=") calculate();
        else append(val);
    });
});

/* ---------- Keyboard ---------- */
document.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        calculate();
    }
    else if (e.key === "Backspace") {
        e.preventDefault();
        backspace();
    }
    else if ("0123456789+-*/.".includes(e.key)) {
        append(e.key);
    }
});

/* ---------- DEG / RAD ---------- */
degRadBtn.addEventListener("click", () => {
    isDegree = !isDegree;
    degRadBtn.textContent = isDegree ? "DEG" : "RAD";
});

/* ---------- HISTORY CLEAR ON CLICK ---------- */
historyBox.addEventListener("click", () => {
    historyBox.innerHTML = "";
});
