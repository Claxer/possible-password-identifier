const passwordInput = document.getElementById("passwordInput");
const visibilityBtn = document.getElementById("visibilityBtn");
const analyzeBtn = document.getElementById("analyzeBtn");

const characterCount = document.getElementById("characterCount");
const errorMessage = document.getElementById("errorMessage");

const resultsSection = document.getElementById("resultsSection");
const passwordLength = document.getElementById("passwordLength");
const totalPossible = document.getElementById("totalPossible");
const uniqueResults = document.getElementById("uniqueResults");

const formula = document.getElementById("formula");

const passwordList = document.getElementById("passwordList");
const searchInput = document.getElementById("searchInput");
const emptyResults = document.getElementById("emptyResults");

const copyAllBtn = document.getElementById("copyAllBtn");
const downloadBtn = document.getElementById("downloadBtn");

const warningBox = document.getElementById("warningBox");

let generatedPasswords = [];
let generationStopped = false;
let generationFinished = false;


/* ==========================================
   CHARACTER COUNTER
========================================== */

passwordInput.addEventListener("input", function () {
    const length = passwordInput.value.length;

    if (length === 1) {
        characterCount.textContent = "1 character";
    } else {
        characterCount.textContent = length + " characters";
    }
});


/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

visibilityBtn.addEventListener("click", function () {

    if (passwordInput.type === "text") {

        passwordInput.type = "password";
        visibilityBtn.textContent = "◉";

    } else {

        passwordInput.type = "text";
        visibilityBtn.textContent = "◌";

    }

});


/* ==========================================
   FACTORIAL
========================================== */

function factorial(number) {

    let result = 1n;

    for (let i = 2n; i <= BigInt(number); i++) {
        result *= i;
    }

    return result;
}


/* ==========================================
   FORMAT LARGE NUMBERS
========================================== */

function formatNumber(number) {

    const value = number.toString();

    if (value.length > 15) {

        return (
            value.substring(0, 8) +
            "... (" +
            value.length +
            " digits)"
        );

    }

    return Number(number).toLocaleString();
}


/* ==========================================
   CREATE PASSWORD MULTISET
========================================== */

function createCharacterCounts(password) {

    const counts = {};

    for (const character of password) {

        if (counts[character] === undefined) {
            counts[character] = 1;
        } else {
            counts[character]++;
        }

    }

    return counts;
}


/* ==========================================
   CALCULATE UNIQUE PERMUTATIONS
========================================== */

function calculateUniquePermutations(password) {

    const counts =
        createCharacterCounts(password);

    let result =
        factorial(password.length);

    for (const character in counts) {

        result =
            result /
            factorial(counts[character]);

    }

    return result;
}


/* ==========================================
   GENERATION SETTINGS
========================================== */

const DISPLAY_BATCH_SIZE = 100;

const GENERATION_BATCH_SIZE = 500;

let generationTimer = null;


/* ==========================================
   PROGRESSIVE PERMUTATION GENERATOR
========================================== */

function generatePermutationsProgressively(password) {

    generationStopped = false;
    generationFinished = false;

    generatedPasswords = [];

    passwordList.innerHTML = "";

    emptyResults.classList.add("hidden");

    const characters =
        createCharacterCounts(password);

    const keys =
        Object.keys(characters);

    const length =
        password.length;

    let generatedCount = 0;

    let displayBuffer = [];

    let currentIndex = 0;

    function generate(currentPassword, remaining) {

        if (generationStopped) {
            return;
        }

        if (currentPassword.length === length) {

            generatedCount++;

            generatedPasswords.push(
                currentPassword
            );

            displayBuffer.push(
                currentPassword
            );

            return;
        }

        for (let i = 0; i < keys.length; i++) {

            if (generationStopped) {
                return;
            }

            const character =
                keys[i];

            if (remaining[character] <= 0) {
                continue;
            }

            remaining[character]--;

            generate(
                currentPassword + character,
                remaining
            );

            remaining[character]++;
        }

    }


    /*
        Instead of running the entire recursive
        process at once, run it in small chunks.
    */

    const stack = [
        {
            password: "",
            remaining: { ...characters }
        }
    ];


    function processBatch() {

        if (generationStopped) {

            finishGeneration(false);

            return;
        }


        let operations = 0;


        while (
            stack.length > 0 &&
            operations < GENERATION_BATCH_SIZE
        ) {

            const state =
                stack.pop();

            const currentPassword =
                state.password;

            const remaining =
                state.remaining;


            if (currentPassword.length === length) {

                generatedCount++;

                generatedPasswords.push(
                    currentPassword
                );

                displayBuffer.push(
                    currentPassword
                );

                operations++;

                continue;
            }


            for (let i = keys.length - 1; i >= 0; i--) {

                const character =
                    keys[i];

                if (remaining[character] <= 0) {
                    continue;
                }

                const newRemaining =
                    { ...remaining };

                newRemaining[character]--;

                stack.push({
                    password:
                        currentPassword + character,

                    remaining:
                        newRemaining
                });

            }

            operations++;
        }


        /*
            Update the screen in batches instead of
            updating it after every permutation.
        */

        if (displayBuffer.length > 0) {

            const amountToDisplay =
                Math.min(
                    displayBuffer.length,
                    DISPLAY_BATCH_SIZE
                );

            const batch =
                displayBuffer.splice(
                    0,
                    amountToDisplay
                );

            displayPasswordsBatch(batch);

        }


        uniqueResults.textContent =
            generatedCount.toLocaleString();


        /*
            Continue on the next browser frame.
            This prevents the page from freezing.
        */

        if (stack.length > 0) {

            generationTimer =
                setTimeout(
                    processBatch,
                    0
                );

        } else {

            while (displayBuffer.length > 0) {

                const batch =
                    displayBuffer.splice(
                        0,
                        DISPLAY_BATCH_SIZE
                    );

                displayPasswordsBatch(batch);

            }

            finishGeneration(true);

        }

    }


    processBatch();
}


/* ==========================================
   DISPLAY PASSWORD BATCH
========================================== */

function displayPasswordsBatch(passwords) {

    const fragment =
        document.createDocumentFragment();


    passwords.forEach(function (password) {

        const item =
            document.createElement("div");

        item.className =
            "password-item";


        const number =
            document.createElement("span");

        number.className =
            "password-number";

        number.textContent =
            "#" +
            (generatedPasswords.indexOf(password) + 1);


        const value =
            document.createElement("span");

        value.className =
            "password-value";

        value.textContent =
            password;


        const copyButton =
            document.createElement("button");

        copyButton.className =
            "copy-btn";

        copyButton.textContent =
            "Copy";


        copyButton.addEventListener(
            "click",
            function () {

                navigator.clipboard
                    .writeText(password)
                    .then(function () {

                        copyButton.textContent =
                            "Copied!";

                        setTimeout(
                            function () {

                                copyButton.textContent =
                                    "Copy";

                            },
                            1000
                        );

                    });

            }
        );


        item.appendChild(number);
        item.appendChild(value);
        item.appendChild(copyButton);

        fragment.appendChild(item);

    });


    passwordList.appendChild(fragment);

}


/* ==========================================
   FINISH GENERATION
========================================== */

function finishGeneration(completed) {

    generationFinished = completed;

    if (generationTimer !== null) {

        clearTimeout(generationTimer);

        generationTimer = null;

    }


    if (completed) {

        analyzeBtn.innerHTML =
            "<span>Generate Again</span><span class='arrow'>↻</span>";

    } else {

        analyzeBtn.innerHTML =
            "<span>Generate Again</span><span class='arrow'>↻</span>";

    }

}


/* ==========================================
   ANALYZE PASSWORD
========================================== */

function analyzePassword() {

    const password =
        passwordInput.value;


    errorMessage.textContent = "";


    if (password.length === 0) {

        errorMessage.textContent =
            "Please enter a password to analyze.";

        return;

    }


    /*
        Stop an existing generation.
    */

    if (generationTimer !== null) {

        generationStopped = true;

        clearTimeout(generationTimer);

        generationTimer = null;

    }


    const length =
        password.length;


    const mathematicalTotal =
        factorial(length);


    const uniqueTotal =
        calculateUniquePermutations(password);


    passwordLength.textContent =
        length;


    totalPossible.textContent =
        formatNumber(mathematicalTotal);


    uniqueResults.textContent =
        "0";


    formula.textContent =
        length +
        "! = " +
        formatNumber(mathematicalTotal);


    /*
        Show the results section.
    */

    resultsSection.classList.remove("hidden");


    /*
        Hide the old warning.
    */

    warningBox.classList.add("hidden");


    /*
        Reset result list.
    */

    passwordList.innerHTML = "";

    generatedPasswords = [];

    generationStopped = false;

    generationFinished = false;


    /*
        Show the unique permutation count
        before generation starts.
    */

    if (
        uniqueTotal.toString().length <= 15
    ) {

        uniqueResults.textContent =
            "0 / " +
            Number(uniqueTotal).toLocaleString();

    } else {

        uniqueResults.textContent =
            "0 / " +
            formatNumber(uniqueTotal);

    }


    /*
        Change button while generating.
    */

    analyzeBtn.innerHTML =
        "<span>Generating...</span><span class='arrow'>...</span>";


    /*
        Start progressive generation.
    */

    generatePermutationsProgressively(
        password
    );


    /*
        Scroll to results.
    */

    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

}


/* ==========================================
   ANALYZE BUTTON
========================================== */

analyzeBtn.addEventListener(
    "click",
    function () {

        if (generationTimer !== null) {

            generationStopped = true;

            clearTimeout(generationTimer);

            generationTimer = null;

            analyzeBtn.innerHTML =
                "<span>Analyze Password</span><span class='arrow'>→</span>";

            return;

        }

        analyzePassword();

    }
);


/* ==========================================
   ENTER KEY
========================================== */

passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            analyzePassword();
        }

    }
);


/* ==========================================
   SEARCH RESULTS
========================================== */

searchInput.addEventListener(
    "input",
    function () {

        const searchTerm =
            searchInput.value.toLowerCase();


        if (searchTerm === "") {

            passwordList.innerHTML = "";

            displayPasswordsBatch(
                generatedPasswords
            );

            return;

        }


        const filtered =
            generatedPasswords.filter(
                function (password) {

                    return password
                        .toLowerCase()
                        .includes(searchTerm);

                }
            );


        passwordList.innerHTML = "";


        if (filtered.length === 0) {

            emptyResults.textContent =
                "No matching passwords found.";

            emptyResults.classList.remove(
                "hidden"
            );

            return;

        }


        emptyResults.classList.add(
            "hidden"
        );


        displayPasswordsBatch(
            filtered
        );

    }
);


/* ==========================================
   COPY ALL
========================================== */

copyAllBtn.addEventListener(
    "click",
    function () {

        if (
            generatedPasswords.length === 0
        ) {
            return;
        }


        const text =
            generatedPasswords.join("\n");


        navigator.clipboard
            .writeText(text)
            .then(function () {

                copyAllBtn.textContent =
                    "Copied!";


                setTimeout(
                    function () {

                        copyAllBtn.textContent =
                            "Copy All";

                    },
                    1200
                );

            });

    }
);


/* ==========================================
   DOWNLOAD RESULTS
========================================== */

downloadBtn.addEventListener(
    "click",
    function () {

        if (
            generatedPasswords.length === 0
        ) {
            return;
        }


        const password =
            passwordInput.value;


        const total =
            factorial(password.length);


        let content =
            "PASSWORD ANALYSIS - ALL POSSIBLE OUTCOMES\n";


        content +=
            "============================================================\n\n";


        content +=
            "Original Password: " +
            password +
            "\n";


        content +=
            "Password Length: " +
            password.length +
            "\n\n";


        content +=
            "Total Possible Passwords (Mathematically): " +
            total +
            "\n";


        content +=
            "Formula: " +
            password.length +
            "! = " +
            total +
            "\n\n";


        content +=
            "Total Unique Passwords (Generated): " +
            generatedPasswords.length +
            "\n\n";


        content +=
            "============================================================\n";


        content +=
            "ALL POSSIBLE PASSWORDS:\n";


        content +=
            "============================================================\n\n";


        generatedPasswords.forEach(
            function (passwordValue, index) {

                content +=
                    (index + 1) +
                    ". " +
                    passwordValue +
                    "\n";

            }
        );


        const file =
            new Blob(
                [content],
                {
                    type: "text/plain"
                }
            );


        const url =
            URL.createObjectURL(file);


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "password_outcomes.txt";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);


        URL.revokeObjectURL(url);

    }
);
