from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class CategoryScore(BaseModel):
    name: str
    yes_count: int
    total: int
    percentage: float

class QuizResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_name: str
    total_questions: int = 15
    yes_count: int
    no_count: int
    score_percentage: float
    pati_rating: str
    answers: List[dict]
    category_scores: Optional[Dict[str, dict]] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class QuizResultCreate(BaseModel):
    user_name: str
    yes_count: int
    no_count: int
    answers: List[dict]
    category_scores: Optional[Dict[str, dict]] = None

class QuizResultResponse(BaseModel):
    id: str
    user_name: str
    score_percentage: float
    pati_rating: str
    yes_count: int
    no_count: int
    timestamp: str
    category_scores: Optional[Dict[str, dict]] = None

# Helper function to calculate rating
def calculate_pati_rating(yes_count: int, total: int = 15) -> tuple:
    score_percentage = (yes_count / total) * 100
    
    if score_percentage >= 90:
        rating = "DEVTA 🙏"
    elif score_percentage >= 75:
        rating = "MAHARAJ 👑"
    elif score_percentage >= 60:
        rating = "ACCHE PATI 💪"
    elif score_percentage >= 45:
        rating = "THEEK-THAAK 😐"
    elif score_percentage >= 30:
        rating = "KAAM CHALAU 🤷"
    else:
        rating = "SUDHAR JA BHAI 😅"
    
    return score_percentage, rating

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Pati Devta Quiz API"}

@api_router.post("/quiz/submit", response_model=QuizResultResponse)
async def submit_quiz(input: QuizResultCreate):
    score_percentage, pati_rating = calculate_pati_rating(input.yes_count)
    
    quiz_result = QuizResult(
        user_name=input.user_name,
        yes_count=input.yes_count,
        no_count=input.no_count,
        score_percentage=score_percentage,
        pati_rating=pati_rating,
        answers=input.answers,
        category_scores=input.category_scores
    )
    
    doc = quiz_result.model_dump()
    await db.quiz_results.insert_one(doc)
    
    return QuizResultResponse(
        id=quiz_result.id,
        user_name=quiz_result.user_name,
        score_percentage=quiz_result.score_percentage,
        pati_rating=quiz_result.pati_rating,
        yes_count=quiz_result.yes_count,
        no_count=quiz_result.no_count,
        timestamp=quiz_result.timestamp,
        category_scores=quiz_result.category_scores
    )

@api_router.get("/quiz/results", response_model=List[QuizResultResponse])
async def get_all_results():
    results = await db.quiz_results.find({}, {"_id": 0}).to_list(100)
    return [QuizResultResponse(**r) for r in results]

@api_router.get("/quiz/result/{result_id}", response_model=QuizResultResponse)
async def get_result(result_id: str):
    result = await db.quiz_results.find_one({"id": result_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return QuizResultResponse(**result)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
