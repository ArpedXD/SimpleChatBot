const $ = (id) => document.getElementById(id)
const url = "https://fastapi-simplechatbot.onrender.com"

// logic to change between forms
document.querySelectorAll(".tab-buttons button").forEach(btn => {
    btn.addEventListener("click", () => {
        const isLogin = btn.textContent.trim() === "Log In"
        if (isLogin) {
            $("loginForm").classList.remove("hidden-form")
            $("loginForm").classList.add("active-form")
            $("signupForm").classList.remove("active-form")
            $("signupForm").classList.add("hidden-form")
        } else {
            $("signupForm").classList.remove("hidden-form")
            $("signupForm").classList.add("active-form")
            $("loginForm").classList.remove("active-form")
            $("loginForm").classList.add("hidden-form")
        }
    })
})

$("signup-btn").addEventListener("click", signup)
$("login-btn").addEventListener("click", login)

async function signup(){
    let url_signup = `${url}/account/signup`
    
    data = {
        username: $("signin-username").value,
        password : $("signin-password").value,
        age : parseInt($("signin-age").value),
        gmail : $("signin-gmail").value
    }

    // Check if any field is empty
    for (let key in data) {
        if (data[key] === "" || data[key] === null || (typeof data[key] === "number" && isNaN(data[key]))) {
            alert("Cannot Be Empty")
            return
        }
    }

    $("signup-btn").disabled = true
    $("signup-btn").textContent = "..."

    var response = await fetch(url_signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
    })

    let text = await response.json()

    alert(text["Message"])
    $("signup-btn").disabled = false
    $("signup-btn").textContent = "Signup"
}

async function login(){
    let url_signup = `${url}/account/login`

    data = {
        username: $("login-username").value,
        password : $("login-password").value,
    }

    for (let key in data) {
        if (data[key] === "" || data[key] === null || (typeof data[key] === "number" && isNaN(data[key]))) {
            alert("Cannot Be Empty")
            return
        }
    }

    $("login-btn").disabled = true
    $("login-btn").textContent = "..."

    var response = await fetch(url_signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: "include"
    })

    if (!response.ok) {
        const error = await response.json();
        alert(error.message || error.detail || "Login failed");
        $("login-btn").disabled = false
        $("login-btn").textContent = "Login"
        return
    }

    account_check()
}


async function account_check(){
    let url_generate = `${url}/account/profile`

    var response = await fetch(url_generate, {
        method: 'GET',
        credentials: "include"
    })

    if(!response.ok){
        const error = await response.json();
        console.log(error.message);
        $("login-btn").disabled = false
        $("login-btn").textContent = "Login"
        return 
    }

    let res = await response.json()

    if(res.logged_in){
        window.location.href = "dashboard.html"
    } else {
        $("login-btn").disabled = false
        $("login-btn").textContent = "Login"
    }
}

account_check()