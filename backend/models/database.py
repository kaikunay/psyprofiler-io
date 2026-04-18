# models/database.py
from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime

class ReportOrder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: str = Field(index=True, unique=True, description="Razorpay order ID")
    email: str = Field(index=True)
    tier: str
    amount: int
    status: str = Field(default="created", description="created, paid, processing, completed, failed")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    payload: Optional[str] = Field(default=None, description="Stringified JSON of the questionnaire/OSINT input")
    report_path: Optional[str] = Field(default=None, description="Local path to the generated PDF")

# SQLite for MVP. Can easily swap to Postgres later via SQLModel.
sqlite_file_name = "psyprofiler.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=False)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
