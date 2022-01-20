const castSearchForm = document.querySelector("#castSearchForm");
const charTilesSection = document.querySelector("#charTilesSection");
const clearImagesButton = document.querySelector("#clearImagesButton")



clearImagesButton.addEventListener("click", function(e) {
    e.preventDefault;
    console.log('button clicked');
    removeAllChildNodes(charTilesSection);
  
})

const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


castSearchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const castSearchTerm = castSearchForm.elements.query.value;
    const res = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${castSearchTerm}`
    );
    const showID = res.data[0].show.id;
    const res2 = await axios.get(`https://api.tvmaze.com/shows/${showID}/cast`);
    makeCharDivs(res2.data);
    castSearchForm.elements.query.value = "";
});

const makeCharDivs = (cast) => {
    for (let member of cast) {
        if (member.character.image) {
            ageCalc(member);
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
    createHtmlElements(member, age);
};

const createHtmlElements = (member, age) => {
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
    let linkTextActor = document.createTextNode(`${member.person.name} (${age})`);
    actorName.appendChild(linkTextActor);
    actorName.href = member.person.url;
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


