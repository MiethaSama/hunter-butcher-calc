let calcCurrent = '';

function getCalcDisplay() {
    return document.getElementById('calcDisplay');
}

function updateCalcDisplay() {
    const display = getCalcDisplay();
    if (display) {
        display.innerText = calcCurrent || '0';
    }
}

function appendCalc(val) {
    if (calcCurrent === 'Hata') calcCurrent = '';
    calcCurrent += val;
    updateCalcDisplay();
}

function clearCalc() {
    calcCurrent = '';
    updateCalcDisplay();
}

function deleteCalc() {
    if (calcCurrent === 'Hata') {
        calcCurrent = '';
    } else {
        calcCurrent = calcCurrent.slice(0, -1);
    }
    updateCalcDisplay();
}

function calculateCalc() {
    try {
        if (calcCurrent) {
            calcCurrent = String(eval(calcCurrent.replace(/[^-()\d/*+.]/g, '')));
            if (calcCurrent === 'Infinity' || calcCurrent === 'NaN') {
                calcCurrent = 'Hata';
            }
        }
    } catch (e) {
        calcCurrent = 'Hata';
    }
    updateCalcDisplay();
}

window.appendCalc = appendCalc;
window.clearCalc = clearCalc;
window.deleteCalc = deleteCalc;
window.calculateCalc = calculateCalc;