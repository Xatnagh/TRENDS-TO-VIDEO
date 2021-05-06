from pytrends.request import TrendReq
import pandas as pd
import json
pytrends = TrendReq(hl='en-US', tz=360)

def convertDateToTimeFrame(sd,ed):
     return ("{} {}".format(sd,ed))
def convertcountryTotwoletterCode(country):
     with open("country_code.json") as f:
          data = json.load(f)
          return data[country]

def fetchTrendsData(keywordslist,timeframe, country ,filename):
     
     pytrends.build_payload(kw_list=keywordslist, cat=0, timeframe=timeframe,geo = country)
     df = pytrends.interest_over_time()
     print(df)
     makeracechart(df,filename)

def makeracechart(df,filename):
     del df['isPartial']
     import bar_chart_race as bcr
     bcr.bar_chart_race(
     df=df,
     filename=filename,
     title='The battle',
     title_size='',
     bar_label_size=7,
     tick_label_size=7,
     scale='linear',
     writer=None,
     fig=None,
     bar_kwargs={'alpha': .7},
     filter_column_colors=False) 