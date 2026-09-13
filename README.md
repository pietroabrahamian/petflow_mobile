# 🐾 PetFlow — Mobile

## 📌 Sobre o Projeto

O **PetFlow Mobile** é o aplicativo do tutor — a frente de saúde contínua do pet. A proposta ataca o problema central do Challenge: a jornada do pet é fragmentada e reativa, com dados de saúde, planos e recompensas espalhados sem integração. O app centraliza pets, histórico de saúde, clínicas parceiras e um sistema de gamificação (pontos por evento de saúde, resgatáveis em cupons) em um único lugar, consumindo em tempo real a API [petflow-sprint3-devops](https://github.com/lgaxd/petflow-sprint3-devops) (Spring Boot + Oracle).

Nesta Sprint 3, o app deixou de usar dados mockados (`petflow.json`) e passou a ser 100% integrado à API real, com autenticação JWT, sessão persistida e CRUD completo via HTTP.

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
- **React Navigation** (native-stack + bottom-tabs) — navegação real entre 9 telas
- **TanStack Query (React Query)** — cache, loading/error state e refetch automático de toda chamada à API
- **Axios** — client HTTP com interceptors de autenticação e tratamento de erro
- **Firebase Authentication** — validação real de credenciais (login/cadastro), serviço externo
- **expo-secure-store** — armazenamento seguro do token JWT
- **AsyncStorage** — persistência de preferências locais (fotos de pet, rascunho de formulário, ajustes)
- **expo-image-picker / expo-file-system** — seleção e persistência de foto do pet

## 🔐 Autenticação

Autenticação real em duas etapas, sem nenhuma comparação local/hardcoded:

1. **Firebase Authentication** valida se e-mail e senha realmente pertencem ao usuário — `signInWithEmailAndPassword` / `createUserWithEmailAndPassword` (`src/api/firebase.ts`). Se as credenciais forem inválidas, o Firebase rejeita antes de qualquer chamada à API PetFlow.
2. Só então o app chama a API Java (`POST /auth/login`, `POST /tutors`) pra obter o **JWT** usado em todas as demais requisições (`/pets`, `/health-events` etc.) — o Firebase autentica a identidade, o JWT autoriza o uso da API.

No cadastro, a conta é criada nos dois sistemas (Firebase + tabela `TUTOR` via `POST /tutors`); se a API recusar (ex: e-mail duplicado), o usuário criado no Firebase é revertido (`deleteUser`) pra não sobrar uma conta órfã.

- Sessão persistida entre aberturas do app (token JWT em `expo-secure-store`, perfil em `AsyncStorage`) — essa é a sessão que sobrevive a fechar o app; o Firebase participa só do momento de login/cadastro.
- Rotas protegidas: o `RootNavigator` (`App.tsx`) só renderiza o app principal quando há sessão válida; sem sessão, mostra o fluxo de Login/Cadastro.
- Logout (tela Ajustes) limpa o token, o perfil salvo e encerra a sessão do Firebase.
- Um 401 vindo de qualquer chamada da API desloga automaticamente o usuário (token expirado/inválido).

## 🧭 Telas e Rotas (10 telas, navegação real via React Navigation)

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
| Ajustes | Perfil, preferências, histórico de resgates e logout |

## 🔗 Integração com a API

Repositório da API: [github.com/lgaxd/petflow-sprint3-devops](https://github.com/lgaxd/petflow-sprint3-devops) (Java/Spring Boot + Oracle — mantido separadamente pelo time de backend/DevOps).

Toda a integração é feita via HTTP (Axios + TanStack Query), sem nenhum dado mockado ou fixo. CRUD completo pela UI em **Pets**, **Eventos de Saúde** e **Assinaturas/Convênio**; leitura em tempo real de Clínicas, Planos, Espécies e Gamificação.

| Recurso | Endpoints usados | CRUD via UI |
|---------|-------------------|:---:|
| Autenticação | `POST /auth/login`, `POST /tutors` | — |
| Pets | `GET/POST/PUT/DELETE /pets` | ✅ completo |
| Eventos de saúde | `GET/POST/PUT/DELETE /health-events` | ✅ completo |
| Assinaturas / Convênio | `GET/POST /subscriptions`, `PUT /subscriptions/{id}/status` | ✅ criar e cancelar |
| Clínicas | `GET /clinics` | leitura |
| Planos | `GET /plans` | leitura |
| Espécies | `GET /species` | leitura |
| Tipos de evento | `GET /event-types` | leitura |
| Gamificação | `GET /gamification/points`, `GET /gamification/coupons/available`, `POST /gamification/redeem` | leitura + ação |
| Resgates | `GET /redeems` | leitura |

> Os endpoints `/species` e `/event-types` foram adicionados à API nesta sprint (antes só existiam como tabelas de domínio fixo, sem controller) para que o app pudesse popular os formulários com dados reais em vez de valores fixos no código.

## 🚀 Como executar

O app já vem apontado por padrão para a API publicada na Azure (Container Instance) —
se ela estiver no ar, basta seguir os passos **1** e **2**. Se estiver fora do ar (ou
pra rodar tudo localmente), siga também o passo **1-B**.

### 1. API na nuvem (padrão do app)

```
http://petflow-api-dns.brazilsouth.azurecontainer.io:8080
```

Swagger: `http://petflow-api-dns.brazilsouth.azurecontainer.io:8080/swagger`

Essa URL é o valor padrão em `src/api/client.ts` — nenhum arquivo `.env` é necessário
para usar essa API.

### 1-B. Alternativa: rodar a API localmente

Repositório: [github.com/lgaxd/petflow-sprint3-devops](https://github.com/lgaxd/petflow-sprint3-devops)

```bash
git clone https://github.com/lgaxd/petflow-sprint3-devops.git
cd petflow-sprint3-devops
./mvnw spring-boot:run
```

Requer **Java 21**. A API sobe em `http://localhost:8080` (Swagger em `/swagger`),
conectada ao Oracle da FIAP já usado pelo time — não precisa configurar banco.

Com a API local no ar, aponte o app pra ela: copie `.env.example` para `.env` dentro
de `mobile/petflow` e defina `EXPO_PUBLIC_API_URL`:

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
