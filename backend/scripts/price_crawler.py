import requests
from bs4 import BeautifulSoup
import json

def fetch_market_prices(product_name):
    """
    Simple crawler to fetch competitive market prices
    """
    search_url = f"https://example-commerce.com/search?q={product_name}"
    headers = {'User-Agent': 'Mozilla/5.0'}
    
    try:
        response = requests.get(search_url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        prices = []
        for item in soup.select('.product-item'):
            name = item.select_one('.name').text.strip()
            price = int(item.select_one('.price').text.replace(',', '').replace('원', ''))
            prices.append({'name': name, 'price': price})
            
        return sorted(prices, key=lambda x: x['price'])[:5]
    except Exception as e:
        print(f"Crawling Error: {e}")
        return []

if __name__ == "__main__":
    # Example usage for batch scheduler
    print(json.dumps(fetch_market_prices('Smart Widget A')))