/**
 * AlvaAR座標系 → Three.js座標系 変換コネクター
 * 既存 assets/alva_ar_three.js のTypeScript変換
 */
import * as THREE from 'three';

export type PoseApplier = (
    pose: Float32Array,
    rotationQuaternion: THREE.Quaternion | null,
    translationVector: THREE.Vector3 | null,
) => void;

/**
 * カメラポーズ変換関数を作成して返す
 * AlvaARの4x4ポーズ行列 → Three.jsのquaternion/positionに変換
 */
export function createPoseApplier(): PoseApplier {
    return (pose, rotationQuaternion, translationVector) => {
        const m = new THREE.Matrix4().fromArray(pose);
        const r = new THREE.Quaternion().setFromRotationMatrix(m);
        const t = new THREE.Vector3(pose[12], pose[13], pose[14]);

        if (rotationQuaternion !== null) {
            rotationQuaternion.set(-r.x, r.y, r.z, r.w);
        }
        if (translationVector !== null) {
            translationVector.set(t.x, -t.y, -t.z);
        }
    };
}

/**
 * 平面マトリックスをThree.jsのMeshに適用する
 * AlvaAR座標系 → Three.js座標系変換込み
 */
export function applyPlaneMatrix(matrix: Float32Array, mesh: THREE.Mesh): void {
    const m = new THREE.Matrix4().fromArray(matrix);
    const r = new THREE.Quaternion().setFromRotationMatrix(m);
    const t = new THREE.Vector3(matrix[12], matrix[13], matrix[14]);

    // AlvaAR -> THREE.js 座標系変換
    mesh.quaternion.set(-r.x, r.y, r.z, r.w);
    mesh.position.set(t.x, -t.y, -t.z);
}
