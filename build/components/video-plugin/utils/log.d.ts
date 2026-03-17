export declare const log: {
    success: (...args: any[]) => void;
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (error: any) => void;
    json: (...args: any[]) => void;
    tag: (tag: string, type: `success` | `info` | `error` | `warn`) => (...args: any[]) => void;
};
