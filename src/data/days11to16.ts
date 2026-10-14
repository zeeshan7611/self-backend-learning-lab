import { DayLesson } from '../types';

export const DAYS_11_TO_16: DayLesson[] = [
  {
    day: 11,
    title: "Relational Database Fundamentals, SQL Queries, Joins & Schema Design",
    subtitle: "PostgreSQL fundamentals: DDL, DML, Primary/Foreign keys, Indexes, Inner/Left Joins, and Normalization",
    week: 2,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Understand Relational Database Management Systems (RDBMS) and ACID transaction properties",
      "Design normalized schemas (3NF) with primary keys, unique constraints, and foreign key references",
      "Master essential SQL: SELECT, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT, and pagination offsets",
      "Execute INNER JOIN, LEFT JOIN, and aggregate queries to extract relational data across multiple tables"
    ],
    keyTerminology: [
      {
        term: "ACID Properties",
        definition: "Atomicity (all or nothing), Consistency (preserves schema rules), Isolation (concurrent transactions don't interfere), Durability (committed data survives server crashes).",
        analogy: "Transferring ₹500: Debiting Account A and Crediting Account B happen together as a single atomic unit, even if power cuts mid-way."
      },
      {
        term: "Primary Key vs Foreign Key",
        definition: "A Primary Key uniquely identifies a record in a table. A Foreign Key is a column referencing the Primary Key of another table, enforcing referential integrity.",
        analogy: "Your Aadhaar / National ID number is your Primary Key. The voter registration record referencing your Aadhaar number is a Foreign Key."
      },
      {
        term: "INNER JOIN vs LEFT JOIN",
        definition: "INNER JOIN returns only rows that have matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right table (or NULL).",
        analogy: "INNER JOIN is a group photo of people who both RSVP'd and showed up. LEFT JOIN lists everyone who RSVP'd, showing who actually attended or was absent (NULL)."
      }
    ],
    conceptExplanation: {
      what: "Relational databases store structured data in tables linked by mathematical relationships. SQL (Structured Query Language) is the declarative language used to query and modify it.",
      whyNeeded: "Application memory vanishes the moment a server restarts. Databases provide durable, indexed, and concurrent storage for millions of customer records.",
      howItWorks: "SQL engines parse the query, pass it through an optimizer to choose an execution plan (index scan vs sequential scan), and fetch matching pages from disk cache.",
      beginnerMistakes: [
        "Running queries with `SELECT *` in production instead of specifying only needed columns",
        "Forgetting Foreign Key constraints, resulting in 'orphan' records when a parent record is deleted",
        "Confusing `WHERE` (filters rows before aggregation) with `HAVING` (filters grouped results after aggregation)",
        "Missing indexes on frequently filtered foreign key or email columns, causing slow Full Table Scans"
      ],
      backendRelevance: "Every backend developer writes queries, defines ORM entities (JPA/Hibernate in Java, SQLAlchemy/SQLModel in Python), and analyzes slow database execution plans.",
      interviewerPerspective: "Interviewers frequently give you two tables (Employees and Departments) and ask for the top 3 highest earners per department using GROUP BY or Joins.",
      howToProveUnderstanding: "Design a 3-table schema (Users, Applications, Companies) with foreign keys and write SQL queries joining them with aggregates and filtering."
    },
    javaCodeSnippet: {
      title: "schema_design.sql (PostgreSQL)",
      code: `-- Schema for Job Application Tracker
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role_title VARCHAR(120) NOT NULL,
    status VARCHAR(30) DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED')),
    applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary_offered NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_apps_company_id ON applications(company_id);
CREATE INDEX idx_apps_status ON applications(status);`,
      explanation: "Includes Foreign Keys with `ON DELETE CASCADE`, `CHECK` constraints for status enums, and B-Tree indexes on filtered foreign keys."
    },
    pythonCodeSnippet: {
      title: "queries.sql (Aggregation & Joins)",
      code: `-- Aggregation Query: Count applications by company and status
SELECT 
    c.name AS company_name,
    a.status,
    COUNT(a.id) AS total_count
FROM companies c
INNER JOIN applications a ON c.id = a.company_id
WHERE a.applied_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.name, a.status
HAVING COUNT(a.id) > 0
ORDER BY total_count DESC;`,
      explanation: "Shows an INNER JOIN with date interval filtering, GROUP BY multi-column grouping, and HAVING clause."
    },
    practicalDeliverable: {
      title: "Interactive SQL Schema & Analytics Challenge",
      description: "Set up PostgreSQL (or SQLite/Postgres in Docker) and run SQLBolt lessons 1-12. Write and execute the schema for the Job Application Tracker with at least 10 seeded records and 3 analytical queries.",
      acceptanceCriteria: [
        "Tables created with proper PRIMARY KEY, FOREIGN KEY, and NOT NULL constraints",
        "Indexes created on search columns (`company_id`, `status`)",
        "Executed successful INNER JOIN and LEFT JOIN returning zero orphaned records",
        "Query filtering by status with aggregation passes successfully"
      ]
    },
    debuggingTask: {
      problemTitle: "WHERE vs HAVING & Missing Index Bug",
      language: "sql",
      buggyCode: `-- Bug: Using WHERE for aggregated count, and missing table alias
SELECT company_id, COUNT(*) 
FROM applications 
WHERE COUNT(*) > 2 -- Error! Aggregate functions not allowed in WHERE
GROUP BY company_id;`,
      bugExplanation: "The `WHERE` clause filters individual rows before grouping occurs. To filter aggregated results like `COUNT(*)`, you must use the `HAVING` clause after `GROUP BY`.",
      fixedCode: `SELECT company_id, COUNT(*) AS application_count
FROM applications
GROUP BY company_id
HAVING COUNT(*) > 2
ORDER BY application_count DESC;`
    },
    checklist: [
      "Completed SQLBolt interactive tutorial modules 1-12",
      "Understood ACID properties and transaction rollback mechanics",
      "Wrote clean DDL statements with Foreign Keys and CHECK constraints",
      "Executed queries combining INNER JOIN, LEFT JOIN, GROUP BY, and HAVING",
      "Created B-Tree indexes on foreign keys to prevent full table scans"
    ],
    quiz: [
      {
        id: "d11-q1",
        question: "What is the difference between `WHERE` and `HAVING` in SQL?",
        options: [
          "`WHERE` is for MySQL, `HAVING` is for PostgreSQL",
          "`WHERE` filters rows before any grouping occurs; `HAVING` filters grouped rows after aggregate functions are calculated",
          "`HAVING` cannot be used with `GROUP BY`",
          "`WHERE` is only for string columns"
        ],
        correctAnswer: 1,
        explanation: "`WHERE` filters input rows prior to aggregation. `HAVING` filters groups created by `GROUP BY` using conditions on aggregate values (e.g. `HAVING COUNT(*) > 5`)."
      },
      {
        id: "d11-q2",
        question: "What does the 'A' (Atomicity) in ACID guarantee?",
        options: [
          "Queries run at atomic clock speeds",
          "All operations within a transaction succeed completely, or if any fails, the entire transaction is rolled back with zero partial changes",
          "Tables can only have one primary key",
          "Data is stored in atomic JSON format"
        ],
        correctAnswer: 1,
        explanation: "Atomicity ensures all-or-nothing execution. If a transaction consists of 5 database updates and the 4th fails, all previous updates are rolled back."
      },
      {
        id: "d11-q3",
        question: "When should you use a `LEFT JOIN` instead of an `INNER JOIN`?",
        options: [
          "When you want to exclude all null values",
          "When you need all records from the primary (left) table even if there are no corresponding matches in the secondary (right) table",
          "Only when joining tables that share the same name",
          "When joining more than 10 tables"
        ],
        correctAnswer: 1,
        explanation: "A `LEFT JOIN` preserves every row from the left table, populating right-table columns with `NULL` where no match exists (e.g. finding companies that have 0 applications)."
      }
    ],
    interviewQuestions: [
      {
        question: "What is a Database Index, how does it work under the hood, and what is the trade-off of having too many indexes?",
        answer: "A database index (typically a B-Tree or B+Tree) is an auxiliary data structure that maintains sorted column values alongside pointers to the actual data pages on disk. It reduces lookup time from an O(N) Full Table Scan to O(log N). The trade-off: every INSERT, UPDATE, or DELETE requires the database to update both the main table and every associated index, which degrades write throughput and increases disk storage consumption.",
        tips: "Explain that foreign keys, unique constraint columns, and search filters should be indexed, but low-cardinality columns (like boolean gender/active) usually should not."
      },
      {
        question: "What is Database Normalization (1NF, 2NF, 3NF), and why do backend engineers sometimes intentionally denormalize?",
        answer: "Normalization organizes database tables to reduce data redundancy and eliminate update/delete anomalies. 1NF ensures atomic values (no repeating groups/arrays in a cell). 2NF eliminates partial dependencies on composite keys. 3NF ensures no transitive dependencies (non-key columns depend only on the primary key). In read-heavy distributed backends, engineers may denormalize (e.g., storing `company_name` directly in `applications`) to avoid expensive multi-table joins at scale.",
        tips: "Mentioning read-heavy caching and eliminating joins via intentional denormalization shows real architectural maturity."
      }
    ],
    reflectionPrompt: "Why is a well-designed database schema the hardest part of an application to change once millions of users have populated it with real data?",
    measurableCriteria: "Learner can design a 3NF relational schema, write multi-table joins with aggregations, and explain ACID guarantees and indexing trade-offs.",
    resources: [
      {
        title: "SQLBolt — Learn SQL Interactively",
        purpose: "Free interactive SQL practice from basic SELECT to complex JOINs",
        url: "https://sqlbolt.com/",
        isOfficial: false
      },
      {
        title: "PostgreSQL Official Documentation: SQL Syntax",
        purpose: "Official PostgreSQL reference guide for tables, queries, and constraints",
        url: "https://www.postgresql.org/docs/current/sql.html",
        isOfficial: true
      }
    ]
  },
  {
    day: 12,
    title: "HTTP Protocol, REST API Design, Status Codes & Testing APIs",
    subtitle: "Client-server architecture, HTTP methods (GET, POST, PUT, PATCH, DELETE), status code taxonomy, and Postman/cURL",
    week: 2,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 5.5,
    learningObjectives: [
      "Understand the HTTP request/response lifecycle: headers, query params, request body, and response body",
      "Distinguish HTTP methods and idempotency: GET, POST, PUT, PATCH, and DELETE",
      "Master the HTTP Status Code taxonomy: 2xx (Success), 3xx (Redirect), 4xx (Client Error), 5xx (Server Error)",
      "Design clean RESTful resource URIs and test endpoints using cURL and REST clients"
    ],
    keyTerminology: [
      {
        term: "Idempotency",
        definition: "An HTTP method is idempotent if executing it multiple times produces the exact same server state as executing it once (GET, PUT, DELETE are idempotent; POST is NOT).",
        analogy: "An elevator call button: pressing the button once or pressing it 10 times leaves the elevator in the exact same state (arriving at your floor)."
      },
      {
        term: "REST (Representational State Transfer)",
        definition: "An architectural style for network applications using stateless communication and standard HTTP verbs to manipulate resources identified by URIs.",
        analogy: "A standardized postal service: letters always have an address, return address, stamp, and priority label regardless of what language is written inside the letter."
      },
      {
        term: "PUT vs PATCH",
        definition: "PUT completely replaces an existing resource with the provided payload. PATCH applies a partial update modifying only the specified fields.",
        analogy: "PUT is replacing an entire broken bicycle with a new one; PATCH is replacing just the flat bicycle tire."
      }
    ],
    conceptExplanation: {
      what: "HTTP is the foundational application-layer protocol of the web. REST establishes standard conventions for clients and servers to exchange data using HTTP verbs.",
      whyNeeded: "Frontend mobile apps, React web dashboards, and third-party webhooks communicate with backend services over HTTP JSON APIs. Inconsistent API design creates chaos across teams.",
      howItWorks: "The client opens a TCP/TLS connection, sends an HTTP request line (`POST /api/v1/applications HTTP/1.1`), headers (`Content-Type: application/json`), and payload. The server processes and returns a status line and response body.",
      beginnerMistakes: [
        "Using verbs in REST URIs like `/api/getApplications` or `/api/deleteUser/1` instead of noun resources (`GET /api/applications`, `DELETE /api/users/1`)",
        "Returning HTTP `200 OK` when an error occurred, containing `{ 'error': 'Not found' }` in the body (breaks client-side error handling)",
        "Returning `500 Internal Server Error` for invalid user input instead of `400 Bad Request` or `422 Unprocessable Entity`",
        "Making non-idempotent endpoints that double-charge users if a network timeout causes a client retry"
      ],
      backendRelevance: "REST API design is the core daily responsibility of backend engineers. Clean endpoints, correct status codes, and predictable JSON responses make frontend integration effortless.",
      interviewerPerspective: "Interviewers ask: 'Which status code would you return when: 1) Auth token is missing, 2) Token is valid but user lacks admin privileges, 3) Request payload fails validation?' (401, 403, 400/422).",
      howToProveUnderstanding: "Draft an OpenAPI / REST specification for the Job Application Tracker with proper nouns, plural resources, status codes, and test endpoints with cURL."
    },
    javaCodeSnippet: {
      title: "rest_contract.json (REST API Contract)",
      code: `/* RESTful URI Conventions for Job Application Tracker:
   
   GET    /api/v1/applications          -> 200 OK (List with pagination)
   POST   /api/v1/applications          -> 201 Created (Location header set)
   GET    /api/v1/applications/{id}     -> 200 OK or 404 Not Found
   PUT    /api/v1/applications/{id}     -> 200 OK (Full replace)
   PATCH  /api/v1/applications/{id}     -> 200 OK (Partial update, e.g. status)
   DELETE /api/v1/applications/{id}     -> 204 No Content or 404 Not Found
*/

// Example POST Payload:
{
  "companyName": "Google",
  "roleTitle": "Software Development Engineer - Backend",
  "status": "APPLIED",
  "appliedDate": "2026-10-15"
}`,
      explanation: "Standard RESTful plural resource design with proper HTTP method mapping and status code contracts."
    },
    pythonCodeSnippet: {
      title: "curl_testing_commands.sh",
      code: `# 1. Fetch paginated applications
curl -X GET "http://localhost:8080/api/v1/applications?page=0&size=10" \\
     -H "Accept: application/json" -v

# 2. Create a new application (POST)
curl -X POST "http://localhost:8080/api/v1/applications" \\
     -H "Content-Type: application/json" \\
     -d '{"companyName":"Razorpay","roleTitle":"Backend Engineer","status":"APPLIED"}' \\
     -v

# 3. Verify 404 on non-existent resource
curl -X GET "http://localhost:8080/api/v1/applications/99999" -v`,
      explanation: "cURL CLI commands testing headers, query parameters, POST JSON body, and verifying HTTP status codes."
    },
    practicalDeliverable: {
      title: "REST API Contract Specification & cURL Test Suite",
      description: "Write an API design document for the Job Application Tracker. Include all endpoints, query parameters, request bodies, error schemas, and write an executable bash/PowerShell script with 6 cURL commands verifying expected status codes.",
      acceptanceCriteria: [
        "Uses plural nouns for resources with no verbs in paths",
        "Maps CRUD operations correctly to GET, POST, PUT, PATCH, and DELETE",
        "Specifies exact HTTP status codes (200, 201, 204, 400, 401, 403, 404, 500)",
        "Includes standard error response schema with timestamp, status, error, and path"
      ]
    },
    debuggingTask: {
      problemTitle: "REST Anti-Patterns & Misleading Status Codes",
      language: "http",
      buggyCode: `// Bad API Design:
POST /api/getUserDetails?id=123 HTTP/1.1
Response:
HTTP/1.1 200 OK
{
  "status": 500,
  "message": "User not found in database"
}`,
      bugExplanation: "1) Used verb in URL (`/getUserDetails`) instead of `GET /api/users/123`. 2) Returned `200 OK` despite resource not found, burying the error in JSON body. Clients checking status codes will believe the request succeeded.",
      fixedCode: `GET /api/v1/users/123 HTTP/1.1
Response:
HTTP/1.1 404 Not Found
Content-Type: application/json
{
  "timestamp": "2026-10-15T00:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "User with ID 123 does not exist",
  "path": "/api/v1/users/123"
}`
    },
    checklist: [
      "Categorized HTTP status codes (200, 201, 204, 400, 401, 403, 404, 409, 500)",
      "Understood Idempotency and why POST is non-idempotent while PUT/DELETE are idempotent",
      "Eliminated verbs from REST endpoint URI paths",
      "Executed raw HTTP requests via cURL inspecting response headers and status lines",
      "Completed REST API Contract specification"
    ],
    quiz: [
      {
        id: "d12-q1",
        question: "What is the difference between 401 Unauthorized and 403 Forbidden?",
        options: [
          "They are identical status codes used interchangeably",
          "401 means the client is unauthenticated (identity is unknown/missing token); 403 means the identity is known, but lacks permission to access the resource",
          "401 is for mobile apps, 403 is for web browsers",
          "403 indicates a database failure"
        ],
        correctAnswer: 1,
        explanation: "401 means 'You need to log in or supply a valid token'. 403 means 'We know who you are, but you do not have permission to view this resource'."
      },
      {
        id: "d12-q2",
        question: "Which of the following REST URIs violates standard REST architectural conventions?",
        options: [
          "`GET /api/v1/applications`",
          "`POST /api/v1/applications/create`",
          "`DELETE /api/v1/applications/42`",
          "`GET /api/v1/companies/5/applications`"
        ],
        correctAnswer: 1,
        explanation: "REST endpoints should use nouns. Adding verbs like `/create`, `/delete`, or `/update` in the URI is an anti-pattern because the HTTP method (`POST`) already expresses the action."
      },
      {
        id: "d12-q3",
        question: "What HTTP status code should be returned after successfully creating a new resource via POST?",
        options: [
          "200 OK",
          "201 Created",
          "204 No Content",
          "202 Accepted"
        ],
        correctAnswer: 1,
        explanation: "`201 Created` indicates that the request was successful and resulted in the creation of a new resource (often accompanied by a `Location` header)."
      }
    ],
    interviewQuestions: [
      {
        question: "What does it mean for an HTTP method to be Idempotent? Which methods are idempotent and why does this matter for network reliability?",
        answer: "An HTTP method is idempotent if making multiple identical requests has the same intended effect on the server as making a single request. GET, HEAD, PUT, DELETE, and OPTIONS are idempotent; POST and PATCH are not. This is critical for network reliability: if a client sends a PUT or DELETE request and the network drops before receiving the response, the client can safely retry without creating duplicate state or double-charging.",
        tips: "Emphasize payment processing: how payment gateways use Idempotency Keys on POST endpoints to prevent double-charging users during network retries."
      },
      {
        question: "What is the difference between PUT and PATCH in REST API design?",
        answer: "PUT replaces the target resource entirely with the request payload; any omitted fields are overwritten with null or default values. PATCH applies a partial update, modifying only the fields explicitly provided in the request body while leaving all other fields untouched.",
        tips: "Interviewers love hearing when to choose PATCH: for example, updating just the status of an application without having to re-send the company name, role, salary, and notes."
      }
    ],
    reflectionPrompt: "Why does returning a generic 200 OK with an error message in the JSON body cause headaches for mobile developers and break automated API monitoring tools?",
    measurableCriteria: "Learner can design RESTful endpoints adhering to REST conventions, map correct HTTP status codes, and test endpoints via command line cURL.",
    resources: [
      {
        title: "Mozilla MDN: HTTP Request Methods & Status Codes",
        purpose: "Comprehensive web standard guide to HTTP protocol and status codes",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
        isOfficial: true
      },
      {
        title: "FastAPI Tutorial: First Steps & Path Parameters",
        purpose: "Official FastAPI guide to HTTP methods and status code decorators",
        url: "https://fastapi.tiangolo.com/tutorial/path-params/",
        isOfficial: true
      }
    ]
  },
  {
    day: 13,
    title: "Framework Setup & Your First Working Backend API Endpoint",
    subtitle: "Initializing Spring Boot (Maven/Gradle) or FastAPI (Uvicorn/Pydantic) and running your first live server",
    week: 3,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Bootstrap your primary framework: Spring Initializr (Java) or Virtualenv/Uvicorn/FastAPI (Python)",
      "Understand the application lifecycle, entry points, and embedded HTTP servers (Tomcat vs Uvicorn)",
      "Implement your first GET endpoint returning structured JSON with custom headers",
      "Inspect auto-generated interactive documentation (Swagger UI / OpenAPI)"
    ],
    keyTerminology: [
      {
        term: "Embedded Server",
        definition: "A web server (Tomcat, Jetty in Spring Boot; Uvicorn in FastAPI) packaged directly inside your application artifact, eliminating the need to install external web servers.",
        analogy: "A self-contained food truck with its own generator and kitchen, rather than renting a commercial kitchen in a fixed building."
      },
      {
        term: "Inversion of Control (IoC)",
        definition: "A design principle where the framework controls program execution flow and instantiates objects, rather than your custom code calling libraries.",
        analogy: "Hollywood Principle: 'Don't call us, we'll call you.' The framework calls your controllers when incoming network requests arrive."
      },
      {
        term: "OpenAPI / Swagger UI",
        definition: "A standard specification and interactive web UI automatically generated from backend code to document and test REST endpoints.",
        analogy: "An interactive digital restaurant menu where you can click items to see ingredients and immediately place sample orders."
      }
    ],
    conceptExplanation: {
      what: "Backend frameworks abstract socket handling, thread pooling, and HTTP parsing so developers can focus purely on business logic.",
      whyNeeded: "Without frameworks, handling raw TCP connections, parsing multipart bodies, and managing concurrency requires thousands of lines of low-level networking code.",
      howItWorks: "The framework starts an embedded server listening on a port (e.g. 8080). Incoming requests are dispatched to matching route handlers using reflection and routing tables.",
      beginnerMistakes: [
        "Running FastAPI without an ASGI server (Uvicorn) or Spring Boot without running through Maven/Gradle",
        "Hardcoding ports or URLs instead of using application properties or environment variables",
        "Failing to understand how JSON serialization works under the hood (Jackson in Java, Pydantic in Python)",
        "Ignoring console logs and stack traces when the server fails to bind to port 8080 (port already in use)"
      ],
      backendRelevance: "Starting the dev server, understanding routing decorators/annotations, and inspecting logs is the daily baseline of every backend software job.",
      interviewerPerspective: "Interviewers ask freshers: 'What happens from the moment you hit Enter in the browser until your controller method executes?'",
      howToProveUnderstanding: "Create a health check endpoint and a mock application retrieval endpoint, run the server locally, and verify JSON response in browser and terminal."
    },
    javaCodeSnippet: {
      title: "HealthController.java (Spring Boot)",
      code: `package com.launchlab.api;

import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        return Map.of(
            "status", "UP",
            "service", "Job Application Tracker API",
            "timestamp", Instant.now().toString(),
            "environment", "local-development"
        );
    }
}`,
      explanation: "`@RestController` combines `@Controller` and `@ResponseBody`, instructing Spring to serialize returned Maps or POJOs into JSON via Jackson."
    },
    pythonCodeSnippet: {
      title: "main.py (FastAPI)",
      code: `from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="Job Application Tracker API",
    version="1.0.0",
    docs_url="/docs"
)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "UP",
        "service": "Job Application Tracker API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": "local-development"
    }

# Run: uvicorn main:app --reload --port 8080`,
      explanation: "FastAPI app instance with Uvicorn auto-reload and built-in interactive Swagger UI available at `http://localhost:8080/docs`."
    },
    practicalDeliverable: {
      title: "Running Backend Server with Live Health & System Metrics Endpoints",
      description: "Initialize your project repository for your chosen primary stack. Start the local server on port 8080. Create `/api/v1/health` and `/api/v1/system-info` endpoints returning system uptime and memory status.",
      acceptanceCriteria: [
        "Framework initialized (Maven `pom.xml` for Java or `pyproject.toml`/`requirements.txt` for Python)",
        "Embedded server runs locally and binds to port 8080",
        "Endpoint `/api/v1/health` returns HTTP 200 with JSON payload",
        "Swagger / OpenAPI documentation accessible in browser at `/swagger-ui/index.html` or `/docs`"
      ]
    },
    debuggingTask: {
      problemTitle: "Port Binding Collision (EADDRINUSE / Port 8080 already in use)",
      language: "http",
      buggyCode: `// Terminal output on server startup:
APPLICATION FAILED TO START
Description:
Web server failed to start. Port 8080 was already in use.
Action:
Identify and stop the process that's listening on port 8080 or configure this application to listen on another port.`,
      bugExplanation: "Another background process (like an orphaned Java or Python process) is already occupying port 8080. You must either kill the offending PID or change the server port in configuration.",
      fixedCode: `# Find and kill process on port 8080 (Windows):
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties / uvicorn command:
server.port=8081
# Or: uvicorn main:app --port 8081`
    },
    checklist: [
      "Initialized backend project repository with clean build configuration",
      "Started embedded server (Tomcat or Uvicorn) without compilation errors",
      "Created first GET `/health` endpoint returning valid JSON",
      "Resolved port collision issues using terminal network utilities",
      "Tested endpoint using browser, cURL, and Swagger UI"
    ],
    quiz: [
      {
        id: "d13-q1",
        question: "What is an 'Embedded Web Server' in modern frameworks like Spring Boot and FastAPI?",
        options: [
          "A server physically embedded in hardware microchips",
          "A web server packaged directly as a library inside the application executable, allowing it to run standalone with a single command",
          "A server that only runs inside Docker containers",
          "A server that does not require an operating system"
        ],
        correctAnswer: 1,
        explanation: "Embedded servers (Tomcat in Spring Boot, Uvicorn in FastAPI) eliminate the legacy requirement of deploying WAR files into external servlet containers."
      },
      {
        id: "d13-q2",
        question: "Where can you immediately test FastAPI endpoints interactively in your browser without external tools?",
        options: [
          "At `/docs` (Swagger UI) or `/redoc`",
          "At `/admin`",
          "Inside the Python terminal only",
          "FastAPI does not support browser testing"
        ],
        correctAnswer: 0,
        explanation: "FastAPI automatically serves interactive Swagger UI documentation at `/docs` generated directly from Python type hints and Pydantic models."
      },
      {
        id: "d13-q3",
        question: "What does the `@RestController` annotation in Spring Boot signify?",
        options: [
          "It marks the class as a database repository",
          "It marks the class as a controller where every method returns domain objects that are automatically serialized into HTTP response JSON",
          "It restricts the class to HTTP GET requests only",
          "It requires the user to log in"
        ],
        correctAnswer: 1,
        explanation: "`@RestController` is a convenience annotation combining `@Controller` and `@ResponseBody`, ensuring methods serialize returned objects straight to HTTP response JSON."
      }
    ],
    interviewQuestions: [
      {
        question: "Explain what Inversion of Control (IoC) and Dependency Injection (DI) mean in backend development.",
        answer: "Inversion of Control (IoC) shifts the control of object creation and lifecycle management from the application code to a container or framework. Instead of a class manually instantiating its dependencies (`new OrderRepository()`), the dependencies are supplied ('injected') from the outside by the framework (via constructors or decorators). This achieves loose coupling, adheres to the Dependency Inversion Principle, and makes mocking dependencies in unit tests effortless.",
        tips: "Always mention unit testing: DI makes unit testing 10x easier because you can inject mock repositories without touching the service class."
      },
      {
        question: "What happens from the moment an HTTP request reaches your server port until your route handler method executes?",
        answer: "1. The OS accepts the TCP handshake and delivers raw bytes to the listening socket. 2. The embedded web server (Tomcat/Uvicorn) reads the byte stream and parses the HTTP request line, headers, and body into an internal request object. 3. The request passes through any configured filters/middleware (CORS, logging, auth). 4. The DispatcherServlet / Router inspects URL routing tables to find the matching controller handler. 5. Reflection or signature inspection deserializes JSON into parameter objects. 6. The handler executes and its return value is serialized into JSON and returned through the socket.",
        tips: "This complete walkthrough demonstrates that you understand the full backend architecture beyond just writing a method."
      }
    ],
    reflectionPrompt: "Why is having automatic interactive API documentation (Swagger/OpenAPI) a game-changer for collaborating with frontend React/Mobile engineers?",
    measurableCriteria: "Learner can bootstrap a project from scratch, launch the local server, handle network port conflicts, and implement working JSON endpoints with OpenAPI documentation.",
    resources: [
      {
        title: "Spring Boot: Building a RESTful Web Service",
        purpose: "Official Spring guide for building your first REST controller",
        url: "https://spring.io/guides/gs/rest-service/",
        isOfficial: true
      },
      {
        title: "FastAPI Tutorial — First Steps",
        purpose: "Official tutorial on creating your first FastAPI application",
        url: "https://fastapi.tiangolo.com/tutorial/first-steps/",
        isOfficial: true
      }
    ]
  },
  {
    day: 14,
    title: "CRUD Operations, Request Handling & Response Serialization",
    subtitle: "In-memory persistence, DTOs, Path Variables, Query Params, and standardized HTTP responses",
    week: 3,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Implement the complete set of CRUD operations: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE)",
      "Extract inputs from Path Variables (`/apps/{id}`), Query Parameters (`?status=APPLIED`), and JSON Request Bodies",
      "Utilize Data Transfer Objects (DTOs) / Pydantic Models to decouple internal data representations from API contracts",
      "Return standardized HTTP responses with proper status codes (200, 201, 204, 404)"
    ],
    keyTerminology: [
      {
        term: "DTO (Data Transfer Object)",
        definition: "An object designed specifically for carrying data between processes (e.g. from an HTTP request to the service layer) without business logic.",
        analogy: "A shipping envelope: it has standard address labels on the outside and only holds the contents needed for transit."
      },
      {
        term: "Path Variable vs Query Parameter",
        definition: "Path variables identify a specific resource (`/applications/42`). Query parameters filter, sort, or paginate a collection of resources (`/applications?status=OFFER&sort=date`).",
        analogy: "Path variable is the street address of a specific house; query parameter is asking to filter houses painted blue."
      },
      {
        term: "Request Body Deserialization",
        definition: "The automatic parsing of raw incoming JSON text into typed language objects (POJOs in Java, Pydantic instances in Python).",
        analogy: "An automated postal scanner reading typed form text and filing it into digital applicant folders."
      }
    ],
    conceptExplanation: {
      what: "CRUD represents the fundamental operations of persistent storage: Create, Read, Update, Delete.",
      whyNeeded: "Almost every enterprise backend feature—from managing user profiles to creating e-commerce orders—is fundamentally a specialized variation of CRUD.",
      howItWorks: "The framework router inspects the incoming HTTP method and URI pattern, extracts variables, deserializes the JSON body into a DTO, invokes your handler, and serializes the result.",
      beginnerMistakes: [
        "Using database entities directly as API request/response bodies instead of dedicated DTOs (leaks passwords and internal schema)",
        "Returning `null` or an empty body with HTTP `200 OK` when a resource is not found (must return `404 Not Found`)",
        "Modifying shared in-memory collections without considering thread safety in concurrent web requests",
        "Using GET requests to delete or modify data (violates HTTP verb semantics and browser pre-fetching safety)"
      ],
      backendRelevance: "Writing clean, predictable CRUD operations with proper DTO separation is the primary task junior developers work on during their first six months.",
      interviewerPerspective: "Interviewers observe if you return `201 Created` on POST, `204 No Content` on DELETE, and whether you handle non-existent IDs with clean 404 responses.",
      howToProveUnderstanding: "Implement full in-memory CRUD for Job Applications with filtering by status and return appropriate HTTP status codes."
    },
    javaCodeSnippet: {
      title: "ApplicationController.java (Spring Boot CRUD)",
      code: `package com.launchlab.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    // Thread-safe in-memory store before DB integration
    private final Map<Long, ApplicationDto> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public record ApplicationDto(Long id, String companyName, String roleTitle, String status) {}
    public record CreateAppRequest(String companyName, String roleTitle, String status) {}

    @PostMapping
    public ResponseEntity<ApplicationDto> create(@RequestBody CreateAppRequest req) {
        long id = idGenerator.getAndIncrement();
        ApplicationDto app = new ApplicationDto(id, req.companyName(), req.roleTitle(), req.status());
        store.put(id, app);
        return ResponseEntity.status(HttpStatus.CREATED).body(app);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getById(@PathVariable Long id) {
        ApplicationDto app = store.get(id);
        if (app == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(app);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!store.containsKey(id)) return ResponseEntity.notFound().build();
        store.remove(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}`,
      explanation: "Uses Java records for clean immutable DTOs, `ConcurrentHashMap` for thread-safety, and `ResponseEntity` for explicit status code management."
    },
    pythonCodeSnippet: {
      title: "crud_router.py (FastAPI CRUD)",
      code: `from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/applications", tags=["Applications"])

class ApplicationCreate(BaseModel):
    company_name: str
    role_title: str
    status: str = "APPLIED"

class ApplicationResponse(ApplicationCreate):
    id: int

# In-memory store
db: dict[int, ApplicationResponse] = {}
counter = 1

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate):
    global counter
    new_app = ApplicationResponse(id=counter, **payload.model_dump())
    db[counter] = new_app
    counter += 1
    return new_app

@router.get("/{app_id}", response_model=ApplicationResponse)
def get_application(app_id: int):
    if app_id not in db:
        raise HTTPException(status_code=404, detail="Application not found")
    return db[app_id]

@router.delete("/{app_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(app_id: int):
    if app_id not in db:
        raise HTTPException(status_code=404, detail="Application not found")
    del db[app_id]`,
      explanation: "FastAPI CRUD router using Pydantic models for request/response serialization and `HTTPException` for RFC-compliant error responses."
    },
    practicalDeliverable: {
      title: "Complete In-Memory CRUD API Suite for Job Applications",
      description: "Implement all 5 CRUD operations in your chosen framework: List all, Get by ID, Create, Update (PUT/PATCH), and Delete. Add query parameter filtering (e.g. `?status=INTERVIEW`). Test all 5 endpoints via cURL or Swagger UI.",
      acceptanceCriteria: [
        "POST `/applications` returns 201 with generated ID",
        "GET `/applications/{id}` returns 200 with JSON or 404 if absent",
        "DELETE `/applications/{id}` returns 204 on success or 404 if absent",
        "Query parameter filtering returns matching subset of applications"
      ]
    },
    debuggingTask: {
      problemTitle: "Concurrent Modification / Race Condition Bug in Memory Store",
      language: "java",
      buggyCode: `// Bug: Using HashMap and standard integer counter in multi-threaded web server
private Map<Integer, Application> store = new HashMap<>();
private int idCounter = 0;

@PostMapping
public Application create(@RequestBody Application app) {
    idCounter++; // Race condition! Concurrent requests can overwrite or duplicate IDs
    store.put(idCounter, app); // HashMap is not thread-safe! Can throw ConcurrentModificationException
    return app;
}`,
      bugExplanation: "Web servers process requests concurrently across thread pools. Standard `HashMap` and `int++` are not thread-safe, leading to race conditions and corrupt memory structures.",
      fixedCode: `// Thread-safe concurrent storage:
private final Map<Long, Application> store = new ConcurrentHashMap<>();
private final AtomicLong idCounter = new AtomicLong(1);

@PostMapping
public ResponseEntity<Application> create(@RequestBody Application app) {
    long id = idCounter.getAndIncrement();
    app.setId(id);
    store.put(id, app);
    return ResponseEntity.status(HttpStatus.CREATED).body(app);
}`
    },
    checklist: [
      "Implemented POST with 201 Created status and generated ID",
      "Implemented GET by ID and List with 200 OK and query parameter filtering",
      "Implemented DELETE with 204 No Content status and 404 validation",
      "Decoupled request payloads using DTOs / Pydantic models",
      "Tested concurrency and thread safety considerations"
    ],
    quiz: [
      {
        id: "d14-q1",
        question: "Why should you use DTOs (Data Transfer Objects) instead of exposing database entity classes directly in REST API endpoints?",
        options: [
          "DTOs make the server reboot faster",
          "Entities contain internal schema details, password hashes, and relationship proxies that should never leak to clients or be directly manipulated via user input",
          "Frameworks reject entities in controllers",
          "DTOs eliminate the need for databases"
        ],
        correctAnswer: 1,
        explanation: "Exposing entities directly leads to mass-assignment security vulnerabilities (users altering fields like `isAdmin`) and leaks internal database schema details."
      },
      {
        id: "d14-q2",
        question: "What HTTP status code should a DELETE endpoint return when a record is successfully deleted?",
        options: [
          "200 OK or 204 No Content",
          "201 Created",
          "301 Moved Permanently",
          "400 Bad Request"
        ],
        correctAnswer: 0,
        explanation: "`204 No Content` is the standard status code indicating the deletion was successful and no response body is returned (or `200 OK` if returning a status message)."
      },
      {
        id: "d14-q3",
        question: "How do you capture `/api/applications/45` in a Spring Boot or FastAPI controller?",
        options: [
          "Using `@PathVariable` (Spring) or path parameter `app_id: int` in function signature (FastAPI)",
          "Using `@RequestParam`",
          "By reading cookies",
          "By inspecting the query string"
        ],
        correctAnswer: 0,
        explanation: "Path parameters match dynamic segments in the URL pattern using `@PathVariable` in Spring Boot and typed function arguments in FastAPI."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the difference between Path Variables and Query Parameters? When should an engineer choose one over the other?",
        answer: "Path variables (`/users/123/orders/456`) are used to identify a specific, unique resource or hierarchical relationship in the URI path. Query parameters (`/orders?status=PENDING&page=2&limit=20`) are used to filter, sort, paginate, or pass optional modifiers to a collection. Rule of thumb: If the parameter identifies 'which resource', use a path variable; if it controls 'how many' or 'which subset', use query parameters.",
        tips: "Give clear REST examples to demonstrate design discipline."
      },
      {
        question: "What is 'Mass Assignment Vulnerability' and how do DTOs prevent it?",
        answer: "Mass Assignment occurs when a backend framework automatically binds all incoming JSON properties directly to a database entity. If an entity has fields like `is_admin`, `verified`, or `account_balance`, an attacker can send `{ 'is_admin': true }` in a registration payload. Using dedicated DTOs (or Pydantic schemas) ensures that only explicitly permitted fields (like `username` and `email`) are bound, completely mitigating the vulnerability.",
        tips: "Mentioning GitHub's famous 2012 mass assignment breach will demonstrate impressive security awareness."
      }
    ],
    reflectionPrompt: "Why does separating your API into clean DTOs protect your database from breaking when frontend developers request field renaming or formatting changes?",
    measurableCriteria: "Learner can implement all 5 CRUD operations, map correct status codes, extract path/query variables, and enforce DTO separation.",
    resources: [
      {
        title: "Dev.java: Records & Data Transfer Objects",
        purpose: "Using modern Java records for immutable DTOs",
        url: "https://dev.java/learn/records/",
        isOfficial: true
      },
      {
        title: "FastAPI Documentation: Request Body & Pydantic Models",
        purpose: "Official guide to Pydantic schemas and serialization",
        url: "https://fastapi.tiangolo.com/tutorial/body/",
        isOfficial: true
      }
    ]
  },
  {
    day: 15,
    title: "Layered Architecture: Controller, Service & Repository Separation",
    subtitle: "Separation of concerns: Controller (HTTP), Service (Business Logic), and Repository (Data Access)",
    week: 3,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Master Layered Architecture (N-Tier Architecture): Controller / Router -> Service -> Repository",
      "Enforce Single Responsibility: keep controllers thin, business logic in services, and data queries in repositories",
      "Apply Dependency Injection to wire layers together cleanly without tight coupling",
      "Understand why fat controllers are an architectural anti-pattern that destroys testability"
    ],
    keyTerminology: [
      {
        term: "Layered Architecture",
        definition: "An architectural pattern that organizes code into discrete horizontal layers, where each layer has a distinct responsibility and communicates only with adjacent layers.",
        analogy: "A restaurant: The Waiter (Controller) greets the customer and takes orders; the Chef (Service) prepares the meal using recipes; the Pantry Manager (Repository) retrieves ingredients from storage."
      },
      {
        term: "Fat Controller (Anti-Pattern)",
        definition: "A bad practice where controllers contain raw database queries, business calculations, and validation rules, making them bloated and impossible to unit test.",
        analogy: "A waiter who takes your order, runs into the kitchen to chop onions, cooks the soup, and drives to the grocery store to buy spices."
      },
      {
        term: "Thin Controller",
        definition: "A controller that only handles HTTP-specific concerns: parsing requests, validating input types, delegating to the service layer, and returning status codes.",
        analogy: "A professional concierge who routes your request to the right department without trying to do everything themselves."
      }
    ],
    conceptExplanation: {
      what: "Layered Architecture divides an application into Controller, Service, and Repository layers.",
      whyNeeded: "If business rules and database SQL are jammed inside controllers, you cannot test business logic without spinning up an entire web server and database. Layering enables independent unit testing.",
      howItWorks: "Controller receives HTTP request -> passes DTO to Service -> Service executes validation and business calculations -> Service calls Repository -> Repository queries DB -> Result flows back up.",
      beginnerMistakes: [
        "Calling repository or database queries directly from inside controller methods",
        "Putting HTTP status codes or HttpServletRequest objects inside the Service layer (couples business logic to web transport)",
        "Instantiating services using `new OrderServiceImpl()` instead of letting the dependency injection container supply it",
        "Passing database entities back to the controller instead of mapping to response DTOs"
      ],
      backendRelevance: "Every commercial Spring Boot and FastAPI enterprise codebase uses this 3-tier separation. It is the universal standard of professional backend engineering.",
      interviewerPerspective: "Interviewers frequently ask: 'Where would you put duplicate email verification logic: in the Controller, the Service, or the Repository?' (The Service layer!).",
      howToProveUnderstanding: "Refactor your CRUD application into 3 clean packages/modules: `controllers`, `services`, and `repositories`, ensuring zero database references in controllers."
    },
    javaCodeSnippet: {
      title: "ThreeTierArchitecture.java (Spring Boot)",
      code: `// 1. REPOSITORY LAYER (Data Access Interface)
public interface ApplicationRepository {
    Application save(Application app);
    Optional<Application> findById(Long id);
    List<Application> findAll();
    void deleteById(Long id);
}

// 2. SERVICE LAYER (Business Rules & Orchestration)
@Service
public class ApplicationService {
    private final ApplicationRepository repository;

    public ApplicationService(ApplicationRepository repository) {
        this.repository = repository; // Injected via constructor
    }

    public Application createApplication(CreateAppRequest req) {
        // Business Rule: Validate company name not blank
        if (req.companyName() == null || req.companyName().trim().isEmpty()) {
            throw new IllegalArgumentException("Company name is mandatory");
        }
        Application app = new Application(null, req.companyName(), req.roleTitle(), "APPLIED");
        return repository.save(app);
    }
}

// 3. CONTROLLER LAYER (Thin HTTP Adapter)
@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {
    private final ApplicationService service;

    public ApplicationController(ApplicationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Application> create(@RequestBody CreateAppRequest req) {
        Application created = service.createApplication(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}`,
      explanation: "Controller only handles HTTP transport; Service enforces business validation; Repository handles data persistence."
    },
    pythonCodeSnippet: {
      title: "three_tier_architecture.py (FastAPI)",
      code: `from fastapi import APIRouter, Depends, HTTPException, status
from typing import Protocol, Optional

# 1. REPOSITORY PROTOCOL
class ApplicationRepository(Protocol):
    def save(self, app_data: dict) -> dict: ...
    def find_by_id(self, app_id: int) -> Optional[dict]: ...

class InMemoryApplicationRepository:
    def __init__(self):
        self._store = {}
        self._id = 1
    def save(self, app_data: dict) -> dict:
        app_id = self._id
        record = {"id": app_id, **app_data}
        self._store[app_id] = record
        self._id += 1
        return record

# 2. SERVICE LAYER
class ApplicationService:
    def __init__(self, repo: ApplicationRepository):
        self.repo = repo

    def create_application(self, company: str, role: str) -> dict:
        if not company or not company.strip():
            raise ValueError("Company name is mandatory")
        return self.repo.save({"company": company, "role": role, "status": "APPLIED"})

# Dependency Injection Provider
def get_service() -> ApplicationService:
    repo = InMemoryApplicationRepository()
    return ApplicationService(repo)

# 3. ROUTER / CONTROLLER
router = APIRouter(prefix="/api/v1/applications")

@router.post("", status_code=status.HTTP_201_CREATED)
def create_app(payload: dict, service: ApplicationService = Depends(get_service)):
    try:
        return service.create_application(payload.get("company"), payload.get("role"))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))`,
      explanation: "FastAPI router using `Depends()` to inject the Service, keeping business rules isolated from HTTP routes."
    },
    practicalDeliverable: {
      title: "Full 3-Tier Layered Refactor with Dependency Injection",
      description: "Refactor your Job Application Tracker into distinct Controller, Service, and Repository layers. Implement at least two business rules in the Service layer (e.g. follow-up date cannot be in the past, duplicate role applications to same company rejected).",
      acceptanceCriteria: [
        "Controller contains zero database queries or data store access logic",
        "Business rules enforced exclusively in Service layer methods",
        "Repository implements clean CRUD data operations",
        "Wiring executed via framework Dependency Injection (Spring `@Service`/`@Repository` or FastAPI `Depends`)"
      ]
    },
    debuggingTask: {
      problemTitle: "Layer Bleed & Transport Coupling Bug",
      language: "java",
      buggyCode: `// Bug: Controller logic leaking into Service
@Service
public class UserService {
    // Problem 1: Service takes HttpServletRequest (coupled to web tier!)
    public void register(HttpServletRequest request) {
        String email = request.getParameter("email");
        // Problem 2: Writing raw SQL queries inside Service instead of Repository!
        jdbcTemplate.update("INSERT INTO users VALUES (...)");
    }
}`,
      bugExplanation: "Importing `HttpServletRequest` into the service ties business rules to HTTP. If tomorrow you want to trigger registration via a background worker or CLI, you can't reuse this service.",
      fixedCode: `@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(RegisterRequestDto dto) {
        // Pure domain logic, transport-independent
        return userRepository.save(new User(dto.email()));
    }
}`
    },
    checklist: [
      "Decomposed project into `controllers`, `services`, and `repositories` modules",
      "Kept controllers thin: only HTTP mapping, status codes, and input dispatch",
      "Placed domain invariants and validations in Service layer",
      "Isolated data persistence in Repository layer",
      "Wired dependencies using constructor injection"
    ],
    quiz: [
      {
        id: "d15-q1",
        question: "Where should business logic (e.g., 'An applicant cannot apply twice to the same job within 30 days') reside in a layered architecture?",
        options: [
          "In the Controller / Router layer",
          "In the Service layer",
          "In the database trigger only",
          "In the frontend JavaScript"
        ],
        correctAnswer: 1,
        explanation: "The Service layer is the dedicated home for all business logic, validation rules, calculations, and transactional orchestration."
      },
      {
        id: "d15-q2",
        question: "Why should the Service layer never import `HttpServletRequest` or return `ResponseEntity`?",
        options: [
          "The compiler forbids it",
          "It couples business logic to the HTTP transport layer, making it impossible to reuse the service for CLI scripts, queue listeners, or unit tests",
          "It crashes the garbage collector",
          "Because services only accept strings"
        ],
        correctAnswer: 1,
        explanation: "Keeping services transport-agnostic allows business rules to be reused anywhere (web, CLI, message queues) and tested in plain unit tests without mocking HTTP servers."
      },
      {
        id: "d15-q3",
        question: "What is the primary benefit of Constructor Injection over Field Injection (`@Autowired` on private fields)?",
        options: [
          "Constructor injection makes classes easier to unit test without reflection, enforces required dependencies at creation, and promotes immutability (`final` fields)",
          "Field injection is faster in CPU execution",
          "Constructor injection is only allowed in Python",
          "Field injection prevents circular dependencies"
        ],
        correctAnswer: 0,
        explanation: "Constructor injection ensures objects cannot be instantiated in an invalid uninitialized state and allows unit tests to inject mock dependencies directly without Spring reflection."
      }
    ],
    interviewQuestions: [
      {
        question: "Walk me through the responsibilities of Controller, Service, and Repository layers in enterprise backends.",
        answer: "1. Controller: Transport adapter. Parses incoming HTTP requests, extracts headers/params, validates input format, calls the service, and serializes the response into appropriate HTTP status codes and JSON. 2. Service: Business logic engine. Orchestrates workflows, enforces business invariants, coordinates transactions, and handles domain events. 3. Repository: Data access abstraction. Executes SQL/ORM queries, abstracts the persistence mechanism, and maps database rows into domain entities.",
        tips: "Summarize with: 'Controllers speak HTTP, Services speak Business Logic, and Repositories speak Data.'"
      },
      {
        question: "Why is Constructor Injection preferred over `@Autowired` field injection in modern Spring Boot development?",
        answer: "Field injection uses reflection to inject private fields after object construction, hiding dependencies. Constructor injection: 1. Makes dependencies explicit in the public contract. 2. Enables `final` immutable fields. 3. Allows clean unit testing by passing mocks directly via `new Service(mockRepo)` without loading a Spring Context. 4. Detects circular dependencies at compile/startup time rather than runtime.",
        tips: "Constructor injection is standard practice at top engineering firms; mentioning this shows you follow modern best practices."
      }
    ],
    reflectionPrompt: "If your CEO asks to add a scheduled cron job or Slack bot that uses the same application processing logic, how does having a clean Service layer save you from rewriting code?",
    measurableCriteria: "Learner can refactor a monolithic endpoint into thin controller, pure business service, and dedicated repository with clean constructor injection.",
    resources: [
      {
        title: "Spring Guides: Serving Web Content with Spring MVC",
        purpose: "Official Spring MVC architecture and controller routing",
        url: "https://spring.io/guides/gs/serving-web-content/",
        isOfficial: true
      },
      {
        title: "FastAPI Documentation: Bigger Applications — Multiple Files & Dependencies",
        purpose: "Structuring modular enterprise FastAPI services and dependencies",
        url: "https://fastapi.tiangolo.com/tutorial/bigger-applications/",
        isOfficial: true
      }
    ]
  },
  {
    day: 16,
    title: "PostgreSQL Integration, ORM/Entities & Secure Configuration",
    subtitle: "Connecting real databases: Spring Data JPA (Hibernate) or SQLAlchemy/SQLModel with connection pooling and `.env` secrets",
    week: 3,
    phase: "Stage B: Primary Backend Track",
    timeAllocationHours: 6.0,
    learningObjectives: [
      "Connect your backend application to a real PostgreSQL database instance",
      "Map domain classes to database tables using ORM annotations/models (JPA `@Entity` vs SQLAlchemy/SQLModel)",
      "Understand Database Connection Pooling (HikariCP / asyncpg) and avoid connection exhaustion",
      "Manage sensitive database credentials securely using environment variables (`.env`) without leaking secrets into Git"
    ],
    keyTerminology: [
      {
        term: "ORM (Object-Relational Mapping)",
        definition: "A technique that lets you query and manipulate data from a database using an object-oriented paradigm instead of writing raw SQL strings.",
        analogy: "A universal translator who converts your English speech (Java/Python objects) into Spanish (SQL rows) so you don't have to speak Spanish manually."
      },
      {
        term: "Connection Pool (HikariCP)",
        definition: "A cache of pre-established database connections maintained by the server so connections can be reused for subsequent requests without paying the expensive TCP/TLS handshake cost.",
        analogy: "A taxi stand outside an airport with 10 idling taxis ready for passengers, rather than calling and waiting 15 minutes for a taxi every time someone lands."
      },
      {
        term: "Environment Variables (`.env`)",
        definition: "Dynamic operating system values loaded at runtime to supply configuration (DB passwords, API keys) without hardcoding secrets in source code.",
        analogy: "A lockbox with your house keys that you open on arrival rather than etching your house key teeth directly onto the front door."
      }
    ],
    conceptExplanation: {
      what: "ORMs bridge object-oriented code and relational database tables. Secure configuration ensures credentials remain outside version control.",
      whyNeeded: "In-memory maps lose all data upon server restart. Hardcoding passwords in code leads to GitHub security alerts, API key theft, and database breaches.",
      howItWorks: "The framework reads `.env` variables at boot, initializes a connection pool (HikariCP in Spring, asyncpg in Python), maps entity classes to SQL tables, and persists records automatically.",
      beginnerMistakes: [
        "Committing `application.properties` or `.env` containing real database passwords into public GitHub repos",
        "Setting `spring.jpa.hibernate.ddl-auto=create-drop` in production (wipes all customer data on restart!)",
        "Opening raw database connections manually inside endpoints without returning them to the pool (causes pool starvation)",
        "Falling into the N+1 query trap by eagerly fetching related entities in loops"
      ],
      backendRelevance: "Connecting to PostgreSQL and running real migrations is the moment a tutorial project becomes a real backend application.",
      interviewerPerspective: "Interviewers ask: 'How do you handle database credentials securely across local dev and production? What is connection pooling?'",
      howToProveUnderstanding: "Configure PostgreSQL connection via environment variables, map the `Application` entity, and verify records persist across server restarts."
    },
    javaCodeSnippet: {
      title: "ApplicationEntity.java & Repository (Spring Data JPA)",
      code: `package com.launchlab.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "job_applications")
public class ApplicationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String companyName;

    @Column(nullable = false, length = 100)
    private String roleTitle;

    @Column(nullable = false, length = 30)
    private String status;

    private LocalDate appliedDate;

    // Constructors, Getters, Setters omitted for brevity
}

// Spring Data JPA Repository (Zero boilerplate CRUD!)
public interface ApplicationJpaRepository extends org.springframework.data.jpa.repository.JpaRepository<ApplicationEntity, Long> {
    java.util.List<ApplicationEntity> findByStatus(String status);
}`,
      explanation: "Spring Data JPA automatically generates SQL queries from method names like `findByStatus()` without writing boilerplate SQL."
    },
    pythonCodeSnippet: {
      title: "database_sqlmodel.py (FastAPI / SQLModel)",
      code: `from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional
from datetime import date
import os

class Application(SQLModel, table=True):
    __tablename__ = "job_applications"

    id: Optional[int] = Field(default=None, primary_key=True)
    company_name: str = Field(nullable=False, max_length=150)
    role_title: str = Field(nullable=False, max_length=100)
    status: str = Field(default="APPLIED", max_length=30)
    applied_date: date = Field(default_factory=date.today)

# Load DB URL securely from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dev.db")
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session`,
      explanation: "SQLModel combines Pydantic data validation with SQLAlchemy ORM table mapping, reading connection strings from environment variables."
    },
    practicalDeliverable: {
      title: "Live PostgreSQL / SQLite Persistence with Persistent CRUD",
      description: "Connect your primary backend application to PostgreSQL (or local SQLite file if local PostgreSQL is not installed). Configure environment variables using `.env`. Verify that records created via POST persist even after stopping and restarting the server.",
      acceptanceCriteria: [
        "Database credentials read from environment variables or `application.properties` with zero hardcoded secrets",
        "`.env` added to `.gitignore` with a clean `.env.example` provided",
        "Entity properly mapped with `@Entity` / SQLModel table",
        "Server restart proves data survives persistently on disk"
      ]
    },
    debuggingTask: {
      problemTitle: "Hardcoded Credentials in Git & Missing .gitignore Bug",
      language: "java",
      buggyCode: `# application.properties committed to GitHub:
spring.datasource.url=jdbc:postgresql://db.production.company.com:5432/proddb
spring.datasource.username=postgres
spring.datasource.password=super_secret_production_password_123! # CATASTROPHIC LEAK!`,
      bugExplanation: "Committing production or private database credentials to version control is a critical security breach. Bots scan GitHub commits within seconds to hijack exposed databases.",
      fixedCode: `# application.properties (uses environment variable placeholders):
spring.datasource.url=\${DB_URL:jdbc:postgresql://localhost:5432/jobtracker}
spring.datasource.username=\${DB_USERNAME:postgres}
spring.datasource.password=\${DB_PASSWORD:}

# Provide a .env.example template for developers to fill locally`
    },
    checklist: [
      "Connected backend application to PostgreSQL / SQLite",
      "Created `.gitignore` entry for `.env` and provided `.env.example`",
      "Mapped `JobApplication` entity using ORM annotations or SQLModel",
      "Verified persistent CRUD: data survives server shutdown and restart",
      "Understood connection pooling and HikariCP settings"
    ],
    quiz: [
      {
        id: "d16-q1",
        question: "Why should `.env` files NEVER be committed to a Git repository?",
        options: [
          "Git crashes when processing hidden dotfiles",
          "They contain secret credentials (database passwords, API keys) that malicious bots continuously scrape from public commits",
          "Environment files only work on Linux servers",
          "It causes merge conflicts with every commit"
        ],
        correctAnswer: 1,
        explanation: "Automated bots constantly scan public GitHub repositories for credentials. Hardcoding secrets leads to database compromise and massive cloud bill theft."
      },
      {
        id: "d16-q2",
        question: "What is a Database Connection Pool like HikariCP?",
        options: [
          "A backup database running in another datacenter",
          "A pool of pre-opened physical database connections kept in memory and reused across HTTP requests to avoid the latency of opening new connections on every request",
          "A software tool that compresses SQL files",
          "A database clustering mechanism"
        ],
        correctAnswer: 1,
        explanation: "Establishing TCP and TLS handshakes with a database takes 50-100ms. A connection pool maintains active connections ready for immediate reuse, drastically boosting API throughput."
      },
      {
        id: "d16-q3",
        question: "What does `GenerationType.IDENTITY` in JPA indicate?",
        options: [
          "The primary key value is generated by an auto-incrementing database column on INSERT",
          "The user must enter their national identity number",
          "The ID is randomly generated using UUID v4",
          "The ID is always equal to 1"
        ],
        correctAnswer: 0,
        explanation: "`IDENTITY` relies on the database's native auto-increment mechanism (like PostgreSQL `SERIAL` or MySQL `AUTO_INCREMENT`) to assign unique primary keys."
      }
    ],
    interviewQuestions: [
      {
        question: "What is the N+1 Query Problem in ORMs (like Hibernate/SQLAlchemy), and how do you resolve it?",
        answer: "The N+1 problem occurs when an ORM executes 1 query to fetch a parent collection of N records, and then executes N individual secondary queries to fetch associated child records in a loop (e.g. fetching 100 applications, then running 100 queries to fetch each company). This degrades database performance. It is resolved using `JOIN FETCH` queries in JPA, or eager loading with `joinedload()` in SQLAlchemy, consolidating the operation into a single SQL join query.",
        tips: "Interviewers consider the N+1 problem one of the definitive tests of whether a candidate has real backend experience."
      },
      {
        question: "What is the difference between `ddl-auto=update` vs running dedicated database migration tools like Flyway or Liquibase?",
        answer: "`ddl-auto=update` lets the ORM dynamically alter table schemas on startup. While convenient in local development, it is dangerous in production because it cannot rename columns, can lock tables unexpectedly, and provides zero version-controlled audit trail. Production systems use migration tools (Flyway, Liquibase, Alembic) where explicit versioned SQL scripts are applied sequentially and tracked in a schema history table.",
        tips: "Mentioning Flyway or Alembic shows you understand how real engineering teams manage schema evolution safely."
      }
    ],
    reflectionPrompt: "How does moving from in-memory arrays to a real persistent PostgreSQL database fundamentally change how you think about testing and database state management?",
    measurableCriteria: "Learner can configure a persistent database connection securely via environment variables, map relational entities, and execute durable CRUD operations.",
    resources: [
      {
        title: "Spring Guides: Accessing Data with JPA",
        purpose: "Official Spring guide on connecting to relational databases with JPA",
        url: "https://spring.io/guides/gs/accessing-data-jpa/",
        isOfficial: true
      },
      {
        title: "FastAPI: SQL (Relational) Databases",
        purpose: "Official FastAPI documentation for SQLAlchemy / SQLModel integration",
        url: "https://fastapi.tiangolo.com/tutorial/sql-databases/",
        isOfficial: true
      }
    ]
  }
];
