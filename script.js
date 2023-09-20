// Import the AssemblyScript module
import { getItems, addItem, removeItem, clearItems, spinWheel, initialize } from "./build/release.js";

// Initialize the WebAssembly module
initialize();

// DOM elements
const itemList = document.getElementById("item-list");
const itemInput = document.getElementById("item-input");
const addButton = document.getElementById("add-button");
const clearButton = document.getElementById("clear-button");
const spinButton = document.getElementById("spin-button");
const wheelCanvas = document.getElementById("wheel");
const resultElement = document.getElementById("result");

// Wheel colours
const fillColors = ["#4CB5AE", "#70C9B5", "#94DDBC", "#B8F1C3", "#DCFFCA", "#B8F1C3", "#94DDBC", "#70C9B5", "#94DDBC"];

// Event listeners
addButton.addEventListener("click", () => {
    const item = itemInput.value.trim();
    if (item !== "") {
        addItem(item);
        itemInput.value = "";
        updateItemList();
    }
});

clearButton.addEventListener("click", () => {
    clearItems();
    updateItemList();
});

spinButton.addEventListener("click", () => {
    if (getItems().length === 0) {
        resultElement.innerHTML = "Add some items first!";
        return;
    }

    animateWheel();

    resultElement.innerHTML = "Spinning...";

    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
        button.disabled = true;
    }

    setTimeout(() => {
        const result = spinWheel();
        resultElement.innerHTML = result;
        for (const button of buttons) {
            button.disabled = false;
        }
    }, 1500);

});

// Function to update the item list in the DOM with the list items
// Give each item a delete button and a click listener
function updateItemList() {
    const items = getItems();
    itemList.innerHTML = "";
    for (const item of items) {
        const itemElement = document.createElement("li");
        itemElement.innerHTML = item;
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", () => {
            removeItem(item);
            updateItemList();
        });
        itemElement.appendChild(deleteButton);
        itemList.appendChild(itemElement);
    }

    updateWheel();
}

// Function to update the wheel in the DOM
function updateWheel() {
    const items = getItems();
    const ctx = wheelCanvas.getContext("2d");
    const radius = wheelCanvas.width / 2;
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const angle = 2 * Math.PI / items.length;
    ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
    for (let i = 0; i < items.length; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, i * angle, (i + 1) * angle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = fillColors[i % fillColors.length];
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((i + 0.5) * angle);
        ctx.fillStyle = "white";
        ctx.font = `${radius / items[i].length + 5}px sans-serif`
        ctx.textAlign = "center";
        ctx.fillText(items[i], radius * 0.6, 0);
        ctx.restore();
    }
}


// function to animate the wheel spinning
function animateWheel() {
    const items = getItems();
    const ctx = wheelCanvas.getContext("2d");
    const radius = wheelCanvas.width / 2;
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const angle = 2 * Math.PI / items.length;
    const spinAngle = Math.random() * 2 * Math.PI;
    const spinSpeed = 0.1;
    const spinTime = 1000 + Math.random() * 1000;
    const spinStart = Date.now();
    const spinEnd = spinStart + spinTime;
    const spinInterval = setInterval(() => {
        const now = Date.now();
        const spinProgress = (now - spinStart) / spinTime;
        const spinAngleProgress = spinProgress * spinAngle;
        const spinAngleCurrent = spinAngleProgress + spinSpeed * (now - spinStart);
        ctx.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);
        for (let i = 0; i < items.length; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, i * angle + spinAngleCurrent, (i + 1) * angle + spinAngleCurrent);
            ctx.lineTo(centerX, centerY);
            ctx.fillStyle = fillColors[i % fillColors.length];
            ctx.fill();
            ctx.closePath();

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((i + 0.5) * angle + spinAngleCurrent);
            ctx.fillStyle = "white";
            ctx.font = `${radius / items[i].length + 5}px sans-serif`
            ctx.textAlign = "center";
            ctx.fillText(items[i], radius * 0.6, 0);
            ctx.restore();
        }
        if (now >= spinEnd) {
            clearInterval(spinInterval);
        }
    }, 2000 / 60);
}

// Initial item list update
updateItemList();
