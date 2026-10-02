// Parte 1: Conexión y exploración de la respuesta

async function explorarPokemon(nombre) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`;
    console.log(`Buscando a ${nombre}...`);
    
    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            console.error(`Error: No se pudo obtener la información (Status: ${respuesta.status})`);
            return;
        }
        
        const datos = await respuesta.json();
        
        
        
        console.log(`\n--- Datos principales de ${datos.name.toUpperCase()} (ID: ${datos.id}) ---`);
        console.log(`Altura: ${datos.height} decímetros`);
        console.log(`Peso: ${datos.weight} hectogramos`);
        
        // Ejercicio 1: 
        console.log("\nTIPOS:");
        for (const t of datos.types) {
            console.log(`- ${t.type.name}`);
        }
        
        console.log("\nESTADÍSTICAS:");
        for (const s of datos.stats) {
            console.log(`- ${s.stat.name}: ${s.base_stat}`);
        }
        
        console.log("\nHABILIDADES:");
        for (const a of datos.abilities) {
            const oculta = a.is_hidden ? " (oculta)" : "";
            console.log(`- ${a.ability.name}${oculta}`);
        }
        
    } catch (error) {
        console.error("Hubo un error en la petición:", error);
    }
}


explorarPokemon("pikachu");
