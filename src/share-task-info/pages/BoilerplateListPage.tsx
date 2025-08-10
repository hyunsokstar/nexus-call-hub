import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Search, Plus, Filter } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const BoilerplateListPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">보일러플레이트 목록</h1>
                    <p className="text-gray-600 mt-1">저장된 보일러플레이트를 검색하고 관리하세요</p>
                </div>
                <Button onClick={() => navigate({ to: '/boilerplate/create' })}>
                    <Plus className="h-4 w-4 mr-2" />
                    새 보일러플레이트
                </Button>
            </div>

            {/* 검색 및 필터 */}
            <Card>
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

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-lg">Express API 서버</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                            RESTful API 서버 보일러플레이트
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                            <Badge variant="outline" className="text-xs">Node.js</Badge>
                            <Badge variant="outline" className="text-xs">Express</Badge>
                            <Badge variant="outline" className="text-xs">MongoDB</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>2024.03.08</span>
                            <span>v1.2.3</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default BoilerplateListPage;