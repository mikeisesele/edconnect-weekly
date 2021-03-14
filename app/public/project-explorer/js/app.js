if (window.location.href.includes('register.html')){ // check if window.location. is on register page

    // step 4 (1) -  Implement Signup.
    let program = document.getElementById("program") 
    fetch('/api/programs', {   // use the fetch api to get program data

        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let options = data.map(item => `<option value=${item}>${item}</option>`)
        return options
    })
    .then(options => options.join(" ")) // map returns a ner array so we need to join them as string
    .then(options => program.innerHTML = options)
    .catch(e => console.log(e.message))

    // step 4 (2)
    let graduationYear = document.getElementById("graduationYear")
    fetch('/api/graduationYears', {
        method: 'GET',
        header: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        let gradYears = data.map(item =>  `<option ${item}}>${item}</option>`)
        return gradYears
    })
    .then(data => data.join(" "))
    .then(years => graduationYear.innerHTML = years)
    .catch(e => console.log(e.message))

// step 4 (3)
// This should handle form submissions and validation

    const signupForm = document.getElementById("signupForm"); 
    const errorAlert = document.getElementById("danger-alert")
    errorAlert.style.display = "none"; // hide the div display 
    
    function postData(event) {  // form submit handler
        event.preventDefault();

        const data = new FormData(event.target);            // listen to the target form  
        const value = Object.fromEntries(data.entries()); // get values from the target form
        
        fetch("/api/register", {        
            method: 'POST',
            body: JSON.stringify(value),        // All form data // turn values to json format
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then ((res) => {
            console.log(res)
            // step 4 [3c]
            if (res.status === "ok") {
                document.cookie = `uid=${res.data.id}; path=/ `; // store the id in a cookie named uid.
                window.location.replace('index.html'); // redirect user to index.html page
            } else if (res.status !== "ok") {
//                console.log(res)

                // step 4 [3d]
                // response.error.map(item => {
//                  return message = document.createElement("div").textContent = item 
//         // })
            errorAlert.innerHTML = `<strong>${res.status}</strong>`
            errorAlert.className = "alert alert-danger"
            errorAlert.style.display = "block"
            setTimeout(function() {
                errorAlert.style.display = "none"
            }, 5000)
//              })
            }
        })
    }

    signupForm.addEventListener("submit", postData) // call the function to post the form
}

// step 5 - Update the Navbar.
    const newNav = document.getElementById("newNav");
    if (document.cookie){ // check for a coookie

        let cookieValue = document.cookie.split("=")
        let uid = cookieValue[1]
        
        fetch(`/api/users/${uid}`, { // get data from server
            method: 'GET',
            header: {
                'Content-Type': 'application/json'
            },
        })
        .then(result => result.json())
        .then(userDetails => {
            let newDisplay = `<li class="nav-item"><a class="nav-link" id ="logout">Logout</a></li><li class="nav-item"><a class="nav-link" id ="username">Hi, ${userDetails.firstname}</a></li>`
            newNav.innerHTML = newDisplay;

            let logout = document.getElementById("logout");
            function handleLogout(event) {
                event.preventDefault()
                document.cookie = "uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.replace('index.html');
            }

            logout.addEventListener("click", handleLogout)
        })
    }

// step 6 - Implement Login
if (window.location.href.includes('login.html')){

    const logInForm = document.getElementById("loginForm")
    const alert = document.getElementById("alert")
    alert.style.display = "none" // hide alert 

    function logIn(event) {
        event.preventDefault();

        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());

        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(value), // All form data
            headers: {
                'Content-Type': 'application/json',
            },
            })
            .then(response => response.json())
            .then ((response) => {
                if (response.status === "ok") { 
                    document.cookie = `uid=${response.data.id}; path=/ `; //store the id in a cookie named uid.
                    window.location.replace('index.html'); // redirect user to index.html page
                } else if (response.status !== "ok") {
                    alert.className = "alert alert-danger" // give cdd alert classes
                    alert.style.display = "block"; // show div
                    alert.innerHTML = "Invalid email/password";
                    setTimeout(function(){
                        alert.style.display = "none"; // hide div
                    }, 3000) 
                }
                    
                })
            }
        
        logInForm.addEventListener("submit", logIn)  // call the function to post the form
}

// Step 7 - Implement CreateProject.
if (window.location.href.includes('createproject.html')){

        function submitProject(event){
        console.log("done")

        event.preventDefault();

        const data = new FormData(event.target);
        const value = Object.fromEntries(data.entries());

        console.log(value) 
        
        fetch("/api/projects", {
            method: "POST",
            body: JSON.stringify(value),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => {
            if(response.status == "ok"){
                console.log(response)
            } else {
                console.log("error")
            }
        }
//        .then(response => console.log(response))
        )}

    document.getElementById("createProjectForm").addEventListener(onsubmit, submitProject)
}