# 📦 Sistema de Gestão de Stock - Instalação e Execução

## 🚀 Como Executar no Seu Ambiente de Trabalho

### Pré-requisitos
- **Node.js 18+** (https://nodejs.org/)
- **npm, yarn, pnpm ou bun**
- **Pistola de código de barras USB** (opcional)

### 📁 Estrutura do Projeto
```
gestion-stock/
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── components.json
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── gestion-stock/
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/ (componentes shadcn/ui)
│   │   ├── ProductForm.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── SupplierManager.tsx
│   │   ├── StockAlert.tsx
│   │   ├── StockMovementChart.tsx
│   │   └── ProductList.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── stockManager.ts
│   ├── types/
│   │   └── stock.ts
│   └── hooks/
│       └── use-mobile.ts
└── public/
    └── (arquivos estáticos)
```

## 🛠️ Instalação Passo a Passo

### 1. Criar o Projeto
```bash
# Criar diretório do projeto
mkdir gestion-stock
cd gestion-stock

# Inicializar projeto Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2. Instalar Dependências Adicionais
```bash
# Instalar shadcn/ui
npx shadcn@latest init

# Instalar componentes UI necessários
npx shadcn@latest add button input label card alert badge tabs select textarea separator progress table skeleton

# Instalar Recharts para gráficos
npm install recharts

# Instalar dependências de desenvolvimento
npm install @types/node
```

### 3. Copiar os Arquivos do Sistema
Copie todos os arquivos fornecidos para as respectivas pastas:

- `src/types/stock.ts`
- `src/lib/stockManager.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/gestion-stock/layout.tsx`
- `src/app/gestion-stock/page.tsx`
- `src/components/ProductForm.tsx`
- `src/components/BarcodeScanner.tsx`
- `src/components/SupplierManager.tsx`
- `src/components/StockAlert.tsx`
- `src/components/StockMovementChart.tsx`
- `src/components/ProductList.tsx`

## ▶️ Execução

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Ou especificar porta 8000
PORT=8000 npm run dev
```

### Produção
```bash
# Build para produção
npm run build

# Executar versão de produção
npm start
```

## 🌐 Acesso à Aplicação

- **URL Principal:** http://localhost:3000 (ou porta configurada)
- **Sistema de Stock:** http://localhost:3000/gestion-stock

## 🔫 Configuração da Pistola USB

### Pistolas Compatíveis
- ✅ Honeywell (Voyager, Xenon)
- ✅ Zebra (DS2208, LI4278)
- ✅ Datalogic (QuickScan, Gryphon)
- ✅ Symbol/Motorola
- ✅ Qualquer pistola USB/HID

### Configuração
1. **Conectar** a pistola USB ao computador
2. **Aguardar** reconhecimento automático (Plug & Play)
3. **Testar** em qualquer editor de texto
4. **Usar** no sistema: Scanner → Activer le Scanner

### Formatos Suportados
- EAN-13 (padrão europeu)
- UPC-A (padrão americano)
- Code 128 (alfanumérico)
- Code 39 (alfanumérico)

## 📋 Funcionalidades Principais

### 1. Gestão de Produtos
- Adicionar/editar/remover produtos
- Códigos de barras automáticos
- Categorização por famílias
- Controle de stock com alertas

### 2. Scanner Pistola USB
- Detecção automática de scans
- Integração direta ao formulário
- Histórico de códigos scaneados
- Saisie manual como backup

### 3. Gestão de Fornecedores
- CRUD completo de fornecedores
- Informações de contacto
- Associação com produtos

### 4. Alertas Inteligentes
- Stock baixo automático
- DLC próxima (7 dias)
- DLC ultrapassada
- Ações rápidas de reabastecimento

### 5. Gráficos e Analytics
- Evolução de movimentos
- Diferentes tipos de gráficos
- Estatísticas detalhadas
- Períodos configuráveis

## 🔧 Personalização

### Alterar Idioma
Todos os textos estão em francês suíço. Para alterar:
1. Editar os componentes individualmente
2. Implementar sistema de i18n

### Adicionar Funcionalidades
- Base de dados externa (PostgreSQL, MySQL)
- Autenticação de utilizadores
- Relatórios PDF
- Integração com APIs externas
- Backup automático

### Configurar Porta
```bash
# No package.json, alterar scripts:
"dev": "PORT=8000 next dev --turbopack"
```

## 🐛 Resolução de Problemas

### Erro de Porta em Uso
```bash
# Matar processo na porta 8000
fuser -k 8000/tcp

# Ou usar porta diferente
PORT=3001 npm run dev
```

### Problemas com Pistola USB
1. Verificar se é reconhecida como teclado
2. Testar em editor de texto simples
3. Verificar configuração da pistola
4. Reiniciar aplicação

### Dados Não Persistem
- Verificar localStorage do navegador
- Limpar cache se necessário
- Verificar console para erros JavaScript

## 📞 Suporte

O sistema está completo e funcional. Para questões específicas:
1. Verificar console do navegador (F12)
2. Verificar logs do terminal
3. Testar componentes individualmente

**Sistema pronto para uso profissional!** 🚀
