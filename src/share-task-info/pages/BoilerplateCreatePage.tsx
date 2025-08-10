import React, { useState, useCallback } from "react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/headless/select";
import { Switch } from "@/shared/ui/switch";
import { X, Plus, Upload, Save, Copy, Check } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import HeadlessButton from "@/shared/headless/button";
import TokenInput from "@/shared/headless/token-input";

type SaveRequest = {
    text: string;
    title?: string;
    domain?: string;
    meta?: {
        stack?: string[];
        tags?: string[];
        version?: string;
        githubUrl?: string;
        dependencies?: string[];
        features?: string[];
        author?: string;
        isBoilerplate?: boolean;
        public?: boolean;
    };
};

const SUGGESTED_STACKS = [
    "React", "Next.js", "Vue", "Angular", "Svelte",
    "TypeScript", "JavaScript", "Node.js", "Express",
    "Tailwind CSS", "Shadcn/ui", "Material-UI", "Ant Design",
    "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Docker", "Kubernetes", "AWS", "Vercel",
];

const BoilerplateCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SaveRequest>({
        text: "",
        title: "",
        domain: "boilerplate",
        meta: {
            stack: [],
            tags: [],
            version: "1.0.0",
            githubUrl: "",
            dependencies: [],
            features: [],
            author: "",
            isBoilerplate: true,
            public: true,
        },
    });

    // local UI state
    const [featureInput, setFeatureInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // 기능
    const addFeature = () => {
        if (!featureInput.trim()) return;
        const cur = form.meta?.features || [];
        setForm({ ...form, meta: { ...form.meta, features: [...cur, featureInput.trim()] } });
        setFeatureInput("");
    };

    // 드래그 업로드
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragActive(false);
            const files = e.dataTransfer.files;
            if (!files.length) return;
            const file = files[0];
            if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
                const reader = new FileReader();
                reader.onload = (ev) => setForm({ ...form, text: (ev.target?.result as string) ?? "" });
                reader.readAsText(file);
            }
        },
        [form]
    );
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };
    const handleDragLeave = () => setIsDragActive(false);

    // 저장
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        try {
            setSaving(true);
            const response = await fetch("http://localhost:8080/api/vector/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (response.ok) {
                navigate({ to: "/boilerplate/list" });
            }
        } catch (err) {
            console.error("저장 실패:", err);
        } finally {
            setSaving(false);
        }
    };

    // 복사
    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(form, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="h-full flex flex-col">
            {/* 본문: 좌우 2열, 컬럼별 스크롤 */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-hidden p-2">
                    <div className="grid grid-cols-2 gap-2 h-full">
                        {/* Left column */}
                        <div className="min-h-0 overflow-auto space-y-2 pr-1">
                            {/* 기본 정보 */}
                            <Card>
                                <CardHeader className="py-1">
                                    <CardTitle className="text-sm">기본 정보</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="title" className="text-sm">
                                                제목 <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="title"
                                                value={form.title}
                                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                                placeholder="Next.js 15 + Shadcn Auth"
                                                required
                                                className="h-8"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="domain" className="text-sm">도메인</Label>
                                            <Select value={form.domain} onValueChange={(value) => setForm({ ...form, domain: value })}>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="도메인 선택" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="boilerplate">보일러플레이트</SelectItem>
                                                    <SelectItem value="template">템플릿</SelectItem>
                                                    <SelectItem value="starter">스타터킷</SelectItem>
                                                    <SelectItem value="example">예제</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* 기술 스택 (토큰 입력) */}
                                    <div>
                                        <Label className="text-sm">기술 스택</Label>
                                        <TokenInput
                                            value={form.meta?.stack ?? []}
                                            onChange={(tokens) => setForm({ ...form, meta: { ...form.meta, stack: tokens } })}
                                            placeholder="React, Next.js, TypeScript..."
                                            suggestions={SUGGESTED_STACKS}
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* 태그 (토큰 입력) */}
                                    <div>
                                        <Label className="text-sm">태그</Label>
                                        <TokenInput
                                            value={form.meta?.tags ?? []}
                                            onChange={(tokens) => setForm({ ...form, meta: { ...form.meta, tags: tokens } })}
                                            placeholder="auth, dashboard..."
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="version" className="text-sm">버전</Label>
                                            <Input
                                                id="version"
                                                value={form.meta?.version}
                                                onChange={(e) => setForm({ ...form, meta: { ...form.meta, version: e.target.value } })}
                                                placeholder="1.0.0"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    id="isBoilerplate"
                                                    checked={!!form.meta?.isBoilerplate}
                                                    onCheckedChange={(v: boolean) =>
                                                        setForm({ ...form, meta: { ...form.meta, isBoilerplate: v } })
                                                    }
                                                />
                                                <Label htmlFor="isBoilerplate" className="text-sm">보일러플레이트로 등록</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`relative border rounded-md p-2 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-input"}`}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                    >
                                        <Label htmlFor="text" className="text-sm">
                                            설명/요약 <span className="text-red-500">*</span>
                                            <span className="text-xs text-gray-500 ml-1">(README 파일 드래그 가능)</span>
                                        </Label>
                                        <Textarea
                                            id="text"
                                            value={form.text}
                                            onChange={(e) => setForm({ ...form, text: e.target.value })}
                                            placeholder="README 요약, 사용법, 핵심 기능 등을 입력하세요..."
                                            rows={8}
                                            required
                                            className="mt-1 text-sm resize-none"
                                        />
                                        {isDragActive && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-100/90 rounded-md">
                                                <div className="text-center">
                                                    <Upload className="h-5 w-5 text-blue-600 mx-auto" />
                                                    <span className="text-xs text-blue-600">파일을 놓으세요</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column */}
                        <div className="min-h-0 overflow-auto space-y-2 pl-1">
                            {/* 상세 정보 */}
                            <Card>
                                <CardHeader className="py-1">
                                    <CardTitle className="text-sm">상세 정보</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label htmlFor="githubUrl" className="text-sm">GitHub URL</Label>
                                            <Input
                                                id="githubUrl"
                                                value={form.meta?.githubUrl}
                                                onChange={(e) => setForm({ ...form, meta: { ...form.meta, githubUrl: e.target.value } })}
                                                placeholder="https://github.com/user/repo"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="author" className="text-sm">작성자</Label>
                                            <Input
                                                id="author"
                                                value={form.meta?.author}
                                                onChange={(e) => setForm({ ...form, meta: { ...form.meta, author: e.target.value } })}
                                                placeholder="이름 또는 GitHub ID"
                                                className="h-8 text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm">주요 기능</Label>
                                        <div className="flex gap-2 mt-1">
                                            <Input
                                                value={featureInput}
                                                onChange={(e) => setFeatureInput(e.target.value)}
                                                placeholder="기능 입력"
                                                className="h-8 text-sm"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addFeature();
                                                    }
                                                }}
                                            />
                                            <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {!!form.meta?.features?.length && (
                                            <div className="mt-2 space-y-1 max-h-36 overflow-y-auto">
                                                {form.meta!.features!.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-xs bg-gray-50 p-1 rounded">
                                                        <span>• {feature}</span>
                                                        <X
                                                            className="h-3 w-3 cursor-pointer text-gray-500 hover:text-red-500 ml-auto"
                                                            onClick={() =>
                                                                setForm({
                                                                    ...form,
                                                                    meta: {
                                                                        ...form.meta,
                                                                        features: form.meta?.features?.filter((_, i) => i !== idx) ?? [],
                                                                    },
                                                                })
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div className="flex items-start gap-2">
                                            <div>
                                                <Label htmlFor="publicFlag" className="text-sm font-medium">공개 설정</Label>
                                                <p className="text-xs text-gray-600">다른 사용자들이 볼 수 있습니다</p>
                                            </div>
                                        </div>
                                        <Switch
                                            id="publicFlag"
                                            checked={!!form.meta?.public}
                                            onCheckedChange={(v: boolean) => setForm({ ...form, meta: { ...form.meta, public: v } })}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 우측 하단 액션 (상단 버튼 이동) */}
                            <div className="sticky bottom-2 pr-1">
                                <div className="ml-auto flex justify-end gap-2">
                                    <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
                                        미리보기
                                    </Button>
                                    <Button type="button" variant="outline" size="sm" onClick={copyToClipboard} title="폼 데이터를 JSON으로 복사">
                                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                    <HeadlessButton
                                        onClick={() => handleSubmit()}
                                        loading={saving}
                                        className="h-8 px-3 bg-primary text-white"
                                        aria-label="저장"
                                        title="저장"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span className="text-sm">저장</span>
                                    </HeadlessButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 액션 바 (컴팩트) */}
                <div className="sticky bottom-0 border-t bg-white p-2 flex gap-2">
                    <Button type="button" variant="outline" onClick={() => navigate({ to: "/boilerplate/list" })}>
                        취소
                    </Button>
                    <HeadlessButton
                        onClick={() => handleSubmit()}
                        loading={saving}
                        className="flex-1 h-9 bg-primary text-white"
                        aria-label="저장하기"
                        title="저장하기"
                    >
                        <Save className="h-4 w-4" />
                        저장하기
                    </HeadlessButton>
                </div>
            </div>

            {/* 미리보기 모달 */}
            {previewOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
                    onClick={() => setPreviewOpen(false)}
                >
                    <div className="bg-white rounded-md shadow-xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                            <h3 className="font-semibold">미리보기</h3>
                            <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
                                닫기
                            </Button>
                        </div>
                        <div className="p-4">
                            <Card>
                                <CardContent className="pt-4">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-lg">{form.title || "제목을 입력하세요"}</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {form.text || "설명을 입력하세요"}
                                        </p>
                                        {!!form.meta?.stack?.length && (
                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-1">기술 스택</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {form.meta!.stack!.map((s) => (
                                                        <Badge key={s} variant="secondary" className="text-xs py-0 h-5">
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {!!form.meta?.tags?.length && (
                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-1">태그</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {form.meta!.tags!.map((t) => (
                                                        <span key={t} className="text-xs text-blue-600">#{t}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {!!form.meta?.features?.length && (
                                            <div>
                                                <div className="text-xs font-medium text-gray-700 mb-1">주요 기능</div>
                                                <div className="space-y-1">
                                                    {form.meta!.features!.map((f, i) => (
                                                        <div key={i} className="text-xs text-gray-700">• {f}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                                            <span>{form.meta?.version || "1.0.0"}</span>
                                            <span>{form.meta?.author || "작성자 미입력"}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoilerplateCreatePage;