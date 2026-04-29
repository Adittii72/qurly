"""
Shopify Product Scraper Module
Extracts product data from Shopify product pages
Includes robust error handling, retries, and fallbacks
"""

import re
import time
from typing import Optional
from bs4 import BeautifulSoup
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from app.schemas import ProductData
from app.config import settings


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
        if not url or not isinstance(url, str):
            return False
        
        # Ensure it has proper structure
        if "/products/" not in url:
            return False
        
        # Must have a valid domain
        try:
            from urllib.parse import urlparse
            parsed = urlparse(url)
            if not parsed.netloc:
                return False
        except:
            return False
        
        # Allow myshopify.com domains
        if ".myshopify.com" in url:
            return True
        
        # Allow custom domains that have /products/ path
        # But be stricter - require proper format
        if "/products/" in url and "." in url:
            return True
        
        return False
    
    @staticmethod
    def normalize_url(url: str) -> str:
        """Normalize URL to product page (remove query params, fragments)"""
        if not url:
            return ""
        
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
    """Scrape Shopify product pages with robust error handling"""
    
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
        }
        self.timeout = settings.scraper_timeout or 10
        self.max_retries = settings.scraper_max_retries or 3
        self.session = self._create_session()
    
    def _create_session(self) -> requests.Session:
        """Create a requests session with retry strategy"""
        session = requests.Session()
        
        # Configure retries with exponential backoff
        retry_strategy = Retry(
            total=self.max_retries,
            backoff_factor=1,  # 1s, 2s, 4s...
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["GET", "HEAD"],
        )
        
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        
        return session
    
    def scrape_product(self, url: str) -> Optional[ProductData]:
        """
        Scrape product data from Shopify URL with fallback strategy
        
        Args:
            url: Shopify product URL
            
        Returns:
            ProductData object or None if scraping fails
        """
        try:
            # Validate URL
            if not ShopifyURLValidator.is_valid_shopify_url(url):
                raise ValueError(
                    f"Invalid Shopify URL. Ensure URL contains '/products/' and is a valid Shopify domain. Provided: {url}"
                )
            
            # Try JSON API first (most reliable for Shopify)
            json_url = ShopifyURLValidator.normalize_url(url)
            if json_url:
                try:
                    product_data = self._scrape_json_api(json_url)
                    if product_data:
                        return product_data
                except requests.exceptions.RequestException as e:
                    if "403" in str(e) or "404" in str(e):
                        print(f"JSON endpoint not accessible (status error), trying HTML fallback: {e}")
                    else:
                        print(f"JSON API scraping failed: {e}")
                except Exception as e:
                    print(f"JSON API error: {e}")
            
            # Fallback to HTML scraping
            html_url = url.rstrip("/").split(".json")[0]
            try:
                product_data = self._scrape_html(html_url)
                if product_data:
                    return product_data
            except Exception as e:
                print(f"HTML scraping also failed: {e}")
            
            # If we get here, both methods failed
            return None
            
        except ValueError as ve:
            # URL validation error - don't retry
            print(f"URL validation error: {ve}")
            return None
        except Exception as e:
            print(f"Error scraping product: {e}")
            return None
    
    def _scrape_json_api(self, json_url: str) -> Optional[ProductData]:
        """
        Scrape using Shopify JSON API (most reliable)
        Handles 403/404 by raising exception
        """
        try:
            response = self.session.get(
                json_url,
                headers=self.headers,
                timeout=self.timeout
            )
            
            # Explicitly handle error status codes
            if response.status_code == 403:
                raise requests.exceptions.RequestException("403 Forbidden - JSON endpoint not accessible")
            elif response.status_code == 404:
                raise requests.exceptions.RequestException("404 Not Found - Product not found")
            elif response.status_code >= 400:
                raise requests.exceptions.RequestException(f"HTTP {response.status_code}")
            
            response.raise_for_status()
            data = response.json()
            
            product = data.get("product", {})
            if not product:
                return None
            
            # Extract data
            title = product.get("title", "").strip()
            description = product.get("body_html", "")
            
            # Clean HTML from description
            description = self._clean_html(description)
            
            # Get price from first variant
            variants = product.get("variants", [])
            price = None
            if variants and len(variants) > 0:
                try:
                    price = float(variants[0].get("price", 0))
                except (ValueError, TypeError):
                    price = None
            
            # Count images
            images = product.get("images", [])
            image_count = len(images) if images else 0
            
            # Extract collection/category if available
            category = None
            collections = product.get("collections", [])
            if collections and len(collections) > 0:
                category = collections[0].get("title", "").strip()
            
            # Check for handle (product slug)
            handle = product.get("handle", "").strip()
            
            return ProductData(
                title=title,
                description=description,
                price=price,
                currency="USD",
                image_count=image_count,
                review_count=0,  # Shopify reviews loaded via JS
                average_rating=None,
                has_faq=False,  # Would need additional scraping
                has_return_policy=False,  # Would need additional scraping
                has_shipping_policy=False,  # Would need additional scraping
                has_warranty=False,  # Would need additional scraping
            )
        except requests.exceptions.Timeout:
            raise requests.exceptions.RequestException("JSON request timed out")
        except requests.exceptions.RequestException as e:
            raise  # Re-raise for parent handler
        except Exception as e:
            print(f"JSON API parsing error: {e}")
            return None
    
    def _scrape_html(self, url: str) -> Optional[ProductData]:
        """
        Fallback: Scrape using HTML parsing
        More resilient when JSON API is blocked
        """
        try:
            response = self.session.get(
                url,
                headers=self.headers,
                timeout=self.timeout
            )
            
            if response.status_code >= 400:
                print(f"HTML request failed with status {response.status_code}")
                return None
            
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            
            # Extract title - try multiple strategies
            title = ""
            
            # Try meta og:title
            title_tag = soup.find("meta", {"property": "og:title"})
            if title_tag and title_tag.has_attr("content"):
                title = title_tag["content"].strip()
            
            # Fallback to h1
            if not title:
                h1_tag = soup.find("h1")
                if h1_tag:
                    title = h1_tag.get_text().strip()
            
            # Extract description
            description = ""
            desc_tag = soup.find("meta", {"property": "og:description"})
            if desc_tag and desc_tag.has_attr("content"):
                description = desc_tag["content"].strip()
            
            if not description:
                desc_tag = soup.find("meta", {"name": "description"})
                if desc_tag and desc_tag.has_attr("content"):
                    description = desc_tag["content"].strip()
            
            # Count images - look for product images
            images = soup.find_all("img", {"class": re.compile(".*product.*", re.IGNORECASE)})
            image_count = len(images) if images else 0
            
            # If no product-specific images, count main images
            if image_count == 0:
                images = soup.find_all("img")
                image_count = len(images) if images else 0
            
            # Check for reviews section
            review_count = 0
            review_section = soup.find(re.compile(".*"), {"class": re.compile(".*review.*", re.IGNORECASE)})
            if review_section:
                review_items = review_section.find_all(re.compile(".*"), {"class": re.compile(".*review.*item.*", re.IGNORECASE)})
                review_count = len(review_items) if review_items else 0
            
            return ProductData(
                title=title or "Product",
                description=description,
                image_count=image_count,
                review_count=review_count,
                has_faq=False,
                has_return_policy=False,
                has_shipping_policy=False,
                has_warranty=False,
            )
        except requests.exceptions.Timeout:
            print(f"HTML request timed out for {url}")
            return None
        except Exception as e:
            print(f"HTML scraping error: {e}")
            return None
    
    @staticmethod
    def _clean_html(html: str) -> str:
        """Remove HTML tags and clean content"""
        if not html:
            return ""
        
        # Remove script and style tags
        html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL | re.IGNORECASE)
        html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove HTML comments
        html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
        
        # Remove HTML tags
        html = re.sub(r"<[^>]+>", "", html)
        
        # Decode HTML entities
        try:
            from html import unescape
            html = unescape(html)
        except ImportError:
            import HTMLParser
            html = HTMLParser.HTMLParser().unescape(html)
        
        # Clean up whitespace
        html = " ".join(html.split())
        
        return html.strip()
