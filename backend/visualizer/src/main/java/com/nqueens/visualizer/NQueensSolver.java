package com.nqueens.visualizer;

// We need these "import" statements to use List and ArrayList
import java.util.ArrayList;
import java.util.List;

public class NQueensSolver {

    /**
     * This is the public method that starts the solving process.
     * It creates the board and the list of steps.
     */
    public static List<AlgorithmStep> solve(int n) {
        // This list will hold every move we make
        List<AlgorithmStep> allSteps = new ArrayList<>();
        
        // Create the board, e.g., int[4][4]
        // 0 = empty, 1 = queen
        int[][] board = new int[n][n];

        // Start the recursive "helper" function. We start at row 0.
        solveRecursive(board, 0, allSteps);

        // Finally, return the complete list of steps
        return allSteps;
    }

    /**
     * This is the "heart" of the algorithm (the backtracking).
     * It tries to place a queen in the given 'row'.
     */
    private static boolean solveRecursive(int[][] board, int currentRow, List<AlgorithmStep> steps) {
        int n = board.length;

        // "Base Case": If we've reached the row AFTER the last row,
        // it means we successfully placed queens in all rows. We are done!
        if (currentRow == n) {
            return true; // Solution found
        }

        // "Recursive Case": Try to place a queen in every column of this row
        for (int col = 0; col < n; col++) {
            
            // 1. RECORD THE "TRY"
            // We are now "checking" position [currentRow][col]
            steps.add(new AlgorithmStep("try", currentRow, col, "checking"));

            // 2. CHECK IF SAFE
            if (isSafe(board, currentRow, col)) {
                
                // 3. PLACE QUEEN
                board[currentRow][col] = 1; // Place the queen
                
                // 4. RECORD THE "PLACE"
                steps.add(new AlgorithmStep("place", currentRow, col, "success"));

                // 5. RECURSE
                // Now, move to the *next* row and try to solve from there.
                if (solveRecursive(board, currentRow + 1, steps)) {
                    return true; // Found a solution!
                }

                // 6. BACKTRACK
                // If we are here, it means the recursive call (step 5) failed.
                board[currentRow][col] = 0; // Remove the queen
                
                // 7. RECORD THE "REMOVE" (Backtrack)
                steps.add(new AlgorithmStep("remove", currentRow, col, "backtracking"));

            } else {
                // This position was not safe, record the conflict.
                steps.add(new AlgorithmStep("try", currentRow, col, "conflict"));
            }
        }

        // If we tried all columns in this row and nothing worked,
        // we must return 'false' to trigger backtracking in the *previous* row.
        return false;
    }

    /**
     * A helper function to check if a queen can be placed at board[row][col]
     * without being attacked.
     */
    private static boolean isSafe(int[][] board, int row, int col) {
        int n = board.length;

        // Check 1: Column
        for (int i = 0; i < row; i++) {
            if (board[i][col] == 1) {
                return false;
            }
        }

        // Check 2: Upper-Left Diagonal
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 1) {
                return false;
            }
        }

        // Check 3: Upper-Right Diagonal
        for (int i = row, j = col; i >= 0 && j < n; i--, j++) {
            if (board[i][j] == 1) {
                return false;
            }
        }

        // If all checks pass, it's safe
        return true;
    }
}