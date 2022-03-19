var observer = new MutationObserver(() => {
    initLabels();
    addEvent();
});
var config = { attributes: false, childList: true, subtree: true, characterData: false };
observer.observe(document.body, config);

function initLabels() {
    deleteFreshAccounts();
    addUnassignedUserButtons(getCommentsList());
    chrome.storage.local.get('blockList', (res) => {
        const blockedUsersSet = new Set(res.blockList);
        addLabelToUsersFromList(getCommentsList(), blockedUsersSet)
    });
}

function addUnassignedUserButtons(userList, useParent = true) {
    userList.forEach((el) => {
        const button = createUnassignedUserButton(el.children[0].innerText);
        const parent = useParent ? el.parentNode : el;
        const isUnassigned = parent.getElementsByClassName('unassigned')[0];
        const isTroll = parent.getElementsByClassName('troll')[0];
        if (!isUnassigned && !isTroll) {
            parent.appendChild(button)
        }
    })
}

function createUnassignedUserButton(username) {
    const button = document.createElement('button');
    button.className = 'unassigned';
    button.innerText = 'Oznacz';
    button.onclick = () => addToBlockList(username);
    return button
}

function addTrollUserButton(elementList, isParent = true) {
    elementList.map((el) => {
        const button = document.createElement('button');
        const username = el.children[0].innerText
        button.onclick = () => deleteLabelFromList(username);
        button.className = 'troll';
        button.innerText = 'troll';
        const parent = isParent ? el.parentNode : el;
        const isTroll = parent.getElementsByClassName('troll')[0];
        if (!isTroll) {
            parent.appendChild(button)
        }
        const isUnassigned = parent.getElementsByClassName('unassigned')[0];
        if (isUnassigned) {
            parent.removeChild(isUnassigned)
        }
    })
}



function addEvent() {
    const extendButtons = Array.from(document.getElementsByClassName('affect ajax'));
    extendButtons.forEach((el) => el.onclick = () => setTimeout(initLabels, 1000))
    document.addEventListener("click", ()=>setTimeout(initLabels, 1000));
}

function getFreshAccounts(){
    return Array.from(document.getElementsByClassName('color-0 showProfileSummary'));
}

function getCommentsList(){
    const orangeAccounts = Array.from(document.getElementsByClassName('color-1 showProfileSummary'));
    const redAccounts = Array.from(document.getElementsByClassName('color-2 showProfileSummary'));
    return [...orangeAccounts, ...redAccounts];
}


function clearBlockList() {
    chrome.storage.local.get('blockList', (res) => {
        chrome.storage.local.set({blockList: []}, () => {
            console.log('Clean');
        });
    });
}



function deleteFreshAccounts() {
    hideOrReplaceComment(getFreshAccounts())
}

function addLabelToUsersFromList(userList, blockedList, isParent = true) {
    const trollUsers = userList.filter((el) => blockedList.has(el.children[0].innerText));
    addTrollUserButton(trollUsers, isParent);
    addUnassignedUserButtons(userList);
}

function addToBlockList(username) {
    chrome.storage.local.get('blockList', (res) => {
        const oldStorage = res.blockList;
        const newStorage = oldStorage ? [...oldStorage, username] : [username];
        const blockedUsersSet = new Set(newStorage);
        chrome.storage.local.set({blockList: newStorage}, () => {
            console.log(`${username} added to block list`);
        });
        addLabelToUsersFromList(getCommentsList(), blockedUsersSet);
    });
}

function hideOrReplaceComment(elementList) {
    elementList.map((el) => {
        if(el){
            const wannabeSub = el.parentNode.parentNode.parentNode.parentNode.parentNode;
            const parent = el.parentNode.parentNode.parentNode;
            if (wannabeSub.className !== 'sub') {
                const newUserText = 'Nowy użytkownik, rozwijasz spoiler na własną odpowiedzialność:'
                if(!parent.getElementsByClassName("text")[0].innerHTML.includes(newUserText)){
                    parent.getElementsByClassName("text")[0].innerHTML = newUserText + `<br><a class="showSpoiler">pokaż spoiler</a><code class="dnone">
                    ${parent.getElementsByClassName("text")[0].innerHTML}</code>`
                }
            } else {
                parent.parentNode.removeChild(parent)
            }
        }
    })
}

function deleteLabelFromList(username) {
    chrome.storage.local.get('blockList', (res) => {
        const oldStorage = res.blockList;
        let storageSet = new Set(oldStorage)
        if(oldStorage){
            storageSet.delete(username)
            deleteLabelFromPage(username);
            addLabelToUsersFromList(getCommentsList(), storageSet);
            addUnassignedUserButtons(getCommentsList());
        }
        chrome.storage.local.set({blockList: Array.from(storageSet)}, () => {
            console.log(`${username} deleted from block list`);
        });
    });
}

function deleteLabelFromPage(userName) {
    const filtered = getCommentsList().filter((el) => el.children[0].innerText === userName);
    filtered.forEach((el) =>
    {
        const parent = el.parentNode;
        parent.removeChild(parent.getElementsByClassName('troll')[0]);
        const button = createUnassignedUserButton(el.children[0].innerText);
        parent.appendChild(button);
    })

}


// IN PROGRESS, CREATED TO MARK EASIER ONES WHO UPVOTE POSTS
// function addButtonsToVoters(){
//     const voterList = Array.from(document.getElementsByClassName("usercard width-one-third m-reset-width lcontrast"));
//     if(voterList){
//         addUnassignedUserButtons(voterList, false);
//         chrome.storage.local.get('blockList', (res) => {
//         console.log(res);
//         const blackMap = new Map(res.blockList);
//         addLabelToUsersFromList(voterList, blackMap, false)
//     });
//     }
    
// }

// function addListener(){
//     const votersBut = document.getElementById('voters');
//     votersBut.onclick = () => setTimeout(addButtonsToVoters, 2000)
// }