export interface Product {
  id: string;
  nom: string;
  famille: string;
  codeBarres?: string;
  quantiteStock: number;
  seuilAlerte: number;
  dlc?: Date; // Date Limite de Consommation
  fournisseurId?: string;
  prixUnitaire?: number;
  dateCreation: Date;
  dateModification: Date;
}

export interface Supplier {
  id: string;
  nom: string;
  contact: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  dateCreation: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'entree' | 'sortie';
  quantite: number;
  motif: string;
  date: Date;
  utilisateur?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  type: 'stock_bas' | 'dlc_proche' | 'dlc_depassee';
  message: string;
  dateCreation: Date;
  estLue: boolean;
}

export interface MovementData {
  date: string;
  entrees: number;
  sorties: number;
  stock: number;
}

export type ProductFormData = Omit<Product, 'id' | 'dateCreation' | 'dateModification'>;
export type SupplierFormData = Omit<Supplier, 'id' | 'dateCreation'>;
