# Password Finder Generator

A beginner-friendly Python program that analyzes a password and generates all possible arrangements of its characters using permutations. It calculates the mathematical number of possible combinations using factorial, optionally displays the unique outcomes, and allows the results to be saved to a text file.

## Features

* Analyze the length of a password
* Calculate the total possible arrangements using factorial
* Generate all possible character permutations
* Remove duplicate permutations
* Display all unique password outcomes
* Show the actual number of unique passwords
* Save analysis results to a `.txt` file
* Allow the user to choose whether to display or save results

## Technologies Used

* Python 3
* `itertools`
* `math`

## How It Works

The program asks the user to enter a password.

It then calculates the theoretical number of possible arrangements using:

```text
n!
```

where `n` is the number of characters in the password.

For example, a 4-character password has:

```text
4! = 4 × 3 × 2 × 1 = 24
```

possible arrangements when all characters are different.

The program then uses Python's `itertools.permutations()` to generate the possible arrangements and removes duplicates using a `set`.

## Example

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

If the user chooses to display the results, the program generates arrangements such as:

```text
abcd
abdc
acbd
acdb
adbc
adcb
...
```

## Saving Results

The program can save the analysis to a text file.

The default filename is:

```text
password_outcomes.txt
```

The saved file contains:

* Original password
* Password length
* Mathematical number of possible arrangements
* Factorial formula
* Number of unique outcomes
* Generated password arrangements

## Installation

Make sure Python 3 is installed on your computer.

No external packages are required because the program uses Python's built-in libraries.

Run the program with:

```bash
python main.py
```

## Important Note

This project is intended for **educational purposes** to demonstrate:

* Python functions
* Loops
* User input
* File handling
* Sets
* Lists
* String manipulation
* Factorial calculations
* Permutations

It should **not be used to crack real passwords or access accounts without permission**.

Also, the number of permutations grows extremely quickly as the password gets longer. For example:

```text
5!  = 120
6!  = 720
7!  = 5,040
8!  = 40,320
9!  = 362,880
10! = 3,628,800
```

Because of this, generating and displaying every possible arrangement for long passwords can require a large amount of memory and processing time.

## Project Structure

```text
password-finder-generator/
│
├── main.py
└── README.md
```

## Learning Objectives

This project helps beginners practice:

1. Importing Python modules
2. Creating and calling functions
3. Working with strings
4. Using lists and sets
5. Using `itertools.permutations()`
6. Using `math.factorial()`
7. Working with user input
8. Writing results to files
9. Using conditional statements
10. Creating simple command-line applications

## Author

Created as a beginner Python programming project focused on permutations, factorials, and file handling.
