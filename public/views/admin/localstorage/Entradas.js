function allData(){
            
    table.innerHTML = ``
   
    contactList = JSON.parse(localStorage.getItem('listItem')) ?? []


    contactList.forEach(function (value, i){
       
        var table = document.getElementById('table')

        table.innerHTML += `
            <tr>
                <td>${i+1}</td>
                <td>${value.name}</td>
                <td>${value.Insumo}</td>
                <td>${value.Cantidad}</td>
                <td>${value.fecha}</td>
                <td>${value.precio}</td>
                <td>${value.Stock}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="find(${value.id})">
                        <i class="fa fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeData(${value.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>`
    })
}

//método para obtener datos en función id
function find(id){
    //obtener datos del almacenamiento local y almacenarlos en el array de contactos
    //debemos usar JSON.parse, porque los datos como cadena, necesitamos convertirlos en el array
    contactList = JSON.parse(localStorage.getItem('listItem')) ?? []

    contactList.forEach(function (value){
        if(value.id == id){
           document.getElementById('id').value = value.id
           document.getElementById('name').value = value.name
           document.getElementById('Insumo').value = value.Insumo
           document.getElementById('Cantidad').value = value.Cantidad
           document.getElementById('fecha').value = value.fecha
           document.getElementById('precio').value = value.precio
           document.getElementById('Stock').value = value.Stock
        }
    })
}

//metodo funcion eliminar datos
function removeData(id){
    //obtener datos del almacenamiento local y almacenarlos en el array de contactos
    //debemos usar JSON.parse, porque los datos como cadena, necesitamos convertirlos en el array
    contactList = JSON.parse(localStorage.getItem('listItem')) ?? []

    contactList = contactList.filter(function(value){ 
        return value.id != id; 
    });

    // guardar array dentro de localstorage
    localStorage.setItem('listItem', JSON.stringify(contactList))

    //obtener datos nuevos
    allData()
}

//método para guardar datos en localstorage
function save(){
            
   
    //obtener datos del almacenamiento local y almacenarlos en el array de contactos
    //debemos usar JSON.parse, porque los datos como cadena, necesitamos convertirlos en array
    contactList = JSON.parse(localStorage.getItem('listItem')) ?? []

    //obtener el última array para obtener la última id
    //y guárdarlo en la id de la variable
    var id
    contactList.length != 0 ? contactList.findLast((item) => id = item.id) : id = 0

    if(document.getElementById('id').value){

        //editar array de la lista de contactos llmando su valor id
        contactList.forEach(value => {
            if(document.getElementById('id').value == value.id){
                value.name      = document.getElementById('name').value, 
                value.Insumo       = document.getElementById('Insumo').value, 
                value.Cantidad   = document.getElementById('Cantidad').value, 
                value.fecha     = document.getElementById('fecha').value,
                value.precio     = document.getElementById('precio').value,
                value.Stock     = document.getElementById('Stock').value
            }
        });

        //eliminar entrada oculta
        document.getElementById('id').value = ''

    }else{

        //guardar
        //obtener datos del formulario
        var item = {
            id        : id + 1, 
            name      : document.getElementById('name').value, 
            Insumo       : document.getElementById('Insumo').value, 
            Cantidad   : document.getElementById('Cantidad').value, 
            fecha     : document.getElementById('fecha').value,
            precio     : document.getElementById('precio').value,
            Stock     : document.getElementById('Stock').value
        }

        //add item data to array contactlist
        contactList.push(item)
    }

   
    //guardar array dentro del localstorage
    localStorage.setItem('listItem', JSON.stringify(contactList))

    //actualizar la tabla
    allData()

    //elimnar datos escritos de los formularios 
    document.getElementById('form').reset()
}