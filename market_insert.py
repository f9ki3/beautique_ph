import sqlite3
import random

def insertAssoc():
    # List of products (this could be fetched from the database if needed)
    products = [
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

    # Define common product pairs (could also be fetched from the database if needed)
    common_pairs = [
        ("Knitted Midi Skirt", "Knitted Tube Top"),
        ("Anney Perfume 50Ml", "Anney Perfume 85Ml"),
        ("Side Ruched Skirt", "Ruffles Mini Skirt"),
        ("Barbara Dress", "Bustier Tie Top"),
        ("Tweed Dress", "Tweed Skirt")
    ]

    # Create a connection to the database
    conn = sqlite3.connect('beautique.db')
    cursor = conn.cursor()

    # Create the table 'association' if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS association (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        items TEXT NOT NULL
    )
    ''')

    # Insert 500 records with a random number of products, ensuring 2 randomized associated products
    for _ in range(500):
        basket_size = random.randint(3, 50)  # Random number of products in the basket (at least 3 for diversity)
        
        # Shuffle the common pairs to randomize their order and choose 2 pairs
        selected_pairs = random.sample(common_pairs, 2)  # Choose 2 random pairs
        
        selected_products = []
        for pair in selected_pairs:
            selected_products.extend(pair)  # Add both items from the selected pair

        # Add additional random products to the basket (avoiding duplicates)
        while len(selected_products) < basket_size:
            product = random.choice(products)
            if product not in selected_products:
                selected_products.append(product)
        
        # Shuffle the basket to randomize the order of products
        random.shuffle(selected_products)
        
        # Convert the basket to a string
        basket = ", ".join(selected_products)

        # Insert the basket into the database
        cursor.execute('''
        INSERT INTO association (items) 
        VALUES (?)
        ''', (basket,))

    # Commit the changes and close the connection
    conn.commit()
    conn.close()

    print("500 records have been inserted into beautique.db with random product baskets and randomized common pairs.")

insertAssoc()
