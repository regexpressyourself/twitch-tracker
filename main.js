function httpGet(username="", url="/get_viewers")
{
  url = `${url}?username=${username}`;
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", url, false ); // false for synchronous request. I know, I know....
  xmlHttp.send( null );
  return xmlHttp.responseText;
}

function sendUsername() 
{
  username = document.getElementById("username").value;
  document.getElementById("chat").innerHTML = `<iframe src="http://twitch.tv/${username}/chat?popout="></iframe>`;
  update_users(username);
}


function update_users(username="") {

  let user_list = [];

  username = username ? username : document.getElementById("username").value;

  if (!username ) {
    username = "sscait";
    document.getElementById("username").value = "sscait";
  }

  // get the viewer json object
  let result = httpGet(username);
  result = JSON.parse(result);

  // get the viewers and moderators
  let viewers = result.chatters.viewers;
  let moderators = result.chatters.moderators;
  let num_viewers = viewers.length;
  num_viewers += moderators.length;


  // calculate the size of the boxes based on the number of viewers
  let num_per_row = Math.floor(window.innerWidth / 2 / 150);
  num_per_row = num_per_row < num_viewers ? num_per_row: num_viewers;

  let height = 100 / Math.ceil(num_viewers / num_per_row) - 2;
  let width = num_viewers < 4 ? `100${100/num_viewers}%` : "150px";

  // colors for our viewer boxes
  let color_array = [ "#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921" ];

  // create our li elements
  let i = 0;
  for (let viewer of viewers) {
    let color = color_array[i++ % 5];
    user_list.push(`<li style="height: ${height}%; 
                    width=${width}; 
                    background-color: ${color}">
                      <p>${viewer}</p>
                    </li>`);
  }

  i = 0;
  for (let viewer of moderators) {
    let color = color_array[i++ % 5];
    user_list.push(`<li style="height: ${height}%; 
                    width=${width}; 
                    background-color: ${color}; 
                    font-weight: bold;" 
                    class="mod">
                      <p>${viewer}</p>
                      </li>`);
  }


  document.getElementById("container").innerHTML = user_list.join("");
  document.getElementById("num-viewers").innerHTML = ": " + num_viewers;
  return;
}

update_users();

username = document.getElementById("username").value;
document.getElementById("chat").innerHTML = `<iframe src="http://twitch.tv/${username}/chat?popout="></iframe>`;

setInterval( function() { update_users(); }, 10000);

document.querySelector('#username').addEventListener('keypress', (e) => {
  let key = e.which || e.keyCode;
  if (key === 13) { // 13 is enter
    update_users();
  }
});
