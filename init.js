document.getElementById("chat-form").addEventListener("submit", (e) => {
	e.preventDefault();
	window.api.sendMessage();
})
// document.getElementById("get-friends").addEventListener("click", async (e) => {
// 	const friends = await window.api.getFriends();
// 	const friendList = document.getElementById("friend-list");
// 	friendList.innerHTML = "";
// 	friendList.append(...friends.map(x => {
// 		const li = document.createElement("li");
// 		li.innerText = `[${x.id}] ${x.name}`;
// 		return li;
// 	}));
// })
document.getElementById("nav-btn").addEventListener("click", async (e) => {
	let w=document.getElementById("nav").style.width;
	console.log(w);
	if (w==""){
		document.getElementById("nav").style.width='300px';
	}else{
		document.getElementById("nav").style.width='';
	}
})

document.addEventListener('DOMContentLoaded', function () {
	const chatBox = document.getElementById('chat-box');
	chatBox.addEventListener('input', function () {
		autoExpand(chatBox);
	});
});

function autoExpand(textarea) {
	textarea.style.height = 'auto';
	textarea.style.height = textarea.scrollHeight + 'px';
}

let highlight=false;
        document.getElementById("chat-box").addEventListener("click", async (e) => {
            let w=document.getElementById("dispose").style.height;
            console.log(w);
            if (highlight){
                document.getElementById("dispose").style.flex='0';
                highlight=false;
            }else{
                document.getElementById("dispose").style.flex='1';
                highlight=true;
            }
        })
