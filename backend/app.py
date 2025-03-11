from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
from routes import auth, videos, users, awards, analytics

# Create the FastAPI app
app = FastAPI(title="Vidora API", description="Backend API for Vidora video streaming platform")

# Configure CORS
origins = [
    "http://localhost:3000",  # Frontend development server
    "https://vidorafilms.com",
    "https://www.vidorafilms.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(videos.router, prefix="/api/videos", tags=["Videos"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(awards.router, prefix="/api/awards", tags=["Awards"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/api/health")
def health_check():
    """Health check endpoint for the API"""
    return {"status": "healthy", "version": "0.1.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)