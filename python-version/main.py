import itertools
import math
import string
import time
from pathlib import Path
from datetime import datetime

APP_NAME = "POSSIBLE PASSWORD IDENTIFIER"
MAX_RESULTS = 100_000


def show_header():
    print("\n" + "=" * 58)
    print(f"{APP_NAME:^58}")
    print("Generate and analyze possible character combinations".center(58))
    print("=" * 58)


def pause():
    input("\nPress Enter to continue...")


def get_integer(prompt, minimum, maximum):
    while True:
        try:
            value = int(input(prompt).strip())
            if minimum <= value <= maximum:
                return value
            print(f"Enter a number from {minimum} to {maximum}.")
        except ValueError:
            print("Please enter a valid whole number.")


def choose_character_set():
    print("\nCHARACTER SET")
    print("[1] Lowercase letters       abc")
    print("[2] Uppercase letters       ABC")
    print("[3] Numbers                 123")
    print("[4] Symbols                 !@#")
    print("[5] Letters and numbers")
    print("[6] Letters, numbers, and symbols")
    print("[7] Custom characters")
    print("[8] Enter your own characters")

    choice = get_integer("Choose an option: ", 1, 8)

    character_sets = {
        1: string.ascii_lowercase,
        2: string.ascii_uppercase,
        3: string.digits,
        4: "!@#$%^&*()-_=+[]{};:,.?",
        5: string.ascii_letters + string.digits,
        6: string.ascii_letters + string.digits + "!@#$%^&*()-_=+",
    }

    if choice in character_sets:
        characters = character_sets[choice]
    elif choice == 7:
        characters = input("Enter the characters to use: ")
    else:
        characters = input("Enter your characters: ")

    # Remove duplicate characters while preserving their order.
    characters = "".join(dict.fromkeys(characters))

    if not characters:
        print("No characters were entered.")
        return None

    if len(characters) > 100:
        print("Please use 100 or fewer unique characters.")
        return None

    print(f"\nUnique characters: {len(characters)}")
    print(f"Character set: {characters}")
    return characters


def calculate_total(characters, min_length, max_length):
    total = 0
    for length in range(min_length, max_length + 1):
        total += len(characters) ** length
    return total


def show_statistics(characters, min_length, max_length):
    print("\n" + "-" * 58)
    print("COMBINATION ANALYSIS")
    print("-" * 58)
    print(f"Unique characters : {len(characters)}")
    print(f"Minimum length    : {min_length}")
    print(f"Maximum length    : {max_length}")

    total = calculate_total(characters, min_length, max_length)
    print(f"Possible strings  : {total:,}")

    print("\nCombinations by length:")
    for length in range(min_length, max_length + 1):
        count = len(characters) ** length
        print(f"  Length {length:>2}: {count:,}")

    print("\nNote: This counts ordered strings with repetition allowed.")
    print("It does not indicate whether any string is a real password.")


def generate_combinations(characters, min_length, max_length):
    total = calculate_total(characters, min_length, max_length)

    if total > MAX_RESULTS:
        print(f"\nGeneration would produce {total:,} strings.")
        print(f"The safety limit is {MAX_RESULTS:,} strings per run.")
        print("Choose a smaller character set or shorter length.")
        return

    print(f"\nGenerating {total:,} combinations...")
    results = []
    started = time.perf_counter()

    try:
        for length in range(min_length, max_length + 1):
            for combination in itertools.product(characters, repeat=length):
                results.append("".join(combination))

        elapsed = time.perf_counter() - started
        print(f"Generated {len(results):,} strings in {elapsed:.3f} seconds.")

        print("\nPREVIEW")
        print("-" * 58)
        for item in results[:30]:
            print(item)

        if len(results) > 30:
            print(f"... and {len(results) - 30:,} more.")

        while True:
            save = input("\nExport all results to a text file? (y/n): ").strip().lower()
            if save in ("y", "n"):
                break
            print("Enter y or n.")

        if save == "y":
            export_results(results)

    except MemoryError:
        print("Not enough memory. Try a smaller generation size.")


def export_results(results):
    filename = "possible_combinations_" + datetime.now().strftime("%Y%m%d_%H%M%S") + ".txt"

    try:
        with open(filename, "w", encoding="utf-8") as file:
            file.write(APP_NAME + "\n")
            file.write(f"Generated: {datetime.now():%Y-%m-%d %H:%M:%S}\n")
            file.write(f"Total strings: {len(results):,}\n")
            file.write("-" * 40 + "\n")
            file.write("\n".join(results))
            file.write("\n")

        print(f"\nExport successful: {Path(filename).resolve()}")

    except OSError as error:
        print(f"Could not save the file: {error}")


def analyze_input():
    print("\nCHARACTER ANALYZER")
    print("Enter sample text to analyze. Avoid entering real passwords.")
    sample = input("Sample text: ")

    if not sample:
        print("No text was entered.")
        return

    print("\nANALYSIS RESULTS")
    print("-" * 40)
    print(f"Character count : {len(sample)}")
    print(f"Unique count    : {len(set(sample))}")
    print(f"Letters         : {sum(c.isalpha() for c in sample)}")
    print(f"Digits          : {sum(c.isdigit() for c in sample)}")
    print(f"Whitespace      : {sum(c.isspace() for c in sample)}")
    print(f"Symbols         : {sum(not c.isalnum() and not c.isspace() for c in sample)}")
    print(f"Uppercase       : {sum(c.isupper() for c in sample)}")
    print(f"Lowercase       : {sum(c.islower() for c in sample)}")

    if len(sample) > 0:
        pool_size = 0
        if any(c.islower() for c in sample):
            pool_size += 26
        if any(c.isupper() for c in sample):
            pool_size += 26
        if any(c.isdigit() for c in sample):
            pool_size += 10
        if any(not c.isalnum() and not c.isspace() for c in sample):
            pool_size += 32

        if pool_size:
            entropy = len(sample) * math.log2(pool_size)
            print(f"Estimated entropy: {entropy:.2f} bits")
            print("This is a rough estimate, not a password-strength guarantee.")

    print("\nTip: Long, unique passphrases are generally preferable.")
    print("Use a reputable password manager for real credentials.")


def main():
    while True:
        show_header()
        print("\nMAIN MENU")
        print("[1] Generate possible combinations")
        print("[2] Calculate combination statistics")
        print("[3] Analyze sample text")
        print("[4] Exit")

        choice = get_integer("\nSelect an option: ", 1, 4)

        if choice == 1:
            characters = choose_character_set()
            if characters:
                minimum = get_integer("Minimum length (1-12): ", 1, 12)
                maximum = get_integer(
                    f"Maximum length ({minimum}-12): ", minimum, 12
                )
                generate_combinations(characters, minimum, maximum)
            pause()

        elif choice == 2:
            characters = choose_character_set()
            if characters:
                minimum = get_integer("Minimum length (1-12): ", 1, 12)
                maximum = get_integer(
                    f"Maximum length ({minimum}-12): ", minimum, 12
                )
                show_statistics(characters, minimum, maximum)
            pause()

        elif choice == 3:
            analyze_input()
            pause()

        elif choice == 4:
            print("\nThank you for using Possible Password Identifier!")
            break


if __name__ == "__main__":
    main()
