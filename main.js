let total_count = 0;
let hour_count = 0;
let total_viewer_nums = [];
let hour_viewer_nums = [];

function bootstrap() 
{
  // bootstrap initial load
  updateUsers();
  username = document.getElementById("username").value;
  document.getElementById("chat").innerHTML = `<iframe id="iframe" src="https://twitch.tv/${username}/chat?popout="></iframe>`;

  let frame = document.getElementById('iframe');
  frame.onload = function () {
    let msg = frame.contentWindow.document.querySelector('.message');
    msg.style.fontSize = '28px';
    msg.style.lineHeight = '20px';
  };
  // set up the update cycle
  setInterval( function() { 
    updateUsers(); 
  }, 10000);

  // add listener to input registering "Enter"
  document.querySelector('#username').addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      sendUsername()
    }
  });

}
function httpGet(username="" , callback)
{
  let url = `/get_viewers?username=${username}`;
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous 
  xmlHttp.send(null);
}

function sendUsername() 
{
  username = document.getElementById("username").value;
  document.getElementById("chat").innerHTML = `<iframe id="iframe" src="https://twitch.tv/${username}/chat?popout="></iframe>`;
  let frame = document.getElementById('iframe');
  frame.onload = function () {
    let msg = frame.contentWindow.document.querySelector('.message');
    msg.style.fontSize = '28px';
    msg.style.lineHeight = '20px';
  };
  total_viewer_nums = [];
  hour_viewer_nums = [];
  updateUsers(username);
}



function updateUsers(username="") 
{

  let user_list = [];

  username = username ? username : document.getElementById("username").value;

  // get the viewer json object
  let result = httpGet(username, (result) => {
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
    console.log("end1");
    let i = 0;
    for (let viewer of viewers) {
      let color = color_array[i++ % 5];
      user_list.push(`<li style="min-height: ${height}%; 
                    width=${width}; 
                    background-color: ${color}">
                      <p>${viewer}</p>
                    </li>`);
    }

    for (let viewer of moderators) {
      let color = color_array[i++ % 5];
      user_list.push(`<li style="min-height: ${height}%; 
                    width=${width}; 
                    background-color: ${color}; 
                    font-weight: bold;" 
                    class="mod">
                      <p>${viewer}</p>
                      </li>`);
    }


    // update the object used for the graph
    if (hour_viewer_nums.length == 360) {
      hour_count = hour_count - hour_viewer_nums[0]
      hour_viewer_nums.shift();
    }
    total_count += num_viewers;
    hour_count += num_viewers;
    total_viewer_nums.push(num_viewers);
    hour_viewer_nums.push(num_viewers);
    let total_avg = Math.round(total_count / total_viewer_nums.length, 2);
    let hour_avg = Math.round(hour_count / hour_viewer_nums.length, 2);
    console.log(`total: ${total_avg}`);
    console.log(`hour: ${hour_avg}`);

    // update the html
    document.getElementById("container").innerHTML = user_list.join("");
    document.getElementById("num-viewers").innerHTML = ": " + num_viewers;
    document.getElementById("total-avg").innerHTML = total_avg
    document.getElementById("last-hour-avg").innerHTML = total_avg
    return;
  });
  return;
}
const reducer = (accumulator, currentValue) => accumulator + currentValue;

bootstrap();
