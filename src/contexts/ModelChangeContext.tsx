import { createContext } from 'react';
import type { ModelDisplaySettings } from '@/data/types';

type ModelInfo = {
    modelName?: string;
    modelPath?: string | undefined;
    modelDetail?: string | undefined;
    modelPrice?: string;
    displaySettings?: ModelDisplaySettings;
};

type ModelChangeContextType = {
    changeModel: (modelInfo: ModelInfo) => Promise<void>;
};

// デフォルトのchangeModel関数（何もしない）
const defaultChangeModel = async () => {
    console.warn("changeModel function was called without a Provider.");
};

export const ModelChangeContext = createContext<ModelChangeContextType>({
    changeModel: defaultChangeModel,
});
