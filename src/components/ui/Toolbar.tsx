'use client'

import {useFurnitureStore} from '@/stores/furnitureStore'

const viewActions = [
    {id: 'reset-view', name: '시점 초기화', icon: '🔄'},
]

const sceneActions = [
    {id: 'save', name: '저장', icon: '💾'},
    {id: 'load', name: '불러오기', icon: '📁'},
    {id: 'reset', name: '전체 초기화', icon: '🗑️'},
]

export default function Toolbar() {
    const showGrid = useFurnitureStore((state) => state.editor.showGrid)
    const snapToGrid = useFurnitureStore((state) => state.editor.snapToGrid)
    const toggleGrid = useFurnitureStore((state) => state.toggleGrid)
    const toggleSnapToGrid = useFurnitureStore((state) => state.toggleSnapToGrid)
    const resetFurniture = useFurnitureStore((state) => state.reset)
    const resetView = useFurnitureStore((state) => state.resetView)

    const handleActionClick = (actionId: string) => {
        switch (actionId) {
            case 'save':
                console.log('Save functionality not implemented yet')
                break
            case 'load':
                console.log('Load functionality not implemented yet')
                break
            case 'reset':
                if (window.confirm('모든 가구를 삭제하시겠습니까?')) {
                    resetFurniture()
                }
                break
            case 'reset-view':
                resetView()
                break
        }
    }

    return (
        <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">조작 방법</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        <div>• 가구 클릭: 선택</div>
                        <div>• 가구 드래그: 이동</div>
                        <div>• 마우스 드래그: 시점 회전</div>
                        <div>• Shift + 마우스: 화면 이동</div>
                        <div>• 휠: 확대/축소</div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">표시 설정</h3>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showGrid}
                                onChange={toggleGrid}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-600">격자 표시</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={snapToGrid}
                                onChange={toggleSnapToGrid}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-600">격자 스냅</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">시점 조작</h3>
                    <div className="flex space-x-2">
                        {viewActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.id)}
                                className="p-2 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                title={action.name}
                            >
                                <span className="text-lg">{action.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">씬 관리</h3>
                    <div className="flex space-x-2">
                        {sceneActions.map((action) => (
                            <button
                                key={action.id}
                                onClick={() => handleActionClick(action.id)}
                                className="p-2 rounded text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                                title={action.name}
                            >
                                <span className="text-lg">{action.icon}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
