#!/usr/bin/env python3
"""
Wikipedia Image Fetcher for Accountability Project
Automatically downloads profile images from Wikimedia Commons
"""

import requests
import json
import os
from urllib.parse import quote
import time

# List of all profiles that need images
PROFILES = [
    {"id": "musk", "name": "Elon Musk", "wikipedia": "Elon_Musk"},
    {"id": "trump", "name": "Donald Trump", "wikipedia": "Donald_Trump"},
    {"id": "clinton", "name": "Bill Clinton", "wikipedia": "Bill_Clinton"},
    {"id": "gates", "name": "Bill Gates", "wikipedia": "Bill_Gates"},
    {"id": "prince_andrew", "name": "Prince Andrew", "wikipedia": "Prince_Andrew,_Duke_of_York"},
    {"id": "branson", "name": "Richard Branson", "wikipedia": "Richard_Branson"},
    {"id": "dershowitz", "name": "Alan Dershowitz", "wikipedia": "Alan_Dershowitz"},
    {"id": "wexner", "name": "Leslie Wexner", "wikipedia": "Leslie_Wexner"},
    {"id": "summers", "name": "Larry Summers", "wikipedia": "Lawrence_Summers"},
    {"id": "chomsky", "name": "Noam Chomsky", "wikipedia": "Noam_Chomsky"},
    {"id": "lutnick", "name": "Howard Lutnick", "wikipedia": "Howard_Lutnick"},
    {"id": "barrack", "name": "Tom Barrack", "wikipedia": "Tom_Barrack"},
    {"id": "thiel", "name": "Peter Thiel", "wikipedia": "Peter_Thiel"},
    {"id": "schwarzman", "name": "Steve Schwarzman", "wikipedia": "Stephen_A._Schwarzman"},
    {"id": "ratner", "name": "Brett Ratner", "wikipedia": "Brett_Ratner"},
    {"id": "ferguson", "name": "Sarah Ferguson", "wikipedia": "Sarah,_Duchess_of_York"},
    {"id": "mandelson", "name": "Peter Mandelson", "wikipedia": "Peter_Mandelson"},
    {"id": "mitchell", "name": "George Mitchell", "wikipedia": "George_J._Mitchell"},
    {"id": "ito", "name": "Joi Ito", "wikipedia": "Joi_Ito"},
    {"id": "church", "name": "George Church", "wikipedia": "George_Church_(geneticist)"},
    {"id": "brockman", "name": "John Brockman", "wikipedia": "John_Brockman_(literary_agent)"},
    {"id": "acosta", "name": "Alex Acosta", "wikipedia": "Alex_Acosta"},
    {"id": "dna", "name": "DNA Model", "wikipedia": None},  # No Wikipedia page
    {"id": "karp", "name": "Brad Karp", "wikipedia": None},  # May not have Wikipedia
    {"id": "black", "name": "Leon Black", "wikipedia": "Leon_Black"},
]


def get_wikipedia_image_url(wikipedia_title):
    """
    Fetch the main infobox image from a Wikipedia article
    Returns the direct image URL from Wikimedia Commons
    """
    if not wikipedia_title:
        return None
    
    # Wikipedia API endpoint
    api_url = "https://en.wikipedia.org/w/api.php"
    
    params = {
        "action": "query",
        "titles": wikipedia_title,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": 500,  # Get 500px wide image
    }
    
    try:
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        pages = data.get("query", {}).get("pages", {})
        for page_id, page_data in pages.items():
            if "thumbnail" in page_data:
                return page_data["thumbnail"]["source"]
        
        print(f"⚠️  No image found for {wikipedia_title}")
        return None
        
    except Exception as e:
        print(f"❌ Error fetching {wikipedia_title}: {e}")
        return None


def download_image(url, save_path):
    """Download image from URL and save to path"""
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        
        with open(save_path, 'wb') as f:
            f.write(response.content)
        
        return True
    except Exception as e:
        print(f"❌ Download failed: {e}")
        return False


def main():
    """Main execution"""
    print("=" * 60)
    print("WIKIPEDIA IMAGE FETCHER")
    print("=" * 60)
    print()
    
    # Create output directory
    output_dir = "public/images/profiles"
    os.makedirs(output_dir, exist_ok=True)
    
    results = {
        "success": [],
        "failed": [],
        "no_wikipedia": []
    }
    
    for profile in PROFILES:
        profile_id = profile["id"]
        name = profile["name"]
        wikipedia = profile["wikipedia"]
        
        print(f"Processing: {name}...", end=" ")
        
        if not wikipedia:
            print("⊘ No Wikipedia page")
            results["no_wikipedia"].append(name)
            continue
        
        # Get image URL
        image_url = get_wikipedia_image_url(wikipedia)
        
        if not image_url:
            results["failed"].append(name)
            continue
        
        # Download image
        save_path = os.path.join(output_dir, f"{profile_id}.jpg")
        
        if download_image(image_url, save_path):
            file_size = os.path.getsize(save_path) / 1024  # KB
            print(f"✓ Downloaded ({file_size:.1f} KB)")
            results["success"].append(name)
        else:
            results["failed"].append(name)
        
        # Be nice to Wikipedia's servers
        time.sleep(0.5)
    
    # Print summary
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"✓ Successfully downloaded: {len(results['success'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print(f"⊘ No Wikipedia page: {len(results['no_wikipedia'])}")
    print()
    
    if results['failed']:
        print("Failed downloads:")
        for name in results['failed']:
            print(f"  - {name}")
        print()
    
    if results['no_wikipedia']:
        print("No Wikipedia page (need manual sourcing):")
        for name in results['no_wikipedia']:
            print(f"  - {name}")
        print()
    
    print(f"Images saved to: {output_dir}/")
    print()
    print("Next step: Update App.jsx to use these image paths")
    print()


if __name__ == "__main__":
    main()
