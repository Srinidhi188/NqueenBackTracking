package com.nqueens.visualizer;

// Import the List class
import java.util.List;

// Spring Boot imports
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController // Tells Spring this class is a Controller
@RequestMapping("/api") // Makes all methods in this class start with "/api"
@CrossOrigin(origins = "*") // ALLOWS our future React app to call this API
public class SolverController {

    /**
     * This method will run when someone visits:
     * GET http://localhost:8080/api/solve?n=...
     *
     * @param n The 'n' value from the URL (e.g., ?n=8)
     * @return The list of steps, which Spring Boot will auto-convert to JSON
     */
    @GetMapping("/solve")
    public List<AlgorithmStep> getSolutionSteps(@RequestParam int n) {
        
        // This is it! We just call the static 'solve' method
        // from the NQueensSolver class you already built!
        List<AlgorithmStep> steps = NQueensSolver.solve(n);
        
        // We just return the list. Spring Boot does the rest.
        return steps;
    }
}