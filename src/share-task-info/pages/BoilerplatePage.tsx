import React, { useState, useCallback } from "react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/headless/select";
import { Switch } from "@/shared/ui/switch";
// 커스텀 Headless Tabs 컴포넌트로 교체
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/headless/tabs';
import {
    X,
    Plus,
    Upload,
    Eye,
    Save,
    Sparkles,
    Copy,
    Check,
    Search,
    Filter,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

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
    };
};

// 자주 사용되는 기술 스택 (추천용)
const SUGGESTED_STACKS = [
    "React", "Next.js", "Vue", "Angular", "Svelte",
    "TypeScript", "JavaScript", "Node.js", "Express",
    "Tailwind CSS", "Shadcn/ui", "Material-UI", "Ant Design",
    "PostgreSQL", "MySQL", "MongoDB", "Redis",
    "Docker", "Kubernetes", "AWS", "Vercel",
];

// 보일러플레이트 템플릿
const TEMPLATES = {
    nextAuth: {
        title: "Next.js + Auth 보일러플레이트",
        text: "Next.js 15와 NextAuth.js를 사용한 인증 보일러플레이트입니다.\n\n주요 기능:\n- 소셜 로그인 (Google, GitHub)\n- JWT/Session 관리\n- 미들웨어 기반 라우트 보호",
        stack: ["Next.js", "TypeScript", "NextAuth.js", "Tailwind CSS"],
        tags: ["authentication", "full-stack", "production-ready"],
    },
    adminDashboard: {
        title: "Admin Dashboard 템플릿",
        text: "React + TypeScript 기반 관리자 대시보드 템플릿입니다.\n\n포함 기능:\n- 차트 및 통계\n- 테이블 관리\n- 다크모드 지원",
        stack: ["React", "TypeScript", "Recharts", "Tailwind CSS"],
        tags: ["dashboard", "admin", "charts"],
    },
    apiServer: {
        title: "Node.js API 서버 보일러플레이트",
        text: "Express + TypeScript 기반 REST API 서버입니다.\n\n특징:\n- JWT 인증\n- Swagger 문서화\n- Docker 지원",
        stack: ["Node.js", "Express", "TypeScript", "PostgreSQL"],
        tags: ["backend", "api", "rest"],
    },
};

const BoilerplateForm: React.FC<{ onSubmit: (data: SaveRequest) => void }> = ({
    onSubmit,
}) => {
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
        },
    });

    const [stackInput, setStackInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    // 템플릿 적용
    const applyTemplate = (templateKey: keyof typeof TEMPLATES) => {
        const template = TEMPLATES[templateKey];
        setForm({
            ...form,
            title: template.title,
            text: template.text,
            meta: {
                ...form.meta,
                stack: template.stack,
                tags: template.tags,
            },
        });
    };

    // 기술 스택 추가 (직접 입력)
    const addStack = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && stackInput.trim()) {
            e.preventDefault();
            const currentStack = form.meta?.stack || [];
            if (!currentStack.includes(stackInput.trim())) {
                setForm({
                    ...form,
                    meta: { ...form.meta, stack: [...currentStack, stackInput.trim()] },
                });
            }
            setStackInput("");
        }
    };

    // 추천 스택 추가 (클릭)
    const addSuggestedStack = (stack: string) => {
        const currentStack = form.meta?.stack || [];
        if (!currentStack.includes(stack)) {
            setForm({
                ...form,
                meta: { ...form.meta, stack: [...currentStack, stack] },
            });
        }
    };

    // 기술 스택 제거
    const removeStack = (stack: string) => {
        setForm({
            ...form,
            meta: {
                ...form.meta,
                stack: form.meta?.stack?.filter((s) => s !== stack) || [],
            },
        });
    };

    // 태그 추가
    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            const currentTags = form.meta?.tags || [];
            if (!currentTags.includes(tagInput.trim())) {
                setForm({
                    ...form,
                    meta: { ...form.meta, tags: [...currentTags, tagInput.trim()] },
                });
            }
            setTagInput("");
        }
    };

    // 태그 제거
    const removeTag = (tag: string) => {
        setForm({
            ...form,
            meta: {
                ...form.meta,
                tags: form.meta?.tags?.filter((t) => t !== tag) || [],
            },
        });
    };

    // 기능 추가
    const addFeature = () => {
        if (featureInput.trim()) {
            const currentFeatures = form.meta?.features || [];
            setForm({
                ...form,
                meta: { ...form.meta, features: [...currentFeatures, featureInput.trim()] },
            });
            setFeatureInput("");
        }
    };

    // 드래그 앤 드롭 핸들러
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragActive(false);

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setForm({ ...form, text: (event.target?.result as string) ?? "" });
                    };
                    reader.readAsText(file);
                }
            }
        },
        [form]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    // 클립보드 복사
    const copyToClipboard = () => {
        const formattedData = JSON.stringify(form, null, 2);
        navigator.clipboard.writeText(formattedData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="space-y-4 pb-8"> {/* 하단 패딩 추가 */}
            {/* 템플릿 선택 */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        빠른 템플릿
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    {Object.keys(TEMPLATES).map((key) => (
                        <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            onClick={() => applyTemplate(key as keyof typeof TEMPLATES)}
                        >
                            {TEMPLATES[key as keyof typeof TEMPLATES].title.split(" ")[0]}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            <Card className="min-h-[600px]">
                <CardHeader>
                    <CardTitle>보일러플레이트 정보 입력</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 커스텀 Headless Tabs 사용 */}
                        <Tabs defaultValue="basic" className="w-full">
                            <TabsList>
                                <TabsTrigger value="basic">기본 정보</TabsTrigger>
                                <TabsTrigger value="tech">기술 스택</TabsTrigger>
                                <TabsTrigger value="details">상세 정보</TabsTrigger>
                            </TabsList>

                            <TabsContent value="basic" className="space-y-4">
                                <div>
                                    <Label htmlFor="title">
                                        제목 <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        placeholder="예: Next.js 15 + Shadcn Auth 보일러플레이트"
                                        required
                                    />
                                </div>

                                <div
                                    className={`relative border rounded-md p-1 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-input"
                                        }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <Label htmlFor="text">
                                        설명/요약 <span className="text-red-500">*</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            (README 파일을 드래그하여 업로드 가능)
                                        </span>
                                    </Label>
                                    <Textarea
                                        id="text"
                                        value={form.text}
                                        onChange={(e) => setForm({ ...form, text: e.target.value })}
                                        placeholder="README 요약, 사용법, 핵심 기능 등을 입력하세요..."
                                        rows={12}
                                        required
                                    />
                                    {isDragActive && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-blue-100/90 rounded-md">
                                            <Upload className="h-8 w-8 text-blue-600" />
                                            <span className="ml-2 text-blue-600">파일을 여기에 놓으세요</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="domain">도메인</Label>
                                    <Select
                                        value={form.domain}
                                        onValueChange={(value) => setForm({ ...form, domain: value })}
                                    >
                                        <SelectTrigger>
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
                            </TabsContent>

                            <TabsContent value="tech" className="space-y-4">
                                {/* 기술 스택 직접 입력 */}
                                <div>
                                    <Label htmlFor="stack">기술 스택 (Enter로 추가)</Label>
                                    <Input
                                        id="stack"
                                        value={stackInput}
                                        onChange={(e) => setStackInput(e.target.value)}
                                        onKeyDown={addStack}
                                        placeholder="기술 스택 입력 후 Enter (예: React, Next.js)"
                                    />

                                    {/* 현재 추가된 스택 표시 */}
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {form.meta?.stack?.map((stack) => (
                                            <Badge key={stack} variant="default" className="gap-1">
                                                {stack}
                                                <X
                                                    className="h-3 w-3 cursor-pointer hover:text-red-200"
                                                    onClick={() => removeStack(stack)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* 추천 기술 스택 */}
                                <div>
                                    <Label className="text-sm text-gray-600">추천 기술 스택 (클릭하여 추가)</Label>
                                    <div className="mt-2 flex flex-wrap gap-2 p-3 bg-gray-50 border rounded-lg">
                                        {SUGGESTED_STACKS
                                            .filter(stack => !form.meta?.stack?.includes(stack))
                                            .map((stack) => (
                                                <Badge
                                                    key={stack}
                                                    variant="outline"
                                                    className="cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => addSuggestedStack(stack)}
                                                >
                                                    {stack}
                                                </Badge>
                                            ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="tags">태그 (Enter로 추가)</Label>
                                    <Input
                                        id="tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={addTag}
                                        placeholder="태그 입력 후 Enter"
                                    />
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {form.meta?.tags?.map((tag) => (
                                            <Badge key={tag} variant="secondary">
                                                {tag}
                                                <X
                                                    className="h-3 w-3 ml-1 cursor-pointer"
                                                    onClick={() => removeTag(tag)}
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="version">버전</Label>
                                    <Input
                                        id="version"
                                        value={form.meta?.version}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                meta: { ...form.meta, version: e.target.value },
                                            })
                                        }
                                        placeholder="1.0.0"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-4">
                                <div>
                                    <Label htmlFor="githubUrl">GitHub URL</Label>
                                    <Input
                                        id="githubUrl"
                                        value={form.meta?.githubUrl}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                meta: { ...form.meta, githubUrl: e.target.value },
                                            })
                                        }
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1 pr-4">
                                        <Label htmlFor="author">작성자</Label>
                                        <Input
                                            id="author"
                                            value={form.meta?.author}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    meta: { ...form.meta, author: e.target.value },
                                                })
                                            }
                                            placeholder="이름 또는 GitHub 아이디"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="publicFlag" className="mb-0">
                                            공개
                                        </Label>
                                        <Switch id="publicFlag" />
                                    </div>
                                </div>

                                <div>
                                    <Label>주요 기능</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            placeholder="기능 입력"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addFeature();
                                                }
                                            }}
                                        />
                                        <Button type="button" variant="outline" onClick={addFeature}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {form.meta?.features?.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                <span>• {feature}</span>
                                                <X
                                                    className="h-3 w-3 cursor-pointer text-gray-500 hover:text-red-500"
                                                    onClick={() => {
                                                        setForm({
                                                            ...form,
                                                            meta: {
                                                                ...form.meta,
                                                                features:
                                                                    form.meta?.features?.filter((_, i) => i !== idx) ??
                                                                    [],
                                                            },
                                                        });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* 버튼 영역 - 테두리 추가 */}
                        <div className="flex gap-2 pt-4 border-t bg-white sticky bottom-0 pb-4">
                            <Button
                                type="submit"
                                className="flex-1 border border-primary" // 테두리 추가
                            >
                                <Save className="h-4 w-4 mr-2" />
                                저장
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPreview(!showPreview)}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                미리보기
                            </Button>
                            <Button type="button" variant="outline" onClick={copyToClipboard}>
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* 미리보기 */}
            {showPreview && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">미리보기</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <h3 className="font-bold text-lg">
                                {form.title || "제목 없음"}
                            </h3>
                            <p className="text-gray-600 whitespace-pre-wrap">
                                {form.text || "내용 없음"}
                            </p>
                            {form.meta?.stack && form.meta.stack.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {form.meta.stack.map((s) => (
                                        <Badge key={s} variant="secondary" className="text-xs">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {form.meta?.tags && form.meta.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {form.meta.tags.map((t) => (
                                        <span key={t} className="text-xs text-blue-600">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

const BoilerplatePage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSubmit = async (data: SaveRequest) => {
        try {
            const response = await fetch("http://localhost:8080/api/vector/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("저장 성공:", data);
                // TODO: 성공 토스트 메시지
                // TODO: 폼 초기화 또는 목록 새로고침
            }
        } catch (error) {
            console.error("저장 실패:", error);
            // TODO: 에러 토스트 메시지
        }
    };

    return (
        <div className="flex h-full min-h-0">
            {/* 왼쪽: 입력 폼 */}
            <div className="w-1/2 max-w-2xl p-6 border-r bg-white overflow-y-auto min-h-0">
                <BoilerplateForm onSubmit={handleSubmit} />
            </div>

            {/* 오른쪽: 데이터 목록 */}
            <div className="flex-1 p-6 bg-gray-50 overflow-y-auto min-h-0">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">보일러플레이트 목록</h1>
                        <p className="text-gray-600 mt-1">저장된 보일러플레이트를 검색하고 관리하세요</p>
                    </div>
                    <Button onClick={() => navigate({ to: '/boilerplate' })}>
                        <Plus className="h-4 w-4 mr-2" />
                        새 보일러플레이트
                    </Button>
                </div>

                {/* 검색 및 필터 */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="제목, 태그, 기술 스택으로 검색..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                필터
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* 목록 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 임시 목록 아이템들 */}
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-lg">Next.js Auth 보일러플레이트</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                인증 기능이 포함된 Next.js 스타터
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                                <Badge variant="outline" className="text-xs">Next.js</Badge>
                                <Badge variant="outline" className="text-xs">TypeScript</Badge>
                                <Badge variant="outline" className="text-xs">NextAuth</Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>2024.03.15</span>
                                <span>v1.0.0</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader>
                            <CardTitle className="text-lg">React Dashboard 템플릿</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">
                                관리자 대시보드 UI 템플릿
                            </p>
                            <div className="flex flex-wrap gap-1 mb-4">
                                <Badge variant="outline" className="text-xs">React</Badge>
                                <Badge variant="outline" className="text-xs">TypeScript</Badge>
                                <Badge variant="outline" className="text-xs">Tailwind</Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>2024.03.10</span>
                                <span>v2.1.0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BoilerplatePage;