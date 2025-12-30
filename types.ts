
export enum CompositionGrid {
  NONE = '无',
  THIRDS = '三分法',
  CENTER = '中心构图',
  GOLDEN = '黄金螺旋'
}

export enum CameraMovement {
  FREE = '自由视角',
  DOLLY = '推拉',
  ZOOM = '变焦',
  DOLLY_ZOOM = '希区柯克变焦'
}

export interface LightConfig {
  id: string;
  name: string;
  enabled: boolean;
  color: string;
  intensity: number;
  position: [number, number, number];
  type: 'point' | 'spot' | 'directional';
}

export interface SceneState {
  cameraDistance: number;
  cameraHeight: number;
  cameraFOV: number;
  gridType: CompositionGrid;
  lights: LightConfig[];
  subjectAction: 'idle' | 'pose1' | 'pose2';
}
