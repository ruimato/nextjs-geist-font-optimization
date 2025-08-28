# 🚀 CÓDIGO COMPLETO DO SISTEMA DE GESTÃO DE STOCK

## 📋 TODOS OS ARQUIVOS EM UM SÓ LUGAR

### 1. `package.json`
```json
{
  "name": "gestion-stock",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "PORT=8000 next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "next-themes": "^0.2.1",
    "recharts": "^2.8.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "autoprefixer": "^10.0.1",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.0.3",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.3.0"
  }
}
```

### 2. `src/types/stock.ts`
```typescript
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
```

### 3. `src/lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 4. `src/hooks/use-mobile.ts`
```typescript
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

### 5. `src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 6. `src/app/layout.tsx`
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Système de Gestion de Stock",
  description: "Système complet de gestion de stock en français suisse avec scanner pistolet USB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

### 7. `src/app/page.tsx`
```typescript
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Système de Gestion de Stock
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solution complète pour la gestion d'inventaire avec scanner pistolet USB, 
            alertes intelligentes et analytics en temps réel
          </p>
        </div>

        {/* Fonctionnalités principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🔫</div>
              <CardTitle>Scanner Pistolet USB</CardTitle>
              <CardDescription>
                Compatible avec tous les pistolets USB/HID professionnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Détection automatique des scans</li>
                <li>• Support EAN-13, UPC-A, Code 128</li>
                <li>• Plug & Play sans drivers</li>
                <li>• Intégration directe au formulaire</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📦</div>
              <CardTitle>Gestion des Produits</CardTitle>
              <CardDescription>
                Contrôle complet de votre inventaire
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• ID et familles de produits</li>
                <li>• Entrées et sorties automatiques</li>
                <li>• Codes-barres intégrés</li>
                <li>• Gestion des DLC</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">⚠️</div>
              <CardTitle>Alertes Intelligentes</CardTitle>
              <CardDescription>
                Surveillance proactive de votre stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stock bas automatique</li>
                <li>• DLC proche et dépassée</li>
                <li>• Actions rapides de réapprovisionnement</li>
                <li>• Notifications en temps réel</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🏢</div>
              <CardTitle>Gestion Fournisseurs</CardTitle>
              <CardDescription>
                Base de données complète de vos partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• CRUD complet des fournisseurs</li>
                <li>• Informations de contact détaillées</li>
                <li>• Association avec produits</li>
                <li>• Statistiques d'utilisation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">📊</div>
              <CardTitle>Analytics & Graphiques</CardTitle>
              <CardDescription>
                Visualisation des mouvements de stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Graphiques interactifs (Recharts)</li>
                <li>• Évolution temporelle</li>
                <li>• Différents types de visualisation</li>
                <li>• Statistiques détaillées</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-2">🇨🇭</div>
              <CardTitle>Interface Française Suisse</CardTitle>
              <CardDescription>
                Localisé pour le marché suisse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Terminologie locale appropriée</li>
                <li>• Format de dates suisse</li>
                <li>• Prix en CHF</li>
                <li>• Design moderne et responsive</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technologies utilisées */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Technologies Modernes
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚛️</div>
              <div className="font-medium">Next.js 15+</div>
              <div className="text-sm text-gray-600">React Framework</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-medium">Tailwind CSS</div>
              <div className="text-sm text-gray-600">Styling</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🔷</div>
              <div className="font-medium">TypeScript</div>
              <div className="text-sm text-gray-600">Type Safety</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🧩</div>
              <div className="font-medium">shadcn/ui</div>
              <div className="text-sm text-gray-600">Components</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link href="/gestion-stock">
            <Button size="lg" className="text-lg px-8 py-4">
              Accéder au Système de Gestion
            </Button>
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Prêt à l'emploi • Compatible pistolets USB • Données locales sécurisées
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 8. `src/app/gestion-stock/layout.tsx`
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestion de Stock - Dashboard",
  description: "Tableau de bord pour la gestion de stock avec scanner pistolet USB",
};

export default function GestionStockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

## ⚠️ ARQUIVO MUITO GRANDE - CONTINUAÇÃO NO PRÓXIMO ARQUIVO
Este arquivo ficou muito grande. Vou criar arquivos separados para cada componente principal.
