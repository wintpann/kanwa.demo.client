declare module '*.svg' {
    import { FC, SVGAttributes } from 'react';

    export const ReactComponent: FC<SVGAttributes<SVGElement>>;
}