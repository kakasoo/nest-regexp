import { Injectable } from '@nestjs/common';

@Injectable()
export class RegExpService {
    constructor() {}

    /**
     * note : regular expression functions
     */
    getUntilPathname(originalUrl: string) {
        return originalUrl.split('#')?.at(0)?.split('?').at(0) || '';
    }

    analizeUrl(url: string) {}

    getScheme(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const schemeRegExp = RegExp('^[a-z]+://', 'ig');
        return url.trim().match(schemeRegExp)?.at(0)?.split('://')?.at(0) ?? null;
    }
}
