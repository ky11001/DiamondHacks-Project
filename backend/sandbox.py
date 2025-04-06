import multiprocessing

# Force 'fork' start method for compatibility (macOS)
multiprocessing.set_start_method("fork", force=True)

import tempfile
import os
import sys
import json
import subprocess

PACKAGE_ALIASES = {
    "sklearn": "scikit-learn",
    "cv2": "opencv-python",
    "PIL": "Pillow",
    "bs4": "beautifulsoup4",
    "yaml": "pyyaml",
    "Crypto": "pycryptodome",
    "Image": "Pillow",
    "tensorflow": "tensorflow",
    "np": "numpy",  # optional for alias resolution
    # Add more as needed
}

def ensure_packages_installed(packages):
    for pkg in packages:
        pip_name = PACKAGE_ALIASES.get(pkg, pkg)
        try:
            __import__(pkg)
        except ImportError:
            print(f"📦 Installing {pkg}...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
            except:
                # Try using the pip name aliasing
                print(f"Failed to run `pip install -m {pkg}`, trying `pip install -m {pip_name}` instead...")
                subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])


def _run_pytest_in_subprocess(tmpdir, solution_code, test_code, return_dict):
    test_path = os.path.join(tmpdir, "test_solution.py")
    report_path = os.path.join(tmpdir, ".report.json")

    with open(test_path, "w") as f:
        f.write(solution_code + "\n\n" + test_code)

    env = os.environ.copy()
    env["PYTHONPATH"] = tmpdir

    try:
        result = subprocess.run(
            [
                sys.executable, "-m", "pytest",
                test_path,
                "--json-report",
                f"--json-report-file={report_path}",
            ],
            capture_output=True,
            text=True,
            timeout=3,
            cwd=tmpdir,
            env=env
        )

        if not os.path.exists(report_path):
            return_dict.update({
                "success": False,
                "error": "Test report not generated",
                "stdout": result.stdout,
                "stderr": result.stderr,
            })
            return

        with open(report_path, "r") as f:
            report_data = json.load(f)

        results = []
        all_passed = True
        for test in report_data.get("tests", []):
            if test["outcome"] != "passed":
                all_passed = False
            results.append({
                "name": test["nodeid"],
                "outcome": test["outcome"],
                "message": test.get("longrepr", "")
            })

        return_dict.update({
            "success": all_passed,
            "results": results,
            "stdout": result.stdout,
            "stderr": result.stderr
        })

    except subprocess.TimeoutExpired:
        return_dict.update({
            "success": False,
            "error": "Test execution timed out",
            "stdout": "",
            "stderr": ""
        })

class SandboxRunner:
    TIME_LIMIT = 3  # seconds

    def run(self, solution_code, test_code):
        with tempfile.TemporaryDirectory() as tmpdir:
            manager = multiprocessing.Manager()
            return_dict = manager.dict()

            p = multiprocessing.Process(
                target=_run_pytest_in_subprocess,
                args=(tmpdir, solution_code, test_code, return_dict)
            )

            p.start()
            p.join(self.TIME_LIMIT)

            if p.is_alive():
                p.terminate()
                return {
                    "success": False,
                    "error": "Test execution hard timeout (killed process)",
                    "stdout": "",
                    "stderr": ""
                }

            return return_dict.copy()
