# 🚀 GUIA COMPLETO: COMO EXECUTAR O PROGRAMA NA SUA MÁQUINA

## 📋 PRÉ-REQUISITOS (INSTALAR PRIMEIRO)

### 1. **Node.js** (OBRIGATÓRIO)
```bash
# Baixar e instalar Node.js 18+ de:
https://nodejs.org/

# Verificar instalação:
node --version
npm --version
```

### 2. **Editor de Código** (RECOMENDADO)
- Visual Studio Code: https://code.visualstudio.com/

## 🛠️ INSTALAÇÃO PASSO A PASSO

### PASSO 1: Criar o Projeto Base
```bash
# Abrir terminal/prompt de comando
# Navegar para onde quer criar o projeto (ex: Desktop)
cd Desktop

# Criar projeto Next.js
npx create-next-app@latest gestion-stock --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Entrar na pasta do projeto
cd gestion-stock
```

### PASSO 2: Instalar Dependências Adicionais
```bash
# Instalar shadcn/ui (interface)
npx shadcn@latest init

# Quando perguntado, escolher:
# - Would you like to use TypeScript? → Yes
# - Which style would you like to use? → Default
# - Which color would you like to use as base color? → Slate
# - Where is your global CSS file? → src/app/globals.css
# - Would you like to use CSS variables for colors? → Yes
# - Where is your tailwind.config.js located? → tailwind.config.ts
# - Configure the import alias for components? → src/components
# - Configure the import alias for utils? → src/lib/utils

# Instalar componentes UI necessários
npx shadcn@latest add button input label card alert badge tabs select textarea separator progress table skeleton

# Instalar Recharts para gráficos
npm install recharts
```

### PASSO 3: Copiar os Arquivos do Sistema

#### 3.1 Copiar Configurações
Substituir/criar estes arquivos na raiz do projeto:

**`package.json`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`next.config.ts`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`tailwind.config.ts`** - Copiar do CODIGO_COMPLETO_SISTEMA.md

#### 3.2 Copiar Arquivos da Aplicação
Criar/substituir estes arquivos:

**`src/types/stock.ts`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/lib/utils.ts`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/hooks/use-mobile.ts`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/app/globals.css`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/app/layout.tsx`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/app/page.tsx`** - Copiar do CODIGO_COMPLETO_SISTEMA.md

#### 3.3 Criar Pasta e Arquivos de Gestão de Stock
```bash
# Criar pasta gestion-stock
mkdir src/app/gestion-stock
```

**`src/app/gestion-stock/layout.tsx`** - Copiar do CODIGO_COMPLETO_SISTEMA.md
**`src/app/gestion-stock/page.tsx`** - Copiar dos tabs do VSCode
**`src/lib/stockManager.ts`** - Copiar do CODIGO_COMPLETO_PARTE2.md

#### 3.4 Criar Componentes
**`src/components/BarcodeScanner.tsx`** - Copiar do CODIGO_COMPLETO_PARTE2.md
**`src/components/ProductForm.tsx`** - Copiar dos tabs do VSCode
**`src/components/ProductList.tsx`** - Copiar dos tabs do VSCode
**`src/components/SupplierManager.tsx`** - Copiar dos tabs do VSCode
**`src/components/StockAlert.tsx`** - Copiar dos tabs do VSCode
**`src/components/StockMovementChart.tsx`** - Copiar dos tabs do VSCode

### PASSO 4: Executar o Programa
```bash
# Instalar todas as dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# OU especificar porta 8000
PORT=8000 npm run dev
```

### PASSO 5: Acessar a Aplicação
Abrir navegador e ir para:
- **http://localhost:3000** (porta padrão)
- **http://localhost:8000** (se especificou PORT=8000)

## 🔫 CONFIGURAR PISTOLET USB

### 1. Conectar Pistolet
- Conectar pistolet USB ao computador
- Sistema reconhece automaticamente (Plug & Play)
- Testar em qualquer editor de texto primeiro

### 2. Usar no Sistema
1. Ir para: http://localhost:3000/gestion-stock
2. Clicar na aba "Scanner"
3. Clicar "Activer le Scanner Pistolet"
4. Apontar pistolet para código de barras
5. Apertar gatilho
6. Código aparece automaticamente

## 🗂️ ESTRUTURA FINAL DO PROJETO
```
gestion-stock/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── gestion-stock/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/ (gerado automaticamente)
│   │   ├── BarcodeScanner.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductList.tsx
│   │   ├── SupplierManager.tsx
│   │   ├── StockAlert.tsx
│   │   └── StockMovementChart.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── stockManager.ts
│   ├── types/
│   │   └── stock.ts
│   └── hooks/
│       └── use-mobile.ts
└── node_modules/ (criado automaticamente)
```

## ❌ RESOLUÇÃO DE PROBLEMAS

### Erro: "command not found: npx"
```bash
# Instalar Node.js novamente de https://nodejs.org/
# Reiniciar terminal
```

### Erro: "Port 3000 is already in use"
```bash
# Usar porta diferente
PORT=8001 npm run dev
```

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Pistolet não funciona
1. Testar em editor de texto (Notepad, Word)
2. Verificar se pistolet está configurado como "teclado"
3. Tentar outro cabo USB
4. Reiniciar aplicação

## ✅ COMANDOS RESUMIDOS (CÓPIA RÁPIDA)
```bash
# 1. Criar projeto
npx create-next-app@latest gestion-stock --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd gestion-stock

# 2. Instalar UI
npx shadcn@latest init
npx shadcn@latest add button input label card alert badge tabs select textarea separator progress table skeleton
npm install recharts

# 3. Copiar todos os arquivos dos documentos MD

# 4. Executar
npm run dev
```

## 🎯 RESULTADO FINAL
- ✅ Sistema funcionando em http://localhost:3000
- ✅ Dashboard completo em http://localhost:3000/gestion-stock
- ✅ Scanner pistolet USB operacional
- ✅ Todas as funcionalidades ativas

**PRONTO! O sistema está funcionando na sua máquina!** 🚀
