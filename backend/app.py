import multiprocessing

multiprocessing.set_start_method("fork", force=True)

from models import db, Problem

from flask import Flask, request, jsonify, render_template_string, abort
from py_sandbox import PySandboxRunner, ensure_packages_installed
from java_sandbox import JavaSandboxRunner
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-pro")

app = Flask(__name__)

CORS(app)

# Initialize sandbox runners
py_runner = PySandboxRunner()
java_runner = JavaSandboxRunner()

# Simple HTML form to test from browser
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{os.path.join(basedir, 'problems.db')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
print("Using DB:", app.config["SQLALCHEMY_DATABASE_URI"])
db.init_app(app)

# ✅ HTML UI for testing (loads problem 1 by default)
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
    <input type="text" id="problemId" value="{{ default_id }}" /><br><br>

    <label><strong>Solution Code:</strong></label><br>
    <textarea name="solution_code" rows="30">{{ default_code }}</textarea><br><br>

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
    problems = Problem.query.all()
    print([{"id": p.id, "title": p.title} for p in problems])
    # Default load problem 1
    default_id = "1"
    problem = Problem.query.get(default_id)

    solution_code = problem.llm_code if problem else "def example():\n  pass"
    return render_template_string(
        form_template, default_id=default_id, default_code=solution_code
    )


@app.route("/get_problem/<int:id>", methods=["GET"])
def get_problem(id):
    # Fetch problem from database
    problem = Problem.query.get(id)
    if not problem:
        abort(404, description=f"Problem with ID {id} not found")

    return jsonify(
        {
            "id": problem.id,
            "title": problem.title,
            "language": problem.language,
            "required_packages": problem.required_packages,
            "statement": problem.description,
            "difficulty": problem.difficulty,
            "ai_generated_code": problem.llm_code,
        }
    )


@app.route("/list_problems")
def list_problems():
    # List out all problems in the db
    problems = Problem.query.all()
    return jsonify(
        [
            {
                "id": p.id,
                "title": p.title,
                "category": p.category,
                "difficulty": p.difficulty,
                # optionally include more fields if you need them
                # "language": p.language,
                # "required_packages": p.required_packages,
            }
            for p in problems
        ]
    )


# Dynamic test runner route
@app.route("/run/<id>", methods=["POST"])
def run(id: str):
    data = request.get_json()
    solution_code = data.get("solution_code", "")
    language = data.get("language", "Python").lower()

    problem = Problem.query.get(id)
    if not problem:
        return (
            jsonify({"success": False, "error": f"No problem found with ID '{id}'"}),
            404,
        )

    # Get the appropriate test code based on problem ID and language
    test_code = problem.test_code
    if not test_code:
        return (
            jsonify({"error": f"No test code found for problem {id} in {language}"}),
            404,
        )

    # Auto-install required packages
    if problem.required_packages:
        ensure_packages_installed(problem.required_packages)

    # Select the appropriate runner
    if language == "python":
        runner = py_runner
    elif language == "java":
        runner = java_runner
    else:
        return jsonify({"error": f"Unsupported language: {language}"}), 400

    # Run the code
    result = runner.run(solution_code, test_code)

    # print(result["stderr"])

    if "results" in result:
        return jsonify(result), (200 if result.get("success") else 400)

    return jsonify({"error": result.get("error", "Unknown error")}), 400


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_prompt = data.get("prompt", "")
    current_code = data.get("code", "")

    if not user_prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        # Construct a prompt that will help Gemini understand the context
        system_prompt = """
        You are an expert coding assistant. Given the current code and the user's question,
        provide helpful code suggestions and improvements. Focus on:
        1. Direct answers to the user's questions
        2. Code improvements and best practices
        3. Potential bugs or issues
        4. Performance optimizations
        Format code blocks with appropriate indentation.

        Respond in second person, as if you are responding to the user.
        """

        full_prompt = f"{system_prompt}\n\nCurrent code:\n```\n{current_code}\n```\n\nUser question: {user_prompt}"

        # Generate response using Gemini
        response = model.generate_content(full_prompt)

        # Check if the response contains code
        has_code = "```" in response.text

        return jsonify({"response": response.text, "isCode": has_code})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Initialize
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
