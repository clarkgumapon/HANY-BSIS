from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from datetime import timedelta
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError

import models
import schemas
import auth
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Add sample products if none exist
def create_sample_products(db: Session = next(get_db())):
    # First, delete all existing products
    db.query(models.Product).delete()
    db.commit()
    
    # Create new sample products
    sample_products = [
        # Clothing
        {
            "name": "Vintage Band T-Shirt",
            "description": "Authentic vintage band t-shirt from the 90s. Slight fading adds to the vintage appeal.",
            "price": 650.0,
            "image_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1528&auto=format&fit=crop",
            "category": "Clothing",
            "stock": 5,
            "seller_id": 1
        },
        {
            "name": "Flannel Shirt",
            "description": "Cozy flannel shirt in red and black plaid. Perfect for layering in cooler weather.",
            "price": 750.0,
            "image_url": "https://images.unsplash.com/photo-1589310243389-96a5483213a8?q=80&w=1374&auto=format&fit=crop",
            "category": "Clothing",
            "stock": 3,
            "seller_id": 1
        },
        {
            "name": "Silk Blouse",
            "description": "Elegant silk blouse in cream color. Perfect for office or evening wear.",
            "price": 899.99,
            "image_url": "https://images.unsplash.com/photo-1551489186-cf8726f514f8?q=80&w=1470&auto=format&fit=crop",
            "category": "Clothing",
            "stock": 2,
            "seller_id": 1
        },
        # Footwear
        {
            "name": "Nike Air Jordan 1",
            "description": "Classic Air Jordan 1 in red and black colorway. Some signs of wear but still in great condition.",
            "price": 4500.0,
            "image_url": "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1470&auto=format&fit=crop",
            "category": "Footwear",
            "stock": 1,
            "seller_id": 1
        },
        {
            "name": "Doc Martens Boots",
            "description": "Iconic Doc Martens boots in black. Broken in but still have years of life left.",
            "price": 3200.0,
            "image_url": "https://images.unsplash.com/photo-1602663491496-73f07481dbea?q=80&w=1374&auto=format&fit=crop",
            "category": "Footwear",
            "stock": 2,
            "seller_id": 1
        },
        {
            "name": "Vans Old Skool",
            "description": "Classic Vans Old Skool in black and white. Barely worn, excellent condition.",
            "price": 1800.0,
            "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1396&auto=format&fit=crop",
            "category": "Footwear",
            "stock": 4,
            "seller_id": 1
        },
        # Accessories
        {
            "name": "Vintage Casio Watch",
            "description": "Classic Casio digital watch. New battery installed, works perfectly.",
            "price": 1200.0,
            "image_url": "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=1374&auto=format&fit=crop",
            "category": "Accessories",
            "stock": 1,
            "seller_id": 1
        },
        {
            "name": "Ray-Ban Sunglasses",
            "description": "Authentic Ray-Ban Wayfarer sunglasses with case. Minor scratches on the case only.",
            "price": 2500.0,
            "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1480&auto=format&fit=crop",
            "category": "Accessories",
            "stock": 2,
            "seller_id": 1
        },
        {
            "name": "Leather Belt",
            "description": "Genuine leather belt in brown. Barely used, excellent condition.",
            "price": 850.0,
            "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1374&auto=format&fit=crop",
            "category": "Accessories",
            "stock": 3,
            "seller_id": 1
        },
        # Outerwear
        {
            "name": "North Face Jacket",
            "description": "Waterproof North Face jacket in navy blue. Perfect for hiking or rainy days.",
            "price": 3800.0,
            "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1472&auto=format&fit=crop",
            "category": "Outerwear",
            "stock": 2,
            "seller_id": 1
        },
        {
            "name": "Vintage Denim Jacket",
            "description": "Classic vintage denim jacket with slight distressing. Authentic 90s style.",
            "price": 1299.99,
            "image_url": "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1469&auto=format&fit=crop",
            "category": "Outerwear",
            "stock": 3,
            "seller_id": 1
        },
        {
            "name": "Wool Peacoat",
            "description": "Elegant wool peacoat in charcoal gray. Perfect for formal occasions in colder weather.",
            "price": 2800.0,
            "image_url": "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1374&auto=format&fit=crop",
            "category": "Outerwear",
            "stock": 1,
            "seller_id": 1
        },
        # Bottoms
        {
            "name": "Levi's 501 Jeans",
            "description": "Classic Levi's 501 jeans in dark wash. Barely worn, excellent condition.",
            "price": 1250.0,
            "image_url": "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1374&auto=format&fit=crop",
            "category": "Bottoms",
            "stock": 4,
            "seller_id": 1
        },
        {
            "name": "Cargo Pants",
            "description": "Versatile cargo pants in olive green. Multiple pockets for practicality.",
            "price": 950.0,
            "image_url": "https://images.unsplash.com/photo-1584865288642-42078afe6942?q=80&w=1470&auto=format&fit=crop",
            "category": "Bottoms",
            "stock": 5,
            "seller_id": 1
        },
        {
            "name": "Pleated Skirt",
            "description": "Elegant pleated skirt in navy blue. Perfect for office or school wear.",
            "price": 780.0,
            "image_url": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1374&auto=format&fit=crop",
            "category": "Bottoms",
            "stock": 3,
            "seller_id": 1
        },
        # Headwear
        {
            "name": "Vintage Baseball Cap",
            "description": "Classic baseball cap with vintage sports team logo. Adjustable strap for perfect fit.",
            "price": 550.0,
            "image_url": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1376&auto=format&fit=crop",
            "category": "Headwear",
            "stock": 6,
            "seller_id": 1
        },
        {
            "name": "Wool Beanie",
            "description": "Soft wool beanie in charcoal gray. Warm and comfortable for winter.",
            "price": 450.0,
            "image_url": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1374&auto=format&fit=crop",
            "category": "Headwear",
            "stock": 8,
            "seller_id": 1
        },
        {
            "name": "Bucket Hat",
            "description": "Trendy bucket hat in beige. Perfect for summer days or festival season.",
            "price": 650.0,
            "image_url": "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=1470&auto=format&fit=crop",
            "category": "Headwear",
            "stock": 4,
            "seller_id": 1
        }
    ]
    
    for product_data in sample_products:
        db_product = models.Product(**product_data)
        db.add(db_product)
    
    db.commit()

create_sample_products()

app = FastAPI(title="HanyThrift API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3002"],  # Your Next.js frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/health-check")
def health_check():
    return {"status": "ok"}

# Authentication routes
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token with extended expiration
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Create refresh token
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": user.id,
        "user_email": user.email,
        "user_name": user.name,
        "is_active": user.is_active,
        "is_seller": user.is_seller
    }

@app.post("/token/refresh", response_model=schemas.Token)
async def refresh_token(
    refresh_data: schemas.RefreshToken,
    db: Session = Depends(get_db)
):
    try:
        # Verify refresh token
        payload = jwt.decode(refresh_data.refresh_token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        if not payload.get("refresh"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        email = payload.get("sub")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        # Get user
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        
        # Create new refresh token
        new_refresh_token = auth.create_refresh_token(data={"sub": email})
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "user_id": user.id,
            "user_email": user.email,
            "user_name": user.name,
            "is_active": user.is_active,
            "is_seller": user.is_seller
        }
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Product routes
@app.get("/products/", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = db.query(models.Product).offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    try:
        product = db.query(models.Product).filter(models.Product.id == product_id).first()
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {product_id} not found"
            )
        return product
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching product: {str(e)}"
        )

@app.post("/products/", response_model=schemas.Product)
def create_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    if not current_user.is_seller:
        raise HTTPException(status_code=403, detail="Not authorized to create products")
    db_product = models.Product(**product.dict(), seller_id=current_user.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Cart routes
@app.get("/cart/", response_model=List[schemas.CartItem])
def read_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    cart_items = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))  # Explicitly load product relationship
        .filter(models.CartItem.user_id == current_user.id)
        .all()
    )
    return cart_items

@app.post("/cart/", response_model=schemas.CartItem)
def add_to_cart(
    cart_item: schemas.CartItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Check if product exists
    product = db.query(models.Product).filter(models.Product.id == cart_item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if item already in cart
    existing_item = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))  # Explicitly load product relationship
        .filter(
            models.CartItem.user_id == current_user.id,
            models.CartItem.product_id == cart_item.product_id
        )
        .first()
    )
    
    if existing_item:
        # Update quantity if item exists
        existing_item.quantity += cart_item.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    # Create new cart item
    db_cart_item = models.CartItem(**cart_item.dict(), user_id=current_user.id)
    db.add(db_cart_item)
    db.commit()
    db.refresh(db_cart_item)
    
    # Reload the cart item with product relationship
    db_cart_item = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))  # Explicitly load product relationship
        .filter(models.CartItem.id == db_cart_item.id)
        .first()
    )
    return db_cart_item

@app.put("/cart/{cart_item_id}", response_model=schemas.CartItem)
def update_cart_item(
    cart_item_id: int,
    update_data: schemas.CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    cart_item = (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))  # Explicitly load product relationship
        .filter(
            models.CartItem.id == cart_item_id,
            models.CartItem.user_id == current_user.id
        )
        .first()
    )
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    cart_item.quantity = update_data.quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

@app.delete("/cart/{cart_item_id}", status_code=204)
def remove_from_cart(
    cart_item_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.id == cart_item_id,
        models.CartItem.user_id == current_user.id
    ).first()
    
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(cart_item)
    db.commit()
    return None

# Order routes
@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@app.post("/orders/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    # Create order
    db_order = models.Order(
        user_id=current_user.id,
        total_amount=order.total_amount,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order.items:
        db_order_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time=db.query(models.Product).filter(models.Product.id == item.product_id).first().price
        )
        db.add(db_order_item)
    
    db.commit()
    return db_order 