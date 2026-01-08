firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function handleAuth(email, password, isLogin) {
    const action = isLogin 
        ? auth.signInWithEmailAndPassword(email, password)
        : auth.createUserWithEmailAndPassword(email, password);

    action.then(() => {
        showMain(); // Повертаємось в меню після успіху
    }).catch(error => {
        alert("Помилка: " + error.message);
    });
}

function handleLogout() {
    auth.signOut().then(() => location.reload());
}

// Перевірка статусу при завантаженні
auth.onAuthStateChanged(user => {
    window.currentUser = user;
    showMain(); // Оновити меню (показати кнопку виходу або входу)
});