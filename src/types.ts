export interface Item {
  id: number;
  itemName: string;
  supplier: string;
  targetStock: number;
  vendorCycle: 'Weekly' | 'Bi-Weekly';
  nextOrderDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  currentStock: number;
}