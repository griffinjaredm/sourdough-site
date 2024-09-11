// Base recipe for one loaf
const baseRecipe = {
    water: 350,
    starter: 90,
    flour: 500,
    salt: 11
};

// Function to process the CSV file
function processCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n');
        let breadTypes = new Set();
        let customerOrders = [];
        let output = '';

        // Process customer orders and identify unique bread types
        for (let i = 1; i < lines.length; i++) { // Start from 1 to skip header
            const columns = lines[i].split(',');
            if (columns.length > 6) { // Ensure we have enough columns
                const customerName = columns[0].trim();
                const itemName = columns[6].trim();
                const quantity = parseInt(columns[5]) || 0;
                const options = columns[7].trim();

                if (itemName === "Traditional Sourdough Bread" || itemName === "Chocolate Chip Sourdough Bread") {
                    breadTypes.add(itemName);
                    customerOrders.push({ customerName, itemName, quantity, options });
                }
            }
        }

        // Display customer orders
        output += "Customer Orders:\n";
        customerOrders.forEach(order => {
            output += `${order.customerName}: ${order.quantity} x ${order.itemName}`;
            if (order.options) {
                output += ` (${order.options})`;
            }
            output += '\n';
        });
        output += '\n';

        // Calculate ingredients for each bread type (always multiplied by 3)
        let totalIngredients = { water: 0, starter: 0, flour: 0, salt: 0 };
        breadTypes.forEach(breadType => {
            output += `For ${breadType} (3 loaves):\n`;
            for (let [ingredient, amount] of Object.entries(baseRecipe)) {
                let totalAmount = amount * 3;
                output += `${totalAmount}g ${ingredient}\n`;
                totalIngredients[ingredient] += totalAmount;
            }
            output += '\n';
        });

        // Add total ingredients for all breads combined
        output += "Total ingredients for all breads combined:\n";
        for (let [ingredient, amount] of Object.entries(totalIngredients)) {
            output += `${amount}g ${ingredient}\n`;
        }

        document.getElementById('output').innerText = output || "No matching bread types found in the CSV.";
    };
    reader.readAsText(file);
}

// Event listener for file input
document.getElementById('csvFile').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('processButton').disabled = false;
    } else {
        document.getElementById('fileName').textContent = '';
        document.getElementById('processButton').disabled = true;
    }
});

// Event listener for process button
document.getElementById('processButton').addEventListener('click', function() {
    const file = document.getElementById('csvFile').files[0];
    if (file) {
        processCSV(file);
    }
});

// Event listener to trigger file input when the label is clicked
document.querySelector('.file-input-label').addEventListener('click', function() {
    document.getElementById('csvFile').click();
});