import sqlite3
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import json
from sklearn.model_selection import train_test_split

def fetch_transactions(query):
    # Connect to SQLite database and fetch transaction data
    conn = sqlite3.connect('beautique.db')
    cursor = conn.cursor()
    cursor.execute(query)
    transactions = cursor.fetchall()
    conn.close()
    return [transaction[0].split(', ') for transaction in transactions]

def generate_association_rules(transaction_list):
    if not transaction_list:
        return pd.DataFrame({"message": ["No transactions found in the dataset. Ensure the database contains transaction data."]})

    # Transaction encoding
    te = TransactionEncoder()
    te_data = te.fit(transaction_list).transform(transaction_list)
    df = pd.DataFrame(te_data, columns=te.columns_)

    # Apply Apriori algorithm to find frequent itemsets with min support of 0.1
    frequent_itemsets = apriori(df, min_support=0.1, use_colnames=True)

    # Check if any frequent itemsets were found
    if frequent_itemsets.empty:
        return pd.DataFrame({"message": ["No frequent itemsets found. Try lowering the min_support or verify the data."]})

    # Generate association rules with confidence and lift
    rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

    # Check if any association rules were generated
    if rules.empty:
        return pd.DataFrame({"message": ["No association rules generated. Try lowering the confidence threshold or checking data quality."]})

    # Convert rules to a DataFrame, limiting to first 30 rules
    rules_df = rules.head(30).copy()
    rules_df['antecedents'] = rules_df['antecedents'].apply(lambda x: ', '.join(list(x)))
    rules_df['consequents'] = rules_df['consequents'].apply(lambda x: ', '.join(list(x)))

    # Return a DataFrame with the relevant columns
    return rules_df[['antecedents', 'consequents', 'support', 'confidence', 'lift']]

def get_aprio_shope():
    transactions = fetch_transactions("SELECT items FROM association")
    train_transactions, test_transactions = train_test_split(transactions, test_size=0.2, random_state=42)
    
    print("Training Transactions (Shopee):", len(train_transactions))
    print("Testing Transactions (Shopee):", len(test_transactions))

    train_rules = generate_association_rules(train_transactions)
    test_rules = generate_association_rules(test_transactions)

    return train_rules, test_rules

def get_aprio_store():
    transactions = fetch_transactions("SELECT items FROM association_store")
    train_transactions, test_transactions = train_test_split(transactions, test_size=0.2, random_state=42)

    print("Training Transactions (Store):", len(train_transactions))
    print("Testing Transactions (Store):", len(test_transactions))

    train_rules = generate_association_rules(train_transactions)
    test_rules = generate_association_rules(test_transactions)

    return train_rules, test_rules

if __name__ == "__main__":
    # Example usage
    shope_train_rules, shope_test_rules = get_aprio_shope()
    store_train_rules, store_test_rules = get_aprio_store()

    # Display the rules in a tabular format
    print("Shopee Training Association Rules:")
    print(shope_train_rules)

    print("\nShopee Testing Association Rules:")
    print(shope_test_rules)

    print("\nStore Training Association Rules:")
    print(store_train_rules)

    print("\nStore Testing Association Rules:")
    print(store_test_rules)
