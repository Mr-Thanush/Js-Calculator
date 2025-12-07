document.addEventListener("DOMContentLoaded", () => {

    const buttons = document.querySelectorAll("button");
    const display = document.querySelector(".input");
    const historyDis = document.querySelector(".history");
    const equalBtn = document.getElementById("equal");
    const clearAllBtn = document.getElementById("clearAll");
    const clearOneBtn = document.getElementById("clearOne");
    const toggleModeBtn = document.getElementById("toggleMode");
    const historyBtn = document.getElementById("history");

    let history = [];

    /* Load from localStorage */
    let saved = localStorage.getItem("calcHistory");
    if (saved) {
        history = JSON.parse(saved);
        showStoredHistory();
    }

    /* ---------------- BUTTON CLICK INPUT ---------------- */
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {

            const value = btn.getAttribute("data-number");
            if (!value) return;

            if (value === "CL") {
                display.value = "";
                return;
            }
            if (value === "DEL") {
                display.value = display.value.slice(0, -1);
                return;
            }

            display.value += value;
        });
    });

    /* ------------------ = BUTTON ------------------ */
    equalBtn.addEventListener("click", () => {
        let originalExp = display.value;

        try {
            let exp = originalExp.replace(/×/g, "*")
                                 .replace(/÷/g, "/")
                                 .replace(/\^/g, "**");

            let result = new Function("return " + exp)();

            if (isNaN(result)) throw "Invalid";

            display.value = result;

            let item = `${originalExp} = ${result}`;
            history.push(item);
            localStorage.setItem("calcHistory", JSON.stringify(history));

            addHistoryItem(originalExp, result);

        } catch (error) {
            display.value = "Error";
        }
    });

    /* ---------------- DARK MODE ---------------- */
    toggleModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
    });

    /* ---------------- SHOW/HIDE HISTORY ---------------- */
    historyBtn.addEventListener("click", () => {
        historyBtn.classList.toggle("active");
    });

    /* ---------------- ADD ITEM TO HISTORY LIST ---------------- */
    function addHistoryItem(expression, result) {
        const historyList = document.querySelector(".history-list");
        const li = document.createElement("li");

        li.textContent = `${expression} = ${result}`;

        const updBtn = updateBtn(li, expression);
        const delBtn = deleteBtn(li, `${expression} = ${result}`);

        li.appendChild(updBtn);
        li.appendChild(delBtn);
        historyList.appendChild(li);
    }

    /* ---------------- DELETE BUTTON ---------------- */
    function deleteBtn(li, item) {
        const delbtn = document.createElement("button");
        delbtn.textContent = "❌";

        delbtn.addEventListener("click", () => {
            li.remove();
            display.value = "";
            history = history.filter(h => h !== item);
            localStorage.setItem("calcHistory", JSON.stringify(history));
        });

        return delbtn;
    }

    /* ---------------- UPDATE BUTTON ---------------- */
    function updateBtn(li, expression) {
        const updbtn = document.createElement("button");
        updbtn.textContent = "🖋️";

        updbtn.addEventListener("click", () => {
            display.value = expression;
            li.remove();
        });

        return updbtn;
    }

    /* ---------------- LOAD HISTORY ON PAGE LOAD ---------------- */
    function showStoredHistory() {
        history.forEach(item => {
            let [exp, result] = item.split(" = ");
            addHistoryItem(exp, result);
        });
    }

});