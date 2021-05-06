import flask
from chartrace import *
import time
app = flask.Flask(__name__, template_folder='templates')

@app.route('/',methods =["GET","POST"])
def MainPage():
  if flask.request.method == "GET":
    return flask.render_template("index.html")

@app.route('/get_vid',methods =["GET"])
def makevideo():
  data = flask.request.args.to_dict()
  keywords = list(data['keywords'].split(','))
  timeframe = convertDateToTimeFrame(data['start_date'],data['end_date'])
  country = ''
  if(data['country']!= ''):
    country = convertcountryTotwoletterCode(data['country'])
  filename = "{}.mp4".format(timeframe)
  # makeracechart(keywords,timeframe,country,filename)
  fetchTrendsData(keywords,timeframe,country,filename)
  return flask.send_file(filename)



if __name__ == "__main__":
  #this is to not cashe javascript files so they would acutally update
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
  app.run()