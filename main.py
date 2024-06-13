from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTError
import requests
import stripe
import stripe.error
import requests

AUTH0_DOMAIN = 'dev-14esgtg5auxfzaca.us.auth0.com'
#API_AUDIENC = 'https://reactAuth0Stripe.com'
ALGORITHMS = ['RS256']
STRIPE_SECRET_KEY = 'sk_test_51PQbqi08tGGq5KGVlW4AFpjnVhT7BqAgpCAQwBv6C3wPFvQtxOkr7s1rg8biwU8RZyCPjHXnvCIbfr70NZSCPl0u00vF15olgG'

stripe.api_key = STRIPE_SECRET_KEY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products")
async def get_products():
    try:
        products = stripe.Product.list()
        product_data = []
        
        for product in products['data']:
            # Ensure to retrieve a recurring price
            prices = stripe.Price.list(product=product['id'], type='recurring')
            if prices.data:
                price = prices.data[0]
                product_info = {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'images': product.images,
                    'price_id': price.id,
                    'price': price.unit_amount,  # Price in cents
                    'currency': price.currency,
                }
                product_data.append(product_info)

        return product_data
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    price_id = data.get('price_id')
    print('Received price ID:', price_id)  # Debugging line

    if not price_id:
        raise HTTPException(status_code=400, detail="Price ID not provided")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
        )
        return {"id": session.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)