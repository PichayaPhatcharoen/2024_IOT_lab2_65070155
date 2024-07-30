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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# https://fastapi.tiangolo.com/tutorial/sql-databases/#crud-utils

#=====book=======
@router_v1.get('/books')
async def get_books(db: Session = Depends(get_db)):
    return db.query(models.Book).all()

@router_v1.get('/books/{book_id}')
async def get_book(book_id: int, db: Session = Depends(get_db)):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

@router_v1.post('/books')
async def create_book(book: dict, response: Response, db: Session = Depends(get_db)):
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

#=====menu=======

@router_v1.get('/menus')
async def get_menus(db: Session = Depends(get_db)):
    return db.query(models.Menu).all()

@router_v1.get('/menus/{menu_id}')
async def get_menu(menu_id: int, db: Session = Depends(get_db)):
    return db.query(models.Menu).filter(models.Menu.id == menu_id).first()

@router_v1.post('/menus')
async def create_menu(menu: dict, response: Response, db: Session = Depends(get_db)):
    newmenu = models.Menu(
        name=menu['name'], 
        price=menu['price'], 
        description=menu['description']
    )
    db.add(newmenu)
    db.commit()
    db.refresh(newmenu)
    response.status_code = 201
    return newmenu

@router_v1.patch('/menus/{menu_id}')
async def update_menu(menu_id: int, menu: dict, response: Response, db: Session = Depends(get_db)):
    currentmenu = db.query(models.Menu).filter(models.Menu.id == menu_id).first()
    if currentmenu:
        currentmenu.name = menu['name']
        currentmenu.price = menu['price']
        currentmenu.description = menu['description']
        
        db.commit()
        db.refresh(currentmenu)
        response.status_code = 202
        return currentmenu
    else:
        response.status_code = 404
        return {'message': 'menu not found'}

@router_v1.delete('/menus/{menu_id}')
async def delete_menu(menu_id: int, db: Session = Depends(get_db)):
    menu = db.query(models.Menu).filter(models.Menu.id == menu_id).first()
    db.delete(menu)
    db.commit()

#=====customer_order=======
@router_v1.get('/customer_orders')
async def get_customer_orders(db: Session = Depends(get_db)):
    return db.query(models.CustomerOrder).all()

@router_v1.get('/customer_orders/{order_id}')
async def get_customer_order(order_id: int, db: Session = Depends(get_db)):
    return db.query(models.CustomerOrder).filter(models.CustomerOrder.order_id == order_id).first()

@router_v1.post('/customer_orders')
async def create_customer_order(customer_order: dict, response: Response, db: Session = Depends(get_db)):
    neworder = models.CustomerOrder(
        customer_name=customer_order['customer_name'], 
        order_note=customer_order['order_note'], 
        quantity=customer_order['quantity'], 
        total_price=customer_order['total_price']
    )
    db.add(neworder)
    db.commit()
    db.refresh(neworder)
    response.status_code = 201
    return neworder

@router_v1.patch('/customer_orders/{order_id}')
async def update_customer_order(order_id: int, customer_order: dict, response: Response, db: Session = Depends(get_db)):
    currentorder = db.query(models.CustomerOrder).filter(models.CustomerOrder.order_id == order_id).first()
    if currentorder:
        currentorder.customer_name = customer_order['customer_name']
        currentorder.order_note = customer_order['order_note']
        currentorder.quantity = customer_order['quantity']
        currentorder.total_price = customer_order['total_price']
        db.commit()
        db.refresh(currentorder)
        response.status_code = 202
        return currentorder
    else:
        response.status_code = 404
        return {'message': 'order not found'}

@router_v1.delete('/customer_orders/{order_id}')
async def delete_customer_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.CustomerOrder).filter(models.CustomerOrder.order_id == order_id).first()
    db.delete(order)
    db.commit()

app.include_router(router_v1)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
