from flask import Flask, request, jsonify, render_template_string
from sandbox import sandbox_run_with_tests

app = Flask(__name__)

# Simple HTML form to test from browser
form_template = """
<!DOCTYPE html>
<html>
<head>
    <title>Code Runner</title>
</head>
<body>
    <h2>Test Python Code Submission</h2>
    <form id="codeForm">
        <label><strong>Solution Code:</strong></label><br>
        <textarea name="solution_code" rows="10" cols="80">def add(a, b): return a + b</textarea><br><br>

        <label><strong>Test Code:</strong></label><br>
        <textarea name="test_code" rows="10" cols="80">assert add(2, 3) == 5</textarea><br><br>

        <button type="submit">Run Code</button>
    </form>

    <pre id="output"></pre>

    <script>
        document.getElementById("codeForm").addEventListener("submit", async function(e) {
            e.preventDefault();

            const solution_code = e.target.solution_code.value;
            const test_code = e.target.test_code.value;

            const res = await fetch("/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ solution_code, test_code })
            });

            const data = await res.json();
            const output = document.getElementById("output");
            if (res.ok) {
                output.textContent = "✅ Success\\n" + data.output;
            } else {
                output.textContent = "❌ Error\\n" + data.error;
            }
        });
    </script>
</body>
</html>
"""


@app.route("/", methods=["GET"])
def home():
    return render_template_string(form_template)


@app.route("/get_problem/<id>", methods=["GET"])
def get_problem(id):
    return jsonify(
        {
            "id": id,
            "title": "First problem!!!!",
            "statement": "Statement for problem " + id,
            "difficulty": "Easy",
            "ai_generated_code": "# your code here",
        }
    )


@app.route("/run/<id>", methods=["POST"])
def run(id: str):
    data = request.get_json()
    # solution_code = data.get("solution_code", "")
    return jsonify(
        {
            "results": [
                {"id": 1, "result": True},
                {"id": 2, "result": False},
                {"id": 3, "result": True},
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True)
