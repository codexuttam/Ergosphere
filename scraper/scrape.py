import time
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

def scrape_books(pages=1):
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    books = []
    
    try:
        for page in range(1, pages + 1):
            url = f"http://books.toscrape.com/catalogue/page-{page}.html"
            driver.get(url)
            time.sleep(2)
            
            product_pods = driver.find_elements(By.CLASS_NAME, "product_pod")
            
            for pod in product_pods:
                title = pod.find_element(By.TAG_NAME, "h3").find_element(By.TAG_NAME, "a").get_attribute("title")
                price = pod.find_element(By.CLASS_NAME, "price_color").text
                rating_class = pod.find_element(By.CLASS_NAME, "star-rating").get_attribute("class")
                rating = rating_class.split()[-1]
                book_url = pod.find_element(By.TAG_NAME, "h3").find_element(By.TAG_NAME, "a").get_attribute("href")
                
                image_url = pod.find_element(By.CLASS_NAME, "thumbnail").get_attribute("src")
                
                # Navigate to detail page for more info
                detail_url = book_url
                
                books.append({
                    "title": title,
                    "price": price,
                    "rating": rating,
                    "url": book_url,
                    "image_url": image_url,
                    "detail_url": book_url # Temporary storage to fetch later
                })
            
            # Now fetch details for each book
            for book in books:
                driver.get(book["detail_url"])
                time.sleep(1)
                try:
                    book["description"] = driver.find_element(By.CSS_SELECTOR, "#product_description + p").text
                    book["genre"] = driver.find_element(By.CSS_SELECTOR, ".breadcrumb li:nth-child(3) a").text
                except:
                    book["description"] = "Metadata synthesis incomplete."
                    book["genre"] = "Literature"
                
                del book["detail_url"] # Cleanup
                
        return books
    finally:
        driver.quit()

if __name__ == "__main__":
    results = scrape_books(pages=1)
    print(f"Scraped {len(results)} books.")
    try:
        resp = requests.post("http://localhost:8000/api/books/bulk_upload/", json=results)
        print(f"Server response: {resp.status_code} - {resp.json()}")
    except Exception as e:
        print(f"Failed to upload: {e}")
