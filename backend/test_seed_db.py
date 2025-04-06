from app import app
from models import db, Problem

with app.app_context():
    db.create_all()

    TEST_ANS = "import numpy as np\n\ndef hinge_loss(y_true, y_pred):\n     return np.mean(np.maximum(0, 1 - y_true * y_pred))\n\n"

    TEST_TESTS = "import numpy as np\n\n\nclass Testhinge_loss:\n    def test_hinge_loss_2(self):\n        assert np.isclose(hinge_loss(np.array([-1, -1, -1]), np.array([1, 1, 1])), 2.0)\n\n    def test_hinge_loss_3(self):\n        assert np.isclose(hinge_loss(np.array([1, 1, 1]), np.array([-1, -1, -1])), 2.0)\n\n    def test_hinge_loss_4(self):\n        assert np.isclose(hinge_loss(np.array([1, -1, 1]), np.array([-1, 1, -1])), 2.0)\n\n    def test_hinge_loss_5(self):\n        assert np.isclose(hinge_loss(np.array([1, 1, 1]), np.array([0.5, 0.5, 0.5])), 0.5)\n\n    def test_hinge_loss_6(self):\n        assert np.isclose(hinge_loss(np.array([-1, -1, -1]), np.array([-0.5, -0.5, -0.5])), 0.5)\n\n    def test_hinge_loss_7(self):\n        assert np.isclose(hinge_loss(np.array([1]), np.array([1])), 0.0)\n\n    def test_hinge_loss_8(self):\n        assert np.isclose(hinge_loss(np.array([-1]), np.array([1])), 2.0)\n\n    def test_hinge_loss_9(self):\n        assert np.isclose(hinge_loss(np.array([1]), np.array([-1])), 2.0)\n\n    def test_hinge_loss_10(self):\n        assert np.isclose(hinge_loss(np.array([-1]), np.array([-1])), 0.0)"
    p = Problem(
        id="101",
        title="TEST",
        language="python3",
        required_packages=["numpy"],
        difficulty="Easy",
        category="Software Engineering",
        description="Write a function `add(a, b)` that returns the sum of a and b.",
        llm_prompt="Write a function that adds two numbers in Python.",
        llm_code="def add(a, b): return a - b",
        test_code=TEST_TESTS,
        correct_code="def add(a, b): return a + b"
    )

    # Overwrite if existing
    existing = Problem.query.get("101")
    if existing:
        db.session.delete(existing)
        db.session.commit()

    db.session.add(p)
    db.session.commit()

    print("✅ Problem seeded.")
