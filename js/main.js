// var
let allRepos = [];
let idx = 0;
let pageNo = 1;
let modeBtn = document.querySelector(".mode a");
let landingSection = document.querySelector(`.landing`);
let landingForm = document.querySelector(`.landing .data .search`);
let searchInLanding = document.querySelector(`.landing .data .search input[type="text"]`);
let searchBtnLanding = document.querySelector(`.landing .data .search input[type="submit"]`);
let errorMes = document.querySelector(`.landing .data .error`);
let contentDiv = document.querySelector('.content');
let userInPhone = document.querySelector(`.landing .data i`);
let userSectio = document.querySelector(`.content aside`);
let repoSection = document.querySelector(`.content main`);
let closeBtn = document.querySelector(`.content aside > i`);

// user section
let userImg = document.querySelector(`.content aside .head .img img`);
let userName = document.querySelector(`.content aside .head h2`);
let userUsername = document.querySelector(`.content aside .head a`);
let userJoinDate = document.querySelector(`.content aside .head .join-date .date`);
let userbio = document.querySelector(`.content aside .bio`);
let userRepos = document.querySelector(`.content aside .statistics .box .repo-nums`);
let userFollowers = document.querySelector(`.content aside .statistics .box .followers-nums`);
let userFollowing = document.querySelector(`.content aside .statistics .box .following-nums`);
let userCamp = document.querySelector(`.content aside .links .camp span`);
let userLocation = document.querySelector(`.content aside .links .location span`);
let userWeb = document.querySelector(`.content aside .links .website span`);
let userTwitter = document.querySelector(`.content aside .links .twitter span`);

// repos section
let reposData = document.querySelector(`.content main .data`);
let pageSection = document.querySelector(`.content main .page`);
let prvBtn = document.querySelector(`.content main .page ul li .prv`);
let nxtBtn = document.querySelector(`.content main .page ul li .nxt`);

// events
landingForm.addEventListener("submit",(e) => {
    e.preventDefault();
})

closeBtn.addEventListener("click",() => {
    if (userSectio.classList.contains("active")) {
        userSectio.classList.remove("active");
        repoSection.style.display = "block";
    }
})

userInPhone.addEventListener("click",() => {
    if (!userSectio.classList.contains("active") && landingSection.classList.contains("header-mode")) {
        userSectio.classList.add("active");
        repoSection.style.display = "none";
    }
})

window.addEventListener('resize', () =>  {
    let x = window.matchMedia("(max-width: 600px)");
    if (x.matches && landingSection.classList.contains("header-mode")) {
        userInPhone.style.display = "block";
    } else {
        userInPhone.style.display = "none";
    }
}, true);

prvBtn.addEventListener("click",prv);
nxtBtn.addEventListener("click",nxt);

searchInLanding.addEventListener("focus", hideInvalidMes);

modeBtn.addEventListener("click",changeMode);
searchBtnLanding.addEventListener("click",search);

// functions

function getDateFormate(date) {
    let d = new Date(date);
    return `: ${d.getFullYear()} - ${d.getMonth()} - ${d.getDay()}`;
}

function showInvalidMes() {
    errorMes.style.display = "block";
}

function hideInvalidMes() {
    errorMes.style.display = "none";
}

function changeMode() {
    if(document.body.classList.toggle("light-theme")) {
        if(document.body.classList.contains("light-theme")) {
            modeBtn.innerHTML = `Dark <i class="fa-solid fa-moon"></i>`;
        }
    } else {
        modeBtn.innerHTML = `Light <i class="fa-solid fa-sun"></i>`;
    }
}

function search() {

    let val = searchInLanding.value.trim();
    errorMes.textContent = "Plese Enter valid username";
    if (val === "") {
        contentDiv.style.display = "none";
        if (landingSection.classList.contains("header-mode")) {
            landingSection.classList.remove("header-mode");
            userInPhone.style.display = "none";
        }
        showInvalidMes();
    } else {
        
        getUser(val);
    }
    
}

function getUser(target) {
    let url = `https://api.github.com/users/${target}`;
    fetch(url)
    .then(res => res.json())
    .then(res => displayUser(res))
    .catch(Error("Error"));
}

function getRepos(url) {
    fetch(url)
    .then(res => res.json())
    .then(res => displayRepos(res))
    .catch(Error("Error"));
}


function displayUser(data) {
    if(data.hasOwnProperty('message')) {
        contentDiv.style.display = "none";
        errorMes.textContent = data["message"];
        userInPhone.style.display = "none";
        showInvalidMes();
    } else {
        if (!landingSection.classList.contains("header-mode")) {
            landingSection.classList.add("header-mode");
        }
        
        displayUserData(data);
        getRepos(data["repos_url"]);
        
        contentDiv.style.display = "block";

    }
}

function displayUserData(data) {
    let name = data["name"];
    let username = data["login"];
    let imgUrl = data["avatar_url"];
    let gitHubUrl = data["html_url"];
    let bio = data["bio"];
    let reposNum = data["public_repos"];
    let followers = data["followers"];
    let following = data["following"];
    let joinDate = data["created_at"];
    let company = data["company"];
    let location = data["location"];
    let twitter = data["twitter_username"];
    let web = data["blog"];

    userImg.src = imgUrl;
    userName.textContent = name;
    userUsername.textContent = `@${username}`;
    userUsername.href = gitHubUrl;
    userbio.textContent = bio;
    userJoinDate.textContent = getDateFormate(joinDate);
    userRepos.textContent = reposNum;
    userFollowers.textContent = followers;
    userFollowing.textContent = following;
    userCamp.textContent = company ?? "not avalabile";
    userLocation.textContent = location ?? "not avalabile";
    if (web === "")
        web = "not avalabile"
    userWeb.textContent = web;
    userTwitter.textContent = twitter ?? "not avalabile";

}

function createRepoDiv(data) {
    
    return `<div class="repo">
                        <div class="head">
                        <a href="${data["html_url"]}" target="_blank"><h2 class="repo-name">${data["full_name"]}</h2></a>
                        </div>
                        <div class="dis">
                            <p class="repo-dis">${data["description"] ?? ""}</p>
                            ${getRepoDis(data["topics"])}
                            ${getLang(data["language"])}
                        </div>
                        <div class="date">
                            <span class="create">created_at <span>${getDateFormate(data["created_at"])}</span></span>
                            <span class="create">updated_at <span>${getDateFormate(data["updated_at"])}</span></span>
                        </div>
                    </div>`;
}

function getElm(data) {
    let ul = "";
    data.forEach((elm) => {
        ul += `<li>${elm}</li>`
    })
    return ul;
}

function getLang(data) {
    if (data === null) {
        return ``;
    } else {
        return `<p class="lang">${data}</p>`;
    }
}

function getRepoDis(data) {

    if(data.length === 0) {
        return ``;
    } else {

        return `<div class="topic">
                    <ul>
                        ${getElm(data)};
                    </ul>
                </div>`
    }

}

function displayRepos(data) {
    allRepos = data;
    idx = 0;
    pageNo = 1;
    addRepos(allRepos,idx,pageNo);
}

function addRepos(allRepos,i,pageNo) {
    let elm = ``;
    let j = 0;
    // console.log(i);
    while(j < 4 && i < allRepos.length) {
        elm += createRepoDiv(allRepos[i]);
        ++i;
        ++j;
    }
    idx += 4;
    reposData.innerHTML = elm;

    if (allRepos.length > 4) {
        pageSection.style.display = "block";

        if (pageNo > 1) {
            prvBtn.classList.remove("disabled");
            prvBtn.removeAttribute("disabled");
        } else {
            prvBtn.classList.add("disabled");
            prvBtn.setAttribute("disabled","");
        }

        if (pageNo < Math.ceil(allRepos.length / 4)) {
            nxtBtn.classList.remove("disabled");
            nxtBtn.removeAttribute("disabled");
        } else {
            nxtBtn.classList.add("disabled");
            nxtBtn.setAttribute("disabled","");
        }
        
    }

    
}

function prv() {
    pageNo -=1;
    idx -=8;
    addRepos(allRepos,idx,pageNo);
}

function nxt() {
    pageNo +=1;
    console.log(`${pageNo} - ${allRepos.length}`);
    addRepos(allRepos,idx,pageNo);
}