import os
import json
import pymongo
from pymongo import MongoClient
from datetime import datetime
from dateutil.relativedelta import relativedelta

def load_config():
    """
    Load configuration from backend/config.json.
    """
    config_path = os.path.join("backend", "config.json")
    with open(config_path, "r") as f:
        config = json.load(f)
    return config

def get_previous_month_mmm_yyyy(date_str):
    """
    Given a date string in "Mon-YYYY" format (e.g., "Mar-2025"),
    return the previous month in the same format (e.g., "Feb-2025").
    """
    dt = datetime.strptime(date_str, "%b-%Y")
    prev_dt = dt - relativedelta(months=1)
    return prev_dt.strftime("%b-%Y")

def compute_stock_price(doc, target_month, previous_month):
    """
    Base price is determined by the Followers count:
        base_price = Followers / SCALING_FACTOR_FOLLOWERS
    Then, if monthly listener data is available for the target month and the previous month,
    adjust the price based on the percentage change in monthly listeners.
    
    Parameters:
      doc: Dictionary for the artist document.
      target_month: String in "Mon-YYYY" format (e.g., "Mar-2025").
      previous_month: Previous month in the same format.
    
    Returns:
      New stock price (float) or None if required data is missing.
    """
    followers = doc.get("Followers", 0)
    current_listeners = doc.get(target_month)
    prev_listeners = doc.get(previous_month)
    
    SCALING_FACTOR_FOLLOWERS = 1_000_000
    base_price = followers / SCALING_FACTOR_FOLLOWERS
    
    if current_listeners is None:
        print(f"Missing monthly listeners data for {target_month} for artist {doc.get('Artist', 'Unknown')}.")
        return None
    
    if not prev_listeners or prev_listeners == 0:
        percent_change = 0
    else:
        percent_change = (current_listeners - prev_listeners) / prev_listeners
    
    volatility_factor = 0.5 
    new_stock_price = base_price * (1 + percent_change * volatility_factor)
    return new_stock_price

def main():
    config = load_config()
    uri = config.get("connectionString")
    
    if not uri:
        print("Database URI not found in config.")
        return
    
    client = MongoClient(uri)
    db = client["Artists"]
    collection = db["ArtistsInfo"]
    
    target_month = "Mar-2025"
    previous_month = get_previous_month_mmm_yyyy(target_month)
    print(f"Computing stock prices for target month {target_month} (previous month: {previous_month})")
    
    artists = collection.find({})
    for artist in artists:
        artist_name = artist.get("Artist", "Unknown Artist")
        stock_price = compute_stock_price(artist, target_month, previous_month)
        if stock_price is not None:
            print(f"Artist: {artist_name} - Stock Price for {target_month}: {stock_price:.2f}")
        else:
            print(f"Artist: {artist_name} - Insufficient data for {target_month}")

if __name__ == "__main__":
    main()
