document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            console.log('Login bem-sucedido:', userCredential.user);
            window.location.href = 'controle.html';
        })
        .catch(function(error) {
            console.error('Erro no login:', error.message);
            alert('Falha no login: ' + error.message);
        });
});