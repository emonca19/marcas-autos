
document.addEventListener('DOMContentLoaded', () => {

    const marcasSelect = document.getElementById('marcasSelect');
    const modelosSelect = document.getElementById('modelosSelect');
    
    const API_URL = 'http://localhost:8888';

    
    const colorMap = {
        "Toyota": "color-Toyota",
        "Ford": "color-Ford",
        "Honda": "color-Honda",
        "Chevrolet": "color-Chevrolet",
        "Nissan": "color-Nissan"
    };

    async function cargarMarcas() {
        try {
            const response = await fetch(`${API_URL}/marcas`);
            if (!response.ok) {
                throw new Error('No se pudieron cargar las marcas');
            }
            
            const marcas = await response.json();

            marcasSelect.innerHTML = '<option value="">-- Seleccione una marca --</option>';

            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca;
                option.textContent = marca;
                marcasSelect.appendChild(option);
            });
            
            aplicarColor(""); 

        } catch (error) {
            console.error('Error:', error);
            marcasSelect.innerHTML = '<option value="">Error al cargar marcas</option>';
        }
    }

    async function cargarModelos(marca) {
        try {
            modelosSelect.innerHTML = '<option value="">Cargando modelos...</option>';
            modelosSelect.disabled = true;

            const response = await fetch(`${API_URL}/modelos/${encodeURIComponent(marca)}`);
            
            if (!response.ok) {
                throw new Error('No se pudieron cargar los modelos');
            }
            
            const modelos = await response.json();

            modelosSelect.innerHTML = '<option value="">-- Seleccione un modelo --</option>';

            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo;
                option.textContent = modelo;
                modelosSelect.appendChild(option);
            });

            modelosSelect.disabled = false;

        } catch (error) {
            console.error('Error:', error);
            modelosSelect.innerHTML = '<option value="">Error al cargar modelos</option>';
        }
    }

    function aplicarColor(marca) {
        marcasSelect.classList.remove(...Object.values(colorMap), 'color-default');
        
        if (marca && colorMap[marca]) {
            marcasSelect.classList.add(colorMap[marca]);
        } else {
            marcasSelect.classList.add('color-default');
        }
    }

    marcasSelect.addEventListener('change', () => {
        const marcaSeleccionada = marcasSelect.value;

        aplicarColor(marcaSeleccionada);

        if (marcaSeleccionada) {
            cargarModelos(marcaSeleccionada);
        } else {
            modelosSelect.innerHTML = '<option value="">-- Seleccione una marca primero --</option>';
            modelosSelect.disabled = true;
        }
    });

    cargarMarcas();

});