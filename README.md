# 🐾 PetFlow — Mobile

## 📌 Sobre o Projeto

O **PetFlow Mobile** é o aplicativo do responsável — o frontend da jornada de saúde contínua do pet. A proposta ataca o problema central do Challenge: a jornada do pet é fragmentada e reativa. O app centraliza pets, planos de saúde e cupons de recompensa em um único lugar.


## 👥 Equipe

| Nome | RM |
|------|-----|
| Lucas Grillo Alcântara | 561413 |
| Pietro Ferreira Gomes Abrahamian | 561469 |
| Pedro Peres Benitez | 561792 |
| Lucca Ramos Mussumecci | 562027 |

---

## 🧭 Telas e Rotas

| Tela | Tipo | Descrição |
|------|------|-----------|
| Meus Pets | Lista os pets do tutor |
| Clínicas | Clínicas parceiras com planos e pets vinculados |
| Cupons | Cupons de desconto com resgate|
| Ajustes | Preferências do usuário|
| Detalhes do Pet | Informações + plano|
| Cadastrar/Editar Pet | Formulário com rascunho automático|


## 🚀 Como Executar

```bash
npm install
npx expo start
```

---

## 🔗 Relação com a API Java

A estrutura do `petflow.json` espelha o schema do banco Oracle:

| Entidade | Endpoint Java | Tabela Oracle |
|----------|---------------|---------------|
| Tutor | `/tutors` | `TUTOR` |
| Pet | `/pets` | `PET` |
| Clinic | `/clinics` | `CLINIC` |
| Plan | `/plans` | `PLAN` |
| HealthEvent | `/health-events` | `HEALTH_EVENT` |
| Coupon | `/coupons` | `COUPON` |

## Sistema de Imagens

Pets mockados utilizam imagens locais armazenadas em `assets/pets/`.
Pets cadastrados pelo usuario armazenam URIs persistentes via expo-file-system,
permitindo que as fotos sobrevivam ao reinicio do app.

A resolucao da fonte da imagem fica centralizada em `src/utils/petImages.ts`,
que detecta automaticamente se a foto eh uma chave local, URI da galeria, ou URL.
