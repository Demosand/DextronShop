let myChart = null;
let showGrid = true;
let enableAnimation = true;

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    updateChartTheme();
});

// Chart Type Buttons
const chartTypeButtons = document.querySelectorAll('.chart-type-btn');
let currentChartType = 'line';

chartTypeButtons.forEach(button => {
    button.addEventListener('click', () => {
        chartTypeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentChartType = button.dataset.type;
        createChart();
    });
});

// Sample Data Button
document.getElementById('sampleDataBtn').addEventListener('click', () => {
    const sampleData = `January,65\nFebruary,59\nMarch,80\nApril,72\nMay,85\nJune,92\nJuly,88`;
    document.getElementById('dataInput').value = sampleData;
    createChart();
});

// Clear Data Button
document.getElementById('clearDataBtn').addEventListener('click', () => {
    document.getElementById('dataInput').value = '';
    if (myChart) {
        myChart.destroy();
        myChart = null;
    }
});

// Toggle Grid Button
document.getElementById('toggleGrid').addEventListener('click', () => {
    showGrid = !showGrid;
    createChart();
});

// Toggle Animation Button
document.getElementById('toggleAnimation').addEventListener('click', () => {
    enableAnimation = !enableAnimation;
    createChart();
});

// Download Chart Button
document.getElementById('downloadBtn').addEventListener('click', () => {
    const canvas = document.getElementById('myChart');
    const link = document.createElement('a');
    link.download = 'chart.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

function getChartColors(count) {
    const colors = [];
    const baseHues = [250, 200, 150, 100, 50]; // Different base hues for variety
    
    for (let i = 0; i < count; i++) {
        const hue = baseHues[i % baseHues.length];
        const saturation = 70 + Math.random() * 10;
        const lightness = 50 + Math.random() * 10;
        colors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`);
    }
    
    return colors;
}

function parseData() {
    const dataInput = document.getElementById('dataInput').value;
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
    
    return { labels, values };
}

function getChartOptions(type) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#f1f5f9' : '#334155';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    return {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: enableAnimation ? 1000 : 0,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: textColor,
                    font: {
                        family: 'Poppins',
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
                color: textColor,
                font: {
                    family: 'Poppins',
                    size: 16,
                    weight: 500
                }
            }
        },
        scales: {
            x: {
                display: showGrid,
                grid: {
                    display: showGrid,
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Poppins'
                    }
                }
            },
            y: {
                display: !['pie', 'doughnut'].includes(type) && showGrid,
                grid: {
                    display: showGrid,
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Poppins'
                    }
                }
            }
        }
    };
}

function createChart() {
    const { labels, values } = parseData();
    if (labels.length === 0 || values.length === 0) return;

    const ctx = document.getElementById('myChart').getContext('2d');
    const colors = getChartColors(values.length);
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: currentChartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Data',
                data: values,
                backgroundColor: colors,
                borderColor: currentChartType === 'line' ? colors[0] : colors,
                borderWidth: 2,
                fill: currentChartType === 'line' ? false : true,
                tension: 0.4
            }]
        },
        options: getChartOptions(currentChartType)
    });
}

function updateChartTheme() {
    if (myChart) {
        myChart.options = getChartOptions(currentChartType);
        myChart.update();
    }
}

// Initialize with sample data
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('sampleDataBtn').click();
});
