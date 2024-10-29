import sqlite3
import random

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
    "ZARA TWEED COORDINATES (SKIRT & SHORTS TERNO) - NEW COLORS",
    "ZARA STRAPPY TOP KNITTED",
    "ZARA KNITTED MIDI SKIRT (WITH & WITHOUT SLIT)",
    "ZARA KNITTED TUBE TOP",
    "ZARA LACE PADDED BOOB CORSET",
    "10 PCS ZARA STRAPPY BUNDLE (RANDOM COLORS/FREESIZE)",
    "DITSY FLORAL SKIRT 21-35” waistline",
    "TWEED COORDS/DRESS CHECKOUT",
    "ZARA BUTTONDOWN TWEED DRESS",
    "SHEIN RUFFLES MINI SKIRT",
    "ANNEY PERFUME (JENNY T)",
    "TOPS BUNDLES (MILL VENZ G)",
    "KENDALL KNITTED TUBE TOP",
    "EMBOSSED HALTER NECK TOP",
    "AVA HALTER NECK TOP || beautique.ph",
    "ELEGANT PROMISE RING WITH BOX & PAPER BAG",
    "PLAIN MIDI SKIRT 22-30 INCHES (WITH & WITHOUT SLIT)",
    "LACOSTE PASTEL WATCH WITH BOX & PAPERBAG",
    "SKIRT LINK (BELL EZZA RMS)",
    "BARBARA RUFFLE SLEEVES TOP BARK CREPE FABRIC",
    "GANNI DUPE RUCHED RIBBON TOP || beautique.ph",
    "PRA RING COMPLETE INCLUSION",
    "ASSORTED PURE TWEED COLLECTION",
    "SUMMER COORDS & ROMPER",
    "ROMPER & FLARE PANTS",
    "ASSORTED ITEMS BUNDLE",
    "KENDALL KOREAN KNITTED TUBE DRESS",
    "WOVEN TUBE (CHELLE F)",
    "AMELIA OVERLAP TUBE ROMPER || beautique.ph",
    "PLUS SIZE MIDI SKIRT 28-40 INCHES (WITH & WITHOUT SLIT)",
    "KNITTED SKIRT (MARIA GALZ)",
    "TWEED SKORT 22-30 INCHES WAISTLINE",
    "50ML RESELLER PACKAGE ANNEY PERFUME",
    "ANNEY 85ML GLASS BOTTLE PERFUME",
    "ANNEY PERFUME 50ML SPRAY BOTTLE",
    "ANNEY PERFUME 115ML DAKS SIZE RESELLER BUNDLE",
    "PRA SET (WELLA MONTEFALCON)",
    "BARBARA TOP",
    "PRA COMPLETE SET",
    "Premium Assorted Tops",
    "BARBARA DRESS",
    "CARGO SKIRT/TWEED COORDS",
    "EMBOSSED TUBE/DRESS",
    "85ML ANNEY PERFUME RESELLER PACKAGE",
    "BRANDED OVERRUNS CHECKOUT FOR RESELLERS ONLY",
    "1 ML ANNEY PERFUME TESTER",
    "ANNEY PERFUME BUNDLE BUYER",
    "PADDED PEPLUM RUFFLES TOP",
    "BUTTERFLY COORDS (FRYNCESS JOYCE)",
    "TROUSER PANTS",
    "WOVEN BACKLESS",
    "HIGH WAISTED KNITTED FLARE PANTS",
    "PANDORA ELEGANT PROMISE RING WITH BOX & PAPER BAG"
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
