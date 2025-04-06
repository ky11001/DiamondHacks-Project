from flask import Flask, request, jsonify, render_template_string
from sandbox import SandboxRunner

app = Flask(__name__)

# Simple HTML form to test from browser
form_template = """
<!DOCTYPE html>
<html>
<head>
  <title>Code Runner</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 2rem;
    }

    textarea {
      width: 100%;
      font-family: monospace;
      font-size: 1rem;
    }

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }

    #output {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #ccc;
      background: #f9f9f9;
      white-space: pre-wrap;
    }

    .test-result {
      margin-bottom: 1rem;
    }

    .passed {
      color: green;
    }

    .failed {
      color: red;
    }

    pre {
      background: #eee;
      padding: 0.5rem;
      overflow-x: auto;
    }

    h3 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <h2>Test Python Code Submission</h2>

  <form id="codeForm">
    <label><strong>Solution Code:</strong></label><br>
    <textarea name="solution_code" rows="10">
def add(a, b):
    return a + b
    </textarea><br><br>

    <label><strong>Test Code:</strong></label><br>
    <textarea name="test_code" rows="14">
import pytest

class TestAdd:
    def test_add_pass(self):
        assert add(2, 3) == 5

    def test_add_fail(self):
        assert add(2, 2) == 5  # This will fail
    </textarea><br><br>

    <button type="submit">Run Code</button>
  </form>

  <div id="output"></div>

  <script>
    document.getElementById("codeForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const solution_code = e.target.solution_code.value;
      const test_code = e.target.test_code.value;
      const output = document.getElementById("output");
      output.innerHTML = "⏳ Running tests...";

      const res = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_code, test_code }),
      });

      const data = await res.json();

      if (data.results && Array.isArray(data.results)) {
        const results = data.results;
        const passed = results.filter((r) => r.outcome === "passed").length;
        const failed = results.length - passed;

        output.innerHTML =
          `<h3>${passed} passed / ${failed} failed</h3>` +
          results
            .map((r) => {
              const icon = r.outcome === "passed" ? "✅" : "❌";
              const status =
                r.outcome === "passed"
                  ? "<span class='passed'>Passed</span>"
                  : "<span class='failed'>Failed</span>";
              const error =
                r.outcome !== "passed"
                  ? `<pre>${r.message?.trim() || "No message"}</pre>`
                  : "";

              return `<div class='test-result'>
                ${icon} <strong>${r.name}</strong><br>
                ${status}
                ${error}
              </div>`;
            })
            .join("");
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

@app.route("/", methods=["GET"])
def home():
    return render_template_string(form_template)

@app.route("/run", methods=["POST"])
def run():
    data = request.get_json()
    solution_code = data.get("solution_code", "")
    test_code = data.get("test_code", "")

    runner = SandboxRunner()
    result = runner.run(solution_code, test_code)

    if "results" in result:
        # Test report generated successfully, even if some tests failed
        return jsonify(result), (200 if result.get("success") else 400)

    # Otherwise, some execution error (e.g., timeout or syntax error)
    return jsonify({
        "success": False,
        "error": result.get("error", "Unknown error"),
        "stdout": result.get("stdout", ""),
        "stderr": result.get("stderr", "")
    }), 400


    
if __name__ == "__main__":
    app.run(debug=True)