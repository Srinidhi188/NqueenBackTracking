package com.nqueens.visualizer;

// A "POJO" (Plain Old Java Object).
// Its only job is to hold data. It has no logic.
public class AlgorithmStep {
    private String action; // "place", "remove", "try", "conflict"
    private int row;
    private int col;
    private String status; // "success", "backtracking", "checking", "failed"

    // This is a "constructor" to easily create a new step
    public AlgorithmStep(String action, int row, int col, String status) {
        this.action = action;
        this.row = row;
        this.col = col;
        this.status = status;
    }

    // This method is just so we can print the step nicely to the console
    @Override
    public String toString() {
        return "Action: " + action + 
               ", Position: [" + row + "][" + col + "]" +
               ", Status: " + status;
    }

    // Getters and Setters
    public String getAction() { return action; }
    public int getRow() { return row; }
    public int getCol() { return col; }
    public String getStatus() { return status; }
}