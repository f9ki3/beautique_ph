import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

# Sample transaction data
data = {'TransactionID': [1, 1, 1, 2, 2, 3, 3, 3, 3],
        'Item': ['Milk', 'Bread', 'Butter', 'Bread', 'Diapers',
                 'Milk', 'Diapers', 'Beer', 'Cola']}
df = pd.DataFrame(data)

# Create a basket of items
basket = (df.groupby(['TransactionID', 'Item'])['Item']
          .count().unstack().reset_index().fillna(0)
          .set_index('TransactionID'))
basket = basket.applymap(lambda x: 1 if x > 0 else 0)

# Find frequent itemsets
frequent_itemsets = apriori(basket, min_support=0.2, use_colnames=True)

# Generate association rules
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

print(rules)
