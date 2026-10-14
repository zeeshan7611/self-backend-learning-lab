import { DayLesson } from '../types';

export const DAYS_6_TO_10: DayLesson[] = [
  {
    day: 6,
    title: "Object-Oriented Programming: Encapsulation, Inheritance & Polymorphism",
    subtitle: "Real-world OOP: Domain modeling, composition over inheritance, abstract classes vs interfaces",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Master Encapsulation: private state, validation in getters/setters, and immutability",
      "Understand Inheritance vs Composition: why 'Favor Composition Over Inheritance' is modern backend dogma",
      "Implement Polymorphism using Java Interfaces & Abstract Classes vs Python Protocols & Duck Typing",
      "Model a realistic backend domain: Bank Accounts, Transactions, and Payment Gateways"
    ],
    keyTerminology: [
      {
        term: "Encapsulation",
        definition: "Bundling data and methods that manipulate that data into a single unit, hiding internal state from unauthorized direct modification.",
        analogy: "A medical capsule: the medicine inside is sealed and only released through designated channels, preventing contamination."
      },
      {
        term: "Polymorphism (Dynamic Dispatch)",
        definition: "The ability of different classes to respond to the same method invocation in their own unique way at runtime.",
        analogy: "A universal USB port: whether you plug in a mouse, keyboard, or flash drive, the computer calls the same read/write interface."
      },
      {
        term: "Composition over Inheritance",
        definition: "Designing objects by combining simple components ('has-a') rather than inheriting broad behaviors from parent classes ('is-a').",
        analogy: "Building with Lego bricks: assembling interchangeable parts rather than modifying a monolithic concrete sculpture."
      }
    ],
    conceptExplanation: {
      what: "OOP structures software around entities (objects) that maintain state and expose behavior through interfaces.",
      whyNeeded: "Backend applications mirror business domains: Users, Orders, Invoices, Payments. Clean OOP prevents logic leaks and simplifies maintenance.",
      howItWorks: "Classes serve as heap memory blueprints. Dynamic dispatch tables (vtable in Java/C++) lookup method addresses at runtime based on the actual object instance.",
      beginnerMistakes: [
        "Making all class fields `public` or generating mindless getters/setters without invariant validation",
        "Creating deep 5-level inheritance hierarchies that break when business requirements change",
        "Confusing Java Interface (a contract of behavior) with an Abstract Class (a partial implementation template)",
        "Overusing multiple inheritance in Python causing the dreaded 'Diamond Problem'"
      ],
      backendRelevance: "Spring Boot services and FastAPI dependency injection rely on interfaces and abstract contracts to swap database drivers, mock payment gateways, and decouple layers.",
      interviewerPerspective: "Interviewers ask candidates to model a real payment system (Stripe/PayPal/UPI) using polymorphism to see if they understand interfaces and dependency inversion.",
      howToProveUnderstanding: "Build a PaymentProcessor interface with UPI, CreditCard, and NetBanking implementations, with zero `if-else (type == 'UPI')` branching in the caller."
    },
    javaCodeSnippet: {
      title: "PolymorphicPayments.java",
      code: `// Interface contract
interface PaymentGateway {
    boolean processPayment(double amount);
    String getProviderName();
}

class UpiPayment implements PaymentGateway {
    private final String vpa;
    public UpiPayment(String vpa) { this.vpa = vpa; }

    @Override
    public boolean processPayment(double amount) {
        System.out.printf("Processing ₹%.2f via UPI to %s%n", amount, vpa);
        return true;
    }
    @Override public String getProviderName() { return "UPI"; }
}

class CreditCardPayment implements PaymentGateway {
    private final String maskedCard;
    public CreditCardPayment(String cardNum) { 
        this.maskedCard = "****-" + cardNum.substring(cardNum.length() - 4); 
    }

    @Override
    public boolean processPayment(double amount) {
        System.out.printf("Charging ₹%.2f to Card %s%n", amount, maskedCard);
        return true;
    }
    @Override public String getProviderName() { return "CreditCard"; }
}

// Payment Service depends on abstraction, NOT concrete classes
class CheckoutService {
    public void checkout(PaymentGateway gateway, double amount) {
        System.out.println("Initiating checkout with: " + gateway.getProviderName());
        gateway.processPayment(amount);
    }
}`,
      explanation: "CheckoutService relies strictly on `PaymentGateway`. Adding a Crypto or PayPal payment requires zero modification to CheckoutService (Open/Closed Principle)."
    },
    pythonCodeSnippet: {
      title: "polymorphic_payments.py",
      code: `from abc import ABC, abstractmethod

class PaymentGateway(ABC):
    @abstractmethod
    def process_payment(self, amount: float) -> bool:
        pass
    
    @abstractmethod
    def get_provider_name(self) -> str:
        pass

class UpiPayment(PaymentGateway):
    def __init__(self, vpa: str):
        self._vpa = vpa # Encapsulated private field

    def process_payment(self, amount: float) -> bool:
        print(f"Processing ₹{amount:.2f} via UPI to {self._vpa}")
        return True

    def get_provider_name(self) -> str:
        return "UPI"

class CheckoutService:
    def checkout(self, gateway: PaymentGateway, amount: float):
        print(f"Initiating checkout with: {gateway.get_provider_name()}")
        gateway.process_payment(amount)

if __name__ == "__main__":
    service = CheckoutService()
    service.checkout(UpiPayment("rahul@oksbi"), 1250.0)`,
      explanation: "Python uses `abc.ABC` and `@abstractmethod` to enforce interface contracts, ensuring subclasses implement required behaviors."
    },
    practicalDeliverable: {
      title: "Extensible Notification & Billing System",
      description: "Build an object-oriented billing engine in Java and Python with an abstract `NotificationChannel` (Email, SMS, Slack) and `Invoice` domain class. Implement encapsulation with strict validation rules (e.g. invoice total cannot be negative).",
      acceptanceCriteria: [
        "All domain model attributes are private / protected with validated accessors",
        "Uses an abstract class or interface for notifications",
        "Supports adding new notification channels without altering billing logic",
        "Verified with automated test cases exercising polymorphic execution"
      ]
    },
    debuggingTask: {
      problemTitle: "Inheritance State Mutation Bug",
      language: "java",
      buggyCode: `class BankAccount {
    public double balance; // Bug: public field allows direct uncontrolled mutation!
    public void withdraw(double amt) { balance -= amt; }
}

class SavingsAccount extends BankAccount {
    public void withdraw(double amt) {
        // Bug: No validation or super call, balance can go negative
        balance -= (amt + 50); // ₹50 fee
    }
}`,
      bugExplanation: "Direct public field access breaks encapsulation. `SavingsAccount` allows balance to drop below zero without validation guards or overdraft limits.",
      fixedCode: `class BankAccount {
    private double balance;
    public BankAccount(double initial) { this.balance = Math.max(0, initial); }
    public double getBalance() { return balance; }
    
    public boolean withdraw(double amt) {
        if (amt > 0 && balance >= amt) {
            balance -= amt;
            return true;
        }
        return false;
    }
}`
    },
    checklist: [
      "Designed private fields with invariant validation rules",
      "Explained the difference between Interface and Abstract Class",
      "Implemented polymorphic dispatch without `instanceof` checks",
      "Refactored an inheritance hierarchy to use composition",
      "Completed the Notification & Billing System deliverable"
    ],
    quiz: [
      {
        id: "d6-q1",
        question: "Why should backend developers prefer Composition over Inheritance?",
        options: [
          "Inheritance is not supported in Java",
          "Inheritance tightly couples child classes to parent implementation details and breaks encapsulation if parent changes",
          "Composition uses less RAM in all operating systems",
          "Inheritance prevents writing unit tests"
        ],
        correctAnswer: 1,
        explanation: "Deep inheritance hierarchies create fragile coupling. Composition allows swapping swappable components at runtime with minimal blast radius."
      },
      {
        id: "d6-q2",
        question: "Can a class implement multiple interfaces in Java?",
        options: [
          "No, Java only allows single inheritance for everything",
          "Yes, Java supports multiple interface inheritance while restricting class inheritance to a single parent",
          "Only if the interfaces are marked as `public static`",
          "Only in Java 8 and below"
        ],
        correctAnswer: 1,
        explanation: "Java allows implementing multiple interfaces, providing multiple behavioral contracts while avoiding the multiple class inheritance diamond problem."
      },
      {
        id: "d6-q3",
        question: "In Python, how is an abstract method enforced at class instantiation?",
        options: [
          "By using the `virtual` keyword",
          "By inheriting from `abc.ABC` and decorating the method with `@abstractmethod`",
          "By naming the method `__abstract__`",
          "Python never enforces abstract methods"
        ],
        correctAnswer: 1,
        explanation: "Python's `abc` module prevents instantiation of a subclass if any `@abstractmethod` remains unimplemented."
      }
    ],
    interviewQuestions: [
      {
        question: "What are the SOLID principles and how do they apply to backend development?",
        answer: "S: Single Responsibility (a class has one reason to change). O: Open/Closed (open for extension, closed for modification via interfaces). L: Liskov Substitution (subclasses must be substitutable for base classes without breaking behavior). I: Interface Segregation (small, focused interfaces instead of bloated ones). D: Dependency Inversion (depend on abstractions, not concrete implementations).",
        tips: "Give a concrete example: 'Instead of our OrderService instantiating StripePayment directly, it depends on a PaymentGateway interface injected via Spring Boot or FastAPI dependency injection.'"
      },
      {
        question: "What is the difference between an Abstract Class and an Interface?",
        answer: "An interface defines a pure contract of behavior ('what' can be done) without holding state (aside from static constants), and a class can implement multiple interfaces. An abstract class is a partial blueprint ('what' and 'how') that can maintain instance variables, constructors, and default implementations, but a class can only inherit from one abstract class.",
        tips: "Mention that since Java 8, interfaces can have `default` and `static` methods, but they still cannot maintain instance state."
      }
    ],
    reflectionPrompt: "Why does relying on concrete classes rather than interfaces make writing unit tests nearly impossible when external services (like payment gateways or databases) are involved?",
    measurableCriteria: "Learner can design a modular domain model using encapsulation, interfaces, and composition, demonstrating polymorphism without type checking anti-patterns.",
    videoTutorial: {
      title: "Object Oriented Programming (OOP) in 20 Minutes",
      embedId: "pTB0EiLXUC8",
      channel: "Programming with Mosh",
      duration: "20 mins",
      takeaway: "Understand Encapsulation, Abstraction, Inheritance, and Polymorphism using simple real-world examples."
    },
    resources: [
      {
        title: "Dev.java: Object-Oriented Programming Concepts",
        purpose: "Official Java lessons on classes, objects, interfaces, and inheritance",
        url: "https://dev.java/learn/oop/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Classes and Inheritance",
        purpose: "CPython official guide to classes, method resolution order, and encapsulation",
        url: "https://docs.python.org/3/tutorial/classes.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 7,
    title: "Collections, Dictionaries/Maps, Sets, Iteration & Weekly Assessment",
    subtitle: "Internal mechanics of HashMaps, collision resolution, Set uniqueness, and Week 1 mastery test",
    week: 1,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Understand HashMap / Dictionary internal mechanics: hash functions, bucket arrays, collision resolution (chaining & treeification)",
      "Master the `equals()` and `hashCode()` contract in Java vs `__hash__` and `__eq__` in Python",
      "Utilize Sets for O(1) membership testing and deduplication",
      "Perform the Week 1 Comprehensive Assessment: live coding, debugging, and theory"
    ],
    keyTerminology: [
      {
        term: "Hash Collision",
        definition: "When two distinct keys produce the exact same bucket index via their hash codes.",
        analogy: "Two different guests being assigned the exact same locker number at a gym."
      },
      {
        term: "equals() and hashCode() Contract",
        definition: "If two objects are equal according to `equals()`, their `hashCode()` MUST return identical integer values.",
        analogy: "If two envelopes have identical mailing addresses, they must be delivered to the exact same mailbox."
      },
      {
        term: "Load Factor & Rehashing",
        definition: "The threshold (default 0.75 in Java) at which a hash table doubles its bucket capacity and recalculates indices for all entries.",
        analogy: "When a parking lot hits 75% capacity, the management opens a brand-new multi-story annex to avoid traffic jams."
      }
    ],
    conceptExplanation: {
      what: "Collections store groups of elements. HashMaps and Dictionaries associate unique keys with values, providing average O(1) lookup, insertion, and deletion.",
      whyNeeded: "95% of backend code relies on HashMaps: caching user sessions, indexing database query results, looking up configuration properties, and aggregating metrics.",
      howItWorks: "The key's hash code is mapped to an array bucket index: `index = hash(key) & (capacity - 1)`. Entries in the same bucket form a linked list (or balanced red-black tree in Java when >8 items).",
      beginnerMistakes: [
        "Overriding `equals()` without overriding `hashCode()`, causing objects to be lost inside HashMaps",
        "Mutating an object while it is currently being used as a key in a HashMap",
        "Using a List for lookup when a HashSet provides O(1) vs O(N) search time",
        "Iterating over collections and attempting to remove elements without using an explicit Iterator or `removeIf`"
      ],
      backendRelevance: "High-concurrency servers store routing tables, auth tokens, and cached DB records in memory maps (`ConcurrentHashMap` in Java). Misunderstanding hashing leads to catastrophic latency degradations.",
      interviewerPerspective: "Every single backend interview includes: 'Explain how HashMap works internally in Java/Python. What happens during a hash collision?'",
      howToProveUnderstanding: "Explain bucket indexing, write a custom key class correctly implementing `equals` and `hashCode`, and pass the Week 1 milestone exam."
    },
    javaCodeSnippet: {
      title: "ProperHashMapKey.java",
      code: `import java.util.*;

// Immutable and safe as a HashMap key
final class EmployeeKey {
    private final int id;
    private final String department;

    public EmployeeKey(int id, String department) {
        this.id = id;
        this.department = Objects.requireNonNull(department);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmployeeKey that)) return false;
        return id == that.id && department.equals(that.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, department); // Essential contract!
    }
}

public class ProperHashMapKey {
    public static void main(String[] args) {
        Map<EmployeeKey, String> map = new HashMap<>();
        EmployeeKey k1 = new EmployeeKey(101, "ENG");
        map.put(k1, "Senior Backend Lead");

        // Lookup with identical values in new instance
        EmployeeKey lookupKey = new EmployeeKey(101, "ENG");
        System.out.println("Result: " + map.get(lookupKey)); // Works because of hashCode/equals!
    }
}`,
      explanation: "Shows how overriding both `equals()` and `hashCode()` allows distinct object instances with identical state to retrieve entries from a HashMap."
    },
    pythonCodeSnippet: {
      title: "proper_dict_key.py",
      code: `from typing import NamedTuple

# NamedTuple automatically generates __hash__ and __eq__
class EmployeeKey(NamedTuple):
    id: int
    department: str

if __name__ == "__main__":
    staff_directory: dict[EmployeeKey, str] = {}
    
    k1 = EmployeeKey(101, "ENG")
    staff_directory[k1] = "Senior Backend Lead"
    
    # Lookup using newly created tuple with same values
    lookup_key = EmployeeKey(101, "ENG")
    print(f"Result: {staff_directory.get(lookup_key)}") # Returns 'Senior Backend Lead'`,
      explanation: "Python immutable NamedTuples or frozen dataclasses automatically provide correct `__hash__` and `__eq__` implementations for safe dictionary keys."
    },
    practicalDeliverable: {
      title: "In-Memory LRU Cache & Frequency Counter",
      description: "Build an in-memory word frequency and user-session cache in Java and Python. Implement key collision handling, deduplication with Sets, and measure lookup speed.",
      acceptanceCriteria: [
        "Correctly computes frequency count of 10,000 words in O(N) time",
        "Uses HashSet / Set for fast O(1) duplicate checks",
        "Includes custom key objects with verified `hashCode` and `equals` contracts",
        "Passes the Week 1 Assessment test suite"
      ]
    },
    debuggingTask: {
      problemTitle: "Broken Equals / HashCode Contract Bug",
      language: "java",
      buggyCode: `class Customer {
    int id;
    Customer(int id) { this.id = id; }
    // Overrode equals but forgot hashCode!
    public boolean equals(Object o) {
        return (o instanceof Customer c) && c.id == this.id;
    }
}

Map<Customer, String> m = new HashMap<>();
m.put(new Customer(1), "VIP");
System.out.println(m.get(new Customer(1))); // Prints null! Why?`,
      bugExplanation: "Without overriding `hashCode()`, Java uses System identity hash (memory address). Two distinct objects have different hashes, landing in different buckets, so `.get()` never finds the key.",
      fixedCode: `class Customer {
    int id;
    Customer(int id) { this.id = id; }
    public boolean equals(Object o) {
        return (o instanceof Customer c) && c.id == this.id;
    }
    public int hashCode() {
        return Integer.hashCode(id); // Fixed: matching hash code!
    }
}`
    },
    checklist: [
      "Explained the internal bucket array and hashing mechanics of HashMap",
      "Maintained the `equals()` and `hashCode()` contract in custom classes",
      "Utilized Sets for constant-time uniqueness checks",
      "Completed the in-memory cache and frequency counter deliverable",
      "Passed the Week 1 Comprehensive Assessment"
    ],
    quiz: [
      {
        id: "d7-q1",
        question: "What happens in a Java HashMap when two distinct keys return the same bucket index?",
        options: [
          "The second key overwrites the first key immediately",
          "A hash collision occurs: entries are chained in a LinkedList, and if bucket size exceeds 8, converted to a Red-Black Tree",
          "The JVM throws a ConcurrentModificationException",
          "The HashMap size shrinks by half"
        ],
        correctAnswer: 1,
        explanation: "Java handles collisions via chaining; when a bucket exceeds TREEIFY_THRESHOLD (8 entries) and table capacity >= 64, it converts the list to a red-black tree (O(log N) lookup)."
      },
      {
        id: "d7-q2",
        question: "If `a.equals(b) == true`, which of the following MUST be true according to the Java contract?",
        options: [
          "`a == b` must be true",
          "`a.hashCode() == b.hashCode()` must be true",
          "`a.compareTo(b) > 0` must be true",
          "`a` and `b` must share the same memory address"
        ],
        correctAnswer: 1,
        explanation: "The contract mandates: if two objects are equal, their hash codes MUST be identical. Violating this breaks hash-based collections."
      },
      {
        id: "d7-q3",
        question: "What is the average time complexity of looking up a key in a Python dictionary or Java HashMap?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N log N)"
        ],
        correctAnswer: 0,
        explanation: "Hash table lookups compute the hash and bucket index in constant O(1) average time."
      }
    ],
    interviewQuestions: [
      {
        question: "Walk me step-by-step through what happens when `map.put(key, value)` is called in Java.",
        answer: "1. The key's `hashCode()` is invoked, and a bitwise spread function is applied to minimize collisions. 2. The bucket index is calculated: `(n - 1) & hash`. 3. If the bucket is empty, a new Node is inserted. 4. If occupied, it traverses the bucket. If an existing key matches (`k == key || (k.hashCode() == key.hashCode() && k.equals(key))`), its value is overwritten. 5. If no match, a new node is appended. 6. If bucket length exceeds 8, the list may treeify into a Red-Black tree. 7. If total entries exceed `capacity * loadFactor`, the table rehashes with 2x capacity.",
        tips: "This is one of the most famous Java backend interview questions. Reciting these exact steps demonstrates top-tier preparation."
      },
      {
        question: "Why should HashMap keys always be immutable?",
        answer: "If a mutable key's state changes after being stored in a map, its `hashCode()` changes. When you subsequently attempt to retrieve it, the map searches the new bucket index and fails to find the original entry, permanently stranding the entry and causing a memory leak.",
        tips: "Point out why `String` and `Integer` are the most popular keys in enterprise systems because they are strictly immutable."
      }
    ],
    reflectionPrompt: "How does understanding hash buckets and time complexity prevent you from accidentally writing code that works fine with 10 users but crashes the server with 10,000 users?",
    measurableCriteria: "Learner can articulate HashMap bucket mechanics, implement the hash contract, choose between Set/Map/List appropriately, and achieve >80% on the Week 1 assessment.",
    resources: [
      {
        title: "Dev.java: The Java Collections Framework",
        purpose: "Comprehensive official documentation on List, Set, Map, and Queue implementations",
        url: "https://dev.java/learn/collections/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Data Structures — Dictionaries & Sets",
        purpose: "CPython official guide to mappings, comprehensions, and set operations",
        url: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries",
        isOfficial: true
      }
    ]
  },
  {
    day: 8,
    title: "Exceptions, File Handling, Clean Architecture & Maintainability",
    subtitle: "Checked vs unchecked exceptions, try-with-resources, context managers, and defensive I/O",
    week: 2,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Distinguish Checked vs Unchecked Exceptions in Java (`IOException` vs `RuntimeException`) and Python's exception hierarchy",
      "Master automatic resource deallocation: `try-with-resources` (Java) and `with` context managers (Python)",
      "Create meaningful custom domain exceptions with error codes and contextual metadata",
      "Read, write, and safely stream file data without memory leaks or file handle exhaustion"
    ],
    keyTerminology: [
      {
        term: "Checked vs Unchecked Exception",
        definition: "Checked exceptions (Java only) are verified at compile-time and must be declared or caught. Unchecked exceptions (RuntimeExceptions) represent programming bugs or unexpected errors.",
        analogy: "Checked exception is checking your passport before leaving for the airport; unchecked exception is getting a flat tire on the highway."
      },
      {
        term: "Try-With-Resources / Context Manager",
        definition: "A language construct guaranteeing that open system resources (files, sockets, DB connections) are closed immediately upon block exit, even if an exception is thrown.",
        analogy: "A refrigerator door with a spring hinge that automatically closes and seals the moment you let go."
      },
      {
        term: "Exception Swallowing (Anti-Pattern)",
        definition: "Catching an exception with an empty block (`catch (Exception e) {}`), destroying the stack trace and concealing catastrophic failures.",
        analogy: "Hearing the building fire alarm and cutting the speaker wire so you can keep working in silence."
      }
    ],
    conceptExplanation: {
      what: "Exceptions are exceptional events that disrupt normal instruction flow. File handling performs input/output with persistent storage.",
      whyNeeded: "In backend services, network connections drop, disk drives fill up, and users send malformed files. Robust exception handling keeps servers alive instead of crashing the entire process.",
      howItWorks: "When an exception is thrown, the runtime unwinds the call stack searching for a matching catch handler. If none is found, the thread terminates and prints a stack trace.",
      beginnerMistakes: [
        "Swallowing exceptions silently (`catch (Exception e) {}`) leaving zero logs of why a transaction failed",
        "Catching `Throwable` or `Error` (e.g. `OutOfMemoryError`) which should never be handled by application code",
        "Forgetting to close file streams in a `finally` block or failing to use `try-with-resources`",
        "Using exceptions for standard control flow (e.g. throwing an exception to break out of a loop)"
      ],
      backendRelevance: "Global Exception Handlers (`@ControllerAdvice` in Spring Boot, custom exception middleware in FastAPI) catch domain errors and translate them into standardized HTTP 4xx/5xx responses.",
      interviewerPerspective: "Interviewers look for clean exception hygiene: 'Why is catching generic Exception bad practice? What happens to unclosed database connections?'",
      howToProveUnderstanding: "Build a safe file processor in both languages that reads a config file, throws custom domain exceptions for missing keys, and guarantees resource closure."
    },
    javaCodeSnippet: {
      title: "SafeFileProcessor.java",
      code: `import java.io.*;
import java.nio.file.*;

// Custom Domain Exception
class ConfigurationException extends Exception {
    public ConfigurationException(String message, Throwable cause) {
        super(message, cause);
    }
}

public class SafeFileProcessor {
    // Try-with-resources guarantees file handle deallocation
    public static String readConfig(Path path) throws ConfigurationException {
        try (BufferedReader reader = Files.newBufferedReader(path)) {
            String line = reader.readLine();
            if (line == null) throw new IllegalArgumentException("Config file is empty");
            return line;
        } catch (IOException e) {
            // Wrap in domain exception with original cause preserved
            throw new ConfigurationException("Failed to read system config from: " + path, e);
        }
    }

    public static void main(String[] args) {
        try {
            readConfig(Paths.get("non_existent_config.json"));
        } catch (ConfigurationException e) {
            System.err.println("Caught Expected Domain Error: " + e.getMessage());
            System.err.println("Root Cause: " + e.getCause());
        }
    }
}`,
      explanation: "Uses Java `try-with-resources` (`AutoCloseable`) and wraps low-level `IOException` into a meaningful domain `ConfigurationException` preserving root cause."
    },
    pythonCodeSnippet: {
      title: "safe_file_processor.py",
      code: `from pathlib import Path

class ConfigurationError(Exception):
    """Custom Domain Exception for configuration failures"""
    pass

def read_config(path: Path) -> str:
    # 'with' statement guarantees file closure even on exception
    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.readline().strip()
            if not content:
                raise ValueError("Config file is empty")
            return content
    except (FileNotFoundError, PermissionError) as e:
        # Re-raise with domain context using 'from e' to preserve stack trace
        raise ConfigurationError(f"Failed to read system config from: {path}") from e

if __name__ == "__main__":
    try:
        read_config(Path("non_existent_config.json"))
    except ConfigurationError as err:
        print(f"Caught Expected Domain Error: {err}")
        print(f"Original Cause: {err.__cause__}")`,
      explanation: "Uses Python's `with` context manager and Python 3 exception chaining (`raise ... from e`) to preserve original traceback diagnostics."
    },
    practicalDeliverable: {
      title: "Transactional Audit File Logger with Custom Exceptions",
      description: "Build an audit log generator in both languages that appends formatted JSON logs to disk. Handle permission errors, disk-full simulations, and file locking safely with automated rollback.",
      acceptanceCriteria: [
        "Uses `try-with-resources` (Java) and `with open()` (Python)",
        "Defines at least two custom domain exceptions (`InvalidPayloadException`, `AuditStorageException`)",
        "Preserves root cause exception chaining across layers",
        "Demonstrates zero resource leaks under simulated failure"
      ]
    },
    debuggingTask: {
      problemTitle: "Silent Exception Swallowing & Resource Leak Bug",
      language: "java",
      buggyCode: `public static void saveReport(String data) {
    try {
        FileWriter fw = new FileWriter("report.txt");
        fw.write(data);
        // If an exception happens here, fw.close() is NEVER reached!
        fw.close();
    } catch (Exception e) {
        // Catastrophic: silent swallowing with empty block!
    }
}`,
      bugExplanation: "If writing fails, `fw.close()` is skipped, leaving the operating system file handle locked. Silently swallowing `Exception` hides bugs completely from monitoring tools.",
      fixedCode: `public static void saveReport(String data) throws IOException {
    try (FileWriter fw = new FileWriter("report.txt")) {
        fw.write(data);
    } // Automatically closed even if an exception occurs
}`
    },
    checklist: [
      "Explained Checked vs Unchecked exceptions and why modern frameworks favor Unchecked",
      "Implemented `try-with-resources` and Python `with` statement",
      "Created custom domain exceptions with root cause preservation",
      "Eliminated all empty `catch` blocks and silent swallow anti-patterns",
      "Completed the Transactional Audit File Logger deliverable"
    ],
    quiz: [
      {
        id: "d8-q1",
        question: "Why should you never catch `Exception` with an empty block `{}` in backend services?",
        options: [
          "It causes the JVM to reboot",
          "It destroys diagnostic stack traces, hiding critical bugs, security failures, and database deadlocks from logs",
          "The Java compiler prevents code with empty catch blocks from building",
          "It slows down file I/O operations"
        ],
        correctAnswer: 1,
        explanation: "Empty catch blocks ('swallowing exceptions') hide the root cause of failures, making production bugs impossible to diagnose."
      },
      {
        id: "d8-q2",
        question: "What interface must a Java class implement to be used in a `try-with-resources` statement?",
        options: [
          "`java.io.Serializable`",
          "`java.lang.AutoCloseable` or `java.io.Closeable`",
          "`java.lang.Cloneable`",
          "`java.util.Iterator`"
        ],
        correctAnswer: 1,
        explanation: "Java `try-with-resources` requires the resource to implement `AutoCloseable`, which provides the `.close()` method called automatically upon block completion."
      },
      {
        id: "d8-q3",
        question: "In Python, what is the purpose of `raise CustomError('msg') from original_error`?",
        options: [
          "It deletes the original error from memory",
          "It chains exceptions, explicitly preserving the original exception and its traceback under `__cause__`",
          "It turns the error into a warning",
          "It allows the program to continue without raising"
        ],
        correctAnswer: 1,
        explanation: "Exception chaining in Python 3 preserves the original traceback context so engineers can see both the domain failure and the low-level cause."
      }
    ],
    interviewQuestions: [
      {
        question: "Why do modern frameworks like Spring Boot and FastAPI prefer Unchecked Exceptions (RuntimeExceptions) over Checked Exceptions?",
        answer: "Checked exceptions force intermediate methods in the call stack to either catch or declare them in method signatures (`throws IOException`), leaking implementation details of low-level data access layers into high-level business services. Unchecked exceptions allow clean layer separation: business logic stays unpolluted, and exceptions bubble up naturally to a centralized Global Exception Handler.",
        tips: "Mention `@RestControllerAdvice` in Spring Boot as the centralized destination for unchecked exceptions."
      },
      {
        question: "What happens if an exception is thrown inside a `try` block AND another exception is thrown inside `finally` or auto-close?",
        answer: "In traditional Java try-finally, the exception in `finally` overwrites and masks the original try-block exception. In modern Java `try-with-resources`, the primary exception from the `try` block is preserved, and any exception thrown during closing is attached as a 'Suppressed Exception' accessible via `e.getSuppressed()`. Python similarly chains them via context management.",
        tips: "Knowing about 'Suppressed Exceptions' proves deep knowledge of language internals."
      }
    ],
    reflectionPrompt: "How does clean exception handling turn a terrifying 500 Internal Server Error crash into a predictable, helpful HTTP 400 Bad Request error for your API consumers?",
    measurableCriteria: "Learner can safely manage resources using context managers, write custom domain exceptions, and avoid resource leaks or silent exception swallowing.",
    resources: [
      {
        title: "Dev.java: Exceptions & Try-with-Resources",
        purpose: "Official Java documentation on exception hierarchy and resource management",
        url: "https://dev.java/learn/exceptions/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Errors and Exceptions",
        purpose: "CPython official guide to handling exceptions, raising, and user-defined errors",
        url: "https://docs.python.org/3/tutorial/errors.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 9,
    title: "Data Structures & Algorithms Fundamentals for Backend Engineers",
    subtitle: "Time and space complexity intuition, Two-Sum with HashMaps, sliding windows, and binary search",
    week: 2,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Develop rock-solid Big-O intuition: O(1), O(log N), O(N), O(N log N), and O(N^2)",
      "Master the classic Two-Sum pattern: trading O(N) auxiliary space to reduce time from O(N^2) to O(N)",
      "Understand Binary Search: logarithmic O(log N) search on sorted datasets",
      "Apply algorithmic thinking to backend problems: rate limiting (sliding window) and database indexing (B-Trees)"
    ],
    keyTerminology: [
      {
        term: "Big-O Notation",
        definition: "A mathematical representation of the upper bound of an algorithm's execution time or memory consumption as input size N grows toward infinity.",
        analogy: "Shipping a box: whether it contains 1 pen or 500 pens, the delivery truck driving to your house takes the same time (O(1)). Hand-painting each pen takes O(N) time."
      },
      {
        term: "Space-Time Tradeoff",
        definition: "The principle that an algorithm can often be made faster by using additional memory (such as caching lookups in a hash map).",
        analogy: "Keeping an index card of your top 10 customer phone numbers on your desk (extra memory) instead of searching through a 1,000-page directory every time (extra time)."
      },
      {
        term: "Binary Search",
        definition: "An efficient search algorithm on sorted collections that repeatedly divides the search interval in half, achieving O(log N) time.",
        analogy: "Guessing a secret number between 1 and 100: guessing 50 immediately eliminates 50 numbers in one step."
      }
    ],
    conceptExplanation: {
      what: "Data structures organize data; algorithms are step-by-step procedures to process that data efficiently.",
      whyNeeded: "Backend systems process millions of records. An O(N^2) query or algorithm will freeze your server when customer traffic spikes, while an O(N) or O(log N) algorithm executes in milliseconds.",
      howItWorks: "HashMaps allow instant key lookup via hashing; sorted arrays enable binary halving; sliding windows maintain aggregate metrics over time ranges without re-iterating.",
      beginnerMistakes: [
        "Solving Two-Sum using two nested loops (O(N^2) brute force) instead of a single-pass HashMap (O(N))",
        "Running Binary Search on an unsorted array without sorting first",
        "Ignoring integer overflow in binary search midpoint calculation (`mid = (left + right) / 2` can overflow in Java)",
        "Thinking DSA is only for competitive programming rather than understanding its direct application in database indexes and caches"
      ],
      backendRelevance: "Database B-Trees provide O(log N) indexing, Redis operates on O(1) in-memory data structures, and API rate limiters use sliding window algorithms.",
      interviewerPerspective: "Two-Sum, Valid Parentheses, and Binary Search are the foundation of entry-level technical coding interviews. Interviewers test if you can analyze Big-O trade-offs.",
      howToProveUnderstanding: "Solve Two-Sum in O(N) time and implement Binary Search with safe midpoint calculation in both Java and Python."
    },
    javaCodeSnippet: {
      title: "BackendAlgorithms.java",
      code: `import java.util.*;

public class BackendAlgorithms {
    // Two-Sum: O(N) Time, O(N) Space using HashMap
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> complementMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (complementMap.containsKey(complement)) {
                return new int[] { complementMap.get(complement), i };
            }
            complementMap.put(nums[i], i);
        }
        return new int[] {}; // No match
    }

    // Binary Search: O(log N) Time with overflow-safe midpoint
    public static int binarySearch(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            // Safe midpoint preventing integer overflow:
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1; // Not found
    }

    public static void main(String[] args) {
        int[] nums = { 2, 7, 11, 15 };
        int[] result = twoSum(nums, 9);
        System.out.println("Two Sum indices: " + Arrays.toString(result)); // [0, 1]
    }
}`,
      explanation: "Uses HashMap complement lookup to achieve optimal O(N) time and implements overflow-safe `left + (right - left) / 2` binary search."
    },
    pythonCodeSnippet: {
      title: "backend_algorithms.py",
      code: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Single-pass HashMap: O(N) Time, O(N) Space
    complement_map: dict[int, int] = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in complement_map:
            return [complement_map[complement], i]
        complement_map[num] = i
    return []

def binary_search(arr: list[int], target: int) -> int:
    # O(log N) Time, O(1) Space
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    print(f"Two Sum indices: {two_sum(nums, 9)}") # [0, 1]`,
      explanation: "Pythonic single-pass Two-Sum using dictionary complement hashing and integer floor division `//`."
    },
    practicalDeliverable: {
      title: "Sliding Window API Rate-Limiter Simulation",
      description: "Implement a sliding-window algorithm that limits a client to at most 5 requests per 10-second window. Store request timestamps and discard expired timestamps efficiently.",
      acceptanceCriteria: [
        "Processes incoming request timestamps in chronological order",
        "Accurately rejects requests exceeding rate limits without iterating the entire historical log",
        "Achieves O(1) amortized time per request using a Queue or Deque",
        "Includes unit test cases verifying boundaries (e.g. bursts at second 9 and 11)"
      ]
    },
    debuggingTask: {
      problemTitle: "Binary Search Integer Overflow Bug",
      language: "java",
      buggyCode: `public static int findIndex(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        // Bug: If low + high > Integer.MAX_VALUE (2^31 - 1), it overflows to negative!
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      bugExplanation: "In large arrays (common in Java enterprise datasets or search engines), `(low + high)` exceeds `2,147,483,647`, wrapping around to a negative number and triggering `ArrayIndexOutOfBoundsException`.",
      fixedCode: `public static int findIndex(int[] arr, int target) {
    int low = 0;
    int high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2; // Safe from arithmetic overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    },
    checklist: [
      "Understood Big-O time and space complexity classes",
      "Solved Two-Sum in O(N) time using HashMap complement lookup",
      "Implemented Binary Search with overflow-safe midpoint calculation",
      "Explained how database indexing leverages B-Trees and binary search",
      "Completed the Sliding Window Rate Limiter deliverable"
    ],
    quiz: [
      {
        id: "d9-q1",
        question: "Why is Two-Sum with a HashMap considered superior to the brute-force two-pointer nested loop?",
        options: [
          "Brute force requires O(N^2) time which freezes on large datasets; HashMap reduces time to O(N) by trading O(N) space",
          "HashMaps use less memory than arrays",
          "Brute force only works on negative numbers",
          "The compiler optimizes HashMaps to machine code automatically"
        ],
        correctAnswer: 0,
        explanation: "By storing seen numbers and their indices in a HashMap, complement lookups are O(1), bringing total time down from quadratic O(N^2) to linear O(N)."
      },
      {
        id: "d9-q2",
        question: "How many operations does Binary Search require to find a number in a sorted array of 1,000,000 elements in the worst case?",
        options: [
          "~1,000,000 operations",
          "~500,000 operations",
          "~20 operations (log2(1,000,000) ≈ 20)",
          "1 operation"
        ],
        correctAnswer: 2,
        explanation: "Because binary search halves the search space on each step, `log2(1,000,000) ≈ 19.93`, requiring at most 20 comparisons."
      },
      {
        id: "d9-q3",
        question: "What is the Big-O time complexity of sorting an array of N numbers using MergeSort or QuickSort on average?",
        options: [
          "O(N)",
          "O(N log N)",
          "O(N^2)",
          "O(1)"
        ],
        correctAnswer: 1,
        explanation: "Comparison-based optimal sorting algorithms divide and conquer in O(N log N) time on average."
      }
    ],
    interviewQuestions: [
      {
        question: "How does binary search relate to relational database indexing?",
        answer: "Relational databases use B-Tree / B+Tree data structures for primary and indexed columns. The tree branches out with sorted keys. Traversing the B-Tree is an extension of binary search, allowing the database engine to locate a row among millions of records in logarithmic O(log N) disk/memory lookups instead of scanning every single row on disk (Full Table Scan O(N)).",
        tips: "Connecting basic algorithms directly to database storage engines immediately sets you apart from standard CS freshers."
      },
      {
        question: "Can you explain the difference between Worst-Case, Average-Case, and Amortized Time Complexity?",
        answer: "Worst-case (Big-O) is the guaranteed upper bound of runtime under the most adversarial input (e.g. QuickSort on already-sorted array with poor pivot: O(N^2)). Average-case (Big-Theta) is the expected runtime over random inputs (QuickSort: O(N log N)). Amortized time is the average cost per operation over a long sequence of operations, even if an occasional single operation is expensive (e.g. ArrayList resizing: O(1) amortized despite occasional O(N) array copy).",
        tips: "Use the `ArrayList` dynamic resizing example for amortized analysis—interviewers love it."
      }
    ],
    reflectionPrompt: "If an API endpoint executes an O(N^2) algorithm over a customer's order history, what happens to server CPU utilization and API latency when a customer with 10,000 orders accesses the endpoint?",
    measurableCriteria: "Learner can analyze time/space complexity, implement Two-Sum and Binary Search without assistance, and explain real-world backend applications.",
    resources: [
      {
        title: "Dev.java: Arrays and Algorithms",
        purpose: "Official Java guide to sorting, searching, and algorithmic utilities",
        url: "https://dev.java/learn/arrays/",
        isOfficial: true
      },
      {
        title: "Python Official Docs: Bisect and Sorting",
        purpose: "CPython bisect module and sorting HOWTO guide",
        url: "https://docs.python.org/3/howto/sorting.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 10,
    title: "Java vs Python Practical Assessment & Primary Track Selection",
    subtitle: "Milestone evaluation: Language deep-dive, coding challenge, debugging gauntlet, and personalized track advisory",
    week: 2,
    phase: "Stage A: Common Fundamentals",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Complete the Stage A comprehensive assessment covering programming fundamentals, OOP, collections, and DSA",
      "Analyze your personal strengths: static typing & compiler safety vs dynamic flexibility & rapid iteration",
      "Evaluate industry ecosystems: Enterprise Java / Spring Boot vs Python / FastAPI & AI-adjacent backend systems",
      "Commit to your primary backend track for Days 11 to 25 with clear architectural milestones"
    ],
    keyTerminology: [
      {
        term: "Spring Boot Ecosystem",
        definition: "The dominant enterprise Java backend framework providing embedded web servers, dependency injection, and data persistence.",
        analogy: "A commercial Boeing 777: powerful, strictly engineered, heavily instrumented, ideal for large organizations."
      },
      {
        term: "FastAPI Ecosystem",
        definition: "A modern, high-performance Python framework built on Starlette and Pydantic with native async/await and automatic OpenAPI documentation.",
        analogy: "A high-performance sports car: sleek, rapid acceleration, minimal overhead, perfect for agile modern services."
      },
      {
        term: "Primary Track Commitment",
        definition: "Focusing deep practical project execution on ONE backend stack to ensure production-grade depth rather than shallow familiarity across two.",
        analogy: "Choosing to become a licensed specialist in either cardiac surgery or neurosurgery rather than trying to perform both simultaneously."
      }
    ],
    conceptExplanation: {
      what: "Day 10 is the pivotal branching point of the Backend Launch Lab. Having explored both Java and Python in parallel for 9 days, you now benchmark your aptitude and select your primary backend specialization.",
      whyNeeded: "Hiring managers for junior backend roles do NOT look for someone who knows 5% of everything. They look for someone who can clone a repo, write clean endpoints, test, and debug in their specific production stack (either Spring Boot or FastAPI).",
      howItWorks: "You complete a 4-part practical assessment: syntax mastery, problem-solving, debugging gauntlet, and an architectural trade-off essay. Based on your score and preferences, the engine recommends your optimal path.",
      beginnerMistakes: [
        "Trying to learn Spring Boot and FastAPI simultaneously in the remaining 15 days (causes cognitive overload and shallow skills)",
        "Choosing based on internet hype rather than genuine comfort with the language's typing model and ecosystem",
        "Believing one track guarantees a job (job readiness is demonstrated through project depth and assessment rigor, not the framework name)",
        "Abandoning the chosen track halfway through when concepts like dependency injection or async programming get challenging"
      ],
      backendRelevance: "Both Spring Boot (banking, fintech, enterprise, high-throughput e-commerce) and FastAPI (AI microservices, SaaS startups, data APIs) have immense market demand in India and globally.",
      interviewerPerspective: "Interviewers want to see intentionality: 'Why did you choose Spring Boot or FastAPI for your portfolio project? What architectural trade-offs did you consider?'",
      howToProveUnderstanding: "Pass the Day 10 Diagnostic Examination with >=70% in your chosen language and articulate your track rationale."
    },
    javaCodeSnippet: {
      title: "JavaEnterprisePreview.java",
      code: `// Glimpse of Stage B: Enterprise Spring-Style Architecture
public class JavaEnterprisePreview {
    public interface OrderService {
        void placeOrder(String userId, double amount);
    }

    public static class OrderServiceImpl implements OrderService {
        @Override
        public void placeOrder(String userId, double amount) {
            System.out.printf("[Spring Java] Order ₹%.2f placed for user %s with strict compile-time types.%n", amount, userId);
        }
    }

    public static void main(String[] args) {
        OrderService service = new OrderServiceImpl();
        service.placeOrder("USR-9821", 4500.0);
    }
}`,
      explanation: "Shows Java's structured interface-driven design common in enterprise Spring applications."
    },
    pythonCodeSnippet: {
      title: "python_async_preview.py",
      code: `import asyncio
from typing import NamedTuple

class Order(NamedTuple):
    user_id: str
    amount: float

async def place_order(order: Order):
    # Asynchronous non-blocking backend simulation
    await asyncio.sleep(0.01)
    print(f"[FastAPI Python] Order ₹{order.amount:.2f} placed for {order.user_id} asynchronously.")

if __name__ == "__main__":
    asyncio.run(place_order(Order(user_id="USR-9821", amount=4500.0)))`,
      explanation: "Shows Python's native asynchronous concurrency and clean typing with NamedTuples / Pydantic."
    },
    practicalDeliverable: {
      title: "Stage A Milestone Examination & Track Commitment Contract",
      description: "Complete the interactive Day 10 assessment inside the platform. Record your scores in the diagnostic quiz, review the personalized track advisory, and lock in your primary track (Java or Python) for the Capstone Project.",
      acceptanceCriteria: [
        "Completed all 5 diagnostic assessment challenges",
        "Achieved passing score (>=70%) on fundamental language concepts",
        "Selected and locked primary backend track (Java + Spring Boot OR Python + FastAPI)",
        "Recorded learning reflection on your chosen path's ecosystem and job market fit"
      ]
    },
    checklist: [
      "Completed Day 10 Diagnostic Assessment",
      "Reviewed personalized track recommendation score",
      "Selected primary backend track (Java / Spring Boot OR Python / FastAPI)",
      "Set up workspace environment for chosen backend framework (Maven/JDK or Venv/Pip)",
      "Committed Stage A journal repository to GitHub with complete solutions"
    ],
    quiz: [
      {
        id: "d10-q1",
        question: "Which scenario is typically best suited for Java + Spring Boot in the industry?",
        options: [
          "10-line rapid web scraping scripts",
          "Large enterprise systems, banking/fintech, complex transactional workflows, and microservice fleets requiring strict static types",
          "Simple single-file prototype apps",
          "Browser frontend rendering"
        ],
        correctAnswer: 1,
        explanation: "Java and Spring Boot excel in large-scale enterprise environments where static typing, mature tooling, and strict architecture protect large engineering teams from regressions."
      },
      {
        id: "d10-q2",
        question: "Which scenario is typically best suited for Python + FastAPI in modern backend engineering?",
        options: [
          "Embedded microcontrollers with 16KB RAM",
          "High-performance async APIs, microservices integrating AI/ML models, rapid prototyping, and data-driven backend services",
          "Legacy desktop GUI applications",
          "Operating system kernel drivers"
        ],
        correctAnswer: 1,
        explanation: "FastAPI is the premier choice for modern asynchronous APIs, rapid SaaS backends, and microservices bridging backend APIs with machine learning pipelines."
      },
      {
        id: "d10-q3",
        question: "Why should a junior developer focus on mastering ONE backend track rather than learning 3 frameworks shallowly?",
        options: [
          "Frameworks forbid developers from learning other languages",
          "Hiring managers test deep practical knowledge: exception handling, database transactions, testing, and debugging, which requires focused depth",
          "FastAPI and Spring Boot use conflicting network protocols",
          "Cloud providers only support one language per company"
        ],
        correctAnswer: 1,
        explanation: "Depth beats breadth for freshers. Employers want to see that you can write clean, tested, production-grade APIs end-to-end rather than having copy-pasted 'Hello World' in 5 frameworks."
      }
    ],
    interviewQuestions: [
      {
        question: "What are the key trade-offs between a statically typed language (Java) and a dynamically typed language (Python) in backend production?",
        answer: "Static typing (Java) catches errors at compile time, enables powerful IDE refactoring, documents data contracts explicitly, and generally offers higher CPU throughput. Dynamic typing (Python) offers faster development velocity, concise code, and rapid iteration, but requires disciplined unit test coverage and runtime type checking (like Pydantic) to prevent runtime type exceptions in production.",
        tips: "Avoid saying one is 'better' than the other; frame the answer around trade-offs: velocity vs compile-time safety."
      },
      {
        question: "If your system handles 10,000 concurrent I/O-bound requests, how do Java's Virtual Threads (Project Loom) and Python's Asyncio address this concurrency?",
        answer: "Both solve the problem of traditional OS threads being memory-heavy (~1MB per thread stack). Python's `asyncio` uses an event loop on a single thread to multiplex I/O tasks via cooperative scheduling. Java 21 Virtual Threads are lightweight JVM-managed threads (~1KB overhead) that automatically unmount from carrier OS threads during blocking I/O, allowing millions of concurrent requests using traditional synchronous blocking code syntax.",
        tips: "Mentioning Java 21 Virtual Threads shows you are up-to-date with modern Java engineering rather than relying on outdated Java 8 knowledge."
      }
    ],
    reflectionPrompt: "Now that you have written both Java and Python for 10 days, which language feels more natural to you? Why is sticking with that choice for the next 15 days the fastest path to building a credible portfolio project?",
    measurableCriteria: "Learner evaluates their assessment performance, articulates architectural trade-offs, and commits to a primary backend specialization with verified workspace readiness.",
    resources: [
      {
        title: "Official Spring Boot Documentation",
        purpose: "Building your first application with Spring Boot",
        url: "https://docs.spring.io/spring-boot/tutorial/first-application/",
        isOfficial: true
      },
      {
        title: "Official FastAPI Tutorial — First Steps",
        purpose: "FastAPI official documentation and interactive API generation",
        url: "https://fastapi.tiangolo.com/tutorial/",
        isOfficial: true
      }
    ]
  }
];
