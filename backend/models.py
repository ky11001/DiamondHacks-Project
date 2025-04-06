from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, Text, PickleType

db = SQLAlchemy()

class Problem(db.Model):
    __tablename__ = "problems"

    id = Column(String, primary_key=True)
    title = Column(String(255), nullable=False)
    language = Column(String(255), nullable=False)
    required_packages = Column(PickleType, nullable=True)
    difficulty = Column(String(255), nullable=False)
    category = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    llm_prompt = Column(Text, nullable=False)
    llm_code = Column(Text, nullable=False)
    test_code = Column(Text, nullable=False)
    correct_code = Column(Text, nullable=False)
