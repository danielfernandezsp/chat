const buttons = document.querySelector('#buttons');
const userName = document.querySelector('#userName');
const userEmail = document.querySelector('#userEmail');
const userPhoto = document.querySelector('#userPhoto');

// Tenemos un observador que detecta cuando hay un usuario activo y cuando no
firebase.auth().onAuthStateChanged(user => {

    // Si hay usuario le sale el boton cerrar sesion
    if (user) {
      console.log(user);
      console.log("Registrado con exito: "+ user.displayName);
      buttons.innerHTML = /*html*/`
        <button class="btn btn-outline-danger mr-2" id="btnSingOut">Salir</button>
      `
      singOut();

      // Pinta el nombre de usuario
      userPhoto.innerHTML = /*html*/`
        <img class="img-thumbnail w-100" src="${user.photoURL}" alt="">
      `
      // Pinta el nombre de usuario
      userName.innerHTML = user.displayName;
      // Pinta el correo del usuario
      userEmail.innerHTML = /*html*/`
        <p class="text-center lead mt-5">Bienvenido ${user.email}</p>
      `

    // Si no hay usuario le sale el boton acceder
    } else {
        console.log("Sin registrar");
        buttons.innerHTML = /*html*/`
          <button class="btn btn-outline-success mr-2" id="btnSingIn">Acceder</button>
        `
        // Llama a la funcion que hace posible el inicio de sesion
        singIn();

        // Pinta el nombre de usuario
        userPhoto.innerHTML = /*html*/`
          <img class="img-thumbnail w-100" src="https://www.saberis.es/wp-content/uploads/2018/07/user.png" alt="">
        `
        // Pinta Chat donde iria el nombre de usuario
        userName.innerHTML = "Chat";
        // Pinta un aviso de que no esta registrado
        userEmail.innerHTML = /*html*/`
          <p class="text-center lead mt-5">Inicia sesión</p>
        `
    }
  });

  // Funcion de inicio de sesion con google
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

  const singOut = () => {
    const btnSingOut = document.querySelector('#btnSingOut');
    btnSingOut.addEventListener('click', () => {
      firebase.auth().signOut();
    })
  }