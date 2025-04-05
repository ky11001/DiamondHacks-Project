import sys
import traceback
from io import StringIO
import multiprocessing
import contextlib
import resource

TIME_LIMIT = 3 # seconds
MEMORY_LIMIT_MB = 100 # per process

@contextlib.contextmanager
def capture_stdout():
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    try:
        yield sys.stdout
    finally:
        sys.stdout = old_stdout


def set_resource_limits():
    # Set memory limits
    memory_bytes = MEMORY_LIMIT_MB * 1024 * 1024
    resource.setrlimit(resource.RLIMIT_AS, (memory_bytes, memory_bytes))

def run_test_code(code: str, test_code: str, return_dict):
    try:
        set_resource_limits()
        combined_code = code + "\n\n" + test_code

        # Minimal safe builtins
        safe_builtins = {
            "print": print,
            "range": range,
            "len": len,
            "str": str,
            "int": int,
            "float": float,
            "bool": bool,
            "list": list,
            "dict": dict,
            "set": set,
            "tuple": tuple,
            "enumerate": enumerate,
            "zip": zip,
            "sorted": sorted,
        }

        with capture_stdout() as output:
            exec(code, {"__builtins__" : safe_builtins}, {})

        return_dict["output"] = output.getvalue()
        return_dict["success"] = True

    except Exception as e:
        return_dict["success"] = False
        return_dict["error"] = traceback.format_exec()

def sandbox_run_with_tests(code: str, test_code: str) -> dict:
    manager = multiprocessing.Manager()
    return_dict = manager.dict()

    process = multiprocessing.Process(target=run_test_code, args=(code, test_code, return_dict))
    process.start()
    process.join(TIME_LIMIT)

    if process.is_alive():
        process.terminate()
        return {
            "success" : False,
            "error" : "Execution timed out.",
        }
    
    return return_dict.copy()