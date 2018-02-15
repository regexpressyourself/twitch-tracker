let username = "";

function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}
function httpGet(username="")
{
  theUrl = "/get_viewers?username="+username;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function sendUsername() 
{
  let username = document.getElementById("username").value;
  update_users(username);
}


function update_users(username="") {

  let user_list = [];

  if (!username) {
    document.getElementById("username").value = "sscait";
  }
  let result = httpGet(username);
  console.log(result);
  result = JSON.parse(JSON.parse(result));

  let el = document.getElementById("container");
  let num_el = document.getElementById("num-viewers");

  let color_array = [ "#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921" ];

  let viewers = result.chatters.viewers;
  let moderators = result.chatters.moderators;

  let num_viewers = viewers.length;
  num_viewers += moderators.length;

  let num_per_row = Math.floor(window.innerWidth / 150);
  num_per_row = num_per_row < num_viewers ? num_per_row: num_viewers;

  let height = 100 / Math.ceil(num_viewers / num_per_row) - 2;
  let width = num_viewers < 4 ? `100${100/num_viewers}%` : "150px";

  let i = 0;
  for (let viewer of viewers) {
    let color = color_array[i++ % 5];
    user_list.push(`<li style="height: ${height}%; width=${width}; background-color: ${color}"><p>${viewer}</p></li>`);
  }

  i = 0;
  for (let viewer of moderators) {
    let color = color_array[i++ % 5];
    user_list.push(`<li style="height: ${height}%; width=${width}; background-color: ${color}; font-weight: bold;" class="mod"><p>${viewer}</p></li>`);
  }

  num_el.innerHTML = ": " + num_viewers;
  el.innerHTML = user_list.join("");
  return;
}

update_users();

setInterval( function() { update_users(); }, 10000);
