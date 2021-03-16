// step 4 (1) -  Implement Signup.
if (window.location.href.includes('register.html')){ // check if window.location. is on register page

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

    const signupForm = document.getElementById("signupForm")
    const errorAlert = document.getElementById("danger-alert")
    errorAlert.style.display = "none"; // hide the div display 
    
    function postData(event) {  // form submit handler
        
        event.preventDefault();
        
        let regInfo = {
            firstname: document.getElementById("firstname").value,
            lastname: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            matricNumber: document.getElementById("matricNumber").value,
            program: document.getElementById("program").value,
            graduationYear: document.getElementById("graduationYear").value,
        }

        fetch("/api/register", {        
            method: 'POST',
            body: JSON.stringify(regInfo),        // All form data // turn values to json format
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
        .then(response => response.json())
        .then (res => {
            //step 4 [3c]
            if (res.status === "ok") {

                document.cookie = `uid=${res.data.id}; path=/`; // store the id in a cookie named uid.       
                window.location.replace('index.html'); // redirect user to index.html page
                
            } else if (res.status !== "ok") {
            // step 4 [3d]
                let errors = res.errors.map(error => error)
                errors.forEach(error => {
                errorAlert.innerHTML += `<strong>${error}</strong><br>` // loop through returned array, append answer to error div
            })
         }
            errorAlert.className = "alert alert-danger"
            errorAlert.style.display = "block"

            setTimeout (function(){ // hide the error div and clear the contents
                errorAlert.style.display = "none"                    
                errorAlert.textContent =  ""
            }, 3000)
        })
}

     signupForm.addEventListener("submit", postData) // call the function to post the form
    
}

// // step 5 - Update the Navbar.
if (document.cookie){ // check for a coookie
    
    const newNav = document.getElementById("newNav");

    let cookieValue = document.cookie.split('=')
    uid = cookieValue[1]
    
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
    
        // handle log out of user
        let logout = document.getElementById("logout");
        function handleLogout(event) {
            event.preventDefault()
            document.cookie = `uid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            window.location.replace('index.html');
        }
        logout.addEventListener("click", handleLogout)
        
}).catch(e => console.log(e))
}

// // step 6 - Implement Login
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
                }
                    
                }).catch(e => console.log(e))
            }
        
        logInForm.addEventListener("submit", logIn)  // call the function to post the form
}

// // Step 7 - Implement CreateProject. 
if (window.location.href.includes('createproject.html')){

        let alertDiv = document.getElementById("alert")
        alertDiv.style.display = "none" 
    
        const createProject = document.getElementById("createProjectForm") // get id of the form

        let cookieValue = document.cookie.split("=")

        // Step 8 - Restrict Project Submission to logged-in users.  
        if (cookieValue[1] !== ""){
        
        function submitProject(event){

        event.preventDefault();

        const data = new FormData(event.target); // get target form
        const value = Object.fromEntries(data.entries()); // get target value
        
        fetch("/api/projects", {
            method: "POST",
            body: JSON.stringify(value),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
        
        if(response.status === "ok"){
            window.location.replace('index.html')
        } else {
            let errorMessage = response.errors.map(error => error)
            errorMessage.forEach(error => {
                alertDiv.innerHTML += `<strong>${error}</strong><br>`
            })

            alertDiv.classList = "alert alert-danger" // add css classes
            alertDiv.style.display = "block"

            setTimeout(function(){ // hide the error div and clear the contents
                alertDiv.style.display = "none"
                alertDiv.textContent =  ""
            }, 3000)
        }           
    })
}
    } else {
        window.location.replace('login.html')
    }

    createProject.addEventListener("submit", submitProject)
}   

// Step 9 - Update the project list on the Home Page.
if (window.location.href.includes('index.html')){
    let projectList = document.getElementsByClassName("showcase")

    projectList[0].innerHTML = ''

        fetch('/api/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        } 
    })
    .then(response => response.json())
    .then(response => {

        let object = response.map(item => item)    

        for(let i = 0; i < 4; i++){

        // populate div content
        // // create elements
        let col3Div = document.createElement('div')
        let card = document.createElement('div')
        let cardBody = document.createElement('div')
        let h5 = document.createElement('h5')
        let h6 = document.createElement('h6')
        let p = document.createElement('p')
        let a = document.createElement('a')

        // add class
        col3Div.className = "col-3" 
        card.className = "card" 
        cardBody.className = "card-body" 
        h5.className = "card-title"
        h6.className = "card-subtitle mb-2 text-muted" 
        p.className = "card-text" 
        a.className = "card-link"
        a.setAttribute("href" , "#") 

        //  // structure element
        col3Div.appendChild(card)
        card.appendChild(cardBody)
        cardBody.appendChild(h5)
        cardBody.appendChild(h6)
        cardBody.appendChild(p)
        cardBody.appendChild(a)
            
        for(const  key in object[i]){
    
            switch(key){
                case "id":
                    h5.setAttribute("href", `“viewproject.html?id=${object[i][key]}”`)
                case "name":
                    h5.textContent = `${object[i][key]}`
                    break
                case "authors":
                    key.split(",").forEach(function(item){
                        h6.innerText += ` ${object[i][item]} `
                    })
                    break
                case "abstract":
                    p.innerText = `${object[i][key]}`
                    break
                case "tags":
                    if(object[i][key].length > 1){
                        key.split(",").forEach(function(item){
                            a.innerText += `${object[i][item]} `
                        })
                        break                                
                    } else {
                        a.innerText += `${object[i][key][0]} `
                        break    
                    }
            }            
        }
        
            document.getElementsByClassName("showcase")[0].appendChild(col3Div)
        }           
    }).catch(e => console.log(e))      
     
}

// step 10 - Update ViewProject Page.
if (window.location.href.includes('viewproject.html')){
    document.getElementById("project_author").textContent = ""
    document.getElementById("project_tags").textContent = ""
    document.getElementById("project_authors").innerHTML = ""
    document.getElementById("project_tags").style.color = 'blue'
    
    const queryString = window.location.search; // retrive the website link
        
    const urlParams = new URLSearchParams(queryString); 

    const id = urlParams.get('id')  // pass in the parameter to search for in the link

    

    fetch(`/api/projects/${id}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(response => response.json())  
    .then(response => {
        document.getElementById("project_name").textContent = response.name
        document.getElementById("project_abstract").textContent = response.abstract
        
        response.tags.forEach(tag => {
            document.getElementById("project_tags").innerHTML += `<p>#${tag}</p>&nbsp;`
        })
       
        response.authors.forEach(person => {
        document.getElementById("project_authors").innerHTML += `<p>${person}</p>`
        })

    // update created by
    fetch(`/api/users/${id}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
    })
    .then(response => response.json()) 
    .then(response => {  
        document.getElementById("project_author").innerHTML = `<p><strong>Created By: <br> ${response.firstName}&nbsp;${response.lastName}</strong></p>`
    })
    }).catch(e => console.log(e))
}
