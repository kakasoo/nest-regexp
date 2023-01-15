import { Injectable } from '@nestjs/common';
import { RegExpBuilder } from 'regexp-manager';

@Injectable()
export class RegExpService {
    /**
     * note : regular expression functions
     */
    getUntilPathname(originalUrl: string) {
        return originalUrl.split('#')?.at(0)?.split('?').at(0) || '';
    }

    analizeUrl(url: string): { scheme: string; domain: string; pathname: string; queryString: string } {
        return {
            scheme: this.getScheme(url) || null,
            domain: this.getDomain(url) || null,
            pathname: this.getPathname(url) || null,
            queryString: '', // TODO
        };
    }

    /**
     * get scheme from url.
     * @param url url as string
     * @returns https, ftp, telnet, scheme, anything.
     */
    getScheme(url: string): string {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const schemeRegExp = RegExp('^([a-z]+)://', 'g');
        return this.getExactMatched(url.trim(), schemeRegExp);
    }

    getDomain(url: string): string {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const domainRegExp = RegExp('(?:\\w?://)?(?:www.)?([^/]+)', 'ig');
        return this.getExactMatched(url.trim(), domainRegExp);
    }

    getPathname(url: string): string {
        if (!url || typeof url !== 'string') {
            return null;
        }

        const pathnameRegExp = RegExp('/([^?#]*)', 'ig');
        return this.getExactMatched(url.trim(), pathnameRegExp);
    }

    /**
     *
     * @param startString first string to make regexp
     * @returns
     */
    createRegExpBuilder(startString?: string) {
        return new RegExpBuilder(startString);
    }

    private getExactMatched(str: string, regExp: RegExp) {
        /**
         * example regexp : /\/([^?#]*)/gi
         * example input  : 'www.example.com/abcd/efg?q1=a&q2=b'
         *
         * [
         *      [
         *          '/abcd/efg',                                    // matched string but include non-capturing groups
         *          'abcd/efg',                                     // here! this is exact matched!
         *          index: 15,
         *          input: 'www.example.com/abcd/efg?q1=a&q2=b',
         *          groups: undefined
         *      ]
         *
         * ]
         */

        // TODO : if there are too many capturing groups, so? need to test.
        return [...str.matchAll(regExp)].at(0)?.at(1) ?? null;
    }
}
