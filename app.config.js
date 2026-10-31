const { execSync } = require("child_process")

/**
 * Grava no app o hash do commit que gerou o build (exibido na tela "Sobre o App").
 * No EAS Build o .git não vai junto, então o EAS informa o hash por variável de ambiente.
 */
function getCommitHash() {
    if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
        return process.env.EAS_BUILD_GIT_COMMIT_HASH.slice(0, 7)
    }
    try {
        return execSync("git rev-parse --short HEAD").toString().trim()
    } catch {
        return "desconhecido"
    }
}

module.exports = ({ config }) => ({
    ...config,
    extra: {
        ...config.extra,
        commitHash: getCommitHash(),
        buildDate: new Date().toISOString().split("T")[0],
    },
})
