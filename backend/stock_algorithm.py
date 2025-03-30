import os
import json
import pymongo
from pymongo import MongoClient
from datetime import datetime
from dateutil.relativedelta import relativedelta
import re

def load_config():
    """
    Load configuration from backend/config.json.
    """
    base_path = os.path.dirname(__file__)
    config_path = os.path.join(base_path, "config.json")
    with open(config_path, "r") as f:
        config = json.load(f)
    return config

def compute_stock_prices_array(doc):
    """
    Compute an array of [month, stock price] pairs for an artist.
    
    The initial stock price is based on the artist's Followers:
        base_price = Followers / SCALING_FACTOR_FOLLOWERS
    
    For each month (extracted from keys in "Mon-YYYY" format),
    the stock price is computed as:
        price = base_price * (1 + percent_change * volatility_factor)
    where:
        percent_change = (current_listeners - previous_listeners) / previous_listeners
        
    Returns an array of two-element arrays in the order of the months.
    """
    followers = doc.get("Followers", 0)
    SCALING_FACTOR_FOLLOWERS = 1_000_000
    base_price = followers / SCALING_FACTOR_FOLLOWERS
    volatility_factor = 0.5

    month_pattern = re.compile(r"^[A-Z][a-z]{2}-\d{4}$")
    month_keys = [key for key in doc.keys() if month_pattern.match(key)]
    
    month_keys.sort(key=lambda x: datetime.strptime(x, "%b-%Y"))

    stock_prices = []
    if not month_keys:
        return stock_prices

    stock_prices.append([month_keys[0], base_price])

    for i in range(1, len(month_keys)):
        prev_key = month_keys[i - 1]
        current_key = month_keys[i]
        prev_listeners = doc.get(prev_key, 0)
        current_listeners = doc.get(current_key, 0)
        if not prev_listeners or prev_listeners == 0:
            percent_change = 0
        else:
            percent_change = (current_listeners - prev_listeners) / prev_listeners
        price = base_price * (1 + percent_change * volatility_factor)
        stock_prices.append([current_key, price])
    
    return stock_prices

def main():
    config = load_config()
    uri = config.get("connectionString")
    
    if not uri:
        print("Database URI not found in config.")
        return

    client = MongoClient(uri)
    db = client["Artists"]
    collection = db["ArtistsInfo"]

    print("Computing stock prices array for each artist...")
    
    artists = collection.find({})
    for artist in artists:
        artist_name = artist.get("Artist", "Unknown Artist")
        stock_prices_array = compute_stock_prices_array(artist)
        if stock_prices_array:
            formatted = ", ".join(f"{month}: {price:.2f}" for month, price in stock_prices_array)
            print(f"Artist: {artist_name} - Stock Prices: {formatted}")
            collection.update_one({"_id": artist["_id"]}, {"$set": {"stock_prices": stock_prices_array}})
        else:
            print(f"Artist: {artist_name} - No month data available.")
    
if __name__ == "__main__":
    main()
