from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship

from database import Base

class Book(Base):
    __tablename__ = 'books'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    year = Column(Integer, index=True)
    description = Column(String, index=True)
    prologue = Column(String, index=True)
    type1 = Column(String, index=True)
    type2 = Column(String, index=True)
    type3 = Column(String, index=True)
    type4 = Column(String, index=True)
    is_published = Column(Boolean, index=True)

class Menu(Base):
    __tablename__ = 'menus'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(float, index=True)
    description = Column(String, index=True)

class CustomerOrder(Base):
    __tablename__ = 'customer_orders'

    order_id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, index=True)
    order_note = Column(String, index=True)
    quantity = Column(Integer, index=True)
    total_price = Column(float, index=True)