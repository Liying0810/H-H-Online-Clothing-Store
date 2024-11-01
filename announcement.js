<script type="module">
     // Firebase Configuration (Replace with your Firebase project config)
     import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
     import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
     import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

     const firebaseConfig = {
         apiKey: "AIzaSyDG4Fb2hlLRCcSswAt4nIakTBnm4od1oiw",
         authDomain: "hh-online-clothing-store.firebaseapp.com",
         projectId: "hh-online-clothing-store",
         storageBucket: "hh-online-clothing-store.appspot.com",
         messagingSenderId: "75598662869",
         appId: "1:75598662869:web:67cce0478bb5385867a65c"
     };

     // Initialize Firebase
     const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     const auth = getAuth(app);

     // Example: Automatically sign in a user
     signInAnonymously(auth).then(() => {
         console.log('User signed in anonymously');
         loadUserAnnouncements(); // Load announcements after sign-in
     });

     // Function to Add an Announcement
     function addAnnouncement() {
         const userId = auth.currentUser ? auth.currentUser.uid : null;
         if (!userId) {
             console.error("User is not authenticated");
             return;
         }

         const title = document.getElementById('title').value;
         const description = document.getElementById('description').value;
         const date = document.getElementById('date').value;
         const expiration = document.getElementById('expiration').value;

         addDoc(collection(db, "announcements"), {
             userId: userId,
             title: title,
             description: description,
             date: date,
             expiration: expiration,
             createdAt: serverTimestamp()
         })
         .then(() => {
             alert("Announcement added successfully!");
             clearForm();
             loadUserAnnouncements(); // Reload the user's announcements
         })
         .catch((error) => {
             console.error("Error adding announcement: ", error);
         });
     }

     // Function to Load User-Specific Announcements
     function loadUserAnnouncements() {
         const userId = auth.currentUser.uid;

         const q = query(
             collection(db, "announcements"),
             where("userId", "==", userId),
             orderBy("createdAt", "desc")
         );

         getDocs(q).then((querySnapshot) => {
             const tableBody = document.getElementById('announcementTableBody');
             tableBody.innerHTML = ''; // Clear the table before adding new data

             querySnapshot.forEach((doc) => {
                 const announcement = doc.data();
                 tableBody.innerHTML += `
                     <tr>
                         <td>${announcement.title}</td>
                         <td>${announcement.description}</td>
                         <td>${announcement.date}</td>
                         <td>${announcement.expiration}</td>
                         <td>
                             <button onclick="editAnnouncement('${doc.id}', '${announcement.title}', '${announcement.description}', '${announcement.date}', '${announcement.expiration}')">Edit</button>
                             <button onclick="deleteAnnouncement('${doc.id}')">Delete</button>
                         </td>
                     </tr>
                 `;
             });
         })
         .catch((error) => {
             console.error("Error loading announcements: ", error);
         });
     }

     // Remaining functions (editAnnouncement, updateAnnouncement, deleteAnnouncement, clearForm) remain the same, just update Firebase function names if needed.
</script>

