-- name: createTables
CREATE TABLE IF NOT EXISTS ai_models (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider TEXT NOT NULL,
  modelName TEXT NOT NULL,
  grade TEXT NOT NULL,
  inputPricePer1M REAL NOT NULL,
  outputPricePer1M REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_audits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  serviceName TEXT NOT NULL,
  modelId INTEGER NOT NULL,
  billingCycle TEXT NOT NULL,
  contractFeeUsd REAL NOT NULL DEFAULT 0,
  inputTokensM REAL NOT NULL DEFAULT 0,
  outputTokensM REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT '継続中',
  memo TEXT NOT NULL DEFAULT '',
  FOREIGN KEY (modelId) REFERENCES ai_models(id),
  UNIQUE(serviceName, modelId, billingCycle)
);

-- name: ensureUniqueIndex
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_audits_unique
ON ai_audits (serviceName, modelId, billingCycle);

-- name: modelsTableInfo
PRAGMA table_info(ai_models);

-- name: auditsTableInfo
PRAGMA table_info(ai_audits);

-- name: insertModel
INSERT INTO ai_models (provider, modelName, grade, inputPricePer1M, outputPricePer1M)
VALUES (?, ?, ?, ?, ?);

-- name: insertAudit
INSERT INTO ai_audits (serviceName, modelId, billingCycle, contractFeeUsd, inputTokensM, outputTokensM, status, memo)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);

-- name: listModels
SELECT id, provider, modelName, grade, inputPricePer1M, outputPricePer1M
FROM ai_models
ORDER BY id ASC;

-- name: findModelId
SELECT id
FROM ai_models
WHERE id = ?;

-- name: list
SELECT
  a.id,
  a.serviceName,
  a.modelId,
  a.billingCycle,
  a.contractFeeUsd,
  a.inputTokensM,
  a.outputTokensM,
  a.status,
  a.memo,
  m.provider,
  m.modelName,
  m.grade,
  m.inputPricePer1M,
  m.outputPricePer1M,
  (CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END) AS monthlySubCostUsd,
  (a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M) AS apiEquivalentUsd,
  ((a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M) - (CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END)) AS savingsUsd
FROM ai_audits a
JOIN ai_models m ON a.modelId = m.id
WHERE (? = '' OR m.grade = ?)
  AND (? = '' OR a.status = ?)
  AND (? = '' OR LOWER(a.serviceName) LIKE ? OR LOWER(m.modelName) LIKE ? OR LOWER(m.provider) LIKE ? OR LOWER(a.memo) LIKE ?)
ORDER BY a.id ASC;

-- name: crossSummary
SELECT
  m.provider,
  m.grade,
  COUNT(*) AS itemCount,
  ROUND(SUM(CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END), 2) AS totalSubUsd,
  ROUND(SUM(a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M), 2) AS totalApiUsd,
  ROUND(SUM((a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M) - (CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END)), 2) AS totalSavingsUsd
FROM ai_audits a
JOIN ai_models m ON a.modelId = m.id
WHERE (? = '' OR m.grade = ?)
  AND (? = '' OR a.status = ?)
  AND (? = '' OR LOWER(a.serviceName) LIKE ? OR LOWER(m.modelName) LIKE ? OR LOWER(m.provider) LIKE ? OR LOWER(a.memo) LIKE ?)
GROUP BY m.provider, m.grade
ORDER BY m.provider ASC, CASE m.grade WHEN 'Frontier' THEN 1 WHEN 'Standard' THEN 2 ELSE 3 END ASC;

-- name: findById
SELECT
  a.id,
  a.serviceName,
  a.modelId,
  a.billingCycle,
  a.contractFeeUsd,
  a.inputTokensM,
  a.outputTokensM,
  a.status,
  a.memo,
  m.provider,
  m.modelName,
  m.grade,
  m.inputPricePer1M,
  m.outputPricePer1M,
  (CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END) AS monthlySubCostUsd,
  (a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M) AS apiEquivalentUsd,
  ((a.inputTokensM * m.inputPricePer1M + a.outputTokensM * m.outputPricePer1M) - (CASE WHEN a.billingCycle = '年額' THEN a.contractFeeUsd / 12.0 WHEN a.billingCycle = '月額' THEN a.contractFeeUsd ELSE 0.0 END)) AS savingsUsd
FROM ai_audits a
JOIN ai_models m ON a.modelId = m.id
WHERE a.id = ?;

-- name: update
UPDATE ai_audits
SET serviceName = ?, modelId = ?, billingCycle = ?, contractFeeUsd = ?, inputTokensM = ?, outputTokensM = ?, status = ?, memo = ?
WHERE id = ?;

-- name: deleteById
DELETE FROM ai_audits
WHERE id = ?;
