# Portfólio Escolar - Arthur Gabriel

Este é um portfólio escolar profissional desenvolvido em React + Vite, com um design inspirado na interface do **DaVinci Resolve**.

## 🚀 Tecnologias Utilizadas
- **React 19**
- **Tailwind CSS** (Estilização profissional)
- **Framer Motion** (Animações de software)
- **Lucide React** (Ícones)
- **Firebase Firestore** (Banco de dados em tempo real)
- **Firebase Storage** (Armazenamento de imagens)

## ⚙️ Configuração do Firebase
O projeto já foi inicializado com a infraestrutura do AI Studio. Caso precise replicar:
1. Crie um projeto no [Console do Firebase](https://console.firebase.google.com/).
2. Ative o **Firestore Database** e o **Storage**.
3. Copie as credenciais e cole no arquivo `firebase-applet-config.json`.
4. Defina as regras de segurança no arquivo `firestore.rules`.

## 🔒 Painel Administrativo
Para acessar o modo de edição:
1. Role até o rodapé do site.
2. Clique no ícone de **cadeado** discreto.
3. Insira a senha: **arthur2026** (isso pode ser alterado no arquivo `src/components/AdminPanel.tsx`).

No modo Admin, você pode:
- Adicionar atividades com embeds (Padlet, Slides, YouTube) ou upload de fotos.
- Gerenciar a galeria de fotos pessoal.
- Editar descrições e justificativas.

## 📦 Deploy
Para fazer o deploy na **Vercel** ou **Netlify**:
1. Conecte seu repositório GitHub.
2. Use o comando de build: `npm run build`.
3. Diretório de saída: `dist`.
4. Adicione as variáveis de ambiente necessárias (se houver).

---
Desenvolvido com carinho para o futuro desenvolvedor Arthur Gabriel. 🚀
