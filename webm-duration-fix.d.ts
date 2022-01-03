export interface FixWebmDurationFunction {
    (blob: Blob): Promise<Blob>;
}

declare const fixWebmDuration: FixWebmDurationFunction;
export default fixWebmDuration;