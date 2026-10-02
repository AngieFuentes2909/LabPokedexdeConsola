//  Parte 2

async function buscarPokemon(nombre) {
    // se construye la URL 
    let nombreMinusculas = nombre.toLowerCase();
    let url = "https://pokeapi.co/api/v2/pokemon/" + nombreMinusculas;
    
    try {
        // se hace la petición
        let respuesta = await fetch(url);
        
        // se valia si la respuesta falló
        if (respuesta.ok === false) {
            console.log("Error: No se pudo encontrar al Pokémon (Status: " + respuesta.status + ")");
            return null;
        }
        
        // 4. Si todo sale bien, traducimos a JSON y retornamos
        let datos = await respuesta.json();
        return datos;
        
    } catch (error) {
        console.log("Hubo un error:", error);
        return null;
    }
}

//  Parte 3
function mostrarFicha(datos) {
    
    if (datos === null) {
        console.log("Los datos son nulos, no hay ficha para mostrar.");
        return;
    }

    console.log("=========================================");
    console.log(" N.° " + datos.id + " - " + datos.name.toUpperCase());
    console.log("=========================================");
    
   
    let arrayTipos = [];
    for (let t of datos.types) {
        arrayTipos.push(t.type.name);
    }
   
    let tiposUnidos = arrayTipos.join(" / ");
    console.log("Tipos: " + tiposUnidos);
    
    
    let alturaMetros = datos.height / 10;
    let pesoKilos = datos.weight / 10;
    console.log("Altura: " + alturaMetros + " m");
    console.log("Peso: " + pesoKilos + " kg");
    
    console.log("-- Estadísticas Base --");
    for (let s of datos.stats) {
        console.log("  " + s.stat.name + ": " + s.base_stat);
    }
    
    console.log(" Habilidades");
    for (let a of datos.abilities) {
        
        if (a.is_hidden === true) {
            console.log("  " + a.ability.name + " (oculta)");
        } else {
            console.log("  " + a.ability.name);
        }
    }
    console.log("=========================================\n");
}

//  Parte 4

function obtenerStat(datos, nombreStat) {
    for (let s of datos.stats) {
        if (s.stat.name === nombreStat) {
            return s.base_stat;
        }
    }
    return null;
}

async function compararPokemon(nombre1, nombre2, stat) {
    console.log("\nComparando " + nombre1 + " vs " + nombre2 + " en " + stat);
    
    let poke1 = await buscarPokemon(nombre1);
    let poke2 = await buscarPokemon(nombre2);
    
    
    if (poke1 === null || poke2 === null) {
        console.log("Error: Uno de los Pokémon no existe.");
        return;
    }
    
    let valor1 = obtenerStat(poke1, stat);
    let valor2 = obtenerStat(poke2, stat);
    
    if (valor1 === null || valor2 === null) {
        console.log("Error: Esa estadística no existe.");
        return;
    }
    
    console.log(poke1.name + " tiene " + valor1);
    console.log(poke2.name + " tiene " + valor2);
    
    if (valor1 > valor2) {
        console.log("¡Gana " + poke1.name + "!");
    } else if (valor2 > valor1) {
        console.log("¡Gana " + poke2.name + "!");
    } else {
        console.log("¡Empate!");
    }
}

//Parte 5

async function pokemonMasFuerte(listaNombres, stat) {
    let mejorValor = -1;
    let ganadorDatos = null; 
    
    console.log("\nBuscando al más fuerte en " + stat + "...");
    
    for (let nombre of listaNombres) {
        let datos = await buscarPokemon(nombre);
        
        // se evalua si existe el pokemon
        if (datos !== null) {
            let valorActual = obtenerStat(datos, stat);
            
            if (valorActual !== null) {
                if (valorActual > mejorValor) {
                    mejorValor = valorActual;
                    ganadorDatos = datos;
                }
            }
        }
    }
    
    if (ganadorDatos !== null) {
        console.log("¡El ganador es " + ganadorDatos.name + " con " + mejorValor + "!");
        return ganadorDatos;
    } else {
        console.log("No hubo ganador.");
        return null;
    }
}

// prueba

async function probarTodo() {
    // se prueba con 6 pokemones
    let miEquipo = ["pikachu", "charizard", "gengar", "snorlax", "dragonite", "gyarados"];
    
    // se encuentra al más fuerte en attack y defense
    let mejorEnAtaque = await pokemonMasFuerte(miEquipo, "attack");
    let mejorEnDefensa = await pokemonMasFuerte(miEquipo, "defense");
    
    // se muestra la ficha completa del ganador en attack
    if (mejorEnAtaque !== null) {
        console.log("\nFicha del ganador en ataque:");
        mostrarFicha(mejorEnAtaque);
    }
}


const prompt = require('prompt-sync')();

async function iniciarAplicacion() {
    console.log("Pokédex ");
    
    
    console.log("1: Buscar un Pokémon");
    console.log("2: Modo Batalla (Comparar dos Pokémon)");
    console.log("3: Ejecutar pruebas del Desafío Final");
    let opcion = prompt("¿Qué deseas hacer? (Escribe 1, 2 o 3): ");
    
    if (opcion === "1") {
        let nombre = prompt("Ingresa el nombre del Pokémon que quieres buscar: ");
        console.log("\nBuscando en la base de datos a: " + nombre + "...\n");
        let datos = await buscarPokemon(nombre);
        mostrarFicha(datos);
        
    } else if (opcion === "2") {
        let poke1 = prompt("Ingresa el nombre del primer competidor: ");
        let poke2 = prompt("Ingresa el nombre del segundo competidor: ");
        let stat = prompt("¿En qué estadística quieres compararlos? (hp, attack, defense, speed...): ");
        console.log("\n¡Modo Batalla Activado! ⚔️");
        await compararPokemon(poke1, poke2, stat);
        
    } else if (opcion === "3") {
        probarTodo();
        
    } else {
        console.log("Opción no válida. Saliendo de la Pokédex. ¡Hasta pronto!");
    }
}

// Ejecutamos el programa interactivo
iniciarAplicacion();
