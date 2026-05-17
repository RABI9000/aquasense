document.addEventListener('DOMContentLoaded', () => {
    // Populate crops
    fetch('/api/crops')
        .then(response => response.json())
        .then(crops => {
            const select = document.getElementById('crop_name');
            crops.forEach(crop => {
                const option = document.createElement('option');
                option.value = crop;
                option.textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
                if (crop === 'wheat') option.selected = true;
                select.appendChild(option);
            });
        });

    // Toggle location inputs
    const useApiCheckbox = document.getElementById('use_api');
    const locationInputs = document.getElementById('location-inputs');
    
    useApiCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            locationInputs.classList.remove('hidden');
            document.getElementById('lat').required = true;
            document.getElementById('lon').required = true;
        } else {
            locationInputs.classList.add('hidden');
            document.getElementById('lat').required = false;
            document.getElementById('lon').required = false;
        }
    });

    // Handle form submission
    const form = document.getElementById('simulation-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('submit-btn');
        const spinner = btn.querySelector('.spinner');
        const btnText = btn.querySelector('span');
        
        // UI Loading state
        btn.disabled = true;
        spinner.classList.remove('hidden');
        btnText.textContent = 'Simulating...';
        
        const formData = {
            area: parseFloat(document.getElementById('area').value),
            unit: document.getElementById('unit').value,
            crop_name: document.getElementById('crop_name').value,
            crop_stage: document.getElementById('crop_stage').value,
            use_api: document.getElementById('use_api').checked,
            lat: parseFloat(document.getElementById('lat').value || 0),
            lon: parseFloat(document.getElementById('lon').value || 0)
        };

        try {
            const response = await fetch('/api/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                renderResults(result.data);
            } else {
                alert('Error running simulation: ' + result.message);
            }
        } catch (error) {
            alert('Network error while running simulation.');
            console.error(error);
        } finally {
            // Restore UI
            btn.disabled = false;
            spinner.classList.add('hidden');
            btnText.textContent = 'Run Simulation';
        }
    });

    function renderResults(data) {
        document.getElementById('placeholder-state').classList.add('hidden');
        document.getElementById('results-content').classList.remove('hidden');
        
        // Metrics
        document.getElementById('val-total-water').textContent = `${data.batch_total.toFixed(2)} L`;
        document.getElementById('val-irrigation-days').textContent = data.batch_days;
        document.getElementById('val-rmse').textContent = data.rmse.toFixed(4);
        
        // Schedule table
        const tbody = document.querySelector('#schedule-table tbody');
        tbody.innerHTML = '';
        
        data.schedule.forEach(row => {
            const tr = document.createElement('tr');
            
            let dateStr = "Day " + (row.forecast_day || "-");
            if (row.date) {
                dateStr = String(row.date).substring(0, 10);
            }
            
            const soilMoisture = (row.soil_moisture || row.predicted_soil_moisture || 0).toFixed(3);
            const rainfall = (row.forecast_rainfall || row.rainfall || 0).toFixed(1);
            const irrigation = (row.smart_irrigation || row.irrigation_liters || 0).toFixed(2);
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${soilMoisture}</td>
                <td>${rainfall} mm</td>
                <td><strong>${irrigation}</strong></td>
            `;
            tbody.appendChild(tr);
        });
        
        // Model Comparison table
        const compTbody = document.querySelector('#comparison-table tbody');
        if (compTbody && data.model_comparison) {
            compTbody.innerHTML = '';
            data.model_comparison.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${row.Model}</strong></td>
                    <td>${row.RMSE.toFixed(4)}</td>
                    <td>${row.MAE.toFixed(4)}</td>
                    <td>${row['Inference Time (ms)'].toFixed(2)} ms</td>
                `;
                compTbody.appendChild(tr);
            });
        }
        
        // Add cache busting query param to images to force reload
        const ts = new Date().getTime();
        document.getElementById('plot-1').src = `/plots/plot_1_moisture.png?t=${ts}`;
        document.getElementById('plot-2').src = `/plots/plot_2_irrigation.png?t=${ts}`;
        document.getElementById('plot-3').src = `/plots/plot_3_water_usage.png?t=${ts}`;
        document.getElementById('plot-4').src = `/plots/plot_4_stress_days.png?t=${ts}`;
        document.getElementById('plot-5').src = `/plots/plot_5_forecast.png?t=${ts}`;
    }
});
