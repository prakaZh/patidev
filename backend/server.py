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
import math

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
    score_1_to_10: int
    score_percentage: float
    pati_rating: str
    answers: List[dict]
    category_scores: Optional[Dict[str, dict]] = None
    percentile: float = 0
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
    score_1_to_10: int
    score_percentage: float
    pati_rating: str
    yes_count: int
    no_count: int
    timestamp: str
    category_scores: Optional[Dict[str, dict]] = None
    percentile: float

# Helper function to calculate score 1-10
def calculate_score_1_to_10(yes_count: int, total: int = 15) -> int:
    if yes_count == 0:
        return 1
    score = math.ceil(yes_count * 10 / total)
    return max(1, min(10, score))

# Helper function to calculate rating
def calculate_pati_rating(score: int) -> str:
    ratings = {
        1: "DANAV 👹",
        2: "RADHEY BHAIYA 🔥",
        3: "RANVIJAY 🐺",
        4: "KABIR SINGH 💔",
        5: "MODIJI 🇮🇳",
        6: "PREM PRAKASH 🌱",
        7: "JETHALAL 😄",
        8: "ADITYA 💫",
        9: "RANA 💕",
        10: "DEVTA 🙏"
    }
    return ratings.get(score, "UNKNOWN")

# Helper function to calculate percentile
async def calculate_percentile(score: int) -> float:
    # Get all scores
    all_results = await db.quiz_results.find({}, {"score_1_to_10": 1, "_id": 0}).to_list(10000)
    
    if not all_results:
        return 50.0  # Default if no data
    
    scores = [r.get("score_1_to_10", 5) for r in all_results if r.get("score_1_to_10")]
    
    if not scores:
        return 50.0
    
    # Count how many scores are lower than current score
    lower_count = sum(1 for s in scores if s < score)
    equal_count = sum(1 for s in scores if s == score)
    
    # Percentile formula: (lower + 0.5 * equal) / total * 100
    percentile = ((lower_count + 0.5 * equal_count) / len(scores)) * 100
    
    return round(percentile, 1)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Pati Devta Quiz API"}

@api_router.post("/quiz/submit", response_model=QuizResultResponse)
async def submit_quiz(input: QuizResultCreate):
    # Calculate score 1-10
    score_1_to_10 = calculate_score_1_to_10(input.yes_count)
    score_percentage = (input.yes_count / 15) * 100
    pati_rating = calculate_pati_rating(score_1_to_10)
    
    # Calculate percentile based on existing data
    percentile = await calculate_percentile(score_1_to_10)
    
    quiz_result = QuizResult(
        user_name=input.user_name,
        yes_count=input.yes_count,
        no_count=input.no_count,
        score_1_to_10=score_1_to_10,
        score_percentage=score_percentage,
        pati_rating=pati_rating,
        answers=input.answers,
        category_scores=input.category_scores,
        percentile=percentile
    )
    
    doc = quiz_result.model_dump()
    await db.quiz_results.insert_one(doc)
    
    return QuizResultResponse(
        id=quiz_result.id,
        user_name=quiz_result.user_name,
        score_1_to_10=quiz_result.score_1_to_10,
        score_percentage=quiz_result.score_percentage,
        pati_rating=quiz_result.pati_rating,
        yes_count=quiz_result.yes_count,
        no_count=quiz_result.no_count,
        timestamp=quiz_result.timestamp,
        category_scores=quiz_result.category_scores,
        percentile=quiz_result.percentile
    )

@api_router.get("/quiz/results", response_model=List[QuizResultResponse])
async def get_all_results():
    results = await db.quiz_results.find({}, {"_id": 0}).to_list(100)
    response = []
    for r in results:
        # Handle old results without score_1_to_10
        if "score_1_to_10" not in r:
            r["score_1_to_10"] = calculate_score_1_to_10(r.get("yes_count", 0))
        if "percentile" not in r:
            r["percentile"] = 50.0
        response.append(QuizResultResponse(**r))
    return response

@api_router.get("/quiz/result/{result_id}", response_model=QuizResultResponse)
async def get_result(result_id: str):
    result = await db.quiz_results.find_one({"id": result_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    # Handle old results
    if "score_1_to_10" not in result:
        result["score_1_to_10"] = calculate_score_1_to_10(result.get("yes_count", 0))
    if "percentile" not in result:
        result["percentile"] = 50.0
    return QuizResultResponse(**result)

@api_router.get("/quiz/stats")
async def get_quiz_stats():
    """Get overall quiz statistics for percentile calculations"""
    all_results = await db.quiz_results.find({}, {"score_1_to_10": 1, "_id": 0}).to_list(10000)
    scores = [r.get("score_1_to_10", 5) for r in all_results if r.get("score_1_to_10")]
    
    if not scores:
        return {"total_submissions": 0, "average_score": 0, "score_distribution": {}}
    
    # Calculate distribution
    distribution = {}
    for i in range(1, 11):
        distribution[str(i)] = scores.count(i)
    
    return {
        "total_submissions": len(scores),
        "average_score": round(sum(scores) / len(scores), 2),
        "score_distribution": distribution
    }

@api_router.get("/visitor/count")
async def get_visitor_count():
    """Get current visitor count"""
    counter = await db.site_stats.find_one({"type": "visitor_counter"}, {"_id": 0})
    if not counter:
        return {"count": 0}
    return {"count": counter.get("count", 0)}

@api_router.post("/visitor/increment")
async def increment_visitor_count():
    """Increment visitor count"""
    result = await db.site_stats.find_one_and_update(
        {"type": "visitor_counter"},
        {"$inc": {"count": 1}},
        upsert=True,
        return_document=True
    )
    count = result.get("count", 1) if result else 1
    return {"count": count}

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
