import multiprocessing
import tempfile
import os
import sys
import json
import subprocess
from typing import Dict, Any

import re


import os
from unittest import result
import xml.etree.ElementTree as ET


def parse_junit_report_dir(report_dir):
    results = []
    test_num = 1

    for filename in os.listdir(report_dir):
        if filename.endswith(".xml"):
            filepath = os.path.join(report_dir, filename)
            tree = ET.parse(filepath)
            root = tree.getroot()

            for testcase in root.findall("testcase"):
                name = f"testCase{test_num}"
                outcome = "passed"
                message = ""

                if testcase.find("failure") is not None:
                    outcome = "failed"
                    message = testcase.find("failure").attrib.get(
                        "message", "Test failed"
                    )

                elif testcase.find("error") is not None:
                    outcome = "failed"
                    message = testcase.find("error").attrib.get(
                        "message", "Test errored"
                    )

                elif testcase.find("skipped") is not None:
                    outcome = "skipped"
                    message = testcase.find("skipped").attrib.get("message", "")

                results.append({"name": name, "outcome": outcome, "message": message})
                test_num += 1

    return results


def _run_junit_in_subprocess(
    tmpdir: str, solution_code: str, test_code: str, return_dict: Dict[str, Any]
) -> None:
    # Create source files
    solution_path = os.path.join(tmpdir, "Solution.java")
    test_path = os.path.join(tmpdir, "SolutionTest.java")

    # Write solution code
    with open(solution_path, "w") as f:
        f.write(solution_code)

    # Write test code
    with open(test_path, "w") as f:
        f.write(test_code)

    try:
        # Compile both files
        javac_result = subprocess.run(
            [
                "javac",
                "-cp",
                "junit-platform-console-standalone-1.9.2.jar",
                solution_path,
                test_path,
            ],
            capture_output=True,
            text=True,
            timeout=5,
            cwd=tmpdir,
        )

        if javac_result.returncode != 0:
            return_dict.update(
                {
                    "success": False,
                    "error": "Compilation error",
                    "stdout": javac_result.stdout,
                    "stderr": javac_result.stderr,
                }
            )
            return

        # Run tests with simplified output format
        java_result = subprocess.run(
            [
                "java",
                "-jar",
                "junit-platform-console-standalone-1.9.2.jar",
                "--details=flat",
                "--scan-classpath",
                "--class-path",
                tmpdir,
                "--reports-dir",
                os.path.join(tmpdir, "reports"),
            ],
            capture_output=True,
            text=True,
            timeout=3,
            cwd=tmpdir,
        )

        # Parse test results
        results = []
        all_passed = java_result.returncode == 0

        # print("results", java_result)

        results = parse_junit_report_dir(os.path.join(tmpdir, "reports"))
        # print("result 1", results)
        # # Parse test summary from the output
        # test_summary = {}
        # for line in java_result.stdout.split("\n"):
        #     if "test successful" in line or "test failed" in line:
        #         count = int(line.strip().split()[0])
        #         status = "successful" if "successful" in line else "failed"
        #         test_summary[status] = count

        # # If we have test summary info, use it to generate results
        # if test_summary:
        #     total_tests = test_summary.get("successful", 0) + test_summary.get(
        #         "failed", 0
        #     )
        #     for i in range(total_tests):
        #         test_num = i + 1
        #         is_passed = i < test_summary.get("successful", 0)
        #         results.append(
        #             {
        #                 "name": f"testCase{test_num}",
        #                 "outcome": "passed" if is_passed else "failed",
        #                 "message": "" if is_passed else "Test failed",
        #             }
        #         )

        return_dict.update(
            {
                "success": all_passed,
                "results": results,
                "stdout": java_result.stdout,
                "stderr": java_result.stderr,
            }
        )

    except subprocess.TimeoutExpired:
        return_dict.update(
            {
                "success": False,
                "error": "Test execution timed out",
                "stdout": "",
                "stderr": "",
            }
        )
    except Exception as e:
        return_dict.update(
            {"success": False, "error": str(e), "stdout": "", "stderr": ""}
        )


class JavaSandboxRunner:
    TIME_LIMIT = 3  # seconds

    def run(self, solution_code: str, test_code: str) -> Dict[str, Any]:
        with tempfile.TemporaryDirectory() as tmpdir:
            # Copy JUnit jar to temp directory
            junit_jar = os.path.join(
                os.path.dirname(__file__),
                "lib",
                "junit-platform-console-standalone-1.9.2.jar",
            )
            if os.path.exists(junit_jar):
                subprocess.run(["cp", junit_jar, tmpdir])
            else:
                return {
                    "success": False,
                    "error": "JUnit JAR not found. Please ensure junit-platform-console-standalone-1.9.2.jar is in the backend directory.",
                    "stdout": "",
                    "stderr": "",
                }

            manager = multiprocessing.Manager()
            return_dict = manager.dict()

            p = multiprocessing.Process(
                target=_run_junit_in_subprocess,
                args=(tmpdir, solution_code, test_code, return_dict),
            )

            p.start()
            p.join(self.TIME_LIMIT)

            if p.is_alive():
                p.terminate()
                return {
                    "success": False,
                    "error": "Test execution hard timeout (killed process)",
                    "stdout": "",
                    "stderr": "",
                }

            return return_dict.copy()
