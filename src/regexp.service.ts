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

    /**
     * get scheme from url.
     * @param url url as string
     * @returns https, ftp, telnet, scheme, anything.
     */
    getScheme(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const schemeRegExp = RegExp('^([a-z]+)://', 'g');
        return [...url.trim().matchAll(schemeRegExp)].at(0)?.at(1) ?? null;
    }

    getDomain(url: string) {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const domainRegExp = RegExp('(?:\\w?://)?(?:www.)?([^/]+)', 'ig');
        return [...url.trim().matchAll(domainRegExp)].at(0)?.at(1) ?? null;
    }

    getPathname(url: string) {
        const pathnameRegExp = RegExp('/([^?#]*)', 'ig');
        return [...url.trim().matchAll(pathnameRegExp)].at(0)?.at(1) ?? null;
    }
}
