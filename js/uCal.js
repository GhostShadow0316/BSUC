// uCal.js

//* GOING TO HACTAGS

for (let elem of document.getElementsByTagName("sSelect")) {

    const changeEvent = new Event("change");
    const lockEvent   = new CustomEvent("lock");

    let current  = +(elem.getAttribute("default"));
    let min_     = +(elem.getAttribute("min") )   ;
    let max_     = +(elem.getAttribute("max") )   ;
    let step_    = +(elem.getAttribute("step"))   ;

    if (min_ >= max_) { [min_, max_] = [max_, min_]; }

    elem.min  = min_ ;
    elem.max  = max_ ;
    elem.step = step_;

    const status = elem.getAttribute("status")
    elem.status = (status !== null) ? +(elem.getAttribute("status")) : 1;
    elem.style["background"] = elem.status ? "#222" : "#000";

    elem.textContent = current;
    elem.value = current;

    elem.addEventListener("mousewheel" , (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!elem.status) { return; }

        elem.style["color"] = "#aaa";

        if (e.wheelDelta < 0) { // up
            current += elem.step;
            if (current > elem.max) { current = elem.max; }
        }
        if (e.wheelDelta > 0) { // down
            current -= elem.step;
            if (current < elem.min) { current = elem.min; }
        }

        elem.textContent = current;
        elem.value = current;
        elem.dispatchEvent(changeEvent);
        setTimeout(() => { elem.style["color"] = "#fff"; }, 500);
    });

    elem.addEventListener("click", (e) => {
        elem.status = !elem.status;
        elem.style["background"] = elem.status ? "#222" : "#000";
        elem.dispatchEvent(lockEvent);
    })

    elem.setValue = (v) => {
        elem.value = v;
        elem.textContent = v;

        elem.dispatchEvent(changeEvent);
    }
}

for (let elem of document.getElementsByTagName("cSelect")) {

    const changeEvent = new Event("change");

    let current = elem.getAttribute("default");
    let cycle   = elem.getAttribute("cycle");
    let tColor  = elem.getAttribute("tColor") || "#0f0";
    let fColor  = elem.getAttribute("fColor") || "#f00";

    if (cycle !== null) {
        elem.textContent = current;
        elem.cycle = cycle.split(",").map((x) => { return x.trim(); })
        idx = elem.cycle.indexOf(current);
        if (idx === -1) { throw `${current} is not in cycle: ${cycle}`; }
        elem.value = elem.cycle[idx];
    } else {
        elem.checkbox = true;
        elem.value = !!+current;

        elem.style["background"] = (elem.value) ? tColor : fColor;
    }

    elem.addEventListener("click", (e) => {
        if (elem.checkbox) {
            elem.value = !elem.value;
            elem.style["background"] = (elem.value) ? tColor : fColor;

        } else {
            idx += 1;
            if (idx > elem.cycle.length - 1) { idx = 0; }
            elem.value = elem.cycle[idx];

            elem.textContent = elem.value;
        }
        elem.dispatchEvent(changeEvent);
    });

    elem.setValue = (v) => {
        if (elem.checkbox) {
            elem.value = ([true, false].includes(!!+v)) ? v : elem.value;
            elem.style["background"] = (elem.value) ? tColor : fColor;
        } else {
            idx = elem.cycle.indexOf(v);
            elem.value = (idx !== -1) ? v : elem.value;
            elem.textContent = elem.value;
        }

        elem.dispatchEvent(changeEvent);
    }
}

//* END

const levels = {
    "1" : [  20,    20],
    "2" : [  35,    30],
    "3" : [  75,    50],
    "4" : [ 140,    80],
    "5" : [ 290,   130],
    "6" : [ 480,   210],
    "7" : [ 800,   340],
    "8" : [1250,   550],
    "9" : [1875,   890],
    "10": [2800,  1440],
    "11": [   0,     0],
}

const levelFrom   = document.getElementById("levelFrom");
const levelTo     = document.getElementById("levelTo");
const gadget      = document.getElementById("gadget");
const starPower   = document.getElementById("starPower");
const gear        = document.getElementById("gear");
const eGear       = document.getElementById("eGear");
const mGear       = document.getElementById("mGear");
const hypercharge = document.getElementById("hypercharge");

const newBtn    = [document.getElementById("new")   , [1,  1, 0, 0, 0, 0, 0, 0]];
const enoughBtn = [document.getElementById("enough"), [1, 10, 1, 1, 2, 0, 0, 0]];
const maxedBtn  = [document.getElementById("maxed") , [1, 11, 2, 2, 6, 1, 1, 1]];

const output = [
    document.getElementById("coin"),
    document.getElementById("pp"),
    document.getElementById("gem"),
];

for (btn of [newBtn, enoughBtn, maxedBtn]) {
    let values = btn[1];
    btn[0].addEventListener("click", () => {
        levelFrom.setValue(values[0]);
        levelTo  .setValue(values[1]);
        gadget   .setValue(values[2]);
        starPower.setValue(values[3]);
        gear .setValue(values[4]);
        eGear.setValue(values[5]);
        mGear.setValue(values[6]);
        hypercharge.setValue(values[7]);
    });
}

levelFrom.addEventListener("change", () => { levelTo.min = levelFrom.value; });
levelTo  .addEventListener("change", () => { levelFrom.max = levelTo.value; });

for (elem of [levelFrom, levelTo, gadget, starPower, gear, eGear, mGear, hypercharge]) {
    elem.addEventListener("change", () => { calculate(); });
}

const calculate = () => {
    let cost = [0, 0];

    cost[0] += gadget.value * 1000;
    cost[0] += starPower.value * 2000;
    cost[0] +=  gear.value * 1000;
    cost[0] += eGear.value * 1500;
    cost[0] += mGear.value * 2000;
    cost[0] += hypercharge.value * 5000;

    for (let l=levelFrom.value; l < levelTo.value; l++) {
        cost = [cost[0] + levels[l][0], cost[1] + levels[l][1]];
    }

    output[0].textContent = cost[0];
    output[1].textContent = cost[1];
    output[2].textContent = `~${Math.ceil((cost[1] * 2 + cost[0]) / 11)}`;
}

calculate();
