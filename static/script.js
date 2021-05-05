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
  country = document.getElementById("crs-country").value || "WORLD";
  region = document.getElementById("crs-region").value || "none";
  var date =  document.getElementById("Dates").value;
  console.log("keywords", keywords)
  console.log("date:",date)
  if(date== "custom"){
    var start_date = document.getElementById("date_start").value;
    var end_date = document.getElementById("date_end").value;
    console.log("start_date",start_date)
    console.log("end_date",end_date)
    if(!isValidDate(start_date)){
      alert("your start date format is wrong, please keep to format: yyyy-mm-dd")
      return;
    }
    if(!isValidDate(end_date)){
      alert("your End date format is wrong, please keep to format: yyyy-mm-dd")
      return;
    }
  }
  if(keywords.length == 0){
    alert("you didnt put in any keywords")
    return;
  }
  console.log("country",country)
  console.log("region ",region)

  data = {
    "keywords":JSON.stringify(keywords),
    "date": date,
    "country":country,
    "region": region,
    "start_date": start_date || "none",
    "end_date": end_date || "none"
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


