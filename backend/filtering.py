"""
Postprocessing of AI-generated responses.
Evaluate AI-generated responses against corresponding test cases, and collect the ones that fail one or more tests.
These responses and corresponding problems will be added to the DB.
"""

from flask import Flask
from py_sandbox import PySandboxRunner, ensure_packages_installed
from models import db, Problem
from app import app
import os
import json
import ast

PYTHON_PROBLEMS_FILENAME = 'backend/data/problems/ncb_python_en.jsonl'
PYTHON_RESPONSES_FILENAME = 'backend/data/responses/ncb_python_responses.jsonl'
JAVA_PROBLEMS_FILENAME = 'backend/data/problems/ncb_java_en.jsonl'
JAVA_RESPONSES_FILENAME = 'backend/data/responses/ncb_java_responses.jsonl'

# Read JSON file for Python problems
with open(f'{PYTHON_PROBLEMS_FILENAME}', 'r', encoding='utf-8') as f:
    problems = [json.loads(line) for line in f]

# Read JSON file for Python responses
with open(f'{PYTHON_RESPONSES_FILENAME}', 'r', encoding='utf-8') as f:
    responses = [json.loads(line) for line in f]

def extract_top_level_imports(code):
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        print("⚠️ Failed to parse code due to syntax error:", e)
        return []
    
    packages = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                packages.add(alias.name.split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                packages.add(node.module.split(".")[0])

    return list(packages)

# Evaluate a given solution against a set of test cases
# Return true/false, depending on result
def evaluate_solution(solution, tests, lang):
    #TODO: branch conditionally for python/java

    runner = PySandboxRunner()
    result = runner.run(solution, tests)

    return "results" in result and result.get("success")

# Process each problem
# TODO: include java functionality

# ✅ Set up Flask app with identical DB config
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'problems.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()

    n_seeded = 0

    # Evaluate each response
    for problem, response in zip(problems, responses):
        problem_id = problem.get("_id")
        prompt = problem.get("prompt", "")
        problem_description = problem.get("problem", "")
        test_cases = problem.get("testcases", "")
        solution_code_block = problem.get("reference_solution", "")
        category = problem.get("classification", "")

        llm_solution_block = response.get("AI response", "")

        # Extract the Python code block from the solution (between ```python and ```)
        import re
        match = re.search(r"```python(.*?)```", solution_code_block, re.DOTALL)
        solution_code = match.group(1).strip() if match else ""

        match = re.search(r"```python(.*?)```", llm_solution_block, re.DOTALL)
        llm_solution_code = match.group(1).strip() if match else ""

        # Ensure necessary dependencies for the solution and test cases are installed
        try:
            sol_dependencies = extract_top_level_imports(solution_code)
        except SyntaxError as e:
            print(f"❌ Syntax error in solution_code for problem {problem_id}: {e}")
            continue

        try:
            test_dependencies = extract_top_level_imports(test_cases)
        except SyntaxError as e:
            print(f"❌ Syntax error in test_code for problem {problem_id}: {e}")
            continue

        dependencies = list(set(sol_dependencies).union(test_dependencies))

        print("Installing dependencies...")
        ensure_packages_installed(dependencies)

        # Evaluate LLM solution against test cases
        tests_passed = evaluate_solution(llm_solution_code, test_cases, "python3")

        if not tests_passed:
            # If at least one test failed, use this problem -- add it to the DB
            problem_id = n_seeded + 1 # Re-number IDs
            p = Problem(
                id=problem_id,
                title="NULL",
                language="python3",
                required_packages=dependencies,
                difficulty="NULL",
                category=category,
                description=problem_description,
                llm_prompt=prompt,
                llm_code=llm_solution_code,
                test_code=test_cases,
                correct_code=solution_code
            )

            # Overwrite if existing
            existing = Problem.query.get(problem_id)
            if existing:
                db.session.delete(existing)
                db.session.commit()

            db.session.add(p)
            db.session.commit()
            print(f"✅ Problem {problem_id} seeded.")
            n_seeded += 1
            print("Using DB:", app.config['SQLALCHEMY_DATABASE_URI'])

    problems = Problem.query.all()
    print([{"id": p.id, "title": p.title} for p in problems])
print(f"Seeded a total of {n_seeded} problems.")
