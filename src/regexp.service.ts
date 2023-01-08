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
        const scheme = RegExp('[a-z]://', 'ig');
        return url.search(scheme);
    }
}
