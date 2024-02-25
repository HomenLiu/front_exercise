//1. get profile
/* <div class="aside">
<img src="./asset/avatar.png" class="aside-avatar" alt="" />
<p id="nickname" class="aside-name"></p>
<p id="loginId" class="aside-account"></p>
</div> */

setProfile();

//loadHistory();

function setProfile() {
  getProfile($("#loginId"), $("#nickname"))
}

async function getProfile(eleId, elenick) {
  const resp = await API.profile();
  eleId.innerText = resp.data.loginId;
  elenick.innerText = resp.data.nickname;
}


//1.1 logout
$(".close").onclick = () => {
  API.loginOut();
  location.href = "./login.html"
}

//2. load history chat

/**
 * 增加對話內容到畫面上
 * @param {*} data {from:"" , to:"",content:"",createAt:""}
 */
function addChat(data) {
  const chatContainer = $(".chat-container");
  data.forEach(item => {
    const div = $$$("div");
    div.classList.add("chat-item");
    const img = $$$("img");
    img.classList.add("chat-avatar");
    const divContent = $$$("div");
    divContent.classList.add("chat-content");
    const divChatDate = $$$("div");
    divChatDate.classList.add("chat-date");

    if (item.from === ($("#loginId")).innerText) {
      div.classList.add("me");
      img.src = "./asset/avatar.png";
    } else {
      img.src = "./asset/robot-avatar.jpg";
    }
    divContent.innerText = item.content;
    divChatDate.innerText = formatTime(item.createdAt);


    div.appendChild(img);
    div.appendChild(divContent);
    div.appendChild(divChatDate);

    chatContainer.appendChild(div);
  });

  scrollBottom();
}

function scrollBottom() {
  const chatContainer = $(".chat-container");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function loadHistory() {
  const resp = await API.getHistory();
  //console.log(resp);

  addChat(resp.data);

}

function formatTime(value) {
  const d = new Date(value);
  return `${d.getFullYear().toString()}-${(d.getMonth()+1).toString().padStart(2,0)}-${d.getDate().toString().padStart(2,0)} ${d.getHours().toString().padStart(2,0)}:${d.getMinutes().toString().padStart(2,0)}:${d.getSeconds().toString().padStart(2,0)}`
}

//3. sendchat
async function sendChat() {
  const contentEle = $("#txtMsg");
  const content = contentEle.value;

  const chatItem = {
    from: ($("#loginId")).innerText,
    to: null,
    content: content,
    createdAt: Date.now()
  }

  addChat([chatItem]);

  contentEle.value = "";

  const resp = await API.sendChat(content);
  //console.log(resp);

  const rspChat={
    from: null,
    to: null,
    content: resp.data.content,
    createdAt: resp.data.createdAt
  }
  addChat([rspChat]);


}