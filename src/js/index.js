import { token } from './token.js'


// FETCH DATA AS THE WEBPAGE LOADS
window.onload = () => {
  formLarge.search.focus()
  fetchData()
}


// USERNAME
let fetchedUser = 'iamblackdev'


// GETTING ELEMENTS FROM THE DOM
let names = document.querySelectorAll('.name-identifier');
let bio = document.querySelectorAll('.bio-identifier');
let avatars = document.querySelectorAll('.avatar-identifier')
let usernames = document.querySelectorAll('.username-identifier')
let counters = document.querySelectorAll('.counter')
let repositories = document.querySelector('.repositories-list-identifier')
let toogleBtn = document.querySelector('#toogleBtn')
let mobileNav = document.querySelector('.mobile-nav-dropdown')
let loading = document.querySelector('.loading')
let errors = document.querySelectorAll('.error-message')


//
toogleBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('active')
})


// INITIALIZING VARIABLES NEEDED FOR GLOBAL USE
let updatedAt, humanTime,

  // FETCH FUNCTION
  fetchData = () => {

    loading.classList.add('loading-active')



    // QUERY FOR GRAPHQL API
    const query = `{
      repositoryOwner(login: "${fetchedUser}") {
        ... on User {
          bio
          name
          avatarUrl
          repositories(first: 20) {
            totalCount
            edges {
              node {
                name
                description
                url
                forkCount
                updatedAt
                parent{
                  isInOrganization
                  nameWithOwner
                  forkCount
                  updatedAt

                }
                stargazers{
                  totalCount
                }
                primaryLanguage{
                  name
                  color
                }
              }
            }
          }
        }
      }
    }`

  // HEADER FOR THE API
  const headers = {
    Authorization: `bearer ${token}`,
    'Content-type': 'application/json',
  }
    
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query })
    })
      // RESPONSE
      .then(res => res.json())

      // DATAS
      .then(fetchedData => {


        if (!(fetchedData.errors) && fetchedData.data.repositoryOwner && Object.entries(fetchedData.data.repositoryOwner).length !== 0) {

          errors.forEach(error => {
            error.classList.remove('error-active')
          })


          // OUTPUTING THE USERNAME TO THE DOM
          usernames.forEach(username => username.innerText = fetchedUser)
          
          // OUTPUTING NAME TO THE DOM 
          names.forEach(names => names.innerText = fetchedData.data.repositoryOwner.name)
            
          // OUTPUTING USERNAME TO THE DOM 
          bio.forEach(bio => bio.innerText = fetchedData.data.repositoryOwner.bio)

          // OUTPUTING AVATER URL TO THE DOM 
          avatars.forEach(avatar => {
            avatar.src = fetchedData.data.repositoryOwner.avatarUrl
            avatar.alt = `@${fetchedUser}`
          })

          // OUTPUTING TOTAL REPOSITORIES COUNTER TO THE DOM 
          counters.forEach(counter => counter.innerText = fetchedData.data.repositoryOwner.repositories.totalCount)

          // CLEARING THE ALREADY OUTPUTED REPOSITORIES
          repositories.innerHTML = ''

          // LOOPING THROUGH THE REPOSITORIES ARRAY AND OUTPUTING EACH REPOSITORY
          fetchedData.data.repositoryOwner.repositories.edges.forEach(repository => (

            repositories.innerHTML +=
            `<li>
              <div class="repository-details">
                <h3><a href=${repository.node.url}>${repository.node.name}</a></h3>

                ${repository.node.parent ?
                  `
                  <span class="forked-from">
                  Forked from <a href="#"> ${repository.node.parent.nameWithOwner}</a>  
                  </span>
                ` : ''
                }

                <p class="description">${repository.node.description ? repository.node.description : ''}</p>
                <div class="language-and-timestamp">      
                ${repository.node.primaryLanguage ?
                  `
                  <span class="repo-language">
                    <span class="language-color" style="background-color: ${repository.node.primaryLanguage.color}";></span>  
                    <span class="programming-language" > ${repository.node.primaryLanguage.name} </span>
                  </span>
                  ` : ''
                }

                ${repository.node.stargazers.totalCount ?
                    `
                  <a class="star-count" href="#">
                    <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                    ${repository.node.stargazers.totalCount}
                  </a>

                  ` : ''
                }

                ${repository.node.parent ?
                  `
                  ${repository.node.parent.forkCount ? 
                    `
                    <a class="fork-count" href="#">
                      <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg> 
                      ${repository.node.parent.forkCount}
                    </a>
                    `: ''
                  }

                  ${repository.node.parent.isInOrganization ? 
                    `
                    <span class="timestamp">
                      ${getHumanTime(repository.node.parent.updatedAt)}
                    </span>
                    `:
                    `
                    <span class="timestamp">
                      ${getHumanTime(repository.node.updatedAt)}
                    </span> 
                    `
                  }

                  ` :
              
                  `
                  ${repository.node.forkCount ? 
                    `
                    <a class="fork-count" href="#">
                      <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg> 
                      ${repository.node.forkCount}
                    </a>
                    `: ''
                  }

                  <span class="timestamp">
                    ${getHumanTime(repository.node.updatedAt)}
                  </span>

                  `
                }
                    
                  
                </div>
              </div>

              <div class="repository-star">
                <button class="btn">
                  <svg class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>Star
                </button>
              </div>
            </li>
            `
          ))
      
          loading.classList.remove('loading-active')
          
        } else {
          throw new Error('oops🤭, wrong username.')
        }
        


    }).catch(err => {
      if (err.message === 'Failed to fetch' ) {
        err.message = 'Check your internet connection'
      }
      loading.classList.remove('loading-active')
      errors.forEach(error => {
        error.classList.add('error-active')
        error.innerText = err.message
      })
    })
  
    
  };


  

let getHumanTime = (vlaue) => {

  // MONTHS IN SHORT
  const shortMonths = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // GETTING CURRENT MONTHS USED FOR EVALUATION
  let currentMonth = new Date().getMonth()



  updatedAt = new Date(vlaue)

  let updatedAtMiliseconds =  Date.parse(vlaue)
  let now = new Date().getTime()
  let timestamp = updatedAtMiliseconds - now

  // CONVER TO APOSITIVE INTIGER
  let time = Math.abs(timestamp);

  
  // IF THERE ARE MONTHS
	if (time > (1000 * 60 * 60 * 24 * 30)) {
    let months = parseInt(time / (1000 * 60 * 60 * 24 * 30), 10);
    if (months === 1) {
      humanTime =  'Updated 1 month ago'
    } else {
      months = (currentMonth + 1)  - months
      if (months >= 1) {
        months = shortMonths[months]
        humanTime = `Updated on ${months} ${updatedAt.getDate()}` 
      } else {
        months = shortMonths[updatedAt.getMonth() + 1]
        humanTime = `Updated on ${months} ${updatedAt.getDate()}, ${updatedAt.getFullYear()}`  
      }   
    }
    return humanTime

	}

  // IF THERE ARE DAYS
    else if (time > (1000 * 60 * 60 * 24)) {
      let  days = parseInt(time / (1000 * 60 * 60 * 24), 10);
      days === 1 ? days = `Updated yesterday` : days = `Updated ${days} days ago`
      return days

  }

  // IF THERE ARE HOURS
    else if (time > (1000 * 60 * 60)) {
      let  hours = parseInt(time / (1000 * 60 * 60), 10);
      hours === 1 ? hours = `Updated ${hours} hour ago ` : hours = `Updated ${hours} Hours ago`
      return hours
    }

  // If THERE ARE MINUTES
    else if (time > (1000 * 60)) {
      let minutes = parseInt(time / (1000 * 60), 10);
      minutes === 1 ? minutes = `Updated ${minutes} minute ago` : minutes = `Updated ${minutes} minutes ago`
      return minutes
      
    }

  // OTHER WISE USE SCONDS
  else {
    let seconds = parseInt(time / (1000), 10);
      seconds === 1 ? seconds = `Updated now` : seconds = `Updated ${seconds} seconds ago`
      return seconds
      
  }
};
   



// GET THE BODY ELELMENT
let body = document.querySelector('body')

// get the details ELEMENT
let details = document.querySelectorAll('details')


// ONCLICK OF THE BODY SET ALLL DETAILS OPEN ATTRIBUTE TO FALSE
body.addEventListener('click', () => { 
  details.forEach(e => e.open = false)
})


// SCROLL EVENT ON WINDOWS 
window.onscroll = () =>  stickyElement()

// GET THE HEADER CLASS ON LARGE SCREEN
let headerLarge = document.querySelector(".main-header.large")

// GET THE HEADER CLASS ON MOBILE SCREEN
let headerMobile = document.querySelector(".main-header.mobile");


//GET THE USERNAME CLASS
let nickname = document.querySelector(".nickname");

// GET THE USERPROFILE CARD
let userProfileSticky = document.querySelector(".user-profile-sticky-bar");


// FUNCTION FOR STICKY ELMENTS
let stickyElement = () => {


  // FOR STICKY HEADER ON LARGE SCREEN

  // GET THE HEADER TAG
  let header = document.querySelector('header').getBoundingClientRect();



  // CHECK IF THE HEADER IS OFF SCREEN
  if (header.bottom < -19) {
    
    // SET THE MAIN HEADER STICKY
    headerLarge.classList.add("sticky");
  } else {

    // REMOVES THE MAIN HEADER STICKY
    headerLarge.classList.remove("sticky");
  }


  // FOR STICKY HEADER ON MOBILE SCREEN

  // GET THE BOUNDING CLIENT OF TH MAIN HEADER ON MOBILE
  let stickyHeaderMobile = document.querySelector(".main-header.mobile").getBoundingClientRect();

  // GET THE USER DETAILS ABOVE THE  MAIN HEADER MOBILE
  let userDetails = document.querySelector(".user-details").getBoundingClientRect();

  // CHECK IF THE MOBILE MAIN HEADER IS AT THE TOP
  if (stickyHeaderMobile.top < 1) {

    // ADD STICKY CLASS FOR MAIN HEADER MOBILE
    headerMobile.classList.add("sticky");
  }
  if (userDetails.bottom > -19) {
    headerMobile.classList.remove("sticky"); 
  }
   
  

  // FOR STICKY CARD

  // GET THE USERNAME ELEMENT 
  let rect = document.querySelector('.nickname').getBoundingClientRect();
  
  // CHECK THE USERNAME ELEMENT POSITION 
  if (rect.top < 51) {
    
  // SET THE USER STICKY CARD TO VISIBLE
    userProfileSticky.classList.add('visible')
    
  // SET THE USERNAME TO HIDDEN
    nickname.classList.add('not-visible')
  }else{
    userProfileSticky.classList.remove('visible')
    nickname.classList.remove('not-visible')

  } 

}

// GETTING THE INPUT FORM ON LARGE SCREEN
let formLarge = document.forms.searchInput
// console.log(form.search.value);
formLarge.addEventListener("submit", (e)  => {
  e.preventDefault()
  fetchedUser = formLarge.search.value
  formLarge.search.value = ''
  fetchData()
})

//GETTING THE INPUT FORM ON MOBILE
let formMobile = document.forms.searchMobile

formMobile.addEventListener("submit", (e) => {
  e.preventDefault()
  fetchedUser = formMobile.search.value
  formMobile.search.value = ''
  fetchData()
})