
from pytrends.request import TrendReq

pytrend = TrendReq(hl='DK', tz=360)
keywords =['Joe Biden']
pytrend.build_payload(
kw_list=keywords,
cat=0,
timeframe='2020-11-06 2021-05-05',
geo='DK',
)

data = pytrend.interest_over_time()