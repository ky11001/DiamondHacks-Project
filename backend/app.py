import multiprocessing

multiprocessing.set_start_method("fork", force=True)

from models import db, Problem
from flask_sqlalchemy import SQLAlchemy

from flask import Flask, request, jsonify, render_template_string
from py_sandbox import PySandboxRunner
from java_sandbox import JavaSandboxRunner

app = Flask(__name__)

# Initialize sandbox runners
py_runner = PySandboxRunner()
java_runner = JavaSandboxRunner()

# Simple HTML form to test from browser
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///problems.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.before_request
def create_tables():
    db.create_all()


# ✅ HTML UI for testing (loads problem 100 by default)
form_template = """
<!DOCTYPE html>
<html>
<head>
  <title>Code Runner</title>
  <style>
    body { font-family: sans-serif; margin: 2rem; }
    textarea { width: 100%; font-family: monospace; font-size: 1rem; }
    button { margin-top: 1rem; padding: 0.5rem 1rem; font-size: 1rem; }
    #output { margin-top: 2rem; padding: 1rem; border: 1px solid #ccc; background: #f9f9f9; white-space: pre-wrap; }
    .test-result { margin-bottom: 1rem; }
    .passed { color: green; }
    .failed { color: red; }
    pre { background: #eee; padding: 0.5rem; overflow-x: auto; }
    h3 { margin-top: 0; }
  </style>
</head>
<body>
  <h2>Test Python Code Submission</h2>

  <form id="codeForm">
    <label><strong>Problem ID:</strong></label><br>
    <input type="text" id="problemId" value="100" /><br><br>

    <label><strong>Solution Code:</strong></label><br>
    <textarea name="solution_code" rows="10">
def add(a, b):
    return a + b
    </textarea><br><br>

    <button type="submit">Run Code</button>
  </form>

  <div id="output"></div>

  <script>
    document.getElementById("codeForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const solution_code = e.target.solution_code.value;
      const problem_id = document.getElementById("problemId").value.trim();
      const output = document.getElementById("output");
      output.innerHTML = "⏳ Running tests...";

      const res = await fetch(`/run/${problem_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_code }),
      });

      const data = await res.json();

      if (data.results && Array.isArray(data.results)) {
        const results = data.results;
        const passed = results.filter((r) => r.outcome === "passed").length;
        const failed = results.length - passed;

        output.innerHTML =
          `<h3>${passed} passed / ${failed} failed</h3>` +
          results.map((r) => {
            const icon = r.outcome === "passed" ? "✅" : "❌";
            const status = r.outcome === "passed"
              ? "<span class='passed'>Passed</span>"
              : "<span class='failed'>Failed</span>";
            const error = r.outcome !== "passed"
              ? `<pre>${r.message?.trim() || "No message"}</pre>`
              : "";

            return `<div class='test-result'>
              ${icon} <strong>${r.name}</strong><br>
              ${status}
              ${error}
            </div>`;
          }).join("");
      } else {
        output.innerHTML = `
          <div class="failed">
            <strong>Error:</strong><br>
            <pre>${data.error || "Unknown error"}</pre>
            <br><strong>Stdout:</strong><br>
            <pre>${data.stdout || "(empty)"}</pre>
            <br><strong>Stderr:</strong><br>
            <pre>${data.stderr || "(empty)"}</pre>
          </div>`;
      }
    });
  </script>
</body>
</html>
"""


# ✅ Serve the HTML form at root
@app.route("/", methods=["GET"])
def home():
    return render_template_string(form_template)


@app.route("/get_problem/<id>", methods=["GET"])
def get_problem(id):
    # TODO: fetch problem data from database
    return jsonify(
        {
            "id": id,
            "title": "First problem!",
            "statement": "Statement for problem " + id,
            "difficulty": "Easy",
            "language": "python",
            "ai_generated_code": "def add(a, b):\n    return a + b\n",
        }
    )


# ✅ Dynamic test runner route
@app.route("/run/<id>", methods=["POST"])
def run(id: str):
    data = request.get_json()
    solution_code = data.get("solution_code", "")
    language = data.get("language", "python").lower()

    # TODO move this to get_test_code
    # problem = Problem.query.get(id)
    # if not problem:
    #     return jsonify({
    #         "success": False,
    #         "error": f"No problem found with ID '{id}'"
    #     }), 404

    # test_code = problem.test_code

    # Get the appropriate test code based on problem ID and language
    test_code = get_test_code(id, language)
    if not test_code:
        return (
            jsonify({"error": f"No test code found for problem {id} in {language}"}),
            404,
        )

    # Select the appropriate runner
    if language == "python":
        runner = py_runner
    elif language == "java":
        runner = java_runner
    else:
        return jsonify({"error": f"Unsupported language: {language}"}), 400

    # Run the code
    result = runner.run(solution_code, test_code)

    if "results" in result:
        return jsonify(result), (200 if result.get("success") else 400)

    return jsonify({"error": result.get("error", "Unknown error")}), 400


def get_test_code(problem_id: str, language: str) -> str:
    """Get test code for a specific problem and language."""
    # TODO: fetch test code from database
    # This is a placeholder - in a real app, this would come from a database
    test_cases = {
        "1": {
            "python": """
import pytest

class TestTwoSum:
    def test_case1(self):
        nums = [2, 7, 11, 15]
        target = 9
        result = two_sum(nums, target)
        assert result == [0, 1] or result == [1, 0]

    def test_case2(self):
        nums = [3, 2, 4]
        target = 6
        result = two_sum(nums, target)
        assert result == [1, 2] or result == [2, 1]
""",
            "java": """
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SolutionTest {
    @Test
    public void testCase1() {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = solution.twoSum(nums, target);
        assertArrayEquals(new int[]{0, 1}, result);
    }

    @Test
    public void testCase2() {
        Solution solution = new Solution();
        int[] nums = {3, 2, 4};
        int target = 6;
        int[] result = solution.twoSum(nums, target);
        assertArrayEquals(new int[]{1, 2}, result);
    }
}
""",
        }
    }
    return test_cases.get(problem_id, {}).get(language)


if __name__ == "__main__":
    app.run(debug=True)
