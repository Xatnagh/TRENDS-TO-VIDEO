console.log('start')
//this function is called when user enters in a keyword and presses add
var keywords = [];
function addKeywordToList(){
  
  keyword = document.getElementById("keyword").value;
  document.getElementById("keyword").value = "";
  if(keyword.length != 0){
    keywords.push(keyword);
    console.log(keywords)
  }
  showKeywords();
  
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


function showOrHide_customdates(){
  if(document.getElementById("Dates").value== "custom"){
  document.getElementById("custom_date").style.display = "block";
  }else{
    document.getElementById("custom_date").style.display = "none";
  }
}

function getVideoFromBackEnd(){
  //already have keyword lists as global variable
  var country,region;
  country = document.getElementById("crs-country").value || "";
  // region = document.getElementById("crs-region").value || "none";
  var date =  document.getElementById("Dates").value;
  console.log("keywords", keywords)
  console.log("date:",date)
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
  console.log("start_date",start_date)
    console.log("end_date",end_date)
  console.log("country",country)
  // console.log("region ",region)

  data = {
    "keywords":JSON.stringify(keywords),
    "start_date": start_date || "none",
    "end_date": end_date || "none",
    "country":country
    // "region": region,
  }

  $.ajax({
    type: "GET",
    contentType: "application/json;charset=utf-8",
    url: "/get_vid",
    data: data,
    dataType: "json",
    success: function(data){
      console.log(data)
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
  return num1<num2;
}

function getStart_date(){
  var option =  document.getElementById("Dates").value;
  date = new Date()
  if(option =="custom")return;
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