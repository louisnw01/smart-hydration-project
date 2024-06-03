import pandas as pd


df = pd.read_csv('data/issac-dataset.csv')

# age_df = all the rows where age == 23
age_df = df[df["Age"] == 23]

print(age_df["Age"])

# subset = only the data contained within the age and moisture columns
columns_i_want = ['Age', 'Dietary_Moisture']
subset = df[columns_i_want]
print("subset", df)

mapper = {"Dietary_Moisture": "Hydration"}
# rename the dietary moisture column to Hydration, and do it 'inplace' ie modify the current dataframe rather than returning a modified dataframe
subset.rename(columns=mapper, inplace=True)

print(subset)
