let viewer_nums = [];
let chart = null;

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
    chart.update();
  }, 10000);

  // add listener to input registering "Enter"
  document.querySelector('#username').addEventListener('keypress', (e) => {
    let key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      sendUsername()
    }
  });

}

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
  document.getElementById("chat").innerHTML = `<iframe id="iframe" src="https://twitch.tv/${username}/chat?popout="></iframe>`;
  let frame = document.getElementById('iframe');
    frame.onload = function () {
        let msg = frame.contentWindow.document.querySelector('.message');
        msg.style.fontSize = '28px';
        msg.style.lineHeight = '20px';
    };
  viewer_nums = [];
  chart = createChart();
  updateUsers(username);
}


function createChart() 
{
  return new Chart(document.getElementById("viewer-chart"), {
    type: 'scatter',
    data: {
      datasets: [{ 
        data: viewer_nums,
        label: "Viewers",
        borderColor: "#3e95cd",
        backgroundColor: "#3e95cd",
        fill: true,
        showLine: true
      }]
    },
    options: {   
      legend: {
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      maintainAspectRatio: false
    }
  });

}

function updateUsers(username="") 
{

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
  viewer_nums.push({x:viewer_nums.length, y:num_viewers});

  // update the html
  document.getElementById("container").innerHTML = user_list.join("");
  document.getElementById("num-viewers").innerHTML = ": " + num_viewers;
  return;
}

chart = createChart();
bootstrap();
