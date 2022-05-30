#from datetime import datetime, timezone
import pandas as pd
#from pandas.io.json import json_normalize
#import requests
#import feedparser
#from bs4 import BeautifulSoup
import spacy
import string
import json
from parse_article import parse_article
import re
from collections import Counter

#read file
with open("googleNews.json", encoding="utf8") as myfile:

    json_object = json.load(myfile)
    nlp = spacy.load('es_core_news_sm')
    nlp.max_length = 1920000

    output = ""
    str_list = ["CHINA", "ITALIA", "ARGENTINA", "ESTADOS UNIDOS", "ESPAÑA", "ALBERTO FERNÁNDEZ", "EUROPA", "FRANCIA", "EEUU",
                "NUEVA YORK", "ALEMANIA", "COREA DEL SUR", "BRASIL", "OMS", "MINISTERIO DE SALUD", "WUHAN",
                "CIUDAD DE BUENOS AIRES", "PROVINCIA DE BUENOS AIRES", "CHILE"]

    #ners = ['PER', 'ORG', 'LOC']
    df = pd.DataFrame(columns=['entity', 'pubdate'])

for article in json_object:
    output = parse_article(article['link'])
    cleaned_output = re.sub('[(){}<>"”“]', '', output)
    #doc = nlp(cleaned_output)
    for entity in str_list:
        if re.search(entity, output, re.IGNORECASE):
            df = df.append({'entity': entity, 'pubdate': article['pubDate'][:10]}, ignore_index=True)

    #str_list.append(parse_article(article['link']))
    #output = ''.join(str_list)

    #output_clean = output.replace('\n', ' ')
    #output_clean = output.replace(string.punctuation, '')
    #output_clean = re.sub(' +', ' ', output_clean)
    #output_clean = output.replace('\n', ' ')
    #output_clean = re.sub('.', ' ', output_clean)


    #doc = nlp(output)

    #remove stop words and punctuation marks
    #cleaned = [y for y in doc if not y.is_stop and y.pos_ != 'PUNCT']

    #cleaned_output = ' '.join([str(elem) for elem in doc])
print(df)
df = df.groupby(df.columns.tolist()).size().reset_index().rename(columns={0:'records'})
#df = df.nlargest(25, 'records')
#    name = [i.split('/')[0] for i in collected_ners]  # Jessica Miller
#    cate = [i.split('/')[1] for i in collected_ners]  # PERSON

#Counter(name)

#common_entities = name.most_common(10)
#print(common_entities)

print(df)
df.to_csv('articles_per_ner_list.csv', encoding='utf-8', index=False)

#for ent in common_entities:
#    print(ent)
#    print(cate[name.index(ent)])



