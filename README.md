# Password Finder Generator

A beginner-friendly **Possible Password Identifier** project that calculates, generates, and analyzes possible character combinations using Python and web technologies.

The project started as a **Python command-line application** and was expanded into a **modern web-based application** using HTML, CSS, and JavaScript. The improved versions allow users to select character sets, configure combination lengths, calculate the number of possible strings, inspect character composition, and export generated results.

The project focuses on programming fundamentals, combinatorics, string manipulation, and interactive application development.

---

## Features

### Python Version

- **Character Set Selection** — Choose lowercase letters, uppercase letters, numbers, symbols, letters and numbers, or custom characters.
- **Duplicate Character Removal** — Automatically removes duplicate characters from the selected character set while preserving their order.
- **Combination Generation** — Generate possible character strings using Python's `itertools.product()`.
- **Configurable Length** — Choose minimum and maximum string lengths from 1 to 12.
- **Combination Statistics** — Calculate the number of possible strings for each selected length.
- **Character Analyzer** — Analyze sample text by character length, unique characters, letters, digits, symbols, uppercase letters, and lowercase letters.
- **Entropy Estimation** — Display an illustrative theoretical entropy estimate based on character categories.
- **Result Preview** — Display the first 30 generated combinations in the terminal.
- **Text File Export** — Save all generated combinations to a `.txt` file.
- **Input Validation** — Validate menu choices, character sets, and length settings.
- **Generation Safety Limit** — Restrict each generation run to a maximum of 100,000 results to reduce memory usage.
- **Simple Navigation** — Use a menu-driven interface to access the available functions.

### Web Version

- **Modern Dashboard** — A dark-themed interface with purple accents, organized panels, and responsive layouts.
- **Character Presets** — Select lowercase letters, uppercase letters, numbers, symbols, letters and numbers, or all supported preset characters.
- **Custom Character Sets** — Enter your own characters for generation.
- **Automatic Duplicate Removal** — Remove duplicate characters from the selected character set.
- **Configurable Length** — Choose minimum and maximum string lengths from 1 to 12.
- **Repetition Control** — Enable or disable repeated characters in generated strings.
- **Automatic Combination Calculations** — Update the number of possible strings based on the selected settings.
- **Generation Progress** — Display the current progress and percentage during generation.
- **Stop Generation** — Stop an ongoing generation process and retain results already generated.
- **Search Results** — Filter generated strings using the search field.
- **Copy Individual Results** — Copy a specific generated string to the clipboard.
- **Copy Visible Results** — Copy all results matching the current search.
- **Text File Export** — Download generated combinations as a `.txt` file.
- **Text Analyzer** — Inspect sample text, including length, unique characters, letters, digits, symbols, whitespace, uppercase letters, and lowercase letters.
- **Entropy Estimate** — Calculate an illustrative entropy estimate based on text length and observed character categories.
- **Multiple Pages** — Navigate between the Combination Generator, Text Analyzer, and About Project sections.
- **Responsive Design** — Adapt the interface to desktop, tablet, and mobile screens.
- **Local Processing** — Perform calculations and generation in the browser without requiring a backend server or external JavaScript libraries.
- **Generation Safety Limit** — Limit each generation run to 100,000 results and display up to 1,000 matching results at a time.

---

## Technologies Used

### Python Version

- Python 3
- `itertools`
- `math`
- `string`
- `time`
- `pathlib`
- `datetime`

### Web Version

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- JavaScript `Set`
- Generator Functions
- Async/Await
- Browser Clipboard API
- Browser Blob API
- File Download API
- Responsive Web Design

No external Python packages or JavaScript libraries are required.

---

## How It Works

The improved application allows users to select a character set and a range of string lengths rather than requiring them to enter an existing password.

For example, selecting the characters:

```text
ab
```

with a minimum length of 1 and a maximum length of 2 produces the following strings when repetition is allowed:

```text
a
b
aa
ab
ba
bb
```

The total number of possible strings is calculated using the formula:

```text
Total = k^1 + k^2 + ... + k^n
```

where:

- `k` represents the number of unique characters.
- `n` represents the maximum selected length.
- Each length contributes its own number of possible strings.

For example, with two unique characters and lengths 1 through 2:

```text
2^1 + 2^2 = 2 + 4 = 6
```

Therefore, there are 6 possible strings.

---

## Combination Statistics

The application calculates the number of possible strings for every selected length.

When repetition is allowed, the formula is:

```text
k^n
```

For example, using four unique characters with a length of 3:

```text
4^3 = 64
```

This produces 64 ordered strings of length 3.

### When Repetition Is Disabled

The web version also supports generating strings without repeating characters.

The formula becomes:

```text
P(k, n) = k! / (k - n)!
```

where:

- `k` is the number of unique characters.
- `n` is the selected string length.
- `!` represents factorial.

For example, using the characters `abc` with a length of 2 and repetition disabled produces:

```text
ab
ac
ba
bc
ca
cb
```

The total is:

```text
P(3, 2) = 3! / (3 - 2)! = 6
```

The application skips lengths that exceed the available number of unique characters when repetition is disabled.

---

## Character Set Options

Both versions provide several ways to select the characters used for generation.

| Option | Description |
|---|---|
| Lowercase | Letters from `a` to `z` |
| Uppercase | Letters from `A` to `Z` |
| Numbers | Digits from `0` to `9` |
| Symbols | Common punctuation and symbols |
| Letters and Numbers | Uppercase, lowercase, and digits |
| Letters, Numbers, and Symbols | A broader preset character set |
| Custom Characters | User-defined characters |

Duplicate characters are removed automatically to avoid generating redundant results from an alphabet containing repeated characters.

For example:

```text
aabc
```

becomes:

```text
abc
```

The resulting character set contains three unique characters.

---

## Python Version

The Python application uses a command-line menu to access its functions.

### Main Menu

```text
POSSIBLE PASSWORD IDENTIFIER

MAIN MENU

[1] Generate possible combinations
[2] Calculate combination statistics
[3] Analyze sample text
[4] Exit

Select an option:
```

### Example Generation

If the user selects the characters `ab` and chooses lengths 1 through 2, the application generates:

```text
a
b
aa
ab
ba
bb
```

The generated strings are stored in a Python list before being displayed and optionally exported.

The Python version supports character repetition and generates all ordered strings for the selected lengths.

---

## Web Version

The web application provides a dashboard for configuring and analyzing possible character combinations.

### Main Sections

**1. Combination Generator**

- Configure character presets or custom characters.
- Set minimum and maximum lengths.
- Enable or disable repeated characters.
- Calculate the total number of possible strings.
- Generate, search, copy, and export results.

**2. Text Analyzer**

- Enter sample text for analysis.
- Calculate character length and unique character count.
- Count letters, digits, symbols, whitespace, uppercase, and lowercase characters.
- Display an illustrative entropy estimate.

**3. About Project**

- Review the application's purpose.
- Learn the mathematical concepts behind combination generation.
- Understand the application's local processing and safety limitations.

---

## Progressive Generation

The web version uses JavaScript generator functions and asynchronous processing to generate results incrementally.

Instead of constructing the entire output before updating the interface, the application periodically updates its progress indicator and result preview.

This helps the browser remain responsive during supported generation tasks.

The web version also allows users to:

- Monitor generation progress.
- Stop generation before it finishes.
- Keep results generated before stopping.
- Search through generated results.
- Copy matching results.
- Export the complete generated result set.

Stopping generation does not delete results already generated during the current run.

---

## Performance and Safety Limits

The number of possible strings grows rapidly as the character set and string length increase.

For example, using 10 unique characters with repetition allowed:

```text
Length 1  = 10
Length 2  = 100
Length 3  = 1,000
Length 4  = 10,000
Length 5  = 100,000
Length 6  = 1,000,000
```

Generating millions of strings can consume substantial memory and processing time.

To reduce this risk, both versions enforce a **maximum of 100,000 generated results per run**.

Additional limitations include:

- The Python version displays a preview of up to 30 results.
- The web version displays up to 1,000 matching results at a time.
- The web version uses incremental generation and progress updates.
- The total number of possible strings is calculated separately from the number currently displayed.
- The web version can stop generation and preserve the results already generated.

These safeguards help keep the application manageable for educational use. They do not eliminate all possible performance issues.

---

## Text Analysis and Entropy Estimation

Both versions include a text analyzer that examines sample text without connecting to external services.

The analyzer reports information such as:

- Total character length.
- Number of unique characters.
- Number of letters.
- Number of digits.
- Number of symbols.
- Uppercase and lowercase letter counts.
- Whitespace count.

The application also displays an illustrative entropy estimate based on text length and the character categories detected.

The general formula used is:

```text
Entropy = Length × log₂(Character Pool Size)
```

This estimate assumes characters are selected independently and uniformly from a known character pool. Real human-created passwords often do not satisfy these assumptions, so the displayed estimate is not a reliable password-strength guarantee.

---

## Saving Results

Both versions support exporting generated combinations to a text file.

### Python Version

The Python version creates a timestamped filename, such as:

```text
possible_combinations_20261018_103000.txt
```

The file contains:

- Project title.
- Export date and time.
- Total number of generated strings.
- Generated combinations.

### Web Version

The web version downloads a timestamped text file, such as:

```text
possible_combinations_1792315800000.txt
```

The exported file contains:

- Project title.
- Export date and time.
- Total number of generated strings.
- Generated combinations.

The web export includes the complete set of generated results, not only the results currently visible in the preview or matching the search filter.

---

## Installation

### Python Version

1. Install Python 3.
2. Open the project folder in PyCharm or another Python editor.
3. Ensure the Python file is named `main.py`.
4. Run the following command:

```bash
python main.py
```

No external packages are required.

### Web Version

1. Open the `password-UI` folder.
2. Ensure the three web files are present.
3. Open `index.html` in a modern browser.

No installation, backend server, or external JavaScript libraries are required for the application's main features.

---

## Project Structure

```text
password-finder-generator/
│
├── main.py
│
├── password-UI/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

---

## Educational Purpose

This project is intended for educational purposes. It demonstrates how mathematical combinations, character sets, and basic text analysis can be implemented in Python and JavaScript.

The application does not retrieve actual passwords, verify login credentials, or connect to account authentication systems.

Avoid entering real passwords or other sensitive information into the text analyzers.

---

## Learning Objectives

This project helps beginners practice:

1. Importing Python standard-library modules.
2. Creating and calling functions.
3. Working with strings and character sets.
4. Using lists, sets, and dictionaries.
5. Applying loops and conditional statements.
6. Validating user input.
7. Using `itertools.product()` for combination generation.
8. Calculating mathematical combinations.
9. Working with factorials and logarithms.
10. Handling file exports.
11. Building a menu-driven Python application.
12. Creating HTML page structures.
13. Styling interfaces with CSS.
14. Manipulating HTML elements using JavaScript.
15. Handling browser events and user input.
16. Using JavaScript generator functions.
17. Using asynchronous processing and progress indicators.
18. Working with browser clipboard and file APIs.
19. Creating responsive layouts.
20. Applying basic performance and input safeguards.

---

## Project Versions

| Version | Technology | Interface |
|---|---|---|
| Python | Python 3 | Command Line |
| Web | HTML, CSS, JavaScript | Web Browser |

The Python version focuses on programming fundamentals and terminal-based interaction, while the web version provides a more visual and interactive experience.

---

## Future Improvements

Possible future improvements include:

- Virtual scrolling for larger result lists.
- More advanced memory management.
- Estimated generation time.
- CSV and JSON export.
- Additional character-set presets.
- Improved text-analysis statistics.
- Light and dark theme switching.
- Unit tests for combination calculations.
- More detailed generation history.
- Additional educational explanations of combinatorics.

---

## Author

Created as a beginner programming project focused on **Python programming, JavaScript, combinatorics, character-set analysis, and web development**.
