// URL
const URL_base = `https://babytracker.develotion.com`;
const URL_img = `${URL_base}/imgs/`;

// Variables constantes
const MENU = document.querySelector("#menu");
const ROUTER = document.querySelector("#ruteo");
const NAV = document.querySelector("ion-nav");
const HOME = document.querySelector("#pantalla-home");
const LOGIN = document.querySelector("#pantalla-login");
const REGISTRO = document.querySelector("#pantalla-registro");
const AGREGAREVENTO = document.querySelector("#pantalla-agregarevento");
const LISTAREVENTOS = document.querySelector("#pantalla-listareventos");

Inicio();

function Inicio()
{
    Eventos();
    ArmarMenu();
}
function Eventos()
{
    // Navegabilidad
    ROUTER.addEventListener('ionRouteDidChange', Navegar);
    // Registro
    document.querySelector("#btnRegistrar").addEventListener('click', PreRegistrarUsuario);
    document.querySelector("#slcDepartamento").addEventListener('ionChange', PoblarSelectCiudades);
    // Login
    document.querySelector("#btnLogin").addEventListener('click', PreLogin);
    // Agregar eventos
    document.querySelector("#btnAgregarEvento").addEventListener('click', PreAgregarEvento);
}

function OcultarPantallas()
{
    HOME.style.display = "none";

    LOGIN.style.display = "none";
    REGISTRO.style.display = "none";

    AGREGAREVENTO.style.display = "none";
    LISTAREVENTOS.style.display = "none";
}

function Navegar(evt)
{
   OcultarPantallas();
   let ruta = evt.detail.to;

   if(ruta == "/")
   {
       HOME.style.display = "block";
   }
   else if(ruta == "/login")
   {
       LOGIN.style.display = "block";
   }
   else if(ruta == "/registro")
   {
       REGISTRO.style.display = "block";
       ObtenerDepartamentos();
   }
   else if(ruta == "/agregarevento")
   {
       AGREGAREVENTO.style.display = "block";
       PoblarSelectCategorias();
   }
   else if(ruta == "/listareventos")
   {
       LISTAREVENTOS.style.display = "block";
       ListarEventos();
   }
}

function ArmarMenu()
{
    let _menu = `<ion-item href="/" onclick="CerrarMenu()">Home</ion-item>`;
    let hayToken = localStorage.getItem('apiKey');
    if(hayToken)
    {
        // Opciones si el usuario esta logueado
        _menu += `
            <ion-item href="/agregarevento" onclick="CerrarMenu()">Agregar evento</ion-item>
            <ion-item href="/listareventos" onclick="CerrarMenu()">Listar eventos</ion-item>
            <ion-item  onclick="Logout()">Cerrar sesion</ion-item>`;
    }
    else
    {
        // Opciones si no hay un usuario logueado
        _menu +=`
            <ion-item href="/login" onclick="CerrarMenu()">Iniciar sesion</ion-item>
            <ion-item href="/registro" onclick="CerrarMenu()">Registrarse</ion-item>`;
    }

    document.querySelector("#menu-opciones").innerHTML = _menu;
}

function CerrarMenu()
{
    MENU.close()
}

// [Loading]
const LOADING = document.createElement('ion-loading');
function AgregarLoading(texto)
{
    LOADING.message = texto;
    document.body.appendChild(LOADING);
    LOADING.present();
}
function RemoverLoading() 
{
    LOADING.dismiss();
}

// [Alertas]
function Alertar(titulo, mensaje) 
{
    const ALERT = document.createElement('ion-alert');
    ALERT.header = titulo;
    ALERT.message = mensaje;
    ALERT.buttons = ['OK'];
    document.body.appendChild(ALERT);
    ALERT.present();
}

// [Registro]
function PreRegistrarUsuario()
{
    let user = document.querySelector("#txtRegistroUsuario").value;
    let pass = document.querySelector("#txtRegistroPassword").value;
    let idDp = document.querySelector("#slcDepartamento").value;
    let idCi = document.querySelector("#slcCiudad").value;

    if(DatosOk(user, pass, idDp, idCi))
    {
        RegistrarUsuario(user, pass, idDp, idCi);
    }
    else
    {
        Alertar("Error", "Debe completar todos los campos.")
    }
}
function RegistrarUsuario(user, password, idDepa, idCiudad)
{
    AgregarLoading("Registrando usuario");

    let usuario = new Object();
    usuario.usuario = user,
    usuario.password = password,
    usuario.idDepartamento = idDepa,
    usuario.idCiudad = idCiudad;

    fetch(`${URL_base}/usuarios.php`, 
    {
        method : 'POST',
        headers : 
        {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(usuario)
    })
    .then(function(response){
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        // VALIDAR
        Login(usuario.usuario, usuario.password);
        RemoverLoading();
        console.log(data);
    })
    .catch(function(error){
        console.error(error);
    });
}
function DatosOk(user, pass, idDp, idCi)
{
    return true;
    // FALTA VALIDAR
}

// [Login]
function PreLogin()
{
    let user = document.querySelector("#txtLoginUsuario").value;
    let pass = document.querySelector("#txtLoginPassword").value;

    // FALTA AÑADIR MENSAJE ERROR
    Login(user, pass); 
}
function Login(user, password)
{
    let usuario = new Object();
    usuario.usuario = user,
    usuario.password = password

    AgregarLoading("Iniciando sesion");

    fetch(`${URL_base}/login.php`, 
    {
        method : 'POST',
        headers : 
        {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(usuario)
    })
    .then(function(response)
    {
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        console.log(data);

        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("idUser", data.id);

        ArmarMenu();
        NAV.push('page-home');

        MostrarToast("Sesion iniciada", 3000);
        RemoverLoading();
    })
    .catch(function(error)
    {
        console.error(error);
    });
}
function Logout()
{
    localStorage.clear();
    NAV.push('page-login');
    ArmarMenu();
    CerrarMenu();
}

// [Agregar evento]
function PreAgregarEvento()
{
    let idCategoria = document.querySelector("#slcCategoria").value;
    let fecha = document.querySelector("#dateTime").value;
    let detalle = document.querySelector("#txtAgregarEventoDetalle").value;
    if(true)
    {
        // FALTA VALIDAR
        AgregarEvento(idCategoria ,detalle, fecha);
    }
    else
    {
        Alertar("Error", "DESC")
    }
}
function AgregarEvento(idCategoria, detalle, fecha)
{
    AgregarLoading("Agregando un nuevo evento");
    let idUser = localStorage.getItem("idUser");
    let apiKey = localStorage.getItem("apiKey");
    let evento = new Object();
    evento.idCategoria = idCategoria,
    evento.idUsuario = idUser,
    evento.detalle = detalle,
    evento.fecha = fecha;

    fetch(`${URL_base}/eventos.php`, 
    {
        method : 'POST',
        headers : 
        {
            'Content-Type' : 'application/json',
            'apikey' : apiKey,
            'iduser' : idUser
        },
        body : JSON.stringify(evento)
    })
    .then(function(response)
    {
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        RemoverLoading();
        MostrarToast(data.mensaje, 3000);
        console.log(data);
    })
    .catch(function(error)
    {
        console.error(error);
    });
}

// Funcion para obtener la fecha de hoy con locale 'es-ES'
function FechaDeHoyFormateada()
{
    let hoy = new Date();
    let yyyy = hoy.getFullYear();
    let mm = hoy.getMonth() + 1;
    let dd = hoy.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return yyyy + '-' + mm + '-' + dd;
}

// [Eliminar evento]
function EliminarEvento(idEvento)
{
    let idUser = localStorage.getItem("idUser")
    let apiKey = localStorage.getItem("apiKey")
    fetch(`${URL_base}/eventos.php?idEvento=${idEvento}`, 
    {
        method : 'DELETE',
        headers : 
        {
            'Content-Type' : 'application/json',
            'apikey' : apiKey,
            'iduser' : idUser
        },
        params: 
        {
            idEvento : idEvento
        }
    })
    .then(function(response)
    {
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        console.log(data);
    })
    .catch(function(error)
    {
        console.error(error);
    });
}

// [Obtener Eventos]
async function ObtenerEventos()
{
    let idUser = localStorage.getItem("idUser");
    let apiKey = localStorage.getItem("apiKey");

    let response = await  fetch(`${URL_base}/eventos.php?idUsuario=${idUser}`,
    {
        method : 'GET',
        headers : 
        {
            'Content-Type' : 'application/json',
            'apikey' : apiKey,
            'iduser' : idUser
        },
        params:
        {
            'idUsuario' : idUser
        }
    })

    let data = await response.json();
    return data.eventos;
}

// Listar eventos en Card
async function ListarEventos()
{
    AgregarLoading("Cargando eventos");
    let eventosLista = await ObtenerEventos();

    document.querySelector("#eventosHoy").innerHTML = '';
    document.querySelector("#eventosAnteriores").innerHTML = '';

    for(let e of eventosLista)
    {
        try
        {
            let eventoDetalle = '';
            let categoria = await ObtenerCategoriaPorID(e.idCategoria);
    
            eventoDetalle = `
                <ion-item>
                    <ion-thumbnail slot="start">
                        <img alt="Imagen categoria" src="${URL_img + categoria.imagen}.png"/>
                    </ion-thumbnail>
                    <ion-label>${e.detalle}</ion-label>
                </ion-item>`;    

            if(e.fecha.slice(0, 10) == FechaDeHoyFormateada())
                document.querySelector("#eventosHoy").innerHTML += eventoDetalle;
            else
                document.querySelector("#eventosAnteriores").innerHTML += eventoDetalle;
        }
        catch(error)
        {
            // Si un evento se da de alta sin categoria, categoria pasa a ser null y .image tira exception (Arreglar, añadir validacion en AgregarEvento)
            // Eliminar try desp
            console.log(error);
        }
    }
    RemoverLoading();
}

// [Obtener Categoria por ID]
async function ObtenerCategoriaPorID(idCategoria)
{
    let categorias = await ObtenerCategorias();
    for(let c of categorias)
    {
        if(c.id == idCategoria) return c;
    }
    return null;
}

// [Obtener Departamentos]
function ObtenerDepartamentos()
{
    fetch(`${URL_base}/departamentos.php`,
    {
        method: 'GET',
        headers : 
        {
            'Content-Type' : 'application/json'
        }
    })
    .then(function(response)
    {
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        let cadena = '';
        for(let d of data.departamentos)
        {
            cadena += `<ion-select-option value="${d.id}">${d.nombre}</ion-select-option>`;
        }
        document.querySelector("#slcDepartamento").innerHTML = cadena;
        console.log(data);
    })
    .catch(function(error)
    {
        console.error(error);
    })
}

// [Obtener Ciudades]
function PoblarSelectCiudades(evt)
{
    let idDepto = evt.detail.value;
    fetch(`${URL_base}/ciudades.php?idDepartamento=${idDepto}`,
    {
        headers : 
        {
            'Content-Type' : 'application/json'
        },
        params:
        {
            idDepartamento: idDepto
        }
    })
    .then(function(response)
    {
        if(response.ok)
           return response.json();   
    })
    .then(function(data)
    {
        let cadena = '';
        for(let c of data.ciudades)
        {
            cadena+= `<ion-select-option value="${c.id}">${c.nombre}</ion-select-option>`;
        }
        document.querySelector("#slcCiudad").innerHTML = cadena;
        console.log(data);
    })
    .catch(function(error)
    {
        console.error(error);
    });
}

// Puebla dinamicamente el select de 'Categorias' en 'Agregar evento'
async function PoblarSelectCategorias()
{
    let cadena = '';
    let categorias = await ObtenerCategorias();
    for(let c of categorias)
    {
        cadena+= `<ion-select-option value="${c.id}">${c.tipo}</ion-select-option>`;
    }
    document.querySelector("#slcCategoria").innerHTML = cadena;
}

// [Obtener Categorias]
async function ObtenerCategorias()
{
    let idUser = localStorage.getItem("idUser");
    let apiKey = localStorage.getItem("apiKey");
    let response = await fetch(`${URL_base}/categorias.php`,
    {
        method : 'GET',
        headers : 
        {
            'Content-Type' : 'application/json',
            'apikey' : apiKey,
            'iduser' : idUser
        }
    })
    let categorias = await response.json();
    return categorias.categorias;
}

// [Obtener Plazas]
function ObtenerPlazas()
{
    let idUser = localStorage.getItem("idUser");
    let apiKey = localStorage.getItem("apiKey");
    fetch(`${URL_base}/plazas.php`,
    {
        headers : 
        {
            'Content-Type' : 'application/json',
            'apikey' : apiKey,
            'iduser' : idUser
        }
    })
    .then(function(response)
    {
        if(response.ok)
            return response.json();
    })
    .then(function(data)
    {
        console.log(data);
    })
    .catch(function(error)
    {
        console.error(error);
    });
}

function MostrarToast(mensaje, duracion)
{
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = duracion;
    document.body.appendChild(toast);
    toast.present();
}