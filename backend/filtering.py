"""
Postprocessing of AI-generated responses for Python and Java.
Evaluates responses against test cases, and adds failing ones to the DB.
"""

import os
import re
from flask import Flask
from py_sandbox import PySandboxRunner, ensure_packages_installed
from models import db, Problem
from app import app
import os
import json
import ast
import time

from models import db, Problem
from app import app
from py_sandbox import PySandboxRunner, ensure_packages_installed
from java_sandbox import JavaSandboxRunner
import google.generativeai as genai

# File paths
PYTHON_PROBLEMS_FILENAME = 'data/problems/ncb_python_en.jsonl'
PYTHON_RESPONSES_FILENAME = 'data/responses/ncb_python_responses.jsonl'
JAVA_PROBLEMS_FILENAME = 'data/problems/ncb_java_en.jsonl'
JAVA_RESPONSES_FILENAME = 'data/responses/ncb_java_responses.jsonl'

# Google API key
genai.configure(api_key="AIzaSyCfHTrNkgzxlF3Ua3O3rWFe-RG6Os9evJ8")  # Replace with your actual Gemini API key

# Utility to generate title and difficulty
def generate_title_difficulty_summary(problem_description, llm_code=None):
    prompt = f"""
You are a helpful assistant for classifying programming problems.

Given the following problem description and AI-generated solution, come up with:
1. A short, descriptive title (less than 10 words)
2. A difficulty estimate: "easy", "medium", or "hard"
3. A readible description of the problem (user-friendly), still cover the technicals and explains all the important details. Format in a way leetcode does it, taking punctionation, readibility from new lines, and other readibility elements into consideration.

Respond strictly in the format:
Title: <your title>
Difficulty: <your difficulty>
Summary: <your summary>

Problem Description:
{problem_description}

LLM Code (optional):
{llm_code or ""}
"""

    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(prompt)

    title = "Untitled"
    difficulty = "easy"
    summary = "No summary provided."
    for line in response.text.splitlines():
        if line.lower().startswith("title:"):
            title = line.split(":", 1)[1].strip()
        elif line.lower().startswith("difficulty:"):
            difficulty = line.split(":", 1)[1].strip().lower()
        elif line.lower().startswith("summary:"):
            summary = line.split(":", 1)[1].strip()

    print(f"✅ Gemini Result -> Title: {title}, Difficulty: {difficulty}, Summary: {summary}")
    return title, difficulty, summary


# Extract imports for Python
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

# Evaluates code against test cases
def evaluate_solution(solution, tests, lang):
    if lang == "java":
        runner = JavaSandboxRunner()
    else:
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
    n_seeded = 1

    # ========== PYTHON ==========
    with open(PYTHON_PROBLEMS_FILENAME, 'r', encoding='utf-8') as f:
        py_problems = [json.loads(line) for line in f]
    with open(PYTHON_RESPONSES_FILENAME, 'r', encoding='utf-8') as f:
        py_responses = [json.loads(line) for line in f]

    for problem, response in zip(py_problems, py_responses):
        problem_id = problem.get("_id")
        prompt = problem.get("prompt", "")
        description = problem.get("problem", "")
        test_code = problem.get("testcases", "")
        reference_solution = problem.get("reference_solution", "")
        category = problem.get("classification", "")
        llm_response = response.get("AI response", "")

        match = re.search(r"```python(.*?)```", reference_solution, re.DOTALL)
        correct_code = match.group(1).strip() if match else ""

        match = re.search(r"```python(.*?)```", llm_response, re.DOTALL)
        llm_code = match.group(1).strip() if match else ""

        # Install Python packages
        try:
            deps = list(set(
                extract_top_level_imports(correct_code) +
                extract_top_level_imports(test_code)
            ))
            ensure_packages_installed(deps)
        except Exception as e:
            print(f"Dependency error in problem {problem_id}: {e}")
            continue

        if not evaluate_solution(llm_code, test_code, "python"):
            title, difficulty, summery = generate_title_difficulty_summary(description, llm_code)
            p = Problem(
                id=str(n_seeded),
                title=title,
                language="python",
                required_packages=deps,
                difficulty=difficulty,
                category=category,
                description=summery,
                llm_prompt=prompt,
                llm_code=llm_code,
                test_code=test_code,
                correct_code=correct_code
            )
            db.session.merge(p)
            db.session.commit()
            print(f"✅ Seeded Python problem {p.id}")
            n_seeded += 1

    # ========== JAVA ==========
    n_seeded = 38
    with open(JAVA_PROBLEMS_FILENAME, 'r', encoding='utf-8') as f:
        java_problems = [json.loads(line) for line in f]
    with open(JAVA_RESPONSES_FILENAME, 'r', encoding='utf-8') as f:
        java_responses = [json.loads(line) for line in f]

    for problem, response in zip(java_problems, java_responses):
        problem_id = problem.get("_id")
        prompt = problem.get("prompt", "")
        description = problem.get("problem", "")
        test_code = problem.get("testcases", "")
        reference_solution = problem.get("reference_solution", "")
        category = problem.get("classification", "")
        llm_response = response.get("AI response", "")

        match = re.search(r"```java(.*?)```", reference_solution, re.DOTALL)
        correct_code = match.group(1).strip() if match else ""

        match = re.search(r"```java(.*?)```", llm_response, re.DOTALL)
        llm_code = match.group(1).strip() if match else ""

        if not evaluate_solution(llm_code, test_code, "java"):
            title, difficulty, description = generate_title_difficulty_summary(description, llm_code)
            p = Problem(
                id=str(n_seeded ),
                title=title,
                language="java",
                required_packages=[],
                difficulty=difficulty,
                category=category,
                description=description,
                llm_prompt=prompt,
                llm_code=llm_code,
                test_code=test_code,
                correct_code=correct_code
            )
            db.session.merge(p)
            db.session.commit()
            print(f"✅ Seeded Java problem {p.id}")
            n_seeded += 1

print(f"\n🎉 Seeding complete. Total problems added: {n_seeded}")
