import { CodingExercise } from '../types';

export const CODING_EXERCISES: CodingExercise[] = [
  {
    id: "ex-1",
    title: "Safe String Palindrome with Alphanumeric Normalization",
    category: "Strings & Arrays",
    difficulty: "Beginner",
    estimatedMinutes: 25,
    description: "Write a function that checks if a string is a palindrome, ignoring case, spaces, and punctuation (e.g. 'A man, a plan, a canal: Panama' is valid). Must use the Two-Pointer technique in O(N) time and O(1) extra space.",
    inputOutputExamples: [
      { input: '"A man, a plan, a canal: Panama"', output: "true", explanation: "Normalized: 'amanaplanacanalpanama'" },
      { input: '"race a car"', output: "false", explanation: "Normalized: 'raceacar' is not identical backwards" },
      { input: '" "', output: "true", explanation: "Empty or whitespace-only strings are trivial palindromes" }
    ],
    constraints: [
      "1 <= string length <= 200,000",
      "Must not create a new reversed copy of the string to conserve memory",
      "O(1) auxiliary space"
    ],
    learningOutcome: "Master the two-pointer traversal idiom and learn how in-place scanning prevents memory allocations in high-volume services.",
    hints: {
      step1ProblemExplanation: "The problem asks us to determine if reading the alphanumeric characters forwards and backwards yields the exact same sequence, ignoring punctuation and casing.",
      step2ConceptualHint: "Initialize one pointer at the start (index 0) and one at the end (index length - 1). Walk towards each other.",
      step3SuggestedApproach: "In a while loop (`left < right`), increment `left` if the character isn't alphanumeric, decrement `right` if it isn't alphanumeric, and compare lowercase values.",
      step4Pseudocode: `left = 0, right = len - 1
while left < right:
  while left < right and not isAlpha(s[left]): left++
  while left < right and not isAlpha(s[right]): right--
  if lower(s[left]) != lower(s[right]): return false
  left++; right--
return true`,
      step5JavaSolution: `public static boolean isPalindrome(String s) {
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
}`,
      step5PythonSolution: `def is_palindrome(s: str) -> bool:
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
    return True`
    },
    starterCode: {
      java: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Implement two-pointer check here
        return false;
    }
}`,
      python: `def is_palindrome(s: str) -> bool:
    # Implement two-pointer check here
    return False`
    },
    verificationCriteria: [
      "Handles mixed casing correctly ('RaceCar')",
      "Skips symbols, commas, colons, and spaces properly",
      "Executes in O(N) time with O(1) extra space"
    ]
  },
  {
    id: "ex-2",
    title: "Two Sum with HashMap Lookup (O(N) Time)",
    category: "HashMaps & Collections",
    difficulty: "Elementary",
    estimatedMinutes: 30,
    description: "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You must not use the same element twice. Solve it in O(N) time using a HashMap.",
    inputOutputExamples: [
      { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] = 2 + 4 = 6" },
      { input: "nums = [3, 3], target = 6", output: "[0, 1]", explanation: "Duplicate numbers handled correctly" }
    ],
    constraints: [
      "2 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists"
    ],
    learningOutcome: "Understand the fundamental space-time tradeoff: storing previously seen values in a hash map allows O(1) complement lookups, reducing O(N^2) brute force to linear O(N).",
    hints: {
      step1ProblemExplanation: "For every number X in the array, we need to find if there is another number Y such that X + Y = target. That means Y = target - X.",
      step2ConceptualHint: "As you iterate through the array, can you remember every number you have seen and what index it was at?",
      step3SuggestedApproach: "Use a Map<Integer, Integer> where the key is the number and the value is its index. In a single pass, check if (target - num) is already in the map.",
      step4Pseudocode: `map = {}
for i, num in enumerate(nums):
  complement = target - num
  if complement in map:
    return [map[complement], i]
  map[num] = i
return []`,
      step5JavaSolution: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}`,
      step5PythonSolution: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`
    },
    starterCode: {
      java: `public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Your O(N) HashMap solution here
        return new int[]{};
    }
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your O(N) HashMap solution here
    return []`
    },
    verificationCriteria: [
      "Solves in a single pass O(N) time complexity",
      "Handles arrays with negative values and duplicate numbers",
      "Returns zero-based index pair"
    ]
  },
  {
    id: "ex-3",
    title: "Guard Clause & Status Transition Engine",
    category: "Logic & Loops",
    difficulty: "Elementary",
    estimatedMinutes: 25,
    description: "Implement a status transition validator for job applications. Valid statuses are: APPLIED -> SCREENING -> INTERVIEW -> OFFER -> ACCEPTED (or REJECTED from any state). Once REJECTED or ACCEPTED, no further transitions are allowed. Return true if a proposed transition is valid, false otherwise.",
    inputOutputExamples: [
      { input: "current = 'APPLIED', next = 'INTERVIEW'", output: "true", explanation: "Valid forward progression" },
      { input: "current = 'REJECTED', next = 'OFFER'", output: "false", explanation: "Terminal state cannot transition" },
      { input: "current = 'INTERVIEW', next = 'REJECTED'", output: "true", explanation: "Rejection allowed from interview" }
    ],
    constraints: [
      "Statuses are case-sensitive uppercase strings",
      "Use clean guard clauses rather than nested if-else ladders"
    ],
    learningOutcome: "Learn how to model domain state machines cleanly using guard clauses and sets/maps, a staple of backend business logic.",
    hints: {
      step1ProblemExplanation: "We need a rule engine that defines valid next states for each current state, returning immediately on invalid transitions.",
      step2ConceptualHint: "Consider mapping each status to a Set of allowed destination statuses.",
      step3SuggestedApproach: "If current state is terminal, return false immediately (guard clause). Then check if next state exists in the allowed set for current.",
      step4Pseudocode: `if current in ['REJECTED', 'ACCEPTED']: return false
if current == next: return false
allowed = {
  'APPLIED': {'SCREENING', 'INTERVIEW', 'REJECTED'},
  'SCREENING': {'INTERVIEW', 'REJECTED'},
  'INTERVIEW': {'OFFER', 'REJECTED'},
  'OFFER': {'ACCEPTED', 'REJECTED'}
}
return next in allowed.get(current, set())`,
      step5JavaSolution: `public static boolean isValidTransition(String current, String next) {
    if (current == null || next == null || current.equals(next)) return false;
    if ("REJECTED".equals(current) || "ACCEPTED".equals(current)) return false;
    if ("REJECTED".equals(next)) return true; // Can always reject active application

    return switch (current) {
        case "APPLIED" -> Set.of("SCREENING", "INTERVIEW").contains(next);
        case "SCREENING" -> Set.of("INTERVIEW").contains(next);
        case "INTERVIEW" -> Set.of("OFFER").contains(next);
        case "OFFER" -> Set.of("ACCEPTED").contains(next);
        default -> false;
    };
}`,
      step5PythonSolution: `def is_valid_transition(current: str, next_state: str) -> bool:
    if not current or not next_state or current == next_state:
        return False
    if current in ("REJECTED", "ACCEPTED"):
        return False
    if next_state == "REJECTED":
        return True
    
    allowed = {
        "APPLIED": {"SCREENING", "INTERVIEW"},
        "SCREENING": {"INTERVIEW"},
        "INTERVIEW": {"OFFER"},
        "OFFER": {"ACCEPTED"}
    }
    return next_state in allowed.get(current, set())`
    },
    starterCode: {
      java: `public class Solution {
    public static boolean isValidTransition(String current, String next) {
        // Implement transition guard clauses
        return false;
    }
}`,
      python: `def is_valid_transition(current: str, next_state: str) -> bool:
    # Implement transition guard clauses
    return False`
    },
    verificationCriteria: [
      "Terminal states (REJECTED, ACCEPTED) reject all subsequent transitions",
      "No self-transitions (current == next returns false)",
      "Uses flat guard clauses without nested if statements"
    ]
  },
  {
    id: "ex-4",
    title: "SQL Aggregate Analytics Query (Interview & Offer Rates)",
    category: "SQL & Relational",
    difficulty: "Elementary",
    estimatedMinutes: 30,
    description: "Write a SQL query against the `applications` table that returns each company's name, total applications submitted, count of interviews secured, and the interview conversion rate percentage rounded to 1 decimal place, ordered by total applications descending.",
    inputOutputExamples: [
      { 
        input: "applications table with rows (company_name, status)", 
        output: "company_name | total_apps | interviews | interview_rate_pct\nGoogle | 4 | 2 | 50.0%\nAmazon | 2 | 0 | 0.0%",
        explanation: "Aggregated via GROUP BY with conditional COUNT or SUM" 
      }
    ],
    constraints: [
      "Must handle division by zero safely",
      "Only return companies with at least 1 application",
      "Standard ANSI SQL compatible (PostgreSQL / SQLite)"
    ],
    learningOutcome: "Master SQL CASE statements, conditional aggregates (`FILTER` / `CASE WHEN`), and GROUP BY analytical reporting.",
    hints: {
      step1ProblemExplanation: "We need to group all rows by company name and count both total rows and specific rows where status = 'INTERVIEW'.",
      step2ConceptualHint: "In SQL, you can use `COUNT(CASE WHEN status = 'INTERVIEW' THEN 1 END)` to count conditionally.",
      step3SuggestedApproach: "Combine `COUNT(*)`, conditional `CASE WHEN`, and standard arithmetic multiplied by 100.0.",
      step4Pseudocode: `SELECT 
  company_name,
  COUNT(*) as total_apps,
  SUM(CASE WHEN status = 'INTERVIEW' THEN 1 ELSE 0 END) as interviews,
  ROUND(100.0 * SUM(CASE WHEN status = 'INTERVIEW' THEN 1 ELSE 0 END) / COUNT(*), 1) as interview_rate_pct
FROM applications
GROUP BY company_name
ORDER BY total_apps DESC;`,
      step5JavaSolution: `-- PostgreSQL / Spring Data JPA Native Query:
SELECT 
    company_name,
    COUNT(*) AS total_apps,
    COUNT(*) FILTER (WHERE status = 'INTERVIEW') AS interviews,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'INTERVIEW') / COUNT(*), 1) AS interview_rate_pct
FROM applications
GROUP BY company_name
ORDER BY total_apps DESC;`,
      step5PythonSolution: `-- SQLModel / SQLAlchemy Raw Statement:
SELECT 
    company_name,
    COUNT(id) AS total_apps,
    SUM(CASE WHEN status = 'INTERVIEW' THEN 1 ELSE 0 END) AS interviews,
    ROUND(100.0 * SUM(CASE WHEN status = 'INTERVIEW' THEN 1 ELSE 0 END) / COUNT(id), 1) AS interview_rate_pct
FROM applications
GROUP BY company_name
ORDER BY total_apps DESC;`
    },
    starterCode: {
      java: `-- Write SQL query here:
SELECT 
    company_name
FROM applications;`,
      python: `# Write SQL query here:
SELECT 
    company_name
FROM applications;`
    },
    verificationCriteria: [
      "Uses GROUP BY company_name properly",
      "Computes conditional interview count using CASE or FILTER",
      "Rounds percentage to 1 decimal place with proper sort order"
    ]
  },
  {
    id: "ex-5",
    title: "Backend API Debugging: Race Condition & Null Pointer Trap",
    category: "Backend Debugging",
    difficulty: "Intermediate",
    estimatedMinutes: 35,
    description: "Diagnose and fix a high-concurrency race condition and null pointer exception in an in-memory job application counter service where multiple simultaneous requests cause duplicate IDs and silent crashes.",
    inputOutputExamples: [
      { input: "100 concurrent threads creating applications simultaneously", output: "Exactly 100 uniquely indexed applications with continuous IDs from 1 to 100", explanation: "Zero duplicate IDs or lost writes" }
    ],
    constraints: [
      "Must be thread-safe without locking the entire method",
      "Must not crash when an optional parameter like 'notes' is null"
    ],
    learningOutcome: "Understand concurrency race conditions in web thread pools, atomic primitives (`AtomicLong`), thread-safe collections (`ConcurrentHashMap`), and null safety.",
    hints: {
      step1ProblemExplanation: "Standard primitives like `int count = 0; count++` are not atomic; two threads reading at the exact same clock tick will read the same number and write the same incremented value, duplicating IDs.",
      step2ConceptualHint: "Look at `java.util.concurrent.atomic.AtomicLong` and `ConcurrentHashMap` in Java, or threading locks/transaction locks.",
      step3SuggestedApproach: "Replace `idCounter++` with `atomicId.incrementAndGet()`. Ensure optional strings use safe defaults.",
      step4Pseudocode: `atomicCounter = AtomicLong(1)
store = ConcurrentHashMap()
function add(app):
  id = atomicCounter.getAndIncrement()
  app.id = id
  store.put(id, app)
  return app`,
      step5JavaSolution: `import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

public class ThreadSafeAppStore {
    private final ConcurrentHashMap<Long, String> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public long registerApplication(String company, String notes) {
        long id = idGenerator.getAndIncrement();
        String safeNotes = (notes != null) ? notes.trim() : "";
        store.put(id, company + " | " + safeNotes);
        return id;
    }
}`,
      step5PythonSolution: `import threading

class ThreadSafeAppStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._store = {}
        self._counter = 1

    def register_application(self, company: str, notes: str = None) -> int:
        with self._lock:
            app_id = self._counter
            self._counter += 1
            safe_notes = (notes or "").strip()
            self._store[app_id] = f"{company} | {safe_notes}"
            return app_id`
    },
    starterCode: {
      java: `// Fix this buggy implementation:
public class BuggyStore {
    private Map<Long, String> store = new HashMap<>();
    private long counter = 0;

    public long register(String company, String notes) {
        counter++; // BUG: Race condition!
        store.put(counter, company + notes.toUpperCase()); // BUG: NullPointer if notes is null!
        return counter;
    }
}`,
      python: `# Fix this buggy implementation:
class BuggyStore:
    def __init__(self):
        self.store = {}
        self.counter = 0

    def register(self, company, notes):
        self.counter += 1 # BUG: Race condition in async!
        self.store[self.counter] = company + notes.upper() # BUG: AttributeError if notes is None!
        return self.counter`
    },
    verificationCriteria: [
      "Eliminates race condition using AtomicLong or thread lock",
      "Handles null notes safely without NullPointerException or AttributeError",
      "Ensures deterministic sequential ID generation"
    ]
  }
];
