import json

FILENAME = 'ncb_python_en.jsonl'

# Read JSON file
with open(f'data/problems/{FILENAME}', 'r', encoding='utf-8') as f:
    data = [json.loads(line) for line in f]

# Process each problem
for item in data:
    problem_id = item.get("_id")
    prompt = item.get("prompt", "")
    problem_description = item.get("problem", "")
    test_cases = item.get("testcases", "")
    solution_code_block = item.get("reference_solution", "")

    # Extract the Python code block from the solution (between ```python and ```)
    import re
    match = re.search(r"```python(.*?)```", solution_code_block, re.DOTALL)
    solution_code = match.group(1).strip() if match else ""

    print(f"Problem ID : {problem_id}")
    if (problem_id == 131):
        print(f"Test cases: {solution_code}")
    # print(f"Description: {problem_description[:60]}...")
    # print(f"Solution:\n{solution_code[:60]}...\n")