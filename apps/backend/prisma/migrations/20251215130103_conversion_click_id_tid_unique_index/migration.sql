drop index "conversion_clickId_tid_key";

CREATE UNIQUE INDEX "conversion_clickId_tid_key"
    ON conversion ("clickId", tid)
    NULLS NOT DISTINCT;