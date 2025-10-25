import React from 'react';
import type { Item } from '../types';

interface InventoryListProps {
  items: Item[];
  onUpdateItem: (id: number, updatedItem: Partial<Item>) => void;
  filters: { nextOrderDay: string; vendorCycle: string };
  onFiltersChange: (filters: { nextOrderDay: string; vendorCycle: string }) => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onUpdateItem, filters, onFiltersChange, onExport, onImport }) => {
  return (
    <div className="card" style={{ maxWidth: '100%', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ color: '#1e3a8a', fontSize: '1.25rem', marginBottom: '1rem' }}>Inventory List</h2>
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={onExport} style={{ padding: '0.75rem 1.5rem', marginRight: '0.5rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', minHeight: '48px', cursor: 'pointer' }}>
          Export CSV
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={onImport}
          style={{ display: 'none' }}
          id="import-csv"
        />
        <label htmlFor="import-csv" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', minHeight: '48px' }}>
          Import CSV
        </label>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Next Order Day:</label>
          <select
            value={filters.nextOrderDay}
            onChange={(e) => onFiltersChange({ ...filters, nextOrderDay: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          >
            <option value="">All</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Vendor Cycle:</label>
          <select
            value={filters.vendorCycle}
            onChange={(e) => onFiltersChange({ ...filters, vendorCycle: e.target.value })}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          >
            <option value="">All</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
          </select>
        </div>
      </div>
      {items.length === 0 ? (
        <p>No items in inventory.</p>
      ) : (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {items.map((item) => {
            const orderQuantity = Math.max(0, item.targetStock - item.currentStock);
            const isUrgent = orderQuantity > 0;
            return (
              <div key={item.id} className="card" style={{
                border: `2px solid ${isUrgent ? '#ef4444' : '#10b981'}`,
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: isUrgent ? '#fef2f2' : '#f0fdf4'
              }}>
                <h3 style={{ color: '#1e3a8a', fontSize: '1.125rem', marginBottom: '0.5rem' }}>{item.itemName}</h3>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}><strong>Supplier:</strong> {item.supplier}</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}><strong>Vendor Cycle:</strong> {item.vendorCycle}</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}><strong>Next Order Day:</strong> {item.nextOrderDay}</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}><strong>Target Stock:</strong> {item.targetStock}</p>
                <div style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}><strong>Current Stock:</strong></label>
                  <input
                    type="number"
                    value={item.currentStock}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      onUpdateItem(item.id, { currentStock: value });
                    }}
                    onBlur={() => {
                      // Update on blur
                    }}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      minHeight: '48px'
                    }}
                  />
                </div>
                <p style={{ color: isUrgent ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '1rem', margin: '0.25rem 0' }}>
                  <strong>Order Quantity:</strong> {orderQuantity}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryList;