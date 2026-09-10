// =====================================================
// DLTJ2.1
// PHASE 2 — SPRING QUESTIONS
// FILE: src/data/questions/springQuestions.ts
// =====================================================

import {
  createQuestion,
} from "./index";

export const springQuestions = [
  createQuestion("spring", 1, 1, "What is Spring?", ["A Java application framework", "A database", "A browser", "A programming language"], 0),
  createQuestion("spring", 1, 2, "Which annotation marks a Spring Boot application?", ["@SpringBootApplication", "@SpringApp", "@BootApplicationOnly", "@Application"], 0),
  createQuestion("spring", 1, 3, "Which annotation creates a REST controller?", ["@RestController", "@REST", "@ControllerREST", "@ApiController"], 0),
  createQuestion("spring", 2, 4, "Which annotation marks a service class?", ["@Service", "@Business", "@ServiceClass", "@Logic"], 0),
  createQuestion("spring", 2, 5, "Which annotation marks a repository?", ["@Repository", "@Database", "@DAO", "@DataRepositoryOnly"], 0),
  createQuestion("spring", 3, 6, "Which annotation injects a dependency?", ["@Autowired", "@InjectOnly", "@Dependency", "@Use"], 0),
  createQuestion("spring", 3, 7, "What is dependency injection?", ["Providing dependencies to a class", "Deleting dependencies", "Creating a database", "Compiling Java"], 0),
  createQuestion("spring", 4, 8, "Which annotation maps GET requests?", ["@GetMapping", "@GET", "@FetchMapping", "@ReadMapping"], 0),
  createQuestion("spring", 4, 9, "Which annotation maps POST requests?", ["@PostMapping", "@POST", "@CreateMapping", "@InsertMapping"], 0),
  createQuestion("spring", 5, 10, "Which annotation maps PUT requests?", ["@PutMapping", "@PUT", "@UpdateMapping", "@ModifyMapping"], 0),
  createQuestion("spring", 5, 11, "Which annotation maps DELETE requests?", ["@DeleteMapping", "@DELETE", "@RemoveMapping", "@DestroyMapping"], 0),
  createQuestion("spring", 6, 12, "Which annotation binds a path variable?", ["@PathVariable", "@Path", "@Variable", "@RouteVariable"], 0),
  createQuestion("spring", 6, 13, "Which annotation binds query parameters?", ["@RequestParam", "@QueryParam", "@Param", "@RequestQuery"], 0),
  createQuestion("spring", 7, 14, "Which annotation reads a request body?", ["@RequestBody", "@Body", "@RequestData", "@PayloadOnly"], 0),
  createQuestion("spring", 7, 15, "Which technology is commonly used with Spring for ORM?", ["JPA", "HTML", "CSS", "DOM"], 0),
  createQuestion("spring", 8, 16, "Which annotation marks a JPA entity?", ["@Entity", "@TableEntity", "@Jpa", "@Model"], 0),
  createQuestion("spring", 8, 17, "Which annotation identifies a primary key?", ["@Id", "@Primary", "@Key", "@PrimaryKey"], 0),
  createQuestion("spring", 9, 18, "Which file commonly contains Spring Boot configuration?", ["application.properties", "spring.config", "boot.xml", "server.java"], 0),
  createQuestion("spring", 9, 19, "Which embedded server is commonly used by Spring Boot?", ["Tomcat", "Apache only", "IIS", "Nginx"], 0),
  createQuestion("spring", 10, 20, "What is Spring Boot mainly used for?", ["Building Spring applications with simplified configuration", "Creating SQL only", "Writing HTML only", "Editing images"], 0),
];