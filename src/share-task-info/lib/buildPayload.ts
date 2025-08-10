import { SaveRequest } from "../types";

export type BackendSaveRequest = {
    text: string;
    title?: string;
    domain?: string;
    meta: Record<string, unknown>;
};

const isEmpty = (v: any) =>
    v === undefined ||
    v === null ||
    (typeof v === "string" && v.trim() === "") ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

// 얕은/중첩 값 정리
function prune<T>(obj: T): T {
    if (Array.isArray(obj)) {
        // @ts-ignore
        return obj.filter((v) => !isEmpty(v)).map(prune);
    }
    if (typeof obj === "object" && obj) {
        const out: Record<string, unknown> = {};
        Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => {
            const pv = prune(v as any);
            if (!isEmpty(pv)) out[k] = pv;
        });
        // @ts-ignore
        return out;
    }
    // @ts-ignore
    return obj;
}

export function buildPayload(form: SaveRequest): BackendSaveRequest {
    const fe = form.meta?.frontend ?? [];
    const be = form.meta?.backend ?? [];
    const dv = form.meta?.devops ?? [];
    const merged = [...fe, ...be, ...dv];

    const meta = prune({
        isBoilerplate: form.meta?.isBoilerplate ?? form.domain === "boilerplate",
        public: form.meta?.public ?? true,
        tags: form.meta?.tags ?? [],
        author: form.meta?.author,
        repoUrl: form.meta?.githubUrl,
        dependencies: form.meta?.dependencies ?? [],
        features: form.meta?.features ?? [],
        stack: merged,
        stacks: {
            frontend: fe,
            backend: be,
            devops: dv,
        },
    });

    return prune({
        text: form.text,
        title: form.title,
        domain: form.domain || "boilerplate",
        meta,
    }) as BackendSaveRequest;
}