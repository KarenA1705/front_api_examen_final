//funciones js para el modulo de articulos

const urlApi2 = "http://localhost:8080";//colocar la url con el puerto

function listarArticulos(){
    validaToken();
    $("#table_usuario").hide();
    $("#table_article").show();
    $("#table_categoria").hide();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi2+"/articulos",settings)
    .then(response => response.json())
    .then(function(data){
        
            var articulos = '';
            for(const articulo of data){
                //console.log(articulo.usuario.nombre);
                var date =articulo.fecha_registro+"";
                //console.log(date)
                var dato =date.split('T');
                articulos += `
                <tr>
                    <th scope="row">${articulo.id}</th>
                    <td>${articulo.codigo}</td>
                    <td>${articulo.nombre}</td>
                    <td>${articulo.descripcion}</td>
                    <td>${dato[0]}</td>
                    <td>${articulo.categoria.nombre}</td>
                    <td>${articulo.usuario.nombre}</td>
                    <td>${articulo.stock}</td>
                    <td>${articulo.precio_venta}</td>
                    <td>${articulo.precio_compra}</td>
                    <td>
                    <button type="button" class="btn btn-outline-danger" 
                    onclick="eliminaArticulo('${articulo.codigo}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                    <a href="#" onclick="verModificarArticulo('${articulo.codigo}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-pen"></i>
                    </a>
                    <a href="#" onclick="verArticulo('${articulo.codigo}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>  `;
                
            }
            document.getElementById("listarArtuculos").innerHTML = articulos;
    })
   
  
}

function eliminaArticulo(codigo){
    validaToken();
    Swal.fire({
        title: 'esta seguro de eliminar este articulo?',
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
            fetch(urlApi2
            +"/articulo/codigo/"+codigo,settings)
            .then(response => response.text())
            .then(function(data){
                listarArticulos();
                alertas("Se ha eliminado el articulo exitosamente!",2)
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
    fetch(urlApi2
    +"/usuario/"+id,settings)
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
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de articulos";
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
    const request = await fetch(urlApi2
    +"/usuario/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarArticulos();
    alertas("Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verArticulo(codigo){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi2 +"/articulo/codigo/"+codigo,settings)
    .then(response => response.json())
    .then(function(articulo){
            var cadena='';
            if(articulo){  
                var date =articulo.fecha_registro+"";
                //console.log(date)

                var dato =date.split('T');              
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar articulo</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Codigo: ${articulo.codigo}</li>
                    <li class="list-group-item">Nombre: ${articulo.nombre}</li>
                    <li class="list-group-item">Descripcion: ${articulo.descripcion}</li>
                    <li class="list-group-item">Fecha registro: ${dato[0]}</li>
                    <li class="list-group-item">Categoria: ${articulo.categoria.nombre}</li>
                    <li class="list-group-item">Usuario: ${articulo.usuario.nombre}</li>
                    <li class="list-group-item">Stock: ${articulo.stock}</li>
                    <li class="list-group-item">Precio Venta: ${articulo.precio_venta}</li>
                    <li class="list-group-item">Precio Compra: ${articulo.precio_compra}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de articulos";
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function alertas(mensaje,tipo){
    var color ="";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-'+color+' alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}

function registerArticulo(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Articulo</h1>
            </div>
              
            <form action="" method="post" id="myForm1">
            <input type="hidden" name="id" id="id">

            <label for="codigo" class="form-label">Codigo</label>
            <input type="text" class="form-control" name="codigo" id="codigo" required> <br>

            <label for="nombre"  class="form-label">Nombre</label>
            <input type="text" class="form-control" name="nombre" id="nombre" required> <br>

            <label for="descripcion"  class="form-label">Descripcion</label>
            <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>

            <label for="fecha_registro"  class="form-label">Fecha registro</label>
            <input type="date" class="form-control" name="fecha_registro" id="fecha_registro" > <br>
            <div id="prueba" onclick="categoria()">
                <label  for="categoria">Escoja categoria</label>
                <select  class="form-control" id="id_ctg" name="id_ctg">

                </select>
            </div>
            <br>
            <label for="stock"  class="form-label">Stock</label>
            <input type="number" class="form-control" name="stock" id="stock" > <br>

            <label for="precio_venta"  class="form-label">Precio venta</label>
            <input type="number" class="form-control" name="precio_venta" id="precio_venta" > <br>

            <label for="precio_compra" class="form-label">precio compra</label>
            <input type="number" class="form-control" name="precio_compra" id="precio_compra" required> <br>

                <button type="button" class="btn btn-outline-info" onclick="registrarArticulo()">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            document.getElementById("exampleModalLabel2").innerHTML = "Gestión de Articulos";
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}
async function categoria()
{
 
        let categoria1 = document.querySelector('#id_ctg');
        var settings={
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.token
            },
        }
        fetch(urlApi2+"/categorias",settings)
        .then((response) => response.json())
        .then(function (data) {
            let template = '<option class="FORM-CONTROL" selected disable value="">Seleccione</option>'
            for(const categorias of data){
                template += "<option value="+categorias.id_ctg+">"+categorias.nombre+"</option>"
            }
           categoria1.innerHTML = template
        
        })
        .catch(function (error) {
            console.log(error);
        });
        document.getElementById('prueba').onclick = "";
}
async function registrarArticulo(){
    let userid= localStorage.id;
    let codigo = document.querySelector('#myForm1 #codigo').value;
    let nombre = document.querySelector('#myForm1 #nombre').value;
    let descripcion = document.querySelector('#myForm1 #descripcion').value;
    let fecha_registro = document.querySelector('#myForm1 #fecha_registro').value;
    let categoria = document.querySelector('#myForm1 #id_ctg').value;
    let stock = parseInt(document.querySelector('#myForm1 #stock').value) ;
    let precio_venta =parseFloat(document.querySelector('#myForm1 #precio_venta').value);
    let precio_compra = parseFloat(document.querySelector('#myForm1 #precio_compra').value);
    var jsonData = {
        "codigo":codigo,
        "nombre":nombre,
        "descripcion":descripcion,
        "fecha_registro":fecha_registro,
        "categoria":{
            "id_ctg":categoria
        },
        "usuario":{
            "id":userid
        },
        "stock":stock,
        "precio_venta":precio_venta,
        "precio_compra":precio_compra,
        };
        //console.log(jsonData);
    /*var myForm = document.getElementById("myForm1");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }*/
    const request = await fetch(urlApi2+"/articulo", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
  
      listarArticulos();
      alertas("Se ha registrado el articulo exitosamente!",1)
    
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}



function validaToken(){
    if(localStorage.token == undefined){
        exit();
    }
}