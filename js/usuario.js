//funciones js para el modulo de usuarios

const urlApi = "http://localhost:8080";//colocar la url con el puerto

async function login(){
    let correo = document.querySelector('#myForm #correo').value;
    let contraseña = document.querySelector('#myForm #password').value;
    var jsonData = {
        "correo":correo,
        "password":contraseña,
     
        };
    /*var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }*/
    console.log(jsonData);

    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    //console.log(await request.text());
    if(request.ok){
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'logeado exitosamente',
            showConfirmButton: false,
            timer: 1500
          })
        const respuesta = await request.text();
       
        localStorage.token = respuesta;
        
        //localStorage.token = respuesta;
        localStorage.correo = jsonData.correo; 
        consultarUser()
        //localStorage.id= jsonData.id; 
        setTimeout(function () {
            location.href= "dashboard.html";
        }, 2000);     

       
    }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            text: 'los datos del usuario no son validos',
            showConfirmButton: false,
            timer: 3000
          });
    }
}

function listarUsuarios(){
    validaToken();
    $("#table_usuario").show();
    $("#table_article").hide();
    $("#table_categoria").hide();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuarios",settings)
    .then(response => response.json())
    .then(function(data){
        
            var usuarios = '';
            for(const usuario of data){
                //console.log(usuario.correo)
                var date =usuario.fechaNacimiento+"";
                //console.log(date)
                var dato =date.split('T');
                usuarios += `
                <tr>
                    <th scope="row">${usuario.id}</th>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.apellidos}</td>
                    <td>${usuario.documento}</td>
                    <td>${usuario.direccion}</td>
                    <td>${dato[0]}</td>
                    <td>${usuario.telefono}</td>
                    <td>${usuario.correo}</td>
                    <td>
                    <button type="button" class="btn btn-outline-danger" 
                    onclick="eliminaUsuario('${usuario.id}')">
                        <i class="fa-solid fa-user-minus"></i>
                    </button>
                    <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>  `;
                
            }
            document.getElementById("listar").innerHTML = usuarios;
    })
}

function eliminaUsuario(id){
    validaToken();
    Swal.fire({
        title: 'esta seguro de eliminar este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'si, eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
            var settings={
                method: 'DELETE',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.token
                },
            }
            fetch(urlApi+"/usuario/"+id,settings)
            .then(response => response.text())
            .then(function(data){
                listarUsuarios();
                alertas("Se ha eliminado el usuario exitosamente!",2)
            })
        }
      })
    
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                <input type="hidden" name="id" id="id" value="${usuario.id}">

                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre" id="nombre" required value="${usuario.nombre}"> <br>

                <label for="apellidos"  class="form-label">Apellidos</label>
                <input type="text" class="form-control" name="apellidos" id="apellidos" required value="${usuario.apellidos}"> <br>

                <label for="documento"  class="form-label">Documento</label>
                <input type="text" class="form-control" name="documento" id="documento" required value="${usuario.documento}"> <br>

                
                <label for="direccion"  class="form-label">Direccion</label>
                <input type="text" class="form-control" name="direccion" id="direccion" required value="${usuario.direccion}"> <br>

                <label for="fechaNacimiento"  class="form-label">Fecha de Nacimiento</label>
                <input type="date" class="form-control" name="fechaNacimiento" id="fechaNacimiento" required value="${usuario.fechaNacimiento}"> <br>

                <label for="telefono"  class="form-label">Telefono</label>
                <input type="text" class="form-control" name="telefono" id="telefono" required value="${usuario.telefono}"> <br>

                <label for="correo" class="form-label">Correo</label>
                <input type="email" class="form-control" name="correo" id="correo" required value="${usuario.correo}"> <br>

                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de usuarios";
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarUsuario(id){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    if(request.status=='200'){
        listarUsuarios();
        alertas("Se ha modificado el usuario exitosamente!",1)
        document.getElementById("contentModal").innerHTML = '';
        var myModalEl = document.getElementById('modalUsuario')
        var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
        modal.hide();
    }else{
        Swal.fire({
            position: 'top-end',
            icon: 'error',
            text: 'ingrese los datos de manera correcta',
            showConfirmButton: false,
            timer: 2000
          });
    }
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){  
                var date =usuario.fechaNacimiento+"";
                //console.log(date)
                var dato =date.split('T');              
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-eye"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${usuario.nombre}</li>
                    <li class="list-group-item">apellidos: ${usuario.apellidos}</li>
                    <li class="list-group-item">Documento: ${usuario.documento}</li>
                    <li class="list-group-item">Direccion: ${usuario.direccion}</li>
                    <li class="list-group-item">Fecha : ${dato[0]}</li>
                    <li class="list-group-item">Telefono: ${usuario.telefono}</li>
                    <li class="list-group-item">Correo: ${usuario.correo}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de usuarios";
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function alertas(mensaje,tipo){
    var color ="warning";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}

function registerForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-plus"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myForm1">
            <input type="hidden" name="id" id="id">

            <label for="nombre" class="form-label">Nombre</label>
            <input type="text" class="form-control" name="nombre" id="nombre" required> <br>

            <label for="apellidos"  class="form-label">Apellidos</label>
            <input type="text" class="form-control" name="apellidos" id="apellidos" required> <br>

            <label for="documento"  class="form-label">Documento</label>
            <input type="text" class="form-control" name="documento" id="documento" required> <br>

            <label for="direccion"  class="form-label">Direccion</label>
            <input type="text" class="form-control" name="direccion" id="direccion" > <br>

            <label for="fechaNacimiento"  class="form-label">Fecha de Nacimiento</label>
            <input type="date" class="form-control" name="fechaNacimiento" id="fechaNacimiento" > <br>

            <label for="telefono"  class="form-label">Telefono</label>
            <input type="text" class="form-control" name="telefono" id="telefono" > <br>

            <label for="correo" class="form-label">correo</label>
            <input type="email" class="form-control" name="correo" id="correo" required> <br>

            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            if(localStorage.token == undefined){}
            else
            {
                document.getElementById("exampleModalLabel2").innerHTML = "Gestión de usuarios";
            }
            
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();

}

async function registrarUsuario(){
    var myForm = document.getElementById("myForm1");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    });
    if(localStorage.token == undefined){
        console.log(request.status);
        if(request.status=='201'){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Un usuario registrado exitosamente',
                showConfirmButton: false,
                timer: 1500
              })   
              document.getElementById("contentModal").innerHTML = '';
              var myModalEl = document.getElementById('modalUsuario')
              var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
              modal.hide();       
           
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                text: 'ingrese los datos de manera correcta',
                showConfirmButton: false,
                timer: 3000
              });
        }
    }else{
        if(request.status=='201'){
            listarUsuarios();
            alertas("Se ha registrado el usuario exitosamente!",1)
            document.getElementById("contentModal").innerHTML = '';
            var myModalEl = document.getElementById('modalUsuario')
            var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
            modal.hide();
        }else{
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                text: 'ingrese los datos de manera correcta',
                showConfirmButton: false,
                timer: 2000
              });
        }
    }
    
   
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}
async function consultarUser(){
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/correo/"+localStorage.correo,settings)
    .then(response => response.json())
    .then(function(usuario){
        console.log(usuario);
            if(usuario){  
              localStorage.id=usuario.id;
              
            }
            
    })
}
function exit(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        exit();
    }
}