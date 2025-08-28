"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
}

export function BarcodeScanner({ onBarcodeScanned }: BarcodeScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedInput, setScannedInput] = useState<string>('');
  const [lastScannedCode, setLastScannedCode] = useState<string>('');
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const [scanCount, setScanCount] = useState(0);

  // Détecter les scans de pistolet (saisie rapide suivie d'Enter)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isScanning) return;
      
      // Si c'est Enter et qu'il y a du contenu
      if (e.key === 'Enter' && scannedInput.trim()) {
        e.preventDefault();
        handleBarcodeDetected(scannedInput.trim());
        setScannedInput('');
        return;
      }
      
      // Pour les autres touches, on accumule le texte
      if (e.key.length === 1 || e.key === 'Backspace') {
        // Réinitialiser le timeout à chaque frappe
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // Si pas d'Enter après 100ms, c'est probablement de la saisie manuelle
          if (scannedInput.trim() && scannedInput.length > 5) {
            handleBarcodeDetected(scannedInput.trim());
            setScannedInput('');
          }
        }, 100);
      }
    };

    if (isScanning) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus sur l'input pour capturer les scans
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [isScanning, scannedInput]);

  const handleBarcodeDetected = (barcode: string) => {
    if (barcode && barcode !== lastScannedCode) {
      setLastScannedCode(barcode);
      setScanHistory(prev => [barcode, ...prev.slice(0, 4)]); // Garder les 5 derniers
      setScanCount(prev => prev + 1);
      onBarcodeScanned(barcode);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setScannedInput('');
    // Focus automatique sur l'input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const stopScanning = () => {
    setIsScanning(false);
    setScannedInput('');
  };

  const handleManualInput = () => {
    const manualCode = prompt('Entrez le code-barres manuellement:');
    if (manualCode && manualCode.trim()) {
      const code = manualCode.trim();
      handleBarcodeDetected(code);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScannedInput(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedInput.trim()) {
      handleBarcodeDetected(scannedInput.trim());
      setScannedInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone de scan principale */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {!isScanning ? (
              <div className="space-y-4">
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🔫</div>
                    <p className="text-gray-600 font-medium">Scanner Pistolet USB</p>
                    <p className="text-sm text-gray-500">Prêt à scanner les codes-barres</p>
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button onClick={startScanning} className="flex-1 max-w-xs">
                    Activer le Scanner
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleManualInput}
                    className="flex-1 max-w-xs"
                  >
                    Saisie Manuelle
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-full h-64 bg-green-50 rounded-lg flex items-center justify-center border-2 border-green-300 border-dashed">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-pulse">🔫</div>
                      <p className="text-green-700 font-medium text-lg">Scanner Actif</p>
                      <p className="text-sm text-green-600">Scannez un code-barres avec votre pistolet</p>
                      <div className="mt-4 text-xs text-gray-500">
                        Scans effectués: {scanCount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input caché pour capturer les scans */}
                <form onSubmit={handleInputSubmit} className="space-y-2">
                  <Label htmlFor="barcode-input" className="text-sm font-medium">
                    Zone de capture (focus automatique)
                  </Label>
                  <Input
                    ref={inputRef}
                    id="barcode-input"
                    type="text"
                    value={scannedInput}
                    onChange={handleInputChange}
                    placeholder="Le code-barres apparaîtra ici..."
                    className="text-center font-mono text-lg"
                    autoComplete="off"
                  />
                  <Button type="submit" className="w-full" disabled={!scannedInput.trim()}>
                    Valider le Code
                  </Button>
                </form>

                <div className="flex gap-2 justify-center">
                  <Button onClick={stopScanning} variant="destructive">
                    Arrêter le Scanner
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleManualInput}
                  >
                    Saisie Manuelle
                  </Button>
                </div>

                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-800 mb-1">💡 Mode Scanner Pistolet Actif</p>
                  <p>• Pointez votre pistolet vers un code-barres et appuyez sur la gâchette</p>
                  <p>• Le code sera automatiquement détecté et traité</p>
                  <p>• Vous pouvez aussi taper manuellement dans le champ ci-dessus</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dernier code scanné */}
      {lastScannedCode && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            <strong>Dernier code scanné:</strong> <span className="font-mono">{lastScannedCode}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Historique des scans */}
      {scanHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Historique des scans récents</h4>
            <div className="space-y-2">
              {scanHistory.map((code, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-mono text-sm">{code}</span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {index === 0 ? 'Récent' : `Il y a ${index + 1}`}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onBarcodeScanned(code)}
                      className="text-xs px-2 py-1 h-auto"
                    >
                      Réutiliser
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions pour pistolet */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Instructions Scanner Pistolet USB</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• <strong>Connectez votre pistolet USB</strong> - Il fonctionne comme un clavier</li>
            <li>• <strong>Cliquez "Activer le Scanner"</strong> pour commencer</li>
            <li>• <strong>Pointez et tirez</strong> sur le code-barres avec votre pistolet</li>
            <li>• <strong>Le code apparaît automatiquement</strong> dans le champ de saisie</li>
            <li>• <strong>Validation automatique</strong> après chaque scan</li>
            <li>• <strong>Saisie manuelle possible</strong> en cas de problème</li>
          </ul>
        </CardContent>
      </Card>

      {/* Compatibilité pistolets */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">Pistolets Compatibles</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>✅ <strong>Tous les pistolets USB/HID</strong> (mode clavier)</p>
            <p>✅ <strong>Honeywell, Zebra, Datalogic, Symbol</strong></p>
            <p>✅ <strong>Formats supportés:</strong> EAN-13, UPC-A, Code 128, Code 39</p>
            <p>✅ <strong>Plug & Play</strong> - Aucun driver nécessaire</p>
          </div>
        </CardContent>
      </Card>

      {/* Note technique */}
      <div className="text-xs text-gray-500 text-center">
        <p>🔧 <strong>Mode Pistolet USB:</strong> Détection automatique des scans via événements clavier</p>
        <p>Compatible avec tous les lecteurs de codes-barres USB standard (HID)</p>
      </div>
    </div>
  );
}
