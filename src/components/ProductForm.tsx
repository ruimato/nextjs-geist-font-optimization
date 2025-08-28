"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { addProduct, getSuppliers, addStockMovement } from '@/lib/stockManager';
import { ProductFormData, Supplier } from '@/types/stock';

interface ProductFormProps {
  onProductAdded: () => void;
  scannedBarcode?: string;
  onBarcodeUsed?: () => void;
  editProduct?: any;
}

export function ProductForm({ 
  onProductAdded, 
  scannedBarcode, 
  onBarcodeUsed,
  editProduct 
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    nom: '',
    famille: '',
    codeBarres: '',
    quantiteStock: 0,
    seuilAlerte: 5,
    dlc: undefined,
    fournisseurId: '',
    prixUnitaire: 0,
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Familles de produits prédéfinies
  const productFamilies = [
    'Alimentaire',
    'Boissons',
    'Hygiène',
    'Nettoyage',
    'Électronique',
    'Textile',
    'Mobilier',
    'Outils',
    'Papeterie',
    'Autre'
  ];

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    if (scannedBarcode) {
      setFormData(prev => ({ ...prev, codeBarres: scannedBarcode }));
      setSuccessMessage('Code-barres scanné avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
      onBarcodeUsed?.();
    }
  }, [scannedBarcode, onBarcodeUsed]);

  useEffect(() => {
    if (editProduct) {
      setFormData({
        nom: editProduct.nom,
        famille: editProduct.famille,
        codeBarres: editProduct.codeBarres || '',
        quantiteStock: editProduct.quantiteStock,
        seuilAlerte: editProduct.seuilAlerte,
        dlc: editProduct.dlc ? new Date(editProduct.dlc) : undefined,
        fournisseurId: editProduct.fournisseurId || '',
        prixUnitaire: editProduct.prixUnitaire || 0,
      });
    }
  }, [editProduct]);

  const loadSuppliers = () => {
    try {
      const suppliersData = getSuppliers();
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du produit est obligatoire';
    }

    if (!formData.famille.trim()) {
      newErrors.famille = 'La famille du produit est obligatoire';
    }

    if (formData.quantiteStock < 0) {
      newErrors.quantiteStock = 'La quantité ne peut pas être négative';
    }

    if (formData.seuilAlerte < 0) {
      newErrors.seuilAlerte = 'Le seuil d\'alerte ne peut pas être négatif';
    }

    if (formData.prixUnitaire && formData.prixUnitaire < 0) {
      newErrors.prixUnitaire = 'Le prix ne peut pas être négatif';
    }

    if (formData.dlc && new Date(formData.dlc) < new Date()) {
      newErrors.dlc = 'La date limite de consommation ne peut pas être dans le passé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const productData: ProductFormData = {
        ...formData,
        nom: formData.nom.trim(),
        famille: formData.famille.trim(),
        codeBarres: formData.codeBarres?.trim() || undefined,
        fournisseurId: formData.fournisseurId === 'none' ? undefined : formData.fournisseurId,
      };

      const newProduct = addProduct(productData);
      
      setSuccessMessage(`Produit "${newProduct.nom}" ajouté avec succès !`);
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        famille: '',
        codeBarres: '',
        quantiteStock: 0,
        seuilAlerte: 5,
        dlc: undefined,
        fournisseurId: '',
        prixUnitaire: 0,
      });

      onProductAdded();

      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      setErrors({ submit: 'Erreur lors de l\'ajout du produit. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {scannedBarcode && (
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            Code scanné: {scannedBarcode}
          </Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nom du produit */}
        <div className="space-y-2">
          <Label htmlFor="nom">Nom du produit *</Label>
          <Input
            id="nom"
            type="text"
            value={formData.nom}
            onChange={(e) => handleInputChange('nom', e.target.value)}
            placeholder="Ex: Lait UHT 1L"
            className={errors.nom ? 'border-red-500' : ''}
          />
          {errors.nom && (
            <p className="text-sm text-red-600">{errors.nom}</p>
          )}
        </div>

        {/* Famille */}
        <div className="space-y-2">
          <Label htmlFor="famille">Famille *</Label>
          <Select 
            value={formData.famille} 
            onValueChange={(value) => handleInputChange('famille', value)}
          >
            <SelectTrigger className={errors.famille ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sélectionnez une famille" />
            </SelectTrigger>
            <SelectContent>
              {productFamilies.map((family) => (
                <SelectItem key={family} value={family}>
                  {family}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.famille && (
            <p className="text-sm text-red-600">{errors.famille}</p>
          )}
        </div>

        {/* Code-barres */}
        <div className="space-y-2">
          <Label htmlFor="codeBarres">Code-barres</Label>
          <Input
            id="codeBarres"
            type="text"
            value={formData.codeBarres}
            onChange={(e) => handleInputChange('codeBarres', e.target.value)}
            placeholder="Ex: 7613034626844"
          />
        </div>

        {/* Quantité et seuil */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantiteStock">Quantité en stock *</Label>
            <Input
              id="quantiteStock"
              type="number"
              min="0"
              value={formData.quantiteStock}
              onChange={(e) => handleInputChange('quantiteStock', parseInt(e.target.value) || 0)}
              className={errors.quantiteStock ? 'border-red-500' : ''}
            />
            {errors.quantiteStock && (
              <p className="text-sm text-red-600">{errors.quantiteStock}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="seuilAlerte">Seuil d'alerte *</Label>
            <Input
              id="seuilAlerte"
              type="number"
              min="0"
              value={formData.seuilAlerte}
              onChange={(e) => handleInputChange('seuilAlerte', parseInt(e.target.value) || 0)}
              className={errors.seuilAlerte ? 'border-red-500' : ''}
            />
            {errors.seuilAlerte && (
              <p className="text-sm text-red-600">{errors.seuilAlerte}</p>
            )}
          </div>
        </div>

        {/* DLC et Prix */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dlc">Date limite de consommation</Label>
            <Input
              id="dlc"
              type="date"
              value={formData.dlc ? formData.dlc.toISOString().split('T')[0] : ''}
              onChange={(e) => handleInputChange('dlc', e.target.value ? new Date(e.target.value) : undefined)}
              className={errors.dlc ? 'border-red-500' : ''}
            />
            {errors.dlc && (
              <p className="text-sm text-red-600">{errors.dlc}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prixUnitaire">Prix unitaire (CHF)</Label>
            <Input
              id="prixUnitaire"
              type="number"
              min="0"
              step="0.01"
              value={formData.prixUnitaire}
              onChange={(e) => handleInputChange('prixUnitaire', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className={errors.prixUnitaire ? 'border-red-500' : ''}
            />
            {errors.prixUnitaire && (
              <p className="text-sm text-red-600">{errors.prixUnitaire}</p>
            )}
          </div>
        </div>

        {/* Fournisseur */}
        <div className="space-y-2">
          <Label htmlFor="fournisseur">Fournisseur</Label>
          <Select 
            value={formData.fournisseurId} 
            onValueChange={(value) => handleInputChange('fournisseurId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un fournisseur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucun fournisseur</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Erreur générale */}
        {errors.submit && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {errors.submit}
            </AlertDescription>
          </Alert>
        )}

        {/* Bouton de soumission */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Ajout en cours...' : 'Ajouter le produit'}
        </Button>
      </form>
    </div>
  );
}
