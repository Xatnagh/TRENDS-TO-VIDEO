



//this function is called when user enters in a keyword and presses add
var url;
var keywords= [];
var timeframe;
var data;
var country='';
function addKeywordToList(){
  
  keyword = document.getElementById("keyword").value;
  //this clears the keyword bar
  document.getElementById("keyword").value = "";

  if(keyword.length != 0 && !keywords.includes(keyword)){
    keywords.push(keyword);
    console.log(keywords)
  }
  showKeywords();
  showkeywordGraph();
}
function showKeywords(){
  var ul = document.getElementById("keyword_list")
  while(ul.firstChild){
    ul.removeChild(ul.firstChild);
  } 
  for(var i =0;i< keywords.length;i++){
    var node = document.createElement('li');
    node.appendChild(document.createTextNode(keywords[i]));
    ul.appendChild(node);
  }
}

function showkeywordGraph(){
  var start_date = getStart_date();
  var end_date = getEnd_date();
  var timeframe = `${start_date} ${end_date}`
  data = {
    "keywords":JSON.stringify(keywords),
    "timeframe": timeframe,
    "country":country
  }
  $.ajax({
    type: "GET",
    contentType: "application/json;charset=utf-8",
    url: "/keyword_cvs",
    data: data,
    dataType: "json",
    success: function(data){  
      console.log(data)
      var file = new Blob([data], {type: 'csv'});
      var url = URL.createObjectURL(file)
      var chart = c3.generate({
        bindto: "#chart",
        data: {
          url: url,
          type: 'line'
      },
      });
      chart.hide("date");
     }
    });
}

function showOrHide_customdates(){
  if(document.getElementById("Dates").value== "custom"){
  document.getElementById("custom_date").style.display = "block";
  }else{
    document.getElementById("custom_date").style.display = "none";
  }
}

function getVideoFromBackEnd(){
  //already have keyword lists as global variable
  var country;
  country = document.getElementById("crs-country").value || "";
  // region = document.getElementById("crs-region").value || "none";
  var date =  document.getElementById("Dates").value;
  if(keywords.length == 0){
    alert("you didnt put in any keywords")
    return;
  }
  var start_date = getStart_date();
  var end_date = getEnd_date();

  if(date== "custom"){
    start_date = document.getElementById("date_start").value;
    end_date = document.getElementById("date_end").value;
    if(!isValidDate(start_date)){
      alert("your start date format is wrong, please keep to format: yyyy-mm-dd")
      return;
    }
    if(!isValidDate(end_date)){
      alert("your End date format is wrong, please keep to format: yyyy-mm-dd")
      return;
    }
    if(!validStartToEndDate(start_date,end_date)){
      alert("start date cannot be more recent than end date")
      return;
    }
  }
  // console.log("region ",region)
  timeframe = `${start_date} ${end_date}`;
  data = {
    "keywords":JSON.stringify(keywords),
    "timeframe": timeframe,
    "country":country
  }
  //show loading screen
  document.getElementById("loadingscreen").style.display="block";
  $.ajax({
    type: "GET",
    contentType: "application/json;charset=utf-8",
    url: "/make_vid",
    data: data,
    dataType: "json",
    success: function(){
          console.log("success")
          getvideo()
        },
    error: function(error){
      console.log(error)
    }
    });
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  if(!dateString.match(regEx)) return false;  // Invalid format
  var d = new Date(dateString);
  var dNum = d.getTime();
  if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0,10) === dateString;
}
function validStartToEndDate(sd,ed){
  var num1 = new Date(sd).getTime();
  var num2 = new Date(ed).getTime();
  return num1<num2 && num2<= new Date().getTime();
}

function getStart_date(){
  var option =  document.getElementById("Dates").value;
  date = new Date()
  if(option =="custom")return 
  switch(option){
    case "6m": return formatdateTime(addMonths(new Date,-6)); break;
    case "1y": return formatdateTime(addMonths(new Date,-12)); break;
    case "2y": return formatdateTime(addMonths(new Date,-24)); break;
  }
}
function getEnd_date(){
  return formatdateTime(new Date())
}

function addMonths(date, months) {
  date.setMonth(date.getMonth() + months);
  return date;
}

function formatdateTime(dateObj){
  var month = dateObj.getUTCMonth() + 1; 
  if(month<10)month = "0"+month
  var day = dateObj.getUTCDate();
  if(day<10)day = "0"+day
  var year = dateObj.getUTCFullYear();
  return year + "-" + month + "-" + day;
}

//thanks to this post: https://www.javaer101.com/en/article/34951145.html
function getvideo(){
  var req = new XMLHttpRequest();
  var senddata = data;
  req.open("POST", "/get_vid");
  req.responseType = "blob";
  req.setRequestHeader('Content-Type', 'application/json');
  req.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200){
      document.getElementById("loadingscreen").style.display="none"
      console.log("video recieved")
      var blob = new Blob([this.response], {type: "video/mp4"});
      url = window.URL.createObjectURL(blob);
      console.log(url)
      var video = document.getElementById("resultvideo")
      var source = document.createElement("source")
      source.setAttribute('src', url);
      video.appendChild(source);
      document.getElementById("videoarea").style.display="block";
      video.play();

  }
  };
  req.send(JSON.stringify(senddata));
}
function downloadVideo(){
  var link = document.createElement('a');
  link.style = "display: none";
  link.href = url;
  link.download = "race.mp4";
  link.click();
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
    link.remove(); } , 100);
}