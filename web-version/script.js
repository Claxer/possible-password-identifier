"use strict";

const MAX_RESULTS = 100000;
const DISPLAY_LIMIT = 1000;

const PRESETS = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    digits: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?",
    alnum: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    all: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+"
};

const $ = (id) => document.getElementById(id);

const elements = {
    preset: $("preset"),
    characters: $("characters"),
    minLength: $("min-length"),
    maxLength: $("max-length"),
    repeats: $("repeats"),
    generate: $("generate-btn"),
    stop: $("stop-btn"),
    total: $("stat-total"),
    characterCount: $("stat-characters"),
    generated: $("stat-generated"),
    progressLabel: $("progress-label"),
    progressPercent: $("progress-percent"),
    progressBar: $("progress-bar"),
    resultCounter: $("result-counter"),
    search: $("search-results"),
    results: $("results-list"),
    showingCount: $("showing-count"),
    copyVisible: $("copy-visible-btn"),
    export: $("export-btn"),
    toast: $("toast")
};

let results = [];
let generationRunning = false;
let cancelGeneration = false;
let toastTimeout = null;
let toastMessage = "";

/* -------------------- GENERAL HELPERS -------------------- */

function showToast(message) {
    toastMessage = message;
    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 2500);
}

function uniqueCharacters(value) {
    return [...new Set(value)];
}

function getCharacters() {
    return uniqueCharacters(elements.characters.value);
}

function formatNumber(number) {
    return Number(number).toLocaleString("en-US");
}

function calculateTotal(characters, minimum, maximum, allowRepeats) {
    const alphabetSize = characters.length;
    let total = 0;

    for (let length = minimum; length <= maximum; length++) {
        if (!allowRepeats && length > alphabetSize) {
            continue;
        }

        let count = 1;

        for (let i = 0; i < length; i++) {
            count *= allowRepeats ? alphabetSize : alphabetSize - i;
        }

        total += count;
    }

    return total;
}

function getSettings() {
    const characters = getCharacters();
    const minimum = Number(elements.minLength.value);
    const maximum = Number(elements.maxLength.value);
    const allowRepeats = elements.repeats.checked;

    if (characters.length === 0) {
        throw new Error("Enter at least one character.");
    }

    if (characters.length > 100) {
        throw new Error("Use no more than 100 unique characters.");
    }

    if (
        !Number.isInteger(minimum) ||
        !Number.isInteger(maximum) ||
        minimum < 1 ||
        maximum > 12 ||
        minimum > maximum
    ) {
        throw new Error("Enter valid lengths from 1 to 12, with minimum no greater than maximum.");
    }

    if (!allowRepeats && minimum > characters.length) {
        throw new Error("Without repetition, the minimum length cannot exceed the number of unique characters.");
    }

    return {
        characters,
        minimum,
        maximum,
        allowRepeats
    };
}

function updateStatistics() {
    try {
        const settings = getSettings();

        const total = calculateTotal(
            settings.characters,
            settings.minimum,
            settings.maximum,
            settings.allowRepeats
        );

        elements.characterCount.textContent =
            formatNumber(settings.characters.length);

        elements.total.textContent = formatNumber(total);

    } catch {
        elements.characterCount.textContent = "—";
        elements.total.textContent = "—";
    }
}

/* -------------------- PRESET SETTINGS -------------------- */

function updatePreset() {
    const preset = elements.preset.value;

    if (preset !== "custom") {
        elements.characters.value = PRESETS[preset];
    }

    updateStatistics();
}

elements.preset.addEventListener("change", updatePreset);

elements.characters.addEventListener("input", () => {
    elements.preset.value = "custom";
    updateStatistics();
});

elements.minLength.addEventListener("input", updateStatistics);
elements.maxLength.addEventListener("input", updateStatistics);
elements.repeats.addEventListener("change", updateStatistics);

/* -------------------- COMBINATION GENERATOR -------------------- */

// This generator creates combinations in batches rather than building
// a huge array before the browser can respond.

function* generateForLength(characters, length, allowRepeats) {
    const current = [];

    function* build() {
        if (current.length === length) {
            yield current.join("");
            return;
        }

        for (const character of characters) {
            if (cancelGeneration) {
                return;
            }

            if (!allowRepeats && current.includes(character)) {
                continue;
            }

            current.push(character);
            yield* build();
            current.pop();
        }
    }

    yield* build();
}

function nextFrame() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

async function generateResults() {
    if (generationRunning) {
        return;
    }

    let settings;

    try {
        settings = getSettings();
    } catch (error) {
        showToast(error.message);
        return;
    }

    const total = calculateTotal(
        settings.characters,
        settings.minimum,
        settings.maximum,
        settings.allowRepeats
    );

    if (total > MAX_RESULTS) {
        showToast(
            `Too many results (${formatNumber(total)}). The limit is ${formatNumber(MAX_RESULTS)}.`
        );
        return;
    }

    if (total === 0) {
        showToast("No combinations can be generated with these settings.");
        return;
    }

    generationRunning = true;
    cancelGeneration = false;
    results = [];

    elements.generate.disabled = true;
    elements.stop.disabled = false;
    elements.export.disabled = true;
    elements.copyVisible.disabled = true;
    elements.search.value = "";

    elements.results.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">...</div>
            <h3>Generating combinations</h3>
            <p>Please wait while results are created.</p>
        </div>
    `;

    elements.progressBar.style.width = "0%";
    elements.progressPercent.textContent = "0%";
    elements.progressLabel.textContent = "Starting...";
    updateResultDisplay();

    let completed = 0;
    let lastRender = 0;

    try {
        for (
            let length = settings.minimum;
            length <= settings.maximum;
            length++
        ) {
            if (cancelGeneration) {
                break;
            }

            if (!settings.allowRepeats && length > settings.characters.length) {
                continue;
            }

            const generator = generateForLength(
                settings.characters,
                length,
                settings.allowRepeats
            );

            for (const combination of generator) {
                if (cancelGeneration) {
                    break;
                }

                results.push(combination);
                completed++;

                const now = performance.now();

                if (now - lastRender >= 35 || completed === total) {
                    const percentage = Math.floor(completed / total * 100);

                    elements.progressBar.style.width = `${percentage}%`;
                    elements.progressPercent.textContent = `${percentage}%`;
                    elements.progressLabel.textContent =
                        `Generated ${formatNumber(completed)} of ${formatNumber(total)}`;

                    updateResultDisplay();
                    lastRender = now;

                    await nextFrame();
                }
            }
        }

        updateResultDisplay();

        if (cancelGeneration) {
            elements.progressLabel.textContent = "Generation stopped";
            showToast(`Stopped. ${formatNumber(results.length)} results retained.`);
        } else {
            elements.progressBar.style.width = "100%";
            elements.progressPercent.textContent = "100%";
            elements.progressLabel.textContent = "Generation complete";
            showToast(`Generated ${formatNumber(results.length)} combinations.`);
        }

    } catch (error) {
        console.error(error);
        showToast("An error occurred during generation.");
        elements.progressLabel.textContent = "Generation interrupted";

    } finally {
        generationRunning = false;
        elements.generate.disabled = false;
        elements.stop.disabled = true;
        elements.export.disabled = results.length === 0;
        elements.copyVisible.disabled = results.length === 0;

        updateResultDisplay();
    }
}

elements.generate.addEventListener("click", generateResults);

elements.stop.addEventListener("click", () => {
    if (generationRunning) {
        cancelGeneration = true;
        elements.stop.disabled = true;
        elements.progressLabel.textContent = "Stopping...";
    }
});

/* -------------------- RESULTS DISPLAY -------------------- */

function getFilteredResults() {
    const query = elements.search.value.toLocaleLowerCase();

    if (!query) {
        return results;
    }

    return results.filter(item => item.toLocaleLowerCase().includes(query));
}

function updateResultDisplay() {
    const filtered = getFilteredResults();
    const displayed = filtered.slice(0, DISPLAY_LIMIT);

    elements.resultCounter.textContent =
        `${formatNumber(results.length)} items`;

    elements.generated.textContent = formatNumber(results.length);

    elements.showingCount.textContent =
        `Showing ${formatNumber(displayed.length)} of ${formatNumber(filtered.length)} matching results`;

    if (results.length === 0) {
        elements.results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⌘</div>
                <h3>No results yet</h3>
                <p>Configure your settings and start generating.</p>
            </div>
        `;
        return;
    }

    if (filtered.length === 0) {
        elements.results.innerHTML = `
            <div class="empty-state">
                <h3>No matching results</h3>
                <p>Try another search term.</p>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();

    displayed.forEach(item => {
        const row = document.createElement("div");
        row.className = "result-row";

        const value = document.createElement("span");
        value.textContent = item;

        const copy = document.createElement("button");
        copy.type = "button";
        copy.textContent = "Copy";
        copy.setAttribute("aria-label", `Copy ${item}`);

        copy.addEventListener("click", async () => {
            await copyText(item);
        });

        row.append(value, copy);
        fragment.appendChild(row);
    });

    if (filtered.length > DISPLAY_LIMIT) {
        const more = document.createElement("div");
        more.className = "result-row";
        more.textContent =
            `Showing first ${formatNumber(DISPLAY_LIMIT)} matches. Use Export TXT for all results.`;
        fragment.appendChild(more);
    }

    elements.results.replaceChildren(fragment);
}

elements.search.addEventListener("input", updateResultDisplay);

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();

            const successful = document.execCommand("copy");
            textarea.remove();

            if (!successful) {
                throw new Error("Copy failed");
            }
        }

        showToast("Copied to clipboard.");
    } catch {
        showToast("Copy failed. Try opening the app in a browser with clipboard access.");
    }
}

elements.copyVisible.addEventListener("click", async () => {
    const filtered = getFilteredResults();

    if (filtered.length === 0) {
        showToast("There are no results to copy.");
        return;
    }

    await copyText(filtered.join("\n"));
});

/* -------------------- TEXT FILE EXPORT -------------------- */

elements.export.addEventListener("click", () => {
    if (results.length === 0) {
        showToast("Generate some results first.");
        return;
    }

    const lines = [
        "POSSIBLE PASSWORD IDENTIFIER",
        `Exported: ${new Date().toLocaleString()}`,
        `Total results: ${results.length}`,
        "Educational character combinations",
        "-".repeat(40),
        ...results
    ];

    const blob = new Blob(
        [lines.join("\n")],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `possible_combinations_${Date.now()}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
    showToast("Text file export started.");
});

/* -------------------- NAVIGATION -------------------- */

const pageTitles = {
    generator: "Combination Generator",
    analyzer: "Text Analyzer",
    about: "About the Project"
};

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        const view = button.dataset.view;

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        document.querySelectorAll(".view").forEach(section => {
            section.classList.toggle(
                "active",
                section.id === `${view}-view`
            );
        });

        $("page-title").textContent = pageTitles[view];
    });
});

/* -------------------- SAMPLE TEXT ANALYZER -------------------- */

function analyzeSample() {
    const sample = $("sample-text").value;

    if (!sample.length) {
        showToast("Enter sample text first.");
        return;
    }

    const characters = [...sample];
    const letters = characters.filter(c => /\p{L}/u.test(c)).length;
    const digits = characters.filter(c => /\p{N}/u.test(c)).length;
    const whitespace = characters.filter(c => /\s/u.test(c)).length;
    const symbols = characters.filter(
        c => !/[\p{L}\p{N}\s]/u.test(c)
    ).length;

    const uppercase = characters.filter(c => c.toUpperCase() === c && c.toLowerCase() !== c).length;
    const lowercase = characters.filter(c => c.toLowerCase() === c && c.toUpperCase() !== c).length;

    let poolSize = 0;

    if (characters.some(c => /[a-z]/.test(c))) poolSize += 26;
    if (characters.some(c => /[A-Z]/.test(c))) poolSize += 26;
    if (characters.some(c => /[0-9]/.test(c))) poolSize += 10;
    if (characters.some(c => /[^a-zA-Z0-9\s]/u.test(c))) poolSize += 32;

    const entropy = poolSize > 0
        ? characters.length * Math.log2(poolSize)
        : 0;

    const analysisItems = [
        ["Character length", characters.length],
        ["Unique characters", new Set(characters).size],
        ["Letters", letters],
        ["Digits", digits],
        ["Symbols", symbols],
        ["Whitespace", whitespace],
        ["Uppercase", uppercase],
        ["Lowercase", lowercase],
        ["Illustrative entropy", `${entropy.toFixed(2)} bits`]
    ];

    const container = $("analysis-results");
    const grid = document.createElement("div");
    grid.className = "analysis-grid";

    analysisItems.forEach(([label, value]) => {
        const item = document.createElement("div");
        item.className = "analysis-item";

        const title = document.createElement("span");
        title.textContent = label;

        const number = document.createElement("strong");
        number.textContent = value;

        item.append(title, number);
        grid.appendChild(item);
    });

    const note = document.createElement("p");
    note.className = "field-note";
    note.style.marginTop = "15px";
    note.textContent =
        "Entropy is a rough theoretical estimate based on character categories and length. It assumes a uniformly random selection process and may not represent real-world password strength.";

    container.replaceChildren(grid, note);
}

$("analyze-btn").addEventListener("click", analyzeSample);

/* -------------------- INITIALIZATION -------------------- */

updatePreset();
updateStatistics();
updateResultDisplay();
