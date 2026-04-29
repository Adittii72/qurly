"""
Configuration Management for Qurly Backend
Handles environment variables and app configuration
"""

from pydantic_settings import BaseSettings
from pydantic import ConfigDict, Field
from typing import Optional, List

class Settings(BaseSettings):
    """Application settings from environment variables"""
    
    model_config = ConfigDict(
        protected_namespaces=('settings_',),
        env_file=".env",
        case_sensitive=False,
    )
    
    # Environment
    environment: str = Field(default="development")
    debug: bool = Field(default=True)
    
    # API
    api_title: str = "Qurly API"
    api_version: str = "1.0.0"
    api_description: str = "AI Representation Optimizer for Shopify Products"
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    reload: bool = False
    
    # Security
    secret_key: str = Field(default="dev-secret-key-change-in-prod-min-32-characters")
    
    # CORS - Production domains
    frontend_url: str = Field(default="http://localhost:3000")
    backend_url: str = Field(default="http://localhost:8000")
    cors_enabled: bool = True
    cors_credentials: bool = True
    
    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 60  # seconds
    
    # Scraping
    scraper_timeout: int = 15
    scraper_max_retries: int = 3
    scraper_user_agent: str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    
    # AI/ML
    gemini_api_key: Optional[str] = Field(default=None)
    ai_model_name: str = Field(default="gemini-1.5-flash")
    gemini_max_retries: int = 3
    gemini_timeout: int = 30
    
    # Cache
    cache_enabled: bool = True
    cache_ttl: int = 3600  # 1 hour
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    # Features
    enable_analytics: bool = True
    enable_rewrite_feature: bool = True
    enable_user_accounts: bool = True
    enable_historical_tracking: bool = True
    enable_advanced_nlp: bool = True
    enable_pdf_export: bool = True
    enable_multi_product_comparison: bool = True
    enable_ai_readiness_checklist: bool = True
    
    # Database
    database_url: Optional[str] = Field(default="sqlite:///./qurly.db")
    
    # Authentication
    google_oauth_client_id: Optional[str] = Field(default=None)
    google_oauth_client_secret: Optional[str] = Field(default=None)
    jwt_secret_key: str = Field(default="dev-jwt-secret-key-change-in-prod-min-32-chars")
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 168  # 7 days
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS allowed origins based on environment"""
        origins = [
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "http://localhost:8000",
            "http://127.0.0.1:8000",
        ]
        
        # Add production URLs if configured
        if self.frontend_url and not self.frontend_url.startswith("http://localhost"):
            origins.append(self.frontend_url)
        
        if self.backend_url and not self.backend_url.startswith("http://localhost"):
            origins.append(self.backend_url)
        
        # Add production Render/Hostinger domains
        if self.environment == "production":
            # Frontend on Hostinger (cPanel)
            if "hostinger" in self.frontend_url.lower() or ".com" in self.frontend_url:
                origins.append(self.frontend_url)
            # Backend on Render
            if "render" in self.backend_url.lower() or "onrender.com" in self.backend_url:
                origins.append(self.backend_url)
        
        return list(set(origins))  # Remove duplicates

# Global settings instance
settings = Settings()

# Legacy constant for backwards compatibility
ALLOWED_ORIGINS = settings.get_cors_origins()

