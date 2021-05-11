import flask
from flask import request
from chartrace import *
import time
import os
import pandas as pd
import numpy
app = flask.Flask(__name__, template_folder='templates')

@app.route('/',methods =["GET","POST"])
def MainPage():
  if flask.request.method == "GET":
    return flask.render_template("index.html")

@app.route('/make_vid',methods =["get","POST"])
def makevideo():
  data = request.args.to_dict()
  keywords = json.loads(data['keywords'])
  timeframe = data["timeframe"]
  country = data["country"]
  if(os.path.exists(str(keywords)+".mp4")):
    return flask.jsonify(200)

  if(data['country']!= ''):
    country = convertcountryTotwoletterCode(data['country'])
  filename = "{}{}.mp4".format(keywords,timeframe)
  # makeracechart(keywords,timeframe,country,filename)
  try:
    df = fetchTrendsData(keywords,timeframe,country)
    makeracechart(df,filename)
    return flask.jsonify(200)
  except(error):
    return flask.jsonify(400)
  return flask.jsonify(200)

@app.route('/get_vid',methods =["POST"])
def get_vid():
  data = request.get_json()
  keywords = data['keywords']
  timeframe = data["timeframe"]
  filename = "{}{}.mp4".format(keywords,timeframe)
  filename = filename.replace('"', "'") 
  filename = filename.replace(',', ", ") 
  @after_this_request
  def remove_file(response):
        try:
            os.remove(filename)
        except:
          print("error")
  return flask.send_file(filename,mimetype="video/mp4")

@app.route('/keyword_cvs', methods=['GET'])
def keyword_cvs():
  data = request.args.to_dict()
  keywords = json.loads(data['keywords'])
  timeframe = data["timeframe"]
  country = data["country"]
  df = fetchTrendsData(keywords,timeframe,country)
  return flask.jsonify(df.to_csv())
if __name__ == "__main__":
  #this is to not cashe javascript files so they would acutally update
  app.config['TEMPLATES_AUTO_RELOAD'] = True
  app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
  app.run()