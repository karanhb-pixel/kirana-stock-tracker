import React, { useState } from 'react';
import type { Item } from '../types';

interface ItemEntryFormProps {
  onAddItem: (item: Omit<Item, 'id'>) => void;
}

const ItemEntryForm: React.FC<ItemEntryFormProps> = ({ onAddItem }) => {
  const [formData, setFormData] = useState<Omit<Item, 'id'>>({
    itemName: '',
    supplier: '',
    targetStock: 0,
    vendorCycle: 'Weekly',
    nextOrderDay: 'Monday',
    currentStock: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'targetStock' || name === 'currentStock' ? parseInt(value) || 0 : value,
    }));
    // Clear error for the field
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.itemName.trim()) newErrors.itemName = 'Item Name is required';
    if (!formData.supplier.trim()) newErrors.supplier = 'Supplier is required';
    if (formData.targetStock < 0) newErrors.targetStock = 'Target Stock must be >= 0';
    if (formData.currentStock < 0) newErrors.currentStock = 'Current Stock must be >= 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAddItem(formData);
      setNotification(`Item "${formData.itemName}" added successfully!`);
      // Clear form
      setFormData({
        itemName: '',
        supplier: '',
        targetStock: 0,
        vendorCycle: 'Weekly',
        nextOrderDay: 'Monday',
        currentStock: 0,
      });
      setErrors({});
      // Hide notification after 3 seconds
      setTimeout(() => setNotification(''), 3000);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '100%', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ color: '#1e3a8a', fontSize: '1.25rem', marginBottom: '1rem' }}>Item Entry (New Inventory Registration)</h2>
      {notification && <div style={{ background: '#10b981', color: 'white', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px' }}>{notification}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          />
          {errors.itemName && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.itemName}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Supplier:</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          />
          {errors.supplier && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.supplier}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Target Stock (Par Level):</label>
          <input
            type="number"
            name="targetStock"
            value={formData.targetStock}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          />
          {errors.targetStock && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.targetStock}</span>}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Vendor Cycle:</label>
          <select
            name="vendorCycle"
            value={formData.vendorCycle}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          >
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Next Order Day:</label>
          <select
            name="nextOrderDay"
            value={formData.nextOrderDay}
            onChange={handleChange}
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          >
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
          </select>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Initial Current Stock:</label>
          <input
            type="number"
            name="currentStock"
            value={formData.currentStock}
            onChange={handleChange}
            min="0"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px', minHeight: '48px' }}
          />
          {errors.currentStock && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.currentStock}</span>}
        </div>
        <button type="submit" style={{ padding: '0.75rem 1.5rem', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', minHeight: '48px', cursor: 'pointer' }}>Add Item</button>
      </form>
    </div>
  );
};

export default ItemEntryForm;