import { Product, Supplier, StockMovement, StockAlert, MovementData } from '@/types/stock';

const STORAGE_KEYS = {
  PRODUCTS: 'gestion_stock_products',
  SUPPLIERS: 'gestion_stock_suppliers',
  MOVEMENTS: 'gestion_stock_movements',
  ALERTS: 'gestion_stock_alerts',
};

// Utilitaires pour localStorage
const getFromStorage = <T>(key: string): T[] => {
  try {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${key}:`, error);
    return [];
  }
};

const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
};

// Gestion des produits
export const addProduct = (product: Omit<Product, 'id' | 'dateCreation' | 'dateModification'>): Product => {
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  const newProduct: Product = {
    ...product,
    id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dateCreation: new Date(),
    dateModification: new Date(),
  };
  
  products.push(newProduct);
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  
  // Créer un mouvement d'entrée si quantité > 0
  if (newProduct.quantiteStock > 0) {
    addStockMovement({
      productId: newProduct.id,
      type: 'entree',
      quantite: newProduct.quantiteStock,
      motif: 'Stock initial',
    });
  }
  
  // Vérifier les alertes
  checkStockAlerts();
  
  return newProduct;
};

export const getProducts = (): Product[] => {
  return getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
};

export const updateProduct = (updatedProduct: Product): void => {
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  const index = products.findIndex(p => p.id === updatedProduct.id);
  
  if (index !== -1) {
    products[index] = {
      ...updatedProduct,
      dateModification: new Date(),
    };
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    checkStockAlerts();
  }
};

export const deleteProduct = (productId: string): void => {
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  const filteredProducts = products.filter(p => p.id !== productId);
  saveToStorage(STORAGE_KEYS.PRODUCTS, filteredProducts);
  
  // Supprimer les mouvements associés
  const movements = getFromStorage<StockMovement>(STORAGE_KEYS.MOVEMENTS);
  const filteredMovements = movements.filter(m => m.productId !== productId);
  saveToStorage(STORAGE_KEYS.MOVEMENTS, filteredMovements);
};

export const getProductById = (productId: string): Product | undefined => {
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  return products.find(p => p.id === productId);
};

// Gestion des fournisseurs
export const addSupplier = (supplier: Omit<Supplier, 'id' | 'dateCreation'>): Supplier => {
  const suppliers = getFromStorage<Supplier>(STORAGE_KEYS.SUPPLIERS);
  const newSupplier: Supplier = {
    ...supplier,
    id: `supp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    dateCreation: new Date(),
  };
  
  suppliers.push(newSupplier);
  saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  
  return newSupplier;
};

export const getSuppliers = (): Supplier[] => {
  return getFromStorage<Supplier>(STORAGE_KEYS.SUPPLIERS);
};

export const updateSupplier = (updatedSupplier: Supplier): void => {
  const suppliers = getFromStorage<Supplier>(STORAGE_KEYS.SUPPLIERS);
  const index = suppliers.findIndex(s => s.id === updatedSupplier.id);
  
  if (index !== -1) {
    suppliers[index] = updatedSupplier;
    saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  }
};

export const deleteSupplier = (supplierId: string): void => {
  const suppliers = getFromStorage<Supplier>(STORAGE_KEYS.SUPPLIERS);
  const filteredSuppliers = suppliers.filter(s => s.id !== supplierId);
  saveToStorage(STORAGE_KEYS.SUPPLIERS, filteredSuppliers);
};

// Gestion des mouvements de stock
export const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>): StockMovement => {
  const movements = getFromStorage<StockMovement>(STORAGE_KEYS.MOVEMENTS);
  const newMovement: StockMovement = {
    ...movement,
    id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
  };
  
  movements.push(newMovement);
  saveToStorage(STORAGE_KEYS.MOVEMENTS, movements);
  
  // Mettre à jour le stock du produit
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  const productIndex = products.findIndex(p => p.id === movement.productId);
  
  if (productIndex !== -1) {
    const product = products[productIndex];
    if (movement.type === 'entree') {
      product.quantiteStock += movement.quantite;
    } else {
      product.quantiteStock = Math.max(0, product.quantiteStock - movement.quantite);
    }
    product.dateModification = new Date();
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }
  
  checkStockAlerts();
  
  return newMovement;
};

export const getStockMovements = (): StockMovement[] => {
  return getFromStorage<StockMovement>(STORAGE_KEYS.MOVEMENTS);
};

export const getMovementsByProduct = (productId: string): StockMovement[] => {
  const movements = getFromStorage<StockMovement>(STORAGE_KEYS.MOVEMENTS);
  return movements.filter(m => m.productId === productId);
};

// Données pour les graphiques
export const getMovementData = (days: number = 30): MovementData[] => {
  const movements = getFromStorage<StockMovement>(STORAGE_KEYS.MOVEMENTS);
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  
  const data: MovementData[] = [];
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayMovements = movements.filter(m => {
      const movDate = new Date(m.date);
      return movDate.toISOString().split('T')[0] === dateStr;
    });
    
    const entrees = dayMovements
      .filter(m => m.type === 'entree')
      .reduce((sum, m) => sum + m.quantite, 0);
    
    const sorties = dayMovements
      .filter(m => m.type === 'sortie')
      .reduce((sum, m) => sum + m.quantite, 0);
    
    const totalStock = products.reduce((sum, p) => sum + p.quantiteStock, 0);
    
    data.push({
      date: dateStr,
      entrees,
      sorties,
      stock: totalStock,
    });
  }
  
  return data;
};

// Gestion des alertes
export const checkStockAlerts = (): void => {
  const products = getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  const alerts = getFromStorage<StockAlert>(STORAGE_KEYS.ALERTS);
  
  // Supprimer les anciennes alertes
  const newAlerts: StockAlert[] = [];
  
  products.forEach(product => {
    // Alerte stock bas
    if (product.quantiteStock <= product.seuilAlerte) {
      newAlerts.push({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: product.id,
        type: 'stock_bas',
        message: `Stock bas pour ${product.nom}: ${product.quantiteStock} unités restantes (seuil: ${product.seuilAlerte})`,
        dateCreation: new Date(),
        estLue: false,
      });
    }
    
    // Alerte DLC
    if (product.dlc) {
      const dlc = new Date(product.dlc);
      const today = new Date();
      const diffTime = dlc.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        newAlerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          type: 'dlc_depassee',
          message: `DLC dépassée pour ${product.nom}: ${dlc.toLocaleDateString('fr-CH')}`,
          dateCreation: new Date(),
          estLue: false,
        });
      } else if (diffDays <= 7) {
        newAlerts.push({
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          type: 'dlc_proche',
          message: `DLC proche pour ${product.nom}: ${dlc.toLocaleDateString('fr-CH')} (${diffDays} jours)`,
          dateCreation: new Date(),
          estLue: false,
        });
      }
    }
  });
  
  saveToStorage(STORAGE_KEYS.ALERTS, newAlerts);
};

export const getAlerts = (): StockAlert[] => {
  return getFromStorage<StockAlert>(STORAGE_KEYS.ALERTS);
};

export const markAlertAsRead = (alertId: string): void => {
  const alerts = getFromStorage<StockAlert>(STORAGE_KEYS.ALERTS);
  const alertIndex = alerts.findIndex(a => a.id === alertId);
  
  if (alertIndex !== -1) {
    alerts[alertIndex].estLue = true;
    saveToStorage(STORAGE_KEYS.ALERTS, alerts);
  }
};

export const deleteAlert = (alertId: string): void => {
  const alerts = getFromStorage<StockAlert>(STORAGE_KEYS.ALERTS);
  const filteredAlerts = alerts.filter(a => a.id !== alertId);
  saveToStorage(STORAGE_KEYS.ALERTS, filteredAlerts);
};

// Utilitaires
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

export const exportData = () => {
  const data = {
    products: getProducts(),
    suppliers: getSuppliers(),
    movements: getStockMovements(),
    alerts: getAlerts(),
    exportDate: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.products) saveToStorage(STORAGE_KEYS.PRODUCTS, data.products);
    if (data.suppliers) saveToStorage(STORAGE_KEYS.SUPPLIERS, data.suppliers);
    if (data.movements) saveToStorage(STORAGE_KEYS.MOVEMENTS, data.movements);
    if (data.alerts) saveToStorage(STORAGE_KEYS.ALERTS, data.alerts);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
    return false;
  }
};
