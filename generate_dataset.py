import sqlite3
import random

def gen_aprio():
    # Connect to SQLite database (or create it if it doesn't exist)
    conn = sqlite3.connect('beautique.db')
    cursor = conn.cursor()

    # Create transactions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS association(
        transaction_id INTEGER PRIMARY KEY,
        items TEXT
    )
    ''')

    # Commit changes
    conn.commit()

    # List of items
    items = [
        "Ganni Ruched Ribbon Top", "Anney Resell Bundle", "Amelia Romper", "Anney Perfume 50Ml",
            "Anney Perfume 85Ml", "Anney Perfume Bundle", "Barbara Top", "Racerback",
            "Backless Criscross Top", "Ava Halterneck", "Backless Crisscross Top", "Puffed Sleeves Top",
            "Side Ruched Skirt", "Ruffles Mini Skirt", "Denim Shorts", "Strappy Top Knitted",
            "Barbara Dress", "Beautique Matte Stain", "Ruched Mini Skirt", "Divided Sweatpants",
            "Bustier Dress", "Bustier Tie Top", "Buttondown Tweed Dress", "Cardigan", "Club Crew Neck",
            "Ditsy Floral Skirt", "Divided Hoodie Tank Top", "Embossed Halter Neck Top",
            "Summer Eyelet Coords", "Fairy Dress", "Squareneck Full Length", "High Waist Flare",
            "Floral Fairy Dress", "Front Tie Top", "Kendall Tube Dress", "Kendall Tube Top",
            "Knitted Midi Skirt", "Zara Tweed Coordinates", "Knitted Tube Top", "Lace Padded Corset",
            "Oversized Pullover", "Padded Peplum Top", "Promise Ring", "Plaid Mini Skirt",
            "Straight Cut Trouser Pants", "Backless Romper", "Ruffles Top", "Self Tie Tweed Dress",
            "Floral Maxi Skirt", "Ruched Skirt", "Slit Pencil Skirt", "Squareneck Side Ruched",
            "Strappy Top Bundle", "Ruffles Dress", "Strappy/Ruffles Top (Ivy H)", "Trouser Shorts",
            "Tweed Dress", "Tweed Skirt", "Wave Tube Top", "Woven Wideleg Pants", "Woven Backless Top",
            "Woven Overlap Skirt", "Woven Trouser Shorts", "Zara Puffed Sleeves Tweed Dress"
    ]

    # Specific associations to ensure they co-occur
    associations = [
        [items[0], items[1], items[2]],  # ZARA TWEED COORDINATES, STRAPPY TOP, MIDI SKIRT
        [items[3], items[4]],             # TUBE TOP, BOOB CORSET
        [items[5], items[6]],             # STRAPPY BUNDLE, DITSY FLORAL SKIRT
        [items[7], items[8], items[9]],   # TWEED DRESS COORDS, BUTTONDOWN, RUFFLES MINI SKIRT
        [items[10], items[11]],           # ANNEY PERFUME (JENNY T), TOPS BUNDLES
        # Add more associations as needed
    ]

    # Insert 100 transactions ensuring associations
    for i in range(100):
        # Select either a random association or random items
        if random.random() < 0.7:  # 70% chance to select an association
            transaction_items = random.choice(associations)
        else:
            transaction_items = random.sample(items, random.randint(2, 10))
        
        items_str = ', '.join(transaction_items)
        
        # Insert into database
        cursor.execute('''
        INSERT INTO association (items) VALUES (?)
        ''', (items_str,))
        
    # Commit changes and close connection
    conn.commit()
    conn.close()

    print("100 random transactions with specific associations inserted into apriori_dataset.db")
