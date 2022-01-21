const showSearchForm = document.querySelector("#showSearchForm");
const charTilesSection = document.querySelector("#charTilesSection");
const showTilesSection = document.querySelector("#showTilesSection");
const clearImagesButton = document.querySelector("#clearImagesButton")

showSearchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const showSearchTerm = showSearchForm.elements.query.value;
    const res = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${showSearchTerm}`
    );
    showSearchForm.elements.query.value = "";
    removeAllChildNodes(showTilesSection)
    removeAllChildNodes(charTilesSection)
    makeShowDivs(res.data);

});


const makeShowDivs = (showArray) => { //showArray is an array containing TV show data
    for (let result of showArray) {
        if (result.show.image) { //if result has an image, execute the next function with that result
            createShowHtmlElements(result);

        }
    }
};

const createShowHtmlElements = (result) => {    //result is an object with data about a TV show
    const showDiv = document.createElement("div");
    showDiv.className = "showDiv";
    showTilesSection.appendChild(showDiv);

    const img = document.createElement("img");
    img.className = "showImg";
    img.src = result.show.image.medium;
    showDiv.appendChild(img);

    let showID = result.show.id;

    img.addEventListener("click", async function (e) {
        e.preventDefault;
        const res2 = await axios.get(`https://api.tvmaze.com/shows/${showID}/cast`);
        makeCharDivs(res2.data);

        removeAllChildNodes(showTilesSection);
    })
}

clearImagesButton.addEventListener("click", function (e) {
    e.preventDefault;
    removeAllChildNodes(charTilesSection);
    removeAllChildNodes(showTilesSection);

})

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


const makeCharDivs = (cast) => {
    for (let member of cast) {
        if (member.character.image) {
            ageCalc(member);
        } else {
            console.log(`Some data but no pic for ${member.character.name}`)
        }
    }
};

const ageCalc = (member) => {
    let today = new Date();
    let age;
    if (member.person.birthday === null) {
        age = "n/a";
    } else {
        let birthDate = new Date(member.person.birthday);
        age = today.getFullYear() - birthDate.getFullYear();
        let m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    }
    createCharHtmlElements(member, age);
};

const createCharHtmlElements = (member, age) => {
    const charDiv = document.createElement("div");
    charDiv.className = "charDiv";
    charTilesSection.appendChild(charDiv);

    const img = document.createElement("img");
    img.className = "charImg";
    img.src = member.character.image.medium;
    charDiv.appendChild(img);

    const lineBreak = document.createElement("br");
    charDiv.appendChild(lineBreak);

    const actorName = document.createElement("a");
    actorName.classList = "actorName";
    actorName.target = "_blank";
    let linkTextActor = document.createTextNode(`${member.person.name} (Age:${age})`);
    actorName.appendChild(linkTextActor);
    let nameStr = member.person.name;
    let replaced = nameStr.split(' ').join('+');
    actorName.href = `https://www.imdb.com/search/name/?name=${replaced}`;
    charDiv.appendChild(actorName);

    const playsName = document.createElement("span");
    playsName.classList = "playsName";
    playsName.innerText = " plays ";
    charDiv.appendChild(playsName);

    const charName = document.createElement("a");
    charName.classList = "charName";
    charName.target = "_blank";
    let linkTextChar = document.createTextNode(`${member.character.name}`);
    charName.appendChild(linkTextChar);
    charName.href = member.character.url;
    charDiv.appendChild(charName);
}



