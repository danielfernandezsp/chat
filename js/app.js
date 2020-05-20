const buttons = document.querySelector('#buttons');
const userName = document.querySelector('#userName');
const chatContent = document.querySelector('#chatContent');
const userPhoto = document.querySelector('#userPhoto');
const messageForm = document.querySelector('#messageForm');
const message = document.querySelector('#message');

// OBSERVADOR QUE CONTROLA SI HAY USUARIOS CONECTADOS
// ---------------------------
firebase.auth().onAuthStateChanged(user => {

    // Si hay usuario le sale el boton cerrar sesion
    if (user) {
        console.log(user);
        console.log("Registrado con exito: " + user.displayName);
        buttons.innerHTML = /*html*/ `
        <button class="btn btn-outline-danger mr-2" id="btnSingOut">Salir</button>
      `
        chatContent.style.setProperty("overflow-y", "scroll");;

        singOut();

        messageForm.classList = 'container input-group fixed-bottom bg-dark';

        // Le manda a la funcion el usuario para que podamos guardar sus datos al mandar mensajes
        chatElements(user);

        // Si no hay usuario le sale el boton acceder
    } else {
        console.log("Sin registrar");
        buttons.innerHTML = /*html*/ `
          <button class="btn btn-outline-success mr-2" id="btnSingIn">Acceder</button>
        `
            // Llama a la funcion que hace posible el inicio de sesion
        singIn();

        // Pinta el nombre de usuario
        userPhoto.innerHTML = /*html*/ `
          <img class="rounded-circle border w-100" src="https://www.saberis.es/wp-content/uploads/2018/07/user.png" alt="">
        `
            // Pinta Chat donde iria el nombre de usuario
        userName.innerHTML = "Chat";
        // Pinta un aviso de que no esta registrado
        chatContent.innerHTML = /*html*/ `
          <p class="text-center text-white lead mt-5">Inicia sesión</p>
        `
        chatContent.style.setProperty("overflow-y", "hidden");;

        messageForm.classList = 'd-none';
    }
});



// GUARDA LOS DATOS EN LA BASE DE DATOS EN FORMATO JSON
// ---------------------------
const chatElements = (user) => {
    // Pinta la imagen de usuario
    userPhoto.innerHTML = /*html*/ `
    <img class="rounded-circle border border-success w-100" src="${user.photoURL}" alt="">
    `
        // Pinta el nombre de usuario
    userName.innerHTML = user.displayName;

    // Cuando envia el mensaje no recarga la pagina
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log(message.value.trim());

        // Si es una cadena vacia no manda nada
        if (!message.value.trim()) {
            console.log("Input vacio");
            return;
        }

        // Si contiene algo guarda en chat un objeto que tiene el texto, el usuario y la fecha
        firebase.firestore().collection('chat').add({
                text: message.value.trim(),
                uid: user.uid,
                photo: user.photoURL,
                date: Date.now()
            })
            .then(res => { console.log('Mensaje guardado'); })
            .catch(e => console.log(e))

        // Borra el contenido del input message
        message.value = '';

    });

    firebase.firestore().collection('chat').orderBy('date').onSnapshot(query => {
        chatContent.innerHTML = '';

        query.forEach(doc => {
            if (doc.data().uid === user.uid) {

                chatContent.innerHTML += /*html*/ `
          <div class="d-flex justify-content-end">
            <p class="to">${doc.data().text}
              <small class="d-flex justify-content-end">${new Date(doc.data().date).getHours()}:${new Date(doc.data().date).getMinutes()}</small>
            </p>
          </div>
        `

            } else {
                chatContent.innerHTML += /*html*/ `
          <div class="d-flex justify-content-start">
          <img class="chatPhoto rounded-circle border border-success" src="${doc.data().photo}" alt="">
            <p class="from">${doc.data().text}
              <small class="d-flex">${new Date(doc.data().date).getHours()}:${new Date(doc.data().date).getMinutes()}</small>
            </p>
          </div>
        `
            }
            chatContent.scrollTop = chatContent.scrollHeight;
        })
    })
}

// INICIO DE SESION CON GOOGLE
// ---------------------------
const singIn = () => {
    const btnSingIn = document.querySelector('#btnSingIn');
    btnSingIn.addEventListener('click', async() => {
        console.log("Click en acceder");
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.log(error);
        }
    });
}

// CERRAR SESION
// ---------------------------
const singOut = () => {
    const btnSingOut = document.querySelector('#btnSingOut');
    btnSingOut.addEventListener('click', () => {
        firebase.auth().signOut();
    })
}