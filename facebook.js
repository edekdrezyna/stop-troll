var observer = new MutationObserver(() => {
    initLabels();
    addEvent();
});
var config = { attributes: false, childList: true, subtree: true, characterData: false };
observer.observe(document.body, config);

function initLabels() {
    addUnassignedUserButtons(getCommentsList());
    chrome.storage.local.get('blockList', (res) => {
        const blockedUsersSet = new Set(res.blockList);
        addLabelToUsersFromList(getCommentsList(), blockedUsersSet)
    });
}

function addUnassignedUserButtons(userList, useParent = true) {
    userList.forEach((el) => {
        const button = createUnassignedUserButton(el.innerText);
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
    button.addEventListener('click',(e) => { 
        e.preventDefault();
        e.stopPropagation();
        addToBlockList(username);
    },true);
    return button
}

function addTrollUserButton(elementList, isParent = true) {
    elementList.map((el) => {
        const button = document.createElement('button');
        const username = el.innerText
        button.addEventListener('click',(e) => { 
            e.preventDefault();
            e.stopPropagation();
            deleteLabelFromList(username);
        },true);
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
    document.addEventListener("click", ()=>setTimeout(initLabels, 1000));
}

function getFreshAccounts(){
    return Array.from(document.getElementsByClassName('color-0 showProfileSummary'));
}

function getCommentsList(){
    const comments = Array.from(document.querySelectorAll("a > span > span[dir=auto]"))
    const authors =  Array.from(document.querySelectorAll("a > strong > span"))
    const authorsInGroups =  Array.from(document.querySelectorAll("span > a > b"))
    const all = [...comments, ...authors, ...authorsInGroups ]   
    return all
}

function addLabelToUsersFromList(userList, blockedList, isParent = true) {
    const trollUsers = userList.filter((el) => blockedList.has(el.innerText));
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
    const filtered = getCommentsList().filter((el) => el.innerText === userName);
    filtered.forEach((el) =>
    {
        const parent = el.parentNode;
        trollEl = parent.getElementsByClassName('troll')[0]
        if(trollEl){
            parent.removeChild(trollEl);
            const button = createUnassignedUserButton(el.innerText);
            parent.appendChild(button);
        }
    })

}