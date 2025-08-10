import React from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Save } from "lucide-react";
import type { BackendSaveRequest } from "../lib/buildPayload";
import { SaveRequest } from "../types";

type Props = {
    open: boolean;
    onClose: () => void;
    form: SaveRequest;
    payload: BackendSaveRequest;
};

const PreviewDialog: React.FC<Props> = ({ open, onClose, form, payload }) => {
    if (!open) return null;

    const json = JSON.stringify(payload, null, 2);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(json);
        } catch { }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-md shadow-xl max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <h3 className="font-semibold">미리보기</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copy}>JSON 복사</Button>
                        <Button variant="ghost" size="sm" onClick={onClose}>닫기</Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-4">
                    {/* 좌측: 내용 프리뷰 */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="space-y-3">
                                <h4 className="font-bold text-lg">{form.title || "제목을 입력하세요"}</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {form.text || "설명을 입력하세요"}
                                </p>

                                {(form.meta?.frontend?.length ?? 0) > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-700 mb-1">Frontend</div>
                                        <div className="flex flex-wrap gap-1">
                                            {form.meta!.frontend!.map((s) => (
                                                <Badge key={s} variant="secondary" className="text-xs py-0 h-5 bg-sky-100 text-sky-800">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(form.meta?.backend?.length ?? 0) > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-700 mb-1">Backend</div>
                                        <div className="flex flex-wrap gap-1">
                                            {form.meta!.backend!.map((s) => (
                                                <Badge key={s} variant="secondary" className="text-xs py-0 h-5 bg-emerald-100 text-emerald-800">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {(form.meta?.devops?.length ?? 0) > 0 && (
                                    <div>
                                        <div className="text-xs font-medium text-gray-700 mb-1">DevOps</div>
                                        <div className="flex flex-wrap gap-1">
                                            {form.meta!.devops!.map((s) => (
                                                <Badge key={s} variant="secondary" className="text-xs py-0 h-5 bg-violet-100 text-violet-800">
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

                                <div className="flex justify-end items-center text-xs text-gray-500 pt-2 border-t">
                                    <span>{form.meta?.author || "작성자 미입력"}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 우측: 전송 JSON */}
                    <Card>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">전송 데이터 (SaveRequest)</h4>
                                <div className="text-xs text-gray-500">domain: {payload.domain || "boilerplate"}</div>
                            </div>
                            <pre className="text-xs bg-gray-50 border rounded p-2 overflow-auto max-h-[60vh] whitespace-pre">
                                {json}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end gap-2 px-4 py-2 border-t">
                    <Button size="sm" variant="outline" onClick={onClose}>닫기</Button>
                    <Button size="sm">
                        <Save className="h-4 w-4 mr-1" />
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PreviewDialog;