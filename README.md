# Password Finder Generator

A beginner-friendly **Password Finder Generator** that analyzes a password and generates possible arrangements of its characters using permutations.

The project started as a **Python command-line application** and was later expanded into a **modern web-based interface** using HTML, CSS, and JavaScript.

The program calculates the mathematical number of possible arrangements using factorial, generates unique permutations, displays the results, and allows generated results to be downloaded.

---

## Features

### Python Version

* Analyze password length
* Calculate total possible arrangements using factorial
* Generate character permutations
* Remove duplicate permutations
* Display unique password outcomes
* Show the actual number of unique results
* Save results to a `.txt` file
* Allow the user to choose whether to display results
* Allow the user to choose whether to save results

### Web Version

* Modern and aesthetic user interface
* Password analysis dashboard
* Password length counter
* Show and hide password input
* Calculate factorial automatically
* Calculate unique permutations
* Progressively generate permutations
* Display generated results in the browser
* Search generated password results
* Copy individual results
* Copy all generated results
* Download results as a `.txt` file
* Responsive design for desktop, tablet, and mobile
* Dark-themed interface with purple accents
* Generation can be stopped and restarted

---

## Technologies Used

### Python Version

* Python 3
* `itertools`
* `math`

### Web Version

* HTML5
* CSS3
* JavaScript
* Google Fonts
* Browser Clipboard API
* Browser File/Blob API

---

## How It Works

The program asks the user to enter a password.

It calculates the theoretical number of possible arrangements using:

```text
n!
```

where `n` represents the number of characters.

For example, a 4-character password has:

```text
4! = 4 × 3 × 2 × 1 = 24
```

possible arrangements when all characters are different.

The program then generates the possible arrangements and removes duplicate results.

For example:

```text
abc
```

produces:

```text
abc
acb
bac
bca
cab
cba
```

There are:

```text
3! = 6
```

possible arrangements.

---

## Handling Duplicate Characters

The project also handles passwords containing repeated characters.

For example:

```text
aab
```

The mathematical calculation is:

```text
3! = 6
```

However, because two characters are identical, some arrangements are duplicates.

The unique results are:

```text
aab
aba
baa
```

Therefore, the actual number of unique passwords is:

```text
3
```

---

# Web Interface

The web version provides a more user-friendly interface compared to the original command-line program.

Users can enter a password directly into the browser and select **Analyze Password**.

The interface displays:

* Password length
* Mathematical number of possibilities
* Number of generated unique results
* Factorial formula
* Generated password arrangements

The generated results can also be searched, copied, or downloaded.

---

## Progressive Generation

The web version uses **progressive generation** instead of attempting to generate everything at once.

This allows the browser to process permutations in smaller batches, helping prevent the page from freezing during larger calculations.

The program can also stop an ongoing generation and allow the user to start again.

### Example

For:

```text
abcd
```

the program generates:

```text
4! = 24
```

possible arrangements.

For:

```text
abcdefgh
```

the program generates:

```text
8! = 40,320
```

possible arrangements.

---

## Important Performance Note

There is no artificial password-length limit in the web interface.

However, the number of permutations grows extremely quickly as the password becomes longer.

For example:

```text
5!  = 120
6!  = 720
7!  = 5,040
8!  = 40,320
9!  = 362,880
10! = 3,628,800
11! = 39,916,800
12! = 479,001,600
```

Because of this, extremely long passwords can require a very large amount of processing time and memory.

Progressive generation helps keep the interface responsive, but it **does not change the mathematical number of permutations**.

---

## Python Example

For the password:

```text
abcd
```

The program calculates:

```text
Password Length: 4
Total Possible Passwords: 24
Formula: 4! = 24
```

The generated arrangements include:

```text
abcd
abdc
acbd
acdb
adbc
adcb
...
```

---

## Web Version Example

The web application provides an interface similar to:

```text
PASSWORD ANALYSIS TOOL

Password Finder
Generator

Analyze Password

[ Enter a password... ]

[ Analyze Password ]
```

After analysis, the results are displayed in a dashboard containing:

```text
Password Length
        4

Mathematical Possibilities
        24

Unique Results
        24
```

The generated passwords can then be searched, copied, or downloaded.

---

# Saving Results

The Python version can save the analysis to a text file.

The default filename is:

```text
password_outcomes.txt
```

The web version also allows generated results to be downloaded as:

```text
password_outcomes.txt
```

The saved file can contain:

* Original password
* Password length
* Mathematical number of possible arrangements
* Factorial formula
* Number of unique outcomes
* Generated password arrangements

---

# Installation

## Python Version

Make sure Python 3 is installed.

No external packages are required because the program uses Python's built-in libraries.

Run the program with:

```bash
python main.py
```

---

## Web Version

No installation or external packages are required.

Open:

```text
index.html
```

in a web browser.

The web version uses:

```text
index.html
style.css
script.js
```

---

# Project Structure

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

# Educational Purpose

This project is intended for **educational purposes**.

It demonstrates concepts such as:

* Python functions
* JavaScript functions
* Loops
* Conditional statements
* User input
* File handling
* Lists
* Sets
* Strings
* Factorial calculations
* Permutations
* DOM manipulation
* Event listeners
* Browser APIs
* Responsive web design
* Progressive processing

It should **not be used to crack real passwords or access accounts without permission**.

---

# Learning Objectives

This project helps beginners practice:

1. Importing Python modules
2. Creating and calling functions
3. Working with strings
4. Using lists and sets
5. Using `itertools.permutations()`
6. Using `math.factorial()`
7. Working with user input
8. Writing results to files
9. Creating conditional statements
10. Creating command-line applications
11. Building a web interface
12. Using HTML and CSS
13. Manipulating HTML elements with JavaScript
14. Handling browser events
15. Working with JavaScript `Set`
16. Generating permutations efficiently
17. Creating responsive web layouts

---

# Project Versions

| Version | Technology            | Interface    |
| ------- | --------------------- | ------------ |
| Python  | Python 3              | Command Line |
| Web     | HTML, CSS, JavaScript | Web Browser  |

The **Python version** focuses on programming fundamentals, while the **web version** provides a more interactive and visually appealing way to use the project.

---

# Future Improvements

Possible future improvements include:

* Virtual scrolling for very large result sets
* Better memory management
* Generation progress percentage
* Estimated generation time
* Export to CSV
* Export to JSON
* Dark/light theme switcher
* Improved password statistics
* Character-type analysis
* More advanced permutation algorithms

---

# Author

Created as a beginner programming project focused on **permutations, factorials, Python programming, JavaScript, and web development**.
