let total_count = 0;
let hour_count = 0;
let total_viewer_nums = [];
let hour_viewer_nums = [];

function bootstrap()
{
  // bootstrap initial load
  updateUsers();
  username = document.getElementById("username").value;

  document.getElementById("chat").style.display = "none";

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
  console.log("ASDFASDF");
  let url = `/get_viewers?username=${username}`;
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    console.log(xmlHttp);
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", url, true); // true for asynchronous
  xmlHttp.send(null);
}

function sendUsername()
{
  username = document.getElementById("username").value;
  if (!window.location.pathname.includes('nochat')) {
    document.getElementById("chat").style.display = "block";
    document.getElementById("chat").innerHTML = `<iframe frameborder="0"
          scrolling="yes"
          id="chat_embed"
          src="https://www.twitch.tv/embed/${username}/chat"
          height="500"
          width="350">
  </iframe>`;
  }

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
    let color_array = [ "#ffb3ba", "#ffdfba", "#ffffba", "#baffc9", "#bae1ff" ];

    // create our li elements
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
    return;
  });
  return;
}
const reducer = (accumulator, currentValue) => accumulator + currentValue;

bootstrap();
