// register service worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js")
            .then((registration) => console.log("Registered"))
            .catch(err => console.log("Failed to Register", err))
    })
}
function fetchData() {
    let data = fetch("http://localhost:3000/balance", {
    }).then(response => { return response.json() })
        .catch(err => { throw err })
    if (!data) {
        console.log("Something went wrong")
    }
}

async function login(id, password) {
    let data = await fetch("http://localhost:3000/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password }),
        credentials: "include"
    });
    let response = await data.json();
    console.log(response);
}

async function getBalance(id) {
    let data = await fetch(`http://localhost:3000/balance/${id}`, {
        method: 'GET',
        credentials: "include"
    })
    let response = await data.json();
    console.log(response);
}

async function signup(name, password) {
    try {
        let data = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password })
        })
        console.log(data);
    } catch (err) {
        console.log(err.message)
    }
}

async function runTest() {
    await login(1, "keval012")
    await getBalance(1);
    await login(2, "123jay");
    await getBalance(2)
    await login(4, "1harsh32");
    await getBalance(4)
    await login(9, "32vivek32")
    await getBalance(9)
}

// fetchData();
runTest();
// signup("Priyen", "pk69")

// login(2, "123jay");