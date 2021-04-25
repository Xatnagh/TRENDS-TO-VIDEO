from pytrends.request import TrendReq
import pandas as pd

pytrends = TrendReq(hl='en-US', tz=360)

keywords = ["Donald Trump","Joe Biden"]
pytrends.build_payload(
     kw_list=keywords,
     cat=0,
     timeframe='today 5-y')
df = pytrends.interest_over_time()
del df['isPartial']
print(df)
import bar_chart_race as bcr
bcr.bar_chart_race(
    df=df,
    filename='comparison.mp4',
    title='Trump vs joebiden',
    title_size='',
    bar_label_size=7,
    tick_label_size=7,
    scale='linear',
    writer=None,
    fig=None,
    bar_kwargs={'alpha': .7},
    filter_column_colors=False) 