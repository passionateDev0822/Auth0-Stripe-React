from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTError
import requests
import stripe
import stripe.error

AUTH0_DOMAIN = 'dev-14esgtg5auxfzaca.us.auth0.com'
#API_AUDIENC = 'https://reactAuth0Stripe.com'
ALGORITHMS = ['RS256']
STRIPE_SECRET_KEY = 'sk_test_51PQbqi08tGGq5KGVlW4AFpjnVhT7BqAgpCAQwBv6C3wPFvQtxOkr7s1rg8biwU8RZyCPjHXnvCIbfr70NZSCPl0u00vF15olgG'

stripe.api_key = STRIPE_SECRET_KEY

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_jwk():
    jwks_url = f'https://{AUTH0_DOMAIN}/.well-known/jwks.json'
    jwks = requests.get(jwks_url).json()
    return jwks

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        jwks = get_jwk()
        unverified_header = jwt.get_unverified_header(token)
        ras_key = {}
        for key in jwks["keys"]:
            rsa_key = {
                "kty" : key["kty"],
                "kid" : key["kid"],
                "use" : key["use"],
                "n" : key["n"],
                "e" : key["e"],
            }
        if ras_key:
            payload = jwt.decode(token, ras_key, algorithms=ALGORITHMS)
            return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invaild token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Unable to parse authentication")
    
    raise HTTPException(status_code=401, detail="Invaild token")

@app.get("/secure-data")
async def secure_data(token: str = Depends(verify_token)):
    return {"message": "This is a secure endpoint", "user": token}

@app.post("/create-payment-intent")
async def create_payment_intent(amount: int, toekn: str = Depends(verify_token)):
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd'
        )
        return {"client_secret": intent["client_secret"]}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)