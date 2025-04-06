import re

# Parse test cases
def extract_sample_tests(test_code: str):
    pattern = r"assert\s+([a-zA-Z_][\w\.]*\(.*?\))\s*==\s*(.+)"
    matches = re.findall(pattern, test_code)

    samples = []
    for call, expected in matches:
        samples.append({
            "input" : call.strip(),
            "expected_output" : expected.strip().rstrip(",")
        })
    
    return samples