/**
 * AlvaAR座標系 → Three.js座標系 変換コネクター
 * 既存 assets/alva_ar_three.js のTypeScript変換
 */
import * as THREE from 'three';
import type { IMUOrientation } from './AlvaARLoader';

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

/**
 * AlvaAR 平面行列を { position, quaternion } に変換する（applyPlaneMatrix の分解版）。
 * LERP スムージングのために直接適用せず値だけ取り出したい場合に使う。
 */
export function parsePlaneMatrix(matrix: Float32Array): {
    position: THREE.Vector3;
    quaternion: THREE.Quaternion;
} {
    const m = new THREE.Matrix4().fromArray(matrix);
    const r = new THREE.Quaternion().setFromRotationMatrix(m);
    return {
        position:   new THREE.Vector3(matrix[12], -matrix[13], -matrix[14]),
        quaternion: new THREE.Quaternion(-r.x, r.y, r.z, r.w),
    };
}

/**
 * IMUフォールバック: findPlane() が失敗したとき、
 * カメラ前方投影で仮想配置座標を計算して mesh に適用する。
 * @param betaDeg DeviceOrientationEvent の絶対 beta 角度（度）。0=水平、90=垂直。
 */
export function applyIMUFallbackPlacement(
    camera: THREE.Camera,
    mesh: THREE.Mesh,
    betaDeg: number = 60,
): void {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    // beta: 20°→距離80、beta: 90°→距離50（Three.js スケール 100 ≈ 1m）
    const clampedBeta = Math.max(20, Math.min(betaDeg, 90));
    const distance = 80 - (clampedBeta - 20) * (30 / 70);
    mesh.position.copy(camera.position).addScaledVector(forward, distance);
    mesh.quaternion.identity();
    mesh.rotateX(-Math.PI / 2);
}

/**
 * DeviceOrientationEvent の alpha/beta/gamma を
 * AlvaAR が期待する { w, x, y, z } クォータニオンに変換する。
 * ZXY オイラー順（デバイス向き標準）
 */
export function deviceOrientationToQuaternion(
    alpha: number,
    beta: number,
    gamma: number,
): IMUOrientation {
    const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(beta),
        THREE.MathUtils.degToRad(alpha),
        THREE.MathUtils.degToRad(gamma),
        'ZXY',
    );
    const q = new THREE.Quaternion().setFromEuler(euler);
    return { w: q.w, x: q.x, y: q.y, z: q.z };
}
