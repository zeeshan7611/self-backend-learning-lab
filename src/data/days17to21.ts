import { DayLesson } from '../types';

export const DAYS_17_TO_21: DayLesson[] = [
  {
    day: 17,
    title: "Input Validation, Global Exception Handling, Pagination & Filtering",
    subtitle: "Enterprise robustness: Bean Validation (@Valid), Pydantic validators, ControllerAdvice, and pagination math",
    week: 3,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Implement declarative input validation: `@NotBlank`, `@Size`, `@Email` in Java vs Pydantic `Field` constraints in Python",
      "Build a centralized Global Exception Handler (`@ControllerAdvice` / custom exception handlers) with RFC-7807 problem details",
      "Implement offset-based pagination (`page`, `size`) with sorting and defensive upper-limit constraints",
      "Build search filtering across multiple criteria (status, company, date range)"
    ],
    keyTerminology: [
      {
        term: "Global Exception Handler",
        definition: "A centralized component that intercepts uncaught exceptions from any controller and formats them into predictable, RFC-standard JSON error responses.",
        analogy: "A hospital triage center: regardless of which ward an emergency occurs in, it is handled centrally with standard protocols."
      },
      {
        term: "Pagination & Offset",
        definition: "Splitting large result sets into smaller pages (`LIMIT size OFFSET (page * size)`) to prevent database memory exhaustion.",
        analogy: "Reading a 500-page book one chapter at a time instead of photocopying all 500 pages onto your desk at once."
      },
      {
        term: "RFC 7807 (Problem Details)",
        definition: "An IETF standard format for HTTP API error responses containing type, title, status, detail, and instance fields.",
        analogy: "A standard government traffic citation format where every ticket has violation type, penalty, officer ID, and timestamp in identical places."
      }
    ],
    conceptExplanation: {
      what: "Input validation ensures clients cannot send malformed data into your domain. Global error handlers ensure server crashes never leak raw stack traces to the public.",
      whyNeeded: "If an endpoint returns 50,000 database rows without pagination, a single HTTP request can trigger a server OutOfMemory error. Without input validation, users can submit empty names or negative salaries.",
      howItWorks: "Validation annotations trigger interceptors before the controller method executes. Unhandled exceptions bubble up to the global handler, which constructs an HTTP 400/404/500 JSON response.",
      beginnerMistakes: [
        "Leaking full Java/Python stack traces in production API responses (severe security risk exposing package versions and internal paths)",
        "Writing validation logic manually with 20 if-statements inside every controller method instead of using declarative annotations",
        "Allowing unbounded pagination requests (e.g. `size=1000000`) without enforcing a maximum page size cap (e.g. max 100)",
        "Calculating pagination offsets using 1-based index incorrectly resulting in skipped rows"
      ],
      backendRelevance: "This is what separates student code from production-grade enterprise software: defensive input hygiene, predictable error payloads, and safe pagination.",
      interviewerPerspective: "Interviewers frequently ask: 'What does your API error response look like when a validation constraint fails? Show me your Global Exception Handler.'",
      howToProveUnderstanding: "Test invalid payloads (blank company, negative salary), verify formatted RFC-7807 JSON 400 responses, and test paginated results."
    },
    javaCodeSnippet: {
      title: "GlobalExceptionHandler.java & Validation (Spring Boot)",
      code: `package com.launchlab.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    public record ErrorResponse(int status, String error, String message, Instant timestamp, Map<String, String> fieldErrors) {}

    // Handle Bean Validation Errors (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err -> 
            errors.put(err.getField(), err.getDefaultMessage())
        );

        ErrorResponse res = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            "One or more input fields failed validation constraints",
            Instant.now(),
            errors
        );
        return ResponseEntity.badRequest().body(res);
    }
}`,
      explanation: "`@RestControllerAdvice` catches all `@Valid` validation exceptions and formats clean field-level error messages without leaking internal traces."
    },
    pythonCodeSnippet: {
      title: "validation_and_errors.py (FastAPI)",
      code: `from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field
from datetime import datetime, timezone

class ApplicationCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=150, description="Company name")
    role_title: str = Field(..., min_length=2, max_length=100)
    salary_offered: float = Field(default=0.0, ge=0.0, description="Must be non-negative")

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = {err["loc"][-1]: err["msg"] for err in exc.errors()}
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": 422,
            "error": "Validation Error",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "field_errors": errors
        }
    )`,
      explanation: "Custom validation exception handler intercepting Pydantic validation errors and returning structured, readable JSON diagnostics."
    },
    practicalDeliverable: {
      title: "Centralized Validation Suite & Safe Paginated Listing",
      description: "Implement input constraints on `CreateApplicationRequest` (company length, role required, status enum). Create a Global Exception Handler. Update `GET /applications` to accept `page` and `size` parameters with a hard cap of `maxSize=50`.",
      acceptanceCriteria: [
        "Sending empty JSON `{}` to POST returns HTTP 400/422 with specific field error details",
        "Stack traces completely hidden from API consumers",
        "Pagination enforces `LIMIT` and `OFFSET` in queries",
        "Requesting `size=500` automatically caps at 50 without crashing"
      ]
    },
    debuggingTask: {
      problemTitle: "Raw Stack Trace Leak Security Vulnerability",
      language: "java",
      buggyCode: `// Bad code in production:
@GetMapping("/applications/{id}")
public Application get(@PathVariable Long id) {
    // If id is not found or DB fails, raw NullPointerException / SQLException is dumped to client!
    return repository.findById(id).get(); // Throws NoSuchElementException
}`,
      bugExplanation: "Calling `.get()` on an empty `Optional` throws `NoSuchElementException`, causing Spring to output a full stack trace exposing file paths, library versions, and database details to malicious users.",
      fixedCode: `@GetMapping("/applications/{id}")
public ResponseEntity<Application> get(@PathVariable Long id) {
    return repository.findById(id)
        .map(ResponseEntity::ok)
        .orElseThrow(() -> new ResourceNotFoundException("Application with ID " + id + " not found"));
}`
    },
    checklist: [
      "Added validation annotations / Pydantic fields on request models",
      "Implemented centralized Global Exception Handler",
      "Tested rejection of invalid payloads with structured error response",
      "Implemented pagination with defensive upper limits",
      "Verified that stack traces are never exposed in responses"
    ],
    quiz: [
      {
        id: "d17-q1",
        question: "Why is leaking raw Java/Python stack traces in API error responses a critical security risk?",
        options: [
          "It increases bandwidth costs unnecessarily",
          "It reveals internal software versions, exact server file paths, and database query structures to attackers, aiding targeted exploits",
          "It causes the client browser to freeze",
          "Stack traces are copyrighted"
        ],
        correctAnswer: 1,
        explanation: "Stack traces expose internal architecture, database types, framework versions, and code line numbers, giving attackers the exact blueprints needed for exploitation."
      },
      {
        id: "d17-q2",
        question: "How is the SQL OFFSET calculated for zero-based pagination given `page` and `size`?",
        options: [
          "`OFFSET = page + size`",
          "`OFFSET = page * size`",
          "`OFFSET = size / page`",
          "`OFFSET = (page - 1) * size`"
        ],
        correctAnswer: 1,
        explanation: "For zero-based indexing (page 0, 1, 2...), the offset is `page * size`. Page 0 has offset 0; page 1 has offset 10 (for size 10)."
      },
      {
        id: "d17-q3",
        question: "What is the purpose of `@RestControllerAdvice` in Spring Boot?",
        options: [
          "To provide advertising banners in the API",
          "To intercept exceptions thrown by any `@RestController` across the application and handle them in a single centralized location",
          "To restrict API access to advice staff",
          "To automatically generate HTML forms"
        ],
        correctAnswer: 1,
        explanation: "`@RestControllerAdvice` applies cross-cutting exception handling across all controllers using `@ExceptionHandler` methods."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between Offset-Based Pagination and Keyset (Cursor-Based) Pagination? When should you use which?",
        answer: "Offset-based pagination (`LIMIT 10 OFFSET 100000`) instructs the database to scan and discard 100,000 rows before returning 10, which degrades severely at high offsets. Additionally, if new rows are inserted while a user navigates pages, they will see duplicate rows. Keyset pagination (`WHERE id > last_seen_id ORDER BY id LIMIT 10`) uses indexed column pointers, executing in constant O(1) index time regardless of depth. Use Offset for simple UIs with page numbers; use Keyset for infinite scroll and high-volume feeds.",
        tips: "Highlighting the performance degradation of high OFFSET values shows senior-level database comprehension."
      },
      {
        question: "How do you structure a production-grade API error response according to industry standards?",
        answer: "A standard error response follows RFC 7807 (Problem Details). It contains: 1) `status` (HTTP status code), 2) `error` (short human-readable summary), 3) `message` (specific description), 4) `timestamp` (ISO-8601 UTC), 5) `path` (requested URI), and 6) an optional `errors` map detailing specific field-level validation failures. It should never include raw exception class names or stack traces.",
        tips: "Recite the RFC 7807 fields—interviewers love seeing standards-based engineering."
      }
    ],
    reflectionPrompt: "Why does having consistent, structured error responses make frontend engineering teams love working with your backend APIs?",
    measurableCriteria: "Learner can implement declarative request validation, centralized error handling, and safe pagination with verified error schemas.",
    videoTutorial: {
      title: "Data Validation & Exception Handling in Spring Boot (Hindi)",
      embedId: "FaRgEy1ncZg",
      channel: "Learn Code With Durgesh (Hindi)",
      duration: "25 mins",
      takeaway: "Bean Validation (@Valid, @NotNull), Global Exception Handler (@RestControllerAdvice) aur RFC standard error formatting."
    },
    resources: [
      {
        title: "Spring Guides: Validating Form Input",
        purpose: "Official Spring guide on Bean Validation and error bindings",
        url: "https://spring.io/guides/gs/validating-form-input/",
        isOfficial: true
      },
      {
        title: "FastAPI Tutorial: Handling Errors",
        purpose: "Official guide to HTTPException and custom exception handlers",
        url: "https://fastapi.tiangolo.com/tutorial/handling-errors/",
        isOfficial: true
      }
    ]
  },
  {
    day: 18,
    title: "Unit Testing & API Integration Testing",
    subtitle: "Testing pyramid, JUnit 5 + Mockito (Java) vs Pytest + HTTPX (Python), assertions, and test isolation",
    week: 4,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Understand the Testing Pyramid: Unit Tests, Integration Tests, and End-to-End Tests",
      "Write isolated unit tests for the Service layer using Mocks (Mockito in Java, `unittest.mock` in Python)",
      "Implement integration tests verifying real HTTP requests against mock web environments (`MockMvc` / `TestClient`)",
      "Assert on status codes, JSON response properties, and database state transitions"
    ],
    keyTerminology: [
      {
        term: "Unit Test vs Integration Test",
        definition: "A Unit Test exercises a single function/class in complete isolation with mock dependencies. An Integration Test tests multiple components working together (e.g. Controller + Service + DB).",
        analogy: "Testing a car alternator on a workbench with a multimeter (Unit Test) vs driving the car on a test track to see if the battery charges while driving (Integration Test)."
      },
      {
        term: "Mock Object",
        definition: "A simulated object that mimics the behavior of a real dependency (like a database or external payment gateway) in controlled ways.",
        analogy: "A crash-test dummy used to simulate a human passenger during safety testing."
      },
      {
        term: "Arrange-Act-Assert (AAA)",
        definition: "The universal pattern for structuring clean test cases: 1) Arrange preconditions and inputs, 2) Act on the target method, 3) Assert expected outcomes.",
        analogy: "1) Gathering ingredients, 2) Baking the cake, 3) Tasting the cake to verify it is sweet."
      }
    ],
    conceptExplanation: {
      what: "Automated tests execute your code under predefined conditions to verify correctness and prevent software regressions.",
      whyNeeded: "Manual testing via Postman or browser clicking is slow, error-prone, and impossible to scale. Automated test suites let you deploy updates with complete confidence in minutes.",
      howItWorks: "Test runners execute test functions, mock dependencies using bytecode manipulation or monkey patching, and verify assertions against returned results.",
      beginnerMistakes: [
        "Writing unit tests that connect to real external production databases instead of using mocks or isolated test DBs",
        "Writing tests without assertions (a test that only checks if code runs without crashing is not a test)",
        "Creating test cases that depend on each other's execution order (tests must be 100% isolated and independent)",
        "Testing trivial boilerplate (like Lombok getters/setters) instead of critical business rules"
      ],
      backendRelevance: "Top tech companies will reject candidates whose code lacks tests. CI/CD pipelines (GitHub Actions) automatically reject pull requests that fail test suites.",
      interviewerPerspective: "Interviewers ask candidates: 'How would you write a test for a method that charges a credit card without actually charging a real credit card?' (Mocking!).",
      howToProveUnderstanding: "Write at least 3 unit tests with mocks for your Service layer and 2 integration tests testing HTTP endpoints with MockMvc or TestClient."
    },
    javaCodeSnippet: {
      title: "ApplicationServiceTest.java (JUnit 5 + Mockito)",
      code: `package com.launchlab.service;

import com.launchlab.model.ApplicationEntity;
import com.launchlab.repository.ApplicationJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationJpaRepository repository;

    @InjectMocks
    private ApplicationService service;

    @Test
    void shouldThrowExceptionWhenApplicationNotFound() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            service.getApplicationById(99L);
        });

        verify(repository, times(1)).findById(99L);
    }
}`,
      explanation: "Uses Mockito to isolate the Service from the real database, verifying expected exceptions and repository interactions."
    },
    pythonCodeSnippet: {
      title: "test_applications.py (Pytest + FastAPI TestClient)",
      code: `import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_application_success():
    # Arrange
    payload = {
        "company_name": "Zerodha",
        "role_title": "Backend Developer",
        "salary_offered": 1200000.0
    }
    
    # Act
    response = client.post("/api/v1/applications", json=payload)
    
    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["company_name"] == "Zerodha"
    assert "id" in data

def test_validation_error_on_empty_company():
    response = client.post("/api/v1/applications", json={"company_name": ""})
    assert response.status_code == 422 # Unprocessable Entity`,
      explanation: "FastAPI `TestClient` simulates HTTP requests through the ASGI stack without needing to launch a network socket, verifying status codes and JSON response bodies."
    },
    practicalDeliverable: {
      title: "Automated Test Suite with Unit Mocks and HTTP Integration Tests",
      description: "Write an automated test suite for your backend: 1) Unit test verifying business logic in Service with mocked repository, 2) Unit test verifying error throwing, 3) API integration test verifying 201 Created on valid POST, 4) API test verifying 400/422 on invalid payload.",
      acceptanceCriteria: [
        "All tests execute and pass cleanly via `mvn test` or `pytest`",
        "Uses Arrange-Act-Assert (AAA) pattern throughout",
        "Service unit tests run in memory without connecting to a database",
        "Integration tests assert on HTTP status codes and JSON keys"
      ]
    },
    debuggingTask: {
      problemTitle: "Interdependent / Order-Dependent Test Failure Bug",
      language: "python",
      buggyCode: `# Buggy test suite:
shared_id = None

def test_1_create():
    global shared_id
    res = client.post("/apps", json={"company": "TestCorp"})
    shared_id = res.json()["id"] # Test 1 stores state for Test 2!

def test_2_delete():
    # If test_2 runs first or test_1 fails, this crashes!
    res = client.delete(f"/apps/{shared_id}")
    assert res.status_code == 204`,
      bugExplanation: "Tests must be completely independent. Sharing global state between tests causes flaky test suites when tests are executed in random or parallel order.",
      fixedCode: `def test_delete_application():
    # Arrange: Create its own dedicated fixture record
    create_res = client.post("/apps", json={"company": "IndependentCorp", "role": "Dev"})
    app_id = create_res.json()["id"]

    # Act & Assert
    delete_res = client.delete(f"/apps/{app_id}")
    assert delete_res.status_code == 204`
    },
    checklist: [
      "Set up test dependencies (JUnit/Mockito or Pytest/HTTPX)",
      "Implemented Arrange-Act-Assert structured test methods",
      "Mocked database repositories to test Service in total isolation",
      "Executed API integration tests verifying status codes and JSON structures",
      "Ensured all tests are 100% isolated with zero order dependencies"
    ],
    quiz: [
      {
        id: "d18-q1",
        question: "What is the primary purpose of a Mock object in unit testing?",
        options: [
          "To speed up computer hardware",
          "To isolate the unit under test by replacing real external dependencies (databases, payment APIs) with controlled simulated objects",
          "To generate HTML test reports",
          "To test internet connection speeds"
        ],
        correctAnswer: 1,
        explanation: "Mocks isolate the component being tested so that tests remain deterministic, fast, and unpolluted by external network or database failures."
      },
      {
        id: "d18-q2",
        question: "What are the three phases of the Arrange-Act-Assert (AAA) test pattern?",
        options: [
          "Ask, Answer, Agree",
          "Arrange test fixtures and data, Act by invoking the target method, Assert that results match expectations",
          "Allocate memory, Access disk, Archive logs",
          "Authenticate, Authorize, Audit"
        ],
        correctAnswer: 1,
        explanation: "AAA is the universal standard: 1. Arrange inputs and mock expectations, 2. Act on the function, 3. Assert outputs and side-effects."
      },
      {
        id: "d18-q3",
        question: "Why should unit tests never rely on the execution order of other tests in the suite?",
        options: [
          "Test runners shuffle execution order randomly or run tests across parallel CPU threads; order dependencies cause flaky, unpredictable failures",
          "Compilers reject non-alphabetical test names",
          "It violates HTTP standards",
          "Only integration tests can be run in order"
        ],
        correctAnswer: 0,
        explanation: "Tests must be completely hermetic and isolated so they can run concurrently in parallel pipelines without side effects."
      }
    ],
    interviewQuestions: [
      {
        question: "Explain the Testing Pyramid and why having more unit tests than end-to-end (E2E) tests is essential in backend systems.",
        answer: "The Testing Pyramid consists of Unit Tests at the base, Integration Tests in the middle, and End-to-End (E2E) tests at the top. Unit tests are fast (milliseconds), cheap to run, and pin down exact code lines when failures occur. E2E tests are slow (minutes), fragile, and expensive to maintain. A healthy pyramid invests 70% in unit tests, 20% in integration tests, and 10% in E2E tests to ensure rapid feedback cycles during development.",
        tips: "Mention CI/CD build times: 'A suite of 5,000 unit tests runs in 15 seconds, allowing developers to push with confidence on every commit.'"
      },
      {
        question: "What is the difference between a Mock, a Stub, and a Fake in test terminology?",
        answer: "1. Stub: Provides canned, predetermined answers to calls during the test (e.g. always returns a fixed user). 2. Mock: A programmable object that verifies interactions and expectations (e.g. verifying `emailService.send()` was called exactly once). 3. Fake: A working simplified implementation not suitable for production (e.g. an in-memory H2 or SQLite database instead of PostgreSQL).",
        tips: "Martin Fowler's 'Mocks Aren't Stubs' distinction is a classic senior interview topic."
      }
    ],
    reflectionPrompt: "How does writing automated tests actually make you code faster rather than slower over the course of a project?",
    measurableCriteria: "Learner can write isolated unit tests with mocks, integration tests against API endpoints, and maintain zero order-dependent test failures.",
    videoTutorial: {
      title: "JUnit Testing & Mockito in Spring Boot (Hindi)",
      embedId: "n1xX8u76wLY",
      channel: "Engineering Digest (Hindi)",
      duration: "25 mins",
      takeaway: "JUnit 5 annotations (@Test, @ParameterizedTest), Mockito mocking, aur isolated unit testing step-by-step Hindi me."
    },
    resources: [
      {
        title: "Spring Guides: Testing the Web Layer",
        purpose: "Official Spring guide on MockMvc and service unit testing",
        url: "https://spring.io/guides/gs/testing-web/",
        isOfficial: true
      },
      {
        title: "FastAPI Tutorial: Testing",
        purpose: "Official tutorial on using Pytest and TestClient for API integration tests",
        url: "https://fastapi.tiangolo.com/tutorial/testing/",
        isOfficial: true
      }
    ]
  },
  {
    day: 19,
    title: "Authentication, Authorization & Backend Security Principles",
    subtitle: "Password hashing (BCrypt), JWT token lifecycle, stateless auth, and OWASP Top 10 prevention",
    week: 4,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Understand Authentication (who you are) vs Authorization (what you can do: RBAC)",
      "Hash and salt passwords securely using BCrypt / Argon2 (never plain text or MD5/SHA256)",
      "Master JWT (JSON Web Token) architecture: Header, Payload, Signature, and expiration claims",
      "Defend against OWASP Top 10 backend vulnerabilities: SQL Injection, Broken Access Control, and Sensitive Data Exposure"
    ],
    keyTerminology: [
      {
        term: "Salted Password Hashing (BCrypt)",
        definition: "A slow, computationally intensive cryptographic hashing algorithm that prepends random random bits ('salt') to passwords before hashing to defeat rainbow table attacks.",
        analogy: "Adding a secret dash of unique spices to a family recipe so no one can reverse-engineer the ingredients by taste alone."
      },
      {
        term: "JWT (JSON Web Token)",
        definition: "A compact, URL-safe means of representing claims between two parties. The signature allows servers to verify authenticity statelessly without querying a session store.",
        analogy: "A tamper-evident festival wristband stamped with an official hologram showing your ticket tier and expiration time."
      },
      {
        term: "SQL Injection (SQLi)",
        definition: "A vulnerability where untrusted user input is directly concatenated into a SQL statement, allowing attackers to manipulate queries and dump database tables.",
        analogy: "A bank withdrawal slip where someone writes: 'Withdraw ₹500 AND ALSO transfer all vault money to my account'."
      }
    ],
    conceptExplanation: {
      what: "Security ensures only authenticated users access your backend and that they can only touch resources they are authorized to view.",
      whyNeeded: "A data breach destroys companies and violates privacy laws (GDPR, DPDP). Storing passwords in plaintext or concatenating strings in SQL queries is professional malpractice.",
      howItWorks: "User logs in with credentials -> Server verifies salted BCrypt hash -> Server signs a JWT with secret key -> Client sends `Authorization: Bearer <token>` on subsequent requests -> Server verifies signature without DB lookup.",
      beginnerMistakes: [
        "Storing passwords in plain text or using outdated fast hashes like MD5 or plain SHA-256",
        "Putting sensitive secrets (passwords, credit card numbers) inside the unencrypted JWT payload",
        "Hardcoding the JWT secret key as `'secret123'` directly inside source code",
        "Concatenating user input directly into SQL strings (`'SELECT * FROM users WHERE name = '' + input + '''`)"
      ],
      backendRelevance: "Every production backend requires authentication (login, registration) and authorization (protecting user data from being viewed by other users).",
      interviewerPerspective: "Interviewers ask: 'Why should you use BCrypt instead of SHA-256 for passwords? How does a server verify a JWT without looking at a database?'",
      howToProveUnderstanding: "Implement BCrypt password hashing, sign a JWT with an expiration claim, and secure an endpoint behind a Bearer token check."
    },
    javaCodeSnippet: {
      title: "PasswordAndJwtDemo.java (Spring Security Concepts)",
      code: `package com.launchlab.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordAndJwtDemo {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public static String hashPassword(String rawPassword) {
        // Generates unique salt and computes slow cryptographic hash
        return encoder.encode(rawPassword);
    }

    public static boolean verifyPassword(String rawPassword, String storedHash) {
        // Compares input against stored hash using constant-time comparison
        return encoder.matches(rawPassword, storedHash);
    }

    public static void main(String[] args) {
        String hash = hashPassword("CandidatePass@2026");
        System.out.println("BCrypt Hash: " + hash);
        System.out.println("Matches? " + verifyPassword("CandidatePass@2026", hash)); // true
    }
}`,
      explanation: "Uses `BCryptPasswordEncoder` with strength factor 12. Generates unique salts and uses constant-time comparison to prevent timing attacks."
    },
    pythonCodeSnippet: {
      title: "security_jwt.py (FastAPI / Passlib / PyJWT)",
      code: `from passlib.context import CryptContext
import jwt
from datetime import datetime, timezone, timedelta
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET", "super-secure-dev-secret-key-32chars")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(user_id: int, expires_delta: timedelta = timedelta(hours=1)) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + expires_delta,
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)`,
      explanation: "BCrypt password hashing via `passlib` and stateless JWT creation with expiration (`exp`) and subject (`sub`) claims."
    },
    practicalDeliverable: {
      title: "Stateless Auth Gate & Secure Password Hashing Module",
      description: "Implement a secure User registration and login flow: 1) Hash passwords with BCrypt before saving to DB, 2) Verify passwords on login and generate signed JWT, 3) Add an auth middleware or dependency protecting `/api/v1/applications` requiring `Authorization: Bearer <token>`.",
      acceptanceCriteria: [
        "Passwords stored in database strictly as salted BCrypt hashes",
        "Login endpoint returns signed JWT with expiration timestamp",
        "Protected endpoints reject requests without token with HTTP 401 Unauthorized",
        "Parameterized queries / ORM used exclusively to prevent SQL injection"
      ]
    },
    debuggingTask: {
      problemTitle: "SQL Injection via String Concatenation Vulnerability",
      language: "sql",
      buggyCode: `-- Vulnerable Backend Query:
String query = "SELECT * FROM users WHERE email = '" + userEmailInput + "'";
// If user inputs: admin@test.com' OR '1'='1
// Query becomes: SELECT * FROM users WHERE email = 'admin@test.com' OR '1'='1';
// Result: Dumps the entire database table and logs in as admin!`,
      bugExplanation: "Concatenating unescaped user strings directly into SQL queries allows attackers to break out of data literals and inject executable SQL commands.",
      fixedCode: `-- Parameterized PreparedStatement (Safe):
String query = "SELECT * FROM users WHERE email = ?";
PreparedStatement stmt = conn.prepareStatement(query);
stmt.setString(1, userEmailInput); // Handled strictly as data literal, never executable code!`
    },
    checklist: [
      "Explained difference between Authentication (401) and Authorization (403)",
      "Implemented BCrypt salted password hashing",
      "Constructed and verified JWT with signature and expiration claim",
      "Secured API endpoints behind Bearer token authentication",
      "Eliminated all string-concatenated SQL queries to prevent SQL injection"
    ],
    quiz: [
      {
        id: "d19-q1",
        question: "Why is plain SHA-256 unsuitable for password storage without salting and iteration stretching?",
        options: [
          "SHA-256 is an encryption algorithm, not a hash",
          "SHA-256 is designed to be extremely fast; modern GPUs can compute billions of SHA-256 hashes per second, making brute-force and rainbow table attacks trivial",
          "SHA-256 only works on numbers",
          "SHA-256 is deprecated by Google"
        ],
        correctAnswer: 1,
        explanation: "Password hashing algorithms (BCrypt, Argon2, PBKDF2) are intentionally slow and computationally expensive with configurable work factors to defeat GPU brute-forcing."
      },
      {
        id: "d19-q2",
        question: "Can anyone read the payload of a standard JWT token if they intercept it?",
        options: [
          "No, JWT payloads are encrypted with AES-256 by default",
          "Yes, standard JWT payloads are merely Base64Url-encoded, NOT encrypted; anyone can decode and view them, so never store sensitive secrets in the payload",
          "Only the server administrator can read it",
          "Only clients with the secret key can read it"
        ],
        correctAnswer: 1,
        explanation: "Base64 is an encoding, not encryption. Anyone can decode a JWT payload. The cryptographic signature guarantees authenticity and tamper-detection, not confidentiality."
      },
      {
        id: "d19-q3",
        question: "How do Parameterized Queries (Prepared Statements) completely prevent SQL Injection?",
        options: [
          "By blocking all quote marks from user input",
          "By sending query structure and user parameters separately to the database engine, ensuring user input is treated strictly as data literals and never executed as SQL code",
          "By running the query inside a sandbox",
          "By encrypting the database table"
        ],
        correctAnswer: 1,
        explanation: "Prepared Statements compile the SQL syntax first. User data is bound as parameters afterward, preventing input from altering the compiled execution plan."
      }
    ],
    interviewQuestions: [
      {
        question: "How does stateless JWT authentication work, and what are its main advantages and disadvantages compared to server-side session cookies?",
        answer: "In JWT auth, the server signs a cryptographic token containing user claims and sends it to the client. On subsequent requests, the server validates the signature mathematically using its secret key without querying a database or session cache. Advantages: Highly scalable across distributed microservices, stateless, no server session memory required. Disadvantages: Hard to invalidate/revoke before expiration without maintaining a token blacklist, larger payload size over the wire, and tokens cannot be revoked instantly if compromised.",
        tips: "Interviewers look for candidates who understand the revocation problem: how do you log a user out immediately if a JWT is stateless? (Answer: Short expiration times + Refresh tokens or Redis blacklist)."
      },
      {
        question: "What is Role-Based Access Control (RBAC) and how is it implemented in API endpoints?",
        answer: "RBAC assigns permissions to specific roles (e.g. USER, MANAGER, ADMIN) and assigns users to roles. Endpoints enforce role checks via annotations or middleware (e.g. `@PreAuthorize('hasRole(\"ADMIN\")')` in Spring Security or dependencies in FastAPI). If an authenticated user with role USER accesses an ADMIN endpoint, the server returns HTTP 403 Forbidden.",
        tips: "Differentiate clearly: 401 Unauthorized (missing/bad token) vs 403 Forbidden (authenticated, but insufficient role)."
      }
    ],
    reflectionPrompt: "Why should you never attempt to 'invent your own encryption' or use plain SHA-256 for passwords when battle-tested libraries like BCrypt and Argon2 exist?",
    measurableCriteria: "Learner can implement BCrypt password hashing, sign and verify JWT tokens with expiration, and protect routes against unauthenticated access.",
    videoTutorial: {
      title: "Complete JWT Authentication with Spring Boot 3 in One Video (Hindi)",
      embedId: "WBjYn0q8l38",
      channel: "Learn Code With Durgesh (Hindi)",
      duration: "35 mins",
      takeaway: "BCrypt password hashing, JWT token creation, filters, aur endpoint security configuration Hindi me."
    },
    resources: [
      {
        title: "Spring Security Architecture Reference",
        purpose: "Official documentation on filters, authentication, and authorization",
        url: "https://docs.spring.io/spring-security/reference/servlet/architecture.html",
        isOfficial: true
      },
      {
        title: "FastAPI Tutorial: Security — First Steps & JWT",
        purpose: "Official FastAPI security and OAuth2 with password hashing",
        url: "https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/",
        isOfficial: true
      }
    ]
  },
  {
    day: 20,
    title: "Logging, Configuration, Clean Code & Git Workflow",
    subtitle: "SLF4J/Logback, Loguru, structured JSON logging, environment profiles, semantic Git commits, and PR hygiene",
    week: 4,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Replace all `System.out.println` and `print()` with structured logging frameworks (SLF4J/Logback in Java, logging/loguru in Python)",
      "Master log levels: DEBUG, INFO, WARN, and ERROR with contextual correlation IDs",
      "Manage environment configuration profiles (`application-dev.yml` vs `application-prod.yml`)",
      "Apply professional Git workflow: feature branching (`feature/xyz`), atomic commits, and writing an exemplary README"
    ],
    keyTerminology: [
      {
        term: "Structured Logging",
        definition: "Formatting log messages as structured data (like JSON) with consistent key-value pairs (timestamp, level, traceId, message) to enable automated querying in centralized log systems (Datadog, ELK).",
        analogy: "Filing patient records into a searchable digital database with standard fields instead of scribbling random handwritten notes on napkins."
      },
      {
        term: "Correlation ID (Trace ID)",
        definition: "A unique UUID generated when an HTTP request arrives, passed through all logs and service calls for that request to trace its entire execution path.",
        analogy: "A baggage claim barcode: scanned at check-in, transfer, and carousel to track a single bag through complex airport handling."
      },
      {
        term: "Atomic Git Commit",
        definition: "A Git commit that encapsulates a single logical change, complete with working code and tests, described by a clear semantic commit message.",
        analogy: "A single clean entry in a ledger rather than crossing out five unrelated transactions in one scribbled paragraph."
      }
    ],
    conceptExplanation: {
      what: "Logging records the runtime behavior and errors of an application. Clean Git workflows track software evolution collaboratively.",
      whyNeeded: "When a customer reports an issue at 2:00 AM on a remote production server, you cannot attach an IDE debugger. Logs are your only diagnostic lifeline.",
      howItWorks: "Loggers output formatted text or JSON to `stdout` or log files, using asynchronous appenders to minimize I/O overhead on worker threads.",
      beginnerMistakes: [
        "Leaving `System.out.println('here 1')` in production code (wastes CPU, cannot be filtered, lacks timestamps or thread context)",
        "Logging sensitive user data like passwords, credit card numbers, or auth tokens into logs (security compliance violation)",
        "Logging an error at ERROR level and then re-throwing it, causing the same failure to be logged 5 times across layers",
        "Writing vague Git commit messages like `'fixed bug'` or `'updates'` instead of semantic messages (`'fix(auth): validate token expiration timestamp'`)"
      ],
      backendRelevance: "Engineering leads evaluate candidates heavily on code hygiene: structured logs, clean package structures, meaningful Git commit history, and comprehensive README documentation.",
      interviewerPerspective: "Interviewers ask: 'How do you trace a slow API request across multiple backend services in production?' (Correlation IDs / Distributed Tracing).",
      howToProveUnderstanding: "Configure structured logging with log levels, generate request correlation IDs in middleware, and commit changes with conventional semantic commits."
    },
    javaCodeSnippet: {
      title: "StructuredLoggingDemo.java (SLF4J + MDC)",
      code: `package com.launchlab.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import java.util.UUID;

public class StructuredLoggingDemo {
    private static final Logger log = LoggerFactory.getLogger(StructuredLoggingDemo.class);

    public static void handleRequest(String userId, String action) {
        String correlationId = UUID.randomUUID().toString();
        // Mapped Diagnostic Context (MDC) attaches correlationId to all logs on current thread
        MDC.put("correlationId", correlationId);
        MDC.put("userId", userId);

        try {
            log.info("Processing action: {}", action);
            if ("FAIL".equals(action)) {
                throw new IllegalStateException("Simulated processing failure");
            }
            log.debug("Action {} completed successfully", action);
        } catch (Exception e) {
            log.error("Failed executing action: {} | Error: {}", action, e.getMessage(), e);
        } finally {
            MDC.clear(); // Always clean up thread-local MDC!
        }
    }
}`,
      explanation: "Uses SLF4J parameterized logging (`{}`) and `MDC` to attach correlation IDs across all logs within a thread execution frame."
    },
    pythonCodeSnippet: {
      title: "logging_middleware.py (Python Structured Logging)",
      code: `import logging
import uuid
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(
    level=logging.INFO,
    format='{"time": "%(asctime)s", "level": "%(levelname)s", "correlation_id": "%(correlation_id)s", "message": "%(message)s"}'
)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        extra = {"correlation_id": correlation_id}
        logger = logging.LoggerAdapter(logging.getLogger("api"), extra)
        
        logger.info(f"Incoming {request.method} {request.url.path}")
        response = await call_next(request)
        logger.info(f"Completed with status {response.status_code}")
        response.headers["X-Correlation-ID"] = correlation_id
        return response`,
      explanation: "FastAPI middleware injecting a unique Correlation ID into request headers and emitting structured JSON log lines."
    },
    practicalDeliverable: {
      title: "Production Logging Middleware & Clean Git Repository Audit",
      description: "Replace all print statements with proper logging in your project. Implement a logging filter/middleware that adds a unique `X-Correlation-ID` to all responses. Audit your Git history: ensure branches follow `feature/xyz` conventions and write a professional README.md.",
      acceptanceCriteria: [
        "Zero `System.out.println` or raw `print()` statements in project",
        "Endpoints log incoming requests and outcomes with correct log levels (DEBUG/INFO/ERROR)",
        "Responses include `X-Correlation-ID` header matching log output",
        "Comprehensive README.md with prerequisites, setup commands, and sample cURL requests"
      ]
    },
    debuggingTask: {
      problemTitle: "Sensitive PII & Password Leak in Logs",
      language: "java",
      buggyCode: `// Catastrophic logging bug:
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    // Leaking plain text passwords into disk logs!
    log.info("User login attempt with payload: {}", req); // ToString prints password!
    // ...
}`,
      bugExplanation: "Printing raw request objects in logs can write user passwords or credit card numbers into log files, which violates GDPR, PCI-DSS, and SOC2 compliance.",
      fixedCode: `@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    // Log safe, non-sensitive identifiers only
    log.info("User login attempt for username: {}", req.username());
    // ...
}`
    },
    checklist: [
      "Eliminated all raw print statements from the codebase",
      "Configured SLF4J / Python logging with appropriate log levels",
      "Implemented Correlation ID middleware for request tracing",
      "Masked or excluded sensitive credentials (passwords, tokens) from logs",
      "Structured Git history with clean semantic commits"
    ],
    quiz: [
      {
        id: "d20-q1",
        question: "Why should `System.out.println()` never be used for logging in production backend services?",
        options: [
          "It crashes after 1000 lines",
          "`System.out.println` synchronizes on a shared print stream causing thread contention, cannot be redirected or filtered by log levels (DEBUG/INFO/ERROR), and lacks structured metadata like timestamps and thread IDs",
          "It is only supported in desktop Java applications",
          "It causes database rollbacks"
        ],
        correctAnswer: 1,
        explanation: "Standard print statements are synchronous, lack severity filtering, cannot output structured JSON, and severely degrade performance under high concurrent load."
      },
      {
        id: "d20-q2",
        question: "What is the primary role of a Correlation ID (Trace ID) in distributed backend architectures?",
        options: [
          "To authenticate the user's password",
          "To uniquely tag all log statements across multiple microservices and threads associated with a single client HTTP request, enabling end-to-end debugging",
          "To encrypt database tables",
          "To compress JSON payloads"
        ],
        correctAnswer: 1,
        explanation: "A correlation ID ties together every log entry generated across multiple servers and services for a specific request, making it easy to isolate and diagnose failures."
      },
      {
        id: "d20-q3",
        question: "What is the recommended log level for unexpected exceptions that require engineer investigation?",
        options: [
          "DEBUG",
          "INFO",
          "ERROR",
          "TRACE"
        ],
        correctAnswer: 2,
        explanation: "ERROR is reserved for failures and unhandled exceptions that degrade functionality or require engineer intervention."
      }
    ],
    interviewQuestions: [
      {
        question: "What are the standard log levels and when would you use each one in a backend application?",
        answer: "1. TRACE: Extremely granular diagnostic information, typically used only during low-level protocol development. 2. DEBUG: Detailed diagnostic information useful during active development and troubleshooting (e.g., query parameters, internal state). 3. INFO: High-level operational events confirming system progress (e.g., application started, user registered, order placed). 4. WARN: Unexpected situations or recoverable anomalies that don't halt the operation (e.g., fallback cache used, deprecated API invoked). 5. ERROR: Critical failures or unhandled exceptions that abort a transaction and require investigation.",
        tips: "Highlight that in production, log level is typically set to INFO or WARN to prevent disk exhaustion, and toggled to DEBUG temporarily when diagnosing an incident."
      },
      {
        question: "What makes an exemplary GitHub repository README for a junior backend engineer?",
        answer: "A professional README must include: 1) Project Title and concise one-line value proposition. 2) Tech Stack badges (Java 21, Spring Boot, PostgreSQL, Docker). 3) Architecture Diagram or layer overview. 4) Prerequisites and clear step-by-step local setup instructions. 5) Environment variable documentation (`.env.example`). 6) API Documentation table with endpoints, methods, and sample cURL requests. 7) Testing instructions (`mvn test` / `pytest`). 8) Key engineering trade-offs and decisions.",
        tips: "Reciting these exact points shows you think like a professional engineer who builds software for teams, not just for a college assignment."
      }
    ],
    reflectionPrompt: "How does structured logging and correlation IDs transform a panicked production incident into a systematic, calm 5-minute debugging exercise?",
    measurableCriteria: "Learner can configure structured logging, track requests via correlation IDs, prevent sensitive data leaks, and maintain semantic Git commit standards.",
    videoTutorial: {
      title: "Logging in Spring Boot: Complete Guide in Hindi",
      embedId: "FaRgEy1ncZg",
      channel: "Learn Code With Durgesh (Hindi)",
      duration: "20 mins",
      takeaway: "SLF4J, Logback, log levels (INFO, DEBUG, ERROR), aur production environment me structured logging setup."
    },
    resources: [
      {
        title: "Baeldung: Introduction to SLF4J and Logback",
        purpose: "Comprehensive guide to Java logging architecture and MDC",
        url: "https://www.baeldung.com/slf4j-with-log4j2-logback",
        isOfficial: false
      },
      {
        title: "Python Official Docs: Logging HOWTO",
        purpose: "Official Python logging guide covering handlers, formatters, and adapters",
        url: "https://docs.python.org/3/howto/logging.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 21,
    title: "Capstone Blueprint: Requirements, Data Model & Implementation Plan",
    subtitle: "Architecture design: Job Application Tracker API requirements, ER diagram, endpoint specs, and sprint breakdown",
    week: 4,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Review the complete capstone specifications for the Job Application Tracker API",
      "Design the relational entity relationship model: Users, Applications, Companies, and ActivityLogs",
      "Establish the complete REST API endpoint matrix with validation rules and response schemas",
      "Construct a realistic 3-day sprint plan for Days 22, 23, and 24 to guarantee completion"
    ],
    keyTerminology: [
      {
        term: "Software Requirements Specification (SRS)",
        definition: "A formal document describing what the software will do and how it will be expected to perform, split into functional and non-functional requirements.",
        analogy: "An architect's blueprint for a house: specifying room dimensions, plumbing lines, electrical capacity, and building materials before laying bricks."
      },
      {
        term: "Non-Functional Requirements (NFR)",
        definition: "Criteria that evaluate system operation rather than specific behaviors (performance, security, testability, latency, data integrity).",
        analogy: "Functional: The car has doors that open. Non-functional: The car accelerates safely and achieves 20 km/l fuel efficiency."
      },
      {
        term: "Work Breakdown Structure (WBS)",
        definition: "Decomposing a large project into smaller, manageable, deliverables-oriented components.",
        analogy: "Breaking down 'build a house' into foundation, framing, electrical, plumbing, and painting."
      }
    ],
    conceptExplanation: {
      what: "Day 21 transitions from guided learning into engineering execution. You design the comprehensive blueprint for your portfolio project before writing code.",
      whyNeeded: "Junior developers frequently rush to code without planning, creating messy schemas, broken foreign keys, and missing edge cases that require painful rewrites.",
      howItWorks: "You define the data model in an ER diagram, specify API endpoints, document validation constraints, establish acceptance criteria, and plan the task checklist.",
      beginnerMistakes: [
        "Jumping into coding Day 22 without a finalized database schema (leads to breaking database migrations later)",
        "Overcomplicating the project with 15 tables and unfinished microservices instead of building 3-4 rock-solid, well-tested entities",
        "Neglecting test cases and documentation until after coding is complete",
        "Failing to plan for edge cases: what happens when a company is deleted? What if an application status transition is invalid?"
      ],
      backendRelevance: "Before any production feature is built at companies like Amazon or Uber, engineers write a Design Document (RFC) reviewed by senior peers. Planning IS software engineering.",
      interviewerPerspective: "In portfolio project walkthroughs, interviewers ask: 'Walk me through your database schema design and why you chose this data model.'",
      howToProveUnderstanding: "Produce a complete design document with ER diagram, endpoint specifications, and task breakdown for the Job Application Tracker."
    },
    javaCodeSnippet: {
      title: "capstone_schema.sql (Blueprint Data Model)",
      code: `-- Capstone Database Schema: Job Application Tracker API
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    role_title VARCHAR(120) NOT NULL,
    job_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED')),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    follow_up_date DATE,
    salary_offered NUMERIC(12, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);`,
      explanation: "Relational schema enforcing user ownership, status enums, foreign keys with cascading deletes, and search indexes."
    },
    pythonCodeSnippet: {
      title: "api_matrix.md (Endpoint Design Spec)",
      code: `### API Endpoint Matrix:
| Method | Endpoint | Description | Auth Required | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| POST | /api/v1/auth/register | Register a new user | No | 201 Created |
| POST | /api/v1/auth/login | Authenticate & get JWT | No | 200 OK |
| GET | /api/v1/applications | List paginated applications with filters | Yes | 200 OK |
| POST | /api/v1/applications | Create new job application | Yes | 201 Created |
| GET | /api/v1/applications/{id} | Get application details | Yes | 200 OK |
| PUT | /api/v1/applications/{id} | Full update of application | Yes | 200 OK |
| PATCH | /api/v1/applications/{id}/status | Update status only | Yes | 200 OK |
| DELETE | /api/v1/applications/{id} | Delete application | Yes | 204 No Content |
| GET | /api/v1/analytics/summary | Metrics: total apps, interview rate | Yes | 200 OK |`,
      explanation: "Comprehensive REST API matrix mapping methods, security requirements, and HTTP response codes."
    },
    practicalDeliverable: {
      title: "Capstone Design Document & Sprint Implementation Plan",
      description: "Write and commit `CAPSTONE_DESIGN.md` in your project repository. Include: 1) System Architecture overview, 2) SQL Schema with constraints, 3) Complete API Endpoint Matrix, 4) Sprint task checklist for Days 22-24.",
      acceptanceCriteria: [
        "Relational schema includes Users and Applications with foreign keys and indexes",
        "API matrix details all 9 endpoints with required status codes",
        "Sprint plan divides tasks across Day 22 (Core), Day 23 (Persistence & Tests), Day 24 (Docs & Polish)",
        "Design document committed cleanly to repository"
      ]
    },
    debuggingTask: {
      problemTitle: "Missing Foreign Key Cascade & Orphan Record Anomaly",
      language: "sql",
      buggyCode: `-- Flawed foreign key definition:
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id), -- Missing ON DELETE CASCADE!
    company_name VARCHAR(150)
);
-- If a user deletes their account:
DELETE FROM users WHERE id = 1; -- Fails with ForeignKeyViolationException!`,
      bugExplanation: "Without `ON DELETE CASCADE`, deleting a user account fails if associated applications exist, or if the constraint is removed, leaves orphaned records that point to non-existent users.",
      fixedCode: `CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL
);`
    },
    checklist: [
      "Reviewed and finalized all capstone functional and non-functional requirements",
      "Designed relational schema with primary keys, foreign keys, and indexes",
      "Documented complete REST API matrix with status codes",
      "Created 3-day sprint plan for Capstone execution",
      "Committed `CAPSTONE_DESIGN.md` to GitHub repository"
    ],
    quiz: [
      {
        id: "d21-q1",
        question: "Why should software engineers write an architectural design document before writing capstone code?",
        options: [
          "To satisfy bureaucratic company requirements",
          "Planning data models, API contracts, and edge cases up front uncovers architectural flaws early, saving days of painful refactoring and database migrations",
          "Because frameworks cannot compile without design documents",
          "It is required by the Git specification"
        ],
        correctAnswer: 1,
        explanation: "Flaws caught during design cost minutes to fix; flaws discovered after thousands of lines of code and database migrations are written take days or weeks to untangle."
      },
      {
        id: "d21-q2",
        question: "What does `ON DELETE CASCADE` on a foreign key enforce?",
        options: [
          "It cascades table backups to the cloud",
          "When a parent record (e.g. User) is deleted, all child records referencing that parent (e.g. Applications) are automatically deleted by the database engine",
          "It prevents records from being deleted",
          "It encrypts deleted records"
        ],
        correctAnswer: 1,
        explanation: "Cascading deletes maintain referential integrity automatically, eliminating orphaned child records when parent entities are removed."
      },
      {
        id: "d21-q3",
        question: "What is an analytics summary endpoint in a backend API?",
        options: [
          "An endpoint that shows advertisements",
          "An endpoint that aggregates database metrics (e.g. total applications, rejection rate, offers received) and returns aggregated statistics for dashboards",
          "An endpoint that monitors server CPU temperature",
          "A Google Analytics tracking script"
        ],
        correctAnswer: 1,
        explanation: "Summary endpoints aggregate operational business metrics (`COUNT`, `AVG`) across relational tables to power dashboard KPI cards."
      }
    ],
    interviewQuestions: [
      {
        question: "Walk me through how you designed the database schema for your Job Application Tracker. What trade-offs did you consider?",
        answer: "I designed a normalized relational schema with Users, Applications, and Companies. Each application links to a User via a foreign key with cascading deletes and indexes on user_id and status to optimize filtered list queries. I added a CHECK constraint on status to enforce valid states (APPLIED, INTERVIEW, OFFER, REJECTED). For trade-offs: I chose to store company names directly in applications for read simplicity, but also supported a foreign key reference for normalized company metadata.",
        tips: "Highlight the indexing decisions: explaining that you indexed `user_id` and `status` because they are the most common query filter columns demonstrates real database intuition."
      },
      {
        question: "How do you handle soft deletes vs hard deletes in relational database design?",
        answer: "A hard delete permanently removes the row from the database table (`DELETE FROM applications WHERE id = 1`). A soft delete marks the row as deleted using a timestamp or boolean flag (`is_deleted = TRUE` or `deleted_at = NOW()`), preserving the historical data for audit and recovery while filtering them out of standard queries (`WHERE deleted_at IS NULL`). In financial, medical, and compliance-sensitive backends, soft deletes are standard practice.",
        tips: "Mentioning the compliance and audit benefits of soft deletes proves you think about real business operations."
      }
    ],
    reflectionPrompt: "How does having a crystal-clear blueprint make the actual coding phase smooth, structured, and enjoyable rather than stressful and chaotic?",
    measurableCriteria: "Learner produces a complete Software Design Document including ER diagram, API matrix, validation constraints, and an actionable 3-day sprint plan.",
    videoTutorial: {
      title: "Backend Project Architecture & Database Design in Hindi",
      embedId: "HJqNw9nQdf-R",
      channel: "Anuj Bhaiya (Hindi)",
      duration: "25 mins",
      takeaway: "Real-world backend project kaise design karte hain: Database schema, ER diagram, REST API contracts aur folder structure."
    },
    resources: [
      {
        title: "PostgreSQL: Table Basics and Constraints",
        purpose: "Official PostgreSQL guide on constraints, primary keys, and foreign keys",
        url: "https://www.postgresql.org/docs/current/ddl-constraints.html",
        isOfficial: true
      },
      {
        title: "RESTful API Design Best Practices",
        purpose: "Industry standard guide to designing clean RESTful interfaces",
        url: "https://docs.spring.io/spring-boot/tutorial/first-application/",
        isOfficial: true
      }
    ]
  }
];
