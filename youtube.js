var observer = new MutationObserver(() => {
    initLabels();
});
var config = { attributes: false, childList: true, subtree: true, characterData: false };
observer.observe(document.body, config);

function initLabels() {
    comments = getCommentsList()
    addUnassignedUserButtons(comments);
    chrome.storage.local.get('blockList', (res) => {
        const blockedUsersSet = new Set(res.blockList);
        addLabelToUsersFromList(comments, blockedUsersSet)
    });
}

function addUnassignedUserButtons(userList, useParent = true) {
    userList.forEach((el) => {
        const button = createUnassignedUserButton();
        const parent = useParent ? el.parentNode : el;
        const isUnassigned = parent.getElementsByClassName('unassigned')[0];
        const isTroll = parent.getElementsByClassName('troll')[0];
        if (!isUnassigned && !isTroll) {
            parent.appendChild(button)
        }
    })
}

function createUnassignedUserButton() {
    const button = document.createElement('button');
    button.className = 'unassigned';
    button.innerText = 'Oznacz';
    button.addEventListener('click',(e) => {
        e.preventDefault();
        e.stopPropagation();
        addToBlockList(Array.from(button.parentNode.children).filter((e)=>e != button)[0].innerText.split(' ').join(''));
    },true);
    return button
}

function addTrollUserButton(elementList, isParent = true) {
    elementList.map((el) => {
        const button = document.createElement('button');
        button.addEventListener('click',(e) => { 
            e.preventDefault();
            e.stopPropagation();
            deleteLabelFromList(Array.from(button.parentNode.children).filter((e)=>e != button)[0].innerText.split(' ').join(''));
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

function getFreshAccounts(){
    return Array.from(document.getElementsByClassName('color-0 showProfileSummary'));
}

function getCommentsList(){
    const channelOwner = Array.from(document.querySelectorAll("ytd-channel-name > div > div > yt-formatted-string > a"))
    const commentAuthor = Array.from(document.querySelectorAll("a[id=author-text] > span"))
    const channelCommenter = Array.from(document.querySelectorAll("a > ytd-channel-name[id=channel-name] > div > div > yt-formatted-string"))
    const all = [...channelOwner, ...commentAuthor, ...channelCommenter]
    return all
}


function clearBlockList() {
    chrome.storage.local.get('blockList', (res) => {
        chrome.storage.local.set({blockList: []}, () => {
            console.log('Clean');
        });
    });
}



function addLabelToUsersFromList(userList, blockedList, isParent = true) {
    const trollUsers = userList.filter((el) => blockedList.has(el.innerText.split(' ').join('')));
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
    const filtered = getCommentsList().filter((el) => el.innerText.split(' ').join('') === userName);
    filtered.forEach((el) =>
    {
        const parent = el.parentNode;
        trollEl = parent.getElementsByClassName('troll')[0]
        if(trollEl){
            parent.removeChild(trollEl);
            const button = createUnassignedUserButton();
            parent.appendChild(button);
        }
    })
}