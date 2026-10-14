import { DayLesson } from '../types';

export const DAYS_1_TO_5: DayLesson[] = [
  {
    day: 1,
    title: "Environment Setup, Terminal, Git & First Working Program",
    subtitle: "Setting up a professional developer workflow with modern terminal, JDK, Python, and Git",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Set up JDK 21+ and Python 3.11+ with verified path configurations",
      "Master essential terminal commands (ls/dir, cd, mkdir, cat/type)",
      "Initialize a Git repository, stage changes, commit with semantic messages, and push to GitHub",
      "Write, compile, and execute your first standalone Java class and Python script without an IDE magic button"
    ],
    keyTerminology: [
      {
        term: "JDK vs JRE vs JVM",
        definition: "JVM executes bytecode; JRE provides libraries to run Java apps; JDK includes compilers (javac) and tools needed by software engineers.",
        analogy: "JVM is the engine, JRE is the complete car, and JDK is the manufacturer's workshop with tools and blueprints."
      },
      {
        term: "Interpreter vs Compiler",
        definition: "Java is compiled to bytecode (.class) then executed by the JVM (JIT compiled). Python code (.py) is compiled to bytecode (.pyc) and directly interpreted by CPython.",
        analogy: "Java translates the book into an intermediate global dialect first; Python reads and translates paragraphs on the fly."
      },
      {
        term: "Git Working Tree vs Staging vs Repository",
        definition: "Working directory is your actual files on disk; staging area (index) is where commits are staged; repository is the committed immutable history (.git).",
        analogy: "Your desk is the working directory, the shipping box is the staging area, and the shipped package log is the repository."
      }
    ],
    conceptExplanation: {
      what: "Programming languages require execution environments and version control to turn human-readable code into deterministic machine actions.",
      whyNeeded: "In real backend jobs, you never click a green 'run' button inside an IDE on a production server. You navigate Linux servers via terminal, pull code via Git, and run builds using CLI tools.",
      howItWorks: "Terminal programs invoke executables in the system PATH. Git tracks content hashes (SHA-1/SHA-256) of your files, recording discrete states in a directed acyclic graph.",
      beginnerMistakes: [
        "Confusing Git (version control tool) with GitHub (cloud hosting service)",
        "Running Python scripts without being in the directory where the file exists",
        "Naming a Java file differently from its public class name (leads to compilation errors)",
        "Committing secrets, virtual environments (.venv), or compiled artifacts (.class, target/) into Git"
      ],
      backendRelevance: "Every backend developer manages deployments, checks server logs through terminal SSH sessions, and collaborates via Git pull requests.",
      interviewerPerspective: "Interviewers ask freshers: 'Walk me through what happens under the hood when you run javac and python' to detect if you only used Eclipse/VSCode buttons.",
      howToProveUnderstanding: "Create a GitHub repo from the CLI, add a `.gitignore`, write a Java and Python program from terminal, and push your first commit cleanly."
    },
    javaCodeSnippet: {
      title: "HelloBackend.java (CLI Compiled)",
      code: `// HelloBackend.java
// Compile: javac HelloBackend.java
// Run: java HelloBackend

public class HelloBackend {
    public static void main(String[] args) {
        String developerName = (args.length > 0) ? args[0] : "Junior Backend Engineer";
        System.out.println("Hello, " + developerName + "! Welcome to Backend Launch Lab.");
        System.out.println("Java Runtime Version: " + System.getProperty("java.version"));
    }
}`,
      explanation: "Java requires a class definition matching the filename. `public static void main(String[] args)` is the JVM entry point."
    },
    pythonCodeSnippet: {
      title: "hello_backend.py (CLI Executed)",
      code: `# hello_backend.py
# Run: python hello_backend.py [Name]

import sys
import platform

def main():
    name = sys.argv[1] if len(sys.argv) > 1 else "Junior Backend Engineer"
    print(f"Hello, {name}! Welcome to Backend Launch Lab.")
    print(f"Python Version: {platform.python_version()}")

if __name__ == "__main__":
    main()`,
      explanation: "Python runs sequentially. The `if __name__ == '__main__':` guard ensures `main()` executes only when invoked directly as a script."
    },
    practicalDeliverable: {
      title: "CLI Dual-Language Diagnostic & Clean Git Repo",
      description: "Build a single GitHub repository named `backend-launch-lab-journal`. Include both Java and Python scripts that print system properties and take a CLI argument. Add a comprehensive README.md and a proper `.gitignore`.",
      acceptanceCriteria: [
        "Repository initialized from terminal with `git init`",
        "`.gitignore` excludes `*.class`, `__pycache__/`, `.env`, and IDE folders",
        "Both `HelloBackend.java` and `hello_backend.py` run from CLI with command line arguments",
        "Clean commit history on GitHub with at least 3 descriptive commits"
      ]
    },
    debuggingTask: {
      problemTitle: "Java File Naming & Python Indentation Bug",
      language: "java",
      buggyCode: `// Saved as test.java
public class UserGreeting {
    public static void main(String[] args) {
        System.out.println("User initialized")
    }
}`,
      bugExplanation: "In Java, a public class named `UserGreeting` MUST reside in `UserGreeting.java`. Also, the print statement is missing a semicolon `;`.",
      fixedCode: `// Must be saved in UserGreeting.java
public class UserGreeting {
    public static void main(String[] args) {
        System.out.println("User initialized");
    }
}`
    },
    checklist: [
      "JDK 21+ and Python 3.11+ verified in terminal via `java -version` and `python --version`",
      "Git config set up with username and email (`git config --global user.name` / `user.email`)",
      "SSH key or GitHub Personal Access Token configured",
      "Compiled and executed both Hello World programs from raw terminal",
      "Repository pushed to GitHub with clean `.gitignore`"
    ],
    quiz: [
      {
        id: "d1-q1",
        question: "What is the primary difference between JDK and JRE?",
        options: [
          "JDK is for Python, JRE is for Java",
          "JDK includes compiler and dev tools; JRE only has the JVM and runtime libraries",
          "JRE compiles bytecode, JDK interprets it",
          "There is no difference; they are interchangeable terms"
        ],
        correctAnswer: 1,
        explanation: "JDK (Java Development Kit) contains the compiler (javac) and debugging tools. JRE only allows executing already-compiled `.class` bytecode."
      },
      {
        id: "d1-q2",
        question: "What does `git add .` do?",
        options: [
          "Immediately uploads files to GitHub",
          "Deletes untracked files from disk",
          "Stages modified and new files in the working directory to the Git index",
          "Creates a new Git branch"
        ],
        correctAnswer: 2,
        explanation: "`git add .` stages all modifications in the current directory tree into the staging area ready for the next commit."
      },
      {
        id: "d1-q3",
        question: "Why should `__pycache__` and `*.class` files never be committed to Git?",
        options: [
          "They are compiled/transient machine artifacts that should be generated locally by build tools",
          "GitHub rejects repositories with binary files",
          "They contain database credentials",
          "Git cannot hash files ending in .class"
        ],
        correctAnswer: 0,
        explanation: "Transient build artifacts bloat repositories, cause merge conflicts, and should always be generated reproducibly from source code."
      }
    ],
    interviewQuestions: [
      {
        question: "Can you explain the compilation and execution pipeline of Java vs Python?",
        answer: "Java uses a two-step model: javac compiles human-readable source (.java) into platform-independent bytecode (.class). The JVM executes this bytecode, using a JIT (Just-In-Time) compiler to convert frequently executed bytecode to native machine code. Python compiles source (.py) into bytecode (.pyc) automatically in memory, which the CPython Virtual Machine immediately interprets loop-by-loop.",
        tips: "Highlight the term 'bytecode' and mention that JVM's JIT compilation provides significant speed advantages for long-running backend services."
      },
      {
        question: "What is the difference between git fetch and git pull?",
        answer: "`git fetch` downloads commits, refs, and branches from the remote repository without altering your current working branch. `git pull` performs a `git fetch` followed immediately by a `git merge` (or `rebase`) into your active branch.",
        tips: "Interviewers like when you explain that `git fetch` is safer for inspecting remote changes before merging."
      }
    ],
    reflectionPrompt: "Why is command-line fluency and understanding compilation mechanics essential for a backend developer instead of relying 100% on IDE shortcut buttons?",
    measurableCriteria: "Learner can navigate directories via terminal, compile and run Java & Python scripts with arguments, and push cleanly to GitHub without IDE assistance.",
    videoTutorial: {
      title: "Git & GitHub Complete Practical Course for Beginners",
      embedId: "RGOj5yH7evk",
      channel: "freeCodeCamp",
      duration: "1 hour 8 mins",
      takeaway: "Master terminal commands, staging, commits, and pushing to remote repositories without fear."
    },
    resources: [
      {
        title: "Official Java Getting Started Documentation",
        purpose: "Official Oracle documentation on installing JDK and writing first applications",
        url: "https://dev.java/learn/",
        isOfficial: true
      },
      {
        title: "Official Python Tutorial: Using the Python Interpreter",
        purpose: "CPython command-line usage and script invocation",
        url: "https://docs.python.org/3/tutorial/interpreter.html",
        isOfficial: true
      },
      {
        title: "Git Official Documentation: Everyday Git",
        purpose: "Essential everyday Git commands reference",
        url: "https://git-scm.com/docs/gittutorial",
        isOfficial: true
      }
    ]
  },
  {
    day: 2,
    title: "Variables, Data Types, Operators, Type Conversion & I/O",
    subtitle: "Statically typed Java vs dynamically typed Python: memory representation, casting, and safety",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Deeply contrast static typing in Java (primitives vs wrapper types) with dynamic typing in Python (everything is an object)",
      "Understand memory allocation: Stack vs Heap allocation for variables and references",
      "Perform safe explicit type conversions and handle parsing exceptions (`NumberFormatException`, `ValueError`)",
      "Build robust CLI input handling with scanner/input validation"
    ],
    keyTerminology: [
      {
        term: "Static Typing vs Dynamic Typing",
        definition: "Static typing checks types at compile time (Java); dynamic typing binds types to values at runtime (Python).",
        analogy: "Static typing is packing your luggage with strict weight tags before leaving; dynamic typing is having a flexible bag that you inspect whenever you pull something out."
      },
      {
        term: "Stack vs Heap Memory",
        definition: "The Stack stores thread execution frames and primitive local variables. The Heap stores all objects and instances, managed by garbage collection.",
        analogy: "The stack is a quick notepad on your desk; the heap is the warehouse storage room where everything is cataloged."
      },
      {
        term: "Primitive vs Reference Type (Java)",
        definition: "Primitives (int, double, boolean) store raw bit values directly on stack. Reference types (Integer, String, Objects) store 32/64-bit pointers to heap memory.",
        analogy: "A primitive is holding cash in your pocket; a reference type is holding an ATM receipt with an account number."
      }
    ],
    conceptExplanation: {
      what: "Variables are named memory storage locations. Data types declare the size, format, and operations that can be performed on the memory.",
      whyNeeded: "Backend applications parse incoming JSON payloads, HTTP headers, and database rows. If your type conversions are sloppy, a user input like `amount = 'fifty'` will crash your server with an unhandled exception.",
      howItWorks: "In Java, variable types are fixed at declaration. In Python, variables are labels attached to objects in memory; reassignment points the label to another object.",
      beginnerMistakes: [
        "Comparing Java strings using `==` instead of `.equals()` (comparing memory references instead of value)",
        "Dividing two integers in Java expecting a decimal (`5 / 2 == 2`, not `2.5`)",
        "Implicitly trusting `input()` in Python without typecasting or catching `ValueError`",
        "Confusing `null` (Java) with `None` (Python) and crashing with `NullPointerException`"
      ],
      backendRelevance: "DTOs (Data Transfer Objects), database columns, and API request schemas rely on strict type contracts. Knowing your types prevents arithmetic overflows and database serialization bugs.",
      interviewerPerspective: "Why does `Integer a = 127; Integer b = 127; a == b` evaluate to true, but with 128 it evaluates to false in Java? (Integer caching pool from -128 to 127).",
      howToProveUnderstanding: "Write a command-line currency converter that parses string inputs safely, prevents negative values, and handles non-numeric errors cleanly in both languages."
    },
    javaCodeSnippet: {
      title: "SafeTypeConverter.java",
      code: `import java.util.Scanner;

public class SafeTypeConverter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter payment amount: ");
        String rawInput = scanner.nextLine();

        try {
            // Explicit parsing from String to double
            double amount = Double.parseDouble(rawInput.trim());
            if (amount <= 0) {
                System.out.println("Error: Amount must be positive.");
                return;
            }
            double processingFee = amount * 0.025; // 2.5% fee
            double total = amount + processingFee;
            System.out.printf("Base: ₹%.2f | Fee: ₹%.2f | Total: ₹%.2f%n", amount, processingFee, total);
        } catch (NumberFormatException e) {
            System.out.println("Invalid numeric input. Please enter digits only.");
        } finally {
            scanner.close();
        }
    }
}`,
      explanation: "Uses `Double.parseDouble()` inside a try-catch to guard against `NumberFormatException` while calculating financial arithmetic."
    },
    pythonCodeSnippet: {
      title: "safe_type_converter.py",
      code: `def calculate_fee():
    raw_input = input("Enter payment amount: ").strip()
    try:
        amount = float(raw_input)
        if amount <= 0:
            print("Error: Amount must be positive.")
            return
        
        processing_fee = round(amount * 0.025, 2)
        total = round(amount + processing_fee, 2)
        print(f"Base: ₹{amount:.2f} | Fee: ₹{processing_fee:.2f} | Total: ₹{total:.2f}")
    except ValueError:
        print("Invalid numeric input. Please enter digits only.")

if __name__ == "__main__":
    calculate_fee()`,
      explanation: "Python uses `float(raw_input)` which raises `ValueError` if the user enters non-numeric text. Safe and predictable."
    },
    practicalDeliverable: {
      title: "CLI Transaction Parser in Java and Python",
      description: "Write a CLI tool in both Java and Python that prompts the user for 3 fields: user ID (integer), transaction amount (decimal), and currency (string). Validate all fields, reject malformed strings, and compute taxes.",
      acceptanceCriteria: [
        "Rejects negative or zero amounts with clear error messages",
        "Catches `NumberFormatException` in Java and `ValueError` in Python",
        "Outputs cleanly formatted currency strings",
        "Both programs run from terminal with zero crashes on bad inputs"
      ]
    },
    debuggingTask: {
      problemTitle: "String Equality & Integer Division Pitfall",
      language: "java",
      buggyCode: `String role1 = new String("ADMIN");
String role2 = "ADMIN";
if (role1 == role2) {
    int quota = 5 / 2; // Expecting 2.5
    System.out.println("Quota is: " + quota);
}`,
      bugExplanation: "`==` compares memory references. `new String('ADMIN')` creates a distinct heap object, so `role1 == role2` evaluates to false. Also `5 / 2` performs integer truncation yielding `2`.",
      fixedCode: `String role1 = new String("ADMIN");
String role2 = "ADMIN";
if (role1.equals(role2)) {
    double quota = 5.0 / 2.0; // 2.5
    System.out.println("Quota is: " + quota);
}`
    },
    checklist: [
      "Understood differences between Java's 8 primitive types and their wrapper classes",
      "Explained Stack vs Heap allocation for objects",
      "Correctly implemented `String.equals()` in Java vs `==` in Python",
      "Handled `NumberFormatException` and `ValueError` without program crashes",
      "Completed CLI transaction parser in both languages"
    ],
    quiz: [
      {
        id: "d2-q1",
        question: "In Java, what does `str1 == str2` compare?",
        options: [
          "The character sequence length of both strings",
          "The Unicode character values inside both strings",
          "The memory addresses (object references) of both string instances",
          "Whether both strings are non-empty"
        ],
        correctAnswer: 2,
        explanation: "In Java, `==` on reference types compares memory reference addresses. `.equals()` must be used to compare contents."
      },
      {
        id: "d2-q2",
        question: "What is the result of `type(5 / 2)` in Python 3?",
        options: [
          "`<class 'int'>` with value 2",
          "`<class 'float'>` with value 2.5",
          "`<class 'double'>` with value 2.5",
          "SyntaxError"
        ],
        correctAnswer: 1,
        explanation: "In Python 3, single slash `/` always produces floating point division (2.5), whereas `//` is floor division."
      },
      {
        id: "d2-q3",
        question: "Why does Java have primitive types like `int` alongside `Integer`?",
        options: [
          "Primitives are legacy code that cannot be removed",
          "Primitives store direct values on the stack for high CPU performance and low memory overhead",
          "Integer cannot be used in methods",
          "Primitives are only for Android development"
        ],
        correctAnswer: 1,
        explanation: "Primitives reside directly in memory without heap object headers or pointer indirection, making arithmetic calculations much faster."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between Primitive and Reference types in Java? How does memory allocation differ?",
        answer: "Primitive types (byte, short, int, long, float, double, char, boolean) store raw binary values directly on the thread stack memory when declared inside methods. Reference types (like String, Custom Classes, and Wrapper types) store a 32-bit or 64-bit reference pointer on the stack, while the actual object state lives on the shared Heap memory, subject to garbage collection.",
        tips: "Mention wrapper types (Autoboxing and Unboxing) and the potential for NullPointerException when unboxing a null wrapper."
      },
      {
        question: "How does Python handle variable assignment and mutability compared to Java?",
        answer: "In Python, variables are names pointing to objects in memory. If you assign `b = a`, both names reference the exact same memory address (`id(a) == id(b)`). If the object is immutable (like `int`, `str`, `tuple`), modifying it creates a new object. In Java, primitives copy the value directly, while objects copy the reference pointer.",
        tips: "Mention `is` vs `==` in Python: `is` checks memory identity while `==` checks value equality."
      }
    ],
    reflectionPrompt: "How does static type checking save companies thousands of dollars in production compared to dynamic typing, and what are Python type hints doing to bridge this gap?",
    measurableCriteria: "Learner can accurately predict memory behavior, differentiate reference vs value equality, and write safe input-parsing routines with exception handling in both languages.",
    resources: [
      {
        title: "Dev.java: Data Types & Variables",
        purpose: "Official Java tutorial on primitive and reference types",
        url: "https://dev.java/learn/language-basics/variables/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Built-in Types",
        purpose: "CPython official guide to numeric, sequence, and mapping types",
        url: "https://docs.python.org/3/library/stdtypes.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 3,
    title: "Conditions, Loops, Nested Logic & Common Logic Problems",
    subtitle: "Branching, iterations, early returns, sentinel loops, and avoiding nested logic nightmares",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Master control flow: if/else-if chains, switch-case (Java pattern matching) vs match-case (Python)",
      "Understand loop constructs: for, while, do-while, enhanced for-each, and list comprehensions",
      "Apply the 'Early Return' / Guard Clause pattern to eliminate nested if-statement pyramids",
      "Solve classic algorithmic logic exercises: FizzBuzz, Prime checking, Palindrome numbers, and Fibonacci"
    ],
    keyTerminology: [
      {
        term: "Guard Clause (Early Return)",
        definition: "A conditional statement at the beginning of a function that returns immediately if preconditions are violated.",
        analogy: "A bouncer checking tickets at the door instead of letting everyone into the club and checking them inside the room."
      },
      {
        term: "Short-Circuit Evaluation",
        definition: "Logical operators (&& / and, || / or) stop evaluating as soon as the outcome is guaranteed without evaluating remaining terms.",
        analogy: "If the first question on an application asks 'Are you a licensed driver?' and you answer 'No', they don't bother reading your driving history."
      },
      {
        term: "Off-by-One Error",
        definition: "A logic error where a loop iterates one time too many or one time too few (common with `<` vs `<=`).",
        analogy: "Counting 10 fence posts and assuming there are 10 fence sections between them (there are only 9)."
      }
    ],
    conceptExplanation: {
      what: "Conditionals make decisions based on boolean logic; loops repeat instructions until an exit condition evaluates to false.",
      whyNeeded: "Every backend task involves logic checks: 'Has this user's subscription expired?', 'Loop through 500 orders and calculate sales tax', 'Retry payment API 3 times if network times out'.",
      howItWorks: "Compilers translate conditionals into conditional jump CPU instructions (JNE, JE). Loops maintain a condition register check on each cycle.",
      beginnerMistakes: [
        "Deeply nesting 5 levels of `if (x) { if (y) { if (z) { ... } } }` creating unmaintainable 'arrow' code",
        "Accidentally creating infinite loops by failing to update loop counter variables inside while loops",
        "Modifying a collection while actively iterating over it (throws `ConcurrentModificationException` in Java)",
        "Overcomplicating switch or match statements when a simple dictionary or map lookup suffices"
      ],
      backendRelevance: "Business logic in backend services consists largely of validation guard clauses, state transitions, and batch processing iterations.",
      interviewerPerspective: "Interviewers observe how cleanly you structure edge cases. Messy nested code suggests a candidate who hacks until it works rather than thinking methodically.",
      howToProveUnderstanding: "Refactor a 4-level nested conditional into clean guard clauses and solve FizzBuzz + Prime generation with optimal O(sqrt(n)) time."
    },
    javaCodeSnippet: {
      title: "GuardClausesAndPrimes.java",
      code: `public class GuardClausesAndPrimes {
    // Clean guard clauses instead of nested if-else
    public static String processOrder(double amount, boolean isVerified, boolean inStock) {
        if (amount <= 0) return "REJECTED: Invalid amount";
        if (!isVerified) return "REJECTED: User unverified";
        if (!inStock) return "REJECTED: Out of stock";
        return "SUCCESS: Order dispatched";
    }

    // Efficient prime check O(sqrt(N))
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 == 0 || n % 3 == 0) return false;
        for (int i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(processOrder(1500.0, true, true));
        System.out.println("Is 97 prime? " + isPrime(97));
    }
}`,
      explanation: "Demonstrates early returns to keep logic flat and an optimal 6k±1 prime checker."
    },
    pythonCodeSnippet: {
      title: "guard_clauses_and_primes.py",
      code: `def process_order(amount: float, is_verified: bool, in_stock: bool) -> str:
    # Clean guard clauses
    if amount <= 0:
        return "REJECTED: Invalid amount"
    if not is_verified:
        return "REJECTED: User unverified"
    if not in_stock:
        return "REJECTED: Out of stock"
    return "SUCCESS: Order dispatched"

def is_prime(n: int) -> bool:
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True

if __name__ == "__main__":
    print(process_order(1500.0, True, True))
    print(f"Is 97 prime? {is_prime(97)}")`,
      explanation: "Shows Pythonic guard clauses with type hints and identical mathematical time-complexity for primality testing."
    },
    practicalDeliverable: {
      title: "CLI ATM State Machine & Batch Logic Validator",
      description: "Build an interactive ATM simulator in both languages. Features: PIN verification with 3-attempt lockout, deposit/withdraw with overdraft protection, and an audit loop summarizing transactions.",
      acceptanceCriteria: [
        "Locks account after 3 consecutive wrong PIN entries using a loop counter",
        "Uses guard clauses for all withdrawal balance and minimum limit checks",
        "Provides clean break/continue loop exits on user selection",
        "Includes a unit test or verification script testing edge cases (e.g. withdraw ₹0, withdraw ₹999999)"
      ]
    },
    debuggingTask: {
      problemTitle: "Infinite While Loop & Short-Circuit Bug",
      language: "python",
      buggyCode: `user = None
# Checking authentication
if user is not None and user["is_admin"]: # Throws TypeError if user is not a dict
    print("Welcome admin")

count = 1
while count != 10:
    print(count)
    count += 2 # Bug: count will jump from 9 to 11 and never hit 10!`,
      bugExplanation: "The while condition `count != 10` causes an infinite loop because `count` increments by 2 (1, 3, 5, 7, 9, 11...). The condition must use `< 10`.",
      fixedCode: `user = None
if user and isinstance(user, dict) and user.get("is_admin"):
    print("Welcome admin")

count = 1
while count < 10:
    print(count)
    count += 2`
    },
    checklist: [
      "Refactored nested if-statements into flat guard clauses",
      "Understood short-circuit evaluation in boolean expressions",
      "Implemented FizzBuzz and Prime checking in both Java & Python",
      "Constructed the ATM State Machine with 3-attempt lockout mechanism",
      "Avoided infinite loops and off-by-one boundary errors"
    ],
    quiz: [
      {
        id: "d3-q1",
        question: "What is the primary architectural benefit of using 'Guard Clauses'?",
        options: [
          "It makes the CPU run faster through machine-code caching",
          "It reduces cognitive complexity and nesting indentation, making failure paths obvious early",
          "It forces the compiler to ignore exceptions",
          "It eliminates the need for unit testing"
        ],
        correctAnswer: 1,
        explanation: "Guard clauses fail fast at the top of a function, keeping the 'happy path' unindented and easy to read and maintain."
      },
      {
        id: "d3-q2",
        question: "In the expression `if (user != null && user.isActive())`, what prevents a NullPointerException when `user` is null?",
        options: [
          "Java's garbage collector suppresses null errors",
          "Short-circuit evaluation: because `user != null` is false, the second operand is never evaluated",
          "The JVM automatically initializes a mock user",
          "The `.isActive()` method handles null automatically"
        ],
        correctAnswer: 1,
        explanation: "`&&` short-circuits: if the left-hand condition is false, the right-hand condition is never executed, preventing `NullPointerException`."
      },
      {
        id: "d3-q3",
        question: "Why is checking primality up to `sqrt(n)` sufficient?",
        options: [
          "Because numbers larger than square root cannot be divided",
          "If `n = a * b`, both factors cannot be greater than `sqrt(n)`. If no factor exists below it, none exists above it",
          "It is an approximation that works for 95% of numbers",
          "It is required by the Python interpreter"
        ],
        correctAnswer: 1,
        explanation: "Factors always appear in pairs (a * b = n). At least one factor must be less than or equal to the square root of n."
      }
    ],
    interviewQuestions: [
      {
        question: "How do you avoid the 'Arrow Anti-Pattern' (deeply nested if-else statements) in production code?",
        answer: "By applying Guard Clauses (Early Returns), extracting complex conditions into descriptive helper methods, using polymorphism or strategy patterns for state handling, and employing switch/match statements instead of long `else if` chains.",
        tips: "Interviewers want to see that you care about code maintainability and team readability."
      },
      {
        question: "What is an off-by-one error, and how do you prevent it when dealing with 0-indexed data structures?",
        answer: "An off-by-one error occurs when an iterative loop executes one time too many or one time too few, typically by confusing `< length` with `<= length`. In 0-indexed structures with size N, valid indices are 0 to N-1. Best practices include using standard idioms (`i = 0; i < length; i++`), enhanced for-each loops, or stream/iterator abstractions.",
        tips: "Give an example of iterating an array of length 5 and accessing index 5, which triggers ArrayIndexOutOfBoundsException."
      }
    ],
    reflectionPrompt: "Look at any old college assignment code you wrote. How many nested if-else blocks were there, and how would guard clauses make it look like professional production code?",
    measurableCriteria: "Learner can refactor complex conditional code into clean guard clauses and implement iterative algorithms with verified edge cases.",
    resources: [
      {
        title: "Dev.java: Control Flow Statements",
        purpose: "Official guide on if/else, switch expressions, and loops",
        url: "https://dev.java/learn/language-basics/control-flow/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: More Control Flow Tools",
        purpose: "Official Python guide covering for, if, range, and match statements",
        url: "https://docs.python.org/3/tutorial/controlflow.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 4,
    title: "Methods, Functions, Parameters, Scope, Call Stack & Debugging",
    subtitle: "Pass-by-value vs pass-by-reference semantics, call stack execution, and interactive debugging",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Understand how the call stack manages function activation frames and local variable lifetimes",
      "Grasp the golden rule: Java and Python are strictly PASS-BY-VALUE (where the value can be an object reference)",
      "Master method overloading (Java) vs default/keyword arguments and `*args/**kwargs` (Python)",
      "Use interactive debugging breakpoints, step-over, step-into, and watch variables instead of `System.out.println`"
    ],
    keyTerminology: [
      {
        term: "Call Stack & Stack Frame",
        definition: "A memory structure that stores information about active subroutines. Each function call pushes a frame containing local variables, parameters, and return address.",
        analogy: "A stack of plates in a cafeteria; each new task adds a plate on top, and only the top plate can be worked on until it is removed."
      },
      {
        term: "Pass-by-Value",
        definition: "The parameter receives a copy of the actual argument's value. For reference types, the value passed is a copy of the memory address reference.",
        analogy: "Giving someone a photocopy of your house key. They can enter and repaint your walls (mutate state), but if they throw the key away, your original key remains unchanged."
      },
      {
        term: "Pure Function",
        definition: "A function where the return value is determined solely by its arguments, without observable side effects (no mutating external state).",
        analogy: "A pocket calculator: 2 + 2 always equals 4, and calculating it doesn't change your bank account balance."
      }
    ],
    conceptExplanation: {
      what: "Functions and methods package reusable logic with clear inputs and outputs, establishing variable scope and call frames.",
      whyNeeded: "Monolithic scripts cannot be tested, reasoned about, or maintained. Backend architectures rely on granular, single-responsibility functions.",
      howItWorks: "When a function is called, the CPU pushes a stack frame containing arguments and local pointers. On return, the frame pops off the stack, deallocating local primitives.",
      beginnerMistakes: [
        "Believing Java or Python is 'pass-by-reference' because modifying an object's fields inside a method changes the original object",
        "Reassigning a parameter reference inside a function and expecting the caller's variable to point to the new object",
        "Writing 200-line 'god methods' that do validation, database calls, email sending, and formatting all at once",
        "Using mutable default arguments in Python (`def append_to(val, my_list=[])`) which creates shared state across all invocations"
      ],
      backendRelevance: "Service layer methods in Spring Boot and FastAPI receive DTOs, execute business transactions, and return responses. Proper scoping prevents concurrency race conditions.",
      interviewerPerspective: "A classic technical interview trap: 'Is Java pass-by-value or pass-by-reference?' The answer is ALWAYS strictly pass-by-value. You must articulate how reference passing works.",
      howToProveUnderstanding: "Write a function demonstrating that reassigning an object reference parameter has no effect on the caller, while mutating an internal field does."
    },
    javaCodeSnippet: {
      title: "PassByValueProof.java",
      code: `public class PassByValueProof {
    static class Account {
        double balance;
        Account(double balance) { this.balance = balance; }
    }

    public static void modify(int num, Account acc) {
        num = 999;                    // Primitives: copy is modified, original caller unchanged
        acc.balance += 500.0;          // Mutating state through copied reference
        acc = new Account(0.0);        // Reassigning local reference: caller NOT affected!
    }

    public static void main(String[] args) {
        int x = 10;
        Account myAcc = new Account(1000.0);
        modify(x, myAcc);

        System.out.println("x after modify: " + x);                       // 10
        System.out.println("myAcc balance after modify: " + myAcc.balance); // 1500.0 (not 0.0)
    }
}`,
      explanation: "Proves Java is strictly pass-by-value: `acc = new Account(0.0)` reassigns the local parameter pointer without affecting `myAcc`."
    },
    pythonCodeSnippet: {
      title: "pass_by_value_proof.py",
      code: `class Account:
    def __init__(self, balance: float):
        self.balance = balance

def modify(num: int, acc: Account, items: list = None):
    if items is None: # Avoid mutable default argument trap!
        items = []
    
    num = 999
    acc.balance += 500.0
    acc = Account(0.0) # Local reference reassignment

x = 10
my_acc = Account(1000.0)
modify(x, my_acc)

print(f"x: {x}")                          # 10
print(f"my_acc balance: {my_acc.balance}") # 1500.0 (not 0.0)`,
      explanation: "Demonstrates Python's identical pass-by-object-reference-value semantics and avoids the mutable default argument bug."
    },
    practicalDeliverable: {
      title: "Clean Modular Calculator & Breakpoint Debugging Session",
      description: "Decompose a financial tax calculator into single-responsibility pure functions: calculateGross(), applyTaxBracket(), deductExemptions(), and generateSlip(). Set breakpoints and record variable watch values during execution.",
      acceptanceCriteria: [
        "Each function is pure with zero side effects on external state",
        "Includes default arguments in Python and overloaded methods in Java",
        "Learner captures a screenshot or notes stepping through stack frames in IDE debugger",
        "Verified with 4 distinct tax bracket test cases"
      ]
    },
    debuggingTask: {
      problemTitle: "Python Mutable Default Argument Trap",
      language: "python",
      buggyCode: `def add_user(username, user_list=[]):
    user_list.append(username)
    return user_list

print(add_user("Alice")) # ['Alice']
print(add_user("Bob"))   # Expected ['Bob'], but gets ['Alice', 'Bob']!`,
      bugExplanation: "In Python, default arguments are evaluated ONCE when the function definition is executed, NOT each time the function is called. The list is shared across calls.",
      fixedCode: `def add_user(username, user_list=None):
    if user_list is None:
        user_list = []
    user_list.append(username)
    return user_list

print(add_user("Alice")) # ['Alice']
print(add_user("Bob"))   # ['Bob']`
    },
    checklist: [
      "Visualized Stack Frames pushing and popping during recursive or nested calls",
      "Explained why Java and Python are strictly pass-by-value",
      "Avoided the mutable default argument bug in Python",
      "Executed a step-over and step-into debugging session using IDE breakpoints",
      "Refactored repetitive code into small, single-responsibility functions"
    ],
    quiz: [
      {
        id: "d4-q1",
        question: "Is Java pass-by-value or pass-by-reference?",
        options: [
          "Primitives are pass-by-value, objects are pass-by-reference",
          "Strictly pass-by-value at all times",
          "Pass-by-reference if the object implements Serializable",
          "Determined by the JVM configuration"
        ],
        correctAnswer: 1,
        explanation: "Java is ALWAYS pass-by-value. When an object is passed, the value passed to the method is the copy of the reference pointer."
      },
      {
        id: "d4-q2",
        question: "What happens when you define `def register(log=[])` in Python?",
        options: [
          "Python creates a fresh new list every time the function is invoked",
          "A single list object is created at definition time and shared across all invocations that omit the argument",
          "Python throws a SyntaxError because default arguments must be immutable",
          "The list is stored in thread-local storage"
        ],
        correctAnswer: 1,
        explanation: "Default parameter expressions in Python are evaluated once at module load time. Reusing a mutable default leaks state across calls."
      },
      {
        id: "d4-q3",
        question: "What causes a `StackOverflowError` in recursive functions?",
        options: [
          "The JVM heap memory runs out of space for objects",
          "Recursive calls keep pushing new stack frames without reaching a base case until stack memory is exhausted",
          "The compiler fails to optimize loops",
          "Variables are defined without data types"
        ],
        correctAnswer: 1,
        explanation: "Each recursive call adds an activation frame to the thread stack. Without a terminating base case, the stack limit is exceeded."
      }
    ],
    interviewQuestions: [
      {
        question: "If I pass an ArrayList or List into a method in Java/Python and call `.add()` or `.append()`, does the caller see the change? What if I reassign it (`list = new ArrayList()`)?",
        answer: "Calling `.add()` or `.append()` mutates the underlying heap object that both the caller's reference and the method's copied parameter reference point to, so the caller sees the added element. However, reassigning `list = new ArrayList()` simply updates the method's local copy of the pointer to point to a new heap address; the caller's original variable continues pointing to the original object.",
        tips: "Use a quick whiteboard sketch showing two pointer arrows pointing to the same memory block to impress interviewers."
      },
      {
        question: "What is the difference between Method Overloading and Method Overriding?",
        answer: "Method Overloading (Compile-time/Static polymorphism) occurs within the same class when methods share the same name but have different parameter lists (count, types, or order). Method Overriding (Runtime/Dynamic polymorphism) occurs when a subclass provides a specific implementation of a method already declared in its superclass or interface with identical signature.",
        tips: "Mention that Python does not support classic compile-time method overloading, relying instead on default parameters and variable-length arguments."
      }
    ],
    reflectionPrompt: "Why is interactive breakpoint debugging 10x faster than writing twenty 'print' statements, especially when tracing an intermittent bug across multiple service files?",
    measurableCriteria: "Learner can accurately predict parameter mutation behavior, explain call stack mechanics, and diagnose issues with a debugger instead of print statements.",
    resources: [
      {
        title: "Dev.java: Defining Methods",
        purpose: "Official guide to method declarations, parameters, and return types",
        url: "https://dev.java/learn/classes-objects/defining-methods/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Defining Functions",
        purpose: "Argument passing, keyword arguments, and lambda functions",
        url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
        isOfficial: true
      }
    ]
  },
  {
    day: 5,
    title: "Strings, Arrays, Lists & String Manipulation Algorithms",
    subtitle: "String immutability, memory pools, dynamic resizing lists, and two-pointer traversal patterns",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Understand String Immutability and the String Constant Pool in Java vs string interning in Python",
      "Contrast fixed-size arrays (`int[]`) with dynamic contiguous arrays (`ArrayList` vs `list`)",
      "Master efficient string construction using `StringBuilder` to avoid quadratic O(N^2) memory reallocation",
      "Implement core string and array algorithms: Two-Pointer palindrome, reverse in-place, anagram detection, and tokenizing"
    ],
    keyTerminology: [
      {
        term: "String Immutability",
        definition: "Once created, the internal character array of a string cannot be modified. Any modification creates an entirely new string object in memory.",
        analogy: "A printed book page: if you want to change a sentence, you must print a brand-new page rather than erasing the ink."
      },
      {
        term: "String Pool (Interning)",
        definition: "A special memory cache in the JVM Heap and CPython where identical string literals share a single object instance to conserve RAM.",
        analogy: "A shared library where everyone who wants to read Hamlet shares the same physical copy instead of printing a new copy for each reader."
      },
      {
        term: "Two-Pointer Technique",
        definition: "An algorithmic pattern where two pointers iterate through a data structure concurrently (e.g. from opposite ends) to solve problems in O(N) time with O(1) space.",
        analogy: "Two people walking from opposite ends of a bridge toward each other to meet in the middle."
      }
    ],
    conceptExplanation: {
      what: "Strings represent character sequences, while arrays and lists store ordered collections of elements in contiguous memory.",
      whyNeeded: "90% of backend payloads are text (JSON, CSV, URLs, Auth tokens). Manipulating strings naively in loops causes severe server memory bottlenecks and latency spikes.",
      howItWorks: "Because strings are immutable, concatenating in a loop (`str += 'a'`) allocates a new buffer, copies all previous characters, and discards the old string on every iteration, leading to O(N^2) time.",
      beginnerMistakes: [
        "Using string concatenation `+` inside a loop of 10,000 iterations instead of `StringBuilder` or `''.join()`",
        "Assuming `ArrayList.size()` is fixed like a native Java array",
        "Ignoring character case and non-alphanumeric punctuation when validating palindromes",
        "Confusing array index access O(1) with searching an unsorted array O(N)"
      ],
      backendRelevance: "Parsing incoming request headers, sanitizing user inputs (preventing XSS/SQLi), formatting CSV/PDF exports, and token generation all rely on efficient string handling.",
      interviewerPerspective: "Interviewers frequently use string and array questions (like Valid Anagram or Longest Common Prefix) to assess if you can optimize time complexity and handle edge cases.",
      howToProveUnderstanding: "Solve Valid Anagram and Palindrome using the Two-Pointer technique in O(N) time and O(1) extra space in both languages."
    },
    javaCodeSnippet: {
      title: "EfficientStringsAndPointers.java",
      code: `public class EfficientStringsAndPointers {
    // Two-Pointer In-Place Palindrome Check: O(N) time, O(1) auxiliary space
    public static boolean isPalindrome(String s) {
        if (s == null) return false;
        int left = 0, right = s.length() - 1;
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }

    // Efficient String Construction: O(N) instead of O(N^2)
    public static String buildCsvRow(String[] items) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < items.length; i++) {
            sb.append(items[i]);
            if (i < items.length - 1) sb.append(",");
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("Is 'A man, a plan, a canal: Panama' a palindrome? " + 
                           isPalindrome("A man, a plan, a canal: Panama"));
    }
}`,
      explanation: "Uses `StringBuilder` for O(N) concatenation and the Two-Pointer technique with zero string copy overhead."
    },
    pythonCodeSnippet: {
      title: "efficient_strings_and_pointers.py",
      code: `def is_palindrome(s: str) -> bool:
    # Two-pointer O(N) time, O(1) space
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

# Efficient joining: O(N)
def build_csv_row(items: list[str]) -> str:
    return ",".join(items)

if __name__ == "__main__":
    sample = "A man, a plan, a canal: Panama"
    print(f"Is '{sample}' palindrome? {is_palindrome(sample)}")`,
      explanation: "Demonstrates Python's `isalnum()` with two pointers and the idiomatic `','.join(items)` for O(N) string construction."
    },
    practicalDeliverable: {
      title: "Backend Log Sanitizer & Token Formatter",
      description: "Build a log-sanitization utility in both languages. It parses raw web access logs, masks credit card numbers (keeping only last 4 digits), strips trailing whitespace, and formats as clean JSON/CSV lines.",
      acceptanceCriteria: [
        "Processes multiline input streams without out-of-memory errors",
        "Uses `StringBuilder` (Java) and `''.join()` (Python) for building output strings",
        "Masks 16-digit card numbers with `****-****-****-1234` format using regex or character scanning",
        "Includes automated unit tests verifying edge cases (empty strings, multiple cards, special characters)"
      ]
    },
    debuggingTask: {
      problemTitle: "Accidental O(N^2) String Accumulation Bug",
      language: "java",
      buggyCode: `public static String generateReport(List<String> records) {
    String report = "";
    for (String record : records) {
        report += record + "\\n"; // Severe performance bug!
    }
    return report;
}`,
      bugExplanation: "In Java, string concatenation inside a loop creates a new `StringBuilder` and copies all previous characters on every iteration. With 50,000 records, this creates billions of intermediate character copies and kills throughput.",
      fixedCode: `public static String generateReport(List<String> records) {
    StringBuilder sb = new StringBuilder(records.size() * 32);
    for (String record : records) {
        sb.append(record).append("\\n");
    }
    return sb.toString();
}`
    },
    checklist: [
      "Explained String Immutability and the String Constant Pool in detail",
      "Benchmarked `StringBuilder` / `''.join()` vs `+` concatenation inside loops",
      "Implemented the Two-Pointer Palindrome verification algorithm",
      "Completed the Backend Log Sanitizer deliverable",
      "Understood dynamic array doubling (`ArrayList` amortized O(1) appends)"
    ],
    quiz: [
      {
        id: "d5-q1",
        question: "Why does repeated string concatenation with `+` inside a loop lead to poor performance?",
        options: [
          "Strings are stored on disk instead of RAM",
          "Because strings are immutable, each concatenation allocates a new string and copies all previous characters, leading to O(N^2) time",
          "The Java compiler crashes after 100 concatenations",
          "Python does not support the `+` operator on strings"
        ],
        correctAnswer: 1,
        explanation: "String immutability means every `+=` creates a brand-new object and copies the old content, causing quadratic O(N^2) time complexity."
      },
      {
        id: "d5-q2",
        question: "What is the time complexity of looking up an element by index in an `ArrayList` (Java) or `list` (Python)?",
        options: [
          "O(N)",
          "O(log N)",
          "O(1)",
          "O(N^2)"
        ],
        correctAnswer: 2,
        explanation: "Contiguous arrays calculate the exact memory offset in constant O(1) time: `address = base_address + (index * element_size)`."
      },
      {
        id: "d5-q3",
        question: "What does `String s1 = 'code'; String s2 = 'code';` do in Java memory?",
        options: [
          "Allocates two completely independent objects in heap memory",
          "Both `s1` and `s2` refer to the exact same shared object in the String Constant Pool",
          "Throws a duplicate variable compile error",
          "Creates a circular linked list"
        ],
        correctAnswer: 1,
        explanation: "String literals are automatically interned into the String Constant Pool to save memory. Both references point to the same pooled instance."
      }
    ],
    interviewQuestions: [
      {
        question: "Why are Strings immutable in Java and Python? What architectural benefits does this bring?",
        answer: "1. Security: Strings carry sensitive parameters like database connection URLs, usernames, passwords, and network sockets; immutability guarantees values cannot be altered by malicious code. 2. Thread Safety: Immutable objects are inherently thread-safe and can be shared across concurrent threads without locks. 3. Caching & HashCode: The hash code can be computed once and cached, making Strings ideal keys for HashMaps. 4. Memory Optimization: Enables the String Constant Pool.",
        tips: "Highlight the HashMap hashcode caching benefit—interviewers love seeing this connection to data structures."
      },
      {
        question: "How does dynamic resizing work in an `ArrayList` or Python `list` when capacity is exceeded?",
        answer: "When internal capacity is reached, the list allocates a new, larger array (typically 1.5x in Java or ~1.125x in Python), copies all existing elements over, and reclaims the old array. While a resizing operation costs O(N), because it happens infrequently, the amortized cost per append operation remains O(1).",
        tips: "Mention the word 'Amortized O(1)' and explain why pre-sizing collections with initial capacity prevents unnecessary resizes in high-throughput services."
      }
    ],
    reflectionPrompt: "How many times in production code do backend APIs crash with OutOfMemory errors simply because an engineer built a large report with string concatenation instead of streaming or StringBuilder?",
    measurableCriteria: "Learner can demonstrate two-pointer traversal, explain string memory pooling, and eliminate quadratic string concatenation in loops.",
    resources: [
      {
        title: "Dev.java: Numbers and Strings",
        purpose: "Official Java documentation on String, StringBuilder, and memory representation",
        url: "https://dev.java/learn/numbers-strings/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Text Sequence Type — str",
        purpose: "CPython official guide to string methods, slicing, and formatting",
        url: "https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str",
        isOfficial: true
      }
    ]
  }
];
