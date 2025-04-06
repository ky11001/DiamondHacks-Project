from app import app
from models import db, Problem

with app.app_context():
    db.create_all()

    p = Problem(
        id="100",
        title="Add Two Numbers",
        language="python3",
        difficulty="Easy",
        category="Software Engineering",
        description="Write a function `add(a, b)` that returns the sum of a and b.",
        llm_prompt="Write a function that adds two numbers in Python.",
        llm_code="def add(a, b): return a - b",
        test_code="""
import pytest

class TestAdd:
    def test_add(self):
        assert add(2, 3) == 5
    def test_fail(self):
        assert add(2, 2) == 5  # fail
""",
        correct_code="def add(a, b): return a + b"
    )

    # Overwrite if existing
    existing = Problem.query.get("100")
    if existing:
        db.session.delete(existing)
        db.session.commit()

    db.session.add(p)
    db.session.commit()

    print("✅ Problem seeded.")
