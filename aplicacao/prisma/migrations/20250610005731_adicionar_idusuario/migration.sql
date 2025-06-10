/*
  Warnings:

  - Added the required column `usuarioId` to the `Tabela` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tabela" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'A_FAZER',
    "setor" TEXT NOT NULL,
    "prioridade" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaEm" DATETIME,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Tabela_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Tabela" ("criadoEm", "descricao", "fechaEm", "id", "prioridade", "setor", "status", "titulo") SELECT "criadoEm", "descricao", "fechaEm", "id", "prioridade", "setor", "status", "titulo" FROM "Tabela";
DROP TABLE "Tabela";
ALTER TABLE "new_Tabela" RENAME TO "Tabela";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
