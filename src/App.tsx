import React, { useState, useEffect } from 'react';
import ItemEntryForm from './components/ItemEntryForm';
import InventoryList from './components/InventoryList';
import type { Item } from './types';
import './App.css';
type ParsedItem = Record<string, string | number | undefined>;



function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [filters, setFilters] = useState({
    nextOrderDay: '',
    vendorCycle: '',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('kiranaStockItems');
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('kiranaStockItems', JSON.stringify(items));
  }, [items]);

  const addItem = (itemData: Omit<Item, 'id'>) => {
    const newItem: Item = { ...itemData, id: Date.now() };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: number, updatedItem: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
  };

  const filteredItems = items
    .filter(item => {
      if (filters.nextOrderDay && item.nextOrderDay !== filters.nextOrderDay) return false;
      if (filters.vendorCycle && item.vendorCycle !== filters.vendorCycle) return false;
      return true;
    })
    .sort((a, b) => {
      const aOrder = Math.max(0, a.targetStock - a.currentStock);
      const bOrder = Math.max(0, b.targetStock - b.currentStock);
      if (aOrder > 0 && bOrder === 0) return -1;
      if (aOrder === 0 && bOrder > 0) return 1;
      return a.itemName.localeCompare(b.itemName);
    });

  const exportToCSV = () => {
    const headers = ['id', 'itemName', 'supplier', 'vendorCycle', 'nextOrderDay', 'targetStock', 'currentStock'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        item.id,
        `"${item.itemName.replace(/"/g, '""')}"`,
        `"${item.supplier.replace(/"/g, '""')}"`,
        item.vendorCycle,
        item.nextOrderDay,
        item.targetStock,
        item.currentStock
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      if (lines.length < 2) {
        alert('Invalid CSV format');
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['id', 'itemName', 'supplier', 'vendorCycle', 'nextOrderDay', 'targetStock', 'currentStock'];
      if (!requiredHeaders.every(h => headers.includes(h))) {
        alert('Missing required headers');
        return;
      }
      const newItems: Item[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(',').map(v => v.trim());
        if (values.length !== headers.length) continue;
        const item: ParsedItem = {};
        headers.forEach((h, index) => {
          if (h === 'id') item[h] = parseInt(values[index]) || Date.now();
          else if (h === 'targetStock' || h === 'currentStock') item[h] = parseInt(values[index]) || 0;
          else item[h] = values[index].replace(/^"|"$/g, '').replace(/""/g, '"');
        });
        if (
          typeof item.id === 'number' && !isNaN(item.id) &&
          item.itemName &&
          item.supplier &&
          typeof item.targetStock === 'number' && !isNaN(item.targetStock) &&
          typeof item.vendorCycle === 'string' &&
          (item.vendorCycle === 'Weekly' || item.vendorCycle === 'Bi-Weekly') &&
          typeof item.nextOrderDay === 'string' &&
          ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(item.nextOrderDay) &&
          typeof item.currentStock === 'number' && !isNaN(item.currentStock)
        ) {
          newItems.push(item as unknown as Item);
        }
      }
      setItems(newItems);
      alert(`Imported ${newItems.length} items`);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const saveToDatabase = async () => {
    try {
      const response = await fetch('/api/save-inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(items),
      });
      if (response.ok) {
        alert('Data saved to database successfully!');
      } else {
        alert('Failed to save data to database.');
      }
    } catch (error) {
      alert('Error saving to database: ' + (error as Error).message);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Kirana Stock Tracker</h1>
      </header>
      <main>
        <ItemEntryForm onAddItem={addItem} />
        <InventoryList
          items={filteredItems}
          onUpdateItem={updateItem}
          filters={filters}
          onFiltersChange={setFilters}
          onExport={exportToCSV}
          onImport={importFromCSV}
          onSaveToDB={saveToDatabase}
        />
      </main>
    </div>
  );
}

export default App;

