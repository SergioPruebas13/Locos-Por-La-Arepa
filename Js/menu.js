$(document).ready(main);
// variables
var main_productos = [];
var categoria_menu_array = [];
var id_obj,descripcion_obj,categoria_obj,menu_obj;
var nombre_menu , descripcion_menu , valor_menu , id_menu, cantida_menu;
var check_Cart = 0;
var num_band = 0;

var button_variable = document.querySelector('#button-variable');


function main (){
    // Obtener los datos de JSON
     get_data(); 
     verify_(); 
    
    $('body').on('change', '#categoria-menu-combobox', function(){
        cargar_categorias_menu();
    });

     //-------------------Llamada a la funcion de Mostrar carrito 
     $('body').on('click', '.continuar-pedido', function(){
        $('.pedido-tiket').removeClass('Active');
    })

    // --------------------------Llamada a la funcion de Añadir a Pedido
    $('body').on('click', '.pedido-anadir-butt', function(){
        var id_desc_menu = $(this).attr('id_desc_menu');
        var aclaracion_pedido_text = document.getElementById('aclaracion-pedido-text').value;
        var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input').value;
        // enlistar_producto_menu(id_desc_menu);
        if (aclaracion_pedido_text == "") {
            GuardarDatosLS(id_desc_menu,`Ninguna`,(pedidos_cantidad_input*1));
        }else{
            GuardarDatosLS(id_desc_menu,aclaracion_pedido_text,(pedidos_cantidad_input*1));
        }
        $('.margen-pedido').removeClass('Active-margen-pedido');  
        pintar_cantidad_carrito();
    }) 

    $('body').on('click', '.tiket-compra', function(){
        $('.pedido-tiket').addClass('Active');        
    }) 

   
    // --------------------------Llama a la funcion de ver mas Producto
    $('body').on('click','.pedido-ver-mas',function(){
        var id_desc_menu = $(this).attr('id_desc_menu');
        $('.margen-pedido').addClass('Active-margen-pedido');
        // alert(id_desc_menu)  
        ver_mas_producto(id_desc_menu);
    })

    // --------------------------Cerrar a la funcion de ver mas Producto
    $('body').on('click','.atras-pedido-button',function(){
        $('.margen-pedido').removeClass('Active-margen-pedido');  
    })

    
    // -----------------------------Limpiar Tiket 
    $('body').on('click','#limpiar-tiket-button',function(){
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
        pintar_cantidad_carrito();
    })

    // --------------------------Cerrar a la funcion de Datos Usuario
    // $('body').on('click','#',function(){
    //     $('.margen-pedido').removeClass('Active-margen-pedido');  
    // })
     // ----------------------------- Abrir a la funcion de Datos Usuario
     $('body').on('click','.button-tiket',function(){
        $('.datos-user').addClass('Active-datos-user'); 
        mostrarDatosUserInput();
    })

    // ----------------------------- Cerrar a la funcion de Datos Usuario
    $('body').on('click','#button-Atras-pedido',function(){
        $('.datos-user').removeClass('Active-datos-user');  
    })

     // ----------------------------- Solicitud de envios 
     $('body').on('click','#button-solicitar-pedido',function(){
        
        // var bool = confirm('Esta Seguro de Enviar este Pedido')
        // if(bool){
            UserdataGuardarDatosLS();
            SendMessageTiket(); 
            $('.datos-user').removeClass('Active-datos-user');  
            $('.pedido-tiket').removeClass('Active');
            localStorage.removeItem('product_cart_menu');
            CargarDatosLS();
            pintar_cantidad_carrito();
        // }        
    })
    
    
}
// ----------------------------------------------- Obtener datos de DB
function get_data (){
    var array_temp =[];
    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
   
    var url = "http://127.0.0.1:5500/Data/data-base.json";    
        fetch(url)
        .then(function(res){
            return res.json();
        })
        .then(function(respuesta){
            for (let i = 0; i < respuesta.comidas.length; i++) {
                
                if (respuesta.comidas[i].id == url_id) {
                    id_obj =  respuesta.comidas[i].id;
                    descripcion_obj =  respuesta.comidas[i].descripcion;
                    categoria_obj = respuesta.comidas[i].descripcion.categoria;
                    menu_obj = respuesta.comidas[i].menu;
                    
                    var obj = {id_obj,descripcion_obj,categoria_obj,menu_obj};
                    array_temp.push(obj);
                }
            }
           cargar_data(array_temp);  
        })    
        array_temp = main_productos;  
}

// ----------------------------------------------- Cargar datos de empresas 
function cargar_data (data){
    var info_tienda= document.getElementById('info-tienda');
    var html = "";
    
    for (let i = 0; i < data.length; i++) {
            html += `
                <div class="card-empresas">
                    <div class="card-opciones"></div>
                    <div class="card-image">
                        <img src="${data[i].descripcion_obj.img}">
                    </div>
                    <div class="card-descripcion">
                        <p>
                            <strong>Nombre:</strong> ${data[i].descripcion_obj.nombre} <br>
                            <strong>Producto:</strong> ${data[i].descripcion_obj.producto} <br>
                            <strong>Local:</strong> ${data[i].descripcion_obj.local}
                        </p>
                    </div>
                </div>
                `;
    }
    // info_tienda.innerHTML += html;
    cargar_categorias_menu_combobox();
}

// ----------------------------------------------- Cargar las categorias en el combobox principal 
function cargar_categorias_menu_combobox (){ 
    categoria_menu_array = main_productos[0].menu_obj;
    var selector = document.querySelector('#categoria-menu-combobox');

        if (categoria_menu_array != undefined) {
            for (let i = 0; i < (categoria_menu_array.length); i++) {               
                selector.options[i] = new Option(`${categoria_menu_array[i].categoria_menu}`.replace(/\b[a-z]/g,c=>c.toUpperCase())); 
            }
            cargar_categorias_menu();
        }           
}

//------------------------------------------------ Cargar el menu de la empresa
function cargar_categorias_menu (){
    
    var productos_menu = document.getElementById('productos-menu');
    var selec = document.querySelector('#categoria-menu-combobox');
    var info_tienda= document.getElementById('info-tienda');
    var html = "";
    var band = 0;
    var arra_temp_menu =[];
    info_tienda.innerHTML = "";

    for (let i = 0; i < categoria_menu_array.length; i++) {
       if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
         console.log(categoria_menu_array[i]);
        // ------------- Aqui ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                 info_tienda.innerHTML += `
                        <div class="card-empresas">
                            <div class="card-image">
                                <img src="${categoria_menu_array[i].img_menu}">
                            </div>
                            <div class="card-descripcion">
                                <p>
                                    ${categoria_menu_array[i].categoria_menu.toUpperCase()} <br>
                                </p>
                            </div>
                        </div>
                 `;

                arra_temp_menu = categoria_menu_array[i].descripcion_menu;

                if (arra_temp_menu.length == 0) {
                    band = 1;
                }
                else
                {

                    for (let i = 0; i < arra_temp_menu.length; i++) {
                        html += `
                        <div class="margen-ejemplo">
                            <div class="pedido-ver-mas" id_desc_menu="${arra_temp_menu[i].id_descripcion_menu}">
                                <div class="pedido-ejemplo" >
                                    <div class="image-pedido">
                                        <img src="https://i.postimg.cc/4340vgqV/image-default.png" alt="">
                                    </div>
                                    <div class="descr-pedido">
                                        <div class="descr-title">
                                            <p>
                                            ${arra_temp_menu[i].nombre.replace(/\b[a-z]/g,c=>c.toUpperCase())}
                                            </p>
                                        </div>
                                        <div class="descripcion-producto">
                                            ${arra_temp_menu[i].descripcion}
                                        </div>
                                        <div class="precio-button">
                                            <span>Precio: $ ${new Intl.NumberFormat().format(arra_temp_menu[i].valor)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                                `;
                    }
                }        
       }
    }

    if (band == 1) {
        productos_menu.innerHTML = 
                `<div class="no-menu">
                    <p>No Hay Menú Que Mostrar</p>
                 </div>
                `;
    }else{
        productos_menu.innerHTML = "";
        productos_menu.innerHTML += html;

    }

     
}

// ----------------------------------------------- MOSTRAR VER MAS PRODRUCTO

function ver_mas_producto (id_del_producto){
    var selec = document.querySelector('#categoria-menu-combobox');
    var margen_pedido = document.querySelector('.margen-pedido');
    var band = 0;
    var arra_temp_menu =[];
    var Aclarar_messa = `Ejemplo: No quiero cebolla en mi Hamburguesa`;
    
    for (let i = 0; i < categoria_menu_array.length; i++) {
        if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
             arra_temp_menu = categoria_menu_array[i].descripcion_menu;
             if (arra_temp_menu == undefined) {
                 band = 1;
             }
             else
             {
                 for (let i = 0; i < arra_temp_menu.length; i++) {
                     if (arra_temp_menu[i].id_descripcion_menu == id_del_producto) {
                        margen_pedido.innerHTML = `
                        <div class="anadir-a-pedido">
                            <div class="descipcin-pedido-scroll">
                                <div class="image-pedido-amplia">
                                    <img src="${arra_temp_menu[i].img}" alt="">
                                </div>
                                <div class="title-descripcion-precio">
                                    <span class="title-pedo">${arra_temp_menu[i].nombre.replace(/\b[a-z]/g,c=>c.toUpperCase())}</span>
                                    <p>${arra_temp_menu[i].descripcion}</p>
                                    <span class="precio-pedo">Precio: $ ${new Intl.NumberFormat().format(arra_temp_menu[i].valor)}</span>
                                </div>
                                <div class="pedido-cantidad">
                                    <p><span id="pedido-cantidad-span">Cantidad 1</span></p>
                                    <div class="pedido-cantidad-buttos">
                                        <button onclick="menosCantidadPedido()"> - </button>
                                        <input type="text" value="1" disabled id="pedidos-cantidad-input">
                                        <button onclick="masCantidadPedido()"> + </button>
                                    </div>
                                </div>
                                <div class="aclaracion-pedido">
                                    <label for="text">¿Deseas Algo Especial en Tu Pedido?</label>
                                    <textarea name="" id="aclaracion-pedido-text" placeholder="${Aclarar_messa}" cols="40" rows="15"></textarea>
                                </div>
                            </div>
                            <div class="buttons-pedido">
                                <button class="atras-pedido-button">Atras</button>
                                <button class="pedido-anadir-butt" id_desc_menu="${arra_temp_menu[i].id_descripcion_menu}">Añadir a Pedido</button>
                            </div>
                        </div>
                        `; 
                    }
                }
            }            
        }
    }
}


// ---------------------------------------------- QUITAR CANTIDAD A PEDIDDO
function menosCantidadPedido (){
     var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input');
     var pedido_cantidad_span = document.querySelector('#pedido-cantidad-span');
     var vari = (pedidos_cantidad_input.value*1) - 1;

    if (pedidos_cantidad_input.value == 1) {
        alert('No Puede ser Cero la cantidad ¡¡¡')
    }else{
        pedidos_cantidad_input.value = `${vari}`;
        pedido_cantidad_span.innerHTML = `Cantidad ${vari}`;
    }
}

// ---------------------------------------------- AGREGAR CANTIDAD A PEDIDDO
function masCantidadPedido (){
    var pedidos_cantidad_input = document.querySelector('#pedidos-cantidad-input');
    var pedido_cantidad_span = document.querySelector('#pedido-cantidad-span');
    var vari = (pedidos_cantidad_input.value*1) + 1;
    pedidos_cantidad_input.value = `${vari}`;
    pedido_cantidad_span.innerHTML = `Cantidad ${vari}`;
}



// ----------------------------------------------- GUARDAR DATOS AL LS
function GuardarDatosLS(id_del_producto,aclaracion_pedido_text,pedidos_cantidad_input){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var selec = document.querySelector('#categoria-menu-combobox');
    var band = 0;
    var arra_temp_menu =[];
    var productos_Carro;
    var id_repetido;
    
    for (let i = 0; i < categoria_menu_array.length; i++) {
        if (selec.value.toLowerCase() == categoria_menu_array[i].categoria_menu) {
             arra_temp_menu = categoria_menu_array[i].descripcion_menu;
             if (arra_temp_menu == undefined) {
                 band = 1;
             }
             else
             {
                 for (let i = 0; i < arra_temp_menu.length; i++) {
                     if (arra_temp_menu[i].id_descripcion_menu == id_del_producto) {
                         productos_Carro = 
                            {
                                id_category: url_id*1,
                                id_menu: `${selec.value.toLowerCase()}${arra_temp_menu[i].id_descripcion_menu}`,
                                nombre_menu: arra_temp_menu[i].nombre,
                                // descripcion_menu: arra_temp_menu[i].descripcion,
                                aclarar_menu: aclaracion_pedido_text,
                                valor_menu: arra_temp_menu[i].valor,
                                cantida_menu: pedidos_cantidad_input
                            }
                            // console.log(productos_Carro);
                            id_repetido = productos_Carro.id_menu;
                            
                            // console.log(id_repetido);
                            // var prueba = productos_Carro.id_menu.split(`${selec.value.toLowerCase()}`).join("");
                            // console.log(prueba);
                    }
                }
            }            
        }
    }
    
    if (localStorage.getItem('product_cart_menu') === null) {
        let product_cart_menu = [];
        product_cart_menu.push(productos_Carro);
        localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
            CargarDatosLS();
    }else{
        let product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
        var verificar = buscarRepetido(id_repetido);

        // console.log(verificar)
        if (verificar == 0) {
            product_cart_menu.push(productos_Carro);
            localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
            CargarDatosLS();
        }   
    }      
} 

//------------------------------------------------ Cargar Datos del Carrito de Compras en el LS
function CargarDatosLS(){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    let principal_tiket_scroll = document.getElementById('principal-tiket-scroll');
    // console.log(product_cart_menu.length);
    if (product_cart_menu==null) {
        principal_tiket_scroll.innerHTML = "";
    }else{
        principal_tiket_scroll.innerHTML = "";
        for (let i = 0; i < product_cart_menu.length; i++) {
            var valor_producto = (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
            principal_tiket_scroll.innerHTML += 
                    `
                    <div class="productos-enlistados">
                        <div class="productos-enlistados-header">
                            <div class="title-enlistado">
                                <strong>${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}</strong>
                            </div>
                        </div>
                        <div class="productos-enlistados-descripcion">
                            <p>
                                <span><strong>Pedido Especial: </strong>${product_cart_menu[i].aclarar_menu}</span>
                            </p>
                        </div>
                        <div class="prod-list-precio-cantidad">
                            <div class="precio-cantidad">
                                Precio: <span>$ ${new Intl.NumberFormat().format(product_cart_menu[i].valor_menu)}</span> <br>
                                Cantidad: <span>${product_cart_menu[i].cantida_menu}</span>
                            </div>
                            <div class="button-cantidad">
                                <button onclick="quitarCantidad('${product_cart_menu[i].id_menu}')">-</button>
                                <input type="text" value="${product_cart_menu[i].cantida_menu}" disabled/>
                                <button onclick="agregarCantidad('${product_cart_menu[i].id_menu}')">+</button>                           
                            </div>
                        </div>
                        <div class="delete-enlistado">
                                <p><b>Total: </b>$ ${new Intl.NumberFormat().format(valor_producto)}</p>
                                <button id="" onclick="EliminarDatos('${product_cart_menu[i].id_menu}')">Eliminar de Pedido</button>
                        </div>
                    </div>
                    <hr>
                    `;
        }
    }  
    calcular_total_tiket();
}

//------------------------------------------------ Funcion patra Evaluar el total
function calcular_total_tiket(){
    var total=0;
    var total_tiket = document.getElementById('total-tiket-value');

    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
               total = total + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
        }
    }  
    // console.log(total);
    total_tiket.innerHTML = new Intl.NumberFormat().format(total);
    if (total == 0) {
        button_variable.innerHTML = `Nuevo Pedido`;
        document.getElementById('button-tiket-id').disabled=true;
        $('.button-tiket').addClass('button-tiket-id');
    }else{
        button_variable.innerHTML = `Continuar Pedido`;
        document.getElementById('button-tiket-id').disabled=false;
        $('.button-tiket').removeClass('button-tiket-id');
    }
}

//------------------------------------------------ Funcion para agreagar cantidad a el pedido
function agregarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu + 1;
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
    pintar_cantidad_carrito();
}

//------------------------------------------------ Funcion para Quitar cantidad a el pedido
function quitarCantidad (id_ls){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            if (product_cart_menu[i].id_menu == id_ls) {
                if (product_cart_menu[i].cantida_menu > 1) {
                    product_cart_menu[i].cantida_menu = product_cart_menu[i].cantida_menu - 1;
                }else{
                    num_band = num_band + 1;
                    if (num_band > 5) {
                        alert('No Puede ser menor que 1')   
                        num_band = 0;
                    }
                }
            }
        }
    } 
    localStorage.setItem('product_cart_menu', JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
}

// ----------------------------------------------- Funcion para enviar mensaje en Whatsapp
function SendMessageTiket (){

    let user_data = JSON.parse(localStorage.getItem('user-data'));
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var message = "";
    var number = "573103368887";
    var valor_total = 0;
    var leng_lar;

    if (product_cart_menu==null) {
        
    }else{
        for (let i= 0; i < product_cart_menu.length; i++) {
          leng_lar = "";
          valor_total = valor_total + (product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu);
          if (product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase()).length > 22) {
              leng_lar = '||';
          }
                message += ` 
                            PRODUCTO ${i+1}

                            Categoria: ${product_cart_menu[i].nombre_menu.replace(/\b[a-z]/g,c=>c.toUpperCase())}
                            
                            Pedido Especial: ${product_cart_menu[i].aclarar_menu}
                            
                            Cantidad: ${product_cart_menu[i].cantida_menu}
                            
                            Valor: $ ${new Intl.NumberFormat().format((product_cart_menu[i].valor_menu * product_cart_menu[i].cantida_menu))}
                            
                            ---------------------------------

                            `;
        }
        message +=  `
                    Valor Total: $ ${new Intl.NumberFormat().format(valor_total)}
                    
                    Nombre: ${user_data.ls_user_nombre}

                    Dirección: ${user_data.ls_user_direccion}

                    Barrio: ${user_data.ls_user_barrio}

                    `;
    }   

    console.log(message);
    
    var url = `https://api.whatsapp.com/send?phone=${number}&text=${message}`;

    window.open(url);
}


// ------------------------------------------------ Creacion de los datos del Usuario en local storage

function UserdataGuardarDatosLS (){

    var user_nombre = document.querySelector('#nombre-user').value;
    var user_direccion= document.querySelector('#direccion-user').value;
    var user_barrio = document.querySelector('#barrio-user').value;

    var user_data_ls = {
        ls_user_nombre: user_nombre,
        ls_user_direccion: user_direccion,
        ls_user_barrio: user_barrio
    }

    if (localStorage.getItem('user-data') === null) {
        localStorage.setItem('user-data', JSON.stringify(user_data_ls));
    }else{
        let user_data = JSON.parse(localStorage.getItem('user-data'));

        user_data.ls_user_nombre = user_nombre;
        user_data.ls_user_direccion = user_direccion;
        user_data.ls_user_barrio = user_barrio;

        localStorage.setItem('user-data', JSON.stringify(user_data));
    }    
}

//-----------------------Eliminar tareas de Tiket de compras 
function EliminarDatos(id_menu){
    
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart_menu.length; i++) {
        if (product_cart_menu[i].id_menu == id_menu) {
            product_cart_menu.splice(i,1);
        }
    }
    localStorage.setItem('product_cart_menu',JSON.stringify(product_cart_menu));
    CargarDatosLS();
    calcular_total_tiket();
    pintar_cantidad_carrito();
}

//------------------------------------------------ Funcion para Buscar si hay productos repetidos 
function  buscarRepetido(id_del_producto){
    var bol = 0;
    var dos = id_del_producto;
    let product_cart = JSON.parse(localStorage.getItem('product_cart_menu'));

    for (let i = 0; i < product_cart.length; i++) {
        var uno = product_cart[i].id_menu;
        
        if (uno == dos) {
            // console.log('No haga nada')
            alert('Este Producto ya esta Enlistado')
            bol=1;
        }else{
            // console.log('Ingrese Nuevo Producto')
        }
    }

    return bol;
}

// ----------------------------------------------- Verificar tiket de pagina 
function verify_ (){
    if (verify_category() == 0) {
        localStorage.removeItem('product_cart_menu');
        CargarDatosLS();
     }else{
        CargarDatosLS();
     }
     pintar_cantidad_carrito();
}

// ----------------------------------------------- Verificar en que pagina se encuentra para borrar el tiket
function verify_category (){

    var url = window.location.search;
    var url_id = url.split(`?id=`).join("");
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var retu = 0;

    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            
            if (product_cart_menu[i].id_category == (url_id*1)) {
                retu = 1;
                break;
            }
        }
    }   
    return retu;
}

// ----------------------------------------------- Pintar Cantidad de Carrito 
function pintar_cantidad_carrito (){
    var product_cart_menu = JSON.parse(localStorage.getItem('product_cart_menu'));
    var cantidad_productos = document.querySelector('#cantidad-productos');
    var pedido_precio = document.querySelector('.pedido-precio');
    var cantidad = 0;
    var precio = 0;


    if (product_cart_menu==null) {
        
    }else{
        for (let i = 0; i < product_cart_menu.length; i++) {
            cantidad = cantidad + (product_cart_menu[i].cantida_menu);
            precio = precio + ((product_cart_menu[i].cantida_menu)*product_cart_menu[i].valor_menu);
        }
    }  
    

    if (product_cart_menu == null || product_cart_menu.length == 0) {
        $('.tiket-compra').removeClass('Active-tiket-compra');
    }else{
        $('.tiket-compra').addClass('Active-tiket-compra');
    }
        cantidad_productos.innerHTML = cantidad;
        pedido_precio.innerHTML = `$ ${new Intl.NumberFormat().format(precio)}`;

}

// --------------------------------------------------- Mostrar los datos de user en los input 
function mostrarDatosUserInput (){
    let user_data = JSON.parse(localStorage.getItem('user-data'));
    console.log(user_data);
    if (user_data == null) {
        
    }else{
        document.getElementById('nombre-user').value = user_data.ls_user_nombre;
        document.getElementById('direccion-user').value = user_data.ls_user_direccion;
        document.getElementById('barrio-user').value = user_data.ls_user_barrio;
    }
}

// ----------------------------------------------------- Validacion Solo letras 
function soloLetras(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

 // ----------------------------------------------------- Validacion Solo letras y numeros 
function soloLetrasynumeros(e){
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = " áéíóúabcdefghijklmnñopqrstuvwxyz0123456789-";
    especiales = "8-37-39-46";

    tecla_especial = false
    for(var i in especiales){
         if(key == especiales[i]){
             tecla_especial = true;
             break;
         }
     }

     if(letras.indexOf(tecla)==-1 && !tecla_especial){
         return false;
     }
 }

