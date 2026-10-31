# 🐾 PetFlow — Mobile

## 📌 Sobre o Projeto

O **PetFlow Mobile** é o aplicativo do tutor — a frente de saúde contínua do pet. A proposta ataca o problema central do Challenge: a jornada do pet é fragmentada e reativa, com dados de saúde, planos e recompensas espalhados sem integração. O app centraliza pets, histórico de saúde, clínicas parceiras e um sistema de gamificação (pontos por evento de saúde, resgatáveis em cupons) em um único lugar, consumindo em tempo real a API [petflow-api-java](https://github.com/lgaxd/petflow-api-java) (Spring Boot + Oracle), publicada na Azure com HTTPS.

Na Sprint 3 o app deixou de usar dados mockados e passou a ser 100% integrado à API real. A **Sprint 4** é a versão final: corrige os pontos do feedback anterior e adiciona tema claro/escuro, notificações locais, a tela "Sobre o App" e a publicação no Firebase App Distribution.

## ✅ O que mudou na Sprint 4

| Item | Onde está |
|---|---|
| **Feedback: HTTPS obrigatório** — a URL da API é validada na inicialização; `http://` é recusado | `src/api/config.ts` |
| **Feedback: expiração e renovação do JWT** — leitura do `exp`, renovação em `POST /auth/refresh`, sessão encerrada ao expirar | `src/services/tokenService.ts`, `src/hooks/useSessionWatcher.ts` |
| **Feedback: AuthContext com menos responsabilidade** — login/cadastro/logout, sessão e token saíram do contexto | `src/services/authService.ts`, `sessionService.ts`, `tokenService.ts` |
| **Tema claro/escuro** — segue o sistema ou a escolha do usuário em Ajustes › Aparência | `src/contexts/ThemeContext.tsx`, `src/theme/colors.ts` |
| **Notificações locais** — pontos ganhos/cupom liberado e lembrete de reforço de vacina | `src/services/rewardAlertService.ts`, `vaccineReminderService.ts` |
| **Tela "Sobre o App"** — versão e hash do commit do build publicado | `src/screens/AboutScreen.tsx`, `app.config.js` |
| **Camada de serviços** — nenhuma tela ou hook chama o Axios direto | `src/services/*Service.ts` |
| **Publicação** — perfis de build do EAS | `eas.json` |

## 👥 Equipe

| Nome | RM |
|------|-----|
| Lucas Grillo Alcântara | 561413 |
| Pietro Ferreira Gomes Abrahamian | 561469 |
| Pedro Peres Benitez | 561792 |
| Lucca Ramos Mussumecci | 562027 |

## 🎥 Vídeo de apresentação

[Assistir no YouTube](https://youtu.be/Pm0-lzUVwsA)

---

## 🧱 Stack técnica

- **Expo SDK 54 / React Native 0.81 / React 19** — TypeScript estrito
- **React Navigation** (native-stack + bottom-tabs) — navegação real entre 11 telas
- **TanStack Query (React Query)** — cache, loading/error state e refetch automático de toda chamada à API
- **Axios** — client HTTP com interceptors de autenticação e tratamento de erro
- **Firebase Authentication** — validação real de credenciais (login/cadastro), serviço externo
- **expo-secure-store** — armazenamento seguro do token JWT
- **AsyncStorage** — persistência de preferências locais (fotos de pet, rascunho de formulário, ajustes)
- **expo-image-picker / expo-file-system** — seleção e persistência de foto do pet
- **expo-notifications** — notificações locais (imediatas e agendadas)
- **expo-constants** — versão e hash do commit exibidos na tela "Sobre o App"
- **EAS Build + Firebase App Distribution** — geração do `.apk` e distribuição para testers

## 🔐 Autenticação

Autenticação real em duas etapas, sem nenhuma comparação local/hardcoded:

1. **Firebase Authentication** valida se e-mail e senha realmente pertencem ao usuário — `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` (`src/api/firebase.ts`). Se as credenciais forem inválidas, o Firebase rejeita antes de qualquer chamada à API PetFlow.
2. Só então o app chama a API Java (`POST /auth/login`, `POST /tutors`) pra obter o **JWT** usado em todas as demais requisições (`/pets`, `/health-events` etc.) — o Firebase autentica a identidade, o JWT autoriza o uso da API.

No cadastro, a conta é criada nos dois sistemas (Firebase + tabela `TUTOR` via `POST /tutors`); se a API recusar (ex: e-mail duplicado), o usuário criado no Firebase é revertido (`deleteUser`) pra não sobrar uma conta órfã.

- Sessão persistida entre aberturas do app (token JWT em `expo-secure-store`, perfil em `AsyncStorage`) — essa é a sessão que sobrevive a fechar o app; o Firebase participa só do momento de login/cadastro.
- Rotas protegidas: o `RootNavigator` (`App.tsx`) só renderiza o app principal quando há sessão válida; sem sessão, mostra o fluxo de Login/Cadastro.
- Logout (tela Ajustes) limpa o token, o perfil salvo e encerra a sessão do Firebase.
- **Expiração e renovação do JWT** (`src/services/tokenService.ts`): o app lê o `exp` do token antes de cada requisição. Faltando menos de 1 hora, pede um token novo em `POST /auth/refresh`; já expirado, encerra a sessão e mostra "Sua sessão expirou". O `useSessionWatcher` repete a checagem a cada 5 minutos e sempre que o app volta do segundo plano.
- Um 401 vindo de qualquer chamada autenticada também encerra a sessão (token revogado/inválido).

### Organização da autenticação

| Arquivo | Responsabilidade |
|---|---|
| `src/services/authService.ts` | Login, cadastro e logout (Firebase + API) |
| `src/services/sessionService.ts` | Salvar, restaurar e encerrar a sessão; avisa quem estiver inscrito |
| `src/services/tokenService.ts` | Guardar o JWT no SecureStore, ler a expiração e renovar |
| `src/contexts/AuthContext.tsx` | Só expõe o usuário logado para as telas |

## 🧭 Telas e Rotas (11 telas, navegação real via React Navigation)

| Tela | Descrição |
|------|-----------|
| Login | Autenticação por e-mail/senha |
| Cadastro | Criação de conta de tutor |
| Meus Pets | Lista os pets do tutor logado (via API) |
| Detalhes do Pet | Dados do pet + histórico de saúde + convênio + ações de editar/excluir |
| Cadastrar/Editar Pet | Formulário com espécie carregada da API |
| Evento de Saúde | Cadastro/edição de evento de saúde do pet (vacina, consulta etc.) |
| Convênio Médico | Vincula o pet a um plano de uma clínica (assinatura) |
| Clínicas | Clínicas parceiras e planos disponíveis (dados reais da API) |
| Recompensas | Pontos acumulados e cupons resgatáveis via gamificação |
| Ajustes | Perfil, tema (sistema/claro/escuro), preferências de notificação, histórico de resgates e logout |
| Sobre o App | Versão, hash do commit publicado, URL da API e equipe |

## 🔗 Integração com a API

Repositório da API: [github.com/lgaxd/petflow-api-java](https://github.com/lgaxd/petflow-api-java) (Java/Spring Boot + Oracle — mantido separadamente pelo time de backend/DevOps).

Toda a integração é feita via HTTP (Axios + TanStack Query), sem nenhum dado mockado ou fixo. CRUD completo pela UI em **Pets**, **Eventos de Saúde** e **Assinaturas/Convênio**; leitura em tempo real de Clínicas, Planos, Espécies e Gamificação.

| Recurso | Endpoints usados | CRUD via UI |
|---------|-------------------|:---:|
| Autenticação | `POST /auth/login`, `POST /auth/refresh`, `POST /tutors` | — |
| Pets | `GET/POST/PUT/DELETE /pets` | ✅ completo |
| Eventos de saúde | `GET/POST/PUT/DELETE /health-events` | ✅ completo |
| Assinaturas / Convênio | `GET/POST /subscriptions`, `PUT /subscriptions/{id}/status` | ✅ criar e cancelar |
| Clínicas | `GET /clinics` | leitura |
| Planos | `GET /plans` | leitura |
| Espécies | `GET /species` | leitura |
| Tipos de evento | `GET /event-types` | leitura |
| Gamificação | `GET /gamification/points`, `GET /gamification/coupons/available`, `POST /gamification/redeem` | leitura + ação |
| Resgates | `GET /redeems` | leitura |

> `/species`, `/event-types` e `/auth/refresh` foram adicionados à API para o app: os formulários usam dados reais do banco em vez de listas fixas no código, e o token é renovado sem pedir a senha de novo.

## 🔔 Notificações (locais)

As duas notificações nascem de eventos reais do sistema, não de um botão de teste:

1. **Pontos ganhos / cupom liberado** — ao cadastrar um pet, registrar um evento de saúde realizado ou ativar um convênio, a API credita pontos. O app compara o saldo antes e depois da ação (`GET /gamification/points`) e, se entrou ponto, mostra na hora *"+10 pontos no PetFlow"*, citando os cupons que o novo saldo liberou. **Tocar abre a aba Recompensas.**
2. **Reforço de vacina** — ao registrar uma vacinação realizada, o app agenda um lembrete para 7 dias antes do reforço anual (às 9h) e confirma a data na tela. **Tocar abre os detalhes do pet** (buscado na API). Editar o evento reagenda; excluir cancela.

Em **Ajustes › Notificações** cada tipo pode ser desligado (desligar os alertas de saúde cancela os lembretes já agendados). No logout, todos os lembretes do usuário são cancelados.

## 🗂️ Arquitetura

```
src/
├── api/          # Axios (interceptors de JWT), config da URL HTTPS, QueryClient, Firebase
├── services/     # Acesso à API e regras de negócio (pets, eventos, gamificação, sessão, token, notificações)
├── hooks/        # TanStack Query + hooks de app (useSessionWatcher, useNotifications, usePreferences)
├── contexts/     # AuthContext (usuário logado) e ThemeContext (tema)
├── screens/      # Telas (só UI e validação de formulário)
├── components/   # Componentes reutilizáveis (PetRow, ErrorView, LoadingView...)
├── navigation/   # Tipos das rotas e navigationRef (usado pelas notificações)
├── theme/        # Paletas clara e escura
└── utils/        # Datas, imagens, informações do build
```

Fluxo de uma chamada: **tela → hook (TanStack Query) → service → `api` (Axios)**. As telas não importam Axios nem AsyncStorage.

## 📦 Publicação (Firebase App Distribution)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # gera o .apk
```

O `.apk` gerado é enviado ao **Firebase App Distribution** (console do Firebase › App Distribution › enviar versão) e liberado para o grupo de testers que inclui o professor. O `app.config.js` grava no build o hash do commit (`EAS_BUILD_GIT_COMMIT_HASH`), exibido em **Ajustes › Sobre o App** — é ele que liga a versão instalada ao código deste repositório.

## 🚀 Como executar

O app já vem apontado por padrão para a API publicada na Azure (App Service, com HTTPS) —
se ela estiver no ar, basta seguir os passos **1** e **2**. Se estiver fora do ar (ou
pra rodar tudo localmente), siga também o passo **1-B**.

### 1. API na nuvem (padrão do app)

```
https://561413-petflow-webapp.azurewebsites.net
```

Swagger: `https://561413-petflow-webapp.azurewebsites.net/swagger`

Essa URL é o valor padrão em `src/api/config.ts`. O app **só aceita HTTPS**: uma URL `http://` derruba a inicialização com um erro explicando o motivo, porque o JWT vai no header de toda requisição — nenhum arquivo `.env` é necessário
para usar essa API.

### 1-B. Alternativa: rodar a API localmente

Repositório: [github.com/lgaxd/petflow-api-java](https://github.com/lgaxd/petflow-api-java)

```bash
git clone https://github.com/lgaxd/petflow-api-java.git
cd petflow-api-java
./mvnw spring-boot:run
```

Requer **Java 21**. Como o app só aceita HTTPS, a API local precisa ser exposta por um
túnel HTTPS (ex.: `ngrok http 8080`). Crie um `.env` na raiz do app com
`EXPO_PUBLIC_API_URL=https://<endereço-do-túnel>`.

### 2. Rode o app

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go, ou pressione `a` para abrir no emulador Android/simulador.

### 3. Conta de teste

Use uma das contas já cadastradas na API ou crie uma conta nova pela tela de Cadastro:

| E-mail | Senha |
|---|---|
| `vitor_ferreira@gmail.com` | `Vi123456` |

---

## 🖼️ Fotos de pet

A API não modela foto de pet (fora do escopo do schema Oracle). Por isso, a foto escolhida na galeria é puramente cosmética: fica salva localmente (`expo-file-system` + `AsyncStorage`, indexada pelo ID real do pet retornado pela API) e não interfere no CRUD, que é 100% feito contra a API.
