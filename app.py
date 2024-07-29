import logging

logger = logging.getLogger("uvicorn.error")
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, Response, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import models
from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
router_v1 = APIRouter(prefix='/api/v1')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://2024-iot-lab2-65070155-ceft.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# https://fastapi.tiangolo.com/tutorial/sql-databases/#crud-utils

@router_v1.get('/books')
async def get_books(db: Session = Depends(get_db)):
    return db.query(models.Book).all()

@router_v1.get('/books/{book_id}')
async def get_book(book_id: int, db: Session = Depends(get_db)):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

@router_v1.post('/books')
async def create_book(book: dict, response: Response, db: Session = Depends(get_db)):
    try:
        newbook = models.Book(
            title=book['title'], 
            author=book['author'], 
            year=book['year'], 
            is_published=book['is_published'],
            description=book['description'], 
            prologue=book['prologue'], 
            type1=book['type1'],
            type2=book['type2'], 
            type3=book['type3'], 
            type4=book['type4']
        )
        db.add(newbook)
        db.commit()
        db.refresh(newbook)
        response.status_code = 201
        return newbook
    except Exception as e:
        logger.error(f"Error creating book: {e}")
        response.status_code = 500
        return {"error": "Internal Server Error"}

@router_v1.patch('/books/{book_id}')
async def update_book(book_id: int, book: dict, response: Response, db: Session = Depends(get_db)):
    currentbook = db.query(models.Book).filter(models.Book.id == book_id).first()
    if currentbook:
        currentbook.id = book['id']
        currentbook.title = book['title']
        currentbook.author = book['author']
        currentbook.year = book['year']
        currentbook.description = book['description']
        currentbook.prologue = book['prologue']
        currentbook.type1 = book['type1']
        currentbook.type2 = book['type2']
        currentbook.type3 = book['type3']
        currentbook.type4 = book['type4']
        currentbook.is_published = book['is_published']
        
        db.commit()
        db.refresh(currentbook)
        response.status_code = 202
        return currentbook
    else:
        response.status_code = 404
        return {'message': 'book not found'}

@router_v1.delete('/books/{book_id}')
async def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    db.delete(book)
    db.commit()


app.include_router(router_v1)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
