import sqlite3
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules

# Connect to SQLite database and fetch transaction data
conn = sqlite3.connect('beautique.db')
cursor = conn.cursor()
cursor.execute("SELECT items FROM association")
transactions = cursor.fetchall()
conn.close()

# Convert transaction data to list of lists
transaction_list = [transaction[0].split(', ') for transaction in transactions]

# Print transaction data for debugging
print("Transaction Data:")
print(transaction_list)

# Check if transaction_list is non-empty
if not transaction_list:
    print("No transactions found in the dataset. Ensure the database contains transaction data.")
else:
    # Transaction encoding
    te = TransactionEncoder()
    te_data = te.fit(transaction_list).transform(transaction_list)
    df = pd.DataFrame(te_data, columns=te.columns_)

    # Print encoded DataFrame for debugging
    print("\nEncoded DataFrame:")
    print(df.head())

    # Apply Apriori algorithm to find frequent itemsets with min support of 0.1
    frequent_itemsets = apriori(df, min_support=0.1, use_colnames=True)

    # Check if any frequent itemsets were found
    if frequent_itemsets.empty:
        print("No frequent itemsets found. Try lowering the min_support or verify the data.")
    else:
        # Print frequent itemsets for debugging
        print("\nFrequent Itemsets:")
        print(frequent_itemsets)

        # Generate association rules with confidence and lift
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.5)

        # Check if any association rules were generated
        if rules.empty:
            print("No association rules generated. Try lowering the confidence threshold or checking data quality.")
        else:
            # Sort and display rules
            rules_sorted_lift_desc = rules.sort_values(by='lift', ascending=False)
            rules_sorted_support_asc = rules.sort_values(by='support', ascending=True)

            print("\nAssociation Rules (Sorted by Lift Descending):")
            print(rules_sorted_lift_desc[['antecedents', 'consequents', 'support', 'confidence', 'lift']])

            print("\nAssociation Rules (Sorted by Support Ascending):")
            print(rules_sorted_support_asc[['antecedents', 'consequents', 'support', 'confidence', 'lift']])
