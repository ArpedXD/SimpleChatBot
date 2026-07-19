const url = "https://fastapi-simplechatbot.onrender.com"
const $ = (id) => document.getElementById(id)
var NewChat = true
var title = ""

$("generate").addEventListener("click", () => generate())

async function newchat(){
    NewChat = true
    title = ""
    loadChat(title)
}

async function account_check(){ // Returns user to signup page if they haven't logged in yet
    let url_generate = `${url}/account/profile`

    var response = await fetch(url_generate, {
        method: 'GET',
        credentials: "include"
    })

    let res = await response.json()

    if(!res.logged_in){
        window.location.href = "index.html"
    }
}

async function generate(){
    $("generate").disabled = true;
    let url_generate = `${url}/main/chat`

    let generate_data = {
        question : $("chat-box").value,
        new_chat: NewChat,
        title: title
    }

    const userMessage = document.createElement("div");
    userMessage.className = "user-chat"
    userMessage.textContent = $("chat-box").value
    $("current-chat").scrollTop = $("current-chat").scrollHeight;

    $("current-chat").appendChild(userMessage);

    var response = await fetch(url_generate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(generate_data),
        credentials: "include"
    })

    $("chat-box").value = ''

    if (!response.ok) {
        const error = await response.json();
        console.log(error.detail);
        $("generate").disabled = false;
        return; // Stop this function
    }

    const AIMessage = document.createElement("div");
    AIMessage.className = "AI-chat"
    AIMessage.textContent = ""

    $("current-chat").appendChild(AIMessage);

    await loadYield(response, AIMessage, "generate");

    $("generate").disabled = false;
}

async function loadYield(response, div, type){
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    if(title == "None") title = ""

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");

        for (const line of lines) {
            if (line.trim() === "") continue;

            const data = JSON.parse(line);

            if (data.Success === true) {
                div.textContent += data.text;
                div.innerHTML = marked.parse(div.textContent);
                $("current-chat").scrollTop = $("current-chat").scrollHeight;
            }

            if (data.titleSuccess === true){
                $("title").textContent += data.title;
                title += data.title
            }
        }
    }

    loadHistory()
}

async function loadChat(title){
    $("current-chat").innerHTML = ""
    let url_generate = `${url}/main/loadchat`

    let data = {
        title : title,
    }
    
    var response = await fetch(url_generate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
    })

    let res = await response.json();
    for(const response of res){
        const newdiv = document.createElement("div");
        if (response.role === "user"){
            newdiv.className = "user-chat"
            newdiv.textContent = response.content
        }else{
            newdiv.className = "AI-chat"
            newdiv.innerHTML = marked.parse(response.content)
        }
        $("current-chat").appendChild(newdiv);
    }
    $("current-chat").scrollTop = $("current-chat").scrollHeight;
}

async function loadHistory(){
    $("chat-history").innerHTML = ""
    let url_generate = `${url}/main/loadhistory`
    var response = await fetch(url_generate, {
        method: 'GET',
        credentials: "include"
    })
    let res = await response.json()
    for(const respons of res){
        
        const newdiv = document.createElement("div");
        newdiv.className = "side-bar"
        newdiv.textContent = respons
        newdiv.addEventListener("click", () => {
            title = newdiv.textContent
            loadChat(newdiv.textContent)
        })
        $("chat-history").prepend(newdiv);
    }
}

async function logout(){
    let url_generate = `${url}/main/logout`
    var response = await fetch(url_generate, {
        method: 'GET',
        credentials: "include"
    })

    if(response.ok){
        window.location.href = "index.html"
    }
}

loadHistory()
loadChat(title)
account_check()