from django.db import migrations


ROUND1_QUESTIONS = [
    {
        "text": "What is the output of: print(type([] == []))?",
        "code_snippet": "print(type([] == []))",
        "option_a": "<class 'list'>",
        "option_b": "<class 'bool'>",
        "option_c": "<class 'NoneType'>",
        "option_d": "<class 'int'>",
        "correct_option": "B",
        "points": 5,
    },
    {
        "text": "Which of the following is NOT a valid Python data type?",
        "code_snippet": None,
        "option_a": "tuple",
        "option_b": "dict",
        "option_c": "array",
        "option_d": "set",
        "correct_option": "C",
        "points": 5,
    },
    {
        "text": "What will be the output of the following code?\n\nx = [1, 2, 3]\nprint(x[-1])",
        "code_snippet": "x = [1, 2, 3]\nprint(x[-1])",
        "option_a": "1",
        "option_b": "IndexError",
        "option_c": "3",
        "option_d": "-1",
        "correct_option": "C",
        "points": 5,
    },
    {
        "text": "Which keyword is used to define a function in Python?",
        "code_snippet": None,
        "option_a": "function",
        "option_b": "define",
        "option_c": "func",
        "option_d": "def",
        "correct_option": "D",
        "points": 5,
    },
    {
        "text": "What is the time complexity of binary search?",
        "code_snippet": None,
        "option_a": "O(n)",
        "option_b": "O(n log n)",
        "option_c": "O(log n)",
        "option_d": "O(1)",
        "correct_option": "C",
        "points": 5,
    },
    {
        "text": "What does the following code print?\n\nfor i in range(3):\n    pass\nprint(i)",
        "code_snippet": "for i in range(3):\n    pass\nprint(i)",
        "option_a": "0",
        "option_b": "3",
        "option_c": "2",
        "option_d": "NameError",
        "correct_option": "C",
        "points": 5,
    },
    {
        "text": "Which of the following correctly declares a pointer variable in C?",
        "code_snippet": None,
        "option_a": "int ptr;",
        "option_b": "ptr int*;",
        "option_c": "int *ptr;",
        "option_d": "*int ptr;",
        "correct_option": "C",
        "points": 5,
    },
    {
        "text": "What is the output of the following Java snippet?\n\nSystem.out.println(10 / 3);",
        "code_snippet": "System.out.println(10 / 3);",
        "option_a": "3.33",
        "option_b": "3",
        "option_c": "3.0",
        "option_d": "Compile error",
        "correct_option": "B",
        "points": 5,
    },
    {
        "text": "Which data structure uses LIFO (Last In First Out) order?",
        "code_snippet": None,
        "option_a": "Queue",
        "option_b": "Stack",
        "option_c": "Linked List",
        "option_d": "Binary Tree",
        "correct_option": "B",
        "points": 5,
    },
    {
        "text": "What will this code output?\n\nd = {'a': 1, 'b': 2}\nprint(d.get('c', 99))",
        "code_snippet": "d = {'a': 1, 'b': 2}\nprint(d.get('c', 99))",
        "option_a": "None",
        "option_b": "KeyError",
        "option_c": "0",
        "option_d": "99",
        "correct_option": "D",
        "points": 5,
    },
]


ROUND2_QUESTIONS = [
    {
        "text": "Fix the bug in this Python function. It should return the factorial of n, but currently always returns 0.",
        "code_snippet": "def factorial(n):\n    result = 0\n    for i in range(1, n + 1):\n        result *= i\n    return result",
        "option_a": "Change result = 0 to result = 1",
        "option_b": "Change range(1, n+1) to range(0, n)",
        "option_c": "Change result *= i to result += i",
        "option_d": "Change return result to return n",
        "correct_option": "A",
        "points": 10,
    },
    {
        "text": "This C code is meant to swap two numbers but has a bug. What is wrong?",
        "code_snippet": "#include <stdio.h>\nvoid swap(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\nint main() {\n    int x = 5, y = 10;\n    swap(x, y);\n    printf(\"%d %d\", x, y);\n}",
        "option_a": "temp should be declared as float",
        "option_b": "Parameters should be passed by pointer (int *a, int *b)",
        "option_c": "printf format should be %f",
        "option_d": "The swap logic inside the function is reversed",
        "correct_option": "B",
        "points": 10,
    },
    {
        "text": "Find the bug in this Python code that is supposed to check if a string is a palindrome.",
        "code_snippet": "def is_palindrome(s):\n    return s == s[::-1]\n\nprint(is_palindrome('Racecar'))",
        "option_a": "The slicing [::-1] is incorrect",
        "option_b": "The string should be converted to lowercase before comparison",
        "option_c": "The function should use a loop instead of slicing",
        "option_d": "The print statement should use repr()",
        "correct_option": "B",
        "points": 10,
    },
    {
        "text": "This Java code has a logical error in the Fibonacci sequence generator. Identify and fix it.",
        "code_snippet": "public class Fib {\n  public static int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 3);\n  }\n  public static void main(String[] args) {\n    System.out.println(fib(6));\n  }\n}",
        "option_a": "Change fib(n - 3) to fib(n - 2)",
        "option_b": "Change if (n <= 1) to if (n == 0)",
        "option_c": "Change return n to return 1",
        "option_d": "Change fib(n - 1) to fib(n + 1)",
        "correct_option": "A",
        "points": 10,
    },
    {
        "text": "This C code tries to find the maximum element in an array but has a bug. What is wrong?",
        "code_snippet": "#include <stdio.h>\nint findMax(int arr[], int n) {\n    int max = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] > max)\n            max = arr[i];\n    }\n    return max;\n}\nint main() {\n    int arr[] = {-5, -3, -8, -1};\n    printf(\"%d\", findMax(arr, 4));\n}",
        "option_a": "The loop should start from i = 1",
        "option_b": "The function should return min instead of max",
        "option_c": "max should be initialized to arr[0] instead of 0 (fails for all-negative arrays)",
        "option_d": "The condition should be arr[i] < max",
        "correct_option": "C",
        "points": 10,
    },
]


def seed_questions(apps, schema_editor):
    Question = apps.get_model('quiz_api', 'Question')

    # Seed Round 1 questions
    for q in ROUND1_QUESTIONS:
        Question.objects.get_or_create(
            text=q["text"],
            defaults={
                "code_snippet": q.get("code_snippet") or "",
                "option_a": q["option_a"],
                "option_b": q["option_b"],
                "option_c": q["option_c"],
                "option_d": q["option_d"],
                "correct_option": q["correct_option"],
                "round_number": 1,
                "points": q["points"],
            }
        )

    # Seed Round 2 questions
    for q in ROUND2_QUESTIONS:
        Question.objects.get_or_create(
            text=q["text"],
            defaults={
                "code_snippet": q.get("code_snippet") or "",
                "option_a": q["option_a"],
                "option_b": q["option_b"],
                "option_c": q["option_c"],
                "option_d": q["option_d"],
                "correct_option": q["correct_option"],
                "round_number": 2,
                "points": q["points"],
            }
        )


def unseed_questions(apps, schema_editor):
    """Reverse migration — removes only the questions seeded above."""
    Question = apps.get_model('quiz_api', 'Question')
    all_texts = [q["text"] for q in ROUND1_QUESTIONS + ROUND2_QUESTIONS]
    Question.objects.filter(text__in=all_texts).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('quiz_api', '0004_rounds_system'),
    ]

    operations = [
        migrations.RunPython(seed_questions, unseed_questions),
    ]
