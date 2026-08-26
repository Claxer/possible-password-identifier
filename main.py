import itertools
import math


def get_all_possible_passwords(password):
    perms = set(itertools.permutations(password))
    permutations = [''.join(p) for p in perms]
    return sorted(permutations)

def calculate_total_possible(password):
    return math.factorial(len(password))

def display_password_analysis(password):
    print("\n" + "=" * 60)
    print("PASSWORD ANALYSIS - ALL POSSIBLE OUTCOMES")
    print("=" * 60)

    print(f"\nOriginal Password: {password}")
    print(f"Password Length: {len(password)}")

    total_possible = calculate_total_possible(password)
    print(f"\nTotal Possible Passwords (Mathematically): {total_possible}")
    print(f"Formula: {len(password)}! (factorial) = {total_possible}")

    print("\n" + "=" * 60)
    show_passwords = input(f"Do you want to display all {total_possible} possible passwords? (yes/no): ").lower()

    if show_passwords in ['yes', 'y']:
        all_passwords = get_all_possible_passwords(password)
        actual_count = len(all_passwords)

        print(f"\nTotal Unique Passwords (Actual): {actual_count}")
        print("\n" + "=" * 60)
        print("ALL POSSIBLE PASSWORDS:")
        print("=" * 60 + "\n")

        for i, pwd in enumerate(all_passwords, 1):
            print(f"{i}. {pwd}")

        return all_passwords
    else:
        print("\n✓ Passwords not displayed.")
        return None


def save_results_to_file(password, all_passwords, filename="password_outcomes.txt"):
    print(f"\n\nSaving results to {filename}...")

    total_possible = calculate_total_possible(password)

    with open(filename, 'w') as f:
        f.write("PASSWORD ANALYSIS - ALL POSSIBLE OUTCOMES\n")
        f.write("=" * 60 + "\n\n")

        f.write(f"Original Password: {password}\n")
        f.write(f"Password Length: {len(password)}\n\n")

        f.write(f"Total Possible Passwords (Mathematically): {total_possible}\n")
        f.write(f"Formula: {len(password)}! (factorial) = {total_possible}\n\n")

        if all_passwords:
            f.write(f"Total Unique Passwords (Actual): {len(all_passwords)}\n\n")

            f.write("=" * 60 + "\n")
            f.write("ALL POSSIBLE PASSWORDS:\n")
            f.write("=" * 60 + "\n\n")

            for i, pwd in enumerate(all_passwords, 1):
                f.write(f"{i}. {pwd}\n")
        else:
            f.write("(Passwords were not displayed by user)\n")

    print(f"✓ Results saved to {filename}")


if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("PASSWORD FINDER GENERATOR")
    print("=" * 60)

    password = input("\nEnter a password to analyze: ")

    all_passwords = display_password_analysis(password)

    print("\n" + "=" * 60)
    save_option = input("Would you like to save the results to a file? (yes/no): ").lower()
    if save_option in ['yes', 'y']:
    filename = input("Enter filename (default: password_outcomes.txt): ").strip() or "password_outcomes.txt"
    save_results_to_file(password, all_passwords, filename)

    print("\nThank you for using this!")
