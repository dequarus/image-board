// 🔥 Firebase Config (Replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyABZU75IAEn_5r71W7vxO2aD-Z3WTGJFvM",
    authDomain: "image-board-ec884.firebaseapp.com",
    databaseURL: "https://image-board-ec884-default-rtdb.firebaseio.com",
    projectId: "image-board-ec884",
    storageBucket: "image-board-ec884.firebasestorage.app",
    messagingSenderId: "458708997242",
    appId: "1:458708997242:web:9030a0cead83c36f2257c3",
    measurementId: "G-MJKB0K45VJ"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 🖼️ Upload Image to Imgur
function uploadImage() {
    let fileInput = document.getElementById("imageUpload");
    let file = fileInput.files[0];

    if (!file) {
        alert("select an image");
        return;
    }

    let formData = new FormData();
    formData.append("image", file);

    fetch("https://api.imgur.com/3/image", {
        method: "POST",
        headers: {
            "Authorization": "9dcd0d8d2161ebf"
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            saveToFirestore("image", data.data.link);
        } else {
            alert("Image upload failed.");
        }
    })
    .catch(error => console.error("Error:", error));
}

// ✍️ Upload Text Note
function uploadNote() {
    let textNote = document.getElementById("textNote").value;

    if (!textNote.trim()) {
        alert("type seomthing here");
        return;
    }

    saveToFirestore("note", textNote);
}

// 🔥 Save to Firebase Firestore
function saveToFirestore(type, content) {
    db.collection("uploads").add({
        type: type,
        content: content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        displayContent(type, content);
    })
    .catch(error => console.error("Error saving:", error));
}

// 📌 Display Uploaded Content on the Page
function displayContent(type, content) {
    let gallery = document.getElementById("gallery");
    let item = document.createElement("div");
    item.classList.add(type === "image" ? "image-item" : "note-item");

    if (type === "image") {
        let img = document.createElement("img");
        img.src = content;
        img.style.width = "200px"; // Set a fixed width
        img.style.margin = "20px"; // 🟢 Add spacing between images
        item.appendChild(img);
    } else {
        let text = document.createElement("p");
        text.innerText = content;
        item.appendChild(text);
    }

    gallery.appendChild(item);
}

// 🏗️ Load Existing Content from Firestore on Page Load
db.collection("uploads").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    document.getElementById("gallery").innerHTML = "";
    snapshot.forEach(doc => {
        let data = doc.data();
        displayContent(data.type, data.content);
    });
});
