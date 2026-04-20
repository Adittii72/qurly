"""
Shopify Product Scraper Module
Extracts product data from Shopify product pages
"""

import re
from typing import Optional
from bs4 import BeautifulSoup
import requests
from app.schemas import ProductData


class ShopifyURLValidator:
    """Validate if URL is a valid Shopify product URL"""
    
    @staticmethod
    def is_valid_shopify_url(url: str) -> bool:
        """
        Check if URL matches Shopify product URL pattern
        Valid formats:
        - *.myshopify.com/products/*
        - custom-domain.com/products/* (if Shopify-hosted)
        """
        # Check for myshopify.com
        if ".myshopify.com" in url and "/products/" in url:
            return True
        
        # Basic check for /products/ path (could be custom domain)
        if "/products/" in url:
            return True
        
        return False
    
    @staticmethod
    def normalize_url(url: str) -> str:
        """Normalize URL to product page (remove query params, fragments)"""
        # Remove trailing slash
        url = url.rstrip("/")
        # Remove query parameters
        url = url.split("?")[0]
        # Remove fragments
        url = url.split("#")[0]
        # Add .json if not present (for easier data extraction)
        if not url.endswith(".json"):
            url = url + ".json"
        return url


class ShopifyScraper:
    """Scrape Shopify product pages"""
    
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
    
    def scrape_product(self, url: str) -> Optional[ProductData]:
        """
        Scrape product data from Shopify URL
        
        Args:
            url: Shopify product URL
            
        Returns:
            ProductData object or None if scraping fails
        """
        try:
            # Validate URL
            if not ShopifyURLValidator.is_valid_shopify_url(url):
                raise ValueError(f"Invalid Shopify URL: {url}")
            
            # Try JSON API first (more reliable)
            json_url = ShopifyURLValidator.normalize_url(url)
            try:
                product_data = self._scrape_json_api(json_url)
                if product_data:
                    return product_data
            except:
                pass
            
            # Fallback to HTML scraping
            html_url = url.rstrip("/").split(".json")[0]
            product_data = self._scrape_html(html_url)
            return product_data
            
        except Exception as e:
            print(f"Error scraping product: {e}")
            return None
    
    def _scrape_json_api(self, json_url: str) -> Optional[ProductData]:
        """Scrape using Shopify JSON API (most reliable)"""
        try:
            response = requests.get(json_url, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            product = data.get("product", {})
            
            # Extract data
            title = product.get("title", "")
            description = product.get("body_html", "")
            
            # Clean HTML from description
            description = self._clean_html(description)
            
            # Get price from first variant
            variants = product.get("variants", [])
            price = None
            if variants:
                price = variants[0].get("price")
            
            # Count images
            images = product.get("images", [])
            image_count = len(images)
            
            # Check for reviews (Shopify reviews are loaded via JS, so limited data)
            review_count = 0
            average_rating = None
            
            return ProductData(
                title=title,
                description=description,
                price=float(price) if price else None,
                currency="USD",
                image_count=image_count,
                review_count=review_count,
                average_rating=average_rating,
                has_faq=False,  # Would need additional scraping
                has_return_policy=False,  # Would need additional scraping
                has_shipping_policy=False,  # Would need additional scraping
                has_warranty=False,  # Would need additional scraping
            )
        except Exception as e:
            print(f"JSON API scraping failed: {e}")
            return None
    
    def _scrape_html(self, url: str) -> Optional[ProductData]:
        """Fallback: Scrape using HTML parsing"""
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            
            # Extract title
            title_tag = soup.find("h1") or soup.find("meta", {"property": "og:title"})
            title = title_tag.get_text() if title_tag else ""
            if not title and title_tag and title_tag.has_attr("content"):
                title = title_tag["content"]
            
            # Extract description
            desc_tag = soup.find("meta", {"name": "description"}) or soup.find("meta", {"property": "og:description"})
            description = desc_tag.get("content", "") if desc_tag else ""
            
            # Count images
            images = soup.find_all("img", {"class": "product-image"})
            image_count = len(images)
            
            # Check for reviews section
            review_count = 0
            if soup.find("div", {"class": re.compile(".*review.*")}):
                review_count = len(soup.find_all("div", {"class": re.compile(".*review.*")}))
            
            return ProductData(
                title=title or "Unknown",
                description=description or "",
                image_count=image_count,
                review_count=review_count,
                has_faq=False,
                has_return_policy=False,
                has_shipping_policy=False,
                has_warranty=False,
            )
        except Exception as e:
            print(f"HTML scraping failed: {e}")
            return None
    
    @staticmethod
    def _clean_html(html: str) -> str:
        """Remove HTML tags from string"""
        # Remove script and style tags
        html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)
        html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL)
        # Remove HTML tags
        html = re.sub(r"<[^>]+>", "", html)
        # Clean up whitespace
        html = " ".join(html.split())
        return html
