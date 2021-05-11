from pytrends.request import TrendReq
import pandas as pd
import json
pytrends = TrendReq(hl='en-US', tz=360)
import os

def convertDateToTimeFrame(sd,ed):
     return ("{} {}".format(sd,ed))
def convertcountryTotwoletterCode(country):
     with open("country_code.json") as f:
          data = json.load(f)
          return data[country]

def fetchTrendsData(keywordslist,timeframe, country):
     
     pytrends.build_payload(kw_list=keywordslist, cat=0, timeframe=timeframe,geo = country)
     df = pytrends.interest_over_time()
     del df['isPartial']
     return df
def deletevideos():
  mydir = os.getcwd()
  filelist = [ f for f in os.listdir(mydir) if f.endswith(".mp4") ]
  for f in filelist:
      os.remove(os.path.join(mydir, f))
deletevideos     

def makeracechart(df,filename):
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