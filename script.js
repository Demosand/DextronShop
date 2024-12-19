let myChart = null;

document.getElementById('createChart').addEventListener('click', createChart);

function createChart() {
    const chartType = document.getElementById('chartType').value;
    const dataInput = document.getElementById('dataInput').value;
    
    // Parse the input data
    const rows = dataInput.trim().split('\n');
    const labels = [];
    const values = [];
    
    rows.forEach(row => {
        const [label, value] = row.split(',');
        if (label && value) {
            labels.push(label.trim());
            values.push(parseFloat(value.trim()));
        }
    });
    
    // Destroy existing chart if it exists
    if (myChart) {
        myChart.destroy();
    }
    
    // Generate random colors for the chart
    const colors = generateColors(values.length);
    
    // Create the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: values,
                backgroundColor: colors,
                borderColor: chartType === 'line' ? colors[0] : colors,
                borderWidth: 2,
                fill: chartType === 'line' ? false : true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    display: ['pie', 'doughnut'].includes(chartType) ? false : true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`
                }
            }
        }
    });
}

function generateColors(count) {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = (i * 360) / count;
        colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
    }
    return colors;
}

// Add example data when the page loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dataInput').value = `January,65\nFebruary,59\nMarch,80\nApril,72\nMay,85`;
    createChart();
});
