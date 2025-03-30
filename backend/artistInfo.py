import os
import json
import pymongo
from pymongo import MongoClient
import requests
from datetime import datetime
from dateutil.parser import parse as parse_date

def load_config():
    """
    Load configuration from backend/config.json.
    """
    config_path = os.path.join("backend", "config.json")
    with open(config_path, "r") as f:
        config = json.load(f)
    return config

def get_spotify_token(client_id, client_secret):
    """
    Obtains a Spotify access token using the Client Credentials Flow.
    This version passes the credentials in the POST body with the required content type,
    similar to the following cURL command:
    
    curl -X POST "https://accounts.spotify.com/api/token" \
         -H "Content-Type: application/x-www-form-urlencoded" \
         -d "grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret"
    """
    auth_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret
    }
    response = requests.post(auth_url, headers=headers, data=data)
    print("Status Code:", response.status_code)
    print("Response Text:", response.text)
    response.raise_for_status()
    token = response.json().get("access_token")
    return token

def search_artist(artist_name, token):
    """
    Search for an artist by name using Spotify's search API.
    Returns the first artist item or None.
    """
    search_url = "https://api.spotify.com/v1/search"
    params = {"q": artist_name, "type": "artist", "limit": 1}
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(search_url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Error searching for artist {artist_name}: {response.status_code}")
        return None
    results = response.json().get("artists", {}).get("items", [])
    if results:
        return results[0]
    return None

def get_artist_albums(spotify_id, token):
    """
    Get artist albums (albums and singles) from Spotify.
    Returns a list of album items.
    """
    albums_url = f"https://api.spotify.com/v1/artists/{spotify_id}/albums"
    params = {
        "include_groups": "album,single",
        "market": "US",
        "limit": 50
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(albums_url, headers=headers, params=params)
    if response.status_code != 200:
        print(f"Error fetching albums for {spotify_id}: {response.status_code}")
        return []
    return response.json().get("items", [])

def sort_albums_by_release_date(albums):
    """
    Sort the list of album items by release_date descending.
    The release_date can be in various formats so we try to parse it.
    """
    def album_date(album):
        try:
            return parse_date(album.get("release_date"))
        except Exception:
            return datetime.min
    return sorted(albums, key=album_date, reverse=True)

def get_album_tracks(album_id, token):
    """
    Get tracks for a given album by album_id.
    Returns a list of track names.
    """
    tracks_url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(tracks_url, headers=headers)
    if response.status_code != 200:
        print(f"Error fetching tracks for album {album_id}: {response.status_code}")
        return []
    items = response.json().get("items", [])
    return [track.get("name") for track in items]

def update_artist_document(collection, artist_doc, update_fields):
    """
    Update the given artist document with the new fields.
    """
    collection.update_one({"_id": artist_doc["_id"]}, {"$set": update_fields})

def main():
    config = load_config()
    db_uri = config.get("connectionString")
    spotify_client_id = config.get("client_id")
    spotify_client_secret = config.get("client_secret")
    
    if not (db_uri and spotify_client_id and spotify_client_secret):
        print("Missing configuration values.")
        return
    
    client = MongoClient(db_uri)
    db = client["Artists"]
    collection = db["ArtistsInfo"]
    
    token = get_spotify_token(spotify_client_id, spotify_client_secret)
    
    artists = collection.find({})
    for doc in artists:
        artist_name = doc.get("Artist")
        print(f"Processing artist: {artist_name}")
        
        artist_data = search_artist(artist_name, token)
        if not artist_data:
            print(f"Could not find Spotify data for {artist_name}")
            continue
        
        spotify_id = artist_data.get("id")
        images = artist_data.get("images", [])
        artist_image = images[0]["url"] if images else None
        
        albums = get_artist_albums(spotify_id, token)
        sorted_albums = sort_albums_by_release_date(albums)

        album_list = []
        for album in sorted_albums:
            album_list.append({
                "name": album.get("name"),
                "release_date": album.get("release_date"),
                "album_image": album.get("images", [{}])[0].get("url")
            })
        
        latest_songs = []
        if sorted_albums:
            latest_album = sorted_albums[0]
            latest_songs = get_album_tracks(latest_album.get("id"), token)
        
        update_fields = {
            "artist_image": artist_image,
            "albums": album_list,
            "latest_songs": latest_songs
        }
        
        update_artist_document(collection, doc, update_fields)
        print(f"Updated {artist_name} with image, {len(album_list)} albums, and {len(latest_songs)} latest songs.")
    
    print("Finished updating all artist documents.")

if __name__ == "__main__":
    main()
